import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import type { PresetName } from "./config/images";

const stringArray = () => z.array(z.string()).default([]);
const optionalString = () => z.string().optional();
const optionalNumber = () => z.number().optional();
const heroPreset = () =>
  z
    .custom<PresetName>(
      (val) =>
        typeof val === "string" && val in ({} as Record<PresetName, true>)
    )
    .optional();

// Fields shared by ALL content types
const commonFields = ({ image }) => ({
  title: z.string(),
  image: image().optional(),
  listImage: image().optional(),
  heroImage: image().optional(),
  heroStyleOverride: heroPreset().optional(),
});

// Additional fields for post-like content (blog posts, series posts, astrophotography)
const postFields = ({ image }) => ({
  ...commonFields({ image }),
  intro: optionalString(),
  tag: optionalString(),
  draft: z.boolean().default(false),
  pubDate: z.coerce.date().optional(),
});

// Page-specific fields
const pageFields = ({ image }) => ({
  ...commonFields({ image }),
  type: optionalString(),
});

const blogPosts = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/blog/posts",
  }),
  schema: ({ image }) => z.object(postFields({ image })),
});

const seriesPosts = defineCollection({
  loader: glob({
    pattern: ["*/!(index).{md,mdx}", "*/*/index.{md,mdx}"],
    base: "./src/content/blog/series",
  }),
  schema: ({ image }) => z.object(postFields({ image })),
});

const seriesMeta = defineCollection({
  loader: glob({
    pattern: "*/index.{md,mdx}",
    base: "./src/content/blog/series",
  }),
  schema: ({ image }) =>
    z.object({
      ...commonFields({ image }),
      description: optionalString(),
      order: z.number().nullable().optional(),
      parts: stringArray(),
    }),
});

const astrophotography = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/astrophotography",
  }),
  schema: ({ image }) =>
    z.object({
      ...postFields({ image }),
      designations: z
        .object({
          common: stringArray(),
          ngc: stringArray(),
          caldwell: stringArray(),
          sharpless: stringArray(),
          barnard: stringArray(),
          other: stringArray(),
        })
        .default({}),
      gear: z
        .object({
          scope: optionalString(),
          camera: optionalString(),
          mount: optionalString(),
          guider: optionalString(),
          filters: stringArray(),
          accessories: stringArray(),
        })
        .default({}),
      acquisition: z
        .object({
          location: optionalString(),
          nights: z.array(z.coerce.date()).default([]),
          cameraSettings: z
            .object({
              gain: optionalString(),
              offset: optionalString(),
              temperatureC: optionalNumber(),
              binning: optionalString(),
            })
            .default({}),
        })
        .default({}),
      frames: z
        .array(
          z.object({
            channel: z.enum(["L", "R", "G", "B", "S", "H", "O"]),
            subs: optionalNumber(),
            exposureSeconds: optionalNumber(),
          })
        )
        .default([]),
      calibration: z
        .object({
          darks: optionalString(),
          flats: optionalString(),
          flatDarks: optionalString(),
          bias: optionalString(),
        })
        .default({}),
      software: stringArray(),
      distanceLy: optionalNumber(),
      sizeLy: optionalNumber(),
      fovDegrees: optionalNumber(),
    }),
});

const page = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/page" }),
  schema: ({ image }) => z.object(pageFields({ image })),
});

export const collections = {
  blogPosts,
  seriesPosts,
  seriesMeta,
  astrophotography,
  page,
};
