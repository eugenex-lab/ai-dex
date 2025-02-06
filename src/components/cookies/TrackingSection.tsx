import React from "react";
import { Shield } from "lucide-react";

const TrackingSection = () => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">No Tracking or Profiling</h2>
      </div>
      <p className="mb-2">Tradenly does not use cookies for tracking or behavioral profiling.</p>
      <p>We do not use cookies for targeted advertising, marketing, or analytics purposes.</p>
    </section>
  );
};

export default TrackingSection;