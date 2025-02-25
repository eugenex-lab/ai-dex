
import React from "react";
import { Cookie } from "lucide-react";

const ApproachSection = () => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Cookie className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Our Approach to Cookies</h2>
      </div>
      <p className="mb-4">
        We use cookies sparingly and only when absolutely necessary to ensure the smooth operation of our multi-chain trading platform. Our cookie implementation focuses on:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Supporting seamless cross-chain transactions and bot operations</li>
        <li>Maintaining secure API sessions and rate limiting</li>
        <li>Preserving your trading preferences across different blockchains</li>
        <li>Ensuring optimal performance of automated trading features</li>
      </ul>
    </section>
  );
};

export default ApproachSection;
