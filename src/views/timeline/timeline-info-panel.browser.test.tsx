import { describe, expect, it } from "vitest";
import { TimelineInfoPanel } from "@/views/timeline/timeline-info-panel";
import { useTimelineStore } from "@/views/timeline/timeline-store";
import { render } from "@/test/render";

describe("TimelineInfoPanel", () => {
  it("renders without crashing when no selection is active", async () => {
    useTimelineStore.setState({ selectedWords: [] });
    const screen = await render(<TimelineInfoPanel />);
    expect(screen.container).not.toBeNull();
  });
});
