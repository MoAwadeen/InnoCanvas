import { BrainCircuit, MessageSquareQuote, FileDown, Zap, TrendingUp, Settings, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: 'Connect Your Tools',
    description: 'Sync your existing apps data sources one click',
    icon: <Zap className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Automate Workflows',
    description: 'Set smart triggers actions eliminate repetitive tasks',
    icon: <Settings className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Track and Analyze',
    description: 'Get real-time insights, performance dashboard',
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Optimize and Scale',
    description: 'AI suggest improvements streamline operations',
    icon: <Target className="w-8 h-8 text-primary" />,
  },
];

export default function Features() {
  return (
    <section id="features" className="container py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Intelligent way to manage work
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <Card key={feature.title} className="card-glass border-border/50 hover:border-primary/50 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-xl">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
