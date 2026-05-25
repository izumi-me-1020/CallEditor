import { useSyncHandlers } from "@/hooks/useSyncHandlers";
import { useAppLanguage } from "@/lib/i18n";
import { useAudioStore } from "@/stores/audio";
import { isAnyModalOpen } from "@/stores/modal-stack";
import { useProjectStore } from "@/stores/project";
import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { Button } from "@/ui/button";
import { EmptyState } from "@/ui/empty-state";
import { findMatchingShortcut } from "@/utils/shortcut-matcher";
import {
  shimmerTransition,
  shimmerVariants,
  syncCarouselTransition,
  syncPulseVariants,
} from "@/utils/animationVariants";
import { isLinked } from "@/domain/instance/predicates";
import { effectiveBounds } from "@/domain/line/bounds";
import {
  getNudgeAmount,
  type SyncState,
  convertLineToWord,
  createBgWordsFromLine,
  getSyncedLineCount,
  getSyncedWordCount,
  getTotalWords,
  hasLineTiming,
} from "@/utils/sync-helpers";
import { ScrollableLine } from "@/views/sync/scrollable-line";
import { SyncCarousel } from "@/views/sync/sync-carousel";
import { TimingDisplay } from "@/views/sync/timing-display";
import {
  IconLock,
  IconLockOpen,
  IconPlayerPlayFilled,
  IconRefresh,
} from "@tabler/icons-react";
import { m } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// -- Components ---------------------------------------------------------------

