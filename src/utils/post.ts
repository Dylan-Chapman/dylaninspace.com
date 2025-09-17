import { getCollection, type CollectionEntry } from "astro:content";
import { makeSeries } from "./series";
import type { PostCollectionEntry, SeriesInfo } from "./types";

// A general-purpose predicate to determine if an entry should be publicly visible.
export function isPubliclyVisible(entry: PostCollectionEntry): boolean {
  // Handle the 'draft' flag (exists on blog posts and series posts)
  if ("draft" in entry.data && entry.data.draft === true) {
    return false;
  }

  // Exclude any post with a future publication date
  const pubDate = (entry.data as any).pubDate;
  if (pubDate instanceof Date && pubDate > new Date()) {
    return false;
  }

  return true;
}
// Convenience: local predicate used by some callers.
export function isSeriesPost(
  entry: PostCollectionEntry
): entry is CollectionEntry<"seriesPosts"> {
  return entry.collection === "seriesPosts";
}

// Convenience: derive series key from blog entry slug.
export function getSeriesKey(
  entry: CollectionEntry<"seriesPosts">
): string | null {
  const parts = entry.id.split("/"); // ["<seriesKey>", "<slug>.<ext>"]
  return parts[0] ?? null;
}

// Shared loader so callers don't duplicate fetching logic
export async function loadSeriesCollections() {
  const [allSeriesPosts, allSeriesMeta] = await Promise.all([
    getCollection("seriesPosts"),
    getCollection("seriesMeta"),
  ]);
  return { allSeriesPosts, allSeriesMeta };
}

// Get series info for any post entry
export async function getSeriesInfo(
  entry: PostCollectionEntry
): Promise<SeriesInfo> {
  if (!isSeriesPost(entry)) return { isSeries: false };

  const { allSeriesPosts, allSeriesMeta } = await loadSeriesCollections();
  const series = makeSeries(allSeriesPosts, allSeriesMeta);
  return series.infoFor(entry);
}

/**
 * Creates a function that can efficiently get series info for any post.
 * Delegates to makeSeries() for precomputed lookups.
 */
export function createSeriesInfoGetter(
  allSeriesPosts: CollectionEntry<"seriesPosts">[],
  allSeriesMeta: CollectionEntry<"seriesMeta">[]
) {
  const series = makeSeries(allSeriesPosts, allSeriesMeta);

  return function getSeriesInfoFor(entry: PostCollectionEntry): SeriesInfo {
    if (!isSeriesPost(entry)) return { isSeries: false };
    return series.infoFor(entry);
  };
}

export async function loadSeriesInfoGetter() {
  const { allSeriesPosts, allSeriesMeta } = await loadSeriesCollections();
  return createSeriesInfoGetter(allSeriesPosts, allSeriesMeta);
}