import { describe, expect, it } from "vitest";
import * as appleMusic from "@/pages/landing/apple-music-synced-lyrics";
import * as spotify from "@/pages/landing/spotify-synced-lyrics";
import * as ttmlEditor from "@/pages/landing/ttml-editor";
import * as ttmlGenerator from "@/pages/landing/ttml-generator";
import * as ttmlMaker from "@/pages/landing/ttml-maker";

describe("Landing pages", () => {
  for (const [name, mod] of [
    ["AppleMusicSyncedLyrics", appleMusic],
    ["SpotifySyncedLyrics", spotify],
    ["TtmlEditor", ttmlEditor],
    ["TtmlGenerator", ttmlGenerator],
    ["TtmlMaker", ttmlMaker],
  ] as const) {
    it(`${name} exports a default page component`, () => {
      expect(typeof (mod as { default?: unknown }).default).toBe("function");
    });
  }
});
