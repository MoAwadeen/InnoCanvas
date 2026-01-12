
"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "../logo";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { forwardRef, type ComponentType } from "react";

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

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Reviews", href: "#testimonials" },
  ];

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border/50" : "bg-transparent"
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container flex h-20 items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Logo href="/" />
        </motion.div>

        <nav className="hidden md:flex">
          <ul className="flex items-center gap-8 text-sm">
            {navLinks.map((link, index) => (
              <motion.li
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -2 }}
                onHoverStart={() => setHoveredLink(link.name)}
                onHoverEnd={() => setHoveredLink(null)}
              >
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground font-medium relative"
                >
                  {link.name}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#d1241b] to-[#f19070]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredLink === link.name ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {!loading && (
            user ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href="/dashboard">
                  <Button variant="secondary">Dashboard</Button>
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link href="/login">
                    <Button variant="gradient-stroke">Log In</Button>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/register">
                    <Button className="btn-gradient">
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
              </>
            )
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-background/95 backdrop-blur-lg">
                <motion.div
                  className="grid gap-6 py-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Logo href="/" />
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                      whileHover={{ x: 10 }}
                    >
                      <Link
                        href={link.href}
                        className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                  <div className="border-t border-border pt-6 mt-2 grid grid-cols-2 gap-4">
                    {!loading && (
                      user ? (
                        <motion.div
                          className="w-full col-span-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Link href="/dashboard" className="w-full col-span-2">
                            <Button variant="secondary" className="w-full">Dashboard</Button>
                          </Link>
                        </motion.div>
                      ) : (
                        <>
                          <motion.div
                            className="w-full"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <Link href="/login" className="w-full">
                              <Button variant="gradient-stroke" className="w-full">Log In</Button>
                            </Link>
                          </motion.div>
                          <motion.div
                            className="w-full"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link href="/register" className="w-full">
                              <Button className="w-full btn-gradient">
                                Get Started
                              </Button>
                            </Link>
                          </motion.div>
                        </>
                      )
                    )}
                  </div>
                </motion.div>
              </SheetContent>
            </Sheet>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
