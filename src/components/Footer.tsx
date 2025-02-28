import AboutLinks from "./footer/AboutLinks";
import HelpLinks from "./footer/HelpLinks";
import DeveloperLinks from "./footer/DeveloperLinks";
import LegalLinks from "./footer/LegalLinks";

const Footer = () => {
  return (
    <footer className="bg-background py-12 z-20 ">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <AboutLinks />
          <HelpLinks />
          <DeveloperLinks />
          <LegalLinks />
        </div>

        <div className="mt-12 pt-8 text-center text-sm text-foreground/60">
          <p>
            © {new Date().getFullYear()} Tradenly AI DEX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
