
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Palette, Gem, Download, Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const bmcData = {
    keyPartnerships: '- Strategic Alliances\n- Tech Providers\n- Marketing Agencies',
    keyActivities: '- Platform Development\n- Content Creation\n- Community Management',
    keyResources: '- Proprietary Algorithm\n- Skilled Team\n- Brand Reputation',
    valuePropositions: 'An AI-powered platform for instant, high-quality Business Model Canvases.',
    customerRelationships: '- Automated Support\n- Community Forum\n- Dedicated Account Manager',
    channels: '- Social Media Marketing\n- Content Marketing (Blogs, Webinars)\n- Direct Sales Team',
    customerSegments: '- Startups & Entrepreneurs\n- Business Students\n- Accelerators & Incubators',
    costStructure: '- R&D and Technology Infrastructure\n- Salaries & Team Costs\n- Marketing & Sales Expenses',
    revenueStreams: '- Subscription (SaaS)\n- One-time Template Purchases\n- White-label Licensing',
};

const themes = [
    { name: 'Default', primary: 'hsl(205 90.2% 48.2%)', card: 'hsl(217 33% 25%)', background: 'hsl(241 100% 27%)', foreground: 'hsl(210 40% 98%)' },
    { name: 'Forest', primary: '#4A934A', card: '#2E3D32', background: '#1A261F', foreground: '#E6F0E6' },
    { name: 'Crimson', primary: '#D32F2F', card: '#4F2A2A', background: '#2C1D1D', foreground: '#F5E8E8' },
    { name: 'Royal', primary: '#7B41C2', card: '#36284F', background: '#1E162A', foreground: '#EFE9F7' },
    { name: 'Sunrise', primary: '#F57C00', card: '#5A3D1C', background: '#2E1F0F', foreground: '#FCEFE2' },
];

export default function PreviewPage() {
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [removeWatermark, setRemoveWatermark] = useState(false);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const canvasStyle = {
    '--theme-primary': selectedTheme.primary,
    '--theme-card': selectedTheme.card,
    '--theme-background': selectedTheme.background,
    '--theme-foreground': selectedTheme.foreground,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col" style={{ backgroundColor: 'var(--theme-background)' }}>
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
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
                {logoUrl && <Image src={logoUrl} alt="Uploaded logo" width={100} height={100} className="mt-4 rounded-lg" />}
              </div>
              <div>
                 <Label className="font-semibold text-lg mb-2 block text-foreground">Color Theme</Label>
                 <div className="flex flex-wrap gap-3">
                    {themes.map(theme => (
                        <button key={theme.name} onClick={() => setSelectedTheme(theme)} className={cn("h-10 w-10 rounded-full border-2 transition-all", selectedTheme.name === theme.name ? 'border-vivid-pink ring-2 ring-vivid-pink' : 'border-border')} style={{ backgroundColor: theme.primary }}/>
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
                <Button variant='secondary'>Get Feedback</Button>
           </div>
        </div>

        {/* Right Column: Canvas Preview */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={canvasStyle}>
           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-card)'}}>
              {Object.entries(bmcData).map(([key, value]) => (
                <div key={key} className={cn(
                  "p-4 rounded-lg flex flex-col min-h-[120px]",
                  key === 'costStructure' && 'md:col-span-2 lg:col-span-2',
                  key === 'revenueStreams' && 'md:col-span-1 lg:col-span-3'
                )} style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-foreground)' }}>
                  <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--theme-primary)'}}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                  <p className="text-xs whitespace-pre-wrap">{value}</p>
                </div>
              ))}
           </div>
           {!removeWatermark && (
            <div className='text-center text-xs text-muted-foreground mt-4'>Powered by InnoCanvas</div>
           )}
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 mt-auto p-4">
        <div className="card-glass max-w-2xl mx-auto rounded-full p-4">
            <div className="flex items-center justify-center">
                 <Button size="lg" variant="gradient" className='breathing-cta'>
                    <Download className='mr-2'/>
                    Download Deck
                 </Button>
            </div>
        </div>
      </footer>
    </div>
  );
}

