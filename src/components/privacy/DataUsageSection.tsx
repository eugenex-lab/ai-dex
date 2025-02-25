
import React from 'react';

const DataUsageSection = () => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
      
      <h3 className="text-xl font-medium mb-3">2.1 Core Services</h3>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>To create and manage your account across multiple chains</li>
        <li>To process transactions and verify payments</li>
        <li>To secure your use of the platform services</li>
        <li>To facilitate cross-chain operations and bridge transfers</li>
      </ul>

      <h3 className="text-xl font-medium mb-3">2.2 AI & Automation</h3>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>To analyze trading patterns and market trends</li>
        <li>To provide automated trading services and bot execution</li>
        <li>To generate market insights and trading recommendations</li>
        <li>To optimize trading strategies and performance</li>
      </ul>

      <h3 className="text-xl font-medium mb-3">2.3 API Services</h3>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>To provide and monitor API access</li>
        <li>To facilitate integration with third-party services</li>
        <li>To enable developer tools and API monetization</li>
        <li>To maintain API security and performance</li>
      </ul>

      <h3 className="text-xl font-medium mb-3">2.4 Security & Compliance</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>To monitor and secure the platform against fraud</li>
        <li>To protect against unauthorized bot activities</li>
        <li>To ensure secure cross-chain operations</li>
        <li>To comply with regulatory requirements and KYC/AML standards when necessary and required legally by local jurisdiction</li>
      </ul>
    </section>
  );
};

export default DataUsageSection;
