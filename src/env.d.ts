/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { AnyEntryMap, CollectionEntry } from "astro:content";

declare namespace App {
  interface AstroSlotProps {
    // This allows any prop to be passed to a slot
    [key: string]: any;

    // These provide more specific types for autocompletion
    entry?: CollectionEntry<keyof AnyEntryMap>;
    index?: number;
  }
}
