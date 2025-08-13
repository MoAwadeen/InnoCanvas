import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - InnoCanvas',
  description: 'Learn how InnoCanvas collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: December 19, 2024</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Account Information:</strong> Email address, name, and profile information</li>
              <li><strong>Usage Data:</strong> Information about how you use our services</li>
              <li><strong>Business Data:</strong> Business model canvas content you create</li>
              <li><strong>Payment Information:</strong> Processed securely through LemonSqueezy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your payments and manage subscriptions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Protect against fraud and abuse</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              except as described in this policy:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Service Providers:</strong> We use trusted third-party services (Supabase, OpenAI, LemonSqueezy)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure payment processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar technologies to improve your experience and analyze usage. 
              You can control cookie settings through your browser.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mb-4">
              Email: privacy@innocanvas.site<br />
              Address: [Your Business Address]
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
