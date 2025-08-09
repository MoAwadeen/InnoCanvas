
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does InnoCanvas generate Business Model Canvases?",
    answer: "InnoCanvas uses OpenAI to analyze your business description and generate comprehensive Business Model Canvas sections. The AI provides intelligent suggestions, validates your business model, and helps optimize your strategy based on industry best practices."
  },
  {
    question: "What makes InnoCanvas different from other BMC tools?",
    answer: "InnoCanvas combines the power of AI with an intuitive interface. Unlike static templates, our AI analyzes your specific business idea and generates personalized, relevant content for each BMC section. Plus, you get real-time editing, custom branding, and export capabilities."
  },
  {
    question: "Is my business data secure?",
    answer: "Absolutely! We use Supabase for secure authentication and data storage. Your business information is encrypted and only accessible to you. We never share your data with third parties."
  },
  {
    question: "Can I export my Business Model Canvas?",
    answer: "Yes! You can export your canvas as a high-quality PDF or PNG file. This makes it easy to share with stakeholders, include in presentations, or print for physical display."
  },
  {
    question: "Do I need to be a business expert to use InnoCanvas?",
    answer: "Not at all! InnoCanvas is designed for entrepreneurs at all levels. The AI guides you through the process, asking relevant questions and generating content based on your business description. Whether you're a startup founder or an established business owner, InnoCanvas makes BMC creation accessible and insightful."
  },
  {
    question: "Can I collaborate with team members?",
    answer: "Currently, InnoCanvas is designed for individual use, but we're working on team collaboration features. You can share your exported canvases with team members for feedback and review."
  }
];

export default function Faq() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about InnoCanvas and AI-powered Business Model Canvas generation.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
