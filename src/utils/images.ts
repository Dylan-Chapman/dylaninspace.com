import type { ImageMetadata } from "astro";
import type { PostCollectionEntry } from "./types";
import defaultImage from "../assets/default.png";

const prefersListImage = new Set<PostCollectionEntry["collection"]>([
  "blogPosts",
  "seriesPosts",
  "astrophotography",
]);

export function getCardImage(entry: PostCollectionEntry): ImageMetadata {
  if (prefersListImage.has(entry.collection)) {
    return entry.data.listImage ?? entry.data.image ?? defaultImage;
  }
  return entry.data.image ?? defaultImage;
}

export function getHeroImage(entry: PostCollectionEntry): ImageMetadata {
  if (prefersListImage.has(entry.collection)) {
    return entry.data.heroImage ?? entry.data.image ?? defaultImage;
  }
  return entry.data.image ?? defaultImage;
}

export function getAlt(entry: PostCollectionEntry): string {
  if ("alt" in entry.data && typeof entry.data.alt === "string") {
    return entry.data.alt;
  }
  return entry.data.title ?? "";
}