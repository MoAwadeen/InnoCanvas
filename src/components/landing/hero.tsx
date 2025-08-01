import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Zap, Target, Users, Shield, BarChart3, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative container flex flex-col items-center py-24 md:py-40">
      <div className="absolute inset-0 top-[-10rem] -z-10 h-full w-full overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-gradient-to-tr from-primary/30 to-vivid-pink/30 rounded-full blur-3xl animate-[gradient-blob_8s_ease-in-out_infinite]" />
      </div>

      <div className="relative text-center max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6">
              Reimagine Your BMC With AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              An Intelligent Co-Founder for the First Step of Your Startup. Each canvas is uniquely generated for your business.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/register">
              <Button size="lg" className="btn-gradient animation-pulse-glow text-lg px-8 py-6">
                <Target className="mr-2 h-6 w-6" />
                Get 14 Days Free Trial
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Users className="mr-2 h-6 w-6" />
                Book A Free Demo
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Private & Secure</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span>Real-Time Insights</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="h-5 w-5 text-purple-500" />
              <span>Automated Follow-Ups</span>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-sm text-muted-foreground mb-4">Trusted by 17,000+ founders & business owners</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              {/* Placeholder for company logos */}
              <div className="w-16 h-8 bg-muted rounded"></div>
              <div className="w-16 h-8 bg-muted rounded"></div>
              <div className="w-16 h-8 bg-muted rounded"></div>
              <div className="w-16 h-8 bg-muted rounded"></div>
              <div className="w-16 h-8 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
