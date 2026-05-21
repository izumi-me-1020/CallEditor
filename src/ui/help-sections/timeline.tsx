import { useAppLanguage } from "@/lib/i18n";
import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { HEADING, PROSE } from "@/ui/help-sections/shared";
import { InlineKeyBadge } from "@/ui/inline-key-badge";
import { ALT_KEY, MOD_KEY } from "@/utils/platform";

// -- Timeline -----------------------------------------------------------------

const COPY = {
  en: {
    intro:
      "The Timeline is where you do the detailed work. While the Sync tab is great for tapping out rough timing, Timeline gives you full control over every word.",
    layout: "Layout",
    layoutBody:
      "The waveform sits at the top. Below it, each call line is a horizontal track. Word blocks sit on the tracks, positioned by their start and end times. The playhead follows the audio. The gutter on the left shows line numbers and agent colors.",
    navigation: "Navigation",
    navList: [
      "A plain scroll wheel scrolls vertically through the lines. To move through time, scroll horizontally with a trackpad gesture.",
      'Turn on "Scroll wheel scrolls timeline" in Settings → Timeline to swap the axes: a plain wheel then scrolls the timeline horizontally and Shift + wheel scrolls vertically.',
      "Scroll the wheel while the cursor is over the waveform strip to scrub the playhead through time, and the view follows it.",
      `${MOD_KEY} + scroll wheel zooms in and out.`,
      "Middle-click and drag pans freely. Hold Shift while middle-dragging to lock to one axis.",
      "Drag the playhead near the left or right edge of the viewport and the view auto-scrolls in that direction.",
      "The follow-playhead shortcut toggles automatic scrolling during playback.",
    ],
    selecting: "Selecting words",
    selectingList: [
      `Click a word block to select it. ${MOD_KEY} + Click adds or removes it from selection.`,
      "Shift + Click a syllable to select every syllable in that word's group.",
      "Click and drag on empty space to marquee-select multiple words.",
      "Hold Shift while dragging to add to the existing selection.",
      "The select-at-playhead shortcut picks the word under the current playhead, and pressing it again cycles overlapping words.",
      "Press Escape to deselect everything.",
    ],
    editing: "Editing words",
    editingList: [
      "Double-click a word block to edit its text inline. Enter confirms, Escape cancels.",
      "Double-click empty track space to create a new word at that position.",
      "The edit shortcut starts inline editing for the selected word.",
      "Set-begin / set-end shortcuts snap a word edge to the current playhead position.",
      "Nudge shortcuts move selected words as a group while preserving duration and preventing overlap.",
    ],
    copy: "Copy, cut, paste",
    copyList: [
      `${MOD_KEY} + C / X / V works as expected. Pasting shows a ghost preview that you click to place.`,
      `${ALT_KEY} + drag duplicates the current selection.`,
      "Delete or Backspace removes selected words.",
    ],
    boundary: "Boundary dragging",
    boundaryList: [
      "Flush syllables share one boundary. Drag either edge and both move together until a gap opens.",
      `Hold ${ALT_KEY} while dragging to invert the current mode.`,
      `${ALT_KEY} can be toggled mid-drag.`,
      "Rolling edit keeps the outer edges fixed while moving a shared boundary between adjacent words.",
    ],
    snap: "Snap (magnet)",
    snapBody:
      "Dragging or resizing a word can snap its edges to nearby anchors: other word edges, line edges for line-level sync, and the playhead. Snapped words show a yellow halo and a dashed guide line.",
    snapList: [
      "Use the shortcut or toolbar magnet to toggle snap.",
      `Hold ${MOD_KEY} mid-drag to bypass snap temporarily.`,
      "Snap distance is configurable in Settings → Timeline.",
      "Snap never forces a block to overlap a neighbor.",
    ],
    split: "Splitting and merging",
    splitList: [
      "The split-syllable shortcut opens the splitter in syllable mode. Click between letters to place breaks.",
      "The split-word shortcut creates separate independent words rather than linked syllables.",
      "Merge syllables collapses a split word back into one span.",
      "Merge words combines adjacent words on the same line into one block.",
    ],
    syllables: "Syllable timing",
    syllablesBody:
      "Syllables can be flush or separated by gaps. Gaps are useful for staccato delivery and for per-character timing in Japanese, Chinese, or Korean calls. The Snap syllables flush action closes those gaps across a line.",
    explicit: "Explicit words",
    explicitA:
      "Mark a word as explicit so the export carries the right flag. Use the explicit shortcut or the right-click menu.",
    explicitB:
      'CallEditor also suggests likely explicit words above the timeline. Confirm, mark all, or dismiss false positives. Exported words carry calleditor:explicit="true".',
    menus: "Right-click menus",
    menusList: [
      "Word menu: edit text, split syllables, split word, merge words, merge syllables, snap syllables flush, mark explicit, group this line, split into words, delete word.",
      "Empty track menu: add word here.",
      "Gutter menu: add line above or below, assign agent, delete line.",
      "Group banner menu: add instance, shift to playhead, rename, recolor, detach instance, delete group.",
    ],
    groups: "Linked groups",
    groupsBody:
      "Use groups for repeated sections such as chorus or bridge. The Linked groups section in this help modal explains the full workflow.",
    toolbar: "Header toolbar",
    toolbarList: [
      "Follow: auto-scrolls to keep the playhead visible.",
      "Rolling: enables the rolling edit tool.",
      "Preview: opens the live preview sidebar.",
      `Snap: toggles the magnet. Hold ${MOD_KEY} while dragging to bypass.`,
      "Import: opens call import directly from Timeline.",
      `Zoom: use the +/- buttons or ${MOD_KEY} + scroll wheel.`,
    ],
    other: "Other features",
    otherList: [
      "The insert-line-below shortcut adds a new empty line under the selected word.",
      "The info panel at the bottom shows details for the selected word, including background text editing.",
    ],
  },
  ja: {
    intro:
      "Timeline は細かい編集をする場所です。Sync タブが大まかなタイミング取りに向いているのに対して、Timeline では各単語をより正確に扱えます。",
    layout: "レイアウト",
    layoutBody:
      "上部に波形、その下にコール行ごとの横トラックが並びます。単語ブロックは開始・終了時刻に基づいて配置されます。playhead は音声に追従し、左側ガターには行番号とエージェント色が表示されます。",
    navigation: "ナビゲーション",
    navList: [
      "通常のホイールは行方向に縦スクロールします。時間方向へ動くにはトラックパッドの横スクロールを使います。",
      "Settings → Timeline の「Scroll wheel scrolls timeline」を有効にすると軸が入れ替わり、通常ホイールで横スクロール、Shift + ホイールで縦スクロールになります。",
      "カーソルを波形帯の上に置いてホイールすると playhead をスクラブでき、表示も追従します。",
      `${MOD_KEY} + ホイールでズームします。`,
      "中クリック＋ドラッグで自由にパンできます。Shift を押しながらだと 1 軸に固定されます。",
      "playhead を表示端近くまでドラッグすると、その方向へ自動スクロールします。",
      "follow-playhead ショートカットで再生中の自動追従を切り替えられます。",
    ],
    selecting: "単語選択",
    selectingList: [
      `単語ブロックをクリックすると選択されます。${MOD_KEY} + クリックで追加・解除できます。`,
      "音節を Shift + クリックすると、その単語グループ内の音節をまとめて選択できます。",
      "空き領域をドラッグすると矩形選択できます。",
      "Shift を押しながらドラッグすると既存選択に追加されます。",
      "playhead 上の単語を選ぶショートカットは、現在位置の単語を選び、再度押すと重なっている別単語へ切り替わります。",
      "Escape ですべての選択を解除します。",
    ],
    editing: "単語編集",
    editingList: [
      "単語ブロックをダブルクリックするとその場でテキスト編集できます。Enter で確定、Escape でキャンセルです。",
      "空きトラックをダブルクリックすると、その位置に新しい単語を作れます。",
      "編集ショートカットでもインライン編集を始められます。",
      "begin / end を設定するショートカットで、単語端を現在の playhead へ合わせられます。",
      "nudge ショートカットは複数選択単語を長さを保ったまままとめて前後に動かし、隣接単語とは重なりません。",
    ],
    copy: "コピー・切り取り・貼り付け",
    copyList: [
      `${MOD_KEY} + C / X / V が使えます。貼り付け時はゴーストプレビューが出て、クリックで配置します。`,
      `${ALT_KEY} + ドラッグで選択を複製できます。`,
      "Delete または Backspace で選択単語を削除します。",
    ],
    boundary: "境界のドラッグ",
    boundaryList: [
      "ぴったり接している音節は境界を共有します。どちらの端をドラッグしても一緒に動き、隙間ができるまで接したままです。",
      `${ALT_KEY} を押しながらドラッグすると現在モードを反転できます。`,
      `${ALT_KEY} はドラッグ中に切り替えても反映されます。`,
      "Rolling edit を有効にすると、隣接語の共有境界だけを動かして外側の端は固定したままにできます。",
    ],
    snap: "スナップ（磁石）",
    snapBody:
      "単語をドラッグ・リサイズすると、他単語の端、行端、playhead など近いアンカーに吸着できます。吸着中は黄色のハイライトと破線ガイドが表示されます。",
    snapList: [
      "ショートカットまたはツールバーの磁石でスナップを切り替えられます。",
      `${MOD_KEY} を押しながらドラッグすると一時的にスナップを無効化できます。`,
      "スナップ距離は Settings → Timeline で変更できます。",
      "スナップによって隣接ブロックにめり込むことはありません。",
    ],
    split: "分割と結合",
    splitList: [
      "音節分割ショートカットで syllable mode の splitter が開きます。文字間をクリックして分割位置を作ります。",
      "単語分割ショートカットは、リンク音節ではなく independent words として分けます。",
      "Merge syllables で分割した音節を 1 単語へ戻せます。",
      "Merge words は同じ行の隣接単語を 1 ブロックにまとめます。",
    ],
    syllables: "音節タイミング",
    syllablesBody:
      "音節は隙間なく並べることも、間を空けることもできます。スタッカート気味の歌い方や、日本語・中国語・韓国語の文字単位タイミングに便利です。Snap syllables flush でその行の隙間を閉じられます。",
    explicit: "explicit 単語",
    explicitA:
      "単語を explicit としてマークすると、エクスポート時に正しいフラグが付きます。explicit ショートカットか右クリックメニューを使います。",
    explicitB:
      'CallEditor は explicit らしい単語を Timeline 上部でも提案します。個別承認、一括承認、誤検出の dismiss ができ、出力では calleditor:explicit="true" が付きます。',
    menus: "右クリックメニュー",
    menusList: [
      "単語メニュー: edit text、split syllables、split word、merge words、merge syllables、snap syllables flush、mark explicit、group this line、split into words、delete word。",
      "空トラックメニュー: add word here。",
      "ガターメニュー: add line above/below、assign agent、delete line。",
      "グループバナーメニュー: add instance、shift to playhead、rename、recolor、detach instance、delete group。",
    ],
    groups: "リンクグループ",
    groupsBody:
      "サビやブリッジのような繰り返し区間はグループ化できます。詳しい流れはこのヘルプ内の Linked groups を見てください。",
    toolbar: "ヘッダーツールバー",
    toolbarList: [
      "Follow: playhead が見えるように自動スクロールします。",
      "Rolling: rolling edit ツールを有効にします。",
      "Preview: 右側のライブプレビューを開きます。",
      `Snap: 磁石を切り替えます。ドラッグ中に ${MOD_KEY} を押すと一時無効化できます。`,
      "Import: Timeline から直接コールインポートを開きます。",
      `Zoom: +/- ボタンか ${MOD_KEY} + ホイールを使います。`,
    ],
    other: "その他の機能",
    otherList: [
      "insert-line-below ショートカットで、選択単語の下に空行を追加できます。",
      "下部の info panel では選択単語の詳細や、背景テキスト編集を行えます。",
    ],
  },
  ko: {
    intro:
      "Timeline은 세밀한 편집을 하는 곳입니다. Sync 탭이 대략적인 타이밍을 찍기에 좋다면, Timeline은 각 단어를 훨씬 정밀하게 다룰 수 있습니다.",
    layout: "레이아웃",
    layoutBody:
      "상단에는 파형이 있고, 그 아래에는 콜 줄마다 가로 트랙이 배치됩니다. 단어 블록은 시작/끝 시간에 따라 놓입니다. playhead는 오디오를 따라가고, 왼쪽 거터에는 줄 번호와 에이전트 색이 표시됩니다.",
    navigation: "탐색",
    navList: [
      "일반 휠은 줄 방향으로 세로 스크롤합니다. 시간축으로 이동하려면 트랙패드의 가로 스크롤 제스처를 사용하세요.",
      "Settings → Timeline의 “Scroll wheel scrolls timeline”을 켜면 축이 바뀌어 일반 휠이 가로 스크롤, Shift + 휠이 세로 스크롤이 됩니다.",
      "커서를 파형 스트립 위에 두고 휠을 굴리면 playhead를 스크럽할 수 있고 화면도 따라옵니다.",
      `${MOD_KEY} + 휠로 확대/축소합니다.`,
      "가운데 클릭 드래그로 자유롭게 패닝할 수 있습니다. Shift를 누르면 한 축으로 고정됩니다.",
      "playhead를 화면 가장자리 가까이로 드래그하면 그 방향으로 자동 스크롤됩니다.",
      "follow-playhead 단축키로 재생 중 자동 추적을 켜고 끌 수 있습니다.",
    ],
    selecting: "단어 선택",
    selectingList: [
      `단어 블록을 클릭하면 선택됩니다. ${MOD_KEY} + 클릭으로 선택에 추가하거나 제거할 수 있습니다.`,
      "음절을 Shift + 클릭하면 그 단어 그룹의 모든 음절이 함께 선택됩니다.",
      "빈 공간을 드래그하면 여러 단어를 박스 선택할 수 있습니다.",
      "Shift를 누른 채 드래그하면 기존 선택에 추가됩니다.",
      "playhead 단어 선택 단축키는 현재 위치의 단어를 고르고, 다시 누르면 겹치는 다른 단어로 순환합니다.",
      "Escape로 선택을 모두 해제합니다.",
    ],
    editing: "단어 편집",
    editingList: [
      "단어 블록을 더블클릭하면 인라인으로 텍스트를 편집할 수 있습니다. Enter 저장, Escape 취소입니다.",
      "빈 트랙 공간을 더블클릭하면 그 위치에 새 단어를 만들 수 있습니다.",
      "편집 단축키로도 선택 단어의 인라인 편집을 시작할 수 있습니다.",
      "begin / end 설정 단축키는 단어의 가장자리를 현재 playhead 위치에 맞춥니다.",
      "nudge 단축키는 선택된 단어들을 길이를 유지한 채 함께 이동시키며, 이웃 단어와 겹치지 않게 막아 줍니다.",
    ],
    copy: "복사, 잘라내기, 붙여넣기",
    copyList: [
      `${MOD_KEY} + C / X / V를 사용할 수 있습니다. 붙여넣을 때는 고스트 미리보기가 나타나고 클릭해서 배치합니다.`,
      `${ALT_KEY} + 드래그로 현재 선택을 복제할 수 있습니다.`,
      "Delete 또는 Backspace로 선택 단어를 삭제합니다.",
    ],
    boundary: "경계 드래그",
    boundaryList: [
      "딱 붙어 있는 음절은 하나의 경계를 공유합니다. 어느 쪽 가장자리를 끌어도 함께 움직이다가 틈이 생기면 분리됩니다.",
      `${ALT_KEY}를 누른 채 드래그하면 현재 모드를 반전할 수 있습니다.`,
      `${ALT_KEY}는 드래그 중간에도 전환할 수 있습니다.`,
      "Rolling edit를 켜면 인접 단어의 외곽은 고정한 채 공유 경계만 움직일 수 있습니다.",
    ],
    snap: "스냅(자석)",
    snapBody:
      "단어를 드래그하거나 크기를 조절할 때 다른 단어의 가장자리, 줄 끝, playhead 같은 가까운 앵커에 붙을 수 있습니다. 스냅되면 노란 하이라이트와 점선 가이드가 표시됩니다.",
    snapList: [
      "단축키나 툴바의 자석 버튼으로 스냅을 켜고 끌 수 있습니다.",
      `${MOD_KEY}를 누른 채 드래그하면 일시적으로 스냅을 무시할 수 있습니다.`,
      "스냅 거리 설정은 Settings → Timeline에서 바꿀 수 있습니다.",
      "스냅 때문에 이웃 블록과 겹치도록 강제로 밀어 넣지는 않습니다.",
    ],
    split: "분할과 병합",
    splitList: [
      "음절 분할 단축키는 syllable mode의 splitter를 엽니다. 글자 사이를 클릭해 분할 지점을 만듭니다.",
      "단어 분할 단축키는 linked syllable이 아니라 separate independent words로 나눕니다.",
      "Merge syllables는 분할된 음절을 다시 하나의 단어로 합칩니다.",
      "Merge words는 같은 줄의 인접 단어를 하나의 블록으로 병합합니다.",
    ],
    syllables: "음절 타이밍",
    syllablesBody:
      "음절은 딱 붙게 둘 수도 있고 사이에 간격을 둘 수도 있습니다. 스타카토한 발음이나 일본어, 중국어, 한국어의 글자 단위 타이밍에 유용합니다. Snap syllables flush로 그 줄의 간격을 닫을 수 있습니다.",
    explicit: "explicit 단어",
    explicitA:
      "단어를 explicit로 표시하면 내보낼 때 올바른 플래그가 실립니다. explicit 단축키나 우클릭 메뉴를 사용하세요.",
    explicitB:
      'CallEditor는 explicit일 가능성이 높은 단어도 Timeline 상단에서 제안합니다. 개별 승인, 모두 표시, 오탐 dismiss가 가능하며, 출력에는 calleditor:explicit="true"가 들어갑니다.',
    menus: "우클릭 메뉴",
    menusList: [
      "단어 메뉴: edit text, split syllables, split word, merge words, merge syllables, snap syllables flush, mark explicit, group this line, split into words, delete word.",
      "빈 트랙 메뉴: add word here.",
      "거터 메뉴: add line above/below, assign agent, delete line.",
      "그룹 배너 메뉴: add instance, shift to playhead, rename, recolor, detach instance, delete group.",
    ],
    groups: "링크 그룹",
    groupsBody:
      "후렴이나 브리지처럼 반복되는 구간은 그룹화할 수 있습니다. 자세한 흐름은 이 도움말의 Linked groups 섹션을 보세요.",
    toolbar: "헤더 툴바",
    toolbarList: [
      "Follow: playhead가 보이도록 자동 스크롤합니다.",
      "Rolling: rolling edit 도구를 켭니다.",
      "Preview: 오른쪽 라이브 미리보기를 엽니다.",
      `Snap: 자석을 토글합니다. 드래그 중 ${MOD_KEY}를 누르면 일시적으로 해제됩니다.`,
      "Import: Timeline에서 바로 콜 가져오기를 엽니다.",
      `Zoom: +/- 버튼이나 ${MOD_KEY} + 휠을 사용합니다.`,
    ],
    other: "기타 기능",
    otherList: [
      "insert-line-below 단축키로 선택한 단어 아래에 새 빈 줄을 넣을 수 있습니다.",
      "하단 info panel에는 선택 단어의 세부 정보와 background 텍스트 편집 기능이 표시됩니다.",
    ],
  },
} as const;

