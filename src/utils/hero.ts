import type { PostCollectionEntry, PresetName, StylePreset } from "./types";
import { stylePresets } from "../config/images";

type PostCollection = PostCollectionEntry["collection"];

const collectionDefaults: Record<PostCollection, PresetName> = {
  blogPosts: "cover",
  seriesPosts: "cover",
  astrophotography: "fullBleedContain",
  page: "cover",
};

export function getHeroConfig(entry: PostCollectionEntry): StylePreset {
  const override = (entry.data as any).heroStyleOverride as
    | PresetName
    | undefined;
  const def = collectionDefaults[entry.collection] ?? "cover";
  const name = override ?? def;
  return stylePresets[name];
}