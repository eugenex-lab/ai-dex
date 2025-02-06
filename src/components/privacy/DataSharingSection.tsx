import React from 'react';

const DataSharingSection = () => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
      <p className="mb-4">We do not sell your personal information. However, we may share your information with:</p>
      
      <h3 className="text-xl font-medium mb-3">4.1 Service Providers</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>Third-party partners who assist with:</li>
        <li>Payment processing</li>
        <li>Cloud hosting and data storage</li>
        <li>Analytics and marketing</li>
      </ul>
    </section>
  );
};

export default DataSharingSection;