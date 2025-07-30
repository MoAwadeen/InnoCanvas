
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="container flex flex-col items-center py-24 md:py-32">
      <div className="flex flex-col items-center gap-6 text-center max-w-4xl">
        <div className="headline-glow">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-tight">
            Where Business Strategy meets AI
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          InnoCanvas is a design-to-code platform that helps you build a business model, connect it to your vision, and deliver a comprehensive plan faster than ever.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link href="/register">
            <Button
              size="lg"
              className="btn-gradient"
            >
              Get Started for Free
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
                Learn More
            </Button>
          </Link>
        </div>
      </div>
      <div className="relative mt-20 w-full max-w-6xl">
         <div className="p-2 rounded-2xl bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/20">
            <Image
            src="https://placehold.co/1200x800.png"
            alt="InnoCanvas App Preview"
            width={1200}
            height={800}
            className="rounded-xl"
            data-ai-hint="app mockup business dark modern"
            />
        </div>
      </div>
    </section>
  );
}
