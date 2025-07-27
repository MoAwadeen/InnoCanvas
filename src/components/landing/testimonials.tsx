'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah L.",
      title: "Startup Founder",
      avatar: "https://placehold.co/40x40.png",
      dataAiHint: "woman portrait",
      quote:
        "InnoCanvas turned my scattered ideas into a coherent business plan overnight. The AI suggestions were pure gold!",
    },
    {
      name: "Mike D.",
      title: "Product Manager",
      avatar: "https://placehold.co/40x40.png",
      dataAiHint: "man portrait",
      quote:
        "This tool is a game-changer for product validation. I can now create and compare multiple business models in a fraction of the time.",
    },
    {
      name: "Chen W.",
      title: "Business Consultant",
      avatar: "https://placehold.co/40x40.png",
      dataAiHint: "asian man portrait",
      quote:
        "I use InnoCanvas with all my clients. It's incredibly intuitive and the visual templates make my presentations so much more impactful.",
    },
    {
        name: "Jessica P.",
        title: "MBA Student",
        avatar: "https://placehold.co/40x40.png",
        dataAiHint: "woman face",
        quote: "Perfect for my entrepreneurship classes. It helps me structure my thoughts and present my case studies professionally.",
    }
  ];

  return (
    <section id="testimonials" className="container py-20 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Loved by Innovators Worldwide</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Don't just take our word for it. Here's what our users have to say.
        </p>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-5xl mx-auto"
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <div className="p-6 rounded-2xl bg-background/50 backdrop-blur-lg border border-white/10 shadow-lg h-full flex flex-col justify-between">
                  <p className="text-foreground/80 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex"/>
        <CarouselNext className="hidden lg:flex"/>
      </Carousel>
    </section>
  );
}
