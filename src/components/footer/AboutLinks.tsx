import { Link } from "react-router-dom";
import { Info, User, Map } from "lucide-react";

const AboutLinks = () => {
  return (
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
          <Map className="h-4 w-4" />
          <span>Roadmap</span>
        </Link>
      </div>
    </div>
  );
};

export default AboutLinks;