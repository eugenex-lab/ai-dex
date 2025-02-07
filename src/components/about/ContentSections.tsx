
import { AboutImage } from "./types";
import IntroSection from "./sections/IntroSection";
import StorySection from "./sections/StorySection";
import WorkstationSection from "./sections/WorkstationSection";
import FutureSection from "./sections/FutureSection";

interface ContentSectionsProps {
  images: AboutImage[] | undefined;
}

const ContentSections = ({ images }: ContentSectionsProps) => {
  return (
    <>
      <IntroSection />
      <StorySection images={images} />
      <WorkstationSection images={images} />
      <FutureSection images={images} />
    </>
  );
};

export default ContentSections;
