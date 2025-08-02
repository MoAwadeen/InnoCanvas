
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { forwardRef, type ComponentType } from "react";
import { useState } from "react";

// Framer Motion HOCs (Higher-Order Components)
// Learn more: https://www.framer.com/developers/overrides/

// Simple store for managing background color
const useBackgroundStore = () => {
  const [background, setBackground] = useState("#0099FF");
  return [background, setBackground] as const;
};

// Utility function for random colors
const getRandomColor = () => {
  const colors = [
    "#d1241b", "#e13129", "#f19070", "#f5b39b", "#ffd697"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export function withRotate(Component: ComponentType<any>): ComponentType<any> {
  return forwardRef<HTMLDivElement, any>((props, ref) => {
    return (
      <motion.div
        ref={ref}
        {...props}
        animate={{ rotate: 0 }}
        transition={{ duration: 2 }}
      >
        <Component {...props} />
      </motion.div>
    );
  });
}

export function withHover(Component: ComponentType<any>): ComponentType<any> {
  return forwardRef<HTMLDivElement, any>((props, ref) => {
    return (
      <motion.div
        ref={ref}
        {...props}
        whileHover={{ scale: 1.05 }}
      >
        <Component {...props} />
      </motion.div>
    );
  });
}

export function withRandomColor(Component: ComponentType<any>): ComponentType<any> {
  return forwardRef<HTMLDivElement, any>((props, ref) => {
    const [background, setBackground] = useBackgroundStore();

    return (
      <motion.div
        ref={ref}
        {...props}
        animate={{
          background: background,
        }}
        onClick={() => {
          setBackground(getRandomColor());
        }}
      >
        <Component {...props} />
      </motion.div>
    );
  });
}

export default function Pricing() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free Plan",
      icon: <Zap className="w-6 h-6 text-[#f19070]" />,
      price: "$0",
      period: "",
      description: "Perfect for getting started",
      features: [
        "1 Canvas",
        "Export as JPG (with watermark)",
        "AI Questions (Limited Access)",
        "Basic Templates"
      ],
      cta: "Get Started Free"
    },
    {
      name: "Pro Plan",
      icon: <Star className="w-6 h-6 text-[#e13129]" />,
      price: isYearly ? "$6" : "$8",
      period: "/month",
      description: "Perfect for growing businesses",
      features: [
        "Up to 10 canvases",
        "Editable PDF export",
        "Color palette customization",
        "Advanced AI prompts",
        "Priority email support"
      ],
      cta: "Start Pro Plan"
    },
    {
      name: "Premium Plan",
      icon: <Crown className="w-6 h-6 text-[#d1241b]" />,
      price: isYearly ? "$12" : "$15",
      period: "/month",
      description: "For serious entrepreneurs",
      features: [
        "Unlimited canvases",
        "Consult AI Avatars (e.g. Financial, Growth)",
        "Pitch Deck Generator",
        "Custom templates",
        "Editable canvas mode",
        "24/7 AI Chat support",
        "Smart Strategy Suggestions"
      ],
      cta: "Start Premium Plan"
    }
  ];

  return (
    <section id="pricing" className="container py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-[#d1241b]/20 to-[#e13129]/20 rounded-full blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-[#f19070]/20 to-[#f5b39b]/20 rounded-full blur-xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          Find the right plan for your needs
        </motion.h2>
        <motion.p 
          className="text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Supporters receive a 30% discount on early access plus an extra 20% off the yearly plan.
        </motion.p>
      </motion.div>

      <motion.div 
        className="flex justify-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
                 <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
           <motion.div whileHover={{ scale: 1.02 }}>
             <Button 
               variant={!isYearly ? "default" : "gradient-stroke"} 
               size="sm" 
               className="rounded-md px-3 py-1 text-xs h-7"
               onClick={() => setIsYearly(false)}
             >
               Monthly
             </Button>
           </motion.div>
           <motion.div whileHover={{ scale: 1.02 }}>
             <Button 
               variant={isYearly ? "default" : "gradient-stroke"} 
               size="sm" 
               className="rounded-md px-3 py-1 text-xs h-7"
               onClick={() => setIsYearly(true)}
             >
               Yearly
             </Button>
           </motion.div>
           <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: 0.8, type: "spring" }}
           >
             <Badge variant="secondary" className="ml-1 bg-gradient-to-r from-[#ffd697] to-[#f5b39b] text-neutral-900 text-xs px-2 py-0.5">
               SAVE 20%
             </Badge>
           </motion.div>
         </div>
      </motion.div>

            <motion.div 
        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.7 + index * 0.2,
              type: "spring",
              stiffness: 100
            }}
                         whileHover={{ 
               scale: 1.02, 
               y: -4,
               rotate: 0
             }}
            onHoverStart={() => setHoveredCard(index)}
            onHoverEnd={() => setHoveredCard(null)}
            className="cursor-pointer group"
          >
                        <Card 
              className="relative overflow-hidden transition-all duration-500 group-hover:shadow-2xl"
              style={{ 
                backgroundColor: index === 0 ? '#f5f5f5' : index === 1 ? '#e8e8e8' : '#f0f0f0',
                position: 'relative',
                boxShadow: hoveredCard === index ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            >

              
               <CardHeader className="text-center pb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2 pt-4">
                    {plan.icon}
                    <CardTitle className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">{plan.name}</CardTitle>
                  </div>
                  <motion.div 
                    className="flex items-baseline justify-center gap-1"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </motion.div>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors">{plan.description}</p>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/register">
                    <Button 
                      className="w-full btn-gradient" 
                      variant="gradient"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </motion.div>
                
                <div className="space-y-4">
                  <motion.p 
                    className="text-sm font-semibold text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 + index * 0.1, duration: 0.6 }}
                  >
                    Features Included:
                  </motion.p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 1.2 + index * 0.1 + featureIndex * 0.1, 
                          duration: 0.5 
                        }}
                        whileHover={{ x: 5 }}
                      >
                        <motion.div
                          animate={{ 
                            scale: hoveredCard === index ? [1, 1.2, 1] : 1,
                                                         rotate: 0
                          }}
                          transition={{ duration: 0.5, repeat: hoveredCard === index ? Infinity : 0 }}
                          className="flex-shrink-0"
                        >
                          <Check className="h-4 w-4 text-red-600" />
                        </motion.div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-800 transition-colors">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                                 </div>
               </CardContent>
             </Card>
          </motion.div>
        ))}
      </motion.div>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}
