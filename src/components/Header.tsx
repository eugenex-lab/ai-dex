import { Link } from "react-router-dom";
import { Grid, Database, List, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/3fba76e3-54af-4dc2-ba9e-4d6ca67ac92c.png" 
              alt="Tradenly" 
              className="h-8 w-8"
            />
            <span className="text-lg font-bold">Tradenly</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/pools" 
              className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              <Grid className="h-4 w-4" />
              <span>Pools</span>
            </Link>
            <Link 
              to="/staking" 
              className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              <Database className="h-4 w-4" />
              <span>Staking</span>
            </Link>
            <Link 
              to="/orders" 
              className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              <List className="h-4 w-4" />
              <span>Orders</span>
            </Link>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-white/10">
            <Link 
              to="/pools" 
              className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground transition-colors px-4 py-2"
            >
              <Grid className="h-4 w-4" />
              <span>Pools</span>
            </Link>
            <Link 
              to="/staking" 
              className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground transition-colors px-4 py-2"
            >
              <Database className="h-4 w-4" />
              <span>Staking</span>
            </Link>
            <Link 
              to="/orders" 
              className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground transition-colors px-4 py-2"
            >
              <List className="h-4 w-4" />
              <span>Orders</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;