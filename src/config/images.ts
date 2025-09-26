export type PresetName = "cover" | "contain" | "portrait" | "fullBleedContain";
type StylePreset = {
  wrapperClass: string; // where aspect lives
  imgClass: string;
  sizes: string; // truthful to layout
  widths: number[]; // candidate caps per style
};

// B. PRESETS (container-aware by default)
const CONTENT_SIZES =
  "(min-width:1536px) 1280px, (min-width:1024px) 1024px, 100vw";

export const stylePresets: Record<PresetName, StylePreset> = {
  cover: {
    wrapperClass:
      "w-full max-w-screen-xl mx-auto overflow-hidden rounded-[15px] [aspect-ratio:4/1]",
    imgClass: "w-full h-full object-cover object-center",
    sizes: CONTENT_SIZES,
    widths: [480, 768, 960, 1200, 1600, 2000],
  },
  contain: {
    wrapperClass: "w-full max-w-screen-xl mx-auto rounded-[15px] bg-cosmos-dark-900/90",
    imgClass: "w-full max-h-[80vh] object-contain",
    sizes: CONTENT_SIZES,
    widths: [768, 960, 1200, 1600, 2000, 2400],
  },
  portrait: {
    wrapperClass:
      "w-full max-w-screen-md mx-auto overflow-hidden rounded-[15px] [aspect-ratio:3/4]",
    imgClass: "w-full h-full object-cover",
    sizes: "(min-width:1024px) 768px, 100vw",
    widths: [480, 640, 768, 960, 1200],
  },
  // True full-bleed variant (honest 100vw)
  fullBleedContain: {
    wrapperClass: "w-screen mx-[calc(50%-50vw)] bg-cosmos-dark-900/50",
    imgClass: "w-full max-h-[90vh] object-contain",
    sizes: "100vw",
    widths: [768, 1200, 1600, 2000, 2400, 3200, 3840],
  },
} as const;