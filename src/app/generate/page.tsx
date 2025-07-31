
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
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';


type BMCBlock = {
  title: string;
  icon: React.ReactNode;
  keyProp: keyof GenerateBMCOutput;
};

const initialColors = {
    primary: '#30A2FF',
    card: '#1c2333',
    background: '#0a0f1c',
    foreground: '#ffffff',
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

const bmcLayout: BMCBlock[] = [
    { title: "Key Partnerships", keyProp: "keyPartnerships", icon: <Handshake /> },
    { title: "Key Activities", keyProp: "keyActivities", icon: <Wrench /> },
    { title: "Key Resources", keyProp: "keyResources", icon: <Package /> },
    { title: "Value Propositions", keyProp: "valuePropositions", icon: <Gift /> },
    { title: "Customer Relationships", keyProp: "customerRelationships", icon: <Heart /> },
    { title: "Channels", keyProp: "channels", icon: <Truck /> },
    { title: "Customer Segments", keyProp: "customerSegments", icon: <Users /> },
    { title: "Cost Structure", keyProp: "costStructure", icon: <Wallet /> },
    { title: "Revenue Streams", keyProp: "revenueStreams", icon: <DollarSign /> },
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
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(isEditing);
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
  const [colors, setColors] = useState(initialColors);
  
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
                const { data, error } = await supabase
                  .from('canvases')
                  .select('*')
                  .eq('id', canvasId)
                  .eq('user_id', user.id)
                  .single();
                
                if (error) throw error;
                
                if (data) {
                    const canvasData = data.canvas_data as GenerateBMCOutput;
                    const formData = data.form_data as GenerateBMCInput;

                    setBmcData(canvasData);
                    setFormData(formData);
                    setLogoUrl(data.logo_url || null);
                    setRemoveWatermark(data.remove_watermark || false);
                    setColors(data.colors || initialColors);
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

  const handleColorChange = (colorKey: keyof typeof colors, value: string) => {
    setColors(prev => ({...prev, [colorKey]: value}));
  }

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
        const canvasDataToSave = {
            canvas_data: bmcData,
            form_data: formData,
            logo_url: logoUrl,
            remove_watermark: removeWatermark,
            colors: colors,
            user_id: user.uid,
            business_description: formData.businessDescription, 
        };

        if (canvasId) {
            const { error } = await supabase
              .from('canvases')
              .update({ ...canvasDataToSave, updated_at: new Date().toISOString() })
              .eq('id', canvasId);
            
            if (error) throw error;
            
            toast({
                title: 'Canvas Updated!',
                description: 'Your changes have been saved.',
            });
        } else {
             const { data, error } = await supabase
                .from('canvases')
                .insert({ ...canvasDataToSave })
                .select('id')
                .single();
            
            if (error) throw error;
            
            router.replace(`/generate?canvasId=${data.id}`, { scroll: false }); 
            toast({
                title: 'Canvas Saved!',
                description: 'Your masterpiece is safe in "My Canvases".',
            });
        }
        setIsEditing(false);
    } catch (error: any) {
        console.error("Error saving canvas:", error);
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
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
        
        const element = styledCanvasRef.current;
        
        html2canvas(element, {
            useCORS: true,
            backgroundColor: null,
            scale: 2,
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png', 1.0);
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            
            const pdf = new jsPDF({
                orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
                unit: 'px',
                format: [imgWidth, imgHeight]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
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
            className="w-full flex flex-col gap-6"
          >
            {isLoading && !bmcData ? (
              <div className="flex flex-col items-center justify-center h-96 text-foreground">
                <Loader className="w-16 h-16 animate-spin mb-4 text-foreground" />
                <h2 className="text-2xl font-semibold">Generating your canvas...</h2>
                <p className="text-muted-foreground">The AI is working its magic!</p>
              </div>
            ) : (
              bmcData && (
                <>
                    {/* Toolbar */}
                    <div className="card-glass p-4 rounded-2xl flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
                        <div className="flex items-center gap-2">
                            <Button variant="gradient" size="sm" onClick={() => handleGenerateCanvas(true)} disabled={isLoading}>
                                {isLoading ? <Loader className="mr-2 animate-spin" /> : <RefreshCw className="mr-2" />} 
                                Regenerate
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => setIsEditing(!isEditing)}>
                                <Edit className="mr-2" /> {isEditing ? 'Done' : 'Edit'}
                            </Button>
                             <Button variant="secondary" size="sm" onClick={handleSave} disabled={isLoading}><Save className="mr-2" /> {canvasId ? 'Save' : 'Save'}</Button>
                        </div>

                        <Separator orientation='vertical' className='h-8' />
                        
                        <div className='flex items-center gap-3'>
                            <Label className="font-semibold text-base text-foreground">Logo</Label>
                            <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                            <Button asChild variant="outline" size="sm">
                              <label htmlFor="logo-upload" className="cursor-pointer">
                                <Upload className="mr-2"/>
                                Upload
                              </label>
                            </Button>
                            <div className="flex items-center gap-2">
                              <Label htmlFor="remove-watermark" className="font-semibold text-base flex items-center gap-1">
                                <Gem size={16} className="text-vivid-pink" />
                              </Label>
                              <Switch id="remove-watermark" checked={removeWatermark} onCheckedChange={setRemoveWatermark}/>
                              <Badge variant="outline" className='border-vivid-pink text-vivid-pink'>PRO</Badge>
                            </div>
                        </div>

                        <Separator orientation='vertical' className='h-8' />

                        <div className='flex items-center gap-3'>
                             <h2 className="font-semibold text-base flex items-center gap-2"><Palette className='text-primary'/> Theme</h2>
                             <div className="flex items-center gap-2">
                                {Object.keys(colors).map(key => (
                                    <div key={key} className="flex items-center gap-2">
                                        <Label className="capitalize text-xs text-foreground">{key}</Label>
                                        <input 
                                            type="color" 
                                            value={colors[key as keyof typeof colors]}
                                            onChange={e => handleColorChange(key as keyof typeof colors, e.target.value)}
                                            className="w-6 h-6 rounded border-none cursor-pointer bg-transparent"
                                        />
                                    </div>
                                ))}
                              </div>
                        </div>

                        <Separator orientation='vertical' className='h-8' />
                        
                        <div className="flex items-center gap-2">
                            <Button variant='secondary' size="sm" onClick={handleGetSuggestions} disabled={isGettingSuggestions}>
                                  {isGettingSuggestions ? <Loader className="mr-2 animate-spin"/> : <Sparkles className="mr-2" />}
                                  Get Feedback
                            </Button>
                             <Button variant="secondary" size="sm" onClick={handleExport} disabled={isLoading}>
                                <Download className="mr-2" />
                                Export
                              </Button>
                        </div>
                    </div>


                    {/* Canvas */}
                    <div className="w-full">
                         <div ref={styledCanvasRef} className="aspect-[16/9] p-8 flex flex-col relative" style={{ background: colors.background }}>
                             {!removeWatermark && (
                                <div className="absolute bottom-4 right-4 z-20">
                                    <p className="text-xs" style={{color: 'rgba(255, 255, 255, 0.2)'}}>
                                        Powered by InnoCanvas
                                    </p>
                                </div>
                            )}

                             <div className="flex justify-between items-start mb-4 relative z-10">
                                 <h2 className="text-3xl font-bold" style={{color: colors.primary}}>Business Model Canvas</h2>
                                {logoUrl && <div className="relative w-40 h-20"><Image src={logoUrl} alt="Logo" layout="fill" objectFit="contain" /></div>}
                             </div>

                            <div className="flex-grow grid grid-cols-10 grid-rows-6 gap-2 relative z-10">
                               <div className="col-span-2 row-span-4">
                                  <StyledBmcBlock {...bmcLayout[0]} content={bmcData[bmcLayout[0].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[0].keyProp, e.target.value)} colors={colors} />
                               </div>
                               <div className="col-span-2 row-span-2">
                                  <StyledBmcBlock {...bmcLayout[1]} content={bmcData[bmcLayout[1].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[1].keyProp, e.target.value)} colors={colors} />
                               </div>
                               <div className="col-span-2 row-span-2 col-start-3 row-start-3">
                                  <StyledBmcBlock {...bmcLayout[2]} content={bmcData[bmcLayout[2].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[2].keyProp, e.target.value)} colors={colors} />
                               </div>
                               <div className="col-span-2 row-span-4">
                                  <StyledBmcBlock {...bmcLayout[3]} content={bmcData[bmcLayout[3].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[3].keyProp, e.target.value)} colors={colors} />
                               </div>
                               <div className="col-span-2 row-span-2 col-start-7">
                                  <StyledBmcBlock {...bmcLayout[4]} content={bmcData[bmcLayout[4].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[4].keyProp, e.target.value)} colors={colors} />
                               </div>
                               <div className="col-span-2 row-span-2 col-start-7 row-start-3">
                                  <StyledBmcBlock {...bmcLayout[5]} content={bmcData[bmcLayout[5].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[5].keyProp, e.target.value)} colors={colors} />
                               </div>
                               <div className="col-span-2 row-span-4 col-start-9">
                                  <StyledBmcBlock {...bmcLayout[6]} content={bmcData[bmcLayout[6].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[6].keyProp, e.target.value)} colors={colors} />
                               </div>

                               <div className="col-span-5 row-span-2 col-start-1 row-start-5">
                                  <StyledBmcBlock {...bmcLayout[7]} content={bmcData[bmcLayout[7].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[7].keyProp, e.target.value)} colors={colors} />
                               </div>
                               <div className="col-span-5 row-span-2 col-start-6 row-start-5">
                                   <StyledBmcBlock {...bmcLayout[8]} content={bmcData[bmcLayout[8].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[8].keyProp, e.target.value)} colors={colors} />
                               </div>
                            </div>
                        </div>
                    </div>
                </>
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

const StyledBmcBlock = ({ title, content, icon, isEditing, onChange, colors }: { title: string; content: string; icon: React.ReactNode; isEditing: boolean; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; colors: typeof initialColors }) => {
    return (
        <div className="p-2 md:p-4 rounded-xl flex flex-col h-full" style={{ backgroundColor: colors.card, border: `1px solid ${colors.primary}20` }}>
            <div className='flex items-center gap-2 md:gap-3 text-xs md:text-sm' style={{ color: colors.primary }}>
              <div className="flex-shrink-0">{icon}</div>
              <h3 className="font-bold">{title}</h3>
            </div>
            <div className="mt-2 flex-grow overflow-hidden">
              {isEditing ? (
                  <Textarea 
                      value={content}
                      onChange={onChange}
                      className="w-full h-full bg-transparent border-0 text-xs md:text-sm p-0 focus-visible:ring-0 resize-none"
                      style={{ color: colors.foreground }}
                  />
              ) : (
                  <div className="text-xs md:text-sm whitespace-pre-wrap overflow-y-auto h-full p-1" style={{ color: colors.foreground }}>
                      {content}
                  </div>
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
