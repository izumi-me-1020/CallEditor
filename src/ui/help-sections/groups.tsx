import { useAppLanguage } from "@/lib/i18n";
import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { HEADING, PROSE } from "@/ui/help-sections/shared";
import { InlineKeyBadge } from "@/ui/inline-key-badge";
import { MOD_KEY } from "@/utils/platform";

// -- Linked Groups ------------------------------------------------------------

const COPY = {
  en: {
    intro:
      "A group is a set of contiguous lines that repeat in the song (chorus, verse, bridge). Group them once and edits to text, splits, agents, or background vocals propagate to every instance. Each instance still owns its own absolute timing, so you can shift one chorus by 5 seconds without moving the others.",
    why: "Why bother",
    whyBody:
      "If your song repeats the chorus four times, you'd otherwise edit four copies of every lyric tweak. Group them and a fix in one place lands in all four. Same for splitting a syllable, switching a word to background vocals, or reassigning an agent.",
    create: "Creating a group",
    createBodyA: "Press",
    createBodyB: ", or right-click any selected line and pick “Group N lines”.",
    createList: [
      "Select the lines you want to group (click, then Shift-click the last line, or drag down the gutter).",
      "If your selection skips a line by accident, CallEditor fills the gap and tells you so in the toast. If a line in the gap already belongs to another group, it refuses and asks you to fix the selection.",
      "The new group gets a color from the palette and shows up as a banner above the first line.",
    ],
    add: "Adding more instances",
    addBodyA: "Click the banner of the instance you want to copy, then press",
    addBodyB:
      "(or right-click the banner and pick “Add instance at playhead”). CallEditor picks one of three landings, in this order:",
    addList: [
      "Fills empty placeholder rows in place if a matching run of empty rows sits right after the last timed line ending at or before the playhead. Nothing shifts down, the placeholders just light up.",
      "Inserts new rows at the playhead if there's no fillable run but the playhead falls in a clean time gap big enough for the instance.",
      `Copies the instance to the clipboard and opens the paste-preview ghost if the playhead is inside a playing line, the gap is too small, or you've already passed the last lyric. Toast says where to go next: “No room at the playhead. ${MOD_KEY} + V to paste somewhere clear.”`,
    ],
    addBodyC: `You can also use the regular clipboard: select every word of an instance (${MOD_KEY} + C with the banner selected), then paste (${MOD_KEY} + V) somewhere else. Same fill/insert behavior at the destination.`,
    banner: "The banner",
    bannerList: [
      `Click anywhere on it: selects every word in the instance. Use this before arrow-key nudge, ${MOD_KEY} + C, or any of the keyboard shortcuts below.`,
      "Drag horizontally: shifts the entire instance in time. Sibling instances stay put. The lines move along with the banner so you can line things up by eye.",
      "Click the chevron: collapses the instance into a single strip. A faint progress bar fills the strip during playback so you can still tell where you are in the section.",
      "Right-click: opens the group menu (rename, recolor, add instance, shift to playhead, detach instance, delete group).",
      "Double-click anywhere on the header row: renames the group inline. Enter saves, Escape cancels.",
      "Hover the “1 of N” badge: every sibling instance pings briefly with the group’s color so you can spot them on the timeline. The ping shortcut does the same thing from the keyboard.",
    ],
    shortcuts: "Keyboard shortcuts",
    shortcutsBody:
      "Most of these act on the instance containing your current selection. Click a banner first to focus an instance.",
    shortcutsFooter: "All of these are remappable in Settings → Shortcuts.",
    shortcutItems: [
      "group selected lines.",
      "add a linked instance at the playhead.",
      "collapse the current instance or every instance.",
      "jump to the previous or next instance of the same group.",
      "nudge the current instance by the setting amount.",
      "ping sibling instances.",
      "detach the current instance.",
      "delete the current group.",
      "shift the instance so its first word lands on the playhead.",
      "scroll to the instance start without changing selection.",
    ],
    suggestions: "Suggestions banner",
    suggestionsA:
      "When the timeline detects two or more contiguous runs of identical lines that aren't grouped yet, a small bulb banner appears under the toolbar. One suggestion shows inline with a Group them button. Multiple suggestions collapse into a Review N button that opens a modal with each block previewed and a per-row Group / dismiss action, plus a Group all button.",
    suggestionsB:
      "Dismissals are per-project and content-based, so adding or removing unrelated lines elsewhere will not bring a suggestion back. Editing the text inside a dismissed block does, since the structure has changed.",
    paste: "Pasting between instances",
    pasteA:
      "Two paste flows can land in an instance, and both behave the same way at the destination:",
    pasteList: [
      "Copy every word of an existing instance and paste somewhere. CallEditor treats the clipboard as a known instance and links the destination automatically.",
      "Copy every word of standalone lines whose text and word splits already match an existing template. CallEditor asks “Link as another [Chorus]?” Yes links, No falls back to a regular word paste.",
    ],
    pasteB:
      "In both cases the destination is filled in place if there are enough empty rows starting at the cursor. If there aren't, CallEditor asks before inserting new rows, since that would shift everything below down by N. Add rows in the Edit view first if you want predictable layout.",
    propagate: "What propagates and what doesn't",
    linkedLead: "Linked across all instances:",
    linkedList: [
      "Word text and line text edits.",
      "Agent assignments.",
      "Background vocal text.",
      "Word splits and merges. Siblings get the new word structure, and CallEditor keeps the timing of every word that didn't actually change. Only the split or merged word's slot is divided up.",
      "Moving a word between main and background tracks.",
    ],
    localLead: "Stays local to one instance:",
    localList: [
      "Absolute begin and end times for each word.",
      "Banner shifts and arrow-key nudge.",
      "Anything you do on a line that's been detached.",
    ],
    prompt: "The split-or-merge prompt",
    promptA:
      "When a split or merge on a linked line would actually shift sibling word timings, CallEditor pops a three-button modal: Apply to all, Detach, or Cancel.",
    promptB:
      "Tick “Don't ask again” in the modal to default to your choice next time. Reset the preference from Settings → Confirmations.",
    detach: "Detaching",
    detachA:
      "Real songs aren't perfectly repetitive. The last chorus might add an extra “yeah” or land on a different agent. Two ways to break the link:",
    detachList: [
      "Right-click a line in the gutter and pick Detach this line. That single line stops syncing with siblings; everything else stays linked.",
      "Right-click the banner and pick Detach instance. The whole instance becomes plain standalone lines.",
    ],
    detachB: `Both are undoable: the toast that appears has an Undo button, or press ${MOD_KEY} + Z.`,
    empty: "Emptying an instance",
    emptyA:
      "Click the banner to select every word in an instance, then press Delete. CallEditor clears the timed content and notices the instance is now empty across all its lines, so it strips the group attrs from those rows automatically. You're left with empty placeholders that the fill flow above can repopulate later.",
    emptyB:
      "Partial deletes don't trigger this: if one line of a multi-line instance still has timed words, the instance stays linked.",
    delete: "Deleting a group",
    deleteBody:
      "Right-click any banner and pick Delete group. A confirmation modal warns you that all instances will become standalone. Tick “Don't ask again” to skip the modal next time, or restore the prompt from Settings → Confirmations.",
    outside: "How groups look outside the Timeline",
    outsideList: [
      "Edit view: a colored divider with the group name and instance count appears before each instance, plus a thin closing line at the end.",
      "Sync view: the gutter cell shows a chain icon and an instance counter so you know which chorus you're syncing.",
      "TTML export: groups round-trip via a custom calleditor:groups registry plus per-line attributes. Other TTML players ignore them; CallEditor reads them back exactly as saved.",
    ],
  },
  ja: {
    intro:
      "グループは、曲の中で繰り返される連続行のまとまりです（サビ、A メロ、ブリッジなど）。一度グループ化すると、テキスト、分割、エージェント、バックボーカルの編集がすべてのインスタンスに反映されます。各インスタンスは絶対時刻だけは個別に持つので、あるサビだけ 5 秒ずらしても他は動きません。",
    why: "グループ化する理由",
    whyBody:
      "同じサビが 4 回出る曲なら、通常は歌詞修正を 4 箇所に入れる必要があります。グループ化すれば 1 箇所の修正が全部に反映されます。音節分割、単語のバックボーカル化、エージェント変更も同じです。",
    create: "グループの作成",
    createBodyA: "",
    createBodyB:
      "を押すか、選択行を右クリックして「Group N lines」を選びます。",
    createList: [
      "グループにしたい行を選択します。最初の行をクリックして最後の行を Shift+クリックするか、ガターをドラッグします。",
      "途中の行を飛ばしていても CallEditor が補完できる場合は補完して通知します。補完部分に別グループの行がある場合は拒否されます。",
      "新しいグループにはパレットから色が付き、最初の行の上にバナーが出ます。",
    ],
    add: "インスタンスを増やす",
    addBodyA: "複製したいインスタンスのバナーをクリックしてから",
    addBodyB:
      "を押します（またはバナーを右クリックして「Add instance at playhead」）。配置先は次の順で選ばれます。",
    addList: [
      "playhead 以前で最後のタイミング済み行の直後に十分な空行があれば、その空行をその場で埋めます。",
      "空行がなくても、playhead が十分広い時間ギャップにあれば新しい行をそこへ挿入します。",
      `playhead が再生中の行の中にある、隙間が足りない、最後の歌詞を通り過ぎている場合はクリップボードへコピーされ、貼り付けゴーストが開きます。トーストには「No room at the playhead. ${MOD_KEY} + V to paste somewhere clear.」のように次の案内が出ます。`,
    ],
    addBodyC: `通常のコピー＆ペーストも使えます。バナー選択状態で ${MOD_KEY} + C、貼り付け先で ${MOD_KEY} + V を押すと、同じ fill / insert ルールで配置されます。`,
    banner: "バナーの使い方",
    bannerList: [
      `バナーのどこかをクリック: そのインスタンス内の単語をすべて選択します。${MOD_KEY} + C や矢印での nudge 前に使います。`,
      "横にドラッグ: そのインスタンス全体を時間方向に移動します。兄弟インスタンスは動きません。",
      "シェブロンをクリック: インスタンスを 1 本の帯に折りたたみます。再生中は薄い進行バーが出ます。",
      "右クリック: rename、recolor、add instance、shift to playhead、detach instance、delete group などのメニューが開きます。",
      "ヘッダー行をダブルクリック: その場でグループ名を変更できます。Enter で保存、Escape でキャンセルです。",
      "「1 of N」バッジをホバー: 兄弟インスタンスがグループ色で一瞬光り、タイムライン上で見つけやすくなります。",
    ],
    shortcuts: "ショートカット",
    shortcutsBody:
      "多くは現在の選択が属するインスタンスに対して働きます。先にバナーをクリックしてフォーカスしてください。",
    shortcutsFooter:
      "これらのショートカットはすべて Settings → Shortcuts で変更できます。",
    shortcutItems: [
      "選択中の行をグループ化します。",
      "playhead にリンクインスタンスを追加します。",
      "現在のインスタンス、または全インスタンスを折りたたみます。",
      "同じグループの前後インスタンスへ移動します。",
      "現在のインスタンスを設定量だけ前後にずらします。",
      "兄弟インスタンスを点滅表示します。",
      "現在のインスタンスをグループから切り離します。",
      "現在のグループを削除します。",
      "インスタンス先頭語が playhead に来るように移動します。",
      "選択を変えずにインスタンス先頭までスクロールします。",
    ],
    suggestions: "提案バナー",
    suggestionsA:
      "Timeline が未グループの同一行ブロックを 2 つ以上検出すると、ツールバー下に電球アイコンの提案バナーが出ます。1 件ならその場で Group them ボタン、複数なら Review N ボタンから一覧モーダルを開けます。",
    suggestionsB:
      "dismiss はプロジェクトごと・内容ごとに記録されます。別の場所で無関係な行を増減しても戻りませんが、dismiss したブロックの本文を変えると構造変化として再提案されます。",
    paste: "インスタンス間の貼り付け",
    pasteA:
      "インスタンスに着地する貼り付けは 2 パターンありますが、どちらも到着先での挙動は同じです。",
    pasteList: [
      "既存インスタンスの全単語をコピーして貼り付けると、CallEditor は既知インスタンスとして自動リンクします。",
      "既存テンプレートと同じテキスト・同じ単語分割を持つ通常行をコピーすると、「Link as another [Chorus]?」と聞かれます。",
    ],
    pasteB:
      "十分な空行がカーソル位置から続いていればその場で埋められます。足りない場合は下を押し下げる前に確認が出ます。レイアウトを安定させたいなら先に Edit で行を足しておくのがおすすめです。",
    propagate: "何が伝播して何が伝播しないか",
    linkedLead: "全インスタンスに伝播するもの:",
    linkedList: [
      "単語テキスト、行テキストの編集。",
      "エージェント割り当て。",
      "バックボーカルのテキスト。",
      "単語の分割・結合。変わっていない単語のタイミングは維持され、実際に分割・結合した部分だけが組み替えられます。",
      "単語をメイン / バックグラウンド間で移す操作。",
    ],
    localLead: "インスタンスごとにローカルなもの:",
    localList: [
      "各単語の絶対 begin / end 時刻。",
      "バナー移動や矢印での nudge。",
      "detach 済みの行への操作。",
    ],
    prompt: "分割・結合時の確認",
    promptA:
      "リンク行で分割や結合をすると兄弟インスタンスのタイミングまで動いてしまう場合、Apply to all / Detach / Cancel の 3 ボタンモーダルが出ます。",
    promptB:
      "「Don't ask again」を付けると次回以降その選択が既定になります。Settings → Confirmations から戻せます。",
    detach: "リンク解除",
    detachA:
      "実際の曲は完全には同じ繰り返しになりません。最後のサビだけ「yeah」が増えたり、歌う人が変わったりします。解除方法は 2 つあります。",
    detachList: [
      "ガターで行を右クリックして「Detach this line」を選ぶと、その 1 行だけが兄弟との同期をやめます。",
      "バナーを右クリックして「Detach instance」を選ぶと、そのインスタンス全体が通常行になります。",
    ],
    detachB: `どちらも undo できます。表示されたトーストの Undo か ${MOD_KEY} + Z を使ってください。`,
    empty: "インスタンスを空にする",
    emptyA:
      "バナーをクリックしてインスタンス内の全単語を選び、Delete を押すと、そのインスタンスだけが空プレースホルダーに戻ります。CallEditor は全行が空になったことを検出してグループ属性も自動で外します。",
    emptyB:
      "一部だけ削除した場合はこの処理は起きません。複数行インスタンスの 1 行にでも単語が残っていればリンクは維持されます。",
    delete: "グループ削除",
    deleteBody:
      "バナーを右クリックして Delete group を選びます。すべてのインスタンスが通常行になることを確認するモーダルが出ます。「Don't ask again」を付けると次回から省略できます。",
    outside: "Timeline 以外での見え方",
    outsideList: [
      "Edit view: 各インスタンスの前にグループ名と件数付きの色付き区切りが出ます。",
      "Sync view: ガターにチェーンアイコンとインスタンス番号が表示されます。",
      "TTML export: custom な calleditor:groups レジストリと行属性で往復保存されます。他の TTML プレイヤーは無視し、CallEditor はそのまま読み戻します。",
    ],
  },
  ko: {
    intro:
      "그룹은 곡 안에서 반복되는 연속된 줄 묶음입니다(후렴, 벌스, 브리지 등). 한 번 그룹화하면 텍스트, 분할, 에이전트, 백보컬 편집이 모든 인스턴스에 전파됩니다. 각 인스턴스는 절대 타이밍은 따로 가지므로, 한 후렴만 5초 밀어도 다른 인스턴스는 움직이지 않습니다.",
    why: "왜 그룹을 쓰나",
    whyBody:
      "후렴이 네 번 반복되는 곡이라면 원래는 같은 가사 수정을 네 군데에 해야 합니다. 그룹화하면 한 곳의 수정이 전부에 반영됩니다. 음절 분할, 단어를 백보컬로 바꾸는 것, 에이전트 재할당도 같습니다.",
    create: "그룹 만들기",
    createBodyA: "",
    createBodyB:
      "를 누르거나 선택한 줄을 우클릭해 “Group N lines”를 선택합니다.",
    createList: [
      "그룹으로 묶을 줄을 선택합니다. 첫 줄을 클릭하고 마지막 줄을 Shift+클릭하거나, 거터를 드래그하세요.",
      "선택 중간에 한 줄을 빼먹어도 CallEditor가 메울 수 있으면 메우고 토스트로 알려줍니다. 그 구간에 다른 그룹 줄이 있으면 거부합니다.",
      "새 그룹은 팔레트 색을 받고 첫 줄 위에 배너로 나타납니다.",
    ],
    add: "인스턴스 더 추가하기",
    addBodyA: "복사할 인스턴스의 배너를 클릭한 다음",
    addBodyB:
      "를 누르세요(또는 배너 우클릭 후 “Add instance at playhead”). 배치 위치는 다음 순서로 결정됩니다.",
    addList: [
      "playhead 이전 마지막 타이밍 줄 바로 뒤에 충분한 빈 행이 있으면 그 자리를 그대로 채웁니다.",
      "채울 빈 행이 없어도 playhead가 충분히 큰 시간 간격에 있으면 새 행을 그 위치에 삽입합니다.",
      `playhead가 재생 중인 줄 안에 있거나 간격이 부족하거나 마지막 가사를 이미 지나쳤다면 인스턴스를 클립보드에 복사하고 붙여넣기 미리보기를 엽니다. 토스트에는 “No room at the playhead. ${MOD_KEY} + V to paste somewhere clear.” 같은 안내가 뜹니다.`,
    ],
    addBodyC: `일반 클립보드도 사용할 수 있습니다. 배너 선택 상태에서 ${MOD_KEY} + C, 붙여넣을 곳에서 ${MOD_KEY} + V를 누르면 같은 fill / insert 규칙으로 배치됩니다.`,
    banner: "배너 사용법",
    bannerList: [
      `배너 아무 곳이나 클릭: 인스턴스의 모든 단어를 선택합니다. ${MOD_KEY} + C나 방향키 nudge 전에 유용합니다.`,
      "가로로 드래그: 그 인스턴스 전체를 시간축으로 이동합니다. 형제 인스턴스는 그대로입니다.",
      "chevron 클릭: 인스턴스를 한 줄 스트립으로 접습니다. 재생 중에는 희미한 진행 막대가 표시됩니다.",
      "우클릭: rename, recolor, add instance, shift to playhead, detach instance, delete group 등의 메뉴를 엽니다.",
      "헤더 행 더블클릭: 그룹 이름을 즉석에서 바꿀 수 있습니다. Enter 저장, Escape 취소입니다.",
      "“1 of N” 배지 호버: 형제 인스턴스가 그룹 색으로 잠깐 강조되어 타임라인에서 찾기 쉬워집니다.",
    ],
    shortcuts: "단축키",
    shortcutsBody:
      "대부분 현재 선택이 속한 인스턴스에 적용됩니다. 먼저 배너를 클릭해 포커스를 주세요.",
    shortcutsFooter:
      "이 단축키들은 모두 Settings → Shortcuts에서 다시 바꿀 수 있습니다.",
    shortcutItems: [
      "선택한 줄을 그룹으로 묶습니다.",
      "playhead 위치에 링크 인스턴스를 추가합니다.",
      "현재 인스턴스 또는 모든 인스턴스를 접습니다.",
      "같은 그룹의 이전 또는 다음 인스턴스로 이동합니다.",
      "현재 인스턴스를 설정된 양만큼 앞뒤로 이동합니다.",
      "형제 인스턴스를 강조 표시합니다.",
      "현재 인스턴스를 그룹에서 분리합니다.",
      "현재 그룹을 삭제합니다.",
      "첫 단어가 playhead에 오도록 인스턴스를 이동합니다.",
      "선택을 바꾸지 않고 인스턴스 시작 지점으로 스크롤합니다.",
    ],
    suggestions: "추천 배너",
    suggestionsA:
      "Timeline이 아직 그룹화되지 않은 동일한 연속 줄 블록을 두 개 이상 감지하면 툴바 아래에 전구 아이콘 배너가 뜹니다. 하나면 즉시 Group them 버튼이, 여러 개면 Review N 버튼이 나타납니다.",
    suggestionsB:
      "dismiss는 프로젝트와 내용 기준으로 저장됩니다. 다른 곳의 줄을 추가하거나 삭제해도 다시 나타나지 않지만, dismiss한 블록의 실제 텍스트를 바꾸면 구조가 달라져 다시 제안됩니다.",
    paste: "인스턴스 사이 붙여넣기",
    pasteA:
      "인스턴스에 착지하는 붙여넣기는 두 가지지만, 도착지에서의 동작은 같습니다.",
    pasteList: [
      "기존 인스턴스의 모든 단어를 복사해 붙여넣으면 CallEditor가 이를 기존 인스턴스로 인식하고 자동으로 링크합니다.",
      "기존 템플릿과 같은 텍스트와 같은 단어 분할을 가진 일반 줄을 복사하면 “Link as another [Chorus]?”를 묻습니다.",
    ],
    pasteB:
      "커서 위치부터 충분한 빈 행이 있으면 그 자리를 채웁니다. 부족하면 아래 내용을 밀기 전에 확인을 묻습니다. 레이아웃을 예측 가능하게 유지하려면 먼저 Edit에서 행을 추가하세요.",
    propagate: "전파되는 것과 아닌 것",
    linkedLead: "모든 인스턴스에 전파됨:",
    linkedList: [
      "단어 텍스트와 줄 텍스트 편집.",
      "에이전트 할당.",
      "백보컬 텍스트.",
      "단어 분할과 병합. 실제로 바뀌지 않은 단어의 타이밍은 유지되고, 바뀐 슬롯만 다시 나뉩니다.",
      "단어를 메인/백그라운드 트랙 사이로 옮기는 작업.",
    ],
    localLead: "인스턴스마다 개별로 유지됨:",
    localList: [
      "각 단어의 절대 begin / end 시간.",
      "배너 이동과 방향키 nudge.",
      "detach된 줄에 대한 작업.",
    ],
    prompt: "분할/병합 확인창",
    promptA:
      "링크된 줄에서 분할이나 병합이 형제 인스턴스의 타이밍까지 바꾸게 되면 Apply to all / Detach / Cancel 세 버튼 모달이 뜹니다.",
    promptB:
      "“Don't ask again”를 체크하면 다음부터 그 선택이 기본값이 됩니다. Settings → Confirmations에서 초기화할 수 있습니다.",
    detach: "링크 끊기",
    detachA:
      "실제 노래는 완벽하게 반복되지 않습니다. 마지막 후렴에 “yeah”가 하나 더 들어가거나 다른 에이전트가 부를 수도 있습니다. 링크를 끊는 방법은 두 가지입니다.",
    detachList: [
      "거터의 줄을 우클릭해 Detach this line을 선택하면 그 한 줄만 형제와의 동기화가 끊깁니다.",
      "배너를 우클릭해 Detach instance를 선택하면 그 인스턴스 전체가 일반 줄이 됩니다.",
    ],
    detachB: `둘 다 undo 가능합니다. 토스트의 Undo 버튼이나 ${MOD_KEY} + Z를 사용하세요.`,
    empty: "인스턴스를 비우기",
    emptyA:
      "배너를 클릭해 인스턴스의 모든 단어를 선택한 뒤 Delete를 누르면, 그 인스턴스는 빈 플레이스홀더로 돌아갑니다. CallEditor는 모든 줄이 비었음을 감지하고 그룹 속성도 자동으로 제거합니다.",
    emptyB:
      "일부만 삭제하면 이 동작은 일어나지 않습니다. 여러 줄 인스턴스에서 한 줄이라도 단어가 남아 있으면 링크가 유지됩니다.",
    delete: "그룹 삭제",
    deleteBody:
      "배너를 우클릭해 Delete group을 선택하세요. 모든 인스턴스가 일반 줄로 바뀐다는 확인 모달이 표시됩니다. “Don't ask again”를 켜면 다음부터 생략됩니다.",
    outside: "Timeline 밖에서의 표시",
    outsideList: [
      "Edit view: 각 인스턴스 앞에 그룹 이름과 개수가 있는 색상 구분선이 나타납니다.",
      "Sync view: 거터 셀에 체인 아이콘과 인스턴스 카운터가 표시됩니다.",
      "TTML export: custom calleditor:groups 레지스트리와 줄 속성으로 왕복 저장됩니다. 다른 TTML 플레이어는 무시하고, CallEditor는 그대로 다시 읽어옵니다.",
    ],
  },
} as const;

