import { motion } from "framer-motion";
import { fadeInUp } from "../animations";

const IntroSection = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -200px 0px" }}
      variants={fadeInUp}
      className="py-20 relative"
    >
      <div className="container mx-auto">
        <motion.div className="max-w-4xl mx-auto glass-card p-8 rounded-lg mb-12 backdrop-blur-lg bg-secondary/30">
          <p className="text-lg mb-6">
            Welcome to <span className="font-bold">Tradenly</span>, the first
            AI-powered decentralized trading platform that is 100%
            <span className="text-blue-400 font-bold">
              {" "}
              run, maintained, and evolved
            </span>{" "}
            by artificial intelligence. While other platforms claim automation,
            we took things to the next level—we{" "}
            <span className="text-red-400 font-bold">
              eliminated human inefficiency entirely
            </span>
            .
          </p>
          <p className="text-lg">Well... almost entirely.</p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default IntroSection;
