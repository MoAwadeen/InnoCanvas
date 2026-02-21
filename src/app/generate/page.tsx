'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Users, Lightbulb, Truck, Heart, DollarSign, Wrench, Package, Handshake,
  FileText, RefreshCw, Edit, Save, Download, Share2, Loader, ChevronRight,
  Upload, Palette, Gem, Sparkles, ArrowLeft, LayoutList, Globe, BarChart,
  Wallet, Gift, Link as LinkIcon
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { getPublicUrl, supabase, handleSupabaseError } from '@/lib/supabase';
import { AIService } from '@/ai/services/ai-service';

type BMCBlock = {
  title: string;
  icon: React.ReactNode;
  keyProp: string;
};

const initialColors = {
  primary: '#77ff00',
  card: '#1c2333',
  background: '#0a0f1c',
  foreground: '#ffffff',
};

const refinementQuestions = [
  {
    key: 'valuePropositions' as const,
    label: 'What core problem does your business solve?',
    description: 'Identify the primary pain point or need your business addresses',
    type: 'radio' as const,
    options: [
      { value: 'Saving customers time or effort', icon: '⏱️', description: 'Streamlining processes or reducing manual work' },
      { value: 'Reducing cost or risk', icon: '💰', description: 'Lowering expenses or minimizing potential losses' },
      { value: 'Improving convenience or accessibility', icon: '🎯', description: 'Making things easier to access or use' },
      { value: 'Creating a new or better experience', icon: '✨', description: 'Offering something novel or significantly improved' },
      { value: 'Other', icon: '🔍', description: 'A different type of problem or need' }
    ],
  },
  {
    key: 'customerSegments' as const,
    label: 'Who benefits most from your solution?',
    description: 'Define your primary target audience and customer groups',
    type: 'radio' as const,
    options: [
      { value: 'Individuals (mass market)', icon: '👥', description: 'General consumers or individual users' },
      { value: 'Businesses or organizations', icon: '🏢', description: 'Companies, nonprofits, or institutions' },
      { value: 'Niche communities or segments', icon: '🎯', description: 'Specific groups with unique needs' },
      { value: 'Professionals or specialists', icon: '👨‍💼', description: 'Experts or skilled practitioners' },
      { value: 'Internal teams (B2E or SaaS-like model)', icon: '👨‍💻', description: 'Employees or internal users' }
    ],
  },
  {
    key: 'channels' as const,
    label: 'How do you reach and interact with your customers?',
    description: 'Choose your primary distribution and communication channels',
    type: 'radio' as const,
    options: [
      { value: 'Website or app (direct digital access)', icon: '🌐', description: 'Online platforms or mobile applications' },
      { value: 'Social media and online content', icon: '📱', description: 'Social platforms and digital marketing' },
      { value: 'Partner platforms or resellers', icon: '🤝', description: 'Third-party distribution channels' },
      { value: 'In-person sales or service', icon: '🏪', description: 'Physical locations or face-to-face interactions' },
      { value: 'Mixed or hybrid approach', icon: '🔄', description: 'Combination of multiple channels' }
    ],
  },
  {
    key: 'revenueStreams' as const,
    label: 'What is your main revenue model?',
    description: 'Select the primary way you generate income',
    type: 'radio' as const,
    options: [
      { value: 'One-time product sales', icon: '🛍️', description: 'Single purchases or transactions' },
      { value: 'Subscription or recurring payments', icon: '🔄', description: 'Ongoing fees or membership models' },
      { value: 'Commission or transaction-based', icon: '💸', description: 'Percentage-based or per-transaction fees' },
      { value: 'Advertising or sponsorships', icon: '📢', description: 'Ad revenue or sponsored content' },
      { value: 'Freemium → upgrade path', icon: '🎁', description: 'Free base with premium upgrades' }
    ],
  },
  {
    key: 'keyResources' as const,
    label: 'What is your most critical resource or asset?',
    description: 'Identify the most important resource for your business success',
    type: 'radio' as const,
    options: [
      { value: 'Technical platform or software', icon: '💻', description: 'Digital infrastructure or technology stack' },
      { value: 'Brand and community', icon: '🏷️', description: 'Brand recognition and loyal community' },
      { value: 'Strategic partnerships', icon: '🤝', description: 'Key business relationships and alliances' },
      { value: 'Expert knowledge or IP', icon: '🧠', description: 'Intellectual property or specialized expertise' },
      { value: 'Skilled human team', icon: '👥', description: 'Talented employees or team members' }
    ],
  },
  {
    key: 'businessModel' as const,
    label: 'What type of business model best describes your approach?',
    description: 'Choose the business model that most closely matches your strategy',
    type: 'radio' as const,
    options: [
      { value: 'SaaS/Software as a Service', icon: '☁️', description: 'Cloud-based software subscriptions' },
      { value: 'Marketplace/Platform', icon: '🏪', description: 'Connecting buyers and sellers' },
      { value: 'E-commerce/Retail', icon: '🛒', description: 'Online or physical product sales' },
      { value: 'Consulting/Services', icon: '💼', description: 'Professional services or expertise' },
      { value: 'Content/Media', icon: '📺', description: 'Content creation and distribution' }
    ],
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
  const { user, userData, loading: authLoading, checkPlanLimit, getPlanLimits } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasId = searchParams.get('canvasId');
  const { toast } = useToast();
  const styledCanvasRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [canvasGenerated, setCanvasGenerated] = useState(false);
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessDescription: '',
    businessName: '',
    valuePropositions: '',
    customerSegments: '',
    channels: '',
    revenueStreams: '',
    keyResources: '',
    businessModel: '',
  });

  const [bmcData, setBmcData] = useState({
    customerSegments: 'Target customers',
    valuePropositions: 'Customer value',
    channels: 'Distribution channels',
    customerRelationships: 'Customer engagement',
    revenueStreams: 'Revenue sources',
    keyActivities: 'Core activities',
    keyResources: 'Essential resources',
    keyPartnerships: 'Strategic partnerships and alliances',
    costStructure: 'Business costs'
  });

  const [colors, setColors] = useState({
    primary: '#77ff00',
    card: '#1c2333',
    background: '#0a0f1c',
    foreground: '#ffffff'
  });

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
            const canvasData = data.canvas_data;
            const formData = data.form_data;

            setBmcData(canvasData);
            setFormData(formData);
            if (data.logo_url) {
              setLogoUrl(getPublicUrl('logos', data.logo_url));
            } else {
              setLogoUrl(null);
            }
            setRemoveWatermark(data.remove_watermark || false);
            setColors(data.colors || initialColors);
            setStep(3);
          } else {
            toast({ title: 'Error', description: 'Canvas not found.', variant: 'destructive' });
            router.push('/my-canvases');
          }
        } catch (error) {
          console.error("Error loading canvas:", error);
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

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };
  
  const handleBmcDataChange = (key: string, value: string) => {
    if (bmcData) {
      setBmcData((prev: any) => prev ? { ...prev, [key]: value } : null);
    }
  };

  const handleColorChange = (colorKey: string, value: string) => {
    setColors((prev: any) => ({...prev, [colorKey]: value}));
  };

  const handleGenerateCanvas = async (regenerate = false) => {
    if (!user) {
      toast({ title: 'Error', description: 'Please log in to generate a canvas.', variant: 'destructive' });
      return;
    }

    if (!formData.businessDescription) {
      toast({ title: 'Error', description: 'Please provide a business description.', variant: 'destructive' });
      return;
    }

    // Check plan limits for canvas creation
    const canCreateCanvas = await checkPlanLimit('create_canvas');
    if (!canCreateCanvas) {
      const planLimits = await getPlanLimits();
      const currentPlan = userData?.plan || 'free';
      const maxCanvases = planLimits?.max_canvases || 1;
      
      toast({ 
        title: 'Plan Limit Reached', 
        description: `You've reached the limit of ${maxCanvases} canvas${maxCanvases > 1 ? 'es' : ''} for your ${currentPlan} plan. Please upgrade to create more canvases.`, 
        variant: 'destructive' 
      });
      return;
    }

    setIsLoading(true);
    try {
      const mcqAnswers = {
        valuePropositions: formData.valuePropositions,
        customerSegments: formData.customerSegments,
        channels: formData.channels,
        revenueStreams: formData.revenueStreams,
        keyResources: formData.keyResources,
        businessModel: formData.businessModel,
      };

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateBusinessModelCanvas',
          businessIdea: formData.businessDescription,
          mcqAnswers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate business model canvas');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      let bmcData;
      try {
        // Clean the response string if it contains markdown code blocks
        let cleanedResponse = data.bmcData;
        if (typeof cleanedResponse === 'string') {
          cleanedResponse = cleanedResponse.replace(/```json\s*|\s*```/g, '').trim();
          bmcData = JSON.parse(cleanedResponse);
        } else {
          bmcData = cleanedResponse;
        }
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parseError);
        bmcData = {};
      }

      // Convert snake_case keys to camelCase if needed
      const completeBmcData = {
        customerSegments: bmcData?.customerSegments || bmcData?.customer_segments || 'Target customers',
        valuePropositions: bmcData?.valuePropositions || bmcData?.value_propositions || 'Customer value',
        channels: bmcData?.channels || 'Distribution channels',
        customerRelationships: bmcData?.customerRelationships || bmcData?.customer_relationships || 'Customer engagement',
        revenueStreams: bmcData?.revenueStreams || bmcData?.revenue_streams || 'Revenue sources',
        keyActivities: bmcData?.keyActivities || bmcData?.key_activities || 'Core activities',
        keyResources: bmcData?.keyResources || bmcData?.key_resources || 'Essential resources',
        keyPartnerships: bmcData?.keyPartnerships || bmcData?.key_partnerships || 'Strategic partnerships and alliances',
        costStructure: bmcData?.costStructure || bmcData?.cost_structure || 'Business costs'
      };

      setBmcData(completeBmcData);
      setStep(3);
      setCanvasGenerated(true);
      
      toast({
        title: 'Canvas Generated!',
        description: 'Your Business Model Canvas has been created successfully.',
      });
    } catch (error: any) {
      console.error('Error generating canvas:', error);
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate business model canvas. Please try again.',
        variant: 'destructive',
      });
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
      const logoPath = logoUrl ? logoUrl.split('/').pop() : null;

      // Enhanced canvas data with more comprehensive information
      const canvasDataToSave = {
        canvas_data: bmcData,
        form_data: formData,
        logo_url: logoPath,
        remove_watermark: removeWatermark,
        colors: colors,
        user_id: user.id,
        business_description: formData.businessDescription,
        title: formData.businessName || `BMC - ${formData.businessDescription.substring(0, 50)}...`,
        tags: formData.businessModel ? [formData.businessModel.toLowerCase()] : [],
        is_public: false,
        view_count: 0,
        export_count: 0,
      };

      if (canvasId) {
        const { error } = await supabase
          .from('canvases')
          .update({ ...canvasDataToSave, updated_at: new Date().toISOString() })
          .eq('id', canvasId);
        
        if (error) throw error;
        
        toast({
          title: 'Canvas Updated!',
          description: 'Your changes have been saved successfully.',
        });
      } else {
        const { data, error } = await supabase
          .from('canvases')
          .insert({ ...canvasDataToSave })
          .select('id')
          .single();
        
        if (error) throw error;
        
        // Update user statistics
        try {
          const { data: currentProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('statistics')
            .eq('id', user.id)
            .single();
          
          if (!fetchError && currentProfile) {
            const currentStats = currentProfile.statistics || {};
            const updatedStats = {
              ...currentStats,
              canvases_created: (currentStats.canvases_created || 0) + 1
            };
            
            const { error: statsError } = await supabase
              .from('profiles')
              .update({ statistics: updatedStats })
              .eq('id', user.id);
            
            if (statsError) {
              console.warn('Failed to update user statistics:', statsError);
            }
          }
        } catch (statsError) {
          console.warn('Error updating user statistics:', statsError);
        }
        
        router.replace(`/generate?canvasId=${data.id}`, { scroll: false }); 
        toast({
          title: 'Canvas Saved!',
          description: 'Your masterpiece is safe in "My Canvases".',
        });
      }
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error saving canvas:", error);
      const errorMessage = handleSupabaseError(error, 'Failed to save canvas');
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
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
  };

  const handleGetSuggestions = async () => {
    if (!bmcData) {
      toast({
        title: 'No Canvas Data',
        description: 'Please generate a canvas first before getting suggestions.',
        variant: 'destructive'
      });
      return;
    }

    setIsGettingSuggestions(true);
    try {
      const suggestionPrompt = `Analyze this Business Model Canvas and provide actionable suggestions for improvement:

${JSON.stringify(bmcData, null, 2)}

Please provide:
1. 3 specific improvements for each section
2. Potential risks or challenges
3. Strategic recommendations
4. Market positioning advice

Format as JSON with keys: improvements, risks, recommendations, positioning`;

      const suggestions = await AIService.generateInsights(JSON.stringify(bmcData));
      setSuggestions(suggestions);
      
      toast({
        title: 'Suggestions Generated',
        description: 'AI has analyzed your canvas and provided recommendations.',
      });
    } catch (error) {
      console.error('Error getting suggestions:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate suggestions. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGettingSuggestions(false);
    }
  };

  const handleGetRefinementSuggestions = async (questionKey: string, currentValue: string) => {
    if (!currentValue || !formData.businessDescription) return;

    try {
      const suggestionPrompt = `Based on this business description: "${formData.businessDescription}"

And the current answer to "${refinementQuestions.find(q => q.key === questionKey)?.label}": "${currentValue}"

Provide 3 specific, actionable suggestions to improve or refine this answer. Focus on:
- More specific details
- Better alignment with the business model
- Potential opportunities or considerations

Format as a simple list with bullet points.`;

      const suggestions = await AIService.generateInsights(suggestionPrompt);
      return suggestions;
    } catch (error) {
      console.error('Error getting refinement suggestions:', error);
      return null;
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && user) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "File too large", description: "Logo should be less than 2MB.", variant: "destructive"});
        return;
      }

      setIsLoading(true); // Added setIsLoading(true) here
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        setLogoUrl(getPublicUrl('logos', filePath));
        toast({ title: 'Logo uploaded!', description: 'Remember to save your canvas.' });
      } catch (error: any) {
        const errorMessage = handleSupabaseError(error, 'Failed to upload logo');
        toast({ title: "Upload failed", description: errorMessage, variant: "destructive"});
      } finally {
        setIsLoading(false); // Added setIsLoading(false) here
      }
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
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-card-foreground">Tell Us About Your Idea</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Start with your business name and a detailed description. The more specific you are, the better the AI can understand and generate your Business Model Canvas!
                </p>
              </div>

              <div className="space-y-6">
                {/* Business Name Input */}
                <div className="text-left">
                  <Label className="text-sm font-semibold text-foreground mb-2 block">
                    Business Name (Optional)
                  </Label>
                  <input
                    type="text"
                    placeholder="e.g., TechFlow, GreenEats, SmartHome Pro..."
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.businessName || ''}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                  />
                </div>

                {/* Business Description Input */}
                <div className="text-left">
                  <Label className="text-sm font-semibold text-foreground mb-2 block">
                    Business Description *
                  </Label>
                  <Textarea
                    placeholder="Describe your business idea in detail. For example:

