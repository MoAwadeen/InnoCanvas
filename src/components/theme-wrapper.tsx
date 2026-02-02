export function ThemeWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`min-h-screen relative overflow-hidden theme-wrapper ${className}`} style={{ background: '#0d0d1a' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}
