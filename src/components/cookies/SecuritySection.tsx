
import React from "react";

const SecuritySection = () => {
  return (
    <section className="glass-card p-6 rounded-lg">
      <h3 className="text-xl font-medium mb-4">Commitment to Security and Anonymity</h3>
      <p className="mb-4">
        Tradenly is built with your privacy and security in mind. We implement strict cookie isolation and security measures to protect your trading activities:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Sensitive data remains within your control, stored securely on your device or blockchain wallet.</li>
        <li>Bot configuration cookies are encrypted and isolated per trading session.</li>
        <li>API keys and trading credentials are never stored in cookies.</li>
        <li>Cross-chain session cookies are isolated to prevent interference between different blockchain interactions.</li>
        <li>Trading preferences and configurations are stored with end-to-end encryption.</li>
        <li>We enforce strict cookie isolation between different trading bots and API sessions.</li>
      </ul>
    </section>
  );
};

export default SecuritySection;
