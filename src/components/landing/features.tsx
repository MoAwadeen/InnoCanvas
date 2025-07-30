
import { Sparkles, LayoutTemplate, Share2, Download } from 'lucide-react';

const features = [
  {
    title: 'AI-Powered Generation',
    description:
      'Describe your business, and our AI will generate a detailed Business Model Canvas for you in seconds.',
    icon: <Sparkles className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Smart Visual Templates',
    description:
      'Choose from a variety of beautiful, modern templates to visualize your business model in style.',
    icon: <LayoutTemplate className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Easy Export Options',
    description:
      'Export your canvas to PDF or PNG formats with a single click, ready for presentations or reports.',
    icon: <Download className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Collaborate & Share',
    description:
      'Share a link to your canvas with team members or stakeholders for easy collaboration and feedback.',
    icon: <Share2 className="w-8 h-8 text-primary" />,
  },
];

export default function Features() {
  return (
    <section id="features" className="container py-20 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Why InnoCanvas?</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to transform your business idea into a concrete plan.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
        {features.map((feature) => (
           <div key={feature.title} className="flex justify-center">
              <div className="bg-secondary/50 border border-border rounded-xl text-center p-8 flex flex-col items-center transition-all hover:border-primary/50 hover:bg-secondary">
                <div className="text-primary mb-4">{feature.icon}</div>
                <div className="text-xl font-bold text-foreground mb-2">{feature.title}</div>
                <div className="text-muted-foreground">{feature.description}</div>
              </div>
           </div>
        ))}
      </div>
    </section>
  );
}
