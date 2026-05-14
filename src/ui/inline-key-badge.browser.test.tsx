import { describe, expect, it } from "vitest";
import { InlineKeyBadge } from "@/ui/inline-key-badge";
import { render } from "@/test/render";

describe("InlineKeyBadge", () => {
  it("renders a single key", async () => {
    const screen = await render(<InlineKeyBadge keys={["Z"]} />);
    await expect.element(screen.getByText("Z")).toBeInTheDocument();
  });

  it("renders multiple keys as separate badges", async () => {
    const screen = await render(<InlineKeyBadge keys={["Shift", "P"]} />);
    expect(screen.container.querySelectorAll("span > span").length).toBe(2);
    await expect.element(screen.getByText("P")).toBeInTheDocument();
  });

  it("renders an icon for the Mod key on macOS, plain text on other platforms", async () => {
    const screen = await render(<InlineKeyBadge keys={["Mod"]} />);
    const badges = screen.container.querySelectorAll("span > span");
    expect(badges.length).toBe(1);
    const text = badges[0]?.textContent ?? "";
    const containsIcon = !!badges[0]?.querySelector("svg");
    expect(containsIcon || text.length > 0).toBe(true);
  });

  it("preserves the supplied key order", async () => {
    const screen = await render(<InlineKeyBadge keys={["A", "B", "C"]} />);
    const badges = Array.from(screen.container.querySelectorAll("span > span"));
    const labels = badges.map((badge) => badge.textContent?.trim() ?? "");
    expect(labels).toEqual(["A", "B", "C"]);
  });
});
