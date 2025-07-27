
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
      href: "/register",
      variant: "secondary"
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
      href: "/payment",
      variant: "gradient"
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
      href: "/payment",
      variant: "gradient"
    },
  ];

  return (
    <section id="pricing" className="container py-20 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12 headline-realism">
        <h2 className="headline text-3xl md:text-4xl font-bold">Choose Your Plan</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Simple, transparent pricing. No hidden fees.
        </p>
      </div>

      <div className="flex justify-center items-center gap-4 mb-10">
        <Label htmlFor="billing-cycle" className={cn("transition-colors font-medium", !isYearly ? "text-primary" : "text-muted-foreground")}>Monthly</Label>
        <Switch
          id="billing-cycle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <Label htmlFor="billing-cycle" className={cn("transition-colors font-medium", isYearly ? "text-primary" : "text-muted-foreground")}>
            Yearly <span className="text-sm font-medium text-green-600">(Save 25%)</span>
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "card-realism p-8 flex flex-col transition-all duration-300 rounded-2xl relative text-left",
              plan.popular ? "shadow-lg" : ""
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1 text-sm font-semibold text-accent-foreground bg-accent rounded-full shadow-md flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Recommended
                </div>
              </div>
            )}
            <h3 className="card-title mb-2">{plan.name}</h3>
            <p className="card-text mb-6 h-10">{plan.description}</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-white">
                ${isYearly ? (plan.price.yearly / 12).toFixed(0) : plan.price.monthly}
              </span>
              <span className="text-gray-400 text-lg">/month</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-left text-white">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href={plan.href} className="w-full mt-auto">
              <Button
                size="lg"
                variant={plan.variant as any}
                className="w-full text-lg"
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
