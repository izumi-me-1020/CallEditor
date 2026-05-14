import { describe, expect, it } from "vitest";
import { TimelinePreviewSidebar } from "@/views/timeline/timeline-preview-sidebar";
import { useProjectStore } from "@/stores/project";
import { render } from "@/test/render";

describe("TimelinePreviewSidebar", () => {
  it("renders without crashing for an empty project", async () => {
    useProjectStore.setState({ lines: [] });
    const screen = await render(<TimelinePreviewSidebar />);
    expect(screen.container).not.toBeNull();
  });
});
