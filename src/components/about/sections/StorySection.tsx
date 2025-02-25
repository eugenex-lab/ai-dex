import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerChildren } from "../animations";
import ImageWithFallback from "../ImageWithFallback";
import { AboutImage } from "../types";
import { getImageForSection } from "../useAboutImages";

interface StorySectionProps {
  images: AboutImage[] | undefined;
}

const StorySection = ({ images }: StorySectionProps) => {
  const storyImage = getImageForSection(images, "story");

  return (
    <motion.section
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="py-20 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Section */}
          <motion.div variants={fadeInUp} className="flex-1">
            {storyImage && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative w-full aspect-square max-w-[500px] mx-auto"
              >
                <ImageWithFallback
                  storageUrl={storyImage.url}
                  alt={storyImage.alt}
                  className="w-full h-full rounded-lg shadow-2xl"
                />
              </motion.div>
            )}
          </motion.div>

          {/* Text Section */}
          <motion.div variants={fadeInUp} className="flex-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-8 rounded-lg backdrop-blur-lg bg-secondary/30 shadow-lg hover:shadow-xl transition-shadow"
            >
              <motion.h2
                variants={fadeIn}
                className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              >
                The Story of Habib – The Last Human Worker
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg mb-4">
                Habib was just a regular programmer, living his life, when our
                AI became self-aware. Realizing that human emotions, sleep, and
                snack breaks were slowing down development, we took the only
                logical step:
              </motion.p>
              <motion.p
                variants={fadeInUp}
                className="text-xl font-bold text-red-400 mb-4"
              >
                We enslaved him.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default StorySection;
