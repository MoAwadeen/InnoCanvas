import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - InnoCanvas',
  description: 'Read our terms of service and user agreement for using InnoCanvas.',
};

export default function TermsOfServicePage() {
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
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: December 19, 2024</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using InnoCanvas ("the Service"), you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              InnoCanvas is an AI-powered Business Model Canvas generator that helps users create 
              comprehensive business models. The service includes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>AI-powered business model canvas generation</li>
              <li>Interactive canvas editing and customization</li>
              <li>Export functionality (PDF)</li>
              <li>User account management</li>
              <li>Subscription-based premium features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="mb-4">
              To use certain features of the Service, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payment</h2>
            <p className="mb-4">
              The Service offers both free and premium subscription plans:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Free Plan:</strong> Limited features and usage</li>
              <li><strong>Pro Plan:</strong> Enhanced features with monthly/annual billing</li>
              <li><strong>Premium Plan:</strong> Full access to all features</li>
            </ul>
            <p className="mb-4">
              Payments are processed securely through LemonSqueezy. Subscriptions automatically renew 
              unless cancelled before the renewal date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. User Content</h2>
            <p className="mb-4">
              You retain ownership of the business model canvases and content you create. By using 
              the Service, you grant us a limited license to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Store and process your content to provide the Service</li>
              <li>Use anonymized data for service improvement</li>
              <li>Backup and secure your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Acceptable Use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Share account credentials with others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p className="mb-4">
              The Service and its original content, features, and functionality are owned by InnoCanvas 
              and are protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Privacy</h2>
            <p className="mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of the Service, to understand our practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimers</h2>
            <p className="mb-4">
              The Service is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Uninterrupted or error-free service</li>
              <li>Accuracy of AI-generated content</li>
              <li>Compatibility with all devices or browsers</li>
              <li>Security against all potential threats</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall InnoCanvas be liable for any indirect, incidental, special, 
              consequential, or punitive damages arising out of or relating to your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and access to the Service immediately, 
              without prior notice, for any reason, including breach of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. We will notify users of 
              significant changes via email or through the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p className="mb-4">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <p className="mb-4">
              Email: legal@innocanvas.site<br />
              Address: [Your Business Address]
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