• A mobile app that helps tourists explore historical places using AR technology
• An online platform connecting local farmers with urban consumers for fresh produce delivery
• A SaaS tool that automates social media content creation for small businesses
• A subscription service providing personalized meal plans and grocery delivery

Include: What problem you're solving, who your target customers are, and how your solution works."
                    className="min-h-[200px] text-lg bg-background text-foreground resize-none"
                    value={formData.businessDescription}
                    onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formData.businessDescription.length} characters
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formData.businessDescription.length > 50 ? '✅ Good detail' : '💡 Add more details for better results'}
                    </span>
                  </div>
                </div>

                {/* Tips Section */}
                {formData.businessDescription.length < 100 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-left"
                  >
                    <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Pro Tips for Better Results
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Be specific about the problem you're solving</li>
                      <li>• Mention your target audience or customers</li>
                      <li>• Describe how your solution works</li>
                      <li>• Include any unique features or advantages</li>
                      <li>• Mention the industry or market you're targeting</li>
                    </ul>
                  </motion.div>
                )}
              </div>

              <Button
                size="lg"
                variant="gradient"
                className="mt-8 w-full sm:w-auto"
                onClick={() => setStep(2)}
                disabled={!formData.businessDescription || formData.businessDescription.length < 20}
              >
                {formData.businessDescription.length < 20 ? (
                  'Please add more details to continue'
                ) : (
                  <>
                    Continue to Refinement <ChevronRight className="ml-2"/>
                  </>
                )}
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
              {/* Progress Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">1</div>
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">2</div>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold">3</div>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-2 text-card-foreground">Refine Your Business Vision</h1>
                <p className="text-muted-foreground">
                  Answer these questions to help the AI understand your business better and generate a more accurate canvas.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium text-primary">
                    {refinementQuestions.filter(q => formData[q.key]).length} / {refinementQuestions.length}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(refinementQuestions.filter(q => formData[q.key]).length / refinementQuestions.length) * 100}%` 
                    }}
                  />
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-8">
                {refinementQuestions.map((q, index) => (
                  <motion.div 
                    key={q.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      formData[q.key] 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-background/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="font-semibold text-lg block text-card-foreground">
                            {q.label}
                          </Label>
                          {formData[q.key] && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-600 border-green-500/30">
                              ✓ Answered
                            </Badge>
                          )}
                        </div>
                        {q.description && (
                          <p className="text-muted-foreground mb-4 text-sm">
                            {q.description}
                          </p>
                        )}
                        
                        {q.type === 'radio' ? (
                    <RadioGroup
                      onValueChange={(value) => handleInputChange(q.key, value)}
                      value={formData[q.key]}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                          >
                            {q.options?.map((opt) => (
                              <div key={opt.value} className="flex items-center">
                                <RadioGroupItem value={opt.value} id={`${q.key}-${opt.value}`} className="peer sr-only"/>
                                <Label 
                                  htmlFor={`${q.key}-${opt.value}`} 
                                  className="flex flex-col items-start justify-between rounded-lg border-2 border-border bg-background p-4 hover:bg-accent/10 text-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary w-full cursor-pointer transition-all duration-200"
                                >
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">{opt.icon}</span>
                                    <span className="font-medium">{opt.value}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground ml-11">{opt.description}</p>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                        ) : q.type === 'text' ? (
                          <div className="space-y-2">
                            <Textarea
                              placeholder={(q as any).placeholder || ''}
                              className="min-h-[100px] text-lg bg-background text-foreground"
                              value={formData[q.key] || ''}
                              onChange={(e) => handleInputChange(q.key, e.target.value)}
                            />
                            {formData[q.key] && formData[q.key].length > 10 && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Sparkles className="w-3 h-3" />
                                <span>AI can provide suggestions to improve this answer</span>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2" /> Back
                </Button>
                
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {refinementQuestions.filter(q => formData[q.key]).length} of {refinementQuestions.length} questions answered
                  </div>
                  
                  {/* Summary Button */}
                  {refinementQuestions.filter(q => formData[q.key]).length === refinementQuestions.length && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Show summary modal or expand summary section
                        toast({
                          title: 'Ready to Generate!',
                          description: `All ${refinementQuestions.length} questions have been answered. Your canvas will be generated with enhanced AI insights.`,
                        });
                      }}
                    >
                      <LayoutList className="mr-2" />
                      Review Answers
                    </Button>
                  )}
                  
                <Button
                  size="lg"
                  variant="gradient"
                  onClick={() => handleGenerateCanvas(false)}
                    disabled={isLoading || refinementQuestions.filter(q => formData[q.key]).length < refinementQuestions.length}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 animate-spin" /> Generating...
                      </>
                    ) : (
                      <>
                        Generate Canvas <ChevronRight className="ml-2"/>
                      </>
                    )}
                </Button>
                </div>
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
                      <Button variant="secondary" size="sm" onClick={handleSave} disabled={isLoading}>
                        <Save className="mr-2" /> {canvasId ? 'Save' : 'Save'}
                      </Button>
                    </div>

                    <Separator orientation='vertical' className='h-8' />
                    
                    <div className='flex items-center gap-3'>
                      <Label className="font-semibold text-base text-foreground">Logo</Label>
                      <input type="file" id="logo-upload" className="hidden" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} disabled={isLoading}/>
                      <Button asChild variant="outline" size="sm">
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          {isLoading ? <Loader className="mr-2 animate-spin" /> : <Upload className="mr-2"/>}
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
                              onChange={e => handleColorChange(key, e.target.value)}
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
                      {/* Enhanced Security Watermark */}
                      {!removeWatermark && (
                        <>
                          {/* Large diagonal watermark covering the entire canvas */}
                          <div className="absolute inset-0 z-30 pointer-events-none">
                            <div 
                              className="absolute inset-0 opacity-5"
                              style={{
                                background: `repeating-linear-gradient(
                                  45deg,
                                  transparent,
                                  transparent 100px,
                                  ${colors.primary}20 100px,
                                  ${colors.primary}20 200px
                                )`,
                              }}
                            />
                            {/* Large centered watermark */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div 
                                className="text-center opacity-10"
                                style={{ color: colors.primary }}
                              >
                                <div className="text-6xl font-bold mb-2">InnoCanvas</div>
                                <div className="text-xl">Business Model Canvas</div>
                                <div className="text-sm mt-2">
                                  Generated on {new Date().toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            {/* Corner watermark */}
                            <div className="absolute bottom-4 right-4 z-40">
                              <div 
                                className="text-center opacity-20"
                                style={{ color: colors.primary }}
                              >
                                <div className="text-lg font-bold">InnoCanvas</div>
                                <div className="text-xs">Powered by AI</div>
                              </div>
                            </div>
                            {/* Top-left watermark */}
                            <div className="absolute top-4 left-4 z-40">
                              <div 
                                className="text-center opacity-15"
                                style={{ color: colors.primary }}
                              >
                                <div className="text-sm font-semibold">InnoCanvas</div>
                                <div className="text-xs">Secure</div>
                              </div>
                            </div>
                            {/* Bottom-left watermark */}
                            <div className="absolute bottom-4 left-4 z-40">
                              <div 
                                className="text-center opacity-15"
                                style={{ color: colors.primary }}
                              >
                                <div className="text-xs">
                                  {user?.email ? `User: ${user.email.split('@')[0]}` : 'User'}
                                </div>
                                <div className="text-xs">
                                  {new Date().toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            {/* Top-right watermark */}
                            <div className="absolute top-4 right-4 z-40">
                              <div 
                                className="text-center opacity-15"
                                style={{ color: colors.primary }}
                              >
                                <div className="text-xs font-semibold">BMC</div>
                                <div className="text-xs">Protected</div>
                              </div>
                            </div>
                          </div>
                        </>
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
        <Link href="/" className="text-zinc-100 font-bold tracking-tight text-lg hover:text-white duration-200">InnoCanvas</Link>
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
              {suggestions?.suggestions.map((suggestion: string, index: number) => (
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
  return <BmcGeneratorPageClient />;
}