import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import Testimonials from '@/components/landing/testimonials';
import Pricing from '@/components/landing/pricing';
import Faq from '@/components/landing/faq';
import Footer from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-background overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/0.1),transparent_40%),radial-gradient(circle_800px_at_20%_80%,hsl(var(--accent)/0.1),transparent_50%),radial-gradient(circle_600px_at_80%_90%,hsl(226,100%,50%/0.1),transparent_50%)]"
          style={{ animation: 'gradient-bg 15s ease infinite' }}
        ></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>
      
      <Header />
      <main className="flex-1 flex flex-col items-center text-center px-4">
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
