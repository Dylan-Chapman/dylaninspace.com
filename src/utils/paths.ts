import { getCollection, type CollectionEntry } from "astro:content";
import { idToBasename, idToPath } from "./content";
import type { PostCollectionEntry, PostCollectionKey } from "./types";

const collectionRouteBases: Record<PostCollectionKey, string> = {
  blogPosts: "blog/posts",
  seriesPosts: "blog/series",
  astrophotography: "astrophotography",
  page: "",
};

export function getCollectionRouteBase(collection: PostCollectionKey): string {
  return collectionRouteBases[collection] ?? collection;
}

export function getEntrySlug(entry: PostCollectionEntry): string {
  return idToPath(entry);
}

export function getEntryHref(entry: PostCollectionEntry): string {
  const base = getCollectionRouteBase(entry.collection);
  const slug = getEntrySlug(entry);
  return base ? `/${base}/${slug}` : `/${slug}`;
}

export function getSeriesHref(seriesKey: string): string {
  const base = getCollectionRouteBase("seriesPosts");
  return base ? `/${base}/${seriesKey}` : `/${seriesKey}`;
}

export function getSeriesPostHref(seriesKey: string, partSlug: string): string {
  const baseHref = getSeriesHref(seriesKey);
  return `${baseHref}/${partSlug}`;
}

export async function getStaticPathsForCollection<K extends PostCollectionKey>(
  collection: K,
  filter?: (entry: CollectionEntry<K>) => boolean
) {
  const entries = await getCollection(collection, filter);

  return entries.map((entry) => ({
    params: { id: idToBasename(entry) },
    props: { entry },
  }));
}