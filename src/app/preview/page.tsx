
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Palette, Gem, Download, Sparkles, Loader } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
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
      const bmcSections = { ...bmcData };
      delete bmcSections.businessDescription;

      const result = await getAIImprovementSuggestions({
        bmcData: bmcSections,
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
  
  const bmcBlocks = Object.entries(bmcData).filter(([key]) => key !== 'businessDescription' && key !== 'createdAt' && key !== 'userId');


  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col" style={{ backgroundColor: colors.background }}>
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 p-8">
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
                 {logoUrl && <Image src={logoUrl} alt="Uploaded logo" width={100} height={40} className="mt-4 rounded-lg object-contain" />}
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
        <div className="lg:col-span-3 rounded-2xl p-6" style={canvasStyle}>
           <div ref={canvasRef} className="grid grid-cols-5 gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-card)'}}>
              {/* Logo block */}
              <div className={cn( "p-4 rounded-lg flex items-center justify-center", "col-span-1" )} style={{ backgroundColor: 'var(--theme-background)' }}>
                {logoUrl ? <Image src={logoUrl} alt="Logo" width={120} height={50} className="object-contain" /> : <span className="text-sm text-muted-foreground">Your Logo</span>}
              </div>

              {bmcBlocks.slice(1, 4).map(([key, value]) => (
                <div key={key} className={cn( "p-4 rounded-lg flex flex-col min-h-[120px] col-span-1" )} style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-foreground)' }}>
                    <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--theme-primary)'}}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                    <p className="text-xs whitespace-pre-wrap">{value as string}</p>
                </div>
               ))}

               {bmcBlocks.slice(4).map(([key, value]) => (
                 <div key={key} className={cn(
                  "p-4 rounded-lg flex flex-col min-h-[120px]",
                  key === 'costStructure' ? 'col-span-2' : '',
                  key === 'revenueStreams' ? 'col-span-3' : 'col-span-1',
                )} style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-foreground)' }}>
                  <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--theme-primary)'}}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                  <p className="text-xs whitespace-pre-wrap">{value as string}</p>
                </div>
               ))}
           </div>
           {!removeWatermark && (
            <div className='text-center text-xs mt-4' style={{ color: 'var(--theme-foreground)', opacity: 0.6}}>Powered by InnoCanvas</div>
           )}
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

    