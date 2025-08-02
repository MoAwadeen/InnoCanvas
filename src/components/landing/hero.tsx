"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Shield, BarChart3, Clock, Inbox, FolderOpen, Activity, CheckSquare, Users, MessageSquare, Settings, TrendingUp, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { forwardRef, type ComponentType } from "react";

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const [cardBackground, setCardBackground] = useState("/images/backgrounds/33.png");

  const features = [
    {
      icon: <Shield className="w-5 h-5 text-gray-600" />,
      text: "Private & Secure",
      isActive: true,
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-gray-600" />,
      text: "Real-Time Insights",
      isActive: true,
    },
    {
      icon: <Clock className="w-5 h-5 text-green-600" />,
      text: "Automated Follow-Ups",
      isActive: true,
    },
  ];

  const navigationItems = [
    { icon: <Inbox className="w-5 h-5" />, label: "Inbox", hasNotification: true },
    { icon: <FolderOpen className="w-5 h-5" />, label: "Project" },
    { icon: <Activity className="w-5 h-5" />, label: "Activity" },
    { icon: <CheckSquare className="w-5 h-5" />, label: "My task" },
    { icon: <Users className="w-5 h-5" />, label: "Teams" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Message" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings" },
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

  return (
    <section className="relative w-full max-w-[1920px] mx-auto pt-[74px] bg-[#f7f7f5]">
      <div className="relative w-full max-w-[1200px] mx-auto px-4">
        <motion.div 
          className="flex flex-col items-center text-center mb-[102px]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="max-w-[740px] mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="font-medium text-neutral-950 text-5xl md:text-7xl lg:text-8xl tracking-tight leading-tight">
              Reimagine Your
              <br />
              <span className="inline-block mt-[10px]">
                BMC With AI
              </span>
            </h1>
          </motion.div>

          <motion.div 
            className="max-w-[514px] mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="font-normal text-[#5b5b5b] text-lg tracking-tight leading-relaxed">
              An Intelligent Co-Founder for the First Step of Your Startup.
            </p>
            <p className="font-normal text-[#5b5b5b] text-lg tracking-tight leading-relaxed mt-2">
              Each canvas is uniquely generated for your business.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="gradient"
                  className="h-[52px] px-8 rounded-xl font-medium text-sm text-white btn-gradient"
                  animated={true}
                >
                  Get 14 Days Free Trial
                </Button>
              </motion.div>
            </Link>
            <Link href="#pricing">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="gradient-stroke"
                  className="h-[52px] px-8 rounded-xl font-medium text-sm"
                  animated={true}
                >
                  Book A Free Demo
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        <div className="relative w-full">
          <div>
            <Card 
              className="w-full h-[400px] md:h-[686px] rounded-[32px] overflow-hidden shadow-[0px_8px_32px_#00000014] backdrop-blur-[27px] backdrop-brightness-[100%] relative"
              style={{ 
                backgroundImage: `url(${cardBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Plain empty image positioned down */}
              <div className="absolute bottom-8 right-8 w-32 h-32 bg-white/80 rounded-2xl shadow-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", 
    "#feca57", "#ff9ff3", "#54a0ff", "#5f27cd",
    "#0099FF", "#FF6B6B", "#4ECDC4", "#45B7D1"
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
