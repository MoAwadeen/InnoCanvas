"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MessageSquare, Rocket, Target, Users, DollarSign } from "lucide-react";
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

export default function AIConsultant() {
  const [isHovered, setIsHovered] = useState(false);
  const [cardBackground, setCardBackground] = useState("/images/backgrounds/33.png");
  const [buttonPositions, setButtonPositions] = useState<{ [key: number]: { x: number; y: number } }>({});
  const [draggedButton, setDraggedButton] = useState<number | null>(null);

  const promptButtons = [
    { text: "Help me validate this startup idea.", width: "w-[291px]" },
    { text: "Feature priority?", width: "w-[157px]" },
    { text: "How can I attract my first 100 customers?", width: "w-[347px]" },
    { text: "Set my pricing.", width: "w-[145px]" },
  ];

  const actionButtons = [
    {
      text: "Ask.",
      width: "w-[65px]",
      position: "top-[17px] left-1 rotate-[-18deg]",
      icon: <MessageSquare className="w-4 h-4" />
    },
    { 
      text: "Launch.", 
      width: "w-[93px]", 
      position: "top-10 left-[246px]",
      icon: <Rocket className="w-4 h-4" />
    },
    {
      text: "Save.",
      width: "w-[75px]",
      position: "top-[157px] left-0.5 rotate-[7deg]",
      icon: <Users className="w-4 h-4" />
    },
    {
      text: "Boost.",
      width: "w-20",
      position: "top-[206px] left-[129px] rotate-[17deg]",
      icon: <Target className="w-4 h-4" />
    },
    {
      text: "Map.",
      width: "w-[71px]",
      position: "-top-16 left-0.5 rotate-[7deg]",
      icon: <Brain className="w-4 h-4" />
    },
    {
      text: "Scale.",
      width: "w-[79px]",
      position: "top-[-65px] left-[150px] rotate-[4deg]",
      icon: <Rocket className="w-4 h-4" />
    },
  ];

  const randomBackground = () => {
    const backgrounds = [
      "/images/backgrounds/33.png",
      "/images/backgrounds/35.png",
      "/images/backgrounds/36.png",
      "/images/backgrounds/37.png",
      "/images/backgrounds/44.png"
    ];
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedButton(index);
  };

  const handleDrag = (e: React.DragEvent, index: number) => {
    if (draggedButton === index) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setButtonPositions(prev => ({
        ...prev,
        [index]: { x, y }
      }));
    }
  };

  const handleDragEnd = (index: number) => {
    setDraggedButton(null);
    // Add floating animation
    setTimeout(() => {
      setButtonPositions(prev => ({
        ...prev,
        [index]: { x: prev[index]?.x || 0, y: prev[index]?.y || 0 }
      }));
    }, 100);
  };

  return (
    <section className="w-full py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.h2 
          className="text-4xl md:text-5xl font-medium text-neutral-950 text-center tracking-tight leading-tight mb-16 max-w-[966px] mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Turn Your Idea Into a Business in Under 5 Minutes.
        </motion.h2>

        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          {/* Left Card - AI Business Consultant */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setCardBackground(randomBackground())}
          >
            <Card 
              className="w-full lg:w-[508px] h-[611px] rounded-2xl overflow-hidden border-none"
              style={{ 
                backgroundImage: `url(${cardBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <CardContent className="p-12">
                <motion.div 
                  className="mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <div className="flex items-center mb-4">
                    <motion.div 
                      className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                                              animate={{ rotate: 0 }}
                      onHoverStart={() => setIsHovered(true)}
                      onHoverEnd={() => setIsHovered(false)}
                    >
                      <Brain className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="ml-4 font-medium text-white text-2xl md:text-3xl tracking-tight leading-tight">
                      AI Business Consultant
                    </h3>
                  </div>

                  <div className="font-medium text-white text-lg md:text-xl tracking-tight leading-relaxed mb-4">
                    Validate your startup ideas, refine <br />
                    your value proposition, and define <br />
                    your ideal customer.
                  </div>

                  <div className="font-medium text-white text-base md:text-lg tracking-tight leading-relaxed">
                    This AI thinks like a founder, <br />
                    strategist, and incubator mentor.
                  </div>
                </motion.div>

                <div className="space-y-3">
                  {promptButtons.map((button, index) => (
                    <motion.div
                      key={index}
                      className={`${button.width} h-[37px] bg-white rounded-[19px] overflow-hidden relative`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="relative h-[37px] rounded-[19px]">
                        <div className="absolute top-[7px] left-4 font-normal text-neutral-950 text-base tracking-[0] leading-[27.2px] whitespace-nowrap">
                          {button.text}
                        </div>
                        <div className="absolute w-full h-full top-0 left-0 rounded-[19px] border-[3px] border-solid border-red-600" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Card - Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="w-full lg:w-[508px] h-[611px] rounded-2xl overflow-hidden bg-white">
              <CardContent className="p-0 relative h-full">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Center square */}
                  <motion.div 
                    className="relative w-[199px] h-[199px] rounded-[40px] overflow-hidden border-[3px] border-solid border-red-600"
                    animate={{ 
                      rotate: 0,
                      scale: isHovered ? 1.05 : 1
                    }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="h-[199px] rounded-[40px] bg-gradient-to-br from-yellow-200 via-orange-300 to-red-600 flex items-center justify-center">
                      <div className="text-center">
                        <img 
                          src="/images/avatars/ChatGPT Image Aug 1, 2025, 04_49_04 PM.png" 
                          alt="AI Avatar" 
                          className="w-full h-full object-cover rounded-[40px] absolute inset-0"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Action buttons around the square */}
                  {actionButtons.map((button, index) => (
                    <motion.div
                      key={index}
                      className={`absolute ${button.width} h-[37px] ${button.position} bg-white rounded-[19px] overflow-hidden shadow-lg cursor-grab active:cursor-grabbing`}
                      style={{
                        transform: `translate(${buttonPositions[index]?.x || 0}px, ${buttonPositions[index]?.y || 0}px)`
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: 0.8 + index * 0.1, 
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: 0
                      }}
                      whileTap={{ scale: 0.9 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDrag={(e) => handleDrag(e, index)}
                      onDragEnd={() => handleDragEnd(index)}
                    >
                      <div className="relative h-[37px] rounded-[19px]">
                        <div className="absolute top-[7px] left-4 font-normal text-neutral-950 text-base tracking-[0] leading-[27.2px] whitespace-nowrap flex items-center gap-2">
                          {button.icon}
                          {button.text}
                        </div>
                        <div className="absolute w-full h-full top-0 left-0 rounded-[19px] border-[3px] border-solid border-red-600" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 