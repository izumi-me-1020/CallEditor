import { describe, expect, it } from "vitest";
import { resolveAppLanguage } from "@/lib/i18n";

describe("resolveAppLanguage", () => {
  it("returns the explicit language when auto is not selected", () => {
    expect(resolveAppLanguage("ja", "hello", ["en-US"])).toBe("ja");
  });

  it("detects Japanese from lyrics text before browser language", () => {
    expect(resolveAppLanguage("auto", "こんにちは world", ["en-US"])).toBe("ja");
  });

  it("detects Korean from lyrics text before browser language", () => {
    expect(resolveAppLanguage("auto", "안녕하세요 world", ["en-US"])).toBe("ko");
  });

  it("falls back to the browser language when lyrics text is neutral", () => {
    expect(resolveAppLanguage("auto", "hello world", ["ko-KR", "en-US"])).toBe("ko");
  });

  it("falls back to English when nothing matches", () => {
    expect(resolveAppLanguage("auto", "", ["fr-FR"])).toBe("en");
  });
});
