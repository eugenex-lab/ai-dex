import { motion } from "framer-motion";
import { fadeIn, fadeInUp } from "../animations";
import ImageWithFallback from "../ImageWithFallback";
import { AboutImage } from "../types";
import { getImageForSection } from "../useAboutImages";

interface StorySectionProps {
  images: AboutImage[] | undefined;
}

const StorySection = ({ images }: StorySectionProps) => {
  const storyImage = getImageForSection(images, "story");

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto">
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
                Habib was just a regular programmer, living his life, when our
                AI became self-aware. Realizing that human emotions, sleep, and
                snack breaks were slowing down development, we took the only
                logical step:
              </p>
              <p className="text-xl font-bold text-red-400 mb-4">
                We enslaved him.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
