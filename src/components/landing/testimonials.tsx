
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Robert Fox",
      role: "CEO & Founder",
      company: "TechStart Inc.",
      content: "InnoCanvas completely transformed how we develop our business models. We've created 40% more strategic plans in just three months!",
      rating: 5
    },
    {
      name: "Esther Howard",
      role: "CEO & Founder", 
      company: "InnovateLab",
      content: "Our team productivity jumped by 35% after adopting InnoCanvas. It's like upgrading your business strategy with AI superpowers.",
      rating: 5
    },
    {
      name: "Guy Hawkins",
      role: "CEO & Founder",
      company: "ScaleUp Ventures", 
      content: "Since switching to InnoCanvas, our business model validation has become almost perfectly accurate. No more guesswork.",
      rating: 5
    },
    {
      name: "Albert Flores",
      role: "CEO & Founder",
      company: "GrowthFirst",
      content: "InnoCanvas transformed how we approach business model development — it's fast, smart, and actually enjoyable to use.",
      rating: 5
    },
    {
      name: "Floyd Miles",
      role: "CEO & Founder",
      company: "StartupHub",
      content: "InnoCanvas doesn't just help us create business models. It helps us validate them — faster and more efficiently.",
      rating: 5
    },
    {
      name: "Arlene McCoy",
      role: "CEO & Founder", 
      company: "InnovationWorks",
      content: "Since switching to InnoCanvas, we've boosted our strategy success rate by 35% and saved over 15 hours per week.",
      rating: 5
    }
  ];

  return (
    <section className="container py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Trusted by 10 million users worldwide
        </h2>
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-lg font-semibold">4.9/5</span>
        </div>
        <p className="text-muted-foreground">10M+ reviews from satisfied users</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="card-glass border-border/50 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-vivid-pink rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
