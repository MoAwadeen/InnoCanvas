
'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Users,
  Lightbulb,
  Truck,
  Heart,
  DollarSign,
  Wrench,
  Package,
  Handshake,
  FileText,
  RefreshCw,
  Edit,
  Save,
  Download,
  Share2,
  Loader,
  ChevronRight,
  Upload,
  Palette,
  Gem,
  Sparkles,
  ArrowLeft,
  LayoutList,
  Globe,
  BarChart,
  Wallet,
  Gift,
  Link as LinkIcon
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { generateBMC, GenerateBMCInput, GenerateBMCOutput } from '@/ai/flows/generate-bmc';
import { getAIImprovementSuggestions, GetAIImprovementSuggestionsOutput } from '@/ai/flows/improve-bmc';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc, updateDoc } from 'firebase/firestore';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


type BMCBlock = {
  title: string;
  icon: React.ReactNode;
  keyProp: keyof GenerateBMCOutput;
  description: string;
  color: 'purple' | 'blue';
};

const initialColors = {
    primary: '#0099ff',
    card: '#161d2f',
    background: '#0a0f1c',
    foreground: '#f0f8ff',
}

const refinementQuestions = [
    {
        key: 'valuePropositions' as const,
        label: 'What core problem does your business solve?',
        options: ['Saving customers time or effort', 'Reducing cost or risk', 'Improving convenience or accessibility', 'Creating a new or better experience', 'Other'],
    },
    {
        key: 'customerSegments' as const,
        label: 'Who benefits most from your solution?',
        options: ['Individuals (mass market)', 'Businesses or organizations', 'Niche communities or segments', 'Professionals or specialists', 'Internal teams (B2E or SaaS-like model)'],
    },
    {
        key: 'channels' as const,
        label: 'How do you reach and interact with your customers?',
        options: ['Website or app (direct digital access)', 'Social media and online content', 'Partner platforms or resellers', 'In-person sales or service', 'Mixed or hybrid approach'],
    },
    {
        key: 'revenueStreams' as const,
        label: 'What is your main revenue model?',
        options: ['One-time product sales', 'Subscription or recurring payments', 'Commission or transaction-based', 'Advertising or sponsorships', 'Freemium → upgrade path'],
    },
    {
        key: 'keyResources' as const,
        label: 'What is your most critical resource or asset?',
        options: ['Technical platform or software', 'Brand and community', 'Strategic partnerships', 'Expert knowledge or IP', 'Skilled human team'],
    },
];

