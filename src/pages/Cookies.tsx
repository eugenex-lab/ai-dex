import { Cookie, Shield, LockOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Cookies = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6">Cookies Policy for Tradenly</h1>
      <p className="text-sm text-muted-foreground text-center mb-8">
        At Tradenly, we value your privacy and strive to maintain a transparent and user-friendly trading experience. This Cookies Policy outlines how we use cookies and similar technologies while emphasizing our commitment to safeguarding your data.
      </p>

      <div className="space-y-8 text-foreground/90">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Cookie className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Our Approach to Cookies</h2>
          </div>
          <p className="mb-4">
            We use cookies sparingly and only when absolutely necessary to ensure the smooth operation of our platform. Here's what you need to know:
          </p>
        </section>

        <section className="glass-card p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-4">Essential Cookies Only</h3>
          <p className="mb-2">We use cookies solely to facilitate your trading experience. These cookies help:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Authenticate your sessions.</li>
            <li>Save your basic preferences (e.g., language and interface settings).</li>
            <li>Enhance the security of your interactions.</li>
          </ul>
          <p className="mt-4 text-muted-foreground">No unnecessary or non-essential cookies are placed on your device.</p>
        </section>

        <Separator className="my-8" />

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">No Tracking or Profiling</h2>
          </div>
          <p className="mb-2">Tradenly does not use cookies for tracking or behavioral profiling.</p>
          <p>We do not use cookies for targeted advertising, marketing, or analytics purposes.</p>
        </section>

        <section className="glass-card p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-4">Types of Cookies We Use</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Session Cookies:</h4>
              <p>These are temporary and are erased as soon as you close your browser or log out. They help maintain your active session and ensure a seamless trading flow.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Preference Cookies:</h4>
              <p>These save your settings, like your chosen trading view or interface options, to improve convenience during future visits.</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <LockOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Your Control Over Cookies</h2>
          </div>
          <p className="mb-4">You can control how cookies are stored on your device:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Most browsers allow you to clear, block, or manage cookies.</li>
            <li>Be aware that disabling cookies might affect core functionalities, such as login persistence or user preferences, which are essential for trading operations.</li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section className="glass-card p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-4">Commitment to Security and Anonymity</h3>
          <p className="mb-4">
            Tradenly is built with your privacy in mind. We do not store any information that could harm your privacy or security. As part of our decentralized approach:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your sensitive data remains within your control, stored securely on your device or blockchain wallet.</li>
            <li>We will never access or retain private keys, passwords, or wallet addresses.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Policy Updates</h2>
          <p className="mb-4">
            We may update this policy periodically to reflect changes in regulations or improvements in our platform. All updates will maintain our commitment to minimal cookie usage and respect for your privacy.
          </p>
          <p className="mb-4">
            If you have any questions about our Cookies Policy or how we protect your data, please contact us at{" "}
            <a href="mailto:support@tradenly.xyz" className="text-primary hover:underline">
              support@tradenly.xyz
            </a>
          </p>
          <p className="text-center text-muted-foreground mt-8">
            Your privacy is our priority—trade with confidence.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Cookies;