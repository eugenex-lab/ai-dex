import React from 'react';

const DataUsageSection = () => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
      
      <h3 className="text-xl font-medium mb-3">2.1 Providing Services</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>To create and manage your account</li>
        <li>To process transactions and verify payments</li>
        <li>To secure your use of the services you request</li>
      </ul>

      <h3 className="text-xl font-medium mb-3 mt-4">2.2 Communication</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>To respond to requests and provide customer support</li>
        <li>To send updates, promotional materials, and service announcements</li>
      </ul>

      <h3 className="text-xl font-medium mb-3 mt-4">2.3 Security and Compliance</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>To monitor and secure the platform against fraud and unauthorized activity</li>
        <li>To comply with legal obligations, such as anti-money laundering (AML) and Know Your Customer (KYC) requirements when applicable</li>
      </ul>
    </section>
  );
};

export default DataUsageSection;