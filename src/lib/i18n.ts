import { useProjectStore } from "@/stores/project";
import { type AppLanguage, useSettingsStore } from "@/stores/settings";

type ResolvedLanguage = Exclude<AppLanguage, "auto">;

type TranslationKey =
  | "settings.title"
  | "settings.savedAutomatically"
  | "settings.section.general"
  | "settings.section.playback"
  | "settings.section.timeline"
  | "settings.section.sync"
  | "settings.section.shortcuts"
  | "settings.section.confirmations"
  | "settings.section.storage"
  | "settings.section.advanced"
  | "settings.advanced.previewRenderer.label"
  | "settings.advanced.previewRenderer.description"
  | "settings.advanced.previewRenderer.braccato"
  | "settings.language.label"
  | "settings.language.description"
  | "settings.language.autoInfo"
  | "settings.language.option.auto"
  | "settings.language.option.en"
  | "settings.language.option.ja"
  | "settings.language.option.ko"
  | "settings.showShortcutHints.label"
  | "settings.showShortcutHints.description"
  | "settings.showSyllableIndicators.label"
  | "settings.showSyllableIndicators.description"
  | "settings.splitCharacter.label"
  | "settings.splitCharacter.description"
  | "settings.splitCharacter.reset"
  | "settings.splitCharacter.modalTitle"
  | "settings.splitCharacter.modalPrompt"
  | "settings.splitCharacter.modalEscape"
  | "settings.splitCharacter.modalAdvice"
  | "settings.splitCharacter.errorBlocked"
  | "settings.splitCharacter.warningTitle"
  | "settings.splitCharacter.warningCommon"
  | "settings.splitCharacter.warningDescription"
  | "settings.splitCharacter.warningCancel"
  | "settings.splitCharacter.warningConfirm"
  | "settings.resetTour.label"
  | "settings.resetTour.description"
  | "settings.resetTour.action"
  | "settings.resetDefaults.label"
  | "settings.resetDefaults.description"
  | "settings.resetDefaults.action"
  | "settings.confirmReset.title"
  | "settings.confirmReset.description"
  | "settings.confirmReset.confirm"
  | "settings.playback.defaultRate.label"
  | "settings.playback.defaultRate.description"
  | "settings.useCurrent"
  | "settings.playback.rememberVolume.label"
  | "settings.playback.rememberVolume.description"
  | "settings.timeline.defaultZoom.label"
  | "settings.timeline.defaultZoom.description"
  | "settings.timeline.defaultRowHeight.label"
  | "settings.timeline.defaultRowHeight.description"
  | "settings.timeline.snap.label"
  | "settings.timeline.snap.description"
  | "settings.timeline.snapThreshold.label"
  | "settings.timeline.snapThreshold.description"
  | "settings.timeline.follow.label"
  | "settings.timeline.follow.description"
  | "settings.timeline.horizontalScroll.label"
  | "settings.timeline.horizontalScroll.description"
  | "settings.sync.nudgeAmount.label"
  | "settings.sync.nudgeAmount.description"
  | "settings.sync.defaultWordDuration.label"
  | "settings.sync.defaultWordDuration.description"
  | "settings.sync.minWordDuration.label"
  | "settings.sync.minWordDuration.description"
  | "settings.sync.defaultGranularity.label"
  | "settings.sync.defaultGranularity.description"
  | "settings.sync.granularity.word"
  | "settings.sync.granularity.line"
  | "settings.storage.autoSaveDelay.label"
  | "settings.storage.autoSaveDelay.description"
  | "settings.confirmations.title"
  | "settings.confirmations.description"
  | "settings.confirmations.replaceProject.label"
  | "settings.confirmations.replaceProject.description"
  | "settings.confirmations.replaceLyrics.label"
  | "settings.confirmations.replaceLyrics.description"
  | "settings.confirmations.resetSync.label"
  | "settings.confirmations.resetSync.description"
  | "settings.confirmations.clearProject.label"
  | "settings.confirmations.clearProject.description"
  | "settings.confirmations.resetSettings.label"
  | "settings.confirmations.resetSettings.description"
  | "settings.confirmations.resetShortcuts.label"
  | "settings.confirmations.resetShortcuts.description"
  | "header.settings"
  | "header.productTour"
  | "header.keyboardShortcuts"
  | "tab.import"
  | "tab.edit"
  | "tab.sync"
  | "tab.timeline"
  | "tab.preview"
  | "tab.export"
  | "tab.mobileLabel"
  | "action.more"
  | "import.or"
  | "import.replaceFile"
  | "import.replaceYoutube"
  | "import.youtubeDownloading"
  | "import.youtubeFrom"
  | "import.dropTitle"
  | "import.dropHint"
  | "import.supportsFormats"
  | "youtube.placeholder"
  | "youtube.invalid"
  | "youtube.loading"
  | "youtube.load"
  | "edit.title"
  | "edit.importFile"
  | "edit.pasteLyrics"
  | "edit.insertOshi"
  | "edit.placeholder"
  | "edit.preview"
  | "edit.assignAgent"
  | "edit.clear"
  | "edit.previewEmpty"
  | "preview.title"
  | "preview.play"
  | "preview.pause"
  | "preview.empty.noAudio"
  | "preview.empty.noAudioHint"
  | "preview.empty.noLyrics"
  | "preview.empty.noLyricsHint"
  | "preview.empty.noSynced"
  | "preview.empty.noSyncedHint"
  | "export.title"
  | "export.edited"
  | "export.regenerate"
  | "export.done"
  | "export.edit"
  | "export.copied"
  | "export.copy"
  | "export.download"
  | "export.project"
  | "export.importProject"
  | "export.exportProject"
  | "export.clear"
  | "export.empty.noLyrics"
  | "export.empty.noLyricsHint"
  | "export.empty.noSynced"
  | "export.empty.noSyncedHint"
  | "export.confirmReplace.title"
  | "export.confirmReplace.confirm"
  | "export.confirmClear.title"
  | "export.confirmClear.description"
  | "export.confirmClear.confirm"
  | "sync.title"
  | "sync.line"
  | "sync.word"
  | "sync.lock"
  | "sync.unlock"
  | "sync.reset"
  | "sync.start"
  | "sync.edit"
  | "sync.complete"
  | "sync.completeHint"
  | "sync.pausedHint"
  | "sync.mobile.label"
  | "sync.mobile.hint"
  | "sync.mobile.hold"
  | "sync.mobile.release"
  | "sync.mobile.tap"
  | "sync.empty.noAudio"
  | "sync.empty.noAudioHint"
  | "sync.empty.noLyrics"
  | "sync.empty.noLyricsHint"
  | "timeline.header.title"
  | "timeline.header.follow"
  | "timeline.header.rolling"
  | "timeline.header.rollingTitle"
  | "timeline.header.preview"
  | "timeline.header.snap"
  | "timeline.header.snapTitle"
  | "timeline.header.importLyrics"
  | "timeline.header.expandAll"
  | "timeline.header.expandGroups"
  | "timeline.header.collapseGroups"
  | "tour.done"
  | "tour.skip"
  | "tour.next"
  | "tour.back"
  | "tour.welcome.title"
  | "tour.welcome.description"
  | "tour.import.title"
  | "tour.import.description"
  | "tour.importGate.title"
  | "tour.importGate.description"
  | "tour.edit.title"
  | "tour.edit.description"
  | "tour.editGate.title"
  | "tour.editGate.description"
  | "tour.sync.title"
  | "tour.sync.description"
  | "tour.syncGate.title"
  | "tour.syncGate.description"
  | "tour.timeline.title"
  | "tour.timeline.description"
  | "tour.preview.title"
  | "tour.preview.description"
  | "tour.export.title"
  | "tour.export.description"
  | "tour.outro.title"
  | "tour.outro.description"
  | "tour.task.audio"
  | "tour.task.lyrics"
  | "tour.task.sync"
  | "tour.stepLabel"
  | "help.title"
  | "help.openAnytime"
  | "help.section.gettingStarted"
  | "help.section.keyboardShortcuts"
  | "help.section.importing"
  | "help.section.editing"
  | "help.section.syncing"
  | "help.section.timeline"
  | "help.section.groups"
  | "help.section.preview"
  | "help.section.exporting"
  | "help.section.recovery"
  | "help.section.ttml"
  | "help.section.about"
  | "shortcuts.section.general"
  | "shortcuts.section.navigation"
  | "shortcuts.section.sync"
  | "shortcuts.section.timeline"
  | "shortcuts.section.timelineSelection"
  | "shortcuts.section.linkedGroups"
  | "shortcuts.section.editMode"
  | "shortcuts.showHelp"
  | "shortcuts.playPause"
  | "shortcuts.downloadSavedWork"
  | "shortcuts.goImport"
  | "shortcuts.goEdit"
  | "shortcuts.goSync"
  | "shortcuts.goTimeline"
  | "shortcuts.goPreview"
  | "shortcuts.goExport"
  | "shortcuts.startSync"
  | "shortcuts.holdSync"
  | "shortcuts.nudgeLastLeft"
  | "shortcuts.nudgeLastRight"
  | "shortcuts.undo"
  | "shortcuts.redo"
  | "shortcuts.toggleFollow"
  | "shortcuts.togglePreview"
  | "shortcuts.toggleRolling"
  | "shortcuts.toggleSnap"
  | "shortcuts.insertBelow"
  | "shortcuts.insertAbove"
  | "shortcuts.expandAll"
  | "shortcuts.jumpToPlayhead"
  | "shortcuts.deselectCancel"
  | "shortcuts.setWordBegin"
  | "shortcuts.setWordEnd"
  | "shortcuts.importLyrics"
  | "shortcuts.zoomInOut"
  | "shortcuts.panTimeline"
  | "shortcuts.panLocked"
  | "shortcuts.selectWord"
  | "shortcuts.selectAllSyllables"
  | "shortcuts.selectAllWords"
  | "shortcuts.selectWordAtPlayhead"
  | "shortcuts.toggleWordSelection"
  | "shortcuts.marqueeSelect"
  | "shortcuts.addMarqueeSelection"
  | "shortcuts.copySelectedWords"
  | "shortcuts.cutSelectedWords"
  | "shortcuts.pasteGhost"
  | "shortcuts.deleteSelectedWords"
  | "shortcuts.duplicateSelectedWords"
  | "shortcuts.editSelectedWord"
  | "shortcuts.splitSyllables"
  | "shortcuts.splitWords"
  | "shortcuts.mergeWords"
  | "shortcuts.mergeSyllables"
  | "shortcuts.splitLineIntoWords"
  | "shortcuts.toggleExplicit"
  | "shortcuts.nudgeSelectedLeft"
  | "shortcuts.nudgeSelectedRight"
  | "shortcuts.doubleClickEdit"
  | "shortcuts.groupSelectedLines"
  | "shortcuts.duplicateLinked"
  | "shortcuts.collapseInstance"
  | "shortcuts.collapseAll"
  | "shortcuts.jumpPrevInstance"
  | "shortcuts.jumpNextInstance"
  | "shortcuts.pingSiblings"
  | "shortcuts.shiftInstanceToPlayhead"
  | "shortcuts.jumpInstanceStart"
  | "shortcuts.nudgeInstanceEarlier"
  | "shortcuts.nudgeInstanceLater"
  | "shortcuts.detachInstance"
  | "shortcuts.deleteGroup"
  | "shortcuts.selectDeselectLine"
  | "shortcuts.selectLineRange"
  | "shortcuts.dragSelectLines"
  | "shortcutsSettings.general"
  | "shortcutsSettings.sync"
  | "shortcutsSettings.timeline"
  | "shortcutsSettings.resetTitle"
  | "shortcutsSettings.resetDescription"
  | "shortcutsSettings.resetConfirm"
  | "shortcutsSettings.searchPlaceholder"
  | "shortcutsSettings.clearSearch"
  | "shortcutsSettings.noMatch"
  | "shortcutsSettings.resetAllLabel"
  | "shortcutsSettings.resetAllDescription"
  | "shortcutsSettings.resetAllAction"
  | "shortcut.reset"
  | "shortcut.unbound"
  | "shortcut.rebindTitle"
  | "shortcut.pressNew"
  | "shortcut.pressEscape"
  | "shortcut.browserTitle"
  | "shortcut.browserReserved"
  | "shortcut.browserDescription"
  | "shortcut.cancel"
  | "shortcut.assignAnyway"
  | "shortcut.conflictTitle"
  | "shortcut.conflictUsedBy"
  | "shortcut.conflictReplaceDescription"
  | "shortcut.replace";

