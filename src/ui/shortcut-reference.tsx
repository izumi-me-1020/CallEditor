import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { useAppLanguage } from "@/lib/i18n";
import { isMac } from "@/utils/platform";
import { IconCommand } from "@tabler/icons-react";

// -- Types --------------------------------------------------------------------

interface ShortcutItemProps {
  keys: string[];
  description: string;
  shortcutId?: string;
}

interface ShortcutSectionProps {
  title: string;
  shortcuts: ShortcutItemProps[];
}

// -- Helpers ------------------------------------------------------------------

function formatKey(key: string): string {
  if (key === "Mod") return isMac ? "⌘" : "Ctrl";
  if (key === "Meta") return isMac ? "⌘" : "Meta";
  if (key === "Ctrl") return isMac ? "⌃" : "Ctrl";
  if (key === "Shift") return "⇧";
  if (key === "Alt") return isMac ? "⌥" : "Alt";
  if (key === "Space") return "Space";
  if (key === "Enter") return "↵";
  if (key === "ArrowLeft") return "←";
  if (key === "ArrowRight") return "→";
  if (key === "ArrowUp") return "↑";
  if (key === "ArrowDown") return "↓";
  return key;
}

// -- Data ---------------------------------------------------------------------

function useShortcutSections(): ShortcutSectionProps[] {
  const { t } = useAppLanguage();

  return [
    {
      title: t("shortcuts.section.general"),
      shortcuts: [
        {
          keys: ["Shift", "?"],
          description: t("shortcuts.showHelp"),
          shortcutId: "global.help",
        },
        {
          keys: ["Enter"],
          description: t("shortcuts.playPause"),
          shortcutId: "global.playPause",
        },
        {
          keys: ["Mod", "Shift", "Alt", "E"],
          description: t("shortcuts.downloadSavedWork"),
          shortcutId: "global.panicRecovery",
        },
      ],
    },
    {
      title: t("shortcuts.section.navigation"),
      shortcuts: [
        { keys: ["Mod", "1"], description: t("shortcuts.goImport") },
        { keys: ["Mod", "2"], description: t("shortcuts.goEdit") },
        { keys: ["Mod", "3"], description: t("shortcuts.goSync") },
        { keys: ["Mod", "4"], description: t("shortcuts.goTimeline") },
        { keys: ["Mod", "5"], description: t("shortcuts.goPreview") },
        { keys: ["Mod", "6"], description: t("shortcuts.goExport") },
      ],
    },
    {
      title: t("shortcuts.section.sync"),
      shortcuts: [
        {
          keys: ["Space"],
          description: t("shortcuts.startSync"),
          shortcutId: "sync.tap",
        },
        {
          keys: ["F"],
          description: t("shortcuts.holdSync"),
          shortcutId: "sync.holdSync",
        },
        {
          keys: ["ArrowLeft"],
          description: t("shortcuts.nudgeLastLeft"),
          shortcutId: "sync.nudgeLeft",
        },
        {
          keys: ["ArrowRight"],
          description: t("shortcuts.nudgeLastRight"),
          shortcutId: "sync.nudgeRight",
        },
        { keys: ["Mod", "Z"], description: t("shortcuts.undo") },
        { keys: ["Mod", "Shift", "Z"], description: t("shortcuts.redo") },
      ],
    },
    {
      title: t("shortcuts.section.timeline"),
      shortcuts: [
        {
          keys: ["F"],
          description: t("shortcuts.toggleFollow"),
          shortcutId: "timeline.toggleFollow",
        },
        {
          keys: ["P"],
          description: t("shortcuts.togglePreview"),
          shortcutId: "timeline.togglePreview",
        },
        {
          keys: ["R"],
          description: t("shortcuts.toggleRolling"),
          shortcutId: "timeline.toggleRollingEdit",
        },
        {
          keys: ["T"],
          description: t("shortcuts.toggleSnap"),
          shortcutId: "timeline.toggleSnap",
        },
        {
          keys: ["N"],
          description: t("shortcuts.insertBelow"),
          shortcutId: "timeline.insertLineBelow",
        },
        {
          keys: ["Shift", "N"],
          description: t("shortcuts.insertAbove"),
          shortcutId: "timeline.insertLineAbove",
        },
        {
          keys: ["X"],
          description: t("shortcuts.expandAll"),
          shortcutId: "timeline.expandAll",
        },
        {
          keys: ["Space"],
          description: t("shortcuts.jumpToPlayhead"),
          shortcutId: "timeline.jumpToPlayhead",
        },
        { keys: ["Escape"], description: t("shortcuts.deselectCancel") },
        {
          keys: ["["],
          description: t("shortcuts.setWordBegin"),
          shortcutId: "timeline.setWordBegin",
        },
        {
          keys: ["]"],
          description: t("shortcuts.setWordEnd"),
          shortcutId: "timeline.setWordEnd",
        },
        { keys: ["Mod", "Z"], description: t("shortcuts.undo") },
        { keys: ["Mod", "Shift", "Z"], description: t("shortcuts.redo") },
        {
          keys: ["Mod", "Shift", "V"],
          description: t("shortcuts.importLyrics"),
          shortcutId: "timeline.importLyrics",
        },
        { keys: ["Mod", "Scroll"], description: t("shortcuts.zoomInOut") },
        { keys: ["Middle", "Drag"], description: t("shortcuts.panTimeline") },
        {
          keys: ["Shift", "Middle", "Drag"],
          description: t("shortcuts.panLocked"),
        },
      ],
    },
    {
      title: t("shortcuts.section.timelineSelection"),
      shortcuts: [
        { keys: ["Click"], description: t("shortcuts.selectWord") },
        {
          keys: ["Shift", "Click"],
          description: t("shortcuts.selectAllSyllables"),
        },
        { keys: ["Mod", "A"], description: t("shortcuts.selectAllWords") },
        {
          keys: ["A"],
          description: t("shortcuts.selectWordAtPlayhead"),
          shortcutId: "timeline.selectWordAtPlayhead",
        },
        {
          keys: ["Mod", "Click"],
          description: t("shortcuts.toggleWordSelection"),
        },
        { keys: ["Drag"], description: t("shortcuts.marqueeSelect") },
        {
          keys: ["Shift", "Drag"],
          description: t("shortcuts.addMarqueeSelection"),
        },
        { keys: ["Mod", "C"], description: t("shortcuts.copySelectedWords") },
        { keys: ["Mod", "X"], description: t("shortcuts.cutSelectedWords") },
        { keys: ["Mod", "V"], description: t("shortcuts.pasteGhost") },
        { keys: ["Delete"], description: t("shortcuts.deleteSelectedWords") },
        {
          keys: ["Alt", "Drag"],
          description: t("shortcuts.duplicateSelectedWords"),
        },
        {
          keys: ["E"],
          description: t("shortcuts.editSelectedWord"),
          shortcutId: "timeline.editWord",
        },
        { keys: ["F2"], description: t("shortcuts.editSelectedWord") },
        {
          keys: ["S"],
          description: t("shortcuts.splitSyllables"),
          shortcutId: "timeline.splitSyllable",
        },
        {
          keys: ["Shift", "S"],
          description: t("shortcuts.splitWords"),
          shortcutId: "timeline.splitWord",
        },
        {
          keys: ["M"],
          description: t("shortcuts.mergeWords"),
          shortcutId: "timeline.mergeWords",
        },
        {
          keys: ["Y"],
          description: t("shortcuts.mergeSyllables"),
          shortcutId: "timeline.mergeSyllablesIntoWord",
        },
        {
          keys: ["W"],
          description: t("shortcuts.splitLineIntoWords"),
          shortcutId: "timeline.splitIntoWords",
        },
        {
          keys: ["Shift", "E"],
          description: t("shortcuts.toggleExplicit"),
          shortcutId: "timeline.toggleExplicit",
        },
        {
          keys: ["ArrowLeft"],
          description: t("shortcuts.nudgeSelectedLeft"),
          shortcutId: "timeline.nudgeLeft",
        },
        {
          keys: ["ArrowRight"],
          description: t("shortcuts.nudgeSelectedRight"),
          shortcutId: "timeline.nudgeRight",
        },
        { keys: ["Double Click"], description: t("shortcuts.doubleClickEdit") },
      ],
    },
    {
      title: t("shortcuts.section.linkedGroups"),
      shortcuts: [
        {
          keys: ["Mod", "G"],
          description: t("shortcuts.groupSelectedLines"),
          shortcutId: "timeline.createGroup",
        },
        {
          keys: ["Mod", "D"],
          description: t("shortcuts.duplicateLinked"),
          shortcutId: "timeline.duplicateAsLinked",
        },
        {
          keys: ["C"],
          description: t("shortcuts.collapseInstance"),
          shortcutId: "timeline.toggleCollapseInstance",
        },
        {
          keys: ["Shift", "C"],
          description: t("shortcuts.collapseAll"),
          shortcutId: "timeline.toggleAllCollapsed",
        },
        {
          keys: ["Mod", "J"],
          description: t("shortcuts.jumpPrevInstance"),
          shortcutId: "timeline.jumpPrevInstance",
        },
        {
          keys: ["Mod", "K"],
          description: t("shortcuts.jumpNextInstance"),
          shortcutId: "timeline.jumpNextInstance",
        },
        {
          keys: ["H"],
          description: t("shortcuts.pingSiblings"),
          shortcutId: "timeline.pingSiblings",
        },
        {
          keys: ["Shift", "P"],
          description: t("shortcuts.shiftInstanceToPlayhead"),
          shortcutId: "timeline.shiftInstanceToPlayhead",
        },
        {
          keys: ["Shift", "J"],
          description: t("shortcuts.jumpInstanceStart"),
          shortcutId: "timeline.jumpToInstanceStart",
        },
        {
          keys: ["ArrowLeft"],
          description: t("shortcuts.nudgeInstanceEarlier"),
        },
        {
          keys: ["ArrowRight"],
          description: t("shortcuts.nudgeInstanceLater"),
        },
        {
          keys: ["Mod", "Shift", "D"],
          description: t("shortcuts.detachInstance"),
          shortcutId: "timeline.detachInstance",
        },
        {
          keys: ["Mod", "Shift", "G"],
          description: t("shortcuts.deleteGroup"),
          shortcutId: "timeline.deleteGroup",
        },
      ],
    },
    {
      title: t("shortcuts.section.editMode"),
      shortcuts: [
        { keys: ["Click"], description: t("shortcuts.selectDeselectLine") },
        {
          keys: ["Shift", "Click"],
          description: t("shortcuts.selectLineRange"),
        },
        { keys: ["Drag"], description: t("shortcuts.dragSelectLines") },
      ],
    },
  ];
}