const TimelineSection: React.FC = () => {
  const { language } = useAppLanguage();
  const copy = COPY[language];

  return (
    <div className="space-y-5">
      <p className={PROSE}>{copy.intro}</p>

      <div>
        <h4 className={HEADING}>{copy.layout}</h4>
        <p className={PROSE}>{copy.layoutBody}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.navigation}</h4>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          {copy.navList.slice(0, 6).map((item) => (
            <li key={item}>{item}</li>
          ))}
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.toggleFollow")}
            />
            : {copy.navList[6]}
          </li>
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.selecting}</h4>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          {copy.selectingList.slice(0, 4).map((item) => (
            <li key={item}>{item}</li>
          ))}
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.selectWordAtPlayhead")}
            />
            : {copy.selectingList[4]}
          </li>
          <li>{copy.selectingList[5]}</li>
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.editing}</h4>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          <li>{copy.editingList[0]}</li>
          <li>{copy.editingList[1]}</li>
          <li>
            <InlineKeyBadge keys={getEffectiveKeysArray("timeline.editWord")} />
            : {copy.editingList[2]}
          </li>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.setWordBegin")}
            />{" "}
            /{" "}
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.setWordEnd")}
            />
            : {copy.editingList[3]}
          </li>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.nudgeLeft")}
            />{" "}
            /{" "}
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.nudgeRight")}
            />
            : {copy.editingList[4]}
          </li>
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.copy}</h4>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          {copy.copyList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.boundary}</h4>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          {copy.boundaryList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.snap}</h4>
        <p className={PROSE}>{copy.snapBody}</p>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.toggleSnap")}
            />
            : {copy.snapList[0]}
          </li>
          {copy.snapList.slice(1).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.split}</h4>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.splitSyllable")}
            />
            : {copy.splitList[0]}
          </li>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.splitWord")}
            />
            : {copy.splitList[1]}
          </li>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.mergeSyllablesIntoWord")}
            />
            : {copy.splitList[2]}
          </li>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.mergeWords")}
            />
            : {copy.splitList[3]}
          </li>
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.syllables}</h4>
        <p className={PROSE}>{copy.syllablesBody}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.explicit}</h4>
        <p className={PROSE}>
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.toggleExplicit")}
          />
          : {copy.explicitA}
        </p>
        <p className={`${PROSE} mt-2`}>{copy.explicitB}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.menus}</h4>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          {copy.menusList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.groups}</h4>
        <p className={PROSE}>{copy.groupsBody}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.toolbar}</h4>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          <li>
            <strong>Follow</strong> (
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.toggleFollow")}
            />
            ): {copy.toolbarList[0]}
          </li>
          <li>
            <strong>Rolling</strong> (
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.toggleRollingEdit")}
            />
            ): {copy.toolbarList[1]}
          </li>
          <li>
            <strong>Preview</strong> (
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.togglePreview")}
            />
            ): {copy.toolbarList[2]}
          </li>
          <li>
            <strong>Snap</strong> (
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.toggleSnap")}
            />
            ): {copy.toolbarList[3]}
          </li>
          <li>
            <strong>Import</strong> (
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.importLyrics")}
            />
            ): {copy.toolbarList[4]}
          </li>
          <li>
            <strong>Zoom</strong>: {copy.toolbarList[5]}
          </li>
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.other}</h4>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.insertLineBelow")}
            />
            : {copy.otherList[0]}
          </li>
          <li>{copy.otherList[1]}</li>
        </ul>
      </div>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { TimelineSection };