const DICTIONARIES: Record<ResolvedLanguage, Record<TranslationKey, string>> = {
  en: {
    "settings.title": "Settings",
    "settings.savedAutomatically": "Settings are saved automatically",
    "settings.section.general": "General",
    "settings.section.playback": "Playback",
    "settings.section.timeline": "Timeline",
    "settings.section.sync": "Sync & Timing",
    "settings.section.shortcuts": "Shortcuts",
    "settings.section.confirmations": "Confirmations",
    "settings.section.storage": "Save & Storage",
    "settings.section.advanced": "Advanced",
    "settings.advanced.previewRenderer.label": "Preview renderer",
    "settings.advanced.previewRenderer.description":
      "Which engine renders synced calls in the Preview tab.",
    "settings.advanced.previewRenderer.braccato": "Braccato (default)",
    "settings.language.label": "Language",
    "settings.language.description":
      "Choose the app display language, or let CallEditor detect it automatically.",
    "settings.language.autoInfo": "Auto is currently using {language}.",
    "settings.language.option.auto": "Auto",
    "settings.language.option.en": "English",
    "settings.language.option.ja": "Japanese",
    "settings.language.option.ko": "Korean",
    "settings.showShortcutHints.label": "Show shortcut hints",
    "settings.showShortcutHints.description":
      "Display keyboard shortcut badges on toolbar buttons.",
    "settings.showSyllableIndicators.label": "Show syllable indicators",
    "settings.showSyllableIndicators.description":
      "Visually group syllables split from one word.",
    "settings.splitCharacter.label": "Split character",
    "settings.splitCharacter.description":
      "Character used to mark syllable boundaries in the edit view",
    "settings.splitCharacter.reset": "Reset",
    "settings.splitCharacter.modalTitle": "Change split character",
    "settings.splitCharacter.modalPrompt":
      "Press a character to use as the syllable split marker",
    "settings.splitCharacter.modalEscape": "Press Escape to cancel",
    "settings.splitCharacter.modalAdvice":
      "Pick a symbol you won't use in calls. Characters like commas, apostrophes, and hyphens appear in calls and will cause unintended splits.",
    "settings.splitCharacter.errorBlocked":
      "Letters, numbers, and whitespace cannot be used",
    "settings.splitCharacter.warningTitle": "Character warning",
    "settings.splitCharacter.warningCommon": "commonly appears in calls.",
    "settings.splitCharacter.warningDescription":
      "Using it as a split marker means every occurrence in your text will be treated as a syllable break.",
    "settings.splitCharacter.warningCancel": "Cancel",
    "settings.splitCharacter.warningConfirm": "Use anyway",
    "settings.resetTour.label": "Reset product tour",
    "settings.resetTour.description":
      "Restart the guided walkthrough that introduces CallEditor's features.",
    "settings.resetTour.action": "Reset tour",
    "settings.resetDefaults.label": "Reset to defaults",
    "settings.resetDefaults.description":
      "Restore all settings to their original values.",
    "settings.resetDefaults.action": "Reset all",
    "settings.confirmReset.title": "Reset all settings?",
    "settings.confirmReset.description":
      "Restore every setting to its default value. Your project data is not affected.",
    "settings.confirmReset.confirm": "Reset",
    "settings.playback.defaultRate.label": "Default playback rate",
    "settings.playback.defaultRate.description":
      "Starting playback speed when audio is loaded.",
    "settings.useCurrent": "Use current",
    "settings.playback.rememberVolume.label": "Remember volume",
    "settings.playback.rememberVolume.description":
      "Keep your volume level between sessions.",
    "settings.timeline.defaultZoom.label": "Default zoom",
    "settings.timeline.defaultZoom.description":
      "Initial zoom level (px/sec) when opening the timeline.",
    "settings.timeline.defaultRowHeight.label": "Default row height",
    "settings.timeline.defaultRowHeight.description":
      "Starting height of each call row in the timeline.",
    "settings.timeline.snap.label": "Snap (magnet)",
    "settings.timeline.snap.description":
      "Word edges snap to nearby anchors when dragging or resizing.",
    "settings.timeline.snapThreshold.label": "Snap threshold",
    "settings.timeline.snapThreshold.description":
      "Distance (in pixels) at which the moving block locks onto an anchor.",
    "settings.timeline.follow.label": "Follow playhead",
    "settings.timeline.follow.description":
      "Auto-scroll the timeline to keep the playhead visible.",
    "settings.timeline.horizontalScroll.label": "Scroll wheel scrolls timeline",
    "settings.timeline.horizontalScroll.description":
      "Plain scroll moves the timeline horizontally. Hold Shift to scroll vertically.",
    "settings.sync.nudgeAmount.label": "Nudge amount",
    "settings.sync.nudgeAmount.description":
      "How far timing shifts when using nudge controls.",
    "settings.sync.defaultWordDuration.label": "Default word duration",
    "settings.sync.defaultWordDuration.description":
      "Length assigned to newly created words in the timeline.",
    "settings.sync.minWordDuration.label": "Min word duration",
    "settings.sync.minWordDuration.description":
      "Shortest allowed duration for a word.",
    "settings.sync.defaultGranularity.label": "Default granularity",
    "settings.sync.defaultGranularity.description":
      "Whether new projects start in word or line timing mode.",
    "settings.sync.granularity.word": "Word",
    "settings.sync.granularity.line": "Line",
    "settings.storage.autoSaveDelay.label": "Auto-save delay",
    "settings.storage.autoSaveDelay.description":
      "How long to wait after your last edit before auto-saving.",
    "settings.confirmations.title": "Confirmation prompts",
    "settings.confirmations.description":
      "Toggle confirmation prompts for actions that can lose work. Turn one off to skip its warning until you re-enable it here.",
    "settings.confirmations.replaceProject.label":
      "Confirm replacing project from URL",
    "settings.confirmations.replaceProject.description":
      "Show a warning when an import URL would replace your current project.",
    "settings.confirmations.replaceLyrics.label":
      "Confirm replacing calls on import",
    "settings.confirmations.replaceLyrics.description":
      "Show a warning when importing calls into a project that already has lines.",
    "settings.confirmations.resetSync.label": "Confirm resetting sync timing",
    "settings.confirmations.resetSync.description":
      "Show a warning before clearing every word and line timing in the sync view.",
    "settings.confirmations.clearProject.label": "Confirm clearing project",
    "settings.confirmations.clearProject.description":
      "Show a warning before discarding the current project, metadata, and audio file.",
    "settings.confirmations.resetSettings.label":
      "Confirm resetting all settings",
    "settings.confirmations.resetSettings.description":
      "Show a warning before restoring all settings to their defaults.",
    "settings.confirmations.resetShortcuts.label":
      "Confirm resetting all shortcuts",
    "settings.confirmations.resetShortcuts.description":
      "Show a warning before clearing all custom keyboard bindings.",
    "header.settings": "Settings",
    "header.productTour": "Product tour",
    "header.keyboardShortcuts": "Keyboard shortcuts (?)",
    "tab.import": "Import",
    "tab.edit": "Edit",
    "tab.sync": "Sync",
    "tab.timeline": "Timeline",
    "tab.preview": "Preview",
    "tab.export": "Export",
    "tab.mobileLabel": "Open section",
    "action.more": "More",
    "import.or": "or",
    "import.replaceFile": "Drop another file to replace",
    "import.replaceYoutube": "Load a different YouTube URL",
    "import.youtubeDownloading": "Downloading from YouTube",
    "import.youtubeFrom": "from YouTube",
    "import.dropTitle": "Load audio from YouTube",
    "import.dropHint": "Paste a YouTube URL or video ID below",
    "import.supportsFormats": "YouTube URLs only",
    "youtube.placeholder": "Paste YouTube URL or video ID",
    "youtube.invalid": "That doesn't look like a valid YouTube URL or ID",
    "youtube.loading": "Loading",
    "youtube.load": "Load",
    "edit.title": "Call Editor",
    "edit.importFile": "Import File",
    "edit.pasteLyrics": "Paste or type calls",
    "edit.insertOshi": "Insert {oshi}",
    "edit.placeholder":
      "Paste your calls here, one line at a time...\n\nOr drag and drop a call file (.txt, .lrc, .srt, .ttml)",
    "edit.preview": "Preview",
    "edit.assignAgent": "Assign agent",
    "edit.clear": "Clear",
    "edit.previewEmpty": "Calls will appear here",
    "preview.title": "Preview",
    "preview.play": "Play",
    "preview.pause": "Pause",
    "preview.empty.noAudio": "No audio loaded",
    "preview.empty.noAudioHint": "Load a YouTube video in the Import tab first",
    "preview.empty.noLyrics": "No calls to preview",
    "preview.empty.noLyricsHint": "Add calls in the Edit tab first",
    "preview.empty.noSynced": "No synced content",
    "preview.empty.noSyncedHint": "Sync calls in the Sync tab first",
    "export.title": "Export",
    "export.edited": "edited",
    "export.regenerate": "Regenerate",
    "export.done": "Done",
    "export.edit": "Edit",
    "export.copied": "Copied",
    "export.copy": "Copy",
    "export.download": "Download TTML",
    "export.project": "Project",
    "export.importProject": "Import Project",
    "export.exportProject": "Export Project",
    "export.clear": "Clear",
    "export.empty.noLyrics": "No calls to export",
    "export.empty.noLyricsHint": "Add calls in the Edit tab first",
    "export.empty.noSynced": "No synced content",
    "export.empty.noSyncedHint": "Sync calls in the Sync tab first",
    "export.confirmReplace.title": "Replace current project?",
    "export.confirmReplace.confirm": "Replace",
    "export.confirmClear.title": "Clear all project data?",
    "export.confirmClear.description":
      "Remove every line, all metadata, and the audio file from this project. This cannot be undone.",
    "export.confirmClear.confirm": "Clear",
    "sync.title": "Sync",
    "sync.line": "Line",
    "sync.word": "Word",
    "sync.lock": "Lock to edit mode",
    "sync.unlock": "Unlock sync mode",
    "sync.reset": "Reset",
    "sync.start": "Start",
    "sync.edit": "Edit",
    "sync.complete": "Sync complete!",
    "sync.completeHint": "Proceed to Preview to review your work",
    "sync.pausedHint": "Paused. Tap a line to jump, or play to continue",
    "sync.mobile.label": "Touch controls",
    "sync.mobile.hint":
      "Hold to stretch the current word. Tap to mark timing or advance while holding.",
    "sync.mobile.hold": "Hold",
    "sync.mobile.release": "Release",
    "sync.mobile.tap": "Tap",
    "sync.empty.noAudio": "No audio loaded",
    "sync.empty.noAudioHint": "Load a YouTube video in the Import tab first",
    "sync.empty.noLyrics": "No calls to sync",
    "sync.empty.noLyricsHint": "Add calls in the Edit tab first",
    "timeline.header.title": "Timeline",
    "timeline.header.follow": "Follow",
    "timeline.header.rolling": "Rolling",
    "timeline.header.rollingTitle":
      "Rolling edit: drag a shared word boundary and both words move together",
    "timeline.header.preview": "Preview",
    "timeline.header.snap": "Snap",
    "timeline.header.snapTitle":
      "Snap{shortcut} · hold {modKey} to bypass",
    "timeline.header.importLyrics": "Import",
    "timeline.header.expandAll": "Expand All",
    "timeline.header.expandGroups": "Expand all",
    "timeline.header.collapseGroups": "Collapse all",
    "tour.done": "Done!",
    "tour.skip": "Skip",
    "tour.next": "Next",
    "tour.back": "Back",
    "tour.welcome.title": "Welcome to CallEditor",
    "tour.welcome.description":
      "A tool for creating synchronized calls in TTML format. Let's walk through the workflow together.",
    "tour.import.title": "Bring in your audio",
    "tour.import.description":
      "Paste a YouTube URL here to pull audio directly from a video.",
    "tour.importGate.title": "Import your audio",
    "tour.importGate.description": "Paste a YouTube URL to continue.",
    "tour.edit.title": "Type or paste calls",
    "tour.edit.description":
      "Enter your calls in the text area on the left. Each line becomes a sync target.",
    "tour.editGate.title": "Add your calls",
    "tour.editGate.description": "Type or paste at least one line to continue.",
    "tour.sync.title": "Sync your calls",
    "tour.sync.description":
      "Press Start, then tap Space in time with each line or word. Use the granularity toggle for line vs word precision.",
    "tour.syncGate.title": "Sync at least one line",
    "tour.syncGate.description":
      "Press Start, play the audio, then tap Space to set timing.",
    "tour.timeline.title": "Fine-tune on the timeline",
    "tour.timeline.description":
      "Drag words to adjust timing, nudge with arrow keys, use {modKey} + scroll to zoom, and press F to toggle playhead follow. Group repeats with {modKey}+G and duplicate linked instances with {modKey}+D.",
    "tour.preview.title": "Preview your work",
    "tour.preview.description":
      "Watch calls play back in sync with the audio. Click any line to jump there.",
    "tour.export.title": "Export your TTML",
    "tour.export.description":
      "Copy or download the finished TTML file. You can also export the full project as JSON.",
    "tour.outro.title": "See a full walkthrough",
    "tour.outro.description":
      "You're all set! Here's a video of the full process.",
    "tour.task.audio": "Load a YouTube video",
    "tour.task.lyrics": "Type or paste calls",
    "tour.task.sync": "Sync at least one line",
    "tour.stepLabel": "Step {current} / {total}",
    "help.title": "Help",
    "help.openAnytime": "Press {shortcut} to open anytime",
    "help.section.gettingStarted": "Getting Started",
    "help.section.keyboardShortcuts": "Keyboard Shortcuts",
    "help.section.importing": "Importing Audio",
    "help.section.editing": "Editing Calls",
    "help.section.syncing": "Syncing",
    "help.section.timeline": "Timeline",
    "help.section.groups": "Linked groups",
    "help.section.preview": "Preview",
    "help.section.exporting": "Exporting",
    "help.section.recovery": "Recovery",
    "help.section.ttml": "TTML & standards",
    "help.section.about": "About",
    "shortcuts.section.general": "General",
    "shortcuts.section.navigation": "Navigation",
    "shortcuts.section.sync": "Sync Mode",
    "shortcuts.section.timeline": "Timeline Mode",
    "shortcuts.section.timelineSelection": "Timeline Selection",
    "shortcuts.section.linkedGroups": "Linked Groups",
    "shortcuts.section.editMode": "Edit Mode",
    "shortcuts.showHelp": "Show keyboard shortcuts",
    "shortcuts.playPause": "Play / Pause audio",
    "shortcuts.downloadSavedWork": "Download saved work",
    "shortcuts.goImport": "Go to Import tab",
    "shortcuts.goEdit": "Go to Edit tab",
    "shortcuts.goSync": "Go to Sync tab",
    "shortcuts.goTimeline": "Go to Timeline tab",
    "shortcuts.goPreview": "Go to Preview tab",
    "shortcuts.goExport": "Go to Export tab",
    "shortcuts.startSync": "Start sync / Tap to sync word",
    "shortcuts.holdSync": "Hold to sync word (hold mode)",
    "shortcuts.nudgeLastLeft": "Nudge last synced -50ms",
    "shortcuts.nudgeLastRight": "Nudge last synced +50ms",
    "shortcuts.undo": "Undo",
    "shortcuts.redo": "Redo",
    "shortcuts.toggleFollow": "Toggle follow playhead",
    "shortcuts.togglePreview": "Toggle preview sidebar",
    "shortcuts.toggleRolling": "Toggle rolling edit",
    "shortcuts.toggleSnap": "Toggle snap (magnet)",
    "shortcuts.insertBelow": "Insert line below selected word",
    "shortcuts.insertAbove": "Insert line above selected word",
    "shortcuts.expandAll": "Expand all lines",
    "shortcuts.jumpToPlayhead": "Jump viewport to playhead",
    "shortcuts.deselectCancel": "Deselect / cancel paste",
    "shortcuts.setWordBegin": "Set word begin to playhead",
    "shortcuts.setWordEnd": "Set word end to playhead",
    "shortcuts.importLyrics": "Import calls",
    "shortcuts.zoomInOut": "Zoom in / out",
    "shortcuts.panTimeline": "Pan timeline",
    "shortcuts.panLocked": "Pan locked to axis",
    "shortcuts.selectWord": "Select word",
    "shortcuts.selectAllSyllables": "Select all syllables in word",
    "shortcuts.selectAllWords": "Select all words",
    "shortcuts.selectWordAtPlayhead": "Select word under playhead",
    "shortcuts.toggleWordSelection": "Toggle word in selection",
    "shortcuts.marqueeSelect": "Marquee select words",
    "shortcuts.addMarqueeSelection": "Add to selection with marquee",
    "shortcuts.copySelectedWords": "Copy selected words",
    "shortcuts.cutSelectedWords": "Cut selected words",
    "shortcuts.pasteGhost": "Paste (ghost preview, click to place)",
    "shortcuts.deleteSelectedWords": "Delete selected words",
    "shortcuts.duplicateSelectedWords": "Duplicate selected words",
    "shortcuts.editSelectedWord": "Edit selected word text",
    "shortcuts.splitSyllables": "Split selected word into syllables",
    "shortcuts.splitWords": "Split word into words",
    "shortcuts.mergeWords": "Merge adjacent selected words",
    "shortcuts.mergeSyllables": "Merge syllables into one word",
    "shortcuts.splitLineIntoWords": "Split line into words",
    "shortcuts.toggleExplicit": "Mark / unmark explicit",
    "shortcuts.nudgeSelectedLeft": "Nudge selected words left",
    "shortcuts.nudgeSelectedRight": "Nudge selected words right",
    "shortcuts.doubleClickEdit": "Edit word / create word",
    "shortcuts.groupSelectedLines": "Group selected lines",
    "shortcuts.duplicateLinked": "Duplicate as linked instance",
    "shortcuts.collapseInstance": "Collapse / expand current instance",
    "shortcuts.collapseAll": "Collapse / expand all",
    "shortcuts.jumpPrevInstance": "Jump to previous instance",
    "shortcuts.jumpNextInstance": "Jump to next instance",
    "shortcuts.pingSiblings": "Ping sibling instances",
    "shortcuts.shiftInstanceToPlayhead": "Shift current instance to playhead",
    "shortcuts.jumpInstanceStart": "Jump to start of current instance",
    "shortcuts.nudgeInstanceEarlier": "Nudge selected words / instance earlier",
    "shortcuts.nudgeInstanceLater": "Nudge selected words / instance later",
    "shortcuts.detachInstance": "Detach current instance",
    "shortcuts.deleteGroup": "Delete current group",
    "shortcuts.selectDeselectLine": "Select / deselect line",
    "shortcuts.selectLineRange": "Select range of lines",
    "shortcuts.dragSelectLines": "Drag on line numbers to select a range",
    "shortcutsSettings.general": "General",
    "shortcutsSettings.sync": "Sync Mode",
    "shortcutsSettings.timeline": "Timeline Mode",
    "shortcutsSettings.resetTitle": "Reset all shortcuts?",
    "shortcutsSettings.resetDescription":
      "Clear every custom keyboard binding and restore the defaults.",
    "shortcutsSettings.resetConfirm": "Reset",
    "shortcutsSettings.searchPlaceholder": "Search shortcuts",
    "shortcutsSettings.clearSearch": "Clear search",
    "shortcutsSettings.noMatch": 'No shortcuts match "{query}".',
    "shortcutsSettings.resetAllLabel": "Reset all shortcuts",
    "shortcutsSettings.resetAllDescription":
      "Restore all keyboard shortcuts to their defaults.",
    "shortcutsSettings.resetAllAction": "Reset all",
    "shortcut.reset": "Reset",
    "shortcut.unbound": "Unbound",
    "shortcut.rebindTitle": "Rebind shortcut",
    "shortcut.pressNew": "Press a new key combination",
    "shortcut.pressEscape": "Press Escape to cancel",
    "shortcut.browserTitle": "Browser shortcut",
    "shortcut.browserReserved": "may be reserved by the browser.",
    "shortcut.browserDescription":
      "This combination might be handled by your browser before it reaches the app. You can still assign it, but it may not work in all browsers.",
    "shortcut.cancel": "Cancel",
    "shortcut.assignAnyway": "Assign anyway",
    "shortcut.conflictTitle": "Shortcut conflict",
    "shortcut.conflictUsedBy": "is already used by:",
    "shortcut.conflictReplaceDescription":
      "Replacing will reset the conflicting shortcut to its default.",
    "shortcut.replace": "Replace",
  },
  ja: {
    "settings.title": "設定",
    "settings.savedAutomatically": "設定は自動で保存されます",
    "settings.section.general": "一般",
    "settings.section.playback": "再生",
    "settings.section.timeline": "タイムライン",
    "settings.section.sync": "同期とタイミング",
    "settings.section.shortcuts": "ショートカット",
    "settings.section.confirmations": "確認",
    "settings.section.storage": "保存とストレージ",
    "settings.section.advanced": "詳細",
    "settings.advanced.previewRenderer.label": "プレビュー描画エンジン",
    "settings.advanced.previewRenderer.description":
      "プレビュータブで同期コールを描画するエンジンを選びます。",
    "settings.advanced.previewRenderer.braccato": "Braccato（デフォルト）",
    "settings.language.label": "言語",
    "settings.language.description":
      "アプリの表示言語を選ぶか、CallEditor に自動判別させます。",
    "settings.language.autoInfo": "現在の自動判別言語: {language}",
    "settings.language.option.auto": "自動",
    "settings.language.option.en": "English",
    "settings.language.option.ja": "日本語",
    "settings.language.option.ko": "한국어",
    "settings.showShortcutHints.label": "ショートカットのヒントを表示",
    "settings.showShortcutHints.description":
      "ツールバーボタンにキーボードショートカットを表示します。",
    "settings.showSyllableIndicators.label": "音節インジケーターを表示",
    "settings.showSyllableIndicators.description":
      "1単語から分割した音節を視覚的にまとめて表示します。",
    "settings.splitCharacter.label": "分割文字",
    "settings.splitCharacter.description":
      "編集ビューで音節の区切りを示すために使う文字です",
    "settings.splitCharacter.reset": "リセット",
    "settings.splitCharacter.modalTitle": "分割文字を変更",
    "settings.splitCharacter.modalPrompt":
      "音節分割マーカーとして使う文字を押してください",
    "settings.splitCharacter.modalEscape": "Escape でキャンセル",
    "settings.splitCharacter.modalAdvice":
      "コールの中で使わない記号を選んでください。カンマ、アポストロフィ、ハイフンなどはコールに現れやすく、意図しない分割の原因になります。",
    "settings.splitCharacter.errorBlocked":
      "英字・数字・空白文字は使用できません",
    "settings.splitCharacter.warningTitle": "文字の警告",
    "settings.splitCharacter.warningCommon": "はコールによく現れる文字です。",
    "settings.splitCharacter.warningDescription":
      "これを分割マーカーにすると、テキスト中の出現箇所がすべて音節区切りとして扱われます。",
    "settings.splitCharacter.warningCancel": "キャンセル",
    "settings.splitCharacter.warningConfirm": "それでも使う",
    "settings.resetTour.label": "プロダクトツアーをリセット",
    "settings.resetTour.description":
      "CallEditor の機能紹介ツアーを最初からやり直します。",
    "settings.resetTour.action": "ツアーをリセット",
    "settings.resetDefaults.label": "デフォルトに戻す",
    "settings.resetDefaults.description": "すべての設定を初期値に戻します。",
    "settings.resetDefaults.action": "すべてリセット",
    "settings.confirmReset.title": "すべての設定をリセットしますか？",
    "settings.confirmReset.description":
      "全設定を初期値に戻します。プロジェクトデータには影響しません。",
    "settings.confirmReset.confirm": "リセット",
    "settings.playback.defaultRate.label": "デフォルト再生速度",
    "settings.playback.defaultRate.description":
      "音声を読み込んだときの初期再生速度です。",
    "settings.useCurrent": "現在値を使う",
    "settings.playback.rememberVolume.label": "音量を記憶",
    "settings.playback.rememberVolume.description":
      "セッションをまたいで音量を保持します。",
    "settings.timeline.defaultZoom.label": "デフォルトズーム",
    "settings.timeline.defaultZoom.description":
      "タイムラインを開いたときの初期ズーム量 (px/秒) です。",
    "settings.timeline.defaultRowHeight.label": "デフォルト行高",
    "settings.timeline.defaultRowHeight.description":
      "タイムライン内のコール行の初期高さです。",
    "settings.timeline.snap.label": "スナップ (マグネット)",
    "settings.timeline.snap.description":
      "ドラッグやリサイズ時に単語端を近いアンカーへ吸着させます。",
    "settings.timeline.snapThreshold.label": "スナップしきい値",
    "settings.timeline.snapThreshold.description":
      "移動中ブロックがアンカーに吸着する距離 (ピクセル) です。",
    "settings.timeline.follow.label": "再生ヘッドに追従",
    "settings.timeline.follow.description":
      "再生ヘッドが見えるようにタイムラインを自動スクロールします。",
    "settings.timeline.horizontalScroll.label":
      "ホイールでタイムラインをスクロール",
    "settings.timeline.horizontalScroll.description":
      "通常スクロールで横移動、Shift で縦スクロールします。",
    "settings.sync.nudgeAmount.label": "微調整量",
    "settings.sync.nudgeAmount.description":
      "微調整操作でタイミングをどれだけ動かすかです。",
    "settings.sync.defaultWordDuration.label": "デフォルト単語長",
    "settings.sync.defaultWordDuration.description":
      "タイムラインで新規単語に割り当てる長さです。",
    "settings.sync.minWordDuration.label": "最小単語長",
    "settings.sync.minWordDuration.description":
      "単語に許可する最短の長さです。",
    "settings.sync.defaultGranularity.label": "デフォルト粒度",
    "settings.sync.defaultGranularity.description":
      "新規プロジェクトを単語単位か行単位のどちらで始めるかです。",
    "settings.sync.granularity.word": "単語",
    "settings.sync.granularity.line": "行",
    "settings.storage.autoSaveDelay.label": "自動保存の待機時間",
    "settings.storage.autoSaveDelay.description":
      "最後の編集から自動保存まで待つ時間です。",
    "settings.confirmations.title": "確認ダイアログ",
    "settings.confirmations.description":
      "作業を失う可能性がある操作の確認表示を切り替えます。ここで再度オンにするまで、その警告を省略できます。",
    "settings.confirmations.replaceProject.label":
      "URL からのプロジェクト置き換えを確認",
    "settings.confirmations.replaceProject.description":
      "インポート URL で現在のプロジェクトが置き換わるときに警告を表示します。",
    "settings.confirmations.replaceLyrics.label":
      "コールインポート時の置き換えを確認",
    "settings.confirmations.replaceLyrics.description":
      "既に行があるプロジェクトにコールを取り込むとき警告を表示します。",
    "settings.confirmations.resetSync.label": "同期タイミングのリセットを確認",
    "settings.confirmations.resetSync.description":
      "同期ビューの全単語・全行タイミングを消す前に警告を表示します。",
    "settings.confirmations.clearProject.label": "プロジェクト削除を確認",
    "settings.confirmations.clearProject.description":
      "現在のプロジェクト、メタデータ、音声を破棄する前に警告を表示します。",
    "settings.confirmations.resetSettings.label": "全設定リセットを確認",
    "settings.confirmations.resetSettings.description":
      "すべての設定を初期値へ戻す前に警告を表示します。",
    "settings.confirmations.resetShortcuts.label":
      "全ショートカットリセットを確認",
    "settings.confirmations.resetShortcuts.description":
      "カスタムキーバインドを全削除する前に警告を表示します。",
    "header.settings": "設定",
    "header.productTour": "プロダクトツアー",
    "header.keyboardShortcuts": "キーボードショートカット (?)",
    "tab.import": "読み込み",
    "tab.edit": "編集",
    "tab.sync": "同期",
    "tab.timeline": "タイムライン",
    "tab.preview": "プレビュー",
    "tab.export": "書き出し",
    "tab.mobileLabel": "セクションを開く",
    "action.more": "その他",
    "import.or": "または",
    "import.replaceFile": "別のファイルをドロップして置き換え",
    "import.replaceYoutube": "別の YouTube URL を読み込む",
    "import.youtubeDownloading": "YouTube からダウンロード中",
    "import.youtubeFrom": "YouTube から",
    "import.dropTitle": "YouTube から音声を読み込む",
    "import.dropHint": "下に YouTube URL または動画 ID を貼り付けてください",
    "import.supportsFormats": "YouTube URL のみ対応",
    "youtube.placeholder": "YouTube URL または動画 ID を貼り付け",
    "youtube.invalid": "有効な YouTube URL または ID ではないようです",
    "youtube.loading": "読み込み中",
    "youtube.load": "読み込む",
    "edit.title": "コールエディター",
    "edit.importFile": "ファイルを読み込む",
    "edit.pasteLyrics": "コールを貼り付けるか入力",
    "edit.insertOshi": "推し文字列",
    "edit.placeholder":
      "ここにコールを1行ずつ貼り付けてください...\n\nまたはコールファイル (.txt, .lrc, .srt, .ttml) をドラッグ＆ドロップ",
    "edit.preview": "プレビュー",
    "edit.assignAgent": "エージェントを割り当て",
    "edit.clear": "クリア",
    "edit.previewEmpty": "ここにコールが表示されます",
    "preview.title": "プレビュー",
    "preview.play": "再生",
    "preview.pause": "一時停止",
    "preview.empty.noAudio": "音声が読み込まれていません",
    "preview.empty.noAudioHint":
      "先に「読み込み」タブで YouTube 動画を読み込んでください",
    "preview.empty.noLyrics": "プレビューするコールがありません",
    "preview.empty.noLyricsHint": "先に「編集」タブでコールを追加してください",
    "preview.empty.noSynced": "同期済み内容がありません",
    "preview.empty.noSyncedHint": "先に「同期」タブでコールを同期してください",
    "export.title": "書き出し",
    "export.edited": "編集中",
    "export.regenerate": "再生成",
    "export.done": "完了",
    "export.edit": "編集",
    "export.copied": "コピー済み",
    "export.copy": "コピー",
    "export.download": "TTML をダウンロード",
    "export.project": "プロジェクト",
    "export.importProject": "プロジェクトを読み込む",
    "export.exportProject": "プロジェクトを書き出す",
    "export.clear": "クリア",
    "export.empty.noLyrics": "書き出すコールがありません",
    "export.empty.noLyricsHint": "先に「編集」タブでコールを追加してください",
    "export.empty.noSynced": "同期済み内容がありません",
    "export.empty.noSyncedHint": "先に「同期」タブでコールを同期してください",
    "export.confirmReplace.title": "現在のプロジェクトを置き換えますか？",
    "export.confirmReplace.confirm": "置き換える",
    "export.confirmClear.title": "プロジェクトデータをすべて消去しますか？",
    "export.confirmClear.description":
      "このプロジェクトの全行、全メタデータ、音声ファイルを削除します。元に戻せません。",
    "export.confirmClear.confirm": "消去",
    "sync.title": "同期",
    "sync.line": "行",
    "sync.word": "単語",
    "sync.lock": "編集モードに固定",
    "sync.unlock": "同期モードに戻す",
    "sync.reset": "リセット",
    "sync.start": "開始",
    "sync.edit": "編集",
    "sync.complete": "同期が完了しました！",
    "sync.completeHint": "「プレビュー」タブで仕上がりを確認できます",
    "sync.pausedHint":
      "一時停止中です。行をタップして移動するか、再生して続けてください",
    "sync.mobile.label": "タッチ操作",
    "sync.mobile.hint":
      "長押しで今の単語を伸ばせます。タップでタイミング指定、長押し中のタップで次へ進みます。",
    "sync.mobile.hold": "長押し",
    "sync.mobile.release": "離す",
    "sync.mobile.tap": "タップ",
    "sync.empty.noAudio": "音声が読み込まれていません",
    "sync.empty.noAudioHint":
      "先に「読み込み」タブで YouTube 動画を読み込んでください",
    "sync.empty.noLyrics": "同期するコールがありません",
    "sync.empty.noLyricsHint": "先に「編集」タブでコールを追加してください",
    "timeline.header.title": "タイムライン",
    "timeline.header.follow": "追従",
    "timeline.header.rolling": "ローリング",
    "timeline.header.rollingTitle":
      "ローリング編集: 隣り合う単語の共有境界をドラッグすると両方が連動して動きます",
    "timeline.header.preview": "プレビュー",
    "timeline.header.snap": "スナップ",
    "timeline.header.snapTitle":
      "スナップ{shortcut} ・ {modKey} を押しながらドラッグで一時解除",
    "timeline.header.importLyrics": "読み込む",
    "timeline.header.expandAll": "すべて展開",
    "timeline.header.expandGroups": "グループを展開",
    "timeline.header.collapseGroups": "グループを折りたたむ",
    "tour.done": "完了！",
    "tour.skip": "スキップ",
    "tour.next": "次へ",
    "tour.back": "戻る",
    "tour.welcome.title": "CallEditor へようこそ",
    "tour.welcome.description":
      "TTML 形式の同期コールを作るためのツールです。一緒に流れを見ていきましょう。",
    "tour.import.title": "音声を読み込む",
    "tour.import.description":
      "ここに YouTube URL を貼り付けると、動画から音声を取り込めます。",
    "tour.importGate.title": "音声を読み込んでください",
    "tour.importGate.description":
      "続けるには YouTube URL を貼り付けてください。",
    "tour.edit.title": "コールを入力または貼り付け",
    "tour.edit.description":
      "左のテキストエリアにコールを入れてください。各行が同期対象になります。",
    "tour.editGate.title": "コールを追加してください",
    "tour.editGate.description":
      "続けるには1行以上入力または貼り付けてください。",
    "tour.sync.title": "コールを同期する",
    "tour.sync.description":
      "開始を押して、各行や単語のタイミングで Space を押します。粒度切替で行単位・単語単位を選べます。",
    "tour.syncGate.title": "少なくとも1行同期してください",
    "tour.syncGate.description":
      "開始を押し、音声を再生してから Space でタイミングを打ってください。",
    "tour.timeline.title": "タイムラインで微調整",
    "tour.timeline.description":
      "単語をドラッグして調整し、矢印キーで微調整できます。{modKey}+スクロールでズーム、F で再生ヘッド追従を切り替えます。繰り返しは {modKey}+G でグループ化し、{modKey}+D でリンク複製できます。",
    "tour.preview.title": "仕上がりを確認",
    "tour.preview.description":
      "音声に合わせてコールが再生される様子を確認できます。行をクリックするとそこへ移動します。",
    "tour.export.title": "TTML を書き出す",
    "tour.export.description":
      "完成した TTML をコピーまたはダウンロードできます。JSON でプロジェクト全体の書き出しも可能です。",
    "tour.outro.title": "全体の流れを見る",
    "tour.outro.description": "これで準備完了です。全工程の動画はこちらです。",
    "tour.task.audio": "YouTube 動画を読み込む",
    "tour.task.lyrics": "コールを入力または貼り付け",
    "tour.task.sync": "少なくとも1行同期",
    "tour.stepLabel": "ステップ {current} / {total}",
    "help.title": "ヘルプ",
    "help.openAnytime": "{shortcut} でいつでも開けます",
    "help.section.gettingStarted": "はじめに",
    "help.section.keyboardShortcuts": "キーボードショートカット",
    "help.section.importing": "音声の読み込み",
    "help.section.editing": "コール編集",
    "help.section.syncing": "同期",
    "help.section.timeline": "タイムライン",
    "help.section.groups": "リンクグループ",
    "help.section.preview": "プレビュー",
    "help.section.exporting": "書き出し",
    "help.section.recovery": "復旧",
    "help.section.ttml": "TTML と標準",
    "help.section.about": "このアプリについて",
    "shortcuts.section.general": "一般",
    "shortcuts.section.navigation": "移動",
    "shortcuts.section.sync": "同期モード",
    "shortcuts.section.timeline": "タイムラインモード",
    "shortcuts.section.timelineSelection": "タイムライン選択",
    "shortcuts.section.linkedGroups": "リンクグループ",
    "shortcuts.section.editMode": "編集モード",
    "shortcuts.showHelp": "キーボードショートカットを表示",
    "shortcuts.playPause": "音声を再生 / 一時停止",
    "shortcuts.downloadSavedWork": "保存済み作業をダウンロード",
    "shortcuts.goImport": "読み込みタブへ移動",
    "shortcuts.goEdit": "編集タブへ移動",
    "shortcuts.goSync": "同期タブへ移動",
    "shortcuts.goTimeline": "タイムラインタブへ移動",
    "shortcuts.goPreview": "プレビュータブへ移動",
    "shortcuts.goExport": "書き出しタブへ移動",
    "shortcuts.startSync": "同期開始 / 単語同期をタップ",
    "shortcuts.holdSync": "押し続けて単語同期",
    "shortcuts.nudgeLastLeft": "最後の同期を -50ms",
    "shortcuts.nudgeLastRight": "最後の同期を +50ms",
    "shortcuts.undo": "元に戻す",
    "shortcuts.redo": "やり直す",
    "shortcuts.toggleFollow": "再生ヘッド追従を切替",
    "shortcuts.togglePreview": "プレビューサイドバー切替",
    "shortcuts.toggleRolling": "ローリング編集切替",
    "shortcuts.toggleSnap": "スナップ切替",
    "shortcuts.insertBelow": "選択単語の下に行を追加",
    "shortcuts.insertAbove": "選択単語の上に行を追加",
    "shortcuts.expandAll": "すべての行を展開",
    "shortcuts.jumpToPlayhead": "表示を再生ヘッドへ移動",
    "shortcuts.deselectCancel": "選択解除 / 貼り付けキャンセル",
    "shortcuts.setWordBegin": "単語開始を再生ヘッドに設定",
    "shortcuts.setWordEnd": "単語終了を再生ヘッドに設定",
    "shortcuts.importLyrics": "コールを読み込む",
    "shortcuts.zoomInOut": "ズームイン / アウト",
    "shortcuts.panTimeline": "タイムラインをパン",
    "shortcuts.panLocked": "軸固定でパン",
    "shortcuts.selectWord": "単語を選択",
    "shortcuts.selectAllSyllables": "単語内の全音節を選択",
    "shortcuts.selectAllWords": "全単語を選択",
    "shortcuts.selectWordAtPlayhead": "再生ヘッド下の単語を選択",
    "shortcuts.toggleWordSelection": "選択内の単語を切替",
    "shortcuts.marqueeSelect": "ドラッグ選択",
    "shortcuts.addMarqueeSelection": "ドラッグで選択追加",
    "shortcuts.copySelectedWords": "選択単語をコピー",
    "shortcuts.cutSelectedWords": "選択単語を切り取り",
    "shortcuts.pasteGhost": "貼り付け（ゴースト表示後に配置）",
    "shortcuts.deleteSelectedWords": "選択単語を削除",
    "shortcuts.duplicateSelectedWords": "選択単語を複製",
    "shortcuts.editSelectedWord": "選択単語テキストを編集",
    "shortcuts.splitSyllables": "選択単語を音節分割",
    "shortcuts.splitWords": "単語を複数単語へ分割",
    "shortcuts.mergeWords": "隣接単語を結合",
    "shortcuts.mergeSyllables": "音節を1単語に結合",
    "shortcuts.splitLineIntoWords": "行を単語へ分割",
    "shortcuts.toggleExplicit": "Explicit の切替",
    "shortcuts.nudgeSelectedLeft": "選択単語を左へ微調整",
    "shortcuts.nudgeSelectedRight": "選択単語を右へ微調整",
    "shortcuts.doubleClickEdit": "単語編集 / 単語作成",
    "shortcuts.groupSelectedLines": "選択行をグループ化",
    "shortcuts.duplicateLinked": "リンクインスタンスとして複製",
    "shortcuts.collapseInstance": "現在のインスタンスを折りたたみ / 展開",
    "shortcuts.collapseAll": "すべて折りたたみ / 展開",
    "shortcuts.jumpPrevInstance": "前のインスタンスへ移動",
    "shortcuts.jumpNextInstance": "次のインスタンスへ移動",
    "shortcuts.pingSiblings": "兄弟インスタンスをハイライト",
    "shortcuts.shiftInstanceToPlayhead": "現在のインスタンスを再生ヘッドへ移動",
    "shortcuts.jumpInstanceStart": "現在のインスタンス開始へ移動",
    "shortcuts.nudgeInstanceEarlier": "選択単語 / インスタンスを前へ微調整",
    "shortcuts.nudgeInstanceLater": "選択単語 / インスタンスを後ろへ微調整",
    "shortcuts.detachInstance": "現在のインスタンスを切り離す",
    "shortcuts.deleteGroup": "現在のグループを削除",
    "shortcuts.selectDeselectLine": "行を選択 / 解除",
    "shortcuts.selectLineRange": "行範囲を選択",
    "shortcuts.dragSelectLines": "行番号ドラッグで範囲選択",
    "shortcutsSettings.general": "一般",
    "shortcutsSettings.sync": "同期モード",
    "shortcutsSettings.timeline": "タイムラインモード",
    "shortcutsSettings.resetTitle":
      "すべてのショートカットをリセットしますか？",
    "shortcutsSettings.resetDescription":
      "すべてのカスタムキーバインドを消去し、初期値に戻します。",
    "shortcutsSettings.resetConfirm": "リセット",
    "shortcutsSettings.searchPlaceholder": "ショートカットを検索",
    "shortcutsSettings.clearSearch": "検索をクリア",
    "shortcutsSettings.noMatch":
      '"{query}" に一致するショートカットはありません。',
    "shortcutsSettings.resetAllLabel": "すべてのショートカットをリセット",
    "shortcutsSettings.resetAllDescription":
      "すべてのキーボードショートカットを初期値に戻します。",
    "shortcutsSettings.resetAllAction": "すべてリセット",
    "shortcut.reset": "リセット",
    "shortcut.unbound": "未設定",
    "shortcut.rebindTitle": "ショートカットを再設定",
    "shortcut.pressNew": "新しいキーの組み合わせを押してください",
    "shortcut.pressEscape": "Escape でキャンセル",
    "shortcut.browserTitle": "ブラウザ予約ショートカット",
    "shortcut.browserReserved": "はブラウザに予約されている可能性があります。",
    "shortcut.browserDescription":
      "この組み合わせはアプリより先にブラウザで処理される場合があります。それでも割り当てできますが、ブラウザによっては動作しないことがあります。",
    "shortcut.cancel": "キャンセル",
    "shortcut.assignAnyway": "それでも割り当てる",
    "shortcut.conflictTitle": "ショートカットの競合",
    "shortcut.conflictUsedBy": "はすでに次で使われています:",
    "shortcut.conflictReplaceDescription":
      "置き換えると競合しているショートカットは初期値に戻ります。",
    "shortcut.replace": "置き換える",
  },
  ko: {
    "settings.title": "설정",
    "settings.savedAutomatically": "설정은 자동으로 저장됩니다",
    "settings.section.general": "일반",
    "settings.section.playback": "재생",
    "settings.section.timeline": "타임라인",
    "settings.section.sync": "싱크 및 타이밍",
    "settings.section.shortcuts": "단축키",
    "settings.section.confirmations": "확인",
    "settings.section.storage": "저장 및 스토리지",
    "settings.section.advanced": "고급",
    "settings.advanced.previewRenderer.label": "미리보기 렌더러",
    "settings.advanced.previewRenderer.description":
      "미리보기 탭에서 싱크 콜을 렌더링하는 엔진을 선택합니다.",
    "settings.advanced.previewRenderer.braccato": "Braccato (기본값)",
    "settings.language.label": "언어",
    "settings.language.description":
      "앱 표시 언어를 직접 선택하거나 CallEditor가 자동으로 감지하도록 둘 수 있습니다.",
    "settings.language.autoInfo": "현재 자동 감지 언어: {language}",
    "settings.language.option.auto": "자동",
    "settings.language.option.en": "English",
    "settings.language.option.ja": "日本語",
    "settings.language.option.ko": "한국어",
    "settings.showShortcutHints.label": "단축키 힌트 표시",
    "settings.showShortcutHints.description":
      "툴바 버튼에 키보드 단축키 배지를 표시합니다.",
    "settings.showSyllableIndicators.label": "음절 표시기 보기",
    "settings.showSyllableIndicators.description":
      "하나의 단어에서 분리된 음절을 시각적으로 묶어 보여줍니다.",
    "settings.splitCharacter.label": "분할 문자",
    "settings.splitCharacter.description":
      "편집 보기에서 음절 경계를 표시하는 데 사용하는 문자입니다",
    "settings.splitCharacter.reset": "재설정",
    "settings.splitCharacter.modalTitle": "분할 문자 변경",
    "settings.splitCharacter.modalPrompt":
      "음절 분할 표시에 사용할 문자를 누르세요",
    "settings.splitCharacter.modalEscape": "Escape로 취소",
    "settings.splitCharacter.modalAdvice":
      "콜에 쓰지 않을 기호를 고르세요. 쉼표, 아포스트로피, 하이픈 같은 문자는 콜에 자주 나타나 의도치 않은 분할을 만들 수 있습니다.",
    "settings.splitCharacter.errorBlocked":
      "문자, 숫자, 공백 문자는 사용할 수 없습니다",
    "settings.splitCharacter.warningTitle": "문자 경고",
    "settings.splitCharacter.warningCommon": "는 콜에 자주 등장하는 문자입니다.",
    "settings.splitCharacter.warningDescription":
      "이 문자를 분할 표시에 사용하면 텍스트에 나오는 모든 위치가 음절 경계로 처리됩니다.",
    "settings.splitCharacter.warningCancel": "취소",
    "settings.splitCharacter.warningConfirm": "그래도 사용",
    "settings.resetTour.label": "프로덕트 투어 초기화",
    "settings.resetTour.description":
      "CallEditor 기능 소개 가이드를 처음부터 다시 시작합니다.",
    "settings.resetTour.action": "투어 초기화",
    "settings.resetDefaults.label": "기본값으로 복원",
    "settings.resetDefaults.description": "모든 설정을 원래 값으로 되돌립니다.",
    "settings.resetDefaults.action": "전체 초기화",
    "settings.confirmReset.title": "모든 설정을 초기화할까요?",
    "settings.confirmReset.description":
      "모든 설정을 기본값으로 되돌립니다. 프로젝트 데이터는 유지됩니다.",
    "settings.confirmReset.confirm": "초기화",
    "settings.playback.defaultRate.label": "기본 재생 속도",
    "settings.playback.defaultRate.description":
      "오디오를 불러왔을 때 시작 재생 속도입니다.",
    "settings.useCurrent": "현재 값 사용",
    "settings.playback.rememberVolume.label": "볼륨 기억",
    "settings.playback.rememberVolume.description":
      "세션이 바뀌어도 볼륨 수준을 유지합니다.",
    "settings.timeline.defaultZoom.label": "기본 줌",
    "settings.timeline.defaultZoom.description":
      "타임라인을 열 때의 초기 줌 수준(px/초)입니다.",
    "settings.timeline.defaultRowHeight.label": "기본 행 높이",
    "settings.timeline.defaultRowHeight.description":
      "타임라인 각 콜 행의 시작 높이입니다.",
    "settings.timeline.snap.label": "스냅 (자석)",
    "settings.timeline.snap.description":
      "드래그하거나 크기를 조절할 때 단어 경계가 가까운 앵커에 붙습니다.",
    "settings.timeline.snapThreshold.label": "스냅 임계값",
    "settings.timeline.snapThreshold.description":
      "이동 중인 블록이 앵커에 붙는 거리(픽셀)입니다.",
    "settings.timeline.follow.label": "재생 헤드 따라가기",
    "settings.timeline.follow.description":
      "재생 헤드가 보이도록 타임라인을 자동 스크롤합니다.",
    "settings.timeline.horizontalScroll.label": "휠로 타임라인 스크롤",
    "settings.timeline.horizontalScroll.description":
      "일반 스크롤은 가로 이동, Shift는 세로 스크롤입니다.",
    "settings.sync.nudgeAmount.label": "미세 조정량",
    "settings.sync.nudgeAmount.description":
      "미세 조정 컨트롤 사용 시 타이밍이 이동하는 폭입니다.",
    "settings.sync.defaultWordDuration.label": "기본 단어 길이",
    "settings.sync.defaultWordDuration.description":
      "타임라인에서 새로 만든 단어에 할당되는 길이입니다.",
    "settings.sync.minWordDuration.label": "최소 단어 길이",
    "settings.sync.minWordDuration.description":
      "단어에 허용되는 최소 길이입니다.",
    "settings.sync.defaultGranularity.label": "기본 단위",
    "settings.sync.defaultGranularity.description":
      "새 프로젝트를 단어 타이밍 또는 줄 타이밍 중 어느 모드로 시작할지 정합니다.",
    "settings.sync.granularity.word": "단어",
    "settings.sync.granularity.line": "줄",
    "settings.storage.autoSaveDelay.label": "자동 저장 지연",
    "settings.storage.autoSaveDelay.description":
      "마지막 편집 후 자동 저장까지 기다리는 시간입니다.",
    "settings.confirmations.title": "확인 메시지",
    "settings.confirmations.description":
      "작업 손실 가능성이 있는 동작의 확인 메시지를 켜거나 끕니다. 여기서 다시 켜기 전까지 해당 경고를 건너뜁니다.",
    "settings.confirmations.replaceProject.label": "URL 프로젝트 교체 확인",
    "settings.confirmations.replaceProject.description":
      "가져오기 URL이 현재 프로젝트를 교체할 때 경고를 표시합니다.",
    "settings.confirmations.replaceLyrics.label": "콜 가져오기 교체 확인",
    "settings.confirmations.replaceLyrics.description":
      "이미 줄이 있는 프로젝트에 콜을 가져올 때 경고를 표시합니다.",
    "settings.confirmations.resetSync.label": "싱크 타이밍 초기화 확인",
    "settings.confirmations.resetSync.description":
      "싱크 화면의 모든 단어/줄 타이밍을 지우기 전에 경고를 표시합니다.",
    "settings.confirmations.clearProject.label": "프로젝트 삭제 확인",
    "settings.confirmations.clearProject.description":
      "현재 프로젝트, 메타데이터, 오디오 파일을 버리기 전에 경고를 표시합니다.",
    "settings.confirmations.resetSettings.label": "전체 설정 초기화 확인",
    "settings.confirmations.resetSettings.description":
      "모든 설정을 기본값으로 복원하기 전에 경고를 표시합니다.",
    "settings.confirmations.resetShortcuts.label": "전체 단축키 초기화 확인",
    "settings.confirmations.resetShortcuts.description":
      "사용자 지정 키 바인딩을 모두 지우기 전에 경고를 표시합니다.",
    "header.settings": "설정",
    "header.productTour": "프로덕트 투어",
    "header.keyboardShortcuts": "키보드 단축키 (?)",
    "tab.import": "가져오기",
    "tab.edit": "편집",
    "tab.sync": "싱크",
    "tab.timeline": "타임라인",
    "tab.preview": "미리보기",
    "tab.export": "내보내기",
    "tab.mobileLabel": "섹션 열기",
    "action.more": "더보기",
    "import.or": "또는",
    "import.replaceFile": "다른 파일을 드롭해 교체",
    "import.replaceYoutube": "다른 YouTube URL 불러오기",
    "import.youtubeDownloading": "YouTube에서 다운로드 중",
    "import.youtubeFrom": "YouTube에서",
    "import.dropTitle": "YouTube에서 오디오 불러오기",
    "import.dropHint": "아래에 YouTube URL 또는 동영상 ID를 붙여 넣으세요",
    "import.supportsFormats": "YouTube URL만 지원",
    "youtube.placeholder": "YouTube URL 또는 동영상 ID 붙여넣기",
    "youtube.invalid": "유효한 YouTube URL 또는 ID가 아닌 것 같습니다",
    "youtube.loading": "불러오는 중",
    "youtube.load": "불러오기",
    "edit.title": "콜 편집기",
    "edit.importFile": "파일 가져오기",
    "edit.pasteLyrics": "콜 붙여넣기 또는 입력",
    "edit.insertOshi": "최애 문자열",
    "edit.placeholder":
      "여기에 콜을 한 줄씩 붙여넣으세요...\n\n또는 콜 파일(.txt, .lrc, .srt, .ttml)을 드래그 앤 드롭하세요",
    "edit.preview": "미리보기",
    "edit.assignAgent": "에이전트 지정",
    "edit.clear": "지우기",
    "edit.previewEmpty": "여기에 콜이 표시됩니다",
    "preview.title": "미리보기",
    "preview.play": "재생",
    "preview.pause": "일시정지",
    "preview.empty.noAudio": "불러온 오디오가 없습니다",
    "preview.empty.noAudioHint":
      "먼저 가져오기 탭에서 YouTube 영상을 불러오세요",
    "preview.empty.noLyrics": "미리볼 콜이 없습니다",
    "preview.empty.noLyricsHint": "먼저 편집 탭에서 콜을 추가하세요",
    "preview.empty.noSynced": "싱크된 내용이 없습니다",
    "preview.empty.noSyncedHint": "먼저 싱크 탭에서 콜을 맞추세요",
    "export.title": "내보내기",
    "export.edited": "편집됨",
    "export.regenerate": "재생성",
    "export.done": "완료",
    "export.edit": "편집",
    "export.copied": "복사됨",
    "export.copy": "복사",
    "export.download": "TTML 다운로드",
    "export.project": "프로젝트",
    "export.importProject": "프로젝트 가져오기",
    "export.exportProject": "프로젝트 내보내기",
    "export.clear": "지우기",
    "export.empty.noLyrics": "내보낼 콜이 없습니다",
    "export.empty.noLyricsHint": "먼저 편집 탭에서 콜을 추가하세요",
    "export.empty.noSynced": "싱크된 내용이 없습니다",
    "export.empty.noSyncedHint": "먼저 싱크 탭에서 콜을 맞추세요",
    "export.confirmReplace.title": "현재 프로젝트를 교체할까요?",
    "export.confirmReplace.confirm": "교체",
    "export.confirmClear.title": "프로젝트 데이터를 모두 지울까요?",
    "export.confirmClear.description":
      "이 프로젝트의 모든 줄, 메타데이터, 오디오 파일을 제거합니다. 되돌릴 수 없습니다.",
    "export.confirmClear.confirm": "지우기",
    "sync.title": "싱크",
    "sync.line": "줄",
    "sync.word": "단어",
    "sync.lock": "편집 모드로 잠금",
    "sync.unlock": "싱크 모드 잠금 해제",
    "sync.reset": "초기화",
    "sync.start": "시작",
    "sync.edit": "편집",
    "sync.complete": "싱크 완료!",
    "sync.completeHint": "미리보기 탭에서 결과를 확인하세요",
    "sync.pausedHint":
      "일시정지 중입니다. 줄을 탭해 이동하거나 재생해서 계속하세요",
    "sync.mobile.label": "터치 조작",
    "sync.mobile.hint":
      "길게 눌러 현재 단어를 늘리고, 탭으로 타이밍을 찍거나 길게 누른 상태에서 다음 단어로 넘어가세요.",
    "sync.mobile.hold": "길게 누르기",
    "sync.mobile.release": "놓기",
    "sync.mobile.tap": "탭",
    "sync.empty.noAudio": "불러온 오디오가 없습니다",
    "sync.empty.noAudioHint": "먼저 가져오기 탭에서 YouTube 영상을 불러오세요",
    "sync.empty.noLyrics": "싱크할 콜이 없습니다",
    "sync.empty.noLyricsHint": "먼저 편집 탭에서 콜을 추가하세요",
    "timeline.header.title": "타임라인",
    "timeline.header.follow": "따라가기",
    "timeline.header.rolling": "롤링",
    "timeline.header.rollingTitle":
      "롤링 편집: 인접 단어의 공유 경계를 드래그하면 두 단어가 함께 움직입니다",
    "timeline.header.preview": "미리보기",
    "timeline.header.snap": "스냅",
    "timeline.header.snapTitle":
      "스냅{shortcut} · {modKey}를 누른 채 드래그하면 일시 해제",
    "timeline.header.importLyrics": "불러오기",
    "timeline.header.expandAll": "모두 펼치기",
    "timeline.header.expandGroups": "그룹 펼치기",
    "timeline.header.collapseGroups": "그룹 접기",
    "tour.done": "완료!",
    "tour.skip": "건너뛰기",
    "tour.next": "다음",
    "tour.back": "뒤로",
    "tour.welcome.title": "CallEditor에 오신 것을 환영합니다",
    "tour.welcome.description":
      "TTML 형식의 싱크 콜을 만드는 도구입니다. 함께 작업 흐름을 둘러볼게요.",
    "tour.import.title": "오디오 불러오기",
    "tour.import.description":
      "여기에 YouTube URL을 붙여 넣으면 영상에서 오디오를 가져올 수 있습니다.",
    "tour.importGate.title": "오디오를 불러오세요",
    "tour.importGate.description": "계속하려면 YouTube URL을 붙여 넣으세요.",
    "tour.edit.title": "콜 입력 또는 붙여넣기",
    "tour.edit.description":
      "왼쪽 텍스트 영역에 콜을 입력하세요. 각 줄이 싱크 대상이 됩니다.",
    "tour.editGate.title": "콜을 추가하세요",
    "tour.editGate.description":
      "계속하려면 한 줄 이상 입력하거나 붙여 넣으세요.",
    "tour.sync.title": "콜 싱크 맞추기",
    "tour.sync.description":
      "시작을 누른 뒤 각 줄이나 단어 타이밍에 맞춰 Space를 누르세요. 줄/단어 정밀도는 단위 토글로 바꿀 수 있습니다.",
    "tour.syncGate.title": "최소 한 줄은 싱크하세요",
    "tour.syncGate.description":
      "시작을 누르고 오디오를 재생한 다음 Space로 타이밍을 찍으세요.",
    "tour.timeline.title": "타임라인에서 미세 조정",
    "tour.timeline.description":
      "단어를 드래그하거나 화살표 키로 미세 조정하세요. {modKey}+스크롤로 확대/축소하고 F로 재생 헤드 따라가기를 전환할 수 있습니다. 반복 구간은 {modKey}+G로 그룹화하고 {modKey}+D로 링크 인스턴스를 복제하세요.",
    "tour.preview.title": "작업 미리보기",
    "tour.preview.description":
      "오디오와 함께 콜이 싱크되어 재생되는 모습을 확인하세요. 아무 줄이나 클릭하면 그 위치로 이동합니다.",
    "tour.export.title": "TTML 내보내기",
    "tour.export.description":
      "완성된 TTML 파일을 복사하거나 다운로드할 수 있습니다. 전체 프로젝트를 JSON으로 내보내는 것도 가능합니다.",
    "tour.outro.title": "전체 워크스루 보기",
    "tour.outro.description":
      "이제 준비가 끝났습니다. 전체 과정을 보여주는 영상입니다.",
    "tour.task.audio": "YouTube 영상 불러오기",
    "tour.task.lyrics": "콜 입력 또는 붙여넣기",
    "tour.task.sync": "최소 한 줄 싱크",
    "tour.stepLabel": "단계 {current} / {total}",
    "help.title": "도움말",
    "help.openAnytime": "{shortcut} 로 언제든 열 수 있습니다",
    "help.section.gettingStarted": "시작하기",
    "help.section.keyboardShortcuts": "키보드 단축키",
    "help.section.importing": "오디오 가져오기",
    "help.section.editing": "콜 편집",
    "help.section.syncing": "싱크",
    "help.section.timeline": "타임라인",
    "help.section.groups": "링크 그룹",
    "help.section.preview": "미리보기",
    "help.section.exporting": "내보내기",
    "help.section.recovery": "복구",
    "help.section.ttml": "TTML 및 표준",
    "help.section.about": "정보",
    "shortcuts.section.general": "일반",
    "shortcuts.section.navigation": "이동",
    "shortcuts.section.sync": "싱크 모드",
    "shortcuts.section.timeline": "타임라인 모드",
    "shortcuts.section.timelineSelection": "타임라인 선택",
    "shortcuts.section.linkedGroups": "링크 그룹",
    "shortcuts.section.editMode": "편집 모드",
    "shortcuts.showHelp": "키보드 단축키 보기",
    "shortcuts.playPause": "오디오 재생 / 일시정지",
    "shortcuts.downloadSavedWork": "저장된 작업 다운로드",
    "shortcuts.goImport": "가져오기 탭으로 이동",
    "shortcuts.goEdit": "편집 탭으로 이동",
    "shortcuts.goSync": "싱크 탭으로 이동",
    "shortcuts.goTimeline": "타임라인 탭으로 이동",
    "shortcuts.goPreview": "미리보기 탭으로 이동",
    "shortcuts.goExport": "내보내기 탭으로 이동",
    "shortcuts.startSync": "싱크 시작 / 단어 싱크 탭",
    "shortcuts.holdSync": "눌러서 단어 싱크",
    "shortcuts.nudgeLastLeft": "마지막 싱크 -50ms",
    "shortcuts.nudgeLastRight": "마지막 싱크 +50ms",
    "shortcuts.undo": "실행 취소",
    "shortcuts.redo": "다시 실행",
    "shortcuts.toggleFollow": "재생 헤드 따라가기 전환",
    "shortcuts.togglePreview": "미리보기 사이드바 전환",
    "shortcuts.toggleRolling": "롤링 편집 전환",
    "shortcuts.toggleSnap": "스냅 전환",
    "shortcuts.insertBelow": "선택 단어 아래에 줄 삽입",
    "shortcuts.insertAbove": "선택 단어 위에 줄 삽입",
    "shortcuts.expandAll": "모든 줄 펼치기",
    "shortcuts.jumpToPlayhead": "뷰포트를 재생 헤드로 이동",
    "shortcuts.deselectCancel": "선택 해제 / 붙여넣기 취소",
    "shortcuts.setWordBegin": "단어 시작을 재생 헤드로 설정",
    "shortcuts.setWordEnd": "단어 끝을 재생 헤드로 설정",
    "shortcuts.importLyrics": "콜 가져오기",
    "shortcuts.zoomInOut": "확대 / 축소",
    "shortcuts.panTimeline": "타임라인 이동",
    "shortcuts.panLocked": "축 고정 이동",
    "shortcuts.selectWord": "단어 선택",
    "shortcuts.selectAllSyllables": "단어의 모든 음절 선택",
    "shortcuts.selectAllWords": "모든 단어 선택",
    "shortcuts.selectWordAtPlayhead": "재생 헤드 아래 단어 선택",
    "shortcuts.toggleWordSelection": "선택 내 단어 전환",
    "shortcuts.marqueeSelect": "영역 선택",
    "shortcuts.addMarqueeSelection": "영역 선택 추가",
    "shortcuts.copySelectedWords": "선택 단어 복사",
    "shortcuts.cutSelectedWords": "선택 단어 잘라내기",
    "shortcuts.pasteGhost": "붙여넣기(고스트 미리보기 후 배치)",
    "shortcuts.deleteSelectedWords": "선택 단어 삭제",
    "shortcuts.duplicateSelectedWords": "선택 단어 복제",
    "shortcuts.editSelectedWord": "선택 단어 텍스트 편집",
    "shortcuts.splitSyllables": "선택 단어를 음절로 분리",
    "shortcuts.splitWords": "단어를 여러 단어로 분리",
    "shortcuts.mergeWords": "인접 단어 병합",
    "shortcuts.mergeSyllables": "음절을 한 단어로 병합",
    "shortcuts.splitLineIntoWords": "줄을 단어로 분리",
    "shortcuts.toggleExplicit": "Explicit 표시 전환",
    "shortcuts.nudgeSelectedLeft": "선택 단어 왼쪽으로 미세 조정",
    "shortcuts.nudgeSelectedRight": "선택 단어 오른쪽으로 미세 조정",
    "shortcuts.doubleClickEdit": "단어 편집 / 단어 생성",
    "shortcuts.groupSelectedLines": "선택 줄 그룹화",
    "shortcuts.duplicateLinked": "링크 인스턴스로 복제",
    "shortcuts.collapseInstance": "현재 인스턴스 접기 / 펼치기",
    "shortcuts.collapseAll": "모두 접기 / 펼치기",
    "shortcuts.jumpPrevInstance": "이전 인스턴스로 이동",
    "shortcuts.jumpNextInstance": "다음 인스턴스로 이동",
    "shortcuts.pingSiblings": "형제 인스턴스 강조",
    "shortcuts.shiftInstanceToPlayhead": "현재 인스턴스를 재생 헤드로 이동",
    "shortcuts.jumpInstanceStart": "현재 인스턴스 시작으로 이동",
    "shortcuts.nudgeInstanceEarlier": "선택 단어 / 인스턴스를 앞으로 미세 조정",
    "shortcuts.nudgeInstanceLater": "선택 단어 / 인스턴스를 뒤로 미세 조정",
    "shortcuts.detachInstance": "현재 인스턴스 분리",
    "shortcuts.deleteGroup": "현재 그룹 삭제",
    "shortcuts.selectDeselectLine": "줄 선택 / 해제",
    "shortcuts.selectLineRange": "줄 범위 선택",
    "shortcuts.dragSelectLines": "줄 번호를 드래그해 범위 선택",
    "shortcutsSettings.general": "일반",
    "shortcutsSettings.sync": "싱크 모드",
    "shortcutsSettings.timeline": "타임라인 모드",
    "shortcutsSettings.resetTitle": "모든 단축키를 초기화할까요?",
    "shortcutsSettings.resetDescription":
      "모든 사용자 지정 키 바인딩을 지우고 기본값으로 복원합니다.",
    "shortcutsSettings.resetConfirm": "초기화",
    "shortcutsSettings.searchPlaceholder": "단축키 검색",
    "shortcutsSettings.clearSearch": "검색 지우기",
    "shortcutsSettings.noMatch": '"{query}" 와 일치하는 단축키가 없습니다.',
    "shortcutsSettings.resetAllLabel": "모든 단축키 초기화",
    "shortcutsSettings.resetAllDescription":
      "모든 키보드 단축키를 기본값으로 복원합니다.",
    "shortcutsSettings.resetAllAction": "전체 초기화",
    "shortcut.reset": "초기화",
    "shortcut.unbound": "미설정",
    "shortcut.rebindTitle": "단축키 다시 지정",
    "shortcut.pressNew": "새 키 조합을 누르세요",
    "shortcut.pressEscape": "Escape로 취소",
    "shortcut.browserTitle": "브라우저 단축키",
    "shortcut.browserReserved": "는 브라우저에 예약되어 있을 수 있습니다.",
    "shortcut.browserDescription":
      "이 조합은 앱보다 먼저 브라우저에서 처리될 수 있습니다. 그래도 지정할 수 있지만, 모든 브라우저에서 동작하지 않을 수 있습니다.",
    "shortcut.cancel": "취소",
    "shortcut.assignAnyway": "그래도 지정",
    "shortcut.conflictTitle": "단축키 충돌",
    "shortcut.conflictUsedBy": "는 이미 다음에서 사용 중입니다:",
    "shortcut.conflictReplaceDescription":
      "교체하면 충돌하는 단축키는 기본값으로 재설정됩니다.",
    "shortcut.replace": "교체",
  },
};

