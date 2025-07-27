
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="container grid lg:grid-cols-2 gap-10 items-center py-20 md:py-32">
      <div className="flex flex-col items-start gap-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-tight">
          Turn Your Idea Into a Business Model Instantly
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Leverage AI to create comprehensive business model canvases in
          minutes. Refine your strategy, visualize your plan, and bring your
          vision to life. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/generate">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow hover:animate-gradient-bg"
            >
              Get Started Free
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Try Demo
          </Button>
        </div>
      </div>
      <div className="relative breathing-rounded-lines">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full -inset-4 blur-3xl opacity-20"></div>
        <Image
          src="https://placehold.co/1200x800.png"
          alt="InnoCanvas App Preview"
          width={1200}
          height={800}
          className="rounded-2xl shadow-2xl relative"
          data-ai-hint="app mockup business"
        />
      </div>
    </section>
  );
}
