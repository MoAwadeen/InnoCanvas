
'use client';

import { useState, useRef } from 'react';
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
  Palette,
  Loader,
  ChevronRight,
  Bot,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { generateBMC, GenerateBMCInput, GenerateBMCOutput } from '@/ai/flows/generate-bmc';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type BMCBlock = {
  title: string;
  icon: React.ReactNode;
  content: string;
  keyProp: keyof GenerateBMCOutput;
};

type Template = 'glass' | 'minimal' | 'dark';

const templates: { name: Template; label: string }[] = [
    { name: 'glass', label: 'Glassmorphism' },
    { name: 'minimal', label: 'Minimal Light' },
    { name: 'dark', label: 'Minimal Dark' },
];


const refinementQuestions = [
  {
    key: 'customerSegments',
    label: 'What is your target customer segment?',
    options: ['Students', 'SMEs', 'Tourists', 'Enterprises', 'Developers'],
  },
  {
    key: 'valuePropositions',
    label: 'What primary value do you provide?',
    options: ['Convenience', 'Cost-Saving', 'AI Automation', 'Entertainment', 'Productivity'],
  },
  {
    key: 'channels',
    label: 'What channels do you plan to use?',
    options: ['Social Media', 'Content Marketing', 'Direct Sales', 'Partnerships', 'App Stores'],
  },
  {
    key: 'revenueStreams',
    label: 'What is your revenue model?',
    options: ['Subscription', 'Advertisements', 'One-time Sale', 'Freemium', 'Commission'],
  },
  {
    key: 'keyResources',
    label: 'What are your key resources?',
    options: ['Proprietary Technology', 'Skilled Team', 'Brand Reputation', 'Capital', 'Patents'],
  },
];