function detectLanguageFromLyricsText(text: string): ResolvedLanguage | null {
  if (!text.trim()) return null;
  const japanese = (
    text.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/g) ?? []
  ).length;
  const korean = (
    text.match(/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/g) ?? []
  ).length;
  if (japanese === 0 && korean === 0) return null;
  return japanese >= korean ? "ja" : "ko";
}

function normalizeToSupportedLanguage(
  input: string | null | undefined,
): ResolvedLanguage | null {
  if (!input) return null;
  const value = input.toLowerCase();
  if (value.startsWith("ja")) return "ja";
  if (value.startsWith("ko")) return "ko";
  if (value.startsWith("en")) return "en";
  return null;
}

function resolveAppLanguage(
  preferredLanguage: AppLanguage,
  lyricsText: string,
  browserLanguages: readonly string[] = [],
): ResolvedLanguage {
  if (preferredLanguage !== "auto") return preferredLanguage;
  const lyricsLanguage = detectLanguageFromLyricsText(lyricsText);
  if (lyricsLanguage) return lyricsLanguage;
  for (const language of browserLanguages) {
    const supported = normalizeToSupportedLanguage(language);
    if (supported) return supported;
  }
  return "en";
}

function interpolate(template: string, vars?: Record<string, string>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

function getLanguageLabel(language: ResolvedLanguage): string {
  return DICTIONARIES.en[`settings.language.option.${language}`];
}

function useAppLanguage() {
  const preferredLanguage = useSettingsStore((s) => s.appLanguage);
  const lyricsText = useProjectStore((s) =>
    s.lines
      .flatMap((line) => [line.text, line.backgroundText ?? ""])
      .join("\n"),
  );

  const browserLanguages =
    typeof navigator === "undefined"
      ? []
      : navigator.languages?.length
        ? navigator.languages
        : [navigator.language];

  const language = resolveAppLanguage(
    preferredLanguage,
    lyricsText,
    browserLanguages,
  );
  const dictionary = DICTIONARIES[language];

  function t(key: TranslationKey, vars?: Record<string, string>) {
    return interpolate(dictionary[key], vars);
  }

  return { language, preferredLanguage, t };
}

export { getLanguageLabel, resolveAppLanguage, useAppLanguage };
export type { ResolvedLanguage, TranslationKey };
