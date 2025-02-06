import React from "react";

const UpdatesSection = () => {
  return (
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
  );
};

export default UpdatesSection;