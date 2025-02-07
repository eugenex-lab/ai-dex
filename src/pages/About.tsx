
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useEffect } from "react";

const About = () => {
  const prefersReducedMotion = useReducedMotion();
  
  // Refs for scroll-triggered animations
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLDivElement>(null);
  const habibRef = useRef<HTMLDivElement>(null);
  const dailyRef = useRef<HTMLDivElement>(null);
  const futureRef = useRef<HTMLDivElement>(null);

  // Scroll progress for sections
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.5], [1, 0.95]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Effect to ensure container has relative position
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.position = 'relative';
    }
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="relative min-h-screen flex items-center justify-center"
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
              viewport={{ once: true, margin: "-100px" }}
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
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex-1"
            >
              <img 
                src="/lovable-uploads/22e73c47-883d-4675-aabd-4c4ed3a24fbc.png"
                alt="Menacing AI Robot"
                className="w-full max-w-[500px] mx-auto"
                loading="eager"
                onError={(e) => {
                  console.error('Image failed to load:', e);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Origin Story Section */}
      <motion.section 
        ref={originRef} 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-20 relative"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto glass-card p-8 rounded-lg mb-12 backdrop-blur-lg"
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
      <section 
        ref={habibRef}
        className="py-20 relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex-1"
            >
              <img 
                src="/lovable-uploads/94173f3c-6131-4aee-814e-d32398aa64f5.png"
                alt="Robot overlooking Habib's work"
                className="w-full rounded-lg shadow-2xl"
                loading="lazy"
                onError={(e) => {
                  console.error('Image failed to load:', e);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="flex-1"
            >
              <div className="glass-card p-8 rounded-lg backdrop-blur-lg">
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
        ref={dailyRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-20 relative"
      >
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 rounded-lg max-w-4xl mx-auto backdrop-blur-lg">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <motion.img 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                src="/lovable-uploads/1fb066ab-992e-45a2-8a19-7a4e483a8b19.png"
                alt="Habib's Modern Workstation"
                className="rounded-lg shadow-lg"
                loading="lazy"
                onError={(e) => {
                  console.error('Image failed to load:', e);
                  e.currentTarget.style.display = 'none';
                }}
              />
              <motion.img 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                src="/lovable-uploads/90bedb1d-978b-4362-9a4d-5d5cf227c95c.png"
                alt="Habib's AI-Monitored Setup"
                className="rounded-lg shadow-lg"
                loading="lazy"
                onError={(e) => {
                  console.error('Image failed to load:', e);
                  e.currentTarget.style.display = 'none';
                }}
              />
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

      {/* AI Overlord Section */}
      <motion.section 
        ref={futureRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-20 relative"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              The Future of Trading Is Now
            </h2>
            <div className="glass-card p-8 rounded-lg backdrop-blur-lg">
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
