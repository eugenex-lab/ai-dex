
import { Link } from "react-router-dom";
import { MessageSquare, HelpCircle, ExternalLink } from "lucide-react";

const HelpLinks = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Help</h3>
      <div className="space-y-2">
        <Link to="/contact" className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>Contact Us</span>
        </Link>
        <Link to="/faq" className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground">
          <HelpCircle className="h-4 w-4" />
          <span>FAQ</span>
        </Link>
        <a 
          href="https://medium.com/@tradenly" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Medium</span>
        </a>
      </div>
    </div>
  );
};

export default HelpLinks;
