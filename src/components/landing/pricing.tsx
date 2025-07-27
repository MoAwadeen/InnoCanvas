
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
      href: "/register"
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
      href: "/payment"
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
      cta: "Go Premium",
      popular: true,
      href: "/payment"
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
        <Label htmlFor="billing-cycle" className={cn("transition-colors font-medium", !isYearly ? "text-primary text-glow" : "text-muted-foreground")}>Monthly</Label>
        <Switch
          id="billing-cycle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
          className="data-[state=checked]:bg-accent"
        />
        <Label htmlFor="billing-cycle" className={cn("transition-colors font-medium", isYearly ? "text-accent text-glow" : "text-muted-foreground")}>
            Yearly <span className="text-sm font-medium text-green-400">(Save 25%)</span>
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "glass-card p-8 flex flex-col transition-all duration-300",
              plan.popular ? "border-accent/50 shadow-[0_0_30px_hsl(var(--accent)/0.3)]" : "hover:border-white/20"
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1 text-sm font-semibold text-white bg-accent rounded-full shadow-md flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Recommended
                </div>
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-muted-foreground mb-6 h-10">{plan.description}</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold">
                ${isYearly ? (plan.price.yearly / 12).toFixed(0) : plan.price.monthly}
              </span>
              <span className="text-muted-foreground text-lg">/month</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href={plan.href} className="w-full">
              <Button
                size="lg"
                className={cn(
                  "w-full text-lg",
                  plan.popular ? "bg-accent text-white hover:bg-accent/90 glow-button" : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                {plan.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
