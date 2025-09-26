import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import remarkGfm from "remark-gfm";
import remarkInlineNotes from "./src/plugins/remark-inline-notes.js";
import { fileURLToPath } from "node:url";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    mdx({
      remarkPlugins: [remarkGfm, remarkInlineNotes],
    }),
  ],
  site: "https://dylaninspace.com",
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
