
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { generateBMC, GenerateBMCInput, GenerateBMCOutput } from '@/ai/flows/generate-bmc';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';

type BMCBlock = {
  title: string;
  icon: React.ReactNode;
  content: string;
  key: keyof GenerateBMCOutput;
};

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
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<GenerateBMCInput>>({
    businessDescription: '',
    customerSegments: '',
    valuePropositions: '',
    channels: '',
    customerRelationships: 'Automated', // Default value
    revenueStreams: '',
    keyActivities: 'Software Development', // Default
    keyResources: '',
    keyPartnerships: 'Tech Providers', // Default
    costStructure: 'Technology Infrastructure', // Default
  });
  const [bmcData, setBmcData] = useState<GenerateBMCOutput | null>(null);

  const handleInputChange = (
    key: keyof GenerateBMCInput,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerateCanvas = async () => {
    setIsLoading(true);
    setStep(3);
    try {
      const result = await generateBMC(formData as GenerateBMCInput);
      setBmcData(result);
    } catch (error) {
      console.error('Error generating BMC:', error);
      // You can add toast notifications here to show errors
    } finally {
      setIsLoading(false);
    }
  };

  const initialBmcBlocks: Omit<BMCBlock, 'content'>[] = [
    { title: 'Key Partners', icon: <Handshake className="w-5 h-5" />, key: 'keyPartnerships' },
    { title: 'Key Activities', icon: <Wrench className="w-5 h-5" />, key: 'keyActivities' },
    { title: 'Key Resources', icon: <Package className="w-5 h-5" />, key: 'keyResources' },
    { title: 'Value Propositions', icon: <Lightbulb className="w-5 h-5" />, key: 'valuePropositions' },
    { title: 'Customer Relationships', icon: <Heart className="w-5 h-5" />, key: 'customerRelationships' },
    { title: 'Channels', icon: <Truck className="w-5 h-5" />, key: 'channels' },
    { title: 'Customer Segments', icon: <Users className="w-5 h-5" />, key: 'customerSegments' },
    { title: 'Cost Structure', icon: <FileText className="w-5 h-5" />, key: 'costStructure' },
    { title: 'Revenue Streams', icon: <DollarSign className="w-5 h-5" />, key: 'revenueStreams' },
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
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl text-center">
              <h1 className="text-4xl font-bold mb-4">Tell Us About Your Idea</h1>
              <p className="text-muted-foreground mb-8">
                Start with your business name and a brief description. The more detail, the better!
              </p>
              <Textarea
                placeholder="Ex: A mobile app that helps tourists explore historical places using AR…"
                className="min-h-[150px] bg-black/20 border-white/30 text-lg"
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
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
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
                      className="grid grid-cols-2 md:grid-cols-3 gap-4"
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
                onClick={handleGenerateCanvas}
              >
                Generate Canvas
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
                <div>
                    <div className="flex flex-wrap gap-4 justify-center mb-8">
                        <Button variant="outline"><RefreshCw className="mr-2" /> Regenerate</Button>
                        <Button variant="outline"><Edit className="mr-2" /> Edit</Button>
                        <Button variant="outline"><Save className="mr-2" /> Save to My Canvases</Button>
                        <Button variant="outline"><Palette className="mr-2" /> Templates</Button>
                        <Button variant="outline"><Download className="mr-2" /> Export as PDF</Button>
                        <Button variant="outline"><Share2 className="mr-2" /> Share Public Link</Button>
                    </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* Top Row */}
                    <BmcCard {...initialBmcBlocks[0]} content={bmcData.keyPartnerships} className="lg:col-span-1" />
                    <div className="lg:col-span-1 grid grid-rows-2 gap-4">
                      <BmcCard {...initialBmcBlocks[1]} content={bmcData.keyActivities} />
                      <BmcCard {...initialBmcBlocks[2]} content={bmcData.keyResources} />
                    </div>
                    <BmcCard {...initialBmcBlocks[3]} content={bmcData.valuePropositions} className="lg:col-span-1" />
                    <div className="lg:col-span-1 grid grid-rows-2 gap-4">
                      <BmcCard {...initialBmcBlocks[4]} content={bmcData.customerRelationships} />
                      <BmcCard {...initialBmcBlocks[5]} content={bmcData.channels} />
                    </div>
                    <BmcCard {...initialBmcBlocks[6]} content={bmcData.customerSegments} className="lg:col-span-1" />
                    {/* Bottom Row */}
                    <BmcCard {...initialBmcBlocks[7]} content={bmcData.costStructure} className="lg:col-span-2" />
                    <BmcCard {...initialBmcBlocks[8]} content={bmcData.revenueStreams} className="lg:col-span-3" />
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

const BmcCard = ({ title, icon, content, className }: BMCBlock & { className?: string }) => (
  <div className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg flex flex-col ${className}`}>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <h3 className="font-bold text-lg">{title}</h3>
    </div>
    <Textarea
      defaultValue={content}
      className="bg-transparent border-0 text-base text-white/80 flex-grow resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  </div>
);
