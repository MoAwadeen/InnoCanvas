
import { PencilLine, Bot, Download } from 'lucide-react';

const steps = [
  {
    icon: <PencilLine className="w-10 h-10 text-primary" />,
    title: 'Step 1: Describe Your Business',
    description: 'Start by providing a simple description of your business idea. Our intuitive interface makes it easy to capture your vision.',
  },
  {
    icon: <Bot className="w-10 h-10 text-primary" />,
    title: 'Step 2: AI Generates the Canvas',
    description: 'Our intelligent AI analyzes your input and instantly generates a comprehensive Business Model Canvas, filled with strategic insights.',
  },
  {
    icon: <Download className="w-10 h-10 text-primary" />,
    title: 'Step 3: Download & Customize',
    description: 'Your canvas is ready! Download it, customize the branding, and consult with our AI experts to refine your strategy further.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container py-20 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Transform your idea into a strategic plan in three simple steps.
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-10 h-1 w-4/5 max-w-2xl bg-border/50 rounded-full hidden md:block" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center relative">
              <div className="bg-secondary p-4 rounded-full border-4 border-background mb-4 z-10">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
