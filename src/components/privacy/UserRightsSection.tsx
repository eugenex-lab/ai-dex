
import React from 'react';

const UserRightsSection = () => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
      
      <h3 className="text-xl font-medium mb-3">5.1 General Rights</h3>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>Access: Request copies of your processed data</li>
        <li>Correction: Update inaccurate or incomplete information</li>
        <li>Deletion: Request removal of your data ("right to be forgotten")</li>
        <li>Restriction: Control how your data is processed</li>
        <li>Portability: Receive your data in a machine-readable format</li>
        <li>Objection: Oppose processing based on legitimate interests</li>
      </ul>

      <h3 className="text-xl font-medium mb-3">5.2 Platform-Specific Rights</h3>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>AI Analysis Control: Opt-out of AI-driven analysis features</li>
        <li>Bot Configuration: Manage automated trading settings</li>
        <li>API Access: Control API keys and access levels</li>
        <li>Cross-Chain Data: Manage data across different blockchains</li>
      </ul>

      <h3 className="text-xl font-medium mb-3">5.3 Data Control Options</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>Trading History: Export or delete historical trading data</li>
        <li>Bot Settings: Modify or remove automation preferences</li>
        <li>API Integration: Manage third-party service connections</li>
        <li>Analytics Preferences: Control data used for analysis</li>
      </ul>
    </section>
  );
};

export default UserRightsSection;
