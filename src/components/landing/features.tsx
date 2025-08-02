"use client";

import { BrainCircuit, MessageSquareQuote, FileDown, Zap, TrendingUp, Settings, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const features = [
  {
    title: 'Connect Your Tools',
    description: 'Sync your existing apps data sources one click',
    icon: <Zap className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Automate Workflows',
    description: 'Set smart triggers actions eliminate repetitive tasks',
    icon: <Settings className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Track and Analyze',
    description: 'Get real-time insights, performance dashboard',
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Optimize and Scale',
    description: 'AI suggest improvements streamline operations',
    icon: <Target className="w-8 h-8 text-primary" />,
  },
];

export default function Features() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [cardBackgrounds, setCardBackgrounds] = useState<string[]>([
    "/images/backgrounds/33.png",
    "/images/backgrounds/35.png",
    "/images/backgrounds/36.png",
    "/images/backgrounds/37.png"
  ]);

  const randomBackground = (index: number) => {
    const backgrounds = [
      "/images/backgrounds/33.png",
      "/images/backgrounds/35.png",
      "/images/backgrounds/36.png",
      "/images/backgrounds/37.png",
      "/images/backgrounds/44.png"
    ];
    const newBackgrounds = [...cardBackgrounds];
    newBackgrounds[index] = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setCardBackgrounds(newBackgrounds);
  };

  return (
    <section id="features" className="container py-24">
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
          Intelligent way to manage work
        </motion.h2>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2 + index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              rotate: 0
            }}
            onHoverStart={() => setHoveredCard(index)}
            onHoverEnd={() => setHoveredCard(null)}
                         onClick={() => randomBackground(index)}
            className="cursor-pointer"
          >
                         <Card 
               className="card-glass border-border/50 hover:border-primary/50 transition-all duration-300 h-full"
               style={{ 
                 backgroundImage: `url(${cardBackgrounds[index]})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 position: 'relative'
               }}
             >
              <CardHeader className="pb-4">
                <motion.div 
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                >
                  <motion.div 
                    className="p-3 bg-white/20 rounded-xl"
                                         whileHover={{ scale: 1.2 }}
                    animate={{ 
                                             rotate: 0,
                      scale: hoveredCard === index ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.p 
                  className="text-white/90 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                  whileHover={{ x: 5 }}
                >
                  {feature.description}
                </motion.p>
                             </CardContent>
             </Card>
          </motion.div>
        ))}
      </div>

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
