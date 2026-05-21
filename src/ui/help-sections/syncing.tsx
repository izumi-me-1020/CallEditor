import { useAppLanguage } from "@/lib/i18n";
import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { HEADING, PROSE } from "@/ui/help-sections/shared";
import { InlineKeyBadge } from "@/ui/inline-key-badge";
import { MOD_KEY } from "@/utils/platform";

// -- Syncing ------------------------------------------------------------------

const COPY = {
  en: {
    intro:
      "The Sync tab shows your calls as a scrolling carousel. One line is active at a time, with each word waiting to be synced. You have two keys available, and you can use them freely in combination.",
    tap: "Tap (Space)",
    tapBody:
      "to start playback and begin syncing. As the music plays, tap the same key on each word right when the singer says it. Each tap marks the word's start time, and the previous word's end time is set to the same moment, creating gapless transitions.",
    hold: "Hold (F)",
    holdBody:
      "for the duration of each word. The key-down marks the word's start, and key-up marks the end. This gives you explicit control over word duration and allows natural gaps between words. The current word highlights while you hold.",
    holdLead: "For words with natural gaps between them, just hold and release for each word:",
    holdList: ['Hold F: "hello" starts', 'Release F: "hello" ends', "(wait for gap)", 'Hold F: "world" starts', 'Release F: "world" ends'],
    gapless: "Gapless syllables (Hold F + Tap Space)",
    gaplessBodyA: "For syllables that flow together without pauses, tap",
    gaplessBodyB:
      "while holding",
    gaplessBodyC:
      "to create gapless boundaries. Each tap ends the current syllable and immediately starts the next. Release",
    gaplessBodyD: "to end the last one:",
    gaplessList: ['Hold F: "beau" starts', 'Tap Space (still holding F): "beau" ends, "ti" starts at the same moment', 'Tap Space (still holding F): "ti" ends, "ful" starts at the same moment', 'Release F: "ful" ends'],
    mixLead:
      "You can mix all styles naturally within the same line. Use hold-release for standalone words, tap for quick gapless words, and hold+tap for connected syllables:",
    mixList: ['Hold F, release F: "oh" gets its own timing', "(gap)", 'Hold F: "beau" starts', 'Tap Space, tap Space: gapless boundaries for "ti" and "ful"', 'Release F: "ful" ends'],
    mistake: "Made a mistake?",
    mistakeBodyA: "Press",
    mistakeBodyB: "to nudge the last synced word 50ms earlier.",
    mistakeBodyC: "nudges it 50ms later. You can also press",
    mistakeBodyD: "to undo. Each hold produces two undo steps (start and end) so you can step back precisely.",
    lineLevel: "Line-level vs word-level",
    lineLevelBody: "By default, you're syncing word by word. The granularity toggle at the top lets you switch to line-level if you only need rough timing.",
    resync: "Re-syncing a line",
    resyncBody: "If a whole line went wrong, just navigate back to it and sync again. New taps overwrite old timing.",
    split: "Splitting syllables",
    splitBody:
      "Each word on the active line has a small scissors button. Click it to split that word into syllables right here, without switching to the Timeline. A popover opens where you click between letters to mark the split points, then confirm. The Timeline splitter offers the same syllable split plus a word-mode split.",
    outro:
      "After syncing, your words have timing data. The Sync tab works at the line or word level, but for precise per-word timing adjustments, Timeline is where you drag, resize, and snap individual word blocks. Head there for fine-tuning, or go straight to Preview to see how it looks.",
  },
  ja: {
    intro:
      "Sync タブではコールがスクロールするカルーセルとして表示されます。常に 1 行だけがアクティブになり、その中の単語を順に同期していきます。使うキーは 2 つで、自由に組み合わせられます。",
    tap: "タップ（Space）",
    tapBody:
      "で再生を始め、そのまま同期を開始します。再生中に歌われた瞬間に合わせて同じキーを叩くと、その単語の開始時刻が打たれます。同時に前の単語の終了時刻も同じ時刻になり、隙間のないつながりになります。",
    hold: "ホールド（F）",
    holdBody:
      "を単語の長さだけ押し続けます。押した瞬間が開始、離した瞬間が終了になります。単語の長さを明示的に取れるので、単語間の自然な間も残せます。押している間は現在の単語がハイライトされます。",
    holdLead: "単語の間に自然な空きがある場合は、単語ごとに押して離します。",
    holdList: ['F を押す: "hello" 開始', 'F を離す: "hello" 終了', "（間を待つ）", 'F を押す: "world" 開始', 'F を離す: "world" 終了'],
    gapless: "隙間のない音節（F を押しながら Space）",
    gaplessBodyA: "切れ目なくつながる音節では、",
    gaplessBodyB: "を押したまま",
    gaplessBodyC:
      "をタップすると、隙間のない境界を作れます。タップするたびに現在の音節が終わり、次の音節が同時に始まります。最後は",
    gaplessBodyD: "を離して終わらせます。",
    gaplessList: ['F を押す: "beau" 開始', 'Space をタップ（F は押したまま）: "beau" 終了、同時に "ti" 開始', 'Space をタップ（F は押したまま）: "ti" 終了、同時に "ful" 開始', 'F を離す: "ful" 終了'],
    mixLead:
      "同じ行の中でこれらを混ぜて使えます。独立した単語は押して離す、短く詰まった単語はタップ、つながる音節はホールド＋タップが向いています。",
    mixList: ['F を押して離す: "oh" に単独の長さを付ける', "（間）", 'F を押す: "beau" 開始', 'Space, Space をタップ: "ti" と "ful" の境界を作る', 'F を離す: "ful" 終了'],
    mistake: "ミスしたとき",
    mistakeBodyA: "",
    mistakeBodyB: "で直前に同期した単語を 50ms 早くできます。",
    mistakeBodyC: "は 50ms 遅くします。さらに",
    mistakeBodyD: "で undo できます。F を使った同期は開始と終了で 2 段階の undo になるので細かく戻せます。",
    lineLevel: "行単位と単語単位",
    lineLevelBody: "デフォルトは単語単位です。上部の granularity 切り替えで、大まかなタイミングだけ欲しい場合は行単位にもできます。",
    resync: "行をやり直す",
    resyncBody: "1 行まるごと失敗したら、その行に戻ってもう一度同期すれば大丈夫です。新しい入力で古いタイミングは上書きされます。",
    split: "音節分割",
    splitBody:
      "アクティブ行の各単語には小さなハサミボタンがあります。これを押すと Timeline に移動せず、その場で音節分割できます。文字の間をクリックして分割位置を決め、確定します。Timeline 側の splitter には同じ音節分割に加えて単語分割モードもあります。",
    outro:
      "同期が終わると単語にタイミングが付きます。Sync タブは行または単語レベルの同期に向いていて、より細かい単語ごとの調整は Timeline で行います。必要ならそのまま Preview に進んで見え方を確認してください。",
  },
  ko: {
    intro:
      "Sync 탭에서는 콜이 스크롤되는 캐러셀처럼 표시됩니다. 한 번에 한 줄만 활성화되며 각 단어를 순서대로 동기화합니다. 사용할 수 있는 키는 두 개이고 자유롭게 조합할 수 있습니다.",
    tap: "탭 (Space)",
    tapBody:
      "로 재생과 동기화를 시작합니다. 음악이 재생되는 동안 가수가 단어를 말하는 순간에 맞춰 같은 키를 누르세요. 각 탭은 단어의 시작 시점을 기록하고, 이전 단어의 끝 시점도 같은 시각으로 설정되어 빈틈 없이 이어집니다.",
    hold: "홀드 (F)",
    holdBody:
      "를 단어 길이만큼 누르고 있습니다. 키를 누른 순간이 시작, 뗀 순간이 끝이 됩니다. 단어 길이를 명시적으로 조절할 수 있어 단어 사이 자연스러운 공백도 표현할 수 있습니다. 누르는 동안 현재 단어가 강조됩니다.",
    holdLead: "단어 사이에 자연스러운 간격이 있다면 단어마다 눌렀다 떼면 됩니다.",
    holdList: ['F 누르기: "hello" 시작', 'F 떼기: "hello" 끝', "(간격 대기)", 'F 누르기: "world" 시작', 'F 떼기: "world" 끝'],
    gapless: "빈틈 없는 음절 (F를 누른 채 Space 탭)",
    gaplessBodyA: "쉼 없이 이어지는 음절은",
    gaplessBodyB: "를 누른 채",
    gaplessBodyC:
      "를 탭하면 빈틈 없는 경계를 만들 수 있습니다. 탭할 때마다 현재 음절이 끝나고 다음 음절이 같은 시각에 바로 시작합니다. 마지막은",
    gaplessBodyD: "를 떼어서 끝냅니다.",
    gaplessList: ['F 누르기: "beau" 시작', 'Space 탭(F는 계속 누름): "beau" 끝, 동시에 "ti" 시작', 'Space 탭(F는 계속 누름): "ti" 끝, 동시에 "ful" 시작', 'F 떼기: "ful" 끝'],
    mixLead:
      "한 줄 안에서도 이 방식들을 자연스럽게 섞어 쓸 수 있습니다. 독립된 단어는 홀드-릴리즈, 빠르게 붙는 단어는 탭, 이어지는 음절은 홀드+탭이 잘 맞습니다.",
    mixList: ['F 눌렀다 떼기: "oh"에 독립 타이밍 부여', "(간격)", 'F 누르기: "beau" 시작', 'Space, Space 탭: "ti"와 "ful" 경계 만들기', 'F 떼기: "ful" 끝'],
    mistake: "실수했을 때",
    mistakeBodyA: "",
    mistakeBodyB: "로 마지막으로 동기화한 단어를 50ms 더 앞으로 당길 수 있습니다.",
    mistakeBodyC: "는 50ms 뒤로 밀어 줍니다. 또",
    mistakeBodyD: "로 실행 취소할 수 있습니다. 홀드 동기화는 시작과 끝이 각각 undo 한 단계씩이라 정밀하게 되돌릴 수 있습니다.",
    lineLevel: "줄 단위와 단어 단위",
    lineLevelBody: "기본값은 단어 단위입니다. 상단 granularity 토글로 대략적인 타이밍만 필요할 때 줄 단위로 바꿀 수 있습니다.",
    resync: "한 줄 다시 동기화하기",
    resyncBody: "한 줄 전체가 잘못됐다면 그 줄로 돌아가 다시 동기화하면 됩니다. 새 입력이 기존 타이밍을 덮어씁니다.",
    split: "음절 나누기",
    splitBody:
      "활성 줄의 각 단어에는 작은 가위 버튼이 있습니다. 이를 클릭하면 Timeline으로 가지 않고도 여기서 바로 음절로 나눌 수 있습니다. 글자 사이를 클릭해 분할 지점을 정한 뒤 확인하세요. Timeline의 splitter에는 같은 음절 분할과 단어 분할 모드가 함께 있습니다.",
    outro:
      "동기화가 끝나면 단어에 타이밍이 붙습니다. Sync 탭은 줄 또는 단어 수준의 동기화에 적합하고, 더 정밀한 단어별 조정은 Timeline에서 합니다. 더 다듬거나 바로 Preview에서 결과를 확인해 보세요.",
  },
} as const;

