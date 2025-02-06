const ContactSection = () => {
  return (
    <section className="space-y-4 text-center">
      <h2 className="text-2xl font-semibold">Contact Information</h2>
      <p>If you have questions about these Terms or our Services, please contact us at:</p>
      <div className="space-y-2">
        <p>Email: support@tradenly.xyz</p>
        <p>Website: www.tradenly.xyz</p>
      </div>
      <p className="text-sm text-foreground/60 mt-4">Last updated: January 1st, 2024</p>
    </section>
  );
};

export default ContactSection;