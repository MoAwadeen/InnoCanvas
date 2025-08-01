
import React from 'react';
import Faq from "@/components/landing/faq";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import Pricing from "@/components/landing/pricing";
import Testimonials from "@/components/landing/testimonials";
import Stats from "@/components/landing/stats";
import AIConsultant from "@/components/landing/ai-consultant";
import Workflow from "@/components/landing/workflow";
import Insights from "@/components/landing/insights";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <Hero />
        <AIConsultant />
        <Workflow />
        <Features />
        <Stats />
        <Insights />
        <Testimonials />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
