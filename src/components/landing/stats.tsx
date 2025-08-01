import { Card, CardContent } from "@/components/ui/card";
import { Zap, Users, Clock, TrendingUp } from "lucide-react";

export default function Stats() {
  const stats = [
    {
      number: "1100",
      suffix: "+",
      title: "Users",
      description: "This growing community reflects the reliability, performance",
      icon: <Users className="h-6 w-6" />
    },
    {
      number: "10",
      suffix: "x",
      title: "Faster",
      description: "Our system cuts down delays and manual effort",
      icon: <Zap className="h-6 w-6" />
    },
    {
      number: "24",
      suffix: "/7",
      title: "Support",
      description: "Whether it's day or night, our support system always on",
      icon: <Clock className="h-6 w-6" />
    }
  ];

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Automate Workflows",
      description: "Set smart triggers actions eliminate repetitive tasks"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Track & Analyze",
      description: "Get real-time insights, performance dashboard"
    }
  ];

  return (
    <section className="container py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Data-driven platforms for scalable success
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {stats.map((stat, index) => (
          <Card key={index} className="card-glass border-border/50 text-center">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  {stat.icon}
                </div>
              </div>
              <div className="mb-4">
                <span className="text-4xl md:text-5xl font-bold text-primary">
                  {stat.number}
                </span>
                <span className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.suffix}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
              <p className="text-muted-foreground text-sm">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="card-glass border-border/50">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/20 rounded-xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
} 