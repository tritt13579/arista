import base from "./base.css";
import header from "./header.css";
import hero from "./hero.css";
import sections from "./sections.css";
import quote from "./quote.css";
import philosophy from "./philosophy.css";
import programs from "./programs.css";
import learningJourney from "./learning-journey.css";
import teachers from "./teachers.css";
import achievements from "./achievements.css";
import studentMoments from "./student-moments.css";
import faq from "./faq.css";
import imageViewer from "./image-viewer.css";
import animations from "./animations.css";
import responsive from "./responsive.css";

// CSS is bundled as text into the component's Shadow DOM, with no CSS URL to configure.
export const styles = [
  base,
  header,
  hero,
  sections,
  quote,
  philosophy,
  programs,
  learningJourney,
  teachers,
  achievements,
  studentMoments,
  faq,
  imageViewer,
  animations,
  responsive,
].join("\n");
