import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
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
              InnoCanvas AI is designed to revolutionize how businesses operate.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 items-start text-left">
            <h4 className="font-semibold">Company</h4>
            <Link href="#features" className="text-muted-foreground hover:text-primary">Features</Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-primary">Pricing</Link>
          </div>
          
          <div className="flex flex-col gap-2 items-start text-left">
            <h4 className="font-semibold">Resources</h4>
            <Link href="#" className="text-muted-foreground hover:text-primary">Insights</Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-primary">Reviews</Link>
          </div>
          
          <div className="flex flex-col gap-2 items-start text-left">
            <h4 className="font-semibold">Legal</h4>
            <Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <h4 className="font-semibold">Stay connected</h4>
              <div className="flex items-center gap-3">
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Github className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <Logo href="/" />
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 InnoCanvas, Inc. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
