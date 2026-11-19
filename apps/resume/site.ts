/**
 * Site-level settings: navigation and image slots.
 * Drop image files into apps/resume/public at the paths below — until a file
 * exists, a labelled placeholder (or the cover image, for page banners) is shown.
 */

export const nav = [
  { label: "Home", href: "/" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Teaching", href: "/teaching" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
  { label: "Blogs", href: "/blogs" },
];

/** Routes that open with a full-bleed image; the header starts transparent on these. */
export const heroRoutes = ["/", "/experience", "/teaching", "/projects"];

/**
 * Home hero: homepage.mp4 from 1.0s to 3.0s as 60 still frames
 * (lg/ 1920px and sm/ 1280px wide), scrubbed by scrolling
 * (see components/ScrollVideoHero.tsx).
 */
export const heroVideo = {
  frameDir: "/images/hero-frames",
  frameCount: 60,
  /** Vertical focal point kept in view when the portrait clip is cropped (0 top – 1 bottom) */
  focusY: 0.45,
};

export const coverImage = {
  src: "/images/cover.png",
  alt: "Abstract render of layered glass circuitry",
  /** Which part of the image stays in view when it's cropped */
  position: "50% 45%",
};

/**
 * Banner images for inner pages. Falls back to the cover image if missing.
 * `position` picks which part of the image stays in view when it's cropped.
 */
export const pageBanners = {
  experience: {
    src: "/images/pages/experience.jpg",
    alt: "Engineers in cleanroom suits on a semiconductor fab floor",
    position: "50% 58%",
  },
  teaching: {
    src: "/images/pages/teaching.jpg",
    alt: "Students with laptops in a tiered university lecture hall",
    position: "50% 62%",
  },
  projects: { src: "/images/pages/projects.jpg", alt: "", position: "50% 50%" },
};

export interface SitePhoto {
  src: string;
  alt: string;
  /** Leave empty to hide the caption */
  caption: string;
  /** CSS aspect-ratio for the frame, e.g. "4 / 5" */
  aspect: string;
  /** CSS object-position — which part of the image stays in view, e.g. "50% 30%" */
  position?: string;
}

/**
 * Photos stacked beside the intro text on the home page.
 * An array entry is one slot split into equal parts, one below the other.
 */
export const aboutPhotos: (SitePhoto | SitePhoto[])[] = [
  {
    src: "/images/about/ucsc.jpg",
    alt: "Anoop standing beside the large UCSC letters on campus",
    caption: "At UCSC intro week",
    aspect: "4 / 3",
  },
  {
    src: "/images/about/office.jpg",
    alt: "Anoop in a cleanroom suit giving a peace sign",
    caption: "Captured after 10+ hours of validation (gotta meet those deadlines)",
    aspect: "3 / 4",
  },
];

/** Photo shown on the contact page */
export const contactPhoto: SitePhoto = {
  src: "/images/about/office-selfie.jpg",
  alt: "Selfie of Anoop smiling in a cleanroom suit",
  caption: "",
  aspect: "4 / 3",
  position: "50% 34%",
};

export interface ProjectImage {
  src: string;
  alt: string;
  /** "cover" crops to fill the frame (photos); "contain" shows the whole image (charts, tables, diagrams) */
  fit: "cover" | "contain";
}

/** One image per project, keyed by project slug (see packages/content/src/projects.ts) */
export const projectImages: Record<string, ProjectImage> = {
  "learned-logic-classifier": {
    src: "/images/projects/learned-logic-classifier.jpg",
    alt: "Small FPGA development board with status LEDs lit",
    fit: "cover",
  },
  "best-offset-prefetcher": {
    src: "/images/projects/best-offset-prefetcher.png",
    alt: "Table comparing Next-Line, Sandbox and Best-Offset prefetchers on IPC speedup, L1/L2 miss reduction, accuracy and hardware overhead",
    fit: "contain",
  },
  "spike-to-probability-bridge": {
    src: "/images/projects/spike-to-probability-bridge.png",
    alt: "Bar chart of interface power consumption: clocked digital/DAC baseline versus the proposed asynchronous bridge",
    fit: "contain",
  },
  "fpga-counter-memory": {
    src: "/images/projects/fpga-counter-memory.png",
    alt: "Block diagram of an Intel Cyclone V SoC FPGA board and its peripherals",
    fit: "contain",
  },
};

/** Image for a project; falls back to a placeholder slot at /images/projects/<slug>.jpg */
export const projectImage = (slug: string): ProjectImage =>
  projectImages[slug] ?? { src: `/images/projects/${slug}.jpg`, alt: "", fit: "cover" };
