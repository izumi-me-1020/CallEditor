import { isLinked } from "@/domain/instance/predicates";
import { isLineSynced } from "@/domain/line/predicates";
import { useAppLanguage } from "@/lib/i18n";
import { useAudioStore } from "@/stores/audio";
import { useProjectStore } from "@/stores/project";
import type { WordTiming } from "@/domain/word/timing";
import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { useSettingsStore } from "@/stores/settings";
import { Button } from "@/ui/button";
import { InlineKeyBadge } from "@/ui/inline-key-badge";
import { Popover } from "@/ui/popover";
import { cn } from "@/utils/cn";
import { MOD_KEY } from "@/utils/platform";
import {
  convertLineToWord,
  splitIntoWordsWithMeta,
} from "@/utils/sync-helpers";
import {
  MAX_ZOOM,
  MIN_ZOOM,
  useTimelineStore,
} from "@/views/timeline/timeline-store";
import {
  IconArrowBarBoth,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconChevronsDown,
  IconChevronsUp,
  IconDots,
  IconEye,
  IconFocusCentered,
  IconLayoutDistributeHorizontal,
  IconMagnet,
  IconMinus,
  IconPlus,
  IconTextPlus,
} from "@tabler/icons-react";
import { useCallback, useEffect, useMemo } from "react";

// -- Types --------------------------------------------------------------------

interface TimelineHeaderProps {
  onImportLyrics?: () => void;
}

