import { Bot, Download, LayoutTemplate, Share2 } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Bot className="w-8 h-8 text-primary" />,
      title: "AI-Powered Generation",
      description: "Describe your business, and our AI will generate a detailed Business Model Canvas for you in seconds.",
    },
    {
      icon: <LayoutTemplate className="w-8 h-8 text-primary" />,
      title: "Smart Templates",
      description: "Choose from a variety of beautiful, modern templates to visualize your business model in style.",
    },
    {
      icon: <Download className="w-8 h-8 text-primary" />,
      title: "Easy Export",
      description: "Export your canvas to PDF or PNG formats with a single click, ready for presentations or reports.",
    },
    {
      icon: <Share2 className="w-8 h-8 text-primary" />,
      title: "Collaborate & Share",
      description: "Share a link to your canvas with team members or stakeholders for easy collaboration and feedback.",
    },
  ];

  return (
    <section id="features" className="container py-20 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Why InnoCanvas?</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to transform your business idea into a concrete plan.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, i) => (
           <div 
            key={feature.title} 
            className="bg-card p-6 flex flex-col items-start text-left transition-all duration-300 hover:border-primary/50 hover:scale-105 rounded-2xl border"
            >
              <div className="p-3 bg-secondary rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
        ))}
      </div>
    </section>
  );
}
