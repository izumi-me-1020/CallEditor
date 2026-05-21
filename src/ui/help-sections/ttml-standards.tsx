import { useAppLanguage } from "@/lib/i18n";
import { HEADING, PROSE } from "@/ui/help-sections/shared";

// -- TTML Standards -----------------------------------------------------------

const COPY = {
  en: {
    outputs: "What CallEditor outputs",
    outputsA: "CallEditor emits",
    outputsB:
      "(W3C Recommendation, November 2018). The output is well-formed XML that any TTML 1 conformant parser can read, including the standard structure: ",
    outputsC: " root with the TTML namespace, ",
    outputsD: " with ",
    outputsE: " and ",
    outputsF: " declarations, and ",
    outputsG: " for lines with ",
    outputsH: " per word for word-level timing.",
    outputsI:
      'Background vocals use ttm:role="x-bg", which is the spec-sanctioned x- extension prefix for custom roles. Singer assignments go through the standard ttm:agent reference.',
    extensions: "Foreign-namespace extensions",
    extA: "For features that don't have a place in the core TTML 1 vocabulary, like linked groups and per-instance metadata, CallEditor uses the foreign-namespace extension mechanism in",
    extB: 'of the spec. The spec explicitly permits "arbitrary namespace qualified elements that reside in any namespace other than those namespaces defined for use with this specification" and the same for attributes on TTML-defined vocabulary. That\'s the W3C-sanctioned way to add application-specific data while keeping the document conformant.',
    extC: "CallEditor's namespace URI is",
    extD: ". Custom attributes show up as calleditor:groupId, calleditor:instanceIdx, and so on, on the root <tt> element and on <p> elements that belong to a linked group. A <calleditor:groups> block lives inside <metadata> to declare the group registry (id, label, color).",
    why: "Why this matters",
    whyBodyA:
      "You can hand a CallEditor file to any TTML 1 parser and it will work.",
    whyBodyB:
      "Tools that don't recognize the calleditor: namespace can safely skip the extensions: foreign attributes get pruned during validation (per",
    whyBodyC:
      ") so the document stays valid, and the rest of the file renders normally. The extensions are additive and scoped to a clearly identified namespace, so there's no chance of attribute collision with other tools that extend TTML for their own purposes.",
    refs: "References",
    ref1: "(the spec)",
    ref2: "(issues, errata, source)",
    ref3: "(the section that permits foreign-namespace extensions)",
    ref4: "(Working Group discussion clarifying that vocabulary the spec doesn't define gets pruned before validation, so documents stay valid)",
  },
  ja: {
    outputs: "CallEditor の出力形式",
    outputsA: "CallEditor は",
    outputsB:
      "を出力します（W3C Recommendation, 2018 年 11 月）。出力は整形式 XML で、TTML 1 に準拠したパーサーなら読めます。構造も標準的で、TTML 名前空間付きの",
    outputsC: "ルート、",
    outputsD: "内の",
    outputsE: "と",
    outputsF: "宣言、そして行を表す",
    outputsG: "の中に、単語単位タイミング用の",
    outputsH: "が並びます。",
    outputsI:
      'バックボーカルには ttm:role="x-bg" を使っています。これはカスタム role に対して仕様で認められた x- 拡張プレフィックスです。歌手の割り当ては標準の ttm:agent 参照で表現します。',
    extensions: "外部名前空間の拡張",
    extA: "リンクグループやインスタンスごとのメタデータのように、TTML 1 のコア語彙に置き場所がない機能には、仕様の",
    extB: "で定義されている外部名前空間拡張を使っています。仕様では、この仕様で定義された名前空間以外に属する任意の修飾要素や属性を許可しています。これが、文書の準拠性を保ったままアプリ固有データを追加する W3C 公認のやり方です。",
    extC: "CallEditor の名前空間 URI は",
    extD: "です。calleditor:groupId や calleditor:instanceIdx などの属性は、ルートの <tt> 要素やリンクグループに属する <p> 要素に付きます。グループの id、label、color を宣言する <calleditor:groups> ブロックは <metadata> 内に入ります。",
    why: "これが重要な理由",
    whyBodyA: "CallEditor のファイルは任意の TTML 1 パーサーに渡せます。",
    whyBodyB:
      "calleditor: 名前空間を知らないツールでも拡張部分を安全に無視できます。外部属性は検証時に整理され（",
    whyBodyC:
      "参照）、文書全体の妥当性は保たれます。拡張は加算的で、明確に識別された名前空間に閉じているため、他ツールの TTML 拡張と衝突しません。",
    refs: "参考リンク",
    ref1: "（仕様本体）",
    ref2: "（Issue、正誤、ソース）",
    ref3: "（外部名前空間拡張を許可する節）",
    ref4: "（仕様外語彙が検証前に取り除かれるため文書が有効なまま保たれることを明確化した議論）",
  },
  ko: {
    outputs: "CallEditor가 출력하는 형식",
    outputsA: "CallEditor는",
    outputsB:
      "을 출력합니다(W3C Recommendation, 2018년 11월). 출력은 잘 형성된 XML이며 TTML 1을 준수하는 파서라면 읽을 수 있습니다. 구조도 표준적이라 TTML 네임스페이스를 가진",
    outputsC: "루트,",
    outputsD: "안의",
    outputsE: "및",
    outputsF: "선언, 그리고 줄을 담는",
    outputsG: "안에 단어 단위 타이밍을 위한",
    outputsH: "가 들어갑니다.",
    outputsI:
      '백보컬은 ttm:role="x-bg"를 사용합니다. 이는 커스텀 역할에 대해 사양이 허용한 x- 확장 접두사입니다. 가수 할당은 표준 ttm:agent 참조를 사용합니다.',
    extensions: "외부 네임스페이스 확장",
    extA: "링크 그룹이나 인스턴스별 메타데이터처럼 TTML 1 핵심 어휘에 자리가 없는 기능에는 사양의",
    extB: "에 있는 외부 네임스페이스 확장 메커니즘을 사용합니다. 사양은 이 규격용으로 정의된 네임스페이스 외부에 있는 임의의 수식 요소와 속성을 명시적으로 허용합니다. 즉 문서의 적합성을 유지하면서 앱 전용 데이터를 추가하는 W3C 공인 방식입니다.",
    extC: "CallEditor의 네임스페이스 URI는",
    extD: "입니다. calleditor:groupId, calleditor:instanceIdx 같은 커스텀 속성은 루트 <tt> 요소와 링크 그룹에 속한 <p> 요소에 붙습니다. 그룹 레지스트리(id, label, color)를 선언하는 <calleditor:groups> 블록은 <metadata> 안에 들어갑니다.",
    why: "왜 중요한가",
    whyBodyA: "CallEditor 파일은 어떤 TTML 1 파서에 넘겨도 동작합니다.",
    whyBodyB:
      "calleditor: 네임스페이스를 모르는 도구도 확장을 안전하게 건너뛸 수 있습니다. 외부 속성은 검증 과정에서 정리되므로(",
    whyBodyC:
      "참조) 문서는 유효한 상태를 유지하고, 나머지 내용은 정상적으로 렌더링됩니다. 확장은 추가적인 정보일 뿐이며 분명한 네임스페이스 안에 묶여 있어 다른 도구의 TTML 확장과 충돌하지 않습니다.",
    refs: "참고 링크",
    ref1: "(사양 원문)",
    ref2: "(이슈, 정오표, 소스)",
    ref3: "(외부 네임스페이스 확장을 허용하는 절)",
    ref4: "(사양이 정의하지 않은 어휘는 검증 전에 제거되어도 문서가 유효하게 유지된다는 작업반 논의)",
  },
} as const;

