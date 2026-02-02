'use client';

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard } from "lucide-react";

export function Navbar() {
  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 nav-glass px-2 py-2 flex items-center gap-6" role="navigation">
      <Link href="/" className="px-4 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
        InnoCanvas
      </Link>
      <div className="hidden md:flex items-center gap-6">
        <a href="#how-it-works" className="text-sm" style={{ color: "var(--text-secondary)" }}>How It Works</a>
        <a href="#features" className="text-sm" style={{ color: "var(--text-secondary)" }}>Features</a>
        <a href="#pricing" className="text-sm" style={{ color: "var(--text-secondary)" }}>Pricing</a>
      </div>
      {!loading && user ? (
        <Link href="/my-canvases" className="btn-primary flex items-center gap-2" style={{ padding: "8px 20px", fontSize: "0.875rem" }}>
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
      ) : (
        <Link href="/register" className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.875rem" }}>
          Start Free
        </Link>
      )}
    </nav>
  );
}
