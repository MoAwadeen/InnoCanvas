
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  const faqs = [
    {
      question: "What is a Business Model Canvas?",
      answer: "A Business Model Canvas (BMC) is a strategic management template for developing new or documenting existing business models. It is a visual chart with elements describing a firm's or product's value proposition, infrastructure, customers, and finances.",
    },
    {
      question: "How does the AI generation work?",
      answer: "You provide a description of your business idea and answer a few clarifying questions. Our AI model, trained on thousands of business models, then analyzes your input to generate the content for each section of the BMC, tailored to your specific concept.",
    },
    {
      question: "Can I customize the generated canvas?",
      answer: "Yes! Once the canvas is generated, all sections are fully editable. You can refine the AI-generated text, add your own insights, and use our branding tools (on paid plans) to change colors, fonts, and logos to match your brand identity.",
    },
    {
      question: "What are the export options?",
      answer: "Our Free plan allows you to export your canvas as a PNG file. Pro and Premium plans unlock high-resolution PDF exports, perfect for printing and professional presentations.",
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Absolutely. You can manage your subscription, upgrade, downgrade, or cancel at any time from your account settings. If you cancel, you will retain access to your plan's features until the end of the current billing period.",
    },
  ];

  return (
    <section id="faq" className="container py-20 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Find answers to common questions about InnoCanvas.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="glass-card mb-4 px-6 border-none">
            <AccordionTrigger className="text-lg text-left hover:no-underline">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground text-left">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
