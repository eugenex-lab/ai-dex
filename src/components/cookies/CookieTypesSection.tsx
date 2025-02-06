import React from "react";

const CookieTypesSection = () => {
  return (
    <section className="glass-card p-6 rounded-lg">
      <h3 className="text-xl font-medium mb-4">Types of Cookies We Use</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Session Cookies:</h4>
          <p>These are temporary and are erased as soon as you close your browser or log out. They help maintain your active session and ensure a seamless trading flow.</p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Preference Cookies:</h4>
          <p>These save your settings, like your chosen trading view or interface options, to improve convenience during future visits.</p>
        </div>
      </div>
    </section>
  );
};

export default CookieTypesSection;