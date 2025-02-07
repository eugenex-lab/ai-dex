
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import ImageWithFallback from "./ImageWithFallback";
import { AboutImage } from "./types";
import { getImageForSection } from "./useAboutImages";

interface HeroSectionProps {
  images: AboutImage[] | undefined;
}

const HeroSection = ({ images }: HeroSectionProps) => {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.5], [1, 0.95]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const heroImage = getImageForSection(images, 'hero');

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-screen flex items-center justify-center py-20"
    >
      <motion.div 
        style={{ 
          opacity: prefersReducedMotion ? 1 : heroOpacity,
          scale: prefersReducedMotion ? 1 : heroScale
        }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -200px 0px" }}
            variants={staggerChildren}
            className="flex-1 text-center lg:text-left"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
            >
              The Rise of Tradenly AI
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8"
            >
              The first AI-powered trading platform that eliminated human inefficiency. 
              <span className="text-red-400"> Almost entirely.</span>
            </motion.p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -200px 0px" }}
            variants={fadeIn}
            className="flex-1"
          >
            {heroImage && (
              <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                <ImageWithFallback 
                  storageUrl={heroImage.url}
                  alt={heroImage.alt}
                  className="w-full h-full"
                />
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
