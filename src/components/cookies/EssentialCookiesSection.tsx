import React from "react";

const EssentialCookiesSection = () => {
  return (
    <section className="glass-card p-6 rounded-lg">
      <h3 className="text-xl font-medium mb-4">Essential Cookies Only</h3>
      <p className="mb-2">We use cookies solely to facilitate your trading experience. These cookies help:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Authenticate your sessions.</li>
        <li>Save your basic preferences (e.g., language and interface settings).</li>
        <li>Enhance the security of your interactions.</li>
      </ul>
      <p className="mt-4 text-muted-foreground">No unnecessary or non-essential cookies are placed on your device.</p>
    </section>
  );
};

export default EssentialCookiesSection;