export default function BmcGeneratorPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template>('glass');
  const [formData, setFormData] = useState<Partial<GenerateBMCInput>>({
    businessDescription: '',
    customerSegments: '',
    valuePropositions: '',
    channels: '',
    customerRelationships: 'Automated', // Default value
    keyActivities: 'Software Development', // Default
    keyPartnerships: 'Tech Providers', // Default
    costStructure: 'Technology Infrastructure', // Default
  });
  const [bmcData, setBmcData] = useState<GenerateBMCOutput | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

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
    if (!regenerate) {
        setStep(3);
    }
    setIsLoading(true);
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

  const handleSave = () => {
    // Firestore saving logic would go here
    toast({
      title: 'Canvas Saved!',
      description: 'Your masterpiece is safe in "My Canvases".',
    });
  };
  
  const handleExport = () => {
    if (canvasRef.current) {
        const originalTemplate = currentTemplate;
        toast({
            title: 'Exporting PDF...',
            description: 'Please wait while we generate your PDF.',
        });
        
        // Temporarily switch to a print-friendly theme
        setCurrentTemplate('minimal');

        // Allow state to update before rendering canvas
        setTimeout(() => {
            html2canvas(canvasRef.current!, {
                useCORS: true,
                backgroundColor: null, // Use transparent background
                scale: 2, // Increase resolution
            }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save('innocanvas-bmc.pdf');
                
                // Revert to original template
                setCurrentTemplate(originalTemplate);

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
                // Revert to original template on error
                setCurrentTemplate(originalTemplate);
            });
        }, 100); // Small delay to ensure DOM update
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
  
  const cycleTemplate = () => {
      const currentIndex = templates.findIndex(t => t.name === currentTemplate);
      const nextIndex = (currentIndex + 1) % templates.length;
      setCurrentTemplate(templates[nextIndex].name);
  }

  const initialBmcBlocks: Omit<BMCBlock, 'content' | 'isEditing'>[] = [
    { title: 'Key Partners', icon: <Handshake className="w-5 h-5" />, keyProp: 'keyPartnerships' },
    { title: 'Key Activities', icon: <Wrench className="w-5 h-5" />, keyProp: 'keyActivities' },
    { title: 'Key Resources', icon: <Package className="w-5 h-5" />, keyProp: 'keyResources' },
    { title: 'Value Propositions', icon: <Lightbulb className="w-5 h-5" />, keyProp: 'valuePropositions' },
    { title: 'Customer Relationships', icon: <Heart className="w-5 h-5" />, keyProp: 'customerRelationships' },
    { title: 'Channels', icon: <Truck className="w-5 h-5" />, keyProp: 'channels' },
    { title: 'Customer Segments', icon: <Users className="w-5 h-5" />, keyProp: 'customerSegments' },
    { title: 'Cost Structure', icon: <FileText className="w-5 h-5" />, keyProp: 'costStructure' },
    { title: 'Revenue Streams', icon: <DollarSign className="w-5 h-5" />, keyProp: 'revenueStreams' },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-border/20 rounded-2xl p-8 shadow-2xl text-center">
              <h1 className="text-4xl font-bold mb-4">Tell Us About Your Idea</h1>
              <p className="text-muted-foreground mb-8">
                Start with your business name and a brief description. The more detail, the better!
              </p>
              <Textarea
                placeholder="Ex: A mobile app that helps tourists explore historical places using AR…"
                className="min-h-[150px] bg-black/20 border-border/30 text-lg"
                value={formData.businessDescription}
                onChange={(e) => handleInputChange('businessDescription', e.target.value)}
              />
              <Button
                size="lg"
                className="mt-8 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl transition-shadow w-full"
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
            className="w-full max-w-3xl"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-border/20 rounded-2xl p-8 shadow-2xl">
              <h1 className="text-3xl font-bold mb-2 text-center">Refine Your Business Vision</h1>
              <p className="text-muted-foreground mb-8 text-center">
                Answer these questions to help the AI understand your business better.
              </p>
              <div className="space-y-6">
                {refinementQuestions.map((q) => (
                  <div key={q.key}>
                    <Label className="font-semibold text-lg mb-2 block">{q.label}</Label>
                    <RadioGroup
                      onValueChange={(value) => handleInputChange(q.key as keyof GenerateBMCInput, value)}
                      value={formData[q.key as keyof GenerateBMCInput]}
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                    >
                      {q.options.map((opt) => (
                        <div key={opt} className="flex items-center">
                          <RadioGroupItem value={opt} id={`${q.key}-${opt}`} className="peer sr-only"/>
                          <Label htmlFor={`${q.key}-${opt}`} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary w-full cursor-pointer">
                            {opt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
              <Button
                size="lg"
                className="mt-8 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl transition-shadow w-full"
                onClick={() => handleGenerateCanvas(false)}
                disabled={isLoading}
              >
                {isLoading ? <><Loader className="mr-2 animate-spin" /> Generating...</> : 'Generate Canvas'}
              </Button>
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-96 text-white">
                <Loader className="w-16 h-16 animate-spin mb-4 text-primary" />
                <h2 className="text-2xl font-semibold">Generating your canvas...</h2>
                <p className="text-muted-foreground">The AI is working its magic!</p>
              </div>
            ) : (
              bmcData && (
                <div data-template={currentTemplate}>
                    <div className="flex flex-wrap gap-4 justify-center mb-8">
                        <Button variant="outline" onClick={() => handleGenerateCanvas(true)} disabled={isLoading}>
                            {isLoading ? <Loader className="mr-2 animate-spin" /> : <RefreshCw className="mr-2" />} 
                            Regenerate
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                            <Edit className="mr-2" /> {isEditing ? 'Done Editing' : 'Edit'}
                        </Button>
                        <Button variant="outline" onClick={handleSave}><Save className="mr-2" /> Save to My Canvases</Button>
                        <Button variant="outline" onClick={cycleTemplate}><Palette className="mr-2" /> {templates.find(t => t.name === currentTemplate)?.label}</Button>
                        <Button variant="outline" onClick={handleExport}><Download className="mr-2" /> Export as PDF</Button>
                        <Button variant="outline" onClick={handleShare}><Share2 className="mr-2" /> Share Public Link</Button>
                    </div>
                  <div ref={canvasRef} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
                    {/* Top Row */}
                    <BmcCard key={initialBmcBlocks[0].keyProp} {...initialBmcBlocks[0]} content={bmcData.keyPartnerships} className="lg:col-span-1" isEditing={isEditing} onContentChange={handleBmcDataChange} />
                    <div className="lg:col-span-1 grid grid-rows-2 gap-4">
                      <BmcCard key={initialBmcBlocks[1].keyProp} {...initialBmcBlocks[1]} content={bmcData.keyActivities} isEditing={isEditing} onContentChange={handleBmcDataChange} />
                      <BmcCard key={initialBmcBlocks[2].keyProp} {...initialBmcBlocks[2]} content={bmcData.keyResources} isEditing={isEditing} onContentChange={handleBmcDataChange} />
                    </div>
                    <BmcCard key={initialBmcBlocks[3].keyProp} {...initialBmcBlocks[3]} content={bmcData.valuePropositions} className="lg:col-span-1" isEditing={isEditing} onContentChange={handleBmcDataChange} />
                    <div className="lg:col-span-1 grid grid-rows-2 gap-4">
                      <BmcCard key={initialBmcBlocks[4].keyProp} {...initialBmcBlocks[4]} content={bmcData.customerRelationships} isEditing={isEditing} onContentChange={handleBmcDataChange} />
                      <BmcCard key={initialBmcBlocks[5].keyProp} {...initialBmcBlocks[5]} content={bmcData.channels} isEditing={isEditing} onContentChange={handleBmcDataChange} />
                    </div>
                    <BmcCard key={initialBmcBlocks[6].keyProp} {...initialBmcBlocks[6]} content={bmcData.customerSegments} className="lg:col-span-1" isEditing={isEditing} onContentChange={handleBmcDataChange} />
                    {/* Bottom Row */}
                    <BmcCard key={initialBmcBlocks[7].keyProp} {...initialBmcBlocks[7]} content={bmcData.costStructure} className="md:col-span-2 lg:col-span-2" isEditing={isEditing} onContentChange={handleBmcDataChange} />
                    <BmcCard key={initialBmcBlocks[8].keyProp} {...initialBmcBlocks[8]} content={bmcData.revenueStreams} className="md:col-span-1 lg:col-span-3" isEditing={isEditing} onContentChange={handleBmcDataChange} />
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0a23] via-[#000428] to-[#004e92] text-white p-4 md:p-8">
       <header className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">InnoCanvas</span>
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className={step === 1 ? 'text-primary' : 'text-muted-foreground'}>Step 1</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className={step === 2 ? 'text-primary' : 'text-muted-foreground'}>Step 2</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className={step === 3 ? 'text-primary' : 'text-muted-foreground'}>Step 3</span>
          </div>
        </header>
      <main className="flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </main>
    </div>
  );
}

type BmcCardProps = Omit<BMCBlock, 'content'> & {
  className?: string;
  isEditing: boolean;
  content: string;
  onContentChange: (key: keyof GenerateBMCOutput, value: string) => void;
};

const BmcCard = ({ title, icon, content, className, isEditing, keyProp, onContentChange }: BmcCardProps) => (
  <div className={cn(
    `rounded-2xl p-4 shadow-lg flex flex-col transition-all`,
    // Glass Template
    `data-[template=glass]:bg-white/10 data-[template=glass]:backdrop-blur-lg data-[template=glass]:border data-[template=glass]:border-border/20`,
    // Minimal Light Template
    `data-[template=minimal]:bg-gray-50 data-[template=minimal]:text-gray-800 data-[template=minimal]:border-gray-900 data-[template=minimal]:border`,
    // Minimal Dark Template
    `data-[template=dark]:bg-gray-900 data-[template=dark]:text-gray-200 data-[template=dark]:border data-[template=dark]:border-gray-700`,
    className
    )}>
    <div className={cn(
      "flex items-center gap-2 mb-2",
      "data-[template=minimal]:text-gray-800",
      "data-[template=dark]:text-gray-200",
      "data-[template=glass]:text-white"
      )}>
      {icon}
      <h3 className="font-bold text-lg">{title}</h3>
    </div>
    <Textarea
      value={content}
      readOnly={!isEditing}
      onChange={(e) => onContentChange(keyProp, e.target.value)}
      className={cn(
        "bg-transparent border-0 text-base flex-grow resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
        isEditing ? "cursor-text" : "cursor-default",
        // Glass Template
        `data-[template=glass]:text-white/80`,
        // Minimal Light Template
        `data-[template=minimal]:text-gray-600 data-[template=minimal]:placeholder:text-gray-400`,
         // Minimal Dark Template
        `data-[template=dark]:text-gray-300 data-[template=dark]:placeholder:text-gray-500`,

        isEditing && `data-[template=minimal]:border data-[template=dark]:border`,
      )}
    />
  </div>
);
    

    

    