
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bot, CheckCircle, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils";

const plans = [
    {
      name: "Pro",
      price: 8,
      features: [
        "Unlimited canvases",
        "Advanced export (PDF, PNG)",
        "All visual templates",
        "Priority support",
      ],
    },
    {
      name: "Premium",
      price: 15,
      features: [
        "All Pro features",
        "Custom branding tools",
        "Team access & collaboration",
        "Premium templates",
      ],
    },
  ];

export default function PaymentPage() {
    const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center p-4 md:p-8">
        <header className="w-full max-w-5xl flex justify-between items-center mb-8">
            <Link href="/my-canvases" className="flex items-center gap-2">
                <Bot className="h-8 w-8 text-primary" />
                <span className="font-bold text-2xl">InnoCanvas</span>
            </Link>
            <Link href="/my-canvases">
                <Button variant="secondary">Back to My Canvases</Button>
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
                    <CardTitle className="text-2xl">Payment Details</CardTitle>
                    <CardDescription>
                        Complete your purchase for the <span className="font-bold text-accent">{selectedPlan.name}</span> plan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="card-name">Name on Card</Label>
                        <Input id="card-name" placeholder="Mohamed Awadeen" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <div className="relative">
                            <Input id="card-number" placeholder="**** **** **** 1234" required className="pr-10" />
                            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                             <Label htmlFor="expiry-date">Expiry Date</Label>
                             <Input id="expiry-date" placeholder="MM/YY" required />
                        </div>
                        <div className="grid gap-2">
                             <Label htmlFor="cvc">CVC</Label>
                             <Input id="cvc" placeholder="123" required />
                        </div>
                    </div>
                    <div className="border-t pt-4 mt-2">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span className="text-card-foreground">Total Due Today:</span>
                            <span className="text-card-foreground">${selectedPlan.price}.00</span>
                        </div>
                    </div>
                    <Button variant="gradient" type="submit" className="w-full text-lg py-6">
                        Confirm Payment
                    </Button>
                </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  )
}
