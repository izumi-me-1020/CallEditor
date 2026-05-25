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

interface TourConfig {
  steps: DriveStep[];
  gatedSteps: GatedStep[];
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

function isMobileTourViewport(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(max-width: 767px)").matches;
}

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
        "TTML 形式の同期コールを作るためのツールです。一緒に流れを見ていきましょう。",
      importTitle: "音声を読み込む",
      importDescription:
        "ここに YouTube URL を貼り付けると、動画から音声を取り込めます。",
      importGateTitle: "音声を読み込んでください",
      importGateDescription:
        "続けるには YouTube URL を貼り付けてください。",
      sectionTitle: "セクションを切り替える",
      sectionDescription:
        "スマホでは右上の三本線から各セクションへ移動します。読み込みが終わったら、ここから編集へ進みます。",
      editTitle: "コールを入力または貼り付け",
      editDescription:
        "左のテキストエリアにコールを入れてください。各行が同期対象になります。Agents の横にある {oshi} ボタンで {oshi} を挿入でき、アプリ側では設定した推し名に置き換わります。",
      editGateTitle: "コールを追加してください",
      editGateDescription: "続けるには1行以上入力または貼り付けてください。",
      syncTitle: "コールを同期する",
      syncDescription:
        "開始を押して、各行や単語のタイミングで Space を押します。粒度切替で行単位・単語単位を選べます。",
      syncDescriptionMobile:
        "スマホでは下のタッチ操作を使います。Tap で現在の行や単語の開始タイミングを打ち、Hold は長押し中の長さをそのまま記録します。",
      syncGateTitle: "少なくとも1行同期してください",
      syncGateDescription:
        "開始を押し、音声を再生してから Space でタイミングを打ってください。",
      syncGateDescriptionMobile:
        "開始後、下の Tap ボタンで少なくとも1行のタイミングを打ってください。長さも取りたいときは Hold を長押しします。",
      timelineTitle: "タイムラインで微調整",
      timelineDescription: `単語をドラッグして調整し、矢印キーで微調整できます。${MOD_KEY}+スクロールでズーム、F で再生ヘッド追従を切り替えます。繰り返しは ${MOD_KEY}+G でグループ化し、${MOD_KEY}+D でリンク複製できます。`,
      timelineDescriptionMobile:
        "スマホではまずセクションメニューから Timeline を開きます。選択中の語句情報は下部バーに出るので、Set Begin / Set End で位置を合わせられます。",
      previewTitle: "仕上がりを確認",
      previewDescription:
        "音声に合わせてコールが再生される様子を確認できます。行をクリックするとそこへ移動します。",
      exportTitle: "TTML を書き出す",
      exportDescription:
        "完成した TTML をコピーまたはダウンロードできます。JSON でプロジェクト全体の書き出しも可能です。",
      outroTitle: "全体の流れを見る",
      outroDescription: `これで準備完了です。全工程の動画はこちらです。${YOUTUBE_EMBED_HTML}`,
      taskAudio: "YouTube 動画を読み込む",
      taskLyrics: "コールを入力または貼り付け",
      taskSync: "少なくとも1行同期",
      done: "完了",
    };
  }

  if (language === "ko") {
    return {
      welcomeTitle: "CallEditor에 오신 것을 환영합니다",
      welcomeDescription:
        "TTML 형식의 싱크 콜을 만드는 도구입니다. 함께 작업 흐름을 둘러볼게요.",
      importTitle: "오디오 불러오기",
      importDescription:
        "여기에 YouTube URL을 붙여 넣으면 영상에서 오디오를 가져올 수 있습니다.",
      importGateTitle: "오디오를 불러오세요",
      importGateDescription:
        "계속하려면 YouTube URL을 붙여 넣으세요.",
      sectionTitle: "섹션 전환",
      sectionDescription:
        "모바일에서는 오른쪽 위 메뉴로 각 섹션으로 이동합니다. 오디오를 불러온 뒤 여기서 편집으로 넘어가세요.",
      editTitle: "콜 입력 또는 붙여넣기",
      editDescription:
        "왼쪽 텍스트 영역에 콜을 입력하세요. 각 줄이 싱크 대상이 됩니다. Agents 옆의 {oshi} 버튼으로 {oshi}를 넣을 수 있고, 앱에서는 설정된 최애 이름으로 바뀝니다.",
      editGateTitle: "콜을 추가하세요",
      editGateDescription: "계속하려면 한 줄 이상 입력하거나 붙여 넣으세요.",
      syncTitle: "콜 싱크 맞추기",
      syncDescription:
        "시작을 누른 뒤 각 줄이나 단어 타이밍에 맞춰 Space를 누르세요. 줄/단어 정밀도는 단위 토글로 바꿀 수 있습니다.",
      syncDescriptionMobile:
        "모바일에서는 아래 터치 컨트롤을 사용합니다. Tap으로 현재 줄이나 단어의 시작 타이밍을 찍고, Hold는 누르고 있는 동안의 길이를 그대로 기록합니다.",
      syncGateTitle: "최소 한 줄은 싱크하세요",
      syncGateDescription:
        "시작을 누르고 오디오를 재생한 다음 Space로 타이밍을 찍으세요.",
      syncGateDescriptionMobile:
        "시작 후 아래 Tap 버튼으로 최소 한 줄의 타이밍을 찍으세요. 길이까지 잡고 싶다면 Hold를 길게 누르세요.",
      timelineTitle: "타임라인에서 미세 조정",
      timelineDescription: `단어를 드래그하거나 화살표 키로 미세 조정하세요. ${MOD_KEY}+스크롤로 확대/축소하고 F로 재생 헤드 따라가기를 전환할 수 있습니다. 반복 구간은 ${MOD_KEY}+G로 그룹화하고 ${MOD_KEY}+D로 링크 인스턴스를 복제하세요.`,
      timelineDescriptionMobile:
        "모바일에서는 먼저 섹션 메뉴에서 Timeline을 엽니다. 선택한 단어 정보는 아래 바에 표시되고 Set Begin / Set End로 위치를 맞출 수 있습니다.",
      previewTitle: "작업 미리보기",
      previewDescription:
        "오디오와 함께 콜이 싱크되어 재생되는 모습을 확인하세요. 아무 줄이나 클릭하면 그 위치로 이동합니다.",
      exportTitle: "TTML 내보내기",
      exportDescription:
        "완성된 TTML 파일을 복사하거나 다운로드할 수 있습니다. 전체 프로젝트를 JSON으로 내보내는 것도 가능합니다.",
      outroTitle: "전체 워크스루 보기",
      outroDescription: `이제 준비가 끝났습니다. 전체 과정을 보여주는 영상입니다.${YOUTUBE_EMBED_HTML}`,
      taskAudio: "YouTube 영상 불러오기",
      taskLyrics: "콜 입력 또는 붙여넣기",
      taskSync: "최소 한 줄 싱크",
      done: "완료",
    };
  }

  return {
    welcomeTitle: "Welcome to CallEditor",
    welcomeDescription:
      "A tool for creating synchronized calls in TTML format. Let's walk through the workflow together.",
    importTitle: "Bring in your audio",
    importDescription:
      "Paste a YouTube URL here to pull audio straight from a video.",
    importGateTitle: "Import your audio",
    importGateDescription:
      "Paste a YouTube URL to continue.",
    sectionTitle: "Switch sections",
    sectionDescription:
      "On mobile, use the top-right menu to move between sections. After audio loads, open that menu and continue to Edit.",
    editTitle: "Type or paste calls",
    editDescription:
      "Enter your calls in the text area on the left. Each line becomes a sync target. The {oshi} button next to Agents inserts the {oshi} token, which the app replaces with the user's configured oshi name.",
    editGateTitle: "Add your calls",
    editGateDescription: "Type or paste at least one line to continue.",
    syncTitle: "Sync your calls",
    syncDescription:
      "Press Start, then tap Space in time with each line or word. Use the granularity toggle for line vs word precision.",
    syncDescriptionMobile:
      "On mobile, use the touch controls at the bottom. Tap sets the start timing for the current line or word, and Hold records the duration while your finger stays down.",
    syncGateTitle: "Sync at least one line",
    syncGateDescription:
      "Press Start, play the audio, then tap Space to set timing.",
    syncGateDescriptionMobile:
      "After pressing Start, use the Tap button below to time at least one line. Use Hold when you want to capture the full duration too.",
    timelineTitle: "Fine-tune on the timeline",
    timelineDescription: `Drag words to adjust timing, or select words and nudge them with the arrow keys. ${MOD_KEY} + scroll to zoom, F to toggle playhead follow. Group repeating sections with ${MOD_KEY}+G, then duplicate them as linked instances with ${MOD_KEY}+D so edits propagate everywhere.`,
    timelineDescriptionMobile:
      "On mobile, open Timeline from the section menu first. The selected word details appear in the bottom bar, where Set Begin and Set End help place edges precisely.",
    previewTitle: "Preview your work",
    previewDescription:
      "Watch calls play back in sync with the audio. Click any line to jump there.",
    exportTitle: "Export your TTML",
    exportDescription:
      "Copy or download the finished TTML file. You can also export the full project as JSON.",
    outroTitle: "See a full walkthrough",
    outroDescription: `You're all set! Here's a video of the full process.${YOUTUBE_EMBED_HTML}`,
    taskAudio: "Load a YouTube video",
    taskLyrics: "Type or paste calls",
    taskSync: "Sync at least one line",
    done: "Done",
  };
}

