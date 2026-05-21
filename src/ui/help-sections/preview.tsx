import { useAppLanguage } from "@/lib/i18n";
import { PROSE } from "@/ui/help-sections/shared";

// -- Preview ------------------------------------------------------------------

const COPY = {
  en: {
    intro:
      "The Preview tab shows you how your synced lyrics will look with Better Lyrics' rendering engine. Words fill in progressively as they're sung, matching the timing you set.",
    agent:
      "Agent lines are positioned based on their inferred location (left, right, center).",
    bg: "Background vocals appear below the main line in a smaller style.",
    timing:
      "Use this to spot timing issues. If a word highlights too early or too late, go back to Timeline and adjust.",
    controls:
      "Playback controls (play/pause, seek) work the same as everywhere else.",
    instrumental:
      "Instrumental sections appear automatically wherever there's a gap longer than 5 seconds between sung lines. Better Lyrics handles this at render time. You can't add them manually or preview them here, just trust that they'll show up in the final output.",
  },
  ja: {
    intro:
      "Preview タブでは、Better Lyrics のレンダリングエンジンで同期済み歌詞がどう見えるかを確認できます。歌われるタイミングに合わせて単語が順に塗られていきます。",
    agent:
      "エージェント付きの行は、推定された位置に応じて左・中央・右に配置されます。",
    bg: "バックボーカルはメイン行の下に小さめのスタイルで表示されます。",
    timing:
      "ここでタイミングのズレを確認できます。単語のハイライトが早すぎたり遅すぎたりしたら Timeline に戻って調整してください。",
    controls: "再生、停止、シークなどの操作は他の画面と同じです。",
    instrumental:
      "歌唱行の間に 5 秒以上の空きがあると、インスト区間が自動で入ります。これは Better Lyrics 側の描画時に処理されるので、ここで手動追加したり事前表示したりはできません。",
  },
  ko: {
    intro:
      "Preview 탭에서는 Better Lyrics 렌더링 엔진으로 동기화된 가사가 어떻게 보이는지 확인할 수 있습니다. 설정한 타이밍에 맞춰 단어가 순서대로 채워집니다.",
    agent:
      "에이전트가 지정된 줄은 추정 위치에 따라 왼쪽, 가운데, 오른쪽에 배치됩니다.",
    bg: "백보컬은 메인 줄 아래에 더 작은 스타일로 표시됩니다.",
    timing:
      "타이밍 문제를 찾을 때 유용합니다. 단어가 너무 빨리 또는 늦게 강조되면 Timeline으로 돌아가 조정하세요.",
    controls:
      "재생, 일시정지, 시크 같은 컨트롤은 다른 화면과 동일하게 동작합니다.",
    instrumental:
      "노래하는 줄 사이에 5초보다 긴 공백이 있으면 연주 구간이 자동으로 표시됩니다. 이 처리는 Better Lyrics 렌더링 단계에서 이뤄지므로 여기서 수동으로 추가하거나 미리 볼 수는 없습니다.",
  },
} as const;

const PreviewSection: React.FC = () => {
  const { language } = useAppLanguage();
  const copy = COPY[language];

  return (
    <div className="space-y-4">
      <p className={PROSE}>
        {copy.intro.split("Better Lyrics")[0]}
        <a
          href="https://betterlyrics.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-calleditor-text underline underline-offset-2 hover:text-calleditor-text-bright"
        >
          Better Lyrics
        </a>
        {copy.intro.split("Better Lyrics")[1]}
      </p>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>{copy.agent}</li>
        <li>{copy.bg}</li>
        <li>{copy.timing}</li>
        <li>{copy.controls}</li>
        <li>{copy.instrumental}</li>
      </ul>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { PreviewSection };
