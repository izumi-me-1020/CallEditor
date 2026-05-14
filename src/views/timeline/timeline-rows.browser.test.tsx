import { describe, expect, it } from "vitest";
import { useRef } from "react";
import { TimelineRows } from "@/views/timeline/timeline-rows";
import { useProjectStore } from "@/stores/project";
import { createLine } from "@/test/factories";
import { render } from "@/test/render";

function Harness() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} style={{ height: 400, overflow: "auto" }}>
      <TimelineRows scrollContainerRef={ref} />
    </div>
  );
}

describe("TimelineRows", () => {
  it("renders an empty placeholder when there are no lines", async () => {
    useProjectStore.setState({ lines: [] });
    const screen = await render(<Harness />);
    expect(screen.container.textContent ?? "").not.toContain("[data-word-block]");
  });

  it("renders without crashing with multiple lines", async () => {
    const lines = [createLine({ text: "line A" }), createLine({ text: "line B" })];
    useProjectStore.setState({ lines });
    const screen = await render(<Harness />);
    expect(screen.container).not.toBeNull();
  });
});
