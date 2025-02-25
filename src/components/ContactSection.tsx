import { ScrollProgress } from "@/components/ui/scroll-progress";

const ContactSection = () => {
  return (
    <>
      <ScrollProgress />
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 mb-16 text-center">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-400">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* General Contact */}
            <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="mb-4">
                <svg
                  className="w-8 h-8 mx-auto text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">General Inquiries</h3>
              <a
                href="mailto:contact@tradenly.com"
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                contact@tradenly.com
              </a>
            </div>

            {/* Support */}
            <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="mb-4">
                <svg
                  className="w-8 h-8 mx-auto text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Technical Support</h3>
              <a
                href="mailto:support@tradenly.com"
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                support@tradenly.com
              </a>
            </div>

            {/* Business */}
            <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="mb-4">
                <svg
                  className="w-8 h-8 mx-auto text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Business Development
              </h3>
              <a
                href="mailto:business@tradenly.com"
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                business@tradenly.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;
