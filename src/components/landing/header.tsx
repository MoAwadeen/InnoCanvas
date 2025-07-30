
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

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    { name: "How it Works", href: "#how-it-works" },
  ];

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border/50" : "bg-transparent"
    )}>
      <div className="container flex h-20 items-center justify-between">
        <Logo href="/" />
        
        <nav className="hidden md:flex">
            <ul className="flex items-center gap-8 text-sm">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
        </nav>

        <div className="hidden md:flex items-center gap-2">
            {!loading && (
              user ? (
                 <Link href="/my-canvases">
                    <Button variant="secondary">My Canvases</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                      <Button variant="ghost">Log In</Button>
                  </Link>
                  <Link href="/register">
                      <Button className="btn-gradient">
                          Sign Up
                      </Button>
                  </Link>
                </>
              )
            )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="bg-background/95 backdrop-blur-lg">
              <div className="grid gap-6 py-6">
                <Logo href="/" />
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="border-t border-border pt-6 mt-2 grid grid-cols-2 gap-4">
                  {!loading && (
                    user ? (
                      <Link href="/my-canvases" className="w-full col-span-2">
                        <Button variant="secondary" className="w-full">My Canvases</Button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/login" className="w-full">
                          <Button variant="outline" className="w-full">Log In</Button>
                        </Link>
                        <Link href="/register" className="w-full">
                          <Button className="w-full btn-gradient">
                              Sign Up
                          </Button>
                        </Link>
                      </>
                    )
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
