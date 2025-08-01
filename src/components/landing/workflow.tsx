import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Bot, TrendingUp, Users, MessageSquare, Zap } from "lucide-react";

export default function Workflow() {
  const solutions = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Sales Analytics",
      description: "Get a 360° view of performance metrics, KPIs, and trends—all in one place",
      features: [
        "Real-Time Performance Insights",
        "Forecast with Accuracy", 
        "Identify Top Performers"
      ]
    },
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI Assistant",
      description: "Get instant answers, sales insights & suggestions from an integrated chatbot",
      features: [
        "Smart Task Automation",
        "Instant Knowledge Access"
      ]
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "AI Sales funnel",
      description: "Share updates, assign roles, and collaborate on deals without leaving the platform.",
      features: [
        "Real-Time Collaboration",
        "Centralized Communication",
        "Integrated File Sharing"
      ]
    }
  ];

  return (
    <section className="container py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Innovative AI solutions that helps
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {solutions.map((solution, index) => (
          <Card key={index} className="card-glass border-border/50 hover:border-primary/50 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-xl">
                  {solution.icon}
                </div>
                <CardTitle className="text-xl">{solution.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{solution.description}</p>
              <div className="space-y-2">
                {solution.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
} 