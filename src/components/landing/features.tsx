
const features = [
  {
    title: 'AI Generation',
    description:
      'Describe your business, and our AI will generate a detailed Business Model Canvas for you in seconds.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ai-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="hsl(var(--soft-magenta))" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="hsl(var(--vivid-pink))" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="ai-surface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--vivid-pink))" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="hsl(var(--vivid-pink))" stopOpacity="0.4"/>
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="url(#ai-glow)"/>
        <path d="M24 8C15.1634 8 8 15.1634 8 24C8 32.8366 15.1634 40 24 40C32.8366 40 40 32.8366 40 24C40 18.55 36.6276 13.824 31.42 11.2302" stroke="hsl(var(--vivid-pink))" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M24 16L24 24L30 27" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="16" fill="url(#ai-surface)" stroke="hsl(var(--vivid-pink))" strokeOpacity="0.5"/>
        <circle cx="24" cy="24" r="2" fill="white" />
      </svg>
    ),
  },
  {
    title: 'Smart Templates',
    description:
      'Choose from a variety of beautiful, modern templates to visualize your business model in style.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
           <linearGradient id="template-surface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--vivid-pink))" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="hsl(var(--vivid-pink))" stopOpacity="0.4"/>
          </linearGradient>
        </defs>
        <path d="M14 12H34C35.1046 12 36 12.8954 36 14V34C36 35.1046 35.1046 36 34 36H14C12.8954 36 12 35.1046 12 34V14C12 12.8954 12.8954 12 14 12Z" fill="url(#template-surface)" stroke="hsl(var(--vivid-pink))" strokeOpacity="0.5" strokeWidth="1.5"/>
        <path d="M12 16L36 16" stroke="white" strokeOpacity="0.3"/>
        <path d="M12 22L36 22" stroke="white" strokeOpacity="0.3"/>
        <rect x="8" y="16" width="32" height="24" rx="2" stroke="hsl(var(--soft-magenta))" strokeWidth="1.5" strokeOpacity="0.8" fill="transparent" style={{transform: 'translateY(-4px) translateX(-4px) rotate(-5deg)'}}/>
      </svg>
    ),
  },
  {
    title: 'Easy Export',
    description:
      'Export your canvas to PDF or PNG formats with a single click, ready for presentations or reports.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="arrow-grad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--soft-magenta))"/>
            <stop offset="100%" stopColor="hsl(var(--vivid-pink))"/>
          </linearGradient>
        </defs>
        <path d="M24 12V32M18 26L24 32L30 26" stroke="url(#arrow-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 38H36" stroke="hsl(var(--vivid-pink))" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M12 38H36" filter="url(#f1)" stroke="hsl(var(--vivid-pink))" strokeWidth="2.5" strokeLinecap="round"/>
        <filter id="f1">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
        <path d="M24 12V32" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3"/>
      </svg>
    ),
  },
  {
    title: 'Collaborate & Share',
    description:
      'Share a link to your canvas with team members or stakeholders for easy collaboration and feedback.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="white" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="hsl(var(--vivid-pink))" stopOpacity="0.3"/>
          </radialGradient>
        </defs>
        <path d="M22 20L30 14" stroke="hsl(var(--vivid-pink))" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 28L30 34" stroke="hsl(var(--vivid-pink))" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="24" r="6" fill="url(#node-glow)" stroke="hsl(var(--vivid-pink))" strokeWidth="1.5"/>
        <circle cx="32" cy="12" r="5" fill="url(#node-glow)" stroke="hsl(var(--vivid-pink))" strokeWidth="1.5"/>
        <circle cx="32" cy="36" r="5" fill="url(#node-glow)" stroke="hsl(var(--vivid-pink))" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="container py-20 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="headline-glow">
          <h2 className="text-3xl md:text-4xl font-bold">Why InnoCanvas?</h2>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to transform your business idea into a concrete plan.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
        {features.map((feature) => (
           <div key={feature.title} className="flex justify-center">
              <div className="card-glass text-center p-8 flex flex-col items-center">
                <div className="text-primary mb-4">{feature.icon}</div>
                <div className="text-xl font-bold text-foreground mb-2">{feature.title}</div>
                <div className="text-muted-foreground">{feature.description}</div>
              </div>
           </div>
        ))}
      </div>
    </section>
  );
}
