import React from "react";
import Link from "next/link";

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
      <circle cx="10" cy="10" r="10" fill="url(#checkGrad)" />
      <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="checkGrad" x1="0" y1="0" x2="20" y2="20">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Orbs */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 nav-glass px-2 py-2 flex items-center gap-6" role="navigation">
        <Link href="/" className="px-4 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
          InnoCanvas
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <a href="#how-it-works" className="text-sm" style={{ color: "var(--text-secondary)" }}>How It Works</a>
          <a href="#features" className="text-sm" style={{ color: "var(--text-secondary)" }}>Features</a>
          <a href="#pricing" className="text-sm" style={{ color: "var(--text-secondary)" }}>Pricing</a>
        </div>
        <Link href="/register" className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.875rem" }}>
          Start Free
        </Link>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-4 max-w-6xl mx-auto text-center">
          <div className="fade-in-up">
            <span className="inline-block glass px-4 py-2 text-sm mb-8" style={{ color: "var(--text-secondary)", borderRadius: "9999px" }}>
              ✦ Built for early-stage founders
            </span>
          </div>
          <h1 className="fade-in-up delay-1 text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            From idea to{" "}
            <em className="gradient-text not-italic">Business Model Canvas</em>
            {" "}in 5 minutes
          </h1>
          <p className="fade-in-up delay-2 text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: "var(--text-secondary)" }}>
            Describe your startup. Our AI builds your complete BMC—value proposition, revenue streams, customer segments, all of it. Edit, refine, export.
          </p>
          <div className="fade-in-up delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register" className="btn-primary">
              Generate Your BMC Free <ArrowIcon />
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              See How It Works
            </a>
          </div>

          {/* BMC Preview Card */}
          <div className="fade-in-up delay-4 glass-strong p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                EcoDelivery — Business Model
              </h3>
              <span className="gradient-text text-xs font-bold px-3 py-1 glass" style={{ borderRadius: "9999px" }}>
                AI Generated
              </span>
            </div>
            <div className="bmc-grid text-left">
              {/* Row 1: Partners | Activities | Value Prop | Relationships | Segments */}
              <div className="bmc-cell" style={{ gridRow: "1 / 3" }}>
                <div className="bmc-cell-label">Partners</div>
                Local farms, EV manufacturers
              </div>
              <div className="bmc-cell">
                <div className="bmc-cell-label">Activities</div>
                Route optimization, fleet mgmt
              </div>
              <div className="bmc-cell bmc-cell-highlight" style={{ gridRow: "1 / 3" }}>
                <div className="bmc-cell-label">Value Prop</div>
                Carbon-neutral delivery for eco-conscious businesses
              </div>
              <div className="bmc-cell">
                <div className="bmc-cell-label">Relationships</div>
                Dedicated account managers
              </div>
              <div className="bmc-cell" style={{ gridRow: "1 / 3" }}>
                <div className="bmc-cell-label">Segments</div>
                SMBs, D2C brands, restaurants
              </div>
              {/* Row 2: (Partners spans) | Resources | (VP spans) | Channels | (Segments spans) */}
              <div className="bmc-cell">
                <div className="bmc-cell-label">Resources</div>
                EV fleet, AI routing system
              </div>
              <div className="bmc-cell">
                <div className="bmc-cell-label">Channels</div>
                API, Shopify app, direct sales
              </div>
              {/* Row 3: Costs (span 2) | Revenue (span 3) */}
              <div className="bmc-cell" style={{ gridColumn: "1 / 3" }}>
                <div className="bmc-cell-label">Costs</div>
                Fleet maintenance, driver salaries, tech infrastructure
              </div>
              <div className="bmc-cell bmc-cell-highlight" style={{ gridColumn: "3 / 6" }}>
                <div className="bmc-cell-label">Revenue</div>
                Per-delivery fees, subscriptions, enterprise contracts
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label gradient-text">HOW IT WORKS</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Three steps. One complete business model.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Describe Your Idea",
                text: "Tell us about your startup in plain language. What problem do you solve? Who's your customer? Even a rough idea works.",
              },
              {
                num: "02",
                title: "AI Builds Your BMC",
                text: "Our AI analyzes your input and generates a complete Business Model Canvas—all 9 building blocks, tailored to your specific business.",
              },
              {
                num: "03",
                title: "Refine & Export",
                text: "Edit any section, ask the AI for alternatives, then export as PDF or image. Ready for your pitch deck or investor meeting.",
              },
            ].map((step) => (
              <div key={step.num} className="glass card-hover p-8">
                <span className="gradient-text text-5xl font-bold italic mb-4 block" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {step.num}
                </span>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features - AI Consultant */}
        <section id="features" className="py-24 px-4 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <span className="section-label gradient-text">AI CONSULTANT</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Like having a strategist in your pocket
              </h2>
              <p className="mb-8" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                Go beyond the canvas. Ask questions about your business model, validate assumptions, explore pricing strategies, or brainstorm customer acquisition.
              </p>
              <div className="space-y-5">
                {[
                  { title: "Validate Your Assumptions", desc: "Get honest feedback on your value prop and market fit" },
                  { title: "Pricing Strategy Help", desc: "Explore different revenue models and pricing approaches" },
                  { title: "Growth Tactics", desc: "Get ideas for acquiring your first 100 customers" },
                ].map((f) => (
                  <div key={f.title} className="flex gap-3">
                    <CheckIcon />
                    <div>
                      <h4 className="font-semibold mb-1">{f.title}</h4>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Chat Demo */}
            <div className="glass-strong p-6 space-y-4">
              {/* User message */}
              <div className="flex justify-end">
                <div className="rounded-2xl px-5 py-3 max-w-sm text-sm" style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
                  How should I price my B2B SaaS for small restaurants?
                </div>
              </div>
              {/* AI response */}
              <div className="glass rounded-2xl px-5 py-4 text-sm space-y-2" style={{ color: "var(--text-secondary)" }}>
                <p>Great question! For small restaurants, I&apos;d recommend a <strong className="text-white">tiered approach</strong>:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong className="text-white">Starter ($29/mo):</strong> Core features, 1 location</li>
                  <li><strong className="text-white">Growth ($79/mo):</strong> Analytics, multi-location</li>
                  <li><strong className="text-white">Pro ($149/mo):</strong> API access, priority support</li>
                </ul>
                <p>Start with monthly billing to reduce friction. Most restaurant SaaS sees 3-5% conversion from free trials.</p>
              </div>
              {/* User follow-up */}
              <div className="flex justify-end">
                <div className="rounded-2xl px-5 py-3 max-w-sm text-sm" style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
                  What about a usage-based model?
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label gradient-text">PRICING</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Simple pricing for founders
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Start free, upgrade when you need more. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <div className="glass card-hover p-8 flex flex-col">
              <h3 className="text-xl font-bold mb-1">Free</h3>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Try it out, no commitment</p>
              <div className="text-4xl font-bold mb-6">$0</div>
              <ul className="space-y-3 mb-8 flex-grow">
                {["1 Business Model Canvas", "AI chat (limited)", "Export as JPG"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <CheckIcon /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-secondary justify-center w-full">Get Started</Link>
            </div>

            {/* Pro - Featured */}
            <div className="relative glass card-hover pricing-featured p-8 flex flex-col" style={{ border: "1px solid var(--glass-border-strong)" }}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-text text-xs font-bold px-4 py-1 glass" style={{ borderRadius: "9999px" }}>
                Most Popular
              </span>
              <h3 className="text-xl font-bold mb-1">Pro</h3>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>For founders building seriously</p>
              <div className="text-4xl font-bold mb-6">
                <span className="gradient-text">$8</span>
                <span className="text-base font-normal" style={{ color: "var(--text-muted)" }}>/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "10 Business Model Canvases",
                  "Unlimited AI chat",
                  "Export as editable PDF",
                  "Custom color palettes",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <CheckIcon /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-primary justify-center w-full">Start Pro Free</Link>
            </div>

            {/* Premium */}
            <div className="glass card-hover p-8 flex flex-col">
              <h3 className="text-xl font-bold mb-1">Premium</h3>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Full toolkit for serious builders</p>
              <div className="text-4xl font-bold mb-6">
                $15<span className="text-base font-normal" style={{ color: "var(--text-muted)" }}>/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "Unlimited canvases",
                  "Specialized AI consultants",
                  "Pitch deck generator",
                  "Custom templates",
                  "24/7 priority support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <CheckIcon /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-secondary justify-center w-full">Start Premium</Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4 max-w-4xl mx-auto">
          <div className="glass-strong p-12 text-center" style={{ borderTop: "2px solid", borderImage: "linear-gradient(90deg, var(--accent-1), var(--accent-2), var(--accent-3)) 1" }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your business model shouldn&apos;t take weeks to figure out
            </h2>
            <p className="mb-8 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Join founders who&apos;ve gone from scattered ideas to clear business models in minutes.
            </p>
            <Link href="/register" className="btn-primary">
              Generate Your BMC Free <ArrowIcon />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 max-w-6xl mx-auto" style={{ borderTop: "1px solid var(--glass-border)" }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>InnoCanvas</span>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>© 2025 InnoCanvas. Built for founders.</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: "var(--text-secondary)" }}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <a href="mailto:hello@innocanvas.site">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
