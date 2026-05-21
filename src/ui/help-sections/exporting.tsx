import { useAppLanguage } from "@/lib/i18n";
import { PROSE } from "@/ui/help-sections/shared";

// -- Exporting ----------------------------------------------------------------

const COPY = {
  en: {
    intro: "The Export tab shows a syntax-highlighted preview of your TTML output.",
    download: "Saves the file to your computer. The filename uses your project title.",
    copy: "Copies the minified TTML to your clipboard.",
    edit: 'Lets you manually tweak the XML before downloading. Click "Regenerate" to go back to the auto-generated version.',
    project:
      'Use "Export Project" to save a .json file with all your data (lyrics, timing, agents, metadata). Use "Import Project" to load one back. This is how you share work with collaborators or back things up.',
    clear: "Wipes the current project. This is permanent, so it asks for confirmation.",
    counter: "The counter at the top shows how many lines have timing data. Unsynced lines are skipped in the export.",
  },
  ja: {
    intro: "Export タブでは、出力される TTML をシンタックスハイライト付きで確認できます。",
    download: "TTML ファイルを保存します。ファイル名にはプロジェクトタイトルが使われます。",
    copy: "圧縮された TTML をクリップボードにコピーします。",
    edit: 'ダウンロード前に XML を手動で調整できます。"Regenerate" を押すと自動生成版に戻せます。',
    project:
      '"Export Project" では歌詞・タイミング・エージェント・メタデータを含む .json を保存できます。"Import Project" で再読み込みできます。共同作業やバックアップに使います。',
    clear: "現在のプロジェクトを消去します。元に戻せないため確認が表示されます。",
    counter: "上部のカウンターはタイミング付きの行数を示します。未同期の行はエクスポートに含まれません。",
  },
  ko: {
    intro: "Export 탭에서는 TTML 출력 결과를 문법 강조와 함께 미리 볼 수 있습니다.",
    download: "TTML 파일을 저장합니다. 파일명에는 프로젝트 제목이 사용됩니다.",
    copy: "압축된 TTML을 클립보드로 복사합니다.",
    edit: '"Regenerate"를 누르기 전까지 XML을 직접 수정할 수 있습니다. 누르면 자동 생성 버전으로 돌아갑니다.',
    project:
      '"Export Project"는 가사, 타이밍, 에이전트, 메타데이터가 들어 있는 .json 파일을 저장합니다. "Import Project"로 다시 불러올 수 있어 협업이나 백업에 적합합니다.',
    clear: "현재 프로젝트를 지웁니다. 되돌릴 수 없어서 확인을 한 번 더 묻습니다.",
    counter: "상단 카운터는 타이밍이 있는 줄 수를 보여 줍니다. 싱크되지 않은 줄은 내보내기에서 제외됩니다.",
  },
} as const;

const ExportSection: React.FC = () => {
  const { language } = useAppLanguage();
  const copy = COPY[language];

  return (
    <div className="space-y-5">
    <p className={PROSE}>{copy.intro}</p>
    <ul className={`${PROSE} list-disc pl-4 space-y-1.5`}>
      <li>
        <strong>Download TTML</strong>: {copy.download}
      </li>
      <li>
        <strong>Copy</strong>: {copy.copy}
      </li>
      <li>
        <strong>Edit</strong>: {copy.edit}
      </li>
      <li>
        <strong>Project files</strong>: {copy.project}
      </li>
      <li>
        <strong>Clear</strong>: {copy.clear}
      </li>
    </ul>
    <p className={PROSE}>{copy.counter}</p>
  </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { ExportSection };
