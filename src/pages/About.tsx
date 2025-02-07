
import { useRef, useEffect } from "react";
import MatrixBackground from "@/components/MatrixBackground";
import HeroSection from "@/components/about/HeroSection";
import ContentSections from "@/components/about/ContentSections";
import { useAboutImages } from "@/components/about/useAboutImages";

const About = () => {
  const { data: images, isLoading: imagesLoading } = useAboutImages();
  const containerRef = useRef<HTMLDivElement>(null);

  // Effect to ensure container has relative position
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.position = 'relative';
    }
  }, []);

  if (imagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="page-container min-h-screen bg-background/50 text-foreground relative isolate matrix-container"
    >
      <div className="absolute inset-0 -z-10 bg-background/80" />
      <MatrixBackground />
      
      <HeroSection images={images} />
      <ContentSections images={images} />
    </div>
  );
};

export default About;
