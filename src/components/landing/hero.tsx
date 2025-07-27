
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="container flex flex-col items-center py-24 md:py-32">
      <div className="flex flex-col items-center gap-6 text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-tight"
          style={{ animation: 'glow 2s ease-in-out infinite alternate' }}
        >
          Welcome to InnoCanvas
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Innovate Your Startup Vision with AI. Your AI-Powered Business Model Canvas Companion.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link href="/generate">
            <Button
              size="lg"
              className="glow-button text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
            >
              Try for Free <MoveRight className="ml-2" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">
                View Demo
            </Button>
          </Link>
        </div>
      </div>
      <div className="relative mt-20 w-full max-w-6xl">
        <div className="absolute -inset-8 bg-gradient-to-r from-primary to-accent rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="glass-card p-4">
            <Image
            src="https://placehold.co/1200x800.png"
            alt="InnoCanvas App Preview"
            width={1200}
            height={800}
            className="rounded-xl shadow-2xl"
            data-ai-hint="app mockup business dark futuristic"
            />
        </div>
      </div>
    </section>
  );
}
