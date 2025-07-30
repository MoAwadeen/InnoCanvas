import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative container flex flex-col items-center py-24 md:py-40">
      <div className="absolute inset-0 top-[-10rem] -z-10 h-full w-full overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-gradient-to-tr from-primary/30 to-vivid-pink/30 rounded-full blur-3xl animate-[gradient-blob_8s_ease-in-out_infinite]" />
      </div>

      <div className="relative card-glass p-8 md:p-12 lg:p-16">
         <div className="flex flex-col items-center gap-6 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                InnoCanvas
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-muted-foreground">
                Reimagine your business model. Visually, Intelligently, Instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link href="/register">
                    <Button size="lg" className="btn-gradient animation-pulse-glow">
                        Try Free Canvas
                    </Button>
                </Link>
                <Link href="#pricing">
                    <Button size="lg" variant="outline">
                        Explore Plans
                    </Button>
                </Link>
            </div>
        </div>
      </div>
    </section>
  );
}
