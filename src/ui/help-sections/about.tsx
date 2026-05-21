import { useAppLanguage } from "@/lib/i18n";
import { HEADING, PROSE } from "@/ui/help-sections/shared";

// -- About --------------------------------------------------------------------

const COPY = {
  en: {
    tagline: "A tool for creating synced call timing.",
    what: "What it is",
    whatBody:
      "Free and open-source, runs entirely in your browser. No accounts, nothing leaves your machine. Bring your audio and call lines, sync them up, and export TTML.",
    openSource: "Open source",
    openSourceLead: "AGPL v3. Source on",
    openSourceTail: ". PRs welcome if you spot something to fix.",
    community: "Community",
    discord: "for questions and chat.",
    issue: "if something's broken.",
    madeBy: "Credits",
    madeByTail:
      " is a fork of Composer, modified by izumi-me-1020 for synced call production workflows.",
  },
  ja: {
    tagline: "同期コールを制作するツール。",
    what: "CallEditor について",
    whatBody:
      "無料のオープンソースで、すべてブラウザ内で動作します。アカウントは不要で、データが外に送られることもありません。音声とコール文を持ち込んで同期し、TTML として書き出せます。",
    openSource: "オープンソース",
    openSourceLead: "AGPL v3 で公開しています。ソースコードは",
    openSourceTail:
      "にあります。気になる不具合や改善点があれば PR も歓迎です。",
    community: "コミュニティ",
    discord: "質問や雑談は Discord へ。",
    issue: "不具合報告は Issue から送れます。",
    madeBy: "クレジット",
    madeByTail:
      " は Composer をベースに、izumi-me-1020 が同期コール制作向けに改変したフォークです。",
  },
  ko: {
    tagline: "싱크 콜 제작 도구.",
    what: "CallEditor란",
    whatBody:
      "무료 오픈소스이며 전부 브라우저 안에서 동작합니다. 계정이 필요 없고 데이터도 기기 밖으로 나가지 않습니다. 오디오와 콜 문구를 가져와 싱크를 맞추고 TTML로 내보낼 수 있습니다.",
    openSource: "오픈소스",
    openSourceLead: "AGPL v3로 공개되어 있으며 소스 코드는",
    openSourceTail: "에서 볼 수 있습니다. 고칠 점을 발견하면 PR도 환영합니다.",
    community: "커뮤니티",
    discord: "질문이나 대화는 Discord에서.",
    issue: "문제가 있으면 Issue로 알려주세요.",
    madeBy: "크레딧",
    madeByTail:
      "는 Composer를 기반으로 izumi-me-1020이 싱크 콜 제작용으로 개조한 포크입니다.",
  },
} as const;

const AboutSection: React.FC = () => {
  const { language } = useAppLanguage();
  const copy = COPY[language];

  return (
    <div className="space-y-5">
      <div className="relative -mx-6 -mt-6">
        <div className="absolute inset-0 bg-gradient-to-b from-calleditor-accent/20 to-transparent pointer-events-none" />
        <div className="relative px-6 pt-7 pb-8 flex items-center gap-5">
          <img src="/logo.svg" alt="CallEditor" className="size-14 shrink-0" />
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight">
              CallEditor
            </h2>
            <p className="text-sm text-calleditor-text-secondary">
              {copy.tagline}
            </p>
            <p className="text-xs text-calleditor-text-muted font-mono mt-2">
              v{__APP_VERSION__}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className={HEADING}>{copy.what}</h4>
        <p className={PROSE}>{copy.whatBody}</p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.openSource}</h4>
        <p className={PROSE}>
          {copy.openSourceLead}{" "}
          <a
            href="https://github.com/izumi-me-1020/CallEditor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-calleditor-text underline underline-offset-2 hover:text-calleditor-text-bright"
          >
            izumi-me-1020/CallEditor
          </a>
          {copy.openSourceTail}
        </p>
      </div>

      <div>
        <h4 className={HEADING}>{copy.community}</h4>
        <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
          <li>
            <a
              href="https://discord.gg/UsHE3d5fWF"
              target="_blank"
              rel="noopener noreferrer"
              className="text-calleditor-text underline underline-offset-2 hover:text-calleditor-text-bright"
            >
              Discord
            </a>{" "}
            {copy.discord}
          </li>
          <li>
            <a
              href="https://github.com/izumi-me-1020/CallEditor/issues/new/choose"
              target="_blank"
              rel="noopener noreferrer"
              className="text-calleditor-text underline underline-offset-2 hover:text-calleditor-text-bright"
            >
              File an issue
            </a>{" "}
            {copy.issue}
          </li>
        </ul>
      </div>

      <div>
        <h4 className={HEADING}>{copy.madeBy}</h4>
        <p className={PROSE}>
          <a
            href="https://github.com/izumi-me-1020/CallEditor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-calleditor-text underline underline-offset-2 hover:text-calleditor-text-bright"
          >
            izumi-me-1020/CallEditor
          </a>{" "}
          {copy.madeByTail}
        </p>
      </div>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { AboutSection };
