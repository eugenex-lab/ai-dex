import React from "react";

const SecuritySection = () => {
  return (
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
  );
};

export default SecuritySection;