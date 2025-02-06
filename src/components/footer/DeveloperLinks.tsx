
import { Link } from "react-router-dom";
import { BookOpen, Code, Github, TrendingUp } from "lucide-react";

const DeveloperLinks = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Developers</h3>
      <div className="space-y-2">
        <a 
          href="https://tradenly.gitbook.io/https-tradenly.xyz" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground"
        >
          <BookOpen className="h-4 w-4" />
          <span>Documentation</span>
        </a>
        <Link to="/api" className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground">
          <Code className="h-4 w-4" />
          <span>API</span>
        </Link>
        <Link to="/arbitrage" className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Arbitrage</span>
        </Link>
        <a 
          href="https://github.com/tradenly" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground"
        >
          <Github className="h-4 w-4" />
          <span>GitHub</span>
        </a>
      </div>
    </div>
  );
};

export default DeveloperLinks;
