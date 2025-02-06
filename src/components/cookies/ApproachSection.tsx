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
        We use cookies sparingly and only when absolutely necessary to ensure the smooth operation of our platform. Here's what you need to know:
      </p>
    </section>
  );
};

export default ApproachSection;