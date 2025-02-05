import { Link } from "react-router-dom";
import { 
  Info, User, Roadmap, MessageSquare, HelpCircle, BookOpen,
  Code, Github, Shield, FileText, Cookie, ExternalLink
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/80 backdrop-blur-lg border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <div className="space-y-2">
              <Link to="/about" className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground">
                <Info className="h-4 w-4" />
                <span>About Us</span>
              </Link>
              <Link to="/careers" className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground">
                <User className="h-4 w-4" />
                <span>Careers</span>
              </Link>
              <Link to="/roadmap" className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground">
                <Roadmap className="h-4 w-4" />
                <span>Roadmap</span>
              </Link>
            </div>
          </div>

          {/* Help Column */}
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
                href="https://medium.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Medium</span>
              </a>
            </div>
          </div>

          {/* Developers Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Developers</h3>
            <div className="space-y-2">
              <Link to="/docs" className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Documentation</span>
              </Link>
              <Link to="/api" className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground">
                <Code className="h-4 w-4" />
                <span>API</span>
              </Link>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Legal Column */}
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
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-foreground/60">
          <p>© {new Date().getFullYear()} Tradenly AI DEX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;