import { useAppLanguage } from "@/lib/i18n";
import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { HEADING, PROSE } from "@/ui/help-sections/shared";
import { InlineKeyBadge } from "@/ui/inline-key-badge";
import { MOD_KEY } from "@/utils/platform";

// -- Getting Started ----------------------------------------------------------

const COPY = {
  en: {
    introA: "CallEditor is the call editor for",
    introB:
      ". It guides you through four steps to create synced calls. Follow the tabs left-to-right for a guided experience, or jump straight to the Timeline for a DAW-like workflow.",
    introC:
      "As of now, CallEditor is still in early access, so expect some rough edges. If you run into any issues or have feedback, please reach out on",
    introD: "or submit an issue on",
    step1: "1. Import your audio",
    step1Body:
      "Paste a YouTube URL into the Import tab to pull audio from a video. The waveform appears once the audio loads.",
    step2: "2. Add your calls",
    step2BodyA:
      "Go to the Edit tab and type or paste your calls, one line per row. If you have a call file (.lrc, .srt, .ttml, .txt), drop it there instead. You can also use",
    step2BodyB: "to import calls without leaving that view.",
    step2BodyC:
      "The {oshi} button next to Agents inserts the {oshi} token. In the app, that token becomes the user's configured oshi name.",
    step3: "3. Sync the timing",
    step3Body:
      "The Sync tab lets you sync words to the music using two keys: tap Space to mark gapless word boundaries, or hold F to capture a word's full duration. You can also tap Space while holding F to create gapless syllable boundaries. If you miss one, use the arrow keys to nudge the timing. For finer control, switch to Timeline and drag word blocks directly on the waveform.",
    step4: "4. Preview and export",
    step4Body:
      "The Preview tab shows a live karaoke-style playback of your work. When you're happy with it, go to Export and download your TTML file. You can also copy the raw XML or export a project file to share with someone else.",
    footer:
      "The tabs are meant to be followed left-to-right, but you can jump between them anytime using",
    tutorial: "CallEditor tutorial",
  },
  ja: {
    introA: "CallEditor は",
    introB:
      "向けのコールエディタです。同期コールを作るまでの流れを 4 ステップで案内します。左から順にタブを進めてもいいですし、DAW に近い感覚で Timeline から始めても大丈夫です。",
    introC:
      "現在の CallEditor はまだ early access 段階なので、少し荒い部分があります。問題やフィードバックがあれば",
    introD: "または",
    step1: "1. 音声を読み込む",
    step1Body:
      "Import タブに YouTube URL を貼り付けて動画から音声を取得します。読み込み後は波形が表示されます。",
    step2: "2. コールを入れる",
    step2BodyA:
      "Edit タブでコールを 1 行ずつ入力または貼り付けます。.lrc / .srt / .ttml / .txt のコールファイルがあるならそこへドロップしても構いません。Timeline から離れずに読み込むなら",
    step2BodyB: "も使えます。",
    step2BodyC:
      "Agents の横にある {oshi} ボタンを押すと {oshi} 文字列を入れられます。アプリ側では、その文字列がユーザーに設定された推し名へ置き換わります。",
    step3: "3. タイミングを合わせる",
    step3Body:
      "Sync タブでは 2 つのキーで単語のタイミングを取れます。Space をタップすると単語境界を隙間なく打てて、F を押し続けると単語の長さをそのまま記録できます。F を押したまま Space を叩けば音節の境界も作れます。ずれたときは矢印キーで微調整し、さらに細かく詰めたいときは Timeline で波形上のブロックを直接動かします。",
    step4: "4. 確認して書き出す",
    step4Body:
      "Preview タブではカラオケ風の再生で見え方を確認できます。問題なければ Export で TTML を保存します。生の XML をコピーしたり、プロジェクトファイルを書き出して他の人に渡したりもできます。",
    footer: "基本は左から順に進める構成ですが、",
    tutorial: "CallEditor チュートリアル",
  },
  ko: {
    introA: "CallEditor는",
    introB:
      "용 콜 편집기입니다. 동기화 콜을 만드는 과정을 네 단계로 안내합니다. 왼쪽에서 오른쪽으로 탭을 따라가도 되고, DAW 같은 흐름으로 Timeline부터 시작해도 됩니다.",
    introC:
      "현재 CallEditor는 아직 얼리 액세스 단계라 거친 부분이 남아 있습니다. 문제를 발견하거나 의견이 있다면",
    introD: "또는",
    step1: "1. 오디오 가져오기",
    step1Body:
      "Import 탭에 YouTube URL을 붙여 넣어 영상에서 오디오를 가져옵니다. 오디오가 로드되면 파형이 표시됩니다.",
    step2: "2. 콜 넣기",
    step2BodyA:
      "Edit 탭에서 콜을 한 줄씩 입력하거나 붙여 넣습니다. .lrc, .srt, .ttml, .txt 파일이 있다면 그쪽을 드롭해도 됩니다. Timeline을 벗어나지 않고 가져오려면",
    step2BodyB: "도 사용할 수 있습니다.",
    step2BodyC:
      "Agents 옆의 {oshi} 버튼은 {oshi} 토큰을 넣어 줍니다. 앱에서는 이 토큰이 사용자의 설정된 최애 이름으로 바뀝니다.",
    step3: "3. 타이밍 맞추기",
    step3Body:
      "Sync 탭에서는 두 개의 키로 단어 타이밍을 맞춥니다. Space를 탭하면 단어 경계를 빈틈 없이 찍을 수 있고, F를 누르고 있으면 단어 전체 길이를 기록할 수 있습니다. F를 누른 채 Space를 누르면 음절 경계도 만들 수 있습니다. 놓친 부분은 방향키로 미세 조정하고, 더 세밀하게 다듬으려면 Timeline에서 파형 위 블록을 직접 드래그하세요.",
    step4: "4. 미리 보고 내보내기",
    step4Body:
      "Preview 탭에서는 가라오케 스타일 재생으로 결과를 확인할 수 있습니다. 만족스러우면 Export에서 TTML 파일을 저장하세요. 원본 XML을 복사하거나 프로젝트 파일을 내보내 다른 사람과 공유할 수도 있습니다.",
    footer: "탭은 기본적으로 왼쪽에서 오른쪽 순서로 따라가도록 되어 있지만,",
    tutorial: "CallEditor 튜토리얼",
  },
} as const;

