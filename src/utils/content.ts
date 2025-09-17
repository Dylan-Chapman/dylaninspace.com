/**
 * Convert an entry.id (like "series/my-series/part-1.mdx")
 * into a URL-safe slug ("series/my-series/part-1").
 */
export function idToSlug(entry: string): string;
export function idToSlug(entry: { id: string }): string;
export function idToSlug(entry: string | { id: string }): string {
  const id = typeof entry === "string" ? entry : entry.id;
  return id.replace(/\.(?:md|mdx)$/i, "");
}

/**
 * Get just the last path segment without extension.
 * Useful if your route is `[slug].astro` and not `[...slug].astro`.
 */
export function idToBasename(entry: string): string;
export function idToBasename(entry: { id: string }): string;
export function idToBasename(entry: string | { id: string }): string {
  const id = typeof entry === "string" ? entry : entry.id;
  const last = id.split("/").pop()!;
  return last.replace(/\.(?:md|mdx)$/i, "");
}

/**
 * Normalize an entry id to a URL path segment:
 * - Strip file extensions (.md/.mdx)
 * - Remove trailing '/index'
 * Examples:
 *   'post.mdx' -> 'post'
 *   'series/foo/bar.mdx' -> 'series/foo/bar'
 *   'series/foo/bar/index.mdx' -> 'series/foo/bar'
 */
export function idToPath(entry: string): string;
export function idToPath(entry: { id: string }): string;
export function idToPath(entry: string | { id: string }): string {
  const id = typeof entry === "string" ? entry : entry.id;
  return id.replace(/\.(?:md|mdx)$/i, "").replace(/\/index$/i, "");
}
