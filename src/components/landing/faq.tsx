
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function Faq() {
  const faqs = [
    {
      question: "What is InnoCanvas?",
      answer: "InnoCanvas is an AI-powered Business Model Canvas generator that helps entrepreneurs, startups, and businesses create, visualize, and optimize their business strategies using intelligent insights from Google Gemini AI."
    },
    {
      question: "Does InnoCanvas integrate with other tools?",
      answer: "Yes, InnoCanvas integrates with various business tools and platforms. We support exports to PDF, image formats, and are working on integrations with popular business software."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start your trial."
    },
    {
      question: "How does InnoCanvas use AI?",
      answer: "InnoCanvas uses Google Gemini AI to analyze your business description and generate comprehensive Business Model Canvas sections. The AI provides intelligent suggestions, validates your business model, and helps optimize your strategy."
    }
  ];

  return (
    <section className="container py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="card-glass border-border/50">
              <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-semibold">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
