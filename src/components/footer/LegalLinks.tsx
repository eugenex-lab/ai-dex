import { Link } from "react-router-dom";
import { Shield, FileText, Cookie } from "lucide-react";

const LegalLinks = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Legal</h3>
      <div className="space-y-2">
        <Link to="/privacy" className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground">
          <Shield className="h-4 w-4" />
          <span>Privacy Policy</span>
        </Link>
        <Link to="/terms" className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground">
          <FileText className="h-4 w-4" />
          <span>Terms of Service</span>
        </Link>
        <Link to="/cookies" className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground">
          <Cookie className="h-4 w-4" />
          <span>Cookie Policy</span>
        </Link>
      </div>
    </div>
  );
};

export default LegalLinks;