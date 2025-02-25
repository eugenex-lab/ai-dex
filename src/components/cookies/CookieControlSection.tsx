
import React from "react";
import { LockOpen } from "lucide-react";

const CookieControlSection = () => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <LockOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Your Control Over Cookies</h2>
      </div>
      <p className="mb-4">You have full control over how cookies are stored on your device:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Most browsers allow you to clear, block, or manage cookies for each blockchain network.</li>
        <li>Be aware that disabling cookies might affect:</li>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Multi-chain trading functionality</li>
          <li>Bot configuration persistence</li>
          <li>API session management</li>
          <li>Trading preferences across different chains</li>
          <li>Cross-chain transaction capabilities</li>
        </ul>
      </ul>
    </section>
  );
};

export default CookieControlSection;
