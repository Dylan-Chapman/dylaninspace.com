import { isPubliclyVisible } from "./post";
import { getSeriesPostHref } from "./paths";
import type {
  SeriesPostEntry,
  SeriesMetaEntry,
  SeriesInfo,
  SeriesList,
  SeriesPart,
} from "./types";

// --- internal helpers (not exported) ---
function titleize(slug: string) {
  return slug
    .split("-")
    .map((s) => s[0]?.toUpperCase() + s.slice(1))
    .join(" ");
}

// Normalize "foo/bar.mdx" -> "foo/bar"
function stripExt(id: string) {
  return id.replace(/\.(md|mdx)$/, "");
}

function seriesKeyFromId(id: string) {
  // <key>/<part>.<ext>
  return id.split("/")[0] ?? null;
}

function partSlugFromId(id: string) {
  const second = id.split("/")[1]; // "<part>.<ext>"
  return second ? second.replace(/\.(md|mdx)$/, "") : null;
}

/**
 * Build once per render. All other calls are O(1).
 * Public API: infoFor(post), list(key).
 */
export function makeSeries(
  allSeriesPosts: SeriesPostEntry[],
  allSeriesMeta: SeriesMetaEntry[]
) {
  // Index by path-without-extension for O(1) lookups, e.g. "foo/part-1"
  const byPath: Record<string, SeriesPostEntry> = Object.create(null);
  // series key -> meta entry
  const metaByKey: Record<string, SeriesMetaEntry> = Object.create(null);
  // series key -> planned parts (strings from meta.parts)
  const plannedByKey: Record<string, string[]> = Object.create(null);
  // series key -> part slug -> 1-based position
  const posByKey: Record<string, Record<string, number>> = Object.create(null);

  // Index series posts
  for (const e of allSeriesPosts) {
    byPath[stripExt(e.id)] = e;
  }

  // Index series metadata
  for (const e of allSeriesMeta) {
    const key = seriesKeyFromId(e.id); // Extract series key from index.mdx path
    if (!key) continue;

    const parts = e.data.parts ?? [];
    metaByKey[key] = e;
    plannedByKey[key] = parts;

    const pos: Record<string, number> = Object.create(null);
    for (let i = 0; i < parts.length; i++) pos[parts[i]] = i + 1;
    posByKey[key] = pos;
  }

  function list(key: string): SeriesList | null {
    const meta = metaByKey[key];
    if (!meta) return null;

    const planned = plannedByKey[key] ?? [];
    const title = meta.data.title ?? titleize(key);
    const description = meta.data.description;

    const parts: SeriesPart[] = planned.map((rel, i) => {
      const pathNoExt = `${key}/${rel}`;
      const entry = byPath[pathNoExt];
      const exists = !!entry;
      const published = !!entry && isPubliclyVisible(entry);
      const pTitle = entry?.data.title ?? titleize(rel);

      return {
        position: i + 1,
        slug: rel,
        title: pTitle,
        href: published ? getSeriesPostHref(key, rel) : null,
        exists,
        published,
      };
    });

    const publishedCount = parts.reduce((n, p) => n + (p.published ? 1 : 0), 0);

    return {
      key,
      title,
      description,
      planned: parts.length,
      published: publishedCount,
      parts,
    };
  }

  function infoFor(entry: SeriesPostEntry): SeriesInfo {
    const key = seriesKeyFromId(entry.id);
    const part = partSlugFromId(entry.id);
    if (!key || !part) return { isSeries: false };

    const s = list(key);
    if (!s) return { isSeries: false };

    const index = posByKey[key]?.[part] ?? 1;
    const upcoming = Math.max(0, s.planned - s.published);

    return {
      isSeries: true,
      key,
      title: s.title,
      index,
      planned: s.planned,
      published: s.published,
      upcoming,
    };
  }

  function metaFor(key: string): SeriesMetaEntry | null {
    return metaByKey[key] ?? null;
  }

  return { infoFor, list, metaFor };
}
