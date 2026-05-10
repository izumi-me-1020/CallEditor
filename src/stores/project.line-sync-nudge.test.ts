/**
 * @vitest-environment node
 */
import { beforeEach, describe, expect, it } from "vitest";
import { INITIAL_STATE, useProjectStore } from "@/stores/project";

// These tests pin the contract that nudging a line-synced row by writing
// only `begin/end` (without `words`) keeps it line-synced. The previous bug
// was that the keyboard handler synthesized a single-word update for line-synced
// rows; the store then cleared `begin/end` and flipped the row to word-synced.

describe("project store · line-sync nudge granularity", () => {
  beforeEach(() => useProjectStore.setState(INITIAL_STATE));

  it("preserves line-sync when only begin/end change", () => {
    const store = useProjectStore.getState();
    store.setLines([{ id: "L1", text: "verse", agentId: "v1", begin: 5, end: 7 }]);
    store.updateLineWithHistory("L1", { begin: 5.05, end: 7.05 });
    const after = useProjectStore.getState().lines[0];
    expect(after.words).toBeUndefined();
    expect(after.begin).toBeCloseTo(5.05);
    expect(after.end).toBeCloseTo(7.05);
  });

  it("preserves line-sync across multiple consecutive nudges (no drift to word-sync)", () => {
    const store = useProjectStore.getState();
    store.setLines([{ id: "L1", text: "verse", agentId: "v1", begin: 5, end: 7 }]);
    for (let i = 0; i < 5; i++) {
      const cur = useProjectStore.getState().lines[0];
      store.updateLineWithHistory("L1", { begin: (cur.begin as number) + 0.1, end: (cur.end as number) + 0.1 });
    }
    const after = useProjectStore.getState().lines[0];
    expect(after.words).toBeUndefined();
    expect(after.begin).toBeCloseTo(5.5);
    expect(after.end).toBeCloseTo(7.5);
  });

  it("undo restores prior line-sync state with no synthetic words appearing", () => {
    const store = useProjectStore.getState();
    store.setLinesWithHistory([{ id: "L1", text: "verse", agentId: "v1", begin: 5, end: 7 }]);
    store.updateLineWithHistory("L1", { begin: 5.05, end: 7.05 });
    store.undo();
    const after = useProjectStore.getState().lines[0];
    expect(after.words).toBeUndefined();
    expect(after.begin).toBe(5);
    expect(after.end).toBe(7);
  });

  it("flips to word-sync only when an explicit words array is written", () => {
    const store = useProjectStore.getState();
    store.setLines([{ id: "L1", text: "verse", agentId: "v1", begin: 5, end: 7 }]);
    store.updateLineWithHistory("L1", { words: [{ text: "verse", begin: 5, end: 7 }] });
    const after = useProjectStore.getState().lines[0];
    expect(after.words?.length).toBe(1);
    // store auto-clears begin/end when words appear on a previously line-synced row
    expect(after.begin).toBeUndefined();
    expect(after.end).toBeUndefined();
  });
});
