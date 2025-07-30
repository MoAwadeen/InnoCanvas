
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
      description: "For individuals & students getting started.",
      features: [
        "1 Canvas",
        "Basic BMC Generation",
        "JPG Download (with watermark)",
      ],
      cta: "Start with Free",
      href: "/register",
      variant: "outline"
    },
    {
      name: "Pro",
      price: { monthly: 8, yearly: 72 },
      description: "For professionals and small teams.",
      features: [
        "10 Canvases",
        "PDF Download (no watermark)",
        "Access to all Templates",
        "Custom Color Palettes",
      ],
      cta: "Upgrade Now",
      href: "/payment",
      variant: "outline",
    },
    {
      name: "Premium",
      price: { monthly: 15, yearly: 144 },
      description: "For businesses and power users.",
      features: [
        "Unlimited Canvases",
        "AI Consultation (Select Persona)",
        "Real-time Editing & Collaboration",
        "Custom Branding",
      ],
      cta: "Upgrade Now",
      href: "/payment",
      variant: "gradient",
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="container py-20 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Plans that Grow with You</h2>
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
            Yearly <span className="text-sm font-medium text-green-400">(Save 25%)</span>
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "card-glass flex flex-col transition-all duration-300 relative text-left p-8 h-full",
               plan.popular ? "border-primary/80 ring-2 ring-primary/50" : "border-white/10"
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1 text-sm font-semibold text-primary-foreground bg-primary rounded-full shadow-md flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Recommended
                </div>
              </div>
            )}
            <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
            <p className="text-muted-foreground mb-6 h-10">{plan.description}</p>
            <div className="mb-8" data-state={isYearly ? 'yearly' : 'monthly'}>
              <div className="price-container transition-colors duration-300">
                <span className="text-5xl font-extrabold text-foreground">
                  ${isYearly ? (plan.price.yearly / 12).toFixed(0) : plan.price.monthly}
                </span>
                <span className="text-muted-foreground text-lg">/month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-left text-foreground/90">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href={plan.href} className="w-full mt-auto">
              <Button
                size="lg"
                variant={plan.variant as any}
                className={cn("w-full text-lg", plan.variant === 'gradient' && 'btn-gradient')}
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
