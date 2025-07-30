
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Palette, Gem, Download, Sparkles, Loader, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { GenerateBMCOutput } from '@/ai/flows/generate-bmc';
import { getAIImprovementSuggestions, GetAIImprovementSuggestionsOutput } from '@/ai/flows/improve-bmc';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


type BmcData = GenerateBMCOutput & { businessDescription?: string };

const initialColors = {
    primary: '#09f',
    card: '#192a41',
    background: '#000987',
    foreground: '#f0f8ff',
}

const BmcBlock = ({ title, content, className, style }: { title: string, content: string, className?: string, style?: React.CSSProperties }) => (
    <div className={cn("p-4 rounded-lg flex flex-col min-h-[140px]", className)} style={{ backgroundColor: 'var(--theme-card)', color: 'var(--theme-foreground)', ...style }}>
        <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--theme-primary)' }}>
            {title.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </h3>
        <p className="text-xs whitespace-pre-wrap flex-grow">{content}</p>
    </div>
);


export default function PreviewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasId = searchParams.get('canvasId');
  const { toast } = useToast();

  const [bmcData, setBmcData] = useState<BmcData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<GetAIImprovementSuggestionsOutput | null>(null);

  const [colors, setColors] = useState(initialColors);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!user) {
        router.push('/login');
        return;
    }
    if (!canvasId) {
        toast({ title: "Error", description: "No canvas ID provided.", variant: "destructive" });
        router.push('/my-canvases');
        return;
    }

    const loadCanvasData = async () => {
        setIsLoading(true);
        try {
            const canvasDocRef = doc(db, 'users', user.uid, 'canvases', canvasId);
            const canvasDoc = await getDoc(canvasDocRef);

            if (canvasDoc.exists()) {
                setBmcData(canvasDoc.data() as BmcData);
            } else {
                toast({ title: "Error", description: "Canvas not found.", variant: "destructive" });
                router.push('/my-canvases');
            }
        } catch (error) {
            console.error("Error loading canvas:", error);
            toast({ title: "Error", description: "Failed to load canvas data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    loadCanvasData();
  }, [canvasId, user, router, toast]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogoUrl(URL.createObjectURL(file));
    }
  };
  
  const handleColorChange = (key: keyof typeof colors, value: string) => {
    setColors(prev => ({...prev, [key]: value}));
  };
  
  const handleGetSuggestions = async () => {
    if (!bmcData) return;
    setIsGettingSuggestions(true);
    try {
      const bmcSections: Partial<BmcData> = { ...bmcData };
      delete bmcSections.businessDescription;
      delete (bmcSections as any).createdAt;
      delete (bmcSections as any).userId;
      
      const result = await getAIImprovementSuggestions({
        bmcData: bmcSections as Record<string, string>,
        businessDescription: bmcData.businessDescription || '',
      });
      setSuggestions(result);
    } catch (error) {
      console.error("Error getting suggestions:", error);
      toast({ title: "AI Error", description: "Could not get suggestions.", variant: "destructive" });
    } finally {
      setIsGettingSuggestions(false);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    toast({ title: "Generating PDF...", description: "Please wait a moment." });

    html2canvas(canvasRef.current, { 
      useCORS: true,
      backgroundColor: colors.background,
      scale: 2,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`innocanvas-${canvasId}.pdf`);
      toast({ title: "Download Complete!", description: "Your PDF has been saved." });
    }).catch(err => {
      console.error("Error generating PDF:", err);
      toast({ title: "Export Error", description: "Failed to create PDF.", variant: "destructive" });
    }).finally(() => {
      setIsDownloading(false);
    });
  };

  const canvasStyle = {
    '--theme-primary': colors.primary,
    '--theme-card': colors.card,
    '--theme-background': colors.background,
    '--theme-foreground': colors.foreground,
  } as React.CSSProperties;

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!bmcData) {
     return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background">
            <p>Canvas data could not be loaded.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col" style={{ backgroundColor: colors.background }}>
       <header className="p-4 flex justify-start">
         <Link href="/my-canvases">
            <Button variant="secondary"><ArrowLeft className="mr-2"/>Back to My Canvases</Button>
         </Link>
       </header>
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 p-8 pt-0">
        {/* Left Column: Branding Controls */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="card-glass p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">Branding</h2>
            <div className="space-y-6">
              <div>
                <Label className="font-semibold text-lg mb-2 block text-foreground">Logo</Label>
                <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                <Button asChild variant="outline">
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <Upload className="mr-2"/>
                    Upload Logo
                  </label>
                </Button>
              </div>
              <div>
                 <Label className="font-semibold text-lg mb-2 block text-foreground">Color Theme</Label>
                 <div className="grid grid-cols-2 gap-4">
                    {Object.entries(colors).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-1">
                            <Label htmlFor={`color-${key}`} className="text-sm capitalize">{key}</Label>
                            <div className="relative">
                                <input type="color" id={`color-${key}`} value={value} onChange={(e) => handleColorChange(key as keyof typeof colors, e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                                <div className="h-10 w-full rounded-md border border-border" style={{ backgroundColor: value }} />
                            </div>
                        </div>
                    ))}
                 </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="remove-watermark" className="font-semibold text-lg flex items-center gap-2">
                  <Gem className="text-vivid-pink" /> Remove Watermark
                </Label>
                <div className='flex items-center gap-2'>
                    <Badge variant="outline" className='border-vivid-pink text-vivid-pink'>PRO</Badge>
                    <Switch id="remove-watermark" checked={removeWatermark} onCheckedChange={setRemoveWatermark}/>
                </div>
              </div>
            </div>
          </div>
           <div className="card-glass p-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2"><Sparkles className='text-peach'/> AI Suggestions</h2>
                <p className='text-muted-foreground mb-4'>Let our AI analyze your canvas and provide actionable feedback to strengthen your business model.</p>
                <Button variant='secondary' onClick={handleGetSuggestions} disabled={isGettingSuggestions}>
                    {isGettingSuggestions ? <Loader className="mr-2 animate-spin"/> : null}
                    Get Feedback
                </Button>
           </div>
        </div>

        {/* Right Column: Canvas Preview */}
        <div className="lg:col-span-3 rounded-2xl p-6 flex items-center justify-center" style={canvasStyle}>
           <div ref={canvasRef} className="aspect-[1.618] w-full max-w-7xl grid grid-cols-5 gap-2 p-4 rounded-xl relative" style={{ backgroundColor: 'var(--theme-card)'}}>
              
                {/* Top Row */}
                 <div className="lg:col-span-1 flex flex-col gap-2">
                    <div className="h-1/4">
                       {logoUrl && <Image src={logoUrl} alt="Logo" width={80} height={30} className="object-contain" />}
                    </div>
                    <BmcBlock title="Key Partners" content={bmcData.keyPartnerships} className='h-3/4'/>
                 </div>

                <div className="lg:col-span-1 grid grid-rows-2 gap-2">
                    <BmcBlock title="Key Activities" content={bmcData.keyActivities} />
                    <BmcBlock title="Key Resources" content={bmcData.keyResources} />
                </div>
                <BmcBlock title="Value Propositions" content={bmcData.valuePropositions} />
                <div className="lg:col-span-1 grid grid-rows-2 gap-2">
                     <BmcBlock title="Customer Relationships" content={bmcData.customerRelationships} />
                     <BmcBlock title="Channels" content={bmcData.channels} />
                </div>
                <BmcBlock title="Customer Segments" content={bmcData.customerSegments} />

                {/* Bottom Row */}
                <BmcBlock title="Cost Structure" content={bmcData.costStructure} className="lg:col-span-2" />
                <BmcBlock title="Revenue Streams" content={bmcData.revenueStreams} className="lg:col-span-3" />

                 {!removeWatermark && (
                    <div className='absolute bottom-4 right-4 text-xs' style={{ color: 'var(--theme-foreground)', opacity: 0.5}}>
                        Powered by InnoCanvas
                    </div>
                )}
           </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 mt-auto p-4">
        <div className="card-glass max-w-2xl mx-auto rounded-full p-4">
            <div className="flex items-center justify-center">
                 <Button size="lg" variant="gradient" className='breathing-cta' onClick={handleDownload} disabled={isDownloading}>
                    {isDownloading ? <Loader className="mr-2 animate-spin"/> : <Download className='mr-2'/>}
                    Download Deck
                 </Button>
            </div>
        </div>
      </footer>
      
      {/* AI Suggestions Dialog */}
      <AlertDialog open={!!suggestions} onOpenChange={() => setSuggestions(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'><Sparkles className='text-peach' /> AI Suggestions</AlertDialogTitle>
            <AlertDialogDescription>
              Here are some suggestions to improve your Business Model Canvas:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-80 overflow-y-auto pr-4">
            <ul className="space-y-3 list-disc list-inside text-sm text-foreground/90">
                {suggestions?.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSuggestions(null)}>Got it, thanks!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    