function createDesktopTourSteps(): DriveStep[] {
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

function createMobileTourSteps(): DriveStep[] {
  const text = getTourText();
  return [
    {
      popover: {
        title: text.welcomeTitle,
        description: text.welcomeDescription,
        popoverClass: "calleditor-tour calleditor-tour-modal",
        showButtons: ["next", "close"],
        showProgress: false,
      },
    },
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
    {
      element: () =>
        document.querySelector('[data-tour="mobile-section-menu"]') as Element,
      popover: {
        title: text.sectionTitle,
        description: text.sectionDescription,
        side: "bottom",
        align: "end",
      },
      onHighlightStarted: () => switchTab("import"),
    },
    {
      element: () =>
        document.querySelector('[data-tour="edit-panel"]') as Element,
      popover: {
        title: text.editTitle,
        description: text.editDescription,
        side: "bottom",
        align: "center",
      },
      onHighlightStarted: () => switchTab("edit"),
    },
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
    {
      element: () =>
        document.querySelector('[data-tour="sync-panel"]') as Element,
      popover: {
        title: text.syncTitle,
        description: text.syncDescriptionMobile,
        side: "top",
        align: "center",
      },
      onHighlightStarted: () => switchTab("sync"),
    },
    {
      element: () =>
        document.querySelector('[data-tour="sync-panel"]') as Element,
      popover: {
        title: text.syncGateTitle,
        description: text.syncGateDescriptionMobile,
        showButtons: [],
      },
      onHighlightStarted: () => switchTab("sync"),
    },
    {
      element: () =>
        document.querySelector('[data-tour="timeline-panel"]') as Element,
      popover: {
        title: text.timelineTitle,
        description: text.timelineDescriptionMobile,
        side: "top",
        align: "center",
      },
      onHighlightStarted: () => switchTab("timeline"),
    },
    {
      element: () =>
        document.querySelector('[data-tour="preview-panel"]') as Element,
      popover: {
        title: text.previewTitle,
        description: text.previewDescription,
        side: "top",
        align: "center",
      },
      onHighlightStarted: () => switchTab("preview"),
    },
    {
      element: () =>
        document.querySelector('[data-tour="export-panel"]') as Element,
      popover: {
        title: text.exportTitle,
        description: text.exportDescription,
        side: "top",
        align: "center",
      },
      onHighlightStarted: () => switchTab("export"),
    },
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

function createTourConfig(): TourConfig {
  const text = getTourText();
  if (isMobileTourViewport()) {
    return {
      steps: createMobileTourSteps(),
      gatedSteps: [
        {
          stepIndex: 2,
          task: text.taskAudio,
          gateCheck: gateAudioLoaded,
          tabId: "import",
        },
        {
          stepIndex: 5,
          task: text.taskLyrics,
          gateCheck: gateLyricsExist,
          tabId: "edit",
        },
        {
          stepIndex: 7,
          task: text.taskSync,
          gateCheck: gateFirstLineSynced,
          tabId: "sync",
        },
      ],
    };
  }

  return {
    steps: createDesktopTourSteps(),
    gatedSteps: [
      {
        stepIndex: 2,
        task: text.taskAudio,
        gateCheck: gateAudioLoaded,
        tabId: "import",
      },
      {
        stepIndex: 4,
        task: text.taskLyrics,
        gateCheck: gateLyricsExist,
        tabId: "edit",
      },
      {
        stepIndex: 6,
        task: text.taskSync,
        gateCheck: gateFirstLineSynced,
        tabId: "sync",
      },
    ],
  };
}

// -- Exports ------------------------------------------------------------------

export { createTourConfig };
export type { GatedStep };
