import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { Logo } from "../logo";

export default function Footer() {
  return (
    <footer className="w-full mt-20 border-t border-border/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4 items-start text-left col-span-1 md:col-span-2">
            <Logo href="/" />
            <p className="text-muted-foreground max-w-sm">
              Reimagine your business model. Visually, Intelligently, Instantly.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 items-start text-left">
            <h4 className="font-semibold">Company</h4>
            <Link href="#" className="text-muted-foreground hover:text-primary">About</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">Contact</Link>
          </div>
          <div className="flex flex-col gap-2 items-start text-left">
             <h4 className="font-semibold">Connect</h4>
            <Link href="#" className="text-muted-foreground hover:text-primary flex items-center gap-2">
                <Twitter className="h-4 w-4" /> Twitter
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary flex items-center gap-2">
                <Linkedin className="h-4 w-4" /> LinkedIn
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary flex items-center gap-2">
                <Github className="h-4 w-4" /> GitHub
            </Link>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/50 flex justify-between items-center">
            <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} InnoCanvas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