// -- Component -----------------------------------------------------------------

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ onImportLyrics }) => {
  const { t } = useAppLanguage();
  const zoom = useTimelineStore((s) => s.zoom);
  const zoomIn = useTimelineStore((s) => s.zoomIn);
  const zoomOut = useTimelineStore((s) => s.zoomOut);
  const followEnabled = useTimelineStore((s) => s.followEnabled);
  const toggleFollow = useTimelineStore((s) => s.toggleFollow);
  const previewSidebarOpen = useTimelineStore((s) => s.previewSidebarOpen);
  const togglePreviewSidebar = useTimelineStore((s) => s.togglePreviewSidebar);
  const rollingEditMode = useTimelineStore((s) => s.rollingEditMode);
  const toggleRollingEditMode = useTimelineStore(
    (s) => s.toggleRollingEditMode,
  );
  const showHints = useSettingsStore((s) => s.showShortcutHints);
  const snapEnabled = useSettingsStore((s) => s.timelineSnap);
  const setSetting = useSettingsStore((s) => s.set);
  const isBypassing = useTimelineStore((s) => s.isBypassing);
  const undo = useProjectStore((s) => s.undo);
  const redo = useProjectStore((s) => s.redo);
  const canUndo = useProjectStore((s) => s.canUndo());
  const canRedo = useProjectStore((s) => s.canRedo());
  const toggleSnapKeys = getEffectiveKeysArray("timeline.toggleSnap");
  const lines = useProjectStore((s) => s.lines);
  const collapsedInstances = useTimelineStore((s) => s.collapsedInstances);
  const setInstanceCollapsed = useTimelineStore((s) => s.setInstanceCollapsed);

  const hasUnexpandedLines = useMemo(
    () => lines.some((l) => !l.words?.length && l.text.trim().length > 0),
    [lines],
  );

  const instanceKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const line of lines) {
      if (isLinked(line)) {
        keys.add(`${line.groupId}:${line.instanceIdx}`);
      }
    }
    return [...keys];
  }, [lines]);

  const hasGroups = instanceKeys.length > 0;
  const anyExpanded = useMemo(
    () => instanceKeys.some((k) => !collapsedInstances[k]),
    [instanceKeys, collapsedInstances],
  );

  const handleToggleAllCollapsed = useCallback(() => {
    for (const k of instanceKeys) setInstanceCollapsed(k, anyExpanded);
  }, [instanceKeys, anyExpanded, setInstanceCollapsed]);

  const handleExpandAll = useCallback(() => {
    const currentTime = useAudioStore.getState().currentTime;
    const wordDuration = useSettingsStore.getState().defaultWordDuration;
    const updateLinesWithHistory =
      useProjectStore.getState().updateLinesWithHistory;

    const updates: Array<{
      id: string;
      updates: { words?: WordTiming[]; begin?: undefined; end?: undefined };
    }> = [];

    for (const line of lines) {
      if (line.words?.length) continue;
      if (!line.text.trim()) continue;

      if (isLineSynced(line)) {
        const converted = convertLineToWord(line);
        if (converted.words) {
          updates.push({
            id: line.id,
            updates: {
              words: converted.words,
              begin: undefined,
              end: undefined,
            },
          });
        }
      } else {
        const { parts, trailingSpace } = splitIntoWordsWithMeta(line.text);
        if (parts.length === 0) continue;
        const words: WordTiming[] = parts.map((part, i) => ({
          text: trailingSpace[i] ? `${part} ` : part,
          begin: currentTime + i * wordDuration,
          end: currentTime + (i + 1) * wordDuration,
        }));
        updates.push({ id: line.id, updates: { words } });
      }
    }

    if (updates.length > 0) {
      updateLinesWithHistory(updates);

      const lineIndexById = new Map<string, number>();
      for (let i = 0; i < lines.length; i++) lineIndexById.set(lines[i].id, i);
      const newSelections: Array<{
        lineId: string;
        lineIndex: number;
        wordIndex: number;
        type: "word" | "bg";
      }> = [];
      for (const u of updates) {
        const lineIndex = lineIndexById.get(u.id);
        if (lineIndex === undefined || !u.updates.words) continue;
        for (let wi = 0; wi < u.updates.words.length; wi++) {
          newSelections.push({
            lineId: u.id,
            lineIndex,
            wordIndex: wi,
            type: "word",
          });
        }
      }
      if (newSelections.length > 0) {
        useTimelineStore.getState().setSelectedWords(newSelections);
      }
    }
  }, [lines]);

  useEffect(() => {
    const handler = () => handleExpandAll();
    window.addEventListener("timeline:expand-all", handler);
    return () => window.removeEventListener("timeline:expand-all", handler);
  }, [handleExpandAll]);

  const zoomPercent = Math.round(
    ((zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100,
  );
  const toggleSnapShortcut =
    toggleSnapKeys.length > 0 ? ` (${toggleSnapKeys.join(" ")})` : "";

  return (
    <div className="flex items-center justify-between gap-3 border-b border-calleditor-border px-4 py-3 md:px-6">
      <h2 className="text-base font-medium select-none md:text-lg">
        {t("timeline.header.title")}
      </h2>

      <div className="hidden items-center gap-4 md:flex">
        {/* Follow toggle */}
        <Button
          variant={followEnabled ? "primary" : "ghost"}
          size="sm"
          onClick={toggleFollow}
          hasIcon
          className={cn(!followEnabled && "opacity-60")}
        >
          <IconFocusCentered size={16} />
          <span>{t("timeline.header.follow")}</span>
          {showHints && (
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.toggleFollow")}
            />
          )}
        </Button>

        {/* Rolling edit toggle */}
        <Button
          variant={rollingEditMode ? "primary" : "ghost"}
          size="sm"
          onClick={toggleRollingEditMode}
          hasIcon
          className={cn(!rollingEditMode && "opacity-60")}
          title={t("timeline.header.rollingTitle")}
        >
          <IconArrowBarBoth size={16} />
          <span>{t("timeline.header.rolling")}</span>
          {showHints && (
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.toggleRollingEdit")}
            />
          )}
        </Button>

        {/* Preview sidebar toggle */}
        <Button
          variant={previewSidebarOpen ? "primary" : "ghost"}
          size="sm"
          onClick={togglePreviewSidebar}
          hasIcon
          className={cn(!previewSidebarOpen && "opacity-60")}
        >
          <IconEye size={16} />
          <span>{t("timeline.header.preview")}</span>
          {showHints && (
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.togglePreview")}
            />
          )}
        </Button>

        <Button
          variant={snapEnabled ? "primary" : "ghost"}
          size="sm"
          hasIcon
          className={cn(
            !snapEnabled && "opacity-60",
            isBypassing && "opacity-50",
          )}
          onClick={() => setSetting("timelineSnap", !snapEnabled)}
          title={t("timeline.header.snapTitle", {
            shortcut: toggleSnapShortcut,
            modKey: MOD_KEY,
          })}
        >
          <IconMagnet size={16} />
          <span>{t("timeline.header.snap")}</span>
          {showHints && <InlineKeyBadge keys={toggleSnapKeys} />}
        </Button>

        {/* Import lyrics */}
        {onImportLyrics && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onImportLyrics}
            hasIcon
            className="opacity-60"
          >
            <IconTextPlus size={16} />
            <span>{t("timeline.header.importLyrics")}</span>
            {showHints && (
              <InlineKeyBadge
                keys={getEffectiveKeysArray("timeline.importLyrics")}
              />
            )}
          </Button>
        )}

        {/* Expand all unexpanded lines */}
        {hasUnexpandedLines && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExpandAll}
            hasIcon
            className="opacity-60"
          >
            <IconLayoutDistributeHorizontal size={16} />
            <span>{t("timeline.header.expandAll")}</span>
            {showHints && (
              <InlineKeyBadge
                keys={getEffectiveKeysArray("timeline.expandAll")}
              />
            )}
          </Button>
        )}

        {/* Collapse / expand all groups */}
        {hasGroups && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleAllCollapsed}
            hasIcon
            className="opacity-60"
            title={t(
              anyExpanded
                ? "timeline.header.collapseGroups"
                : "timeline.header.expandGroups",
            )}
          >
            {anyExpanded ? (
              <IconChevronsUp size={16} />
            ) : (
              <IconChevronsDown size={16} />
            )}
            <span>
              {t(
                anyExpanded
                  ? "timeline.header.collapseGroups"
                  : "timeline.header.expandGroups",
              )}
            </span>
            {showHints && (
              <InlineKeyBadge
                keys={getEffectiveKeysArray("timeline.toggleAllCollapsed")}
              />
            )}
          </Button>
        )}

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="size-7"
          >
            <IconMinus size={16} />
          </Button>

          <span className="w-12 text-center text-xs text-calleditor-text-muted select-none tabular-nums">
            {zoomPercent}%
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="size-7"
          >
            <IconPlus size={16} />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            title={t("shortcuts.undo")}
            aria-label={t("shortcuts.undo")}
            className="size-8"
          >
            <IconArrowBackUp size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            title={t("shortcuts.redo")}
            aria-label={t("shortcuts.redo")}
            className="size-8"
          >
            <IconArrowForwardUp size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="size-8"
          >
            <IconMinus size={16} />
          </Button>

          <span className="w-12 text-center text-xs text-calleditor-text-muted select-none tabular-nums">
            {zoomPercent}%
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="size-8"
          >
            <IconPlus size={16} />
          </Button>
        </div>

        <Popover
          placement="bottom-end"
          trigger={
            <Button
              variant="ghost"
              size="icon"
              title={t("action.more")}
              className="size-8"
            >
              <IconDots size={16} />
            </Button>
          }
        >
          {(close) => (
            <div className="flex w-56 flex-col gap-1 p-2">
              <Button
                variant={followEnabled ? "primary" : "ghost"}
                size="sm"
                hasIcon
                className={cn("justify-start", !followEnabled && "opacity-80")}
                onClick={() => {
                  toggleFollow();
                  close();
                }}
              >
                <IconFocusCentered size={16} />
                {t("timeline.header.follow")}
              </Button>
              <Button
                variant={rollingEditMode ? "primary" : "ghost"}
                size="sm"
                hasIcon
                className={cn("justify-start", !rollingEditMode && "opacity-80")}
                onClick={() => {
                  toggleRollingEditMode();
                  close();
                }}
              >
                <IconArrowBarBoth size={16} />
                {t("timeline.header.rolling")}
              </Button>
              <Button
                variant={previewSidebarOpen ? "primary" : "ghost"}
                size="sm"
                hasIcon
                className={cn("justify-start", !previewSidebarOpen && "opacity-80")}
                onClick={() => {
                  togglePreviewSidebar();
                  close();
                }}
              >
                <IconEye size={16} />
                {t("timeline.header.preview")}
              </Button>
              <Button
                variant={snapEnabled ? "primary" : "ghost"}
                size="sm"
                hasIcon
                className={cn(
                  "justify-start",
                  !snapEnabled && "opacity-80",
                  isBypassing && "opacity-50",
                )}
                onClick={() => {
                  setSetting("timelineSnap", !snapEnabled);
                  close();
                }}
              >
                <IconMagnet size={16} />
                {t("timeline.header.snap")}
              </Button>
              {onImportLyrics && (
                <Button
                  variant="ghost"
                  size="sm"
                  hasIcon
                  className="justify-start"
                  onClick={() => {
                    onImportLyrics();
                    close();
                  }}
                >
                  <IconTextPlus size={16} />
                  {t("timeline.header.importLyrics")}
                </Button>
              )}
              {hasUnexpandedLines && (
                <Button
                  variant="ghost"
                  size="sm"
                  hasIcon
                  className="justify-start"
                  onClick={() => {
                    handleExpandAll();
                    close();
                  }}
                >
                  <IconLayoutDistributeHorizontal size={16} />
                  {t("timeline.header.expandAll")}
                </Button>
              )}
              {hasGroups && (
                <Button
                  variant="ghost"
                  size="sm"
                  hasIcon
                  className="justify-start"
                  onClick={() => {
                    handleToggleAllCollapsed();
                    close();
                  }}
                >
                  {anyExpanded ? (
                    <IconChevronsUp size={16} />
                  ) : (
                    <IconChevronsDown size={16} />
                  )}
                  {t(
                    anyExpanded
                      ? "timeline.header.collapseGroups"
                      : "timeline.header.expandGroups",
                  )}
                </Button>
              )}
            </div>
          )}
        </Popover>
      </div>
    </div>
  );
};

// -- Exports -------------------------------------------------------------------

export { TimelineHeader };
