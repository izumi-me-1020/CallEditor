import { useAppLanguage } from "@/lib/i18n";
import { useSettingsStore } from "@/stores/settings";
import { HEADING, PROSE } from "@/ui/help-sections/shared";

// -- Editing Calls ------------------------------------------------------------

const EditSection: React.FC = () => {
  const splitCharacter = useSettingsStore((s) => s.splitCharacter);
  const { language } = useAppLanguage();
  const copy = {
    en: {
      intro:
        "Each row is one line of calls. Type normally, press Enter for a new line. To reorder lines, drag them using the handle on the left side.",
      agents: "Agents (singers)",
      agentsBody: `Click a line's agent dot to assign it to a different singer. Each agent gets a unique color. Add new agents with the "+" button in the agent manager at the top.`,
      bg: "Background vocals",
      bgBody:
        'If a line has backing vocals, add them in the "Background" field that appears below the main text. These show up as a separate track in the Timeline and get the x-bg role in TTML output.',
      split: "Syllable pre-splitting",
      splitBodyA: "Use the",
      splitBodyB:
        "character to mark where you want words split. For example, typing beau",
      splitBodyC: "ti",
      splitBodyD:
        "ful creates three separate timed blocks instead of one. This is useful when a word stretches across several beats. You can change this character in Settings.",
      select: "Selecting multiple lines",
      selectBody:
        "Click a line to select it. Shift + Click another line to select the whole range between them. You can also click and drag on the line numbers in the gutter to select a range that way. Selected lines can be deleted or have agents reassigned in bulk.",
      grouped: "Editing grouped lines",
      groupedA:
        "Lines that belong to a linked group show a thin colored stripe on their left edge, matching the group color. Hover one to see which group it belongs to and how many other instances are linked.",
      groupedB:
        "Edits you make to a grouped line's text, agent, or background vocals fan out to every other instance of the same template line. Word-level timings survive when the new text has the same word count: existing word slots keep their begin/end and just swap text. If the word count changes, sibling timings clear so you can re-sync them in the Sync view.",
      groupedC:
        "Adding or removing rows inside a grouped instance pops a confirmation: that one instance detaches from the group so the structural change can land, while every sibling instance stays linked. Decline to revert. Edits to non-grouped lines never prompt.",
    },
    ja: {
      intro:
        "1 行がコール 1 行です。普通に入力して Enter で改行します。行順を変えたいときは左側のハンドルをドラッグします。",
      agents: "エージェント（歌手）",
      agentsBody:
        "行のエージェントドットをクリックすると別の歌手に割り当てられます。各エージェントには固有の色が付き、上部のエージェント管理から + ボタンで追加できます。",
      bg: "バックボーカル",
      bgBody:
        "行にバックボーカルがある場合は、メインテキストの下に出る Background 欄へ入力します。Timeline では別トラックとして表示され、TTML では x-bg ロールになります。",
      split: "音節の事前分割",
      splitBodyA: "",
      splitBodyB: "分割位置を示したい単語に",
      splitBodyC: "",
      splitBodyD:
        "を入れます。たとえば beau と ti と ful の間にこの記号を入れると、1 語ではなく 3 つのタイミングブロックになります。複数拍にまたがる単語で便利です。この文字は Settings で変更できます。",
      select: "複数行の選択",
      selectBody:
        "行をクリックすると選択されます。Shift + クリックで範囲選択できます。左側ガターの行番号をドラッグして範囲選択することもできます。選択した行はまとめて削除したり、エージェントを一括変更したりできます。",
      grouped: "グループ化された行の編集",
      groupedA:
        "リンクグループに属する行には、左端にグループ色の細いストライプが表示されます。ホバーすると所属グループと、いくつのインスタンスがリンクされているかが分かります。",
      groupedB:
        "グループ行のテキスト、エージェント、バックボーカルを編集すると、同じテンプレート行を使う他のインスタンスにも反映されます。単語数が同じなら単語ごとの begin/end はそのまま維持され、テキストだけが差し替わります。単語数が変わると他インスタンスの単語タイミングはクリアされ、Sync で再同期できます。",
      groupedC:
        "グループ化されたインスタンス内で行を追加・削除すると確認が出ます。その構造変更はそのインスタンスだけをグループから切り離して適用され、他の兄弟インスタンスはリンクされたままです。非グループ行ではこの確認は出ません。",
    },
    ko: {
      intro:
        "각 행은 콜 한 줄입니다. 일반적으로 입력하고 Enter로 새 줄을 만듭니다. 줄 순서를 바꾸려면 왼쪽 핸들을 드래그하세요.",
      agents: "에이전트(가수)",
      agentsBody:
        '줄의 에이전트 점을 클릭하면 다른 가수로 지정할 수 있습니다. 각 에이전트에는 고유 색상이 붙고, 상단 에이전트 관리자에서 "+" 버튼으로 새 에이전트를 추가할 수 있습니다.',
      bg: "백보컬",
      bgBody:
        '백보컬이 있는 줄은 본문 아래에 나타나는 "Background" 필드에 입력하세요. Timeline에서는 별도 트랙으로 보이고, TTML 출력에서는 x-bg 역할을 가집니다.',
      split: "음절 미리 나누기",
      splitBodyA: "",
      splitBodyB: "단어를 나누고 싶은 위치에",
      splitBodyC: "",
      splitBodyD:
        "문자를 넣습니다. 예를 들어 beau, ti, ful 사이에 이 문자를 넣으면 하나의 단어 대신 세 개의 타이밍 블록으로 분리됩니다. 여러 박자에 걸쳐 늘어지는 단어에 유용하며, 이 문자는 Settings에서 바꿀 수 있습니다.",
      select: "여러 줄 선택",
      selectBody:
        "줄을 클릭하면 선택됩니다. Shift + 클릭으로 그 사이 전체 범위를 선택할 수 있습니다. 왼쪽 거터의 줄 번호를 드래그해서 범위를 선택하는 것도 가능합니다. 선택한 줄은 한꺼번에 삭제하거나 에이전트를 일괄 변경할 수 있습니다.",
      grouped: "그룹된 줄 편집",
      groupedA:
        "링크 그룹에 속한 줄은 왼쪽 가장자리에 그룹 색상과 같은 얇은 줄무늬가 표시됩니다. 마우스를 올리면 어떤 그룹인지와 연결된 다른 인스턴스 수를 확인할 수 있습니다.",
      groupedB:
        "그룹된 줄의 텍스트, 에이전트, 백보컬을 수정하면 같은 템플릿 줄을 사용하는 다른 인스턴스에도 반영됩니다. 단어 수가 같으면 기존 단어 슬롯의 begin/end를 유지한 채 텍스트만 바뀝니다. 단어 수가 달라지면 형제 인스턴스의 타이밍은 비워져서 Sync 뷰에서 다시 맞출 수 있습니다.",
      groupedC:
        "그룹된 인스턴스 안에서 행을 추가하거나 삭제하면 확인창이 뜹니다. 구조 변경은 그 인스턴스만 그룹에서 분리한 뒤 적용되고, 다른 형제 인스턴스는 링크된 상태로 남습니다. 그룹되지 않은 줄을 수정할 때는 이런 확인이 나오지 않습니다.",
    },
  }[language];

  return (
    <div className="space-y-5">
      <p className={PROSE}>{copy.intro}</p>

      <div>
        <h4 className={HEADING}>{copy.agents}</h4>
        <p className={PROSE}>{copy.agentsBody}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.bg}</h4>
        <p className={PROSE}>{copy.bgBody}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.split}</h4>
        <p className={PROSE}>
          {copy.splitBodyA}
          {copy.splitBodyB}{" "}
          <span className="font-mono text-calleditor-text">
            {splitCharacter}
          </span>{" "}
          {copy.splitBodyC}
          beau{splitCharacter}ti{splitCharacter}ful {copy.splitBodyD}
        </p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.select}</h4>
        <p className={PROSE}>{copy.selectBody}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.grouped}</h4>
        <p className={PROSE}>{copy.groupedA}</p>
        <p className={`${PROSE} mt-2`}>{copy.groupedB}</p>
        <p className={`${PROSE} mt-2`}>{copy.groupedC}</p>
      </div>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { EditSection };
