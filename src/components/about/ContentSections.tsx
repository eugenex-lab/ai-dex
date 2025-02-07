
import { motion } from "framer-motion";
import ImageWithFallback from "./ImageWithFallback";
import { AboutImage } from "./types";
import { getImageForSection } from "./useAboutImages";

interface ContentSectionsProps {
  images: AboutImage[] | undefined;
}

const ContentSections = ({ images }: ContentSectionsProps) => {
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

  const storyImage = getImageForSection(images, 'story');
  const workstation1Image = getImageForSection(images, 'workstation1');
  const workstation2Image = getImageForSection(images, 'workstation2');
  const futureImage = getImageForSection(images, 'future');

  return (
    <>
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
    </>
  );
};

export default ContentSections;
