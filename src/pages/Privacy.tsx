import { Separator } from "@/components/ui/separator";
import PrivacyHeader from "@/components/privacy/PrivacyHeader";
import InformationSection from "@/components/privacy/InformationSection";
import DataUsageSection from "@/components/privacy/DataUsageSection";
import LegalBasisSection from "@/components/privacy/LegalBasisSection";
import DataSharingSection from "@/components/privacy/DataSharingSection";
import UserRightsSection from "@/components/privacy/UserRightsSection";
import ContactSection from "@/components/privacy/ContactSection";

const Privacy = () => {
  return (
    <div className="container mx-auto pt-24 pb-12 max-w-4xl">
      <PrivacyHeader />

      <div className="space-y-8 text-foreground/90">
        <InformationSection />
        <Separator className="my-8" />

        <DataUsageSection />
        <Separator className="my-8" />

        <LegalBasisSection />
        <Separator className="my-8" />

        <DataSharingSection />
        <Separator className="my-8" />

        <UserRightsSection />
        <Separator className="my-8" />

        <ContactSection />

        <div className="text-sm text-muted-foreground mt-12 text-center">
          By using our services, you acknowledge that you have read and
          understood this Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default Privacy;
