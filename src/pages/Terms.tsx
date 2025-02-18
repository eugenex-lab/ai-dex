import TermsHeader from "@/components/terms/TermsHeader";
import GeneralSection from "@/components/terms/GeneralSection";
import DisclaimerSection from "@/components/terms/DisclaimerSection";
import ResponsibilitiesSection from "@/components/terms/ResponsibilitiesSection";
import ServiceLimitationsSection from "@/components/terms/ServiceLimitationsSection";
import LegalSection from "@/components/terms/LegalSection";
import ContactSection from "@/components/terms/ContactSection";

const Terms = () => {
  return (
    <div className="container mx-auto pt-24 pb-12">
      <div className="max-w-4xl mx-auto space-y-8 text-foreground/90">
        <TermsHeader />
        <GeneralSection />
        <DisclaimerSection />
        <ResponsibilitiesSection />
        <ServiceLimitationsSection />
        <LegalSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default Terms;
