
"use client";

import Link from "next/link";
import { Bot, Home, LayoutDashboard, PanelTop, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function ThemeToggleButton() {
    const { setTheme } = useTheme()
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

export default function Header() {
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">InnoCanvas</span>
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <nav className="hidden md:flex flex-1 items-center justify-center">
            <ul className="flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
                <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/register">
                <Button className="bg-primary text-primary-foreground">
                    Get Started Free
                </Button>
            </Link>
            <ThemeToggleButton />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <PanelTop className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="bg-background/95 backdrop-blur-lg">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">InnoCanvas</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                 <Link href="/my-canvases" className="text-muted-foreground transition-colors hover:text-foreground">
                    Home
                 </Link>
                 <Link href="/my-canvases" className="text-muted-foreground transition-colors hover:text-foreground">
                    My Canvases
                 </Link>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <Link href="/login">
                    <Button variant="ghost" className="w-full">Log In</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-primary text-primary-foreground w-full">
                        Get Started Free
                    </Button>
                  </Link>
              </div>
              <div className="mt-4 flex justify-center">
                <ThemeToggleButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
