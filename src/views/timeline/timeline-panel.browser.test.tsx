import { describe, expect, it } from "vitest";
import { TimelinePanel } from "@/views/timeline/timeline-panel";
import { useProjectStore } from "@/stores/project";
import { render } from "@/test/render";

describe("TimelinePanel", () => {
  it("renders without crashing for an empty project", async () => {
    useProjectStore.setState({ lines: [] });
    const screen = await render(<TimelinePanel />);
    expect(screen.container).not.toBeNull();
  });
});
