import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import Testimonials from '@/components/landing/testimonials';
import Pricing from '@/components/landing/pricing';
import Faq from '@/components/landing/faq';
import Footer from '@/components/landing/footer';
import HowItWorks from '@/components/landing/how-it-works';

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center text-center px-4">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
