
const features = [
  {
    title: 'AI Generation',
    description:
      'Describe your business, and our AI will generate a detailed Business Model Canvas for you in seconds.',
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 4L28 9.2L34.5 10.5L38 16L37.5 22.5L42 27L39 33.5L34 37L28.5 39.5L23 44L17.5 40L12 37.5L6.5 33L5 26.5L8.5 21L6 15.5L11.5 10.5L18 8L24 4Z"
          fill="hsl(var(--vivid-pink))"
          stroke="hsl(var(--vivid-pink))"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M24 4L18 8L11.5 10.5L6 15.5L8.5 21L5 26.5L6.5 33L12 37.5L17.5 40L23 44"
          fill="hsl(var(--soft-magenta))"
          opacity="0.5"
        />
        <circle cx="20" cy="22" r="2" fill="white" />
        <circle cx="28" cy="22" r="2" fill="white" />
        <path
          d="M20 30C20 28.8954 21.7909 28 24 28C26.2091 28 28 28.8954 28 30"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Smart Templates',
    description:
      'Choose from a variety of beautiful, modern templates to visualize your business model in style.',
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="14"
          y="10"
          width="28"
          height="28"
          rx="4"
          fill="hsl(var(--vivid-pink))"
        />
        <rect
          x="14"
          y="10"
          width="14"
          height="28"
          rx="4"
          fill="hsl(var(--soft-magenta))"
          style={{mixBlendMode: 'multiply'}}
        />
        <rect
          x="6"
          y="18"
          width="28"
          height="28"
          rx="4"
          fill="hsl(var(--vivid-pink))"
          fillOpacity="0.5"
        />
      </svg>
    ),
  },
  {
    title: 'Easy Export',
    description:
      'Export your canvas to PDF or PNG formats with a single click, ready for presentations or reports.',
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 36V12M16 28L24 36L32 28"
          stroke="hsl(var(--vivid-pink))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 40H36"
          stroke="hsl(var(--vivid-pink))"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M24 36V12M16 28L24 36"
          stroke="hsl(var(--soft-magenta))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
         <path
          d="M12 40H24"
          stroke="hsl(var(--soft-magenta))"
          strokeWidth="3"
          strokeLinecap="round"
           opacity="0.5"
        />
      </svg>
    ),
  },
  {
    title: 'Collaborate & Share',
    description:
      'Share a link to your canvas with team members or stakeholders for easy collaboration and feedback.',
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="16"
          cy="24"
          r="6"
          stroke="hsl(var(--vivid-pink))"
          strokeWidth="3"
        />
        <circle
          cx="32"
          cy="16"
          r="6"
          stroke="hsl(var(--vivid-pink))"
          strokeWidth="3"
        />
        <circle
          cx="32"
          cy="32"
          r="6"
          stroke="hsl(var(--vivid-pink))"
          strokeWidth="3"
        />
        <path
          d="M21.5,21.5 L26.5,18.5"
          stroke="hsl(var(--vivid-pink))"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M21.5,26.5 L26.5,29.5"
          stroke="hsl(var(--vivid-pink))"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M21.5,26.5 L26.5,29.5"
          stroke="hsl(var(--soft-magenta))"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
        />
         <circle
          cx="16"
          cy="24"
          r="3"
          fill="hsl(var(--soft-magenta))"
          opacity="0.5"
        />
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
