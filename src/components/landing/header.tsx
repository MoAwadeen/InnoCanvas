
"use client";

import Link from "next/link";
import { Bot, PanelTop } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">InnoCanvas</span>
        </Link>
        
        <nav className="hidden md:flex">
            <ul className="flex items-center gap-8 text-sm">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
        </nav>

        <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
                <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/register">
                <Button variant="gradient">
                    Get Started
                </Button>
            </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <PanelTop className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="bg-background">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">InnoCanvas</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <Link href="/login" className="w-full">
                    <Button variant="ghost" className="w-full">Log In</Button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <Button variant="gradient" className="w-full">
                        Get Started
                    </Button>
                  </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