// -- Components ---------------------------------------------------------------

const KeyBadge: React.FC<{ keyName: string }> = ({ keyName }) => {
  const formatted = formatKey(keyName);
  const isSymbol = formatted.length === 1 && !/[a-zA-Z0-9]/.test(formatted);

  return (
    <span
      className={`inline-flex items-center justify-center min-w-6 h-6 px-1.5 text-xs font-medium rounded bg-calleditor-button border border-calleditor-border ${
        isSymbol ? "text-base" : ""
      }`}
    >
      {(keyName === "Mod" || keyName === "Meta") && isMac ? (
        <IconCommand className="size-3.5" />
      ) : (
        formatted
      )}
    </span>
  );
};

const ShortcutItem: React.FC<ShortcutItemProps> = ({
  keys,
  description,
  shortcutId,
}) => {
  const resolvedKeys = shortcutId ? getEffectiveKeysArray(shortcutId) : keys;
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-calleditor-text-secondary">
        {description}
      </span>
      <div className="flex items-center gap-1">
        {resolvedKeys.map((key) => (
          <KeyBadge key={key} keyName={key} />
        ))}
      </div>
    </div>
  );
};

const ShortcutSection: React.FC<ShortcutSectionProps> = ({
  title,
  shortcuts,
}) => (
  <div>
    <h3 className="mb-2 text-xs font-medium tracking-wide text-calleditor-text-muted">
      {title}
    </h3>
    <div className="flex flex-col">
      {shortcuts.map((shortcut) => (
        <ShortcutItem
          key={shortcut.shortcutId ?? shortcut.description}
          {...shortcut}
        />
      ))}
    </div>
  </div>
);

// -- Exports ------------------------------------------------------------------

export { formatKey, KeyBadge, ShortcutSection, useShortcutSections };
