
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ opacity }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 text-center lg:text-left"
            >
              <h1 className="text-4xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 animate-fade-in">
                The Rise of Tradenly AI
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                The first AI-powered trading platform that eliminated human inefficiency. 
                <span className="text-red-400">Almost entirely.</span>
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <img 
                src="/lovable-uploads/575fd033-fd84-4651-ab62-9c35ad06c528.png"
                alt="Tradenly AI Overlord"
                className="w-full max-w-[500px] mx-auto animate-pulse-subtle"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Origin Story Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass-card p-8 rounded-lg mb-12"
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
      </section>

      {/* Habib's Story Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <img 
                src="/lovable-uploads/7fe88e4b-04a8-4981-9ab3-6dd5f95879d8.png"
                alt="Habib at work"
                className="w-full rounded-lg shadow-2xl"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="glass-card p-8 rounded-lg">
                <h2 className="text-3xl font-bold mb-6 text-gradient">The Story of Habib – The Last Human Worker</h2>
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
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-lg max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <img 
                src="/lovable-uploads/35d9c488-a327-474b-8919-17671c3b1f0a.png"
                alt="Habib's Workstation"
                className="rounded-lg shadow-lg"
              />
              <img 
                src="/lovable-uploads/74bb1b73-f625-4ecb-9df3-e319f67e677b.png"
                alt="Habib's Setup"
                className="rounded-lg shadow-lg"
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
          </motion.div>
        </div>
      </section>

      {/* AI Overlord Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              The Future of Trading Is Now
            </h2>
            <div className="glass-card p-8 rounded-lg">
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
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
