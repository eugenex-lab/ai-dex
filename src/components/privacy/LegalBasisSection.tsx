import React from 'react';

const LegalBasisSection = () => {
  return (
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
  );
};

export default LegalBasisSection;