const TtmlStandardsSection: React.FC = () => {
  const { language } = useAppLanguage();
  const copy = COPY[language];

  return (
    <div className="space-y-5">
      <h4 className={HEADING}>{copy.outputs}</h4>
      <p className={PROSE}>
        {copy.outputsA}{" "}
        <a
          href="https://www.w3.org/TR/2018/REC-ttml1-20181108/"
          target="_blank"
          rel="noreferrer"
          className="text-calleditor-accent-text hover:text-calleditor-accent underline-offset-2 hover:underline"
        >
          TTML 1
        </a>{" "}
        {copy.outputsB}
        <code>&lt;tt&gt;</code>
        {copy.outputsC} <code>&lt;head&gt;</code>
        {copy.outputsD} <code>&lt;ttm:title&gt;</code> {copy.outputsE}{" "}
        <code>&lt;ttm:agent&gt;</code>
        {copy.outputsF} <code>&lt;body&gt;&lt;div&gt;&lt;p&gt;</code>{" "}
        {copy.outputsG} <code>&lt;span&gt;</code>
        {copy.outputsH}
      </p>
      <p className={PROSE}>{copy.outputsI}</p>

      <h4 className={HEADING}>{copy.extensions}</h4>
      <p className={PROSE}>
        {copy.extA}{" "}
        <a
          href="https://www.w3.org/TR/2018/REC-ttml1-20181108/#extension-vocabulary-overview"
          target="_blank"
          rel="noreferrer"
          className="text-calleditor-accent-text hover:text-calleditor-accent underline-offset-2 hover:underline"
        >
          §5.3.2 Extension Catalog
        </a>{" "}
        {copy.extB}
      </p>
      <p className={PROSE}>
        {copy.extC} <code>https://calleditor.izumy.me/ttml</code>
        {copy.extD}
      </p>

      <h4 className={HEADING}>{copy.why}</h4>
      <p className={PROSE}>
        {copy.whyBodyA} {copy.whyBodyB}{" "}
        <a
          href="https://www.w3.org/TR/2018/REC-ttml1-20181108/#document-types"
          target="_blank"
          rel="noreferrer"
          className="text-calleditor-accent-text hover:text-calleditor-accent underline-offset-2 hover:underline"
        >
          §4 Document Types
        </a>
        {copy.whyBodyC}
      </p>

      <h4 className={HEADING}>{copy.refs}</h4>
      <ul className={`${PROSE} list-disc pl-4 space-y-1.5`}>
        <li>
          <a
            href="https://www.w3.org/TR/2018/REC-ttml1-20181108/"
            target="_blank"
            rel="noreferrer"
            className="text-calleditor-accent-text hover:text-calleditor-accent underline-offset-2 hover:underline"
          >
            TTML 1 W3C Recommendation
          </a>{" "}
          {copy.ref1}
        </li>
        <li>
          <a
            href="https://github.com/w3c/ttml1"
            target="_blank"
            rel="noreferrer"
            className="text-calleditor-accent-text hover:text-calleditor-accent underline-offset-2 hover:underline"
          >
            W3C TTML 1 repository
          </a>{" "}
          {copy.ref2}
        </li>
        <li>
          <a
            href="https://www.w3.org/TR/2018/REC-ttml1-20181108/#extension-vocabulary-overview"
            target="_blank"
            rel="noreferrer"
            className="text-calleditor-accent-text hover:text-calleditor-accent underline-offset-2 hover:underline"
          >
            §5.3.2 Extension Catalog
          </a>{" "}
          {copy.ref3}
        </li>
        <li>
          <a
            href="https://github.com/w3c/ttml1/issues/251"
            target="_blank"
            rel="noreferrer"
            className="text-calleditor-accent-text hover:text-calleditor-accent underline-offset-2 hover:underline"
          >
            w3c/ttml1#251
          </a>{" "}
          {copy.ref4}
        </li>
      </ul>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { TtmlStandardsSection };
