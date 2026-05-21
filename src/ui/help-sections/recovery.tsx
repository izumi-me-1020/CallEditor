import { useAppLanguage } from "@/lib/i18n";
import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { HEADING, PROSE } from "@/ui/help-sections/shared";
import { InlineKeyBadge } from "@/ui/inline-key-badge";

// -- Recovery -----------------------------------------------------------------

const COPY = {
  en: {
    intro:
      "CallEditor saves your work as you go. If the app crashes, freezes, or you accidentally close the tab, your calls and timing are still there. Here's how to get them back.",
    error: "The app showed an error",
    errorBody:
      "Hit Download my work on the error screen. You'll get a project file. Reload CallEditor, head to the Export tab, and click Import Project to pick up where you left off.",
    frozen: "The app is frozen",
    frozenLead: "Open",
    frozenBody:
      "in a new tab. It's a tiny page that fetches your work without loading anything else, so it still works when nothing else does. Worth bookmarking.",
    shortcut: "Shortcut",
    shortcutBodyA:
      "downloads your work from anywhere in the app. Handy when things look weird but aren't fully stuck. If the whole tab is frozen, use the /recover tab approach instead.",
    backup: "What's in the backup",
    backupBody:
      "Calls, timing, agents, groups, and project metadata. Audio doesn't carry over (files are too big), so you'll drop that back in yourself. Everything stays on your device, nothing's uploaded.",
    missing: "Nothing showed up?",
    missingBody:
      "Backups are tied to the browser you used. They won't show up in a different browser, a different profile, or a private window. If you cleared browser data after the crash, sadly it's gone.",
    crashing: "Still crashing after reload?",
    crashingBody:
      "Sometimes the saved data itself is the issue. After downloading the backup, the same screen (error page or /recover) shows a Clear saved data button. It wipes the autosave so CallEditor opens fresh next time. Import the file back whenever you're ready. If you can still get into the app, the Export tab's Clear button does the same thing.",
  },
  ja: {
    intro:
      "CallEditor は作業内容を随時保存しています。クラッシュしたり固まったり、誤ってタブを閉じたりしても、コールやタイミングは残っていることがほとんどです。復旧方法は次の通りです。",
    error: "エラー画面が出た",
    errorBody:
      "エラー画面の Download my work を押してください。プロジェクトファイルが保存されます。CallEditor を再読み込みして Export タブを開き、Import Project で続きから再開できます。",
    frozen: "アプリが固まった",
    frozenLead: "",
    frozenBody:
      "を新しいタブで開いてください。余計なものを読み込まずに作業データだけを取り出す小さなページなので、本体が重くても動くことがあります。ブックマーク推奨です。",
    shortcut: "ショートカット",
    shortcutBodyA:
      "でアプリ内のどこからでも作業内容をダウンロードできます。完全には固まっていないけれど挙動がおかしい時に便利です。タブ全体が固まっている場合は /recover を使ってください。",
    backup: "バックアップに含まれるもの",
    backupBody:
      "コール、タイミング、エージェント、グループ、プロジェクトメタデータです。音声は大きすぎるため含まれないので、自分で再読み込みしてください。データは端末内にだけ保存され、アップロードはされません。",
    missing: "何も出てこない",
    missingBody:
      "バックアップは使っていたブラウザに紐づきます。別ブラウザ、別プロファイル、プライベートウィンドウでは見えません。クラッシュ後にブラウザデータを消してしまった場合は残念ながら復旧できません。",
    crashing: "再読み込み後も落ちる",
    crashingBody:
      "保存データ自体が原因になっていることがあります。バックアップを保存したあと、同じ画面（エラーページまたは /recover）にある Clear saved data を押すと autosave が消え、次回はまっさらな状態で開けます。必要になったらファイルを再読み込みできます。アプリに入れるなら Export タブの Clear でも同じです。",
  },
  ko: {
    intro:
      "CallEditor는 작업 내용을 계속 저장합니다. 앱이 크래시 나거나 멈추거나 실수로 탭을 닫아도 콜과 타이밍이 남아 있는 경우가 많습니다. 복구 방법은 다음과 같습니다.",
    error: "앱에 오류 화면이 나타났을 때",
    errorBody:
      "오류 화면에서 Download my work를 누르세요. 프로젝트 파일이 저장됩니다. CallEditor를 새로고침한 뒤 Export 탭으로 가서 Import Project를 누르면 이어서 작업할 수 있습니다.",
    frozen: "앱이 멈췄을 때",
    frozenLead: "",
    frozenBody:
      "를 새 탭에서 열어 보세요. 다른 리소스를 거의 불러오지 않고 작업 데이터만 가져오는 작은 페이지라서, 본편이 멈춰 있어도 동작할 수 있습니다. 북마크해 두면 좋습니다.",
    shortcut: "단축키",
    shortcutBodyA:
      "로 앱 어디서든 작업 내용을 다운로드할 수 있습니다. 완전히 멈추진 않았지만 이상하게 보일 때 유용합니다. 탭 전체가 얼어붙었다면 /recover 탭을 사용하세요.",
    backup: "백업에 들어가는 내용",
    backupBody:
      "콜, 타이밍, 에이전트, 그룹, 프로젝트 메타데이터가 포함됩니다. 오디오는 용량이 커서 포함되지 않으므로 직접 다시 불러와야 합니다. 모든 데이터는 기기 안에만 남고 업로드되지 않습니다.",
    missing: "아무것도 안 보일 때",
    missingBody:
      "백업은 사용하던 브라우저에 묶여 있습니다. 다른 브라우저, 다른 프로필, 시크릿 창에서는 보이지 않습니다. 크래시 후 브라우저 데이터를 지웠다면 복구가 어렵습니다.",
    crashing: "새로고침 후에도 계속 크래시할 때",
    crashingBody:
      "저장된 데이터 자체가 문제일 수도 있습니다. 백업을 받은 뒤 같은 화면(오류 페이지 또는 /recover)에 있는 Clear saved data 버튼을 누르면 autosave가 지워져 다음 실행 시 새 상태로 열립니다. 준비되면 백업 파일을 다시 가져오면 됩니다. 앱에 들어갈 수 있다면 Export 탭의 Clear 버튼도 같은 역할을 합니다.",
  },
} as const;

const RecoverySection: React.FC = () => {
  const { language } = useAppLanguage();
  const copy = COPY[language];

  return (
    <div className="space-y-5">
      <p className={PROSE}>{copy.intro}</p>

      <div>
        <h4 className={HEADING}>{copy.error}</h4>
        <p className={PROSE}>{copy.errorBody}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.frozen}</h4>
        <p className={PROSE}>
          {copy.frozenLead}{" "}
          <a
            href="/recover"
            target="_blank"
            rel="noopener noreferrer"
            className="text-calleditor-text underline underline-offset-2 hover:text-calleditor-text-bright"
          >
            /recover
          </a>{" "}
          {copy.frozenBody}
        </p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.shortcut}</h4>
        <p className={PROSE}>
          <InlineKeyBadge
            keys={getEffectiveKeysArray("global.panicRecovery")}
          />{" "}
          {copy.shortcutBodyA}
        </p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.backup}</h4>
        <p className={PROSE}>{copy.backupBody}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.missing}</h4>
        <p className={PROSE}>{copy.missingBody}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.crashing}</h4>
        <p className={PROSE}>{copy.crashingBody}</p>
      </div>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { RecoverySection };
