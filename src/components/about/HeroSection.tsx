import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { useRef, useEffect } from "react";
import ImageWithFallback from "./ImageWithFallback";
import { AboutImage } from "./types";
import { getImageForSection } from "./useAboutImages";

interface HeroSectionProps {
  images: AboutImage[] | undefined;
}

const HeroSection = ({ images }: HeroSectionProps) => {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.5], [1, 0.95]);

  // Aggressive animations
  const aggressiveFadeInUp = {
    hidden: { opacity: 0, y: 50, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.6,
      },
    },
  };

  const aggressiveFadeIn = {
    hidden: { opacity: 0, scale: 0.9, rotate: 5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
        duration: 0.8,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotate: -5,
      transition: {
        duration: 0.4,
      },
    },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const heroImage = getImageForSection(images, "hero");

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center py-20"
    >
      <motion.div
        style={{
          opacity: prefersReducedMotion ? 1 : heroOpacity,
          scale: prefersReducedMotion ? 1 : heroScale,
        }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="flex-1 text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
            >
              The Rise of Tradenly AI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-xl text-muted-foreground mb-8"
            >
              The first AI-powered trading platform that eliminated human
              inefficiency.
              <span className="text-red-400"> Almost entirely.</span>
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={aggressiveFadeIn}
            className="flex-1"
          >
            <AnimatePresence>
              {heroImage && (
                <motion.div
                  key={heroImage.url}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={aggressiveFadeIn}
                  className="relative w-full aspect-square max-w-[500px] mx-auto bg-black/20 rounded-lg overflow-hidden"
                >
                  <ImageWithFallback
                    storageUrl={heroImage.url}
                    alt={heroImage.alt}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
