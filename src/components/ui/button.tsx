"use client";

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { forwardRef, type ComponentType } from "react"
import { useState } from "react"

import { cn } from "@/lib/utils"

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

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-[#77ff00] text-black hover:bg-[#88ff22]",
        animated: "bg-[#77ff00] text-black hover:bg-[#88ff22]",
        "gradient-stroke": "btn-gradient-stroke",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-md",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  animated?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, animated = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    if (animated) {
      return (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Random color change on click using new palette
            const colors = [
              "#d1241b", "#e13129", "#f19070", "#f5b39b", "#ffd697"
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            // You can add state management here if needed
          }}
        >
          <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
          />
        </motion.div>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
