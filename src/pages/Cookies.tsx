import React from "react";
import { Separator } from "@/components/ui/separator";
import CookiesHeader from "@/components/cookies/CookiesHeader";
import ApproachSection from "@/components/cookies/ApproachSection";
import EssentialCookiesSection from "@/components/cookies/EssentialCookiesSection";
import TrackingSection from "@/components/cookies/TrackingSection";
import CookieTypesSection from "@/components/cookies/CookieTypesSection";
import CookieControlSection from "@/components/cookies/CookieControlSection";
import SecuritySection from "@/components/cookies/SecuritySection";
import UpdatesSection from "@/components/cookies/UpdatesSection";

const Cookies = () => {
  return (
    <div className="container mx-auto pt-24 pb-12 max-w-4xl">
      <div className="space-y-8 text-foreground/90">
        <CookiesHeader />
        <ApproachSection />
        <EssentialCookiesSection />
        <Separator className="my-8" />
        <TrackingSection />
        <CookieTypesSection />
        <Separator className="my-8" />
        <CookieControlSection />
        <SecuritySection />
        <UpdatesSection />
      </div>
    </div>
  );
};

export default Cookies;
