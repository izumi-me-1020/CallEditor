import type { DriveStep } from "driver.js";
import { resolveAppLanguage } from "@/lib/i18n";
import { useAudioStore } from "@/stores/audio";
import { useProjectStore } from "@/stores/project";
import { useSettingsStore } from "@/stores/settings";
import { MOD_KEY } from "@/utils/platform";

// -- Types --------------------------------------------------------------------

interface GatedStep {
  stepIndex: number;
  task: string;
  gateCheck: () => boolean;
  tabId: string;
}

// -- Helpers ------------------------------------------------------------------

function switchTab(tabId: string) {
  useProjectStore
    .getState()
    .setActiveTab(
      tabId as "import" | "edit" | "sync" | "timeline" | "preview" | "export",
    );
}

const YOUTUBE_EMBED_HTML = `<div class="calleditor-tour-video-embed"><iframe src="https://www.youtube.com/embed/IEA0W4qpRIs?rel=0" title="CallEditor demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;

// -- Gate checks --------------------------------------------------------------

const gateAudioLoaded = () => useAudioStore.getState().source !== null;
const gateLyricsExist = () => useProjectStore.getState().lines.length > 0;
const gateFirstLineSynced = () => {
  const lines = useProjectStore.getState().lines;
  return lines.length > 0 && lines[0]?.begin !== undefined;
};

// -- Tour Steps ---------------------------------------------------------------

function getTourText() {
  const preferredLanguage = useSettingsStore.getState().appLanguage;
  const lyricsText = useProjectStore
    .getState()
    .lines.flatMap((line) => [line.text, line.backgroundText ?? ""])
    .join("\n");
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

  if (language === "ja") {
    return {
      welcomeTitle: "CallEditor へようこそ",
      welcomeDescription:
        "TTML 形式の同期歌詞を作るためのツールです。一緒に流れを見ていきましょう。",
      importTitle: "音声を読み込む",
      importDescription:
        "ここに YouTube URL を貼り付けると、動画から音声を取り込めます。",
      importGateTitle: "音声を読み込んでください",
      importGateDescription:
        "続けるには YouTube URL を貼り付けてください。",
      editTitle: "歌詞を入力または貼り付け",
      editDescription:
        "左のテキストエリアに歌詞を入れてください。各行が同期対象になります。",
      editGateTitle: "歌詞を追加してください",
      editGateDescription: "続けるには1行以上入力または貼り付けてください。",
      syncTitle: "歌詞を同期する",
      syncDescription:
        "開始を押して、各行や単語のタイミングで Space を押します。粒度切替で行単位・単語単位を選べます。",
      syncGateTitle: "少なくとも1行同期してください",
      syncGateDescription:
        "開始を押し、音声を再生してから Space でタイミングを打ってください。",
      timelineTitle: "タイムラインで微調整",
      timelineDescription: `単語をドラッグして調整し、矢印キーで微調整できます。${MOD_KEY}+スクロールでズーム、F で再生ヘッド追従を切り替えます。繰り返しは ${MOD_KEY}+G でグループ化し、${MOD_KEY}+D でリンク複製できます。`,
      previewTitle: "仕上がりを確認",
      previewDescription:
        "音声に合わせて歌詞が再生される様子を確認できます。行をクリックするとそこへ移動します。",
      exportTitle: "TTML を書き出す",
      exportDescription:
        "完成した TTML をコピーまたはダウンロードできます。JSON でプロジェクト全体の書き出しも可能です。",
      outroTitle: "全体の流れを見る",
      outroDescription: `これで準備完了です。全工程の動画はこちらです。${YOUTUBE_EMBED_HTML}`,
      taskAudio: "YouTube 動画を読み込む",
      taskLyrics: "歌詞を入力または貼り付け",
      taskSync: "少なくとも1行同期",
      done: "完了",
    };
  }

  if (language === "ko") {
    return {
      welcomeTitle: "CallEditor에 오신 것을 환영합니다",
      welcomeDescription:
        "TTML 형식의 싱크 가사를 만드는 도구입니다. 함께 작업 흐름을 둘러볼게요.",
      importTitle: "오디오 불러오기",
      importDescription:
        "여기에 YouTube URL을 붙여 넣으면 영상에서 오디오를 가져올 수 있습니다.",
      importGateTitle: "오디오를 불러오세요",
      importGateDescription:
        "계속하려면 YouTube URL을 붙여 넣으세요.",
      editTitle: "가사 입력 또는 붙여넣기",
      editDescription:
        "왼쪽 텍스트 영역에 가사를 입력하세요. 각 줄이 싱크 대상이 됩니다.",
      editGateTitle: "가사를 추가하세요",
      editGateDescription: "계속하려면 한 줄 이상 입력하거나 붙여 넣으세요.",
      syncTitle: "가사 싱크 맞추기",
      syncDescription:
        "시작을 누른 뒤 각 줄이나 단어 타이밍에 맞춰 Space를 누르세요. 줄/단어 정밀도는 단위 토글로 바꿀 수 있습니다.",
      syncGateTitle: "최소 한 줄은 싱크하세요",
      syncGateDescription:
        "시작을 누르고 오디오를 재생한 다음 Space로 타이밍을 찍으세요.",
      timelineTitle: "타임라인에서 미세 조정",
      timelineDescription: `단어를 드래그하거나 화살표 키로 미세 조정하세요. ${MOD_KEY}+스크롤로 확대/축소하고 F로 재생 헤드 따라가기를 전환할 수 있습니다. 반복 구간은 ${MOD_KEY}+G로 그룹화하고 ${MOD_KEY}+D로 링크 인스턴스를 복제하세요.`,
      previewTitle: "작업 미리보기",
      previewDescription:
        "오디오와 함께 가사가 싱크되어 재생되는 모습을 확인하세요. 아무 줄이나 클릭하면 그 위치로 이동합니다.",
      exportTitle: "TTML 내보내기",
      exportDescription:
        "완성된 TTML 파일을 복사하거나 다운로드할 수 있습니다. 전체 프로젝트를 JSON으로 내보내는 것도 가능합니다.",
      outroTitle: "전체 워크스루 보기",
      outroDescription: `이제 준비가 끝났습니다. 전체 과정을 보여주는 영상입니다.${YOUTUBE_EMBED_HTML}`,
      taskAudio: "YouTube 영상 불러오기",
      taskLyrics: "가사 입력 또는 붙여넣기",
      taskSync: "최소 한 줄 싱크",
      done: "완료",
    };
  }

  return {
    welcomeTitle: "Welcome to CallEditor",
    welcomeDescription:
      "A tool for creating synchronized lyrics in TTML format. Let's walk through the workflow together.",
    importTitle: "Bring in your audio",
    importDescription:
      "Paste a YouTube URL here to pull audio straight from a video.",
    importGateTitle: "Import your audio",
    importGateDescription:
      "Paste a YouTube URL to continue.",
    editTitle: "Type or paste lyrics",
    editDescription:
      "Enter your lyrics in the text area on the left. Each line becomes a sync target.",
    editGateTitle: "Add your lyrics",
    editGateDescription: "Type or paste at least one line to continue.",
    syncTitle: "Sync your lyrics",
    syncDescription:
      "Press Start, then tap Space in time with each line or word. Use the granularity toggle for line vs word precision.",
    syncGateTitle: "Sync at least one line",
    syncGateDescription:
      "Press Start, play the audio, then tap Space to set timing.",
    timelineTitle: "Fine-tune on the timeline",
    timelineDescription: `Drag words to adjust timing, or select words and nudge them with the arrow keys. ${MOD_KEY} + scroll to zoom, F to toggle playhead follow. Group repeating sections with ${MOD_KEY}+G, then duplicate them as linked instances with ${MOD_KEY}+D so edits propagate everywhere.`,
    previewTitle: "Preview your work",
    previewDescription:
      "Watch lyrics play back in sync with the audio. Click any line to jump there.",
    exportTitle: "Export your TTML",
    exportDescription:
      "Copy or download the finished TTML file. You can also export the full project as JSON.",
    outroTitle: "See a full walkthrough",
    outroDescription: `You're all set! Here's a video of the full process.${YOUTUBE_EMBED_HTML}`,
    taskAudio: "Load a YouTube video",
    taskLyrics: "Type or paste lyrics",
    taskSync: "Sync at least one line",
    done: "Done",
  };
}

function createTourSteps(): DriveStep[] {
  const text = getTourText();
  return [
    // 0: Welcome
    {
      popover: {
        title: text.welcomeTitle,
        description: text.welcomeDescription,
        popoverClass: "calleditor-tour calleditor-tour-modal",
        showButtons: ["next", "close"],
        showProgress: false,
      },
    },
    // 1: Import tab
    {
      element: () =>
        document.querySelector('[data-tour="import-dropzone"]') as Element,
      popover: {
        title: text.importTitle,
        description: text.importDescription,
        side: "bottom",
        align: "center",
      },
      onHighlightStarted: () => switchTab("import"),
    },
    // 2: GATED - wait for audio
    {
      element: () =>
        document.querySelector('[data-tour="import-dropzone"]') as Element,
      popover: {
        title: text.importGateTitle,
        description: text.importGateDescription,
        showButtons: [],
      },
      onHighlightStarted: () => switchTab("import"),
    },
    // 3: Edit tab
    {
      element: () =>
        document.querySelector('[data-tour="edit-panel"]') as Element,
      popover: {
        title: text.editTitle,
        description: text.editDescription,
        side: "right",
        align: "start",
      },
      onHighlightStarted: () => switchTab("edit"),
    },
    // 4: GATED - wait for lyrics
    {
      element: () =>
        document.querySelector('[data-tour="edit-panel"]') as Element,
      popover: {
        title: text.editGateTitle,
        description: text.editGateDescription,
        showButtons: [],
      },
      onHighlightStarted: () => switchTab("edit"),
    },
    // 5: Sync tab
    {
      element: () =>
        document.querySelector('[data-tour="sync-panel"]') as Element,
      popover: {
        title: text.syncTitle,
        description: text.syncDescription,
        side: "left",
        align: "start",
      },
      onHighlightStarted: () => switchTab("sync"),
    },
    // 6: GATED - wait for first line synced
    {
      element: () =>
        document.querySelector('[data-tour="sync-panel"]') as Element,
      popover: {
        title: text.syncGateTitle,
        description: text.syncGateDescription,
        showButtons: [],
      },
      onHighlightStarted: () => switchTab("sync"),
    },
    // 7: Timeline tab
    {
      element: () =>
        document.querySelector('[data-tour="timeline-panel"]') as Element,
      popover: {
        title: text.timelineTitle,
        description: text.timelineDescription,
        side: "top",
        align: "center",
      },
      onHighlightStarted: () => switchTab("timeline"),
    },
    // 8: Preview tab
    {
      element: () =>
        document.querySelector('[data-tour="preview-panel"]') as Element,
      popover: {
        title: text.previewTitle,
        description: text.previewDescription,
        side: "left",
        align: "start",
      },
      onHighlightStarted: () => switchTab("preview"),
    },
    // 9: Export tab
    {
      element: () =>
        document.querySelector('[data-tour="export-panel"]') as Element,
      popover: {
        title: text.exportTitle,
        description: text.exportDescription,
        side: "left",
        align: "start",
      },
      onHighlightStarted: () => switchTab("export"),
    },
    // 10: Outro with video
    {
      popover: {
        title: text.outroTitle,
        description: text.outroDescription,
        popoverClass: "calleditor-tour calleditor-tour-video",
        showButtons: ["previous", "close"],
        doneBtnText: text.done,
        showProgress: false,
      },
    },
  ];
}

// -- Gated Steps Config -------------------------------------------------------

const TOUR_GATED_STEPS: GatedStep[] = [
  {
    stepIndex: 2,
    task: getTourText().taskAudio,
    gateCheck: gateAudioLoaded,
    tabId: "import",
  },
  {
    stepIndex: 4,
    task: getTourText().taskLyrics,
    gateCheck: gateLyricsExist,
    tabId: "edit",
  },
  {
    stepIndex: 6,
    task: getTourText().taskSync,
    gateCheck: gateFirstLineSynced,
    tabId: "sync",
  },
];

// -- Exports ------------------------------------------------------------------

export { createTourSteps, TOUR_GATED_STEPS };
export type { GatedStep };