const GettingStartedSection: React.FC = () => {
  const { language } = useAppLanguage();
  const copy = COPY[language];

  return (
    <div className="space-y-5">
      <p className={PROSE}>
        {copy.introA}{" "}
        <a
          href="https://betterlyrics.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-calleditor-text underline underline-offset-2 hover:text-calleditor-text-bright"
        >
          Better Lyrics
        </a>
        {copy.introB}
        <br /> {copy.introC}{" "}
        <a
          href="https://discord.gg/UsHE3d5fWF"
          target="_blank"
          rel="noopener noreferrer"
          className="text-calleditor-text underline underline-offset-2 hover:text-calleditor-text-bright"
        >
          Discord
        </a>{" "}
        {copy.introD}{" "}
        <a
          href="https://github.com/better-lyrics/calleditor/issues/new/choose"
          target="_blank"
          rel="noopener noreferrer"
          className="text-calleditor-text underline underline-offset-2 hover:text-calleditor-text-bright"
        >
          GitHub
        </a>
        .
      </p>

      <div className="space-y-4">
        <div>
          <h4 className={HEADING}>{copy.step1}</h4>
          <p className={PROSE}>{copy.step1Body}</p>
        </div>
        <div>
          <h4 className={HEADING}>{copy.step2}</h4>
          <p className={PROSE}>
            {copy.step2BodyA}{" "}
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.importLyrics")}
            />{" "}
            {copy.step2BodyB} {copy.step2BodyC}
          </p>
        </div>
        <div>
          <h4 className={HEADING}>{copy.step3}</h4>
          <p className={PROSE}>{copy.step3Body}</p>
        </div>
        <div>
          <h4 className={HEADING}>{copy.step4}</h4>
          <p className={PROSE}>{copy.step4Body}</p>
        </div>
      </div>

      <p className={PROSE}>
        {copy.footer} {MOD_KEY} + 1 through 6.
      </p>

      <div className="aspect-video w-full rounded-lg overflow-hidden border border-calleditor-border">
        <iframe
          src="https://www.youtube.com/embed/IEA0W4qpRIs?rel=0"
          title={copy.tutorial}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { GettingStartedSection };
