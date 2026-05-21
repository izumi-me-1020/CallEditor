import { useAppLanguage } from "@/lib/i18n";
import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { HEADING, PROSE } from "@/ui/help-sections/shared";
import { InlineKeyBadge } from "@/ui/inline-key-badge";

// -- Importing Audio ----------------------------------------------------------

const COPY = {
  en: {
    audio: "Audio source",
    audioFormats: "Audio is imported from YouTube URLs only.",
    audioList: [
      "Paste a YouTube URL or video ID in the Import tab.",
      "Once loaded, the waveform renders across the top of Timeline.",
      "The video title auto-fills the project title in metadata.",
      "To replace audio, load a different YouTube URL.",
    ],
    youtube: "YouTube URLs",
    youtubeBody:
      "Paste any YouTube link (full URL, share link, or just the video ID) into the Import tab. CallEditor downloads the audio once and keeps it in memory, so seeking and waveform rendering stay instant after that.",
    youtubeList: [
      "The video title fills in as your project title.",
      "To swap videos, paste a new URL into the same input on the Import tab.",
      "If a download fails, check that the URL is right and that the video is public.",
      "A small number of videos won't download due to geo-restrictions or rights blocks.",
    ],
    lyrics: "Lyrics files",
    lyricsFormats:
      "Supported formats: .txt (plain text), .lrc (line-level timing), .srt (subtitles), .ttml (full timing + agents).",
    lyricsA: "In the Edit tab, use the import button at the top.",
    lyricsB: "In Timeline, press",
    lyricsC: "or click the import button in the header.",
    lyricsD:
      "When importing .lrc, .srt, or .ttml files, existing timing is preserved.",
    lyricsE: "Plain .txt files get no timing. You'll sync them manually.",
  },
  ja: {
    audio: "音声ソース",
    audioFormats: "音声は YouTube URL からのみ読み込めます。",
    audioList: [
      "Import タブに YouTube URL または動画 ID を貼り付けます。",
      "読み込みが終わると Timeline 上部に波形が表示されます。",
      "動画タイトルはメタデータのプロジェクトタイトルにも自動で入ります。",
      "音声を差し替えるときは別の YouTube URL を読み込みます。",
    ],
    youtube: "YouTube URL",
    youtubeBody:
      "Import タブに YouTube リンクを貼り付けます。通常の URL、共有リンク、動画 ID 単体のどれでも構いません。CallEditor は音声を一度だけ取り込み、メモリ上に保持するので、その後のシークや波形表示は軽く動きます。",
    youtubeList: [
      "動画タイトルはプロジェクトタイトルとして自動で入ります。",
      "別の動画に差し替えるときは同じ入力欄に新しい URL を貼り付けます。",
      "取得に失敗したら URL が正しいか、動画が公開状態かを確認してください。",
      "地域制限や権利制限で取得できない動画も一部あります。",
    ],
    lyrics: "歌詞ファイル",
    lyricsFormats:
      "対応形式: .txt（プレーンテキスト）, .lrc（行単位タイミング）, .srt（字幕）, .ttml（完全なタイミングとエージェント）。",
    lyricsA: "Edit タブでは上部の import ボタンを使います。",
    lyricsB: "Timeline では",
    lyricsC: "を押すか、ヘッダーの import ボタンを使います。",
    lyricsD:
      ".lrc / .srt / .ttml を読み込むと既存のタイミング情報も保持されます。",
    lyricsE:
      "プレーンな .txt にはタイミングがないので、あとで手動で同期します。",
  },
  ko: {
    audio: "오디오 소스",
    audioFormats: "오디오는 YouTube URL에서만 가져올 수 있습니다.",
    audioList: [
      "Import 탭에 YouTube URL 또는 영상 ID를 붙여 넣으세요.",
      "로드가 끝나면 Timeline 상단에 파형이 표시됩니다.",
      "영상 제목은 메타데이터의 프로젝트 제목에도 자동으로 채워집니다.",
      "오디오를 바꾸려면 다른 YouTube URL을 다시 불러오면 됩니다.",
    ],
    youtube: "YouTube URL",
    youtubeBody:
      "Import 탭에 YouTube 링크를 붙여 넣으세요. 전체 URL, 공유 링크, 영상 ID만 넣어도 됩니다. CallEditor는 오디오를 한 번만 가져와 메모리에 유지하므로 이후 시크와 파형 렌더링이 즉시 반응합니다.",
    youtubeList: [
      "영상 제목이 프로젝트 제목으로 자동 입력됩니다.",
      "다른 영상으로 바꾸려면 같은 입력칸에 새 URL을 붙여 넣으면 됩니다.",
      "다운로드에 실패하면 URL이 맞는지, 영상이 공개 상태인지 확인하세요.",
      "지역 제한이나 권리 제한 때문에 가져오지 못하는 영상도 있습니다.",
    ],
    lyrics: "가사 파일",
    lyricsFormats:
      "지원 형식: .txt(일반 텍스트), .lrc(줄 단위 타이밍), .srt(자막), .ttml(전체 타이밍 + 에이전트).",
    lyricsA: "Edit 탭에서는 상단 import 버튼을 사용하세요.",
    lyricsB: "Timeline에서는",
    lyricsC: "을 누르거나 헤더의 import 버튼을 누르면 됩니다.",
    lyricsD: ".lrc, .srt, .ttml 파일을 가져오면 기존 타이밍 정보가 유지됩니다.",
    lyricsE: "일반 .txt 파일에는 타이밍이 없으므로 직접 싱크를 맞춰야 합니다.",
  },
} as const;

const ImportSection: React.FC = () => {
  const { language } = useAppLanguage();
  const copy = COPY[language];

  return (
    <div className="space-y-5">
      <div>
        <h4 className={HEADING}>{copy.audio}</h4>
        <p className={PROSE}>{copy.audioFormats}</p>
        <ul className={`${PROSE} list-disc pl-4 mt-1.5 space-y-1`}>
          {copy.audioList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.youtube}</h4>
        <p className={PROSE}>{copy.youtubeBody}</p>
        <ul className={`${PROSE} list-disc pl-4 mt-1.5 space-y-1`}>
          {copy.youtubeList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.lyrics}</h4>
        <p className={PROSE}>{copy.lyricsFormats}</p>
        <ul className={`${PROSE} list-disc pl-4 mt-1.5 space-y-1`}>
          <li>{copy.lyricsA}</li>
          <li>
            {copy.lyricsB}{" "}
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.importLyrics")}
            />{" "}
            {copy.lyricsC}
          </li>
          <li>{copy.lyricsD}</li>
          <li>{copy.lyricsE}</li>
        </ul>
      </div>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { ImportSection };
