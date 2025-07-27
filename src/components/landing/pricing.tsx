"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "For individuals getting started.",
      features: [
        "3 canvases/month",
        "AI-powered generation",
        "Basic export (PNG)",
        "Standard templates",
      ],
      cta: "Start for Free",
    },
    {
      name: "Pro",
      price: { monthly: 8, yearly: 72 },
      description: "For professionals and small teams.",
      features: [
        "Unlimited canvases",
        "Advanced export (PDF, PNG)",
        "All visual templates",
        "Priority support",
      ],
      cta: "Go Pro",
      popular: true,
    },
    {
      name: "Premium",
      price: { monthly: 15, yearly: 144 },
      description: "For businesses and power users.",
      features: [
        "All Pro features",
        "Custom branding tools",
        "Team access & collaboration",
        "Premium templates",
      ],
      cta: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="container py-20 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Choose Your Plan</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Simple, transparent pricing. No hidden fees.
        </p>
      </div>

      <div className="flex justify-center items-center gap-4 mb-10">
        <Label htmlFor="billing-cycle" className={cn(!isYearly && "text-primary")}>Monthly</Label>
        <Switch
          id="billing-cycle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <Label htmlFor="billing-cycle" className={cn(isYearly && "text-primary")}>
            Yearly <span className="text-sm font-medium text-accent">(Save 25%)</span>
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "rounded-2xl p-1 relative",
              plan.popular ? "bg-gradient-to-tr from-primary to-accent" : "bg-border"
            )}
          >
            <div className="p-8 h-full bg-background/90 backdrop-blur-sm rounded-[14px] flex flex-col">
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <div className="px-3 py-1 text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-accent rounded-full shadow-md">
                    Most Popular
                  </div>
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold">
                  ${isYearly ? plan.price.yearly / 12 : plan.price.monthly}
                </span>
                <span className="text-muted-foreground text-lg">/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className={cn("w-full", !plan.popular && "bg-primary/80")}
              >
                {plan.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
