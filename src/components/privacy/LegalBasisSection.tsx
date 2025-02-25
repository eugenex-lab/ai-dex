
import React from 'react';

const LegalBasisSection = () => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">4. Legal Basis for Processing (GDPR Compliance)</h2>
      <p className="mb-4">If you are located in the European Economic Area (EEA), we process your personal information based on the following legal grounds:</p>
      
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li><span className="font-medium">Consent:</span> For AI analysis, bot automation, and marketing communications</li>
        <li><span className="font-medium">Contractual necessity:</span> To perform trading services, API access, and cross-chain operations</li>
        <li><span className="font-medium">Legal obligation:</span> To comply with financial regulations and security requirements</li>
        <li><span className="font-medium">Legitimate interests:</span> To enhance platform security, prevent fraud, and improve services</li>
      </ul>

      <h3 className="text-xl font-medium mb-3">4.1 Specific Processing Activities</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>AI-driven market analysis and trading recommendations</li>
        <li>Automated trading bot operations and monitoring</li>
        <li>Cross-chain transaction processing and validation</li>
        <li>API service provision and access management</li>
        <li>Integration with third-party services and analytics</li>
      </ul>
    </section>
  );
};

export default LegalBasisSection;
