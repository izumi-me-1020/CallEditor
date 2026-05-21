import { BetterLyricsLogo } from "@/ui/icons/better-lyrics-logo";
import { IconArrowUpRight } from "@tabler/icons-react";

const BETTER_LYRICS_URL = "https://better-lyrics.boidu.dev";

const BetterLyricsPromo: React.FC = () => {
  return (
    <section className="px-6 py-20 max-w-4xl mx-auto">
      <a
        href={BETTER_LYRICS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block rounded-2xl bg-calleditor-bg-elevated border border-calleditor-border hover:border-calleditor-border-hover overflow-hidden transition-colors"
      >
        <BetterLyricsLogo
          size={320}
          className="absolute -right-16 -bottom-16 text-calleditor-accent-text opacity-10 group-hover:opacity-20 transition-opacity duration-500 ease-out pointer-events-none"
        />
        <div className="relative p-8 md:p-10 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-calleditor-text mb-3">
            Better Lyrics
          </h2>
          <p className="text-calleditor-text-secondary leading-relaxed mb-6">
            A browser extension that adds time-synced, animated lyrics to
            YouTube Music. Free, open source, and the reason CallEditor exists.
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-calleditor-accent-text group-hover:text-calleditor-accent transition-colors">
            Visit better-lyrics.boidu.dev
            <IconArrowUpRight
              size={14}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </a>
    </section>
  );
};

export { BetterLyricsPromo };
