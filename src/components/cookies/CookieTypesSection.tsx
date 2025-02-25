
import React from "react";

const CookieTypesSection = () => {
  return (
    <section className="glass-card p-6 rounded-lg">
      <h3 className="text-xl font-medium mb-4">Types of Cookies We Use</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Session Cookies:</h4>
          <p>Temporary cookies that maintain your active trading sessions across multiple chains, ensure seamless cross-chain operations, and manage API authentication states.</p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Configuration Cookies:</h4>
          <p>Store your bot settings, trading preferences, and chain-specific configurations to provide a consistent trading experience.</p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Chain-Specific Cookies:</h4>
          <p>Maintain state and preferences for each blockchain network you interact with, ensuring optimal performance across different chains.</p>
        </div>
        <div>
          <h4 className="font-medium mb-2">API Session Cookies:</h4>
          <p>Manage API access, rate limiting, and authentication states for secure and efficient trading operations.</p>
        </div>
      </div>
    </section>
  );
};

export default CookieTypesSection;
