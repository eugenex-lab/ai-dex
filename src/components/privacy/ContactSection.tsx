import React from "react";

const ContactSection = () => {
  return (
    <section className="space-y-4 text-center">
      <h2 className="text-2xl font-semibold">Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy or our
        data practices, please contact our dedicated teams:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="p-4 rounded-lg border">
          <h3 className="text-lg font-medium">General Inquiries</h3>
          <p>
            Email:{" "}
            <a
              href="mailto:hello@tradenly.xyz"
              className="text-primary hover:underline"
            >
              hello@tradenly.xyz
            </a>
          </p>
        </div>

        <div className="p-4 rounded-lg border">
          <h3 className="text-lg font-medium">Technical Support</h3>
          <p>For API, bot, or trading-related issues:</p>
          <p>
            Email:{" "}
            <a
              href="mailto:support@tradenly.xyz"
              className="text-primary hover:underline"
            >
              support@tradenly.xyz
            </a>
          </p>
        </div>

        <div className="p-4 rounded-lg border">
          <h3 className="text-lg font-medium">Data Protection</h3>
          <p>For privacy concerns or data requests:</p>
          <p>
            Email:{" "}
            <a
              href="mailto:privacy@tradenly.xyz"
              className="text-primary hover:underline"
            >
              privacy@tradenly.xyz
            </a>
          </p>
        </div>

        <div className="p-4 rounded-lg border">
          <h3 className="text-lg font-medium">Security</h3>
          <p>For urgent security matters:</p>
          <p>
            Email:{" "}
            <a
              href="mailto:security@tradenly.xyz"
              className="text-primary hover:underline"
            >
              security@tradenly.xyz
            </a>
          </p>
        </div>
      </div>

      <p className="text-sm text-foreground/60 mt-4">
        Last updated: January 1st, 2024
      </p>
    </section>
  );
};

export default ContactSection;
