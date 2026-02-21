"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

/* ─── Particles (adapted from chronark) ─── */

interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
}

function Particles({
  quantity = 80,
  color = "#77ff00",
}: {
  quantity?: number;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const circlesRef = useRef<Circle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const dprRef = useRef(1);

  const rgb = useRef("119, 255, 0");

  useEffect(() => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    rgb.current = `${r}, ${g}, ${b}`;
  }, [color]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    contextRef.current = canvas.getContext("2d");
  }, []);

  const makeCircle = useCallback((): Circle => {
    const canvas = canvasRef.current;
    if (!canvas) return {} as Circle;
    const dpr = dprRef.current;
    return {
      x: (Math.random() * canvas.width) / dpr,
      y: (Math.random() * canvas.height) / dpr,
      translateX: 0,
      translateY: 0,
      size: Math.random() * 2 + 0.5,
      alpha: 0,
      targetAlpha: Math.random() * 0.5 + 0.1,
      dx: (Math.random() - 0.5) * 0.15,
      dy: (Math.random() - 0.5) * 0.15,
      magnetism: 0.1 + Math.random() * 4,
    };
  }, []);

  useEffect(() => {
    resizeCanvas();
    circlesRef.current = Array.from({ length: quantity }, () => makeCircle());

    const handleResize = () => {
      resizeCanvas();
      circlesRef.current = Array.from({ length: quantity }, () => makeCircle());
    };
    window.addEventListener("resize", handleResize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    let frame: number;
    const animate = () => {
      const ctx = contextRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;
      const dpr = dprRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      circlesRef.current.forEach((c, i) => {
        const edgeDistX = Math.min(c.x, canvas.width / dpr - c.x);
        const edgeDistY = Math.min(c.y, canvas.height / dpr - c.y);
        const edgeFactor = Math.min(edgeDistX, edgeDistY) / 100;
        const clampedEdge = Math.min(Math.max(edgeFactor, 0), 1);

        c.alpha += (c.targetAlpha * clampedEdge - c.alpha) * 0.05;

        c.x += c.dx + (mouseRef.current.x - c.x) / (1000 / c.magnetism);
        c.y += c.dy + (mouseRef.current.y - c.y) / (1000 / c.magnetism);

        if (
          c.x < -10 ||
          c.x > canvas.width / dpr + 10 ||
          c.y < -10 ||
          c.y > canvas.height / dpr + 10
        ) {
          circlesRef.current[i] = makeCircle();
          return;
        }

        ctx.beginPath();
        ctx.arc(c.x * dpr, c.y * dpr, c.size * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.current}, ${c.alpha})`;
        ctx.fill();
      });

      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [quantity, makeCircle, resizeCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

/* ─── Card with radial gradient on hover (chronark pattern) ─── */

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div
      onMouseMove={onMouseMove}
      className={`overflow-hidden relative duration-700 border rounded-xl hover:bg-zinc-800/10 group md:gap-8 hover:border-zinc-400/50 border-zinc-800 ${className}`}
    >
      <div className="pointer-events-none">
        <div className="absolute inset-0 z-0 transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
        <motion.div
          className="absolute inset-0 z-10 bg-gradient-to-br opacity-100 via-zinc-100/10 transition duration-1000 group-hover:opacity-50"
          style={style}
        />
        <motion.div
          className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
          style={style}
        />
      </div>
      {children}
    </div>
  );
}

/* ─── Icon components ─── */

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10m0 0L9 4m4 4L9 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="flex-shrink-0 mt-0.5"
    >
      <path
        d="M3 8.5l3.5 3.5L13 4.5"
        stroke="#77ff00"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Navigation ─── */

function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 duration-200 border-b ${
        scrolled
          ? "bg-zinc-900/500 border-zinc-800 backdrop-blur-lg"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        <Link
          href="/"
          className="text-zinc-100 font-bold tracking-tight text-lg duration-200 hover:text-white"
        >
          InnoCanvas
        </Link>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "How It Works", href: "#how-it-works" },
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 duration-200 hover:text-zinc-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <Link
            href="/register"
            className="text-sm text-black bg-[#77ff00] hover:bg-[#88ff22] px-4 py-2 rounded-lg duration-200 font-medium"
          >
            Start Free
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─── Main Page ─── */

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <Particles quantity={80} color="#3b82f6" />

      <Navigation />

      <main className="relative z-10">
        {/* ── Hero ── */}
        <section className="flex flex-col items-center justify-center px-6 pt-32 pb-8 mx-auto max-w-7xl md:pt-40 lg:pt-48">
          <div className="animate-fade-in text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs text-zinc-500 border border-zinc-800 rounded-full">
              <span className="text-[#77ff00]">✦</span> Built for early-stage
              founders
            </div>
          </div>

          <h1 className="animate-fade-in animate-delay-1 title-gradient text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-4xl">
            From idea to Canvas
          </h1>

          <p className="animate-fade-in animate-delay-2 mt-6 text-center text-zinc-400 max-w-xl text-base sm:text-lg leading-relaxed">
            Describe your startup. Our AI builds your complete Business Model
            Canvas&mdash;value proposition, revenue streams, customer segments,
            all of it.
          </p>

          <div className="animate-fade-in animate-delay-3 flex flex-col sm:flex-row items-center gap-4 mt-10">
            <Link
              href="/register"
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-black bg-[#77ff00] hover:bg-[#88ff22] rounded-lg duration-200"
            >
              Generate Your BMC Free <ArrowIcon />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-zinc-300 border border-zinc-800 hover:border-zinc-600 rounded-lg duration-200"
            >
              See How It Works
            </a>
          </div>

          {/* Glow separator */}
          <div className="glow-line w-full max-w-2xl mt-16 mb-8" />

          {/* BMC Preview */}
          <div className="animate-fade-in animate-delay-4 w-full max-w-4xl">
            <Card>
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-zinc-100">
                    EcoDelivery &mdash; Business Model
                  </span>
                  <span className="text-xs text-[#77ff00] border border-[#77ff00]/20 rounded-full px-2 py-0.5">
                    AI Generated
                  </span>
                </div>
                <div className="bmc-grid text-left">
                  <div className="bmc-cell" style={{ gridRow: "1 / 3" }}>
                    <div className="bmc-cell-label">Partners</div>
                    Local farms, EV manufacturers
                  </div>
                  <div className="bmc-cell">
                    <div className="bmc-cell-label">Activities</div>
                    Route optimization, fleet mgmt
                  </div>
                  <div
                    className="bmc-cell bmc-cell-highlight"
                    style={{ gridRow: "1 / 3" }}
                  >
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
                  <div className="bmc-cell">
                    <div className="bmc-cell-label">Resources</div>
                    EV fleet, AI routing system
                  </div>
                  <div className="bmc-cell">
                    <div className="bmc-cell-label">Channels</div>
                    API, Shopify app, direct sales
                  </div>
                  <div className="bmc-cell" style={{ gridColumn: "1 / 3" }}>
                    <div className="bmc-cell-label">Costs</div>
                    Fleet maintenance, driver salaries, tech infrastructure
                  </div>
                  <div
                    className="bmc-cell bmc-cell-highlight"
                    style={{ gridColumn: "3 / 6" }}
                  >
                    <div className="bmc-cell-label">Revenue</div>
                    Per-delivery fees, subscriptions, enterprise contracts
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section
          id="how-it-works"
          className="px-6 pt-24 mx-auto max-w-7xl md:pt-32"
        >
          <div className="max-w-2xl mx-auto lg:mx-0">
            <p className="text-sm text-[#77ff00] font-medium tracking-wide uppercase mb-4">
              How It Works
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Three steps. One complete business model.
            </h2>
          </div>
          <div className="w-full h-px bg-zinc-800 my-8" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Describe Your Idea",
                text: "Tell us about your startup in plain language. What problem do you solve? Who\u2019s your customer? Even a rough idea works.",
              },
              {
                num: "02",
                title: "AI Builds Your BMC",
                text: "Our AI analyzes your input and generates a complete Business Model Canvas\u2014all 9 building blocks, tailored to your specific business.",
              },
              {
                num: "03",
                title: "Refine & Export",
                text: "Edit any section, ask the AI for alternatives, then export as PDF or image. Ready for your pitch deck or investor meeting.",
              },
            ].map((step) => (
              <Card key={step.num}>
                <article className="relative p-6 md:p-8">
                  <span className="text-4xl font-bold text-[#77ff00]/20">
                    {step.num}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-zinc-100 group-hover:text-white duration-150">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 duration-150">
                    {step.text}
                  </p>
                </article>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Features — AI Consultant ── */}
        <section
          id="features"
          className="px-6 pt-24 mx-auto max-w-7xl md:pt-32"
        >
          <div className="max-w-2xl mx-auto lg:mx-0 mb-8">
            <p className="text-sm text-[#77ff00] font-medium tracking-wide uppercase mb-4">
              AI Consultant
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Like having a strategist in your pocket
            </h2>
            <p className="mt-4 text-zinc-400 leading-relaxed">
              Go beyond the canvas. Ask questions about your business model,
              validate assumptions, explore pricing strategies, or brainstorm
              customer acquisition.
            </p>
          </div>
          <div className="w-full h-px bg-zinc-800 mb-8" />

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Feature list */}
            <div className="space-y-6">
              {[
                {
                  title: "Validate Your Assumptions",
                  desc: "Get honest feedback on your value prop and market fit",
                },
                {
                  title: "Pricing Strategy Help",
                  desc: "Explore different revenue models and pricing approaches",
                },
                {
                  title: "Growth Tactics",
                  desc: "Get ideas for acquiring your first 100 customers",
                },
              ].map((f) => (
                <div key={f.title} className="flex gap-3">
                  <CheckIcon />
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-100">
                      {f.title}
                    </h4>
                    <p className="text-sm text-zinc-500 mt-1">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat demo */}
            <Card>
              <div className="p-5 space-y-4">
                <div className="flex justify-end">
                  <div className="bg-[#77ff00] rounded-xl px-4 py-2.5 text-sm text-black max-w-xs">
                    How should I price my B2B SaaS for small restaurants?
                  </div>
                </div>
                <div className="border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 space-y-2">
                  <p>
                    For small restaurants, I&apos;d recommend a{" "}
                    <strong className="text-zinc-200">tiered approach</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>
                      <strong className="text-zinc-200">
                        Starter ($29/mo):
                      </strong>{" "}
                      Core features, 1 location
                    </li>
                    <li>
                      <strong className="text-zinc-200">
                        Growth ($79/mo):
                      </strong>{" "}
                      Analytics, multi-location
                    </li>
                    <li>
                      <strong className="text-zinc-200">Pro ($149/mo):</strong>{" "}
                      API access, priority support
                    </li>
                  </ul>
                  <p className="text-xs">
                    Start monthly to reduce friction. Most restaurant SaaS sees
                    3-5% trial conversion.
                  </p>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#77ff00] rounded-xl px-4 py-2.5 text-sm text-black max-w-xs">
                    What about a usage-based model?
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section
          id="pricing"
          className="px-6 pt-24 pb-16 mx-auto max-w-7xl md:pt-32"
        >
          <div className="max-w-2xl mx-auto lg:mx-0 mb-4">
            <p className="text-sm text-[#77ff00] font-medium tracking-wide uppercase mb-4">
              Pricing
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Simple pricing for founders
            </h2>
            <p className="mt-4 text-zinc-400">
              Start free, upgrade when you need more. No credit card required.
            </p>
          </div>
          <div className="w-full h-px bg-zinc-800 my-8" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl">
            {/* Free */}
            <Card>
              <div className="p-6 md:p-8 flex flex-col h-full">
                <h3 className="text-lg font-bold text-zinc-100">Free</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Try it out, no commitment
                </p>
                <div className="text-4xl font-bold text-zinc-100 mt-6">$0</div>
                <ul className="space-y-3 mt-6 flex-grow">
                  {[
                    "1 Business Model Canvas",
                    "AI chat (limited)",
                    "Export as JPG",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-zinc-400"
                    >
                      <CheckIcon /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-8 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-zinc-300 border border-zinc-800 hover:border-zinc-600 rounded-lg duration-200 w-full"
                >
                  Get Started
                </Link>
              </div>
            </Card>

            {/* Pro */}
            <Card className="border-[#77ff00]/30 hover:border-[#77ff00]/50">
              <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-zinc-100">Pro</h3>
                  <span className="text-xs text-[#77ff00] border border-[#77ff00]/20 rounded-full px-2 py-0.5">
                    Most Popular
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  For founders building seriously
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-[#77ff00]">$8</span>
                  <span className="text-sm text-zinc-500">/month</span>
                </div>
                <ul className="space-y-3 mt-6 flex-grow">
                  {[
                    "10 Business Model Canvases",
                    "Unlimited AI chat",
                    "Export as editable PDF",
                    "Custom color palettes",
                    "Priority support",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-zinc-400"
                    >
                      <CheckIcon /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-8 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-black bg-[#77ff00] hover:bg-[#88ff22] rounded-lg duration-200 w-full"
                >
                  Start Pro Free
                </Link>
              </div>
            </Card>

            {/* Premium */}
            <Card>
              <div className="p-6 md:p-8 flex flex-col h-full">
                <h3 className="text-lg font-bold text-zinc-100">Premium</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Full toolkit for serious builders
                </p>
                <div className="text-4xl font-bold text-zinc-100 mt-6">
                  $15
                  <span className="text-sm font-normal text-zinc-500">
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mt-6 flex-grow">
                  {[
                    "Unlimited canvases",
                    "Specialized AI consultants",
                    "Pitch deck generator",
                    "Custom templates",
                    "24/7 priority support",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-zinc-400"
                    >
                      <CheckIcon /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-8 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-zinc-300 border border-zinc-800 hover:border-zinc-600 rounded-lg duration-200 w-full"
                >
                  Start Premium
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="px-6 pb-24 mx-auto max-w-7xl">
          <Card>
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
                Your business model shouldn&apos;t take weeks to figure out
              </h2>
              <p className="mt-4 text-zinc-400 max-w-lg mx-auto">
                Join founders who&apos;ve gone from scattered ideas to clear
                business models in minutes.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm font-medium text-black bg-[#77ff00] hover:bg-[#88ff22] rounded-lg duration-200"
              >
                Generate Your BMC Free <ArrowIcon />
              </Link>
            </div>
          </Card>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-zinc-800">
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-8 mx-auto max-w-7xl gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-zinc-100 tracking-tight">
              InnoCanvas
            </span>
            <span className="text-xs text-zinc-600">
              &copy; 2025 InnoCanvas. Built for founders.
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <Link
              href="/privacy"
              className="duration-200 hover:text-zinc-300"
            >
              Privacy
            </Link>
            <Link href="/terms" className="duration-200 hover:text-zinc-300">
              Terms
            </Link>
            <a
              href="mailto:hello@innocanvas.site"
              className="duration-200 hover:text-zinc-300"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
