
import React from 'react';

const DataSharingSection = () => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">3. Data Sharing and Disclosure</h2>
      <p className="mb-4">We do not sell your personal information. However, we may share your information with:</p>
      
      <h3 className="text-xl font-medium mb-3">3.1 Integration Partners</h3>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>TapTools: For blockchain analytics and market data</li>
        <li>DEXHunter: For decentralized exchange integrations</li>
        <li>Jupiter: For optimized swap routing and execution</li>
        <li>Blockchain networks: For transaction processing and validation</li>
      </ul>

      <h3 className="text-xl font-medium mb-3">3.2 Service Providers</h3>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>Cloud hosting and data storage providers</li>
        <li>AI and analytics service providers</li>
        <li>Security and fraud prevention services</li>
        <li>Customer support and communication tools</li>
      </ul>

      <h3 className="text-xl font-medium mb-3">3.3 API Users</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>Authorized API consumers with valid credentials</li>
        <li>Third-party developers utilizing our services</li>
        <li>Integration partners for specific features</li>
        <li>Analytics providers for market analysis</li>
      </ul>
    </section>
  );
};

export default DataSharingSection;
