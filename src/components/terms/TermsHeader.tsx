import { FileText } from "lucide-react";

const TermsHeader = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <FileText className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
      <p className="text-foreground/80">
        Welcome to Tradenly. By accessing or using our platform, services, or tools (collectively referred to as the "Services"), you agree
        to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use our Services.
      </p>
    </div>
  );
};

export default TermsHeader;