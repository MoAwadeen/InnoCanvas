
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
        const fullCanvasData = {
            canvasData: bmcData,
            formData: formData,
            logoUrl: logoUrl,
            removeWatermark: removeWatermark,
            colors: colors,
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
        
        const element = styledCanvasRef.current;
        const targetWidth = 1920; 
        const scale = targetWidth / element.offsetWidth;

        html2canvas(element, {
            useCORS: true,
            backgroundColor: null,
            scale: scale,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png', 1.0);
            
            // Standard A4 landscape dimensions in points: 841.89 x 595.28
            const pdfWidth = 841.89;
            const pdfHeight = 595.28;
            
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'pt',
                format: 'a4'
            });

            const canvasAspectRatio = canvas.width / canvas.height;
            const pdfAspectRatio = pdfWidth / pdfHeight;

            let finalWidth, finalHeight;
            if (canvasAspectRatio > pdfAspectRatio) {
                // Canvas is wider than PDF page
                finalWidth = pdfWidth;
                finalHeight = pdfWidth / canvasAspectRatio;
            } else {
                // Canvas is taller than PDF page
                finalHeight = pdfHeight;
                finalWidth = pdfHeight * canvasAspectRatio;
            }

            // Center the image on the PDF page
            const x = (pdfWidth - finalWidth) / 2;
            const y = (pdfHeight - finalHeight) / 2;

            pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
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
    { title: "Key Partnerships", keyProp: "keyPartnerships", description: "Strategic alliances to optimize operations and reduce risks.", icon: <Handshake /> },
    { title: "Key Activities", keyProp: "keyActivities", description: "Critical activities for creating and delivering value.", icon: <Wrench /> },
    { title: "Key Resources", keyProp: "keyResources", description: "Essential assets required for the business to function.", icon: <Package /> },
    { title: "Value Propositions", keyProp: "valuePropositions", description: "The unique value a company's product or service provides.", icon: <Gift /> },
    { title: "Customer Relationships", keyProp: "customerRelationships", description: "Types of relationships established with customer segments.", icon: <Heart /> },
    { title: "Channels", keyProp: "channels", description: "How a company communicates with and reaches its customers.", icon: <Truck /> },
    { title: "Customer Segments", keyProp: "customerSegments", description: "The different groups of people or organizations a company serves.", icon: <Users /> },
    { title: "Cost Structure", keyProp: "costStructure", description: "All costs incurred to operate a business model.", icon: <Wallet /> },
    { title: "Revenue Streams", keyProp: "revenueStreams", description: "How a company generates cash from each customer segment.", icon: <DollarSign /> },
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
                              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Palette className='text-primary'/> Theme</h2>
                              <div className="space-y-3">
                                {Object.keys(colors).map(key => (
                                    <div key={key} className="flex items-center justify-between">
                                        <Label className="capitalize text-foreground">{key}</Label>
                                        <input 
                                            type="color" 
                                            value={colors[key as keyof typeof colors]}
                                            onChange={e => handleColorChange(key as keyof typeof colors, e.target.value)}
                                            className="w-8 h-8 rounded-md border-none cursor-pointer bg-transparent"
                                        />
                                    </div>
                                ))}
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
                         <div ref={styledCanvasRef} className="aspect-[16/9] p-8 flex flex-col relative" style={{ background: colors.background }}>
                            {/* Watermark */}
                             {!removeWatermark && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <p className="text-[clamp(2rem,15vw,8rem)] font-bold -rotate-12" style={{color: 'rgba(255, 255, 255, 0.05)'}}>
                                        Powered by InnoCanvas
                                    </p>
                                </div>
                            )}

                             {/* Header */}
                             <div className="flex justify-between items-start mb-4 relative z-10">
                                 <h2 className="text-3xl font-bold" style={{color: colors.primary}}>Business Model Canvas</h2>
                                {logoUrl && <div className="relative w-24 h-12"><Image src={logoUrl} alt="Logo" layout="fill" objectFit="contain" /></div>}
                             </div>

                             {/* Classic Grid */}
                             <div className="flex-grow grid grid-cols-10 grid-rows-6 gap-4 relative z-10">
                                <div className="col-start-1 col-span-2 row-start-1 row-span-3">
                                    <StyledBmcBlock {...bmcLayout[0]} content={bmcData[bmcLayout[0].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[0].keyProp, e.target.value)} colors={colors} />
                                </div>
                                <div className="col-start-3 col-span-2 row-start-1 row-span-2">
                                     <StyledBmcBlock {...bmcLayout[1]} content={bmcData[bmcLayout[1].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[1].keyProp, e.target.value)} colors={colors} />
                                </div>
                                <div className="col-start-3 col-span-2 row-start-3 row-span-2">
                                     <StyledBmcBlock {...bmcLayout[2]} content={bmcData[bmcLayout[2].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[2].keyProp, e.target.value)} colors={colors} />
                                </div>
                                <div className="col-start-5 col-span-2 row-start-1 row-span-4">
                                     <StyledBmcBlock {...bmcLayout[3]} content={bmcData[bmcLayout[3].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[3].keyProp, e.target.value)} colors={colors} />
                                </div>
                                <div className="col-start-7 col-span-2 row-start-1 row-span-2">
                                     <StyledBmcBlock {...bmcLayout[4]} content={bmcData[bmcLayout[4].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[4].keyProp, e.target.value)} colors={colors} />
                                </div>
                                 <div className="col-start-7 col-span-2 row-start-3 row-span-2">
                                     <StyledBmcBlock {...bmcLayout[5]} content={bmcData[bmcLayout[5].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[5].keyProp, e.target.value)} colors={colors} />
                                </div>
                                <div className="col-start-9 col-span-2 row-start-1 row-span-3">
                                    <StyledBmcBlock {...bmcLayout[6]} content={bmcData[bmcLayout[6].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[6].keyProp, e.target.value)} colors={colors} />
                                </div>
                                 <div className="col-start-1 col-span-5 row-start-5 row-span-2">
                                     <StyledBmcBlock {...bmcLayout[7]} content={bmcData[bmcLayout[7].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[7].keyProp, e.target.value)} colors={colors} />
                                </div>
                                 <div className="col-start-6 col-span-5 row-start-5 row-span-2">
                                     <StyledBmcBlock {...bmcLayout[8]} content={bmcData[bmcLayout[8].keyProp]} isEditing={isEditing} onChange={e => handleBmcDataChange(bmcLayout[8].keyProp, e.target.value)} colors={colors} />
                                </div>

                             </div>
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

const StyledBmcBlock = ({ title, content, icon, isEditing, onChange, colors }: { title: string; content: string; icon: React.ReactNode; isEditing: boolean; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; colors: typeof initialColors }) => {
    return (
        <div className="p-4 rounded-xl flex flex-col h-full" style={{ backgroundColor: colors.card, border: `1px solid ${colors.primary}20` }}>
            <div className='flex items-center gap-3' style={{ color: colors.primary }}>
              <div className="flex-shrink-0">{icon}</div>
              <h3 className="text-base font-bold">{title}</h3>
            </div>
            <div className="mt-2 flex-grow overflow-hidden">
              {isEditing ? (
                  <Textarea 
                      value={content}
                      onChange={onChange}
                      className="w-full h-full bg-transparent border-0 text-sm p-0 focus-visible:ring-0 resize-none"
                      style={{ color: colors.foreground }}
                  />
              ) : (
                  <div className="text-sm whitespace-pre-wrap overflow-y-auto h-full" style={{ color: colors.foreground }}>
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
