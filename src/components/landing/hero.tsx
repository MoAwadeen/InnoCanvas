import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Zap, Target, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative container flex flex-col items-center py-24 md:py-40">
      <div className="absolute inset-0 top-[-10rem] -z-10 h-full w-full overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-gradient-to-tr from-primary/30 to-vivid-pink/30 rounded-full blur-3xl animate-[gradient-blob_8s_ease-in-out_infinite]" />
      </div>

      <div className="relative card-glass p-8 md:p-12 lg:p-16">
         <motion.div 
           className="flex flex-col items-center gap-6 text-center max-w-4xl"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
         >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  InnoCanvas
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="max-w-2xl text-lg md:text-xl text-muted-foreground">
                  Reimagine your business model with AI-powered insights. Create, visualize, and optimize your strategy in minutes.
              </p>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>Powered by Google Gemini AI</span>
              <Zap className="h-4 w-4 text-blue-500" />
              <span>Real-time collaboration</span>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
                <Link href="/register">
                    <Button size="lg" className="btn-gradient animation-pulse-glow">
                        <Target className="mr-2 h-5 w-5" />
                        Start Free Trial
                    </Button>
                </Link>
                <Link href="#pricing">
                    <Button size="lg" variant="outline">
                        <Users className="mr-2 h-5 w-5" />
                        View Plans
                    </Button>
                </Link>
            </motion.div>

            <motion.div 
              className="flex items-center gap-6 text-xs text-muted-foreground mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>AI-powered insights</span>
              </div>
            </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
