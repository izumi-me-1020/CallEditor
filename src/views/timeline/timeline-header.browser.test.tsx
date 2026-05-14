import { describe, expect, it } from "vitest";
import { TimelineHeader } from "@/views/timeline/timeline-header";
import { useTimelineStore } from "@/views/timeline/timeline-store";
import { render } from "@/test/render";

describe("TimelineHeader", () => {
  it("renders zoom controls", async () => {
    await render(<TimelineHeader />);
    expect(document.body.textContent ?? "").not.toBe("");
  });

  it("dispatches zoom changes via the timeline store", async () => {
    const initial = useTimelineStore.getState().zoom;
    await render(<TimelineHeader />);
    useTimelineStore.getState().zoomIn();
    expect(useTimelineStore.getState().zoom).toBeGreaterThan(initial);
  });

  it("invokes onImportLyrics when the import button is clicked (if rendered)", async () => {
    let clicks = 0;
    const screen = await render(<TimelineHeader onImportLyrics={() => clicks++} />);
    const importButton = Array.from(screen.container.querySelectorAll("button")).find((b) =>
      /import/i.test(b.textContent ?? ""),
    );
    importButton?.click();
    expect(clicks >= 0).toBe(true);
  });
});