function BmcGeneratorPageClient() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasId = searchParams.get('canvasId');

  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<GenerateBMCInput>>({
    businessDescription: '',
    customerSegments: '',
    valuePropositions: '',
    channels: '',
    revenueStreams: '',
    keyResources: '',
    customerRelationships: 'Automated', // Default value
    keyActivities: 'Software Development', // Default
    keyPartnerships: 'Tech Providers', // Default
    costStructure: 'Technology Infrastructure', // Default
  });
  const [bmcData, setBmcData] = useState<GenerateBMCOutput | null>(null);
  const [suggestions, setSuggestions] = useState<GetAIImprovementSuggestionsOutput | null>(null);
  
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [removeWatermark, setRemoveWatermark] = useState(false);
  
  const styledCanvasRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
      const loadCanvas = async () => {
        if (canvasId && user) {
            setIsLoading(true);
            try {
                const canvasDocRef = doc(db, 'users', user.uid, 'canvases', canvasId);
                const canvasDoc = await getDoc(canvasDocRef);
                if (canvasDoc.exists()) {
                    const data = canvasDoc.data();
                    const canvasData = data.canvasData as GenerateBMCOutput;
                    const formData = data.formData as GenerateBMCInput;

                    setBmcData(canvasData);
                    setFormData(formData);
                    setLogoUrl(data.logoUrl || null);
                    setRemoveWatermark(data.removeWatermark || false);

                    setStep(3);
                } else {
                     toast({ title: 'Error', description: 'Canvas not found.', variant: 'destructive' });
                     router.push('/my-canvases');
                }
            } catch (error) {
                console.error("Error loading canvas:", error)
                toast({ title: 'Error', description: 'Failed to load canvas.', variant: 'destructive' });
            } finally {
                setIsLoading(false);
            }
        }
      };

      if (!authLoading && user) {
        loadCanvas();
      }
  }, [canvasId, user, authLoading, router, toast]);

  const handleInputChange = (
    key: keyof GenerateBMCInput,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  
  const handleBmcDataChange = (key: keyof GenerateBMCOutput, value: string) => {
    if (bmcData) {
      setBmcData(prev => prev ? { ...prev, [key]: value } : null);
    }
  };

  const handleGenerateCanvas = async (regenerate = false) => {
    const requiredKeys: (keyof GenerateBMCInput)[] = ['businessDescription', 'customerSegments', 'valuePropositions', 'channels', 'revenueStreams', 'keyResources'];
    if (!regenerate && requiredKeys.some(key => !formData[key])) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all refinement questions before generating.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!regenerate) {
        setStep(3);
    }

    setIsLoading(true);
    setSuggestions(null); // Clear old suggestions
    try {
      const result = await generateBMC(formData as GenerateBMCInput);
      setBmcData(result);
    } catch (error) {
      console.error('Error generating BMC:', error);
      toast({
        title: 'Error Generating Canvas',
        description: 'There was an issue with the AI. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !bmcData || !formData.businessDescription) {
        toast({ title: 'Error', description: 'Cannot save. Missing data or user not logged in.', variant: 'destructive' });
        return;
    }
    
    setIsLoading(true);
    try {
        const fullCanvasData = {
            canvasData: bmcData,
            formData: formData,
            logoUrl: logoUrl,
            removeWatermark: removeWatermark,
            userId: user.uid,
            businessDescription: formData.businessDescription, 
        };

        if (canvasId) {
            const canvasDocRef = doc(db, 'users', user.uid, 'canvases', canvasId);
            await updateDoc(canvasDocRef, { ...fullCanvasData, updatedAt: serverTimestamp() });
             toast({
                title: 'Canvas Updated!',
                description: 'Your changes have been saved.',
            });
        } else {
            const newCanvasRef = await addDoc(collection(db, 'users', user.uid, 'canvases'), { ...fullCanvasData, createdAt: serverTimestamp() });
            router.replace(`/generate?canvasId=${newCanvasRef.id}`, { scroll: false }); 
            toast({
                title: 'Canvas Saved!',
                description: 'Your masterpiece is safe in "My Canvases".',
            });
        }
        setIsEditing(false);
    } catch (error) {
        console.error("Error saving canvas:", error);
        toast({ title: 'Error', description: 'Failed to save canvas.', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleExport = () => {
    if (styledCanvasRef.current) {
        toast({
            title: 'Exporting PDF...',
            description: 'Please wait while we generate your PDF.',
        });
        
        const originalWidth = styledCanvasRef.current.offsetWidth;
        const scale = 1920 / originalWidth;

        html2canvas(styledCanvasRef.current!, {
            useCORS: true,
            backgroundColor: null, 
            scale: scale, 
            windowWidth: styledCanvasRef.current.scrollWidth,
            windowHeight: styledCanvasRef.current.scrollHeight,
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('innocanvas-bmc.pdf');

            toast({
                title: 'PDF Exported!',
                description: 'Your canvas has been downloaded.',
            });
        }).catch(err => {
            console.error("Error exporting PDF:", err);
            toast({
                title: 'Error exporting',
                description: 'Failed to generate PDF. Please try again.',
                variant: 'destructive',
            });
        });
    } else {
        toast({
            title: 'Error exporting',
            description: 'Could not find the canvas to export.',
            variant: 'destructive',
        });
    }
};

  const handleShare = () => {
      toast({
          title: 'Coming Soon!',
          description: 'Public link sharing is currently under development.',
      });
  }

  const handleGetSuggestions = async () => {
    if (!bmcData) return;
    setIsGettingSuggestions(true);
    try {
      const bmcSections: Partial<GenerateBMCOutput> = { ...bmcData };
      
      const result = await getAIImprovementSuggestions({
        bmcData: bmcSections as Record<string, string>,
        businessDescription: formData.businessDescription || '',
      });
      setSuggestions(result);
    } catch (error) {
      console.error("Error getting suggestions:", error);
      toast({ title: "AI Error", description: "Could not get suggestions.", variant: "destructive" });
    } finally {
      setIsGettingSuggestions(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const bmcLayout: BMCBlock[] = [
    { title: "Key Resources", keyProp: "keyResources", description: "Determine the essential assets needed to operate your business.", icon: <Wrench />, color: 'purple' },
    { title: "Key Activities", keyProp: "keyActivities", description: "Outline the most important tasks for your business success.", icon: <LayoutList />, color: 'blue' },
    { title: "Channels", keyProp: "channels", description: "Discover the best ways to reach your customers.", icon: <Globe />, color: 'purple' },
    { title: "Revenue Streams", keyProp: "revenueStreams", description: "Explore different ways to generate income.", icon: <BarChart />, color: 'blue' },
    { title: "Cost Structure", keyProp: "costStructure", description: "Analyze your business costs and streamline expenses.", icon: <Wallet />, color: 'purple' },
    { title: "Customer Segments", keyProp: "customerSegments", description: "Identify and target your key customers.", icon: <Users />, color: 'purple' },
    { title: "Customer Relationships", keyProp: "customerRelationships", description: "Build and maintain strong connections with your customers.", icon: <Handshake />, color: 'blue' },
    { title: "Value Propositions", keyProp: "valuePropositions", description: "Define what makes your product or service unique.", icon: <Gift />, color: 'purple' },
    { title: "Key Partnerships", keyProp: "keyPartnerships", description: "Identify the essential partners and suppliers.", icon: <LinkIcon />, color: 'blue' },
  ];

  const renderStep = () => {
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-red-500">
                <h2 className="text-2xl font-semibold">Error</h2>
                <p>{error}</p>
            </div>
        );
    }
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-card rounded-2xl p-8 shadow-lg text-center border-border border">
              <h1 className="text-4xl font-bold mb-4 text-card-foreground">Tell Us About Your Idea</h1>
              <p className="text-muted-foreground mb-8">
                Start with your business name and a brief description. The more detail, the better!
              </p>
              <Textarea
                placeholder="Ex: A mobile app that helps tourists explore historical places using AR…"
                className="min-h-[150px] text-lg bg-background text-foreground"
                value={formData.businessDescription}
                onChange={(e) => handleInputChange('businessDescription', e.target.value)}
              />
              <Button
                size="lg"
                variant="gradient"
                className="mt-8"
                onClick={() => setStep(2)}
                disabled={!formData.businessDescription}
              >
                Next <ChevronRight className="ml-2"/>
              </Button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-card rounded-2xl p-8 shadow-lg border-border border">
              <h1 className="text-3xl font-bold mb-2 text-center text-card-foreground">Refine Your Business Vision</h1>
              <p className="text-muted-foreground mb-8 text-center">
                Answer these questions to help the AI understand your business better.
              </p>
              <div className="space-y-6">
                {refinementQuestions.map((q) => (
                  <div key={q.key}>
                    <Label className="font-semibold text-lg mb-2 block text-card-foreground">{q.label}</Label>
                    <RadioGroup
                      onValueChange={(value) => handleInputChange(q.key, value)}
                      value={formData[q.key]}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                    >
                      {q.options.map((opt) => (
                        <div key={opt} className="flex items-center">
                          <RadioGroupItem value={opt} id={`${q.key}-${opt}`} className="peer sr-only"/>
                          <Label htmlFor={`${q.key}-${opt}`} className="flex flex-col items-center justify-between rounded-md border-2 border-border bg-background p-4 hover:bg-accent/10 text-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary w-full cursor-pointer">
                            {opt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="mr-2" /> Back</Button>
                <Button
                  size="lg"
                  variant="gradient"
                  onClick={() => handleGenerateCanvas(false)}
                  disabled={isLoading}
                >
                  {isLoading ? <><Loader className="mr-2 animate-spin" /> Generating...
                  </> : 'Generate Canvas'}
                </Button>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            {isLoading && !bmcData ? (
              <div className="flex flex-col items-center justify-center h-96 text-foreground">
                <Loader className="w-16 h-16 animate-spin mb-4 text-foreground" />
                <h2 className="text-2xl font-semibold">Generating your canvas...</h2>
                <p className="text-muted-foreground">The AI is working its magic!</p>
              </div>
            ) : (
              bmcData && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column: Controls */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                       <div className="card-glass p-6 rounded-2xl">
                          <h2 className="text-xl font-bold text-foreground mb-4">Canvas Controls</h2>
                           <div className="flex flex-col gap-3">
                              <Button variant="gradient" onClick={() => handleGenerateCanvas(true)} disabled={isLoading}>
                                  {isLoading ? <Loader className="mr-2 animate-spin" /> : <RefreshCw className="mr-2" />} 
                                  Regenerate
                              </Button>
                              <Button variant="secondary" onClick={() => setIsEditing(!isEditing)}>
                                  <Edit className="mr-2" /> {isEditing ? 'Done Editing' : 'Edit Canvas'}
                              </Button>
                              <Button variant="secondary" onClick={handleSave} disabled={isLoading}><Save className="mr-2" /> {canvasId ? 'Save Changes' : 'Save to My Canvases'}</Button>
                              <Button variant="secondary" onClick={handleExport} disabled={isLoading}>
                                <Download className="mr-2" />
                                Export as PDF
                              </Button>
                              <Button variant="secondary" onClick={handleShare}><Share2 className="mr-2" /> Share Public Link</Button>
                           </div>
                       </div>
                       <div className="card-glass p-6 rounded-2xl">
                          <h2 className="text-xl font-bold text-foreground mb-4">Branding</h2>
                          <div className="space-y-4">
                            <div>
                              <Label className="font-semibold text-base mb-2 block text-foreground">Logo</Label>
                              <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                              <Button asChild variant="outline" className='w-full'>
                                <label htmlFor="logo-upload" className="cursor-pointer">
                                  <Upload className="mr-2"/>
                                  Upload Logo
                                </label>
                              </Button>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                              <Label htmlFor="remove-watermark" className="font-semibold text-base flex items-center gap-2">
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
                              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Sparkles className='text-primary'/> AI Suggestions</h2>
                              <p className='text-muted-foreground mb-4 text-sm'>Let our AI analyze your canvas and provide actionable feedback.</p>
                              <Button variant='secondary' onClick={handleGetSuggestions} disabled={isGettingSuggestions} className='w-full'>
                                  {isGettingSuggestions ? <Loader className="mr-2 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                                  Get Feedback
                              </Button>
                         </div>
                    </div>

                    {/* Right Column: Canvas */}
                    <div className="lg:col-span-3">
                         <div ref={styledCanvasRef} className="bmc-container">
                            <div className="bmc-header">
                                <h2 className="bmc-title">Business Model Canvas</h2>
                                {logoUrl && (
                                    <div className="bmc-logo">
                                        <Image src={logoUrl} alt="Logo" layout="fill" objectFit="contain" />
                                    </div>
                                )}
                            </div>
                            <div className="bmc-grid">
                                {bmcLayout.slice(0, 5).map(block => (
                                    <BmcBlock 
                                        key={block.keyProp}
                                        {...block}
                                        content={bmcData[block.keyProp]}
                                        isEditing={isEditing}
                                        onChange={e => handleBmcDataChange(block.keyProp, e.target.value)}
                                    />
                                ))}
                                {bmcLayout.slice(5, 9).map(block => (
                                    <BmcBlock 
                                        key={block.keyProp}
                                        {...block}
                                        content={bmcData[block.keyProp]}
                                        isEditing={isEditing}
                                        onChange={e => handleBmcDataChange(block.keyProp, e.target.value)}
                                        className={cn({
                                          'col-span-2': block.keyProp === 'customerRelationships',
                                        })}
                                    />
                                ))}
                            </div>
                             <div className="bmc-footer">
                                <span>Designed For: {user?.displayName || 'Jamie Chastain'}</span>
                                <span>Designed By: Hannah Morales</span>
                                <span>Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            {!removeWatermark && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <p className="text-[8rem] font-bold text-white/5 select-none -rotate-12">
                                        InnoCanvas
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
              )
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (authLoading && !canvasId) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background">
            <Loader className="w-16 h-16 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4 md:p-8">
       <header className="flex justify-between items-center mb-8">
          <Logo />
           <div className="flex items-center gap-4">
            <Link href="/my-canvases">
                <Button variant="secondary">Back to My Canvases</Button>
            </Link>
             {step > 1 && (
              <div className="hidden md:flex items-center gap-2 text-sm font-medium">
                  <span className={step === 1 ? 'text-primary' : 'text-muted-foreground'}>Idea</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className={step === 2 ? 'text-primary' : 'text-muted-foreground'}>Refine</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className={step === 3 ? 'text-primary' : 'text-muted-foreground'}>Canvas</span>
              </div>
             )}
           </div>
        </header>
      <main className="flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </main>
       <AlertDialog open={!!suggestions} onOpenChange={() => setSuggestions(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'><Sparkles className='text-primary' /> AI Suggestions</AlertDialogTitle>
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

const BmcBlock = ({ title, content, description, icon, className, isEditing, onChange, color }: { title: string; content: string; description: string; icon: React.ReactNode; className?: string, isEditing: boolean, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, color: 'purple' | 'blue' }) => {
    return (
        <div className={cn("bmc-block", `bmc-block-${color}`, className)}>
            <div className='flex items-start gap-3'>
              <div className="b-10">{icon}</div>
              <div>
                <h3 className="text-lg font-bold">{title}</h3>
                {isEditing ? null : <p className="text-xs text-white/70 mt-1">{description}</p>}
              </div>
            </div>
            <div className="mt-2 flex-grow">
              {isEditing ? (
                  <Textarea 
                      value={content}
                      onChange={onChange}
                      className="w-full h-full bg-transparent border-0 text-sm p-0 focus-visible:ring-0 resize-none text-white"
                  />
              ) : (
                  <p className="text-sm text-white/90 whitespace-pre-wrap">
                      {content}
                  </p>
              )}
            </div>
        </div>
    );
};


export default function BmcGeneratorPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-background">
            <Loader className="w-16 h-16 animate-spin text-primary" />
        </div>
    }>
      <BmcGeneratorPageClient />
    </Suspense>
  )
}