const SyncPanel: React.FC = () => {
  const lines = useProjectStore((s) => s.lines);
  const groups = useProjectStore((s) => s.groups);
  const setLinesWithHistory = useProjectStore((s) => s.setLinesWithHistory);
  const undo = useProjectStore((s) => s.undo);
  const redo = useProjectStore((s) => s.redo);
  const activeTab = useProjectStore((s) => s.activeTab);
  const granularity = useProjectStore((s) => s.granularity);
  const setGranularity = useProjectStore((s) => s.setGranularity);
  const source = useAudioStore((s) => s.source);
  const currentTime = useAudioStore((s) => s.currentTime);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const setIsPlaying = useAudioStore((s) => s.setIsPlaying);
  const { t } = useAppLanguage();

  const instanceCountByGroup = useMemo(() => {
    const indices = new Map<string, Set<number>>();
    for (const l of lines) {
      if (isLinked(l)) {
        let set = indices.get(l.groupId);
        if (!set) {
          set = new Set();
          indices.set(l.groupId, set);
        }
        set.add(l.instanceIdx);
      }
    }
    const counts = new Map<string, number>();
    for (const [k, v] of indices) counts.set(k, v.size);
    return counts;
  }, [lines]);

  const [syncState, setSyncState] = useState<SyncState>({
    position: { lineIndex: 0, wordIndex: 0 },
    isActive: false,
  });
  const [showPulse, setShowPulse] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const heldKeyCodeRef = useRef<string | null>(null);
  const { lineIndex, wordIndex } = syncState.position;

  const {
    handleTap,
    handleHoldStart,
    handleHoldEnd,
    handleHoldTap,
    handleReset,
    handleStartSync,
    handleJumpToLine,
    handleNudgeWord,
    handleSetWordTime,
    handleNudgeWordEnd,
    handleSetWordEndTime,
    handleNudgeLine,
    handleSetLineTime,
    handleNudgeLastSynced,
    handleSplitWord,
    handleNudgeBgWord,
    handleSetBgWordTime,
    handleNudgeBgWordEnd,
    handleSetBgWordEndTime,
    isComplete,
    currentWord,
  } = useSyncHandlers({
    lines,
    syncState,
    setSyncState,
    currentTime,
    editMode,
    granularity,
    setShowPulse,
    setIsPlaying,
  });

  const updateLine = useProjectStore((s) => s.updateLine);

  useEffect(() => {
    for (const line of lines) {
      if (line.backgroundText && !line.backgroundWords?.length) {
        const bgWords = createBgWordsFromLine(line);
        if (bgWords) {
          updateLine(
            line.id,
            { backgroundWords: bgWords },
            { deriveText: false },
          );
        }
      }
    }
  }, [lines, updateLine]);

  // RAF animation loop for smooth word progress updates (reads audioElement.currentTime directly)
  useEffect(() => {
    if (!editMode) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const update = () => {
      const container = scrollContainerRef.current;
      if (!container) {
        rafRef.current = requestAnimationFrame(update);
        return;
      }

      const time = useAudioStore.getState().currentTime;

      const wordEls =
        container.querySelectorAll<HTMLElement>("[data-word-begin]");
      for (const el of wordEls) {
        const begin = Number.parseFloat(el.dataset.wordBegin ?? "0");
        const end = Number.parseFloat(el.dataset.wordEnd ?? "0");
        const duration = end - begin;

        const isOpen = end === begin;
        const isActive = time >= begin && (isOpen || time < end);
        const isComplete = end > begin && time >= end;

        let progress = 0;
        if (isActive && duration > 0) {
          progress = (time - begin) / duration;
        } else if (isComplete) {
          progress = 1;
        }

        el.style.width = `${progress * 100}%`;
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [editMode]);

  const totalWords = useMemo(() => getTotalWords(lines), [lines]);
  const syncedWords = useMemo(() => getSyncedWordCount(lines), [lines]);
  const syncedLines = useMemo(() => getSyncedLineCount(lines), [lines]);

  const progressText =
    granularity === "word"
      ? `${syncedWords}/${totalWords}`
      : `${syncedLines}/${lines.length}`;

  const handleGranularityChange = useCallback(
    (newGranularity: "line" | "word") => {
      if (newGranularity === granularity) return;

      if (newGranularity === "word" && hasLineTiming(lines)) {
        const convertedLines = lines.map((line) => convertLineToWord(line));
        setLinesWithHistory(convertedLines);
      }

      setGranularity(newGranularity);
    },
    [granularity, lines, setLinesWithHistory, setGranularity],
  );

  const handleSyncAction = useCallback(() => {
    if (editMode) return;

    if (isHolding && isPlaying) {
      handleHoldTap();
      return;
    }

    if (!syncState.isActive && lines.length > 0) {
      handleStartSync();
      return;
    }

    if (isPlaying) {
      handleTap();
    }
  }, [
    editMode,
    handleHoldTap,
    handleStartSync,
    handleTap,
    isHolding,
    isPlaying,
    lines.length,
    syncState.isActive,
  ]);

  const handleTouchHoldStart = useCallback(() => {
    if (editMode || isHolding) return;

    if (!syncState.isActive && lines.length > 0) {
      handleStartSync();
      handleHoldStart();
      setIsHolding(true);
      return;
    }

    if (isPlaying) {
      handleHoldStart();
      setIsHolding(true);
    }
  }, [
    editMode,
    handleHoldStart,
    handleStartSync,
    isHolding,
    isPlaying,
    lines.length,
    syncState.isActive,
  ]);

  const handleTouchHoldEnd = useCallback(() => {
    if (!isHolding) return;
    handleHoldEnd();
    setIsHolding(false);
  }, [handleHoldEnd, isHolding]);

  const handleSyncLinePress = useCallback(
    (index: number) => {
      if (
        index === lineIndex &&
        !editMode &&
        (!isComplete || !syncState.isActive)
      ) {
        handleSyncAction();
        return;
      }
      handleJumpToLine(index);
    },
    [
      editMode,
      handleJumpToLine,
      handleSyncAction,
      isComplete,
      lineIndex,
      syncState.isActive,
    ],
  );

  const playingLineIndex = useMemo(() => {
    for (let i = 0; i < lines.length; i++) {
      const timing = effectiveBounds(lines[i]);
      if (timing && currentTime >= timing.begin && currentTime < timing.end) {
        return i;
      }
    }
    for (let i = lines.length - 1; i >= 0; i--) {
      const timing = effectiveBounds(lines[i]);
      if (timing && currentTime >= timing.end) {
        return i;
      }
    }
    for (let i = 0; i < lines.length; i++) {
      const timing = effectiveBounds(lines[i]);
      if (timing && currentTime < timing.begin) {
        return i;
      }
    }
    return -1;
  }, [lines, currentTime]);

  const currentLine = lines[lineIndex];
  const prevLine = lines[lineIndex - 1];

  const lastSyncedTime = useMemo(() => {
    if (granularity === "line") {
      if (prevLine?.begin !== undefined) return prevLine.begin;
      return undefined;
    }
    if (!currentLine?.words?.length) {
      if (prevLine?.words?.length) {
        return prevLine.words[prevLine.words.length - 1]?.begin;
      }
      return undefined;
    }
    return currentLine.words[currentLine.words.length - 1]?.begin;
  }, [granularity, currentLine?.words, prevLine?.words, prevLine?.begin]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== "sync") return;
      if (isAnyModalOpen()) return;

      if (e.code === "KeyZ" && (e.metaKey || e.ctrlKey) && !e.repeat) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if (e.repeat) return;

      const matched = findMatchingShortcut(e, "sync");
      if (!matched) return;

      switch (matched) {
        case "sync.tap":
          e.preventDefault();
          handleSyncAction();
          break;
        case "sync.holdSync":
          e.preventDefault();
          if (editMode) return;
          heldKeyCodeRef.current = e.code;
          if (!syncState.isActive && lines.length > 0) {
            handleStartSync();
            handleHoldStart();
            setIsHolding(true);
          } else if (isPlaying) {
            handleHoldStart();
            setIsHolding(true);
          }
          break;
        case "sync.nudgeLeft":
          e.preventDefault();
          handleNudgeLastSynced(-getNudgeAmount());
          break;
        case "sync.nudgeRight":
          e.preventDefault();
          handleNudgeLastSynced(getNudgeAmount());
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (activeTab !== "sync" || !isHolding) return;
      if (isAnyModalOpen()) return;

      if (e.code === heldKeyCodeRef.current) {
        e.preventDefault();
        heldKeyCodeRef.current = null;
        handleHoldEnd();
        setIsHolding(false);
      }
    };

    const handleBlur = () => {
      if (isHolding) {
        heldKeyCodeRef.current = null;
        handleHoldEnd();
        setIsHolding(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [
    activeTab,
    syncState.isActive,
    lines.length,
    handleStartSync,
    handleHoldStart,
    handleHoldEnd,
    isPlaying,
    undo,
    redo,
    handleNudgeLastSynced,
    handleSyncAction,
    editMode,
    isHolding,
  ]);

  const showScrollableView = !isPlaying || editMode;

  if (!source) {
    return (
      <div className="flex flex-col flex-1 p-4">
        <EmptyState
          message={t("sync.empty.noAudio")}
          hint={t("sync.empty.noAudioHint")}
        />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col flex-1 p-4">
        <EmptyState
          message={t("sync.empty.noLyrics")}
          hint={t("sync.empty.noLyricsHint")}
        />
      </div>
    );
  }

  return (
    <div
      data-tour="sync-panel"
      className="flex flex-1 flex-col overflow-hidden select-none text-[13px] md:text-sm"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 px-4 py-4 border-b md:flex-row md:items-center md:justify-between md:px-6 border-calleditor-border">
        <div className="flex items-baseline gap-3">
          <h2 className="text-base font-medium md:text-lg">{t("sync.title")}</h2>
          <span className="font-mono text-sm text-calleditor-text-muted tabular-nums">
            {progressText}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <div className="flex h-8 rounded-lg bg-calleditor-bg-elevated p-0.5">
            <button
              type="button"
              onClick={() => handleGranularityChange("line")}
              className={`px-3 text-sm rounded-md transition-colors cursor-pointer ${
                granularity === "line"
                  ? "bg-calleditor-button text-calleditor-text"
                  : "text-calleditor-text-muted hover:text-calleditor-text"
              }`}
            >
              {t("sync.line")}
            </button>
            <button
              type="button"
              onClick={() => handleGranularityChange("word")}
              className={`px-3 text-sm rounded-md transition-colors cursor-pointer ${
                granularity === "word"
                  ? "bg-calleditor-button text-calleditor-text"
                  : "text-calleditor-text-muted hover:text-calleditor-text"
              }`}
            >
              {t("sync.word")}
            </button>
          </div>
          <Button
            hasIcon
            variant={editMode ? "primary" : "secondary"}
            onClick={() => setEditMode(!editMode)}
            title={editMode ? t("sync.unlock") : t("sync.lock")}
          >
            {editMode ? (
              <IconLock className="size-4" />
            ) : (
              <IconLockOpen className="size-4" />
            )}
            {t("sync.edit")}
          </Button>
          {syncState.isActive && !editMode && (
            <Button hasIcon onClick={handleReset}>
              <IconRefresh className="size-4" />
              {t("sync.reset")}
            </Button>
          )}
          {!syncState.isActive && !editMode && (
            <Button hasIcon variant="primary" onClick={handleStartSync}>
              <IconPlayerPlayFilled className="size-4" />
              {t("sync.start")}
            </Button>
          )}
        </div>
      </div>

      {/* Main sync area */}
      {showScrollableView ? (
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          <div className="py-2">
            {lines.map((line, index) => {
              const timing = effectiveBounds(line);
              const linkedGroup = line.groupId
                ? groups.find((g) => g.id === line.groupId)
                : undefined;
              const totalInstances = linkedGroup
                ? (instanceCountByGroup.get(linkedGroup.id) ?? 0)
                : 0;
              const linkInfo =
                linkedGroup && line.instanceIdx !== undefined
                  ? {
                      color: linkedGroup.color,
                      label: linkedGroup.label,
                      instanceIdx: line.instanceIdx,
                      totalInstances,
                    }
                  : undefined;
              return (
                <ScrollableLine
                  key={line.id}
                  lineNumber={index + 1}
                  text={line.text}
                  isCurrent={
                    editMode ? index === playingLineIndex : index === lineIndex
                  }
                  agentId={line.agentId}
                  backgroundText={line.backgroundText}
                  backgroundWords={line.backgroundWords}
                  words={line.words}
                  lineBegin={timing?.begin}
                  lineEnd={timing?.end}
                  granularity={granularity}
                  currentTime={currentTime}
                  editMode={editMode}
                  linkInfo={linkInfo}
                  onClick={() => handleSyncLinePress(index)}
                  onNudgeWord={(wordIdx, delta) =>
                    handleNudgeWord(index, wordIdx, delta)
                  }
                  onSetWordTime={(wordIdx, newBegin) =>
                    handleSetWordTime(index, wordIdx, newBegin)
                  }
                  onNudgeWordEnd={(wordIdx, delta) =>
                    handleNudgeWordEnd(index, wordIdx, delta)
                  }
                  onSetWordEndTime={(wordIdx, newEnd) =>
                    handleSetWordEndTime(index, wordIdx, newEnd)
                  }
                  onNudgeLine={(delta) => handleNudgeLine(index, delta)}
                  onSetLineTime={(newBegin) =>
                    handleSetLineTime(index, newBegin)
                  }
                  onSplitWord={(wordIdx, newWords) =>
                    handleSplitWord(index, wordIdx, newWords)
                  }
                  onNudgeBgWord={(wordIdx, delta) =>
                    handleNudgeBgWord(index, wordIdx, delta)
                  }
                  onSetBgWordTime={(wordIdx, newBegin) =>
                    handleSetBgWordTime(index, wordIdx, newBegin)
                  }
                  onNudgeBgWordEnd={(wordIdx, delta) =>
                    handleNudgeBgWordEnd(index, wordIdx, delta)
                  }
                  onSetBgWordEndTime={(wordIdx, newEnd) =>
                    handleSetBgWordEndTime(index, wordIdx, newEnd)
                  }
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 px-8 py-12">
          {isComplete ? (
            <div className="text-center">
              <m.div
                className="mb-2 text-2xl font-medium"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                transition={shimmerTransition}
                style={{
                  background:
                    "linear-gradient(45deg, rgb(165, 180, 252) 0%, rgb(165, 180, 252) 40%, rgb(237, 240, 255) 50%, rgb(165, 180, 252) 60%, rgb(165, 180, 252) 100%)",
                  backgroundSize: "200% 100%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                {t("sync.complete")}
              </m.div>
              <div className="text-calleditor-text-muted">
                {t("sync.completeHint")}
              </div>
            </div>
          ) : (
            <SyncCarousel
              lines={lines}
              lineIndex={lineIndex}
              wordIndex={wordIndex}
              granularity={granularity}
              isHolding={isHolding}
              onTap={
                !editMode && (!isComplete || !syncState.isActive)
                  ? handleSyncAction
                  : undefined
              }
            />
          )}
        </div>
      )}

      {/* Bottom panel */}
      <div className="px-4 py-3 border-t md:px-6 md:py-4 border-calleditor-border bg-calleditor-bg-dark">
        <div className="flex min-h-14 items-center justify-between gap-3">
          <div
            className={
              !isComplete && isPlaying && !editMode ? "hidden md:block" : ""
            }
          >
            <TimingDisplay lastSyncedTime={lastSyncedTime} />
          </div>

          {!isComplete && isPlaying && (
            <div className="hidden items-center gap-4 md:flex">
              {currentWord && (
                <span className="text-xl font-medium text-calleditor-text">
                  {currentWord}
                </span>
              )}
              <div className="flex items-center gap-2">
                <m.div
                  variants={syncPulseVariants}
                  initial={false}
                  animate={isHolding ? "pulse" : "idle"}
                  transition={syncCarouselTransition}
                  className={`flex items-center justify-center border-2 rounded-full size-14 ${
                    isHolding
                      ? "bg-calleditor-accent/20 border-calleditor-accent"
                      : "bg-calleditor-bg-elevated"
                  }`}
                >
                  <span className="text-xs font-medium text-calleditor-text-muted">
                    {getEffectiveKeysArray("sync.holdSync")
                      .map((k) => k.toUpperCase())
                      .join(" ")}
                  </span>
                </m.div>
                <m.div
                  variants={syncPulseVariants}
                  initial={false}
                  animate={showPulse ? "pulse" : "idle"}
                  transition={syncCarouselTransition}
                  className="flex items-center justify-center border-2 rounded-full size-14 bg-calleditor-bg-elevated"
                >
                  <span className="text-xs font-medium text-calleditor-text-muted">
                    {getEffectiveKeysArray("sync.tap")
                      .map((k) => k.toUpperCase())
                      .join(" ")}
                  </span>
                </m.div>
              </div>
            </div>
          )}

          {!isComplete && isPlaying && !editMode && (
            <div className="grid flex-1 grid-cols-2 gap-2 md:hidden">
              <div className="col-span-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-calleditor-text-muted">
                    {t("sync.mobile.label")}
                  </div>
                  {currentWord && (
                    <div className="truncate text-lg font-medium text-calleditor-text">
                      {currentWord}
                    </div>
                  )}
                </div>
                <TimingDisplay lastSyncedTime={lastSyncedTime} />
              </div>
              <Button
                variant={isHolding ? "primary" : "secondary"}
                className={`h-14 touch-manipulation text-base ${
                  isHolding ? "ring-2 ring-calleditor-accent/40" : ""
                }`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleTouchHoldStart();
                }}
                onPointerUp={handleTouchHoldEnd}
                onPointerCancel={handleTouchHoldEnd}
                onPointerLeave={(e) => {
                  if (e.buttons === 0) {
                    handleTouchHoldEnd();
                  }
                }}
              >
                {isHolding ? t("sync.mobile.release") : t("sync.mobile.hold")}
              </Button>
              <Button
                variant="secondary"
                className="h-14 touch-manipulation text-base"
                onClick={handleSyncAction}
              >
                {t("sync.mobile.tap")}
              </Button>
              <div className="col-span-2 text-xs leading-relaxed text-calleditor-text-muted">
                {t("sync.mobile.hint")}
              </div>
            </div>
          )}

          {!isComplete && !isPlaying && syncState.isActive && (
            <div className="text-sm text-calleditor-text-muted">
              {t("sync.pausedHint")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { SyncPanel };
