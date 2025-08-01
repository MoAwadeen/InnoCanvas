import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MessageSquare, Rocket, Target, Users, DollarSign } from "lucide-react";

export default function AIConsultant() {
  const aiFeatures = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Help me validate this startup idea",
      description: "Get AI-powered validation for your business concept"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Feature priority?",
      description: "Determine which features to build first"
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "How can I attract my first 100 customers?",
      description: "AI strategies for customer acquisition"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Set my pricing",
      description: "Data-driven pricing recommendations"
    }
  ];

  return (
    <section className="container py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Turn Your Idea Into a Business in Under 5 Minutes.
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="card-glass p-8 rounded-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">AI Business Consultant</h3>
                <p className="text-muted-foreground">
                  Validate your startup ideas, refine your value proposition, and define your ideal customer.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              This AI thinks like a founder, strategist, and incubator mentor.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiFeatures.map((feature, index) => (
                <Card key={index} className="bg-background/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="card-glass p-8 rounded-2xl">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-vivid-pink rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Ask.</h3>
                  <p className="text-sm text-muted-foreground">Ask any business question</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Launch.</h3>
                  <p className="text-sm text-muted-foreground">Get actionable insights</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Boost.</h3>
                  <p className="text-sm text-muted-foreground">Scale your business</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Save.</h3>
                  <p className="text-sm text-muted-foreground">Save time and resources</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Map.</h3>
                  <p className="text-sm text-muted-foreground">Map your business model</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Scale.</h3>
                  <p className="text-sm text-muted-foreground">Scale with confidence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 