import rss from "@astrojs/rss";
import config from "../config.mjs";
import { getCollection } from "astro:content";
import { getEntryHref } from "../utils/paths";

export async function get(context) {
  const [blogPosts, seriesPosts, astrophotography] = await Promise.all([
    getCollection("blogPosts"),
    getCollection("seriesPosts"),
    getCollection("astrophotography"),
  ]);

  const blogItems = [...blogPosts, ...seriesPosts].map((post) => ({
    entry: post,
    link: getEntryHref(post),
  }));
  const apItems = astrophotography.map((post) => ({
    entry: post,
    link: getEntryHref(post),
  }));

  const allPosts = [...blogItems, ...apItems].sort((a, b) => {
    const aDate = a.entry.data.pubDate
      ? new Date(a.entry.data.pubDate)
      : new Date(0);
    const bDate = b.entry.data.pubDate
      ? new Date(b.entry.data.pubDate)
      : new Date(0);
    return bDate.valueOf() - aDate.valueOf();
  });

  return rss({
    title: config.title + config.titleSuffix,
    description: config.description,
    site: context.site,
    items: allPosts.map((post) => ({
      title: post.entry.data.title,
      pubDate: post.entry.data.pubDate,
      description: post.entry.data.intro,
      link: post.link,
    })),
    customData: `<language>en-us</language>`,
  });
}