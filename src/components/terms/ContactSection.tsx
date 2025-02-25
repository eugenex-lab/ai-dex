const ContactSection = () => {
  return (
    <section className="space-y-4 text-center">
      <h2 className="text-2xl font-semibold">Contact Information</h2>
      <p>
        If you have questions about these Terms or our Services, please contact
        the appropriate team:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="p-4 rounded-lg border">
          <h3 className="text-lg font-medium">General Inquiries</h3>
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
          <h3 className="text-lg font-medium">Technical Support</h3>
          <p>API & Bot Configuration Issues:</p>
          <p>
            Email:{" "}
            <a
              href="mailto:tech-support@tradenly.xyz"
              className="text-primary hover:underline"
            >
              tech-support@tradenly.xyz
            </a>
          </p>
        </div>

        <div className="p-4 rounded-lg border">
          <h3 className="text-lg font-medium">Security Incidents</h3>
          <p>Urgent Security Concerns:</p>
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

        <div className="p-4 rounded-lg border">
          <h3 className="text-lg font-medium">Compliance Inquiries</h3>
          <p>Regulatory & Legal Matters:</p>
          <p>
            Email:{" "}
            <a
              href="mailto:compliance@tradenly.xyz"
              className="text-primary hover:underline"
            >
              compliance@tradenly.xyz
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
