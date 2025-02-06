import { Separator } from "@/components/ui/separator";

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6">Tradenly Privacy Policy</h1>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Last Updated: January 1st, 2025
      </p>

      <div className="space-y-8 text-foreground/90">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          
          <h3 className="text-xl font-medium mb-3">1.1 Personal Information</h3>
          <p className="mb-4">This includes information you provide directly to us, such as:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Contact details: name, email address, phone number, and wallet address</li>
            <li>Account details: Username, password, and account preferences</li>
            <li>Payment information: Cryptocurrency wallet addresses or transaction IDs for purchases</li>
            <li>Communication history: Any messages or requests you send to us</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">1.2 Non-Personal Information</h3>
          <p className="mb-2">We may automatically collect certain technical information, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Device information: IP address, browser type, operating system, and device identifiers</li>
            <li>Usage and Pages visited: time spent on the platform, clickstream data, and other analytics</li>
            <li>Cookies and tracking technologies: Details about your interactions with our platform</li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          
          <h3 className="text-xl font-medium mb-3">2.1 Providing Services</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>To create and manage your account</li>
            <li>To process transactions and verify payments</li>
            <li>To secure your use of the services you request</li>
          </ul>

          <h3 className="text-xl font-medium mb-3 mt-4">2.2 Communication</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>To respond to requests and provide customer support</li>
            <li>To send updates, promotional materials, and service announcements</li>
          </ul>

          <h3 className="text-xl font-medium mb-3 mt-4">2.3 Security and Compliance</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>To monitor and secure the platform against fraud and unauthorized activity</li>
            <li>To comply with legal obligations, such as anti-money laundering (AML) and Know Your Customer (KYC) requirements when applicable</li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Legal Basis for Processing (GDPR Compliance)</h2>
          <p className="mb-4">If you are located in the European Economic Area (EEA), we process your personal information based on the following legal grounds:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Consent: When you provide explicit consent for data processing</li>
            <li>Contractual necessity: To perform a contract with you or provide requested services</li>
            <li>Legal obligation: To comply with applicable laws</li>
            <li>Legitimate interests: To enhance user experience, prevent fraud, and ensure platform security</li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
          <p className="mb-4">We do not sell your personal information. However, we may share your information with:</p>
          
          <h3 className="text-xl font-medium mb-3">4.1 Service Providers</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Third-party partners who assist with:</li>
            <li>Payment processing</li>
            <li>Cloud hosting and data storage</li>
            <li>Analytics and marketing</li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          
          <h3 className="text-xl font-medium mb-3">5.1 GDPR Rights</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access: Request a copy of your processed data</li>
            <li>Correction: Update inaccurate or incomplete data</li>
            <li>Deletion: Request deletion of your data ("right to be forgotten")</li>
            <li>Restriction: Control how your data is processed</li>
            <li>Portability: Receive a copy of your data in a machine-readable format</li>
            <li>Objection: Object to processing based on legitimate interests</li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="mb-4">If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
          <p className="font-medium">Email: hello@tradenly.xyz</p>
        </section>

        <div className="text-sm text-muted-foreground mt-12 text-center">
          By using our services, you acknowledge that you have read and understood this Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default Privacy;