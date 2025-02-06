import React from 'react';

const UserRightsSection = () => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
      
      <h3 className="text-xl font-medium mb-3">5.1 GDPR Rights</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>Access: Request a copy of your processed data</li>
        <li>Correction: Update inaccurate or incomplete data</li>
        <li>Deletion: Request deletion of your data ("right to be forgotten")</li>
        <li>Restriction: Control how your data is processed</li>
        <li>Portability: Receive a copy of your data in a machine-readable format</li>
        <li>Objection: Object to processing based on legitimate interests</li>
      </ul>
    </section>
  );
};

export default UserRightsSection;