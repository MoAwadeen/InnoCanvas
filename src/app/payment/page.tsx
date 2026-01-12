
'use client';

import Link from "next/link"
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckCircle, CreditCard, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const dynamic = "force-dynamic";

const plans = [
  {
    name: "Pro",
    price: 8,
    features: [
      "Up to 10 canvases",
      "Advanced export (PDF, PNG)",
      "All visual templates",
      "Color customization",
      "Priority support",
    ],
    variantId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID,
  },
  {
    name: "Premium",
    price: 15,
    features: [
      "Unlimited canvases",
      "All Pro features",
      "Custom branding tools",
      "Remove watermarks",
      "Team access & collaboration",
      "Premium templates",
      "API access",
    ],
    variantId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PREMIUM_VARIANT_ID,
  },
];

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [loading, setLoading] = useState(false);
  const { user, userData } = useAuth();
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue with payment.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPlan.variantId) {
      toast({
        title: "Configuration Error",
        description: "Payment configuration is not set up. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/lemonsqueezy/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId: parseInt(selectedPlan.variantId),
          storeId: parseInt(process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID || '0'),
          userEmail: userData?.email || user.email,
          userName: userData?.full_name || user.user_metadata?.full_name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to LemonSqueezy checkout
      window.location.href = data.checkout.url;
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-5xl flex justify-between items-center mb-8">
        <Logo />
        <Link href="/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </header>
      <main className="w-full max-w-5xl flex-grow">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Upgrade Your Plan</h1>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan)}
                  className={cn(
                    "cursor-pointer transition-all border-border",
                    selectedPlan.name === plan.name ? 'ring-2 ring-primary' : 'hover:border-primary/50'
                  )}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{plan.name}</span>
                      <span className="text-3xl font-extrabold">${plan.price}<span className="text-base font-normal text-muted-foreground">/mo</span></span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map(feature => (
                        <li key={feature} className="flex items-center gap-3 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Card className="w-full border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
              <CardDescription>
                You're about to upgrade to the <span className="font-bold text-accent">{selectedPlan.name}</span> plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">What you'll get:</h3>
                  <ul className="space-y-1 text-sm">
                    {selectedPlan.features.map(feature => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold mb-4">
                    <span className="text-card-foreground">Total Due Today:</span>
                    <span className="text-card-foreground">${selectedPlan.price}.00</span>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full text-lg py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-5 w-5" />
                          Continue to Payment
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Secure payment powered by LemonSqueezy. You can cancel anytime.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
