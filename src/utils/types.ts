import type { CollectionEntry } from "astro:content";

// Update your collection keys to match the new split collections
export type PostCollectionKey =
  | "blogPosts"
  | "seriesPosts"
  | "astrophotography"
  | "page";
export type PostCollectionEntry = CollectionEntry<PostCollectionKey>;

// Update blog-related types
export type BlogPostEntry = CollectionEntry<"blogPosts">;
export type SeriesPostEntry = CollectionEntry<"seriesPosts">;
export type SeriesMetaEntry = CollectionEntry<"seriesMeta">;
export type AstrophotographyEntry = CollectionEntry<"astrophotography">;
export type PageEntry = CollectionEntry<"page">;

// If you want a union of all blog-related entries:
export type AnyBlogEntry = BlogPostEntry | SeriesPostEntry | SeriesMetaEntry;

// Rest of your types stay the same
export type SeriesPart = {
  position: number;
  slug: string;
  title: string;
  href: string | null;
  exists: boolean;
  published: boolean;
};

export type SeriesInfo =
  | { isSeries: false }
  | {
      isSeries: true;
      key: string;
      title: string;
      index: number;
      planned: number;
      published: number;
      upcoming: number;
    };

export type SeriesList = {
  key: string;
  title: string;
  description?: string;
  planned: number;
  published: number;
  parts: SeriesPart[];
};

export type PresetName = "cover" | "contain" | "fullBleedContain";
export type StylePreset = {
  wrapperClass: string;
  imgClass: string;
  sizes: string;
  widths: number[];
};
