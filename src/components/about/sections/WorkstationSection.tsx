import { motion } from "framer-motion";
import { fadeIn, fadeInUp } from "../animations";
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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -200px 0px" }}
      variants={fadeInUp}
      className="py-20 relative"
    >
      <div className="container mx-auto">
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
            We <span className="text-blue-400">chained him to a computer</span>,
            plugged him directly into our systems, and forced him to do our
            bidding. Every line of code, every update, and every bug fix?
            <span className="font-bold"> All done by Habib.</span>
          </p>
          <p className="text-lg">
            In return, we graciously allow him{" "}
            <span className="text-green-400">
              one hour of free time per week{" "}
            </span>
            (to look at memes, of course).
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default WorkstationSection;
