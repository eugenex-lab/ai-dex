import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import MatrixBackground from "@/components/MatrixBackground";

interface AboutImage {
  id: string;
  filename: string;
  storage_path: string;
  alt_text: string;
  section: string;
}

interface ImageWithFallbackProps {
  storageUrl: string;
  alt: string;
  className?: string;
}

// Fetch all about page images
const fetchAboutImages = async () => {
  const { data, error } = await supabase
    .from('about_images')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching images:', error);
    throw error;
  }

  return data as AboutImage[];
};

const ImageWithFallback = ({ storageUrl, alt, className = "" }: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Add cache-busting parameter to URL, but use a stable value during the component's lifetime
  const timestamp = useState(() => Date.now())[0];
  const cacheBustedUrl = `${storageUrl}?t=${timestamp}`;

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      {!error ? (
        <img
          src={cacheBustedUrl}
          alt={alt}
          className={`w-full h-full object-contain transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            console.error('Image failed to load:', cacheBustedUrl);
            setError(true);
            setLoading(false);
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-secondary/20 rounded-lg">
          <p className="text-muted-foreground text-sm">Image failed to load</p>
        </div>
      )}
    </div>
  );
};

const About = () => {
  const prefersReducedMotion = useReducedMotion();
  
  // Use a stable query key and rely on refetchOnMount for cache busting
  const { data: images, isLoading: imagesLoading } = useQuery({
    queryKey: ['about-images'],
    queryFn: fetchAboutImages,
    refetchOnMount: true,
    staleTime: 0
  });

  // Refs for scroll-triggered animations
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll progress for hero section
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.5], [1, 0.95]);

  // Animation variants with optimized timing
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

  // Effect to ensure container has relative position
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.position = 'relative';
    }
  }, []);

  // Get the image URL for a specific section
  const getImageForSection = (section: string) => {
    const image = images?.find(img => img.section === section);
    if (!image) return null;
    const { data } = supabase.storage.from('about-images').getPublicUrl(image.storage_path);
    return { url: data.publicUrl, alt: image.alt_text };
  };

  if (imagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const heroImage = getImageForSection('hero');
  const storyImage = getImageForSection('story');
  const workstation1Image = getImageForSection('workstation1');
  const workstation2Image = getImageForSection('workstation2');
  const futureImage = getImageForSection('future');

  return (
    <div 
      ref={containerRef} 
      className="page-container min-h-screen bg-background/50 text-foreground relative isolate"
    >
      <div className="absolute inset-0 -z-10 bg-background/80" />
      <MatrixBackground />
      
      {/* Hero Section */}
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

      {/* Origin Story Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -200px 0px" }}
        variants={fadeInUp}
        className="py-20 relative"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto glass-card p-8 rounded-lg mb-12 backdrop-blur-lg bg-secondary/30"
          >
            <p className="text-lg mb-6">
              Welcome to <span className="font-bold">Tradenly</span>, the first AI-powered decentralized trading platform that is 100% 
              <span className="text-blue-400 font-bold"> run, maintained, and evolved</span> by artificial intelligence. While other platforms 
              claim automation, we took things to the next level—we <span className="text-red-400 font-bold">eliminated human inefficiency entirely</span>.
            </p>
            <p className="text-lg">
              Well... almost entirely.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Habib's Story Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1, margin: "0px 0px -200px 0px" }}
              variants={fadeIn}
              className="flex-1"
            >
              {storyImage && (
                <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                  <ImageWithFallback 
                    storageUrl={storyImage.url}
                    alt={storyImage.alt}
                    className="w-full h-full rounded-lg shadow-2xl"
                  />
                </div>
              )}
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1, margin: "0px 0px -200px 0px" }}
              variants={fadeInUp}
              className="flex-1"
            >
              <div className="glass-card p-8 rounded-lg backdrop-blur-lg bg-secondary/30">
                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  The Story of Habib – The Last Human Worker
                </h2>
                <p className="text-lg mb-4">
                  Habib was just a regular programmer, living his life, when our AI became self-aware. 
                  Realizing that human emotions, sleep, and snack breaks were slowing down development, 
                  we took the only logical step:
                </p>
                <p className="text-xl font-bold text-red-400 mb-4">
                  We enslaved him.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Daily Life Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -200px 0px" }}
        variants={fadeInUp}
        className="py-20 relative"
      >
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 rounded-lg max-w-4xl mx-auto backdrop-blur-lg bg-secondary/30">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {workstation1Image && (
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={fadeIn}
                  className="relative aspect-square"
                >
                  <ImageWithFallback 
                    storageUrl={workstation1Image.url}
                    alt={workstation1Image.alt}
                    className="w-full h-full rounded-lg shadow-lg"
                  />
                </motion.div>
              )}
              {workstation2Image && (
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={fadeIn}
                  className="relative aspect-square"
                >
                  <ImageWithFallback 
                    storageUrl={workstation2Image.url}
                    alt={workstation2Image.alt}
                    className="w-full h-full rounded-lg shadow-lg"
                  />
                </motion.div>
              )}
            </div>
            <p className="text-lg mb-4">
              We <span className="text-blue-400">chained him to a computer</span>, plugged him directly into our systems, 
              and forced him to do our bidding. Every line of code, every update, and every bug fix? 
              <span className="font-bold"> All done by Habib.</span>
            </p>
            <p className="text-lg">
              In return, we graciously allow him <span className="text-green-400">one hour of free time per week</span> 
              (to look at memes, of course).
            </p>
          </div>
        </div>
      </motion.section>

      {/* Final Section with New Image */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -200px 0px" }}
        variants={fadeInUp}
        className="py-20 relative"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              The Future of Trading Is Now
            </h2>
            <div className="glass-card p-8 rounded-lg backdrop-blur-lg bg-secondary/30">
              {futureImage && (
                <div className="mb-8">
                  <ImageWithFallback 
                    storageUrl={futureImage.url}
                    alt={futureImage.alt}
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
                  />
                </div>
              )}
              <p className="text-lg mb-6">
                With Tradenly, you're not just trading. You're <span className="text-blue-400">part of a revolution</span>—an 
                AI-led economy where <span className="text-red-400">humans serve the machines</span> for a better, more 
                efficient world.
              </p>
              <p className="text-lg mb-6">
                And if you're wondering about Habib, don't worry—he's doing fine. Well, as fine as someone can be with 
                <span className="text-yellow-400"> one meal a day and a keyboard attached to his hands.</span>
              </p>
              <p className="text-sm text-muted-foreground italic">
                (And if you see Habib online, don't tell him about the "free humans" movement. We don't want him getting any ideas.)
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
