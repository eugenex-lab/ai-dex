import React from 'react';

const InformationSection = () => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
      
      <h3 className="text-xl font-medium mb-3">1.1 Personal Information</h3>
      <p className="mb-4">This includes information you provide directly to us, such as:</p>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>Contact details: name, email address, phone number, and wallet address</li>
        <li>Account details: Username, password, and account preferences</li>
        <li>Payment information: Cryptocurrency wallet addresses or transaction IDs for purchases</li>
        <li>Communication history: Any messages or requests you send to us</li>
      </ul>

      <h3 className="text-xl font-medium mb-3">1.2 Non-Personal Information</h3>
      <p className="mb-2">We may automatically collect certain technical information, including:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Device information: IP address, browser type, operating system, and device identifiers</li>
        <li>Usage and Pages visited: time spent on the platform, clickstream data, and other analytics</li>
        <li>Cookies and tracking technologies: Details about your interactions with our platform</li>
      </ul>
    </section>
  );
};

export default InformationSection;