import { BrainCircuit, MessageSquareQuote, FileDown } from 'lucide-react';

const features = [
  {
    title: 'AI-generated Business Model Canvas',
    description: 'Describe your idea, and our AI instantly crafts a detailed, editable Business Model Canvas tailored to your vision.',
    icon: <BrainCircuit className="w-10 h-10 text-primary" />,
  },
  {
    title: 'Smart Consultation with AI Experts',
    description: 'Engage with AI-powered personas for insightful feedback and strategic advice to refine your business model.',
    icon: <MessageSquareQuote className="w-10 h-10 text-primary" />,
  },
  {
    title: 'Download, Customize, and Share with Ease',
    description: 'Export your canvas to various formats, apply custom branding, and share seamlessly with stakeholders.',
    icon: <FileDown className="w-10 h-10 text-primary" />,
  },
];

export default function Features() {
  return (
    <section id="features" className="container py-20 md:py-32">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
        {features.map((feature) => (
           <div key={feature.title} className="flex justify-center">
              <div className="card-glass shine-effect text-center p-8 flex flex-col items-center transition-all duration-300 hover:scale-105">
                <div className="text-primary mb-6">{feature.icon}</div>
                <div className="text-xl font-bold text-foreground mb-3">{feature.title}</div>
                <div className="text-muted-foreground">{feature.description}</div>
              </div>
           </div>
        ))}
      </div>
    </section>
  );
}
