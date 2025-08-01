import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, BookOpen, TrendingUp } from "lucide-react";

export default function Insights() {
  const insights = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Lead Scoring",
      description: "AI continuously refines scoring models to ensure you're always targeting opportunities"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Productivity Insights",
      description: "Gain a clear understanding of how your sales team is performing with real-time productivity analytics"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Sales Playbook Automation",
      description: "Automatically suggest the next-best actions and assets based on deal."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Performance Tracking & KPIs",
      description: "Stay on top of your sales goals with powerful performance tracking tools."
    }
  ];

  return (
    <section className="container py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Opportunity insights and deal tracking
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {insights.map((insight, index) => (
          <Card key={index} className="card-glass border-border/50 hover:border-primary/50 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-xl">
                  {insight.icon}
                </div>
                <CardTitle className="text-lg">{insight.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
} 