import React from "react";
import { LockOpen } from "lucide-react";

const CookieControlSection = () => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <LockOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Your Control Over Cookies</h2>
      </div>
      <p className="mb-4">You can control how cookies are stored on your device:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Most browsers allow you to clear, block, or manage cookies.</li>
        <li>Be aware that disabling cookies might affect core functionalities, such as login persistence or user preferences, which are essential for trading operations.</li>
      </ul>
    </section>
  );
};

export default CookieControlSection;