
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="container flex flex-col items-center py-24 md:py-32">
      <div className="flex flex-col items-center gap-6 text-center max-w-4xl">
        <div className="headline-realism">
          <h1 className="headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-tight">
            Welcome to InnoCanvas
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Your AI-Powered Business Model Canvas Companion. Innovate Your Startup Vision with AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link href="/register">
            <Button
              size="lg"
              variant="gradient"
            >
              Try for Free
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
                View Demo
            </Button>
          </Link>
        </div>
      </div>
      <div className="relative mt-20 w-full max-w-6xl">
         <div className="p-4 border rounded-2xl bg-card shadow-lg">
            <Image
            src="https://placehold.co/1200x800.png"
            alt="InnoCanvas App Preview"
            width={1200}
            height={800}
            className="rounded-xl shadow-2xl"
            data-ai-hint="app mockup business light modern"
            />
        </div>
      </div>
    </section>
  );
}
