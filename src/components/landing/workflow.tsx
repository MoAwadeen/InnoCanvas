"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Bot, TrendingUp, Users, MessageSquare, Zap } from "lucide-react";
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

export default function Workflow() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [cardBackgrounds, setCardBackgrounds] = useState<string[]>([
    "/images/backgrounds/33.png",
    "/images/backgrounds/35.png",
    "/images/backgrounds/36.png"
  ]);

  const solutions = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Sales Analytics",
      description: "Get a 360° view of performance metrics, KPIs, and trends—all in one place",
      features: [
        "Real-Time Performance Insights",
        "Forecast with Accuracy", 
        "Identify Top Performers"
      ]
    },
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI Assistant",
      description: "Get instant answers, sales insights & suggestions from an integrated chatbot",
      features: [
        "Smart Task Automation",
        "Instant Knowledge Access"
      ]
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "AI Sales funnel",
      description: "Share updates, assign roles, and collaborate on deals without leaving the platform.",
      features: [
        "Real-Time Collaboration",
        "Centralized Communication",
        "Integrated File Sharing"
      ]
    }
  ];

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
    <section className="container py-24">
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
          Innovative AI solutions that helps
        </motion.h2>
      </motion.div>

      <div className="space-y-16">
        {solutions.map((solution, index) => (
          <motion.div
            key={index}
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2 + index * 0.2,
              type: "spring",
              stiffness: 100
            }}
          >
                         {/* Left Column - Image Placeholder */}
             <motion.div
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
               className="relative h-80 md:h-96"
             >
                               <div 
                  className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
                >
                  {/* Content without background image */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        {solution.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">{solution.title}</h3>
                    </div>
                  </div>
                </div>
             </motion.div>

             {/* Right Column - Background with Content */}
             <motion.div
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
               className="relative h-80 md:h-96"
             >
               <div 
                 className="absolute inset-0 rounded-2xl"
                 style={{
                   backgroundImage: `url(${cardBackgrounds[(index + 1) % cardBackgrounds.length]})`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                 }}
               ></div>
                               <div className="relative rounded-2xl p-8 h-full flex flex-col justify-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 drop-shadow-lg">
                    {solution.title}
                  </h3>
                  <p className="text-lg text-white/90 mb-8 leading-relaxed drop-shadow-lg">
                    {solution.description}
                  </p>
                  <div className="space-y-4">
                    {solution.features.map((feature, featureIndex) => (
                      <motion.div 
                        key={featureIndex}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 + featureIndex * 0.1, duration: 0.5 }}
                      >
                        <div className="w-2 h-2 bg-white rounded-full drop-shadow-lg"></div>
                        <span className="text-white/90 drop-shadow-lg">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
             </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 