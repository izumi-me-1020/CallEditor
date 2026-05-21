import { App } from "@/App";
import { PageHead } from "@/seo/page-head";
import { organizationSchema, softwareApplicationSchema } from "@/seo/schemas";
import { ClientOnly } from "@/ui/client-only";

const TITLE = "CallEditor";

const DESCRIPTION =
  "CallEditor is a browser-based editor for creating and sharing idol calls with precise timing. Sync chants and responses to music playback, organize sections visually, and build structured call scripts collaboratively.";
const AppFallback: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-calleditor-bg text-calleditor-text-muted text-sm">
    Loading CallEditor
  </div>
);

const HomePage: React.FC = () => {
  return (
    <>
      <PageHead
        title={TITLE}
        description={DESCRIPTION}
        path="/"
        jsonLd={[
          softwareApplicationSchema("CallEditor", DESCRIPTION, "/"),
          organizationSchema(),
        ]}
      />
      <ClientOnly fallback={<AppFallback />}>
        <App />
      </ClientOnly>
    </>
  );
};

export default HomePage;
