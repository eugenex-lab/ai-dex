
import { useRef } from "react";
import HeroSection from "@/components/about/HeroSection";
import ContentSections from "@/components/about/ContentSections";
import { useAboutImages } from "@/components/about/useAboutImages";
import { Loader2 } from "lucide-react";

const About = () => {
  const { data: images, isLoading: imagesLoading, error } = useAboutImages();
  const containerRef = useRef<HTMLDivElement>(null);

  if (imagesLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <p className="text-xl font-semibold">Something went wrong</p>
        <p className="text-muted-foreground">Failed to load page content</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="page-container min-h-screen bg-background text-foreground relative"
    >
      <div className="absolute inset-0 -z-10 bg-background/95" />
      <HeroSection images={images} />
      <ContentSections images={images} />
    </div>
  );
};

export default About;
