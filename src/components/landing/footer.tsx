import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-20 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4 items-start text-left">
            <Link href="/" className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">InnoCanvas</span>
            </Link>
            <p className="text-muted-foreground">
              Build your business model instantly.
            </p>
             <div className="flex gap-4 mt-4">
                <a href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-primary"><Github className="h-5 w-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start text-left">
            <h4 className="font-semibold">Product</h4>
            <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground">Testimonials</a>
          </div>
          <div className="flex flex-col gap-2 items-start text-left">
            <h4 className="font-semibold">Company</h4>
            <a href="#" className="text-muted-foreground hover:text-foreground">About Us</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">Contact</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">Careers</a>
          </div>
          <div className="flex flex-col gap-4 items-start text-left">
             <h4 className="font-semibold">Stay Updated</h4>
             <p className="text-muted-foreground">Subscribe to our newsletter for the latest updates.</p>
             <form className="flex gap-2 w-full">
                <Input type="email" placeholder="Enter your email" />
                <Button type="submit">Subscribe</Button>
             </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex justify-between items-center">
            <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} InnoCanvas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