const GroupsSection: React.FC = () => {
  const { language } = useAppLanguage();
  const copy = COPY[language];

  return (
    <div className="space-y-5">
      <p className={PROSE}>{copy.intro}</p>

      <div>
        <h4 className={HEADING}>{copy.why}</h4>
        <p className={PROSE}>{copy.whyBody}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.create}</h4>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          <li>{copy.createList[0]}</li>
          <li>
            {copy.createBodyA}{" "}
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.createGroup")}
            />{" "}
            {copy.createBodyB}
          </li>
          {copy.createList.slice(2).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.add}</h4>
        <p className={PROSE}>
          {copy.addBodyA}{" "}
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.duplicateAsLinked")}
          />{" "}
          {copy.addBodyB}
        </p>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          {copy.addList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className={`${PROSE} mt-2`}>{copy.addBodyC}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.banner}</h4>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          {copy.bannerList.slice(0, 5).map((item) => (
            <li key={item}>{item}</li>
          ))}
          <li>
            {copy.bannerList[5]}{" "}
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.pingSiblings")}
            />
          </li>
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.shortcuts}</h4>
        <p className={PROSE}>{copy.shortcutsBody}</p>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.createGroup")}
            />
            : {copy.shortcutItems[0]}
          </li>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.duplicateAsLinked")}
            />
            : {copy.shortcutItems[1]}
          </li>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.toggleCollapseInstance")}
            />{" "}
            /{" "}
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.toggleAllCollapsed")}
            />
            : {copy.shortcutItems[2]}
          </li>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.jumpPrevInstance")}
            />{" "}
            /{" "}
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.jumpNextInstance")}
            />
            : {copy.shortcutItems[3]}
          </li>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.nudgeLeft")}
            />{" "}
            /{" "}
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.nudgeRight")}
            />
            : {copy.shortcutItems[4]}
          </li>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.pingSiblings")}
            />
            : {copy.shortcutItems[5]}
          </li>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.detachInstance")}
            />
            : {copy.shortcutItems[6]}
          </li>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.deleteGroup")}
            />
            : {copy.shortcutItems[7]}
          </li>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.shiftInstanceToPlayhead")}
            />
            : {copy.shortcutItems[8]}
          </li>
          <li>
            <InlineKeyBadge
              keys={getEffectiveKeysArray("timeline.jumpToInstanceStart")}
            />
            : {copy.shortcutItems[9]}
          </li>
        </ul>
        <p className={`${PROSE} mt-2`}>{copy.shortcutsFooter}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.suggestions}</h4>
        <p className={PROSE}>{copy.suggestionsA}</p>
        <p className={`${PROSE} mt-2`}>{copy.suggestionsB}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.paste}</h4>
        <p className={PROSE}>{copy.pasteA}</p>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          {copy.pasteList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className={`${PROSE} mt-2`}>{copy.pasteB}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.propagate}</h4>
        <p className={PROSE}>{copy.linkedLead}</p>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          {copy.linkedList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className={`${PROSE} mt-2`}>{copy.localLead}</p>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          {copy.localList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.prompt}</h4>
        <p className={PROSE}>{copy.promptA}</p>
        <p className={`${PROSE} mt-2`}>{copy.promptB}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.detach}</h4>
        <p className={PROSE}>{copy.detachA}</p>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          {copy.detachList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className={`${PROSE} mt-2`}>{copy.detachB}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.empty}</h4>
        <p className={PROSE}>{copy.emptyA}</p>
        <p className={`${PROSE} mt-2`}>{copy.emptyB}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.delete}</h4>
        <p className={PROSE}>{copy.deleteBody}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.outside}</h4>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          {copy.outsideList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { GroupsSection };
