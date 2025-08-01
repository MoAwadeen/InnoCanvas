
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "Silver Plan",
      price: "$59",
      period: "/month",
      description: "Perfect for startups and small teams",
      features: [
        "Up to 10 users",
        "Smart pipeline management", 
        "AI-driven sales insights",
        "5 automation workflows",
        "Email & chat support"
      ],
      popular: false,
      cta: "Book A Free Demo"
    },
    {
      name: "Gold Plan",
      price: "$49",
      period: "/month", 
      description: "Built for growing businesses",
      features: [
        "Unlimited users",
        "Advanced forecasting & reporting",
        "Custom automation rules",
        "CRM & tool integrations",
        "24/7 AI priority support"
      ],
      popular: true,
      cta: "Book A Free Demo"
    }
  ];

  return (
    <section id="pricing" className="container py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Find the right plan for your needs
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Supporters receive a 30% discount on early access plus an extra 20% off the yearly plan.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4 p-1 bg-muted rounded-lg">
          <Button variant="ghost" size="sm" className="rounded-md">
            Monthly
          </Button>
          <Button variant="default" size="sm" className="rounded-md">
            Yearly
          </Button>
          <Badge variant="secondary" className="ml-2">SAVE 20%</Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={index} className={`card-glass border-border/50 relative ${plan.popular ? 'border-primary/50 ring-2 ring-primary/20' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Link href="/register">
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </Link>
              
              <div className="space-y-4">
                <p className="text-sm font-semibold">Features Included:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
