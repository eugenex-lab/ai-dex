import { motion } from "framer-motion";
import { fadeInUp, staggerChildren } from "../animations";
import ImageWithFallback from "../ImageWithFallback";
import { AboutImage } from "../types";
import { getImageForSection } from "../useAboutImages";

interface WorkstationSectionProps {
  images: AboutImage[] | undefined;
}

const WorkstationSection = ({ images }: WorkstationSectionProps) => {
  const workstation1Image = getImageForSection(images, "workstation1");
  const workstation2Image = getImageForSection(images, "workstation2");

  return (
    <motion.section
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="py-20 relative"
    >
      <div className="container mx-auto px-4">
        <motion.div
          variants={fadeInUp}
          className="glass-card p-8 rounded-lg max-w-4xl mx-auto backdrop-blur-lg bg-secondary/30"
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {workstation1Image && (
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
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
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
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

          <motion.p variants={fadeInUp} className="text-lg mb-4">
            We <span className="text-blue-400">chained him to a computer</span>,
            plugged him directly into our systems, and forced him to do our
            bidding. Every line of code, every update, and every bug fix?
            <span className="font-bold"> All done by Habib.</span>
          </motion.p>
          <motion.p variants={fadeInUp} className="text-lg">
            In return, we graciously allow him{" "}
            <span className="text-green-400">
              one hour of free time per week
            </span>
            (to look at memes, of course).
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WorkstationSection;
