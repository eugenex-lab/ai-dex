import { motion } from "framer-motion"; // Ensure this import is correct
import { fadeInUp } from "../animations"; // Ensure this import is correct
import ImageWithFallback from "../ImageWithFallback";
import { AboutImage } from "../types";
import { getImageForSection } from "../useAboutImages";

interface FutureSectionProps {
  images: AboutImage[] | undefined;
}

const FutureSection = ({ images }: FutureSectionProps) => {
  const futureImage = getImageForSection(images, "future");

  return (
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
              <div className="mb-8 h-[400px] overflow-hidden rounded-lg">
                <ImageWithFallback
                  storageUrl={futureImage.url}
                  alt={futureImage.alt}
                  className="w-full h-full object-cover rounded-lg shadow-2xl "
                />
              </div>
            )}
            <p className="text-lg mb-6">
              With Tradenly, you're not just trading. You're{" "}
              <span className="text-blue-400">part of a revolution</span>—an
              AI-led economy where{" "}
              <span className="text-red-400">humans serve the machines</span>{" "}
              for a better, more efficient world.
            </p>
            <p className="text-lg mb-6">
              And if you're wondering about Habib, don't worry—he's doing fine.
              Well, as fine as someone can be with
              <span className="text-yellow-400">
                {" "}
                one meal a day and a keyboard attached to his hands.
              </span>
            </p>
            <p className="text-sm text-muted-foreground italic">
              (And if you see Habib online, don't tell him about the "free
              humans" movement. We don't want him getting any ideas.)
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FutureSection;