const SyncSection: React.FC = () => {
  const { language } = useAppLanguage();
  const copy = COPY[language];

  return (
    <div className="space-y-5">
    <p className={PROSE}>{copy.intro}</p>

    <div>
      <h4 className={HEADING}>{copy.tap}</h4>
      <p className={PROSE}>
        <InlineKeyBadge keys={getEffectiveKeysArray("sync.tap")} /> {copy.tapBody}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{copy.hold}</h4>
      <p className={PROSE}>
        <InlineKeyBadge keys={getEffectiveKeysArray("sync.holdSync")} /> {copy.holdBody}
      </p>
      <p className={`${PROSE} mt-2`}>{copy.holdLead}</p>
      <ul className={`${PROSE} list-disc pl-4 mt-1.5 space-y-1`}>
        {copy.holdList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{copy.gapless}</h4>
      <p className={PROSE}>
        {copy.gaplessBodyA} <InlineKeyBadge keys={getEffectiveKeysArray("sync.tap")} /> {copy.gaplessBodyB}{" "}
        <InlineKeyBadge keys={getEffectiveKeysArray("sync.holdSync")} /> {copy.gaplessBodyC}{" "}
        <InlineKeyBadge keys={getEffectiveKeysArray("sync.holdSync")} /> {copy.gaplessBodyD}
      </p>
      <ul className={`${PROSE} list-disc pl-4 mt-1.5 space-y-1`}>
        {copy.gaplessList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className={`${PROSE} mt-2`}>{copy.mixLead}</p>
      <ul className={`${PROSE} list-disc pl-4 mt-1.5 space-y-1`}>
        {copy.mixList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{copy.mistake}</h4>
      <p className={PROSE}>
        {copy.mistakeBodyA} <InlineKeyBadge keys={getEffectiveKeysArray("sync.nudgeLeft")} /> {copy.mistakeBodyB}{" "}
        <InlineKeyBadge keys={getEffectiveKeysArray("sync.nudgeRight")} /> {copy.mistakeBodyC} {MOD_KEY} + Z{" "}
        {copy.mistakeBodyD}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{copy.lineLevel}</h4>
      <p className={PROSE}>{copy.lineLevelBody}</p>
    </div>

    <div>
      <h4 className={HEADING}>{copy.resync}</h4>
      <p className={PROSE}>{copy.resyncBody}</p>
    </div>

    <div>
      <h4 className={HEADING}>{copy.split}</h4>
      <p className={PROSE}>{copy.splitBody}</p>
    </div>

    <p className={PROSE}>{copy.outro}</p>
  </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { SyncSection };
