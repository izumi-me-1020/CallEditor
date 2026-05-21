import { Scroll } from "@/ui/scroll";
import { cn } from "@/utils/cn";

// -- Types --------------------------------------------------------------------

interface ModalNavSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface ModalNavLayoutProps {
  sections: ModalNavSection[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  children: React.ReactNode;
  sidebarClassName?: string;
  contentClassName?: string;
  mobileLabel?: string;
}

// -- Component ----------------------------------------------------------------

const ModalNavLayout: React.FC<ModalNavLayoutProps> = ({
  sections,
  activeSection,
  onSectionChange,
  children,
  sidebarClassName,
  contentClassName,
  mobileLabel,
}) => (
  <div className="flex flex-1 min-h-0 flex-col md:flex-row">
    <div className="border-b border-calleditor-border p-3 md:hidden">
      <label className="flex flex-col gap-1">
        {mobileLabel && (
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-calleditor-text-muted">
            {mobileLabel}
          </span>
        )}
        <select
          value={activeSection}
          onChange={(e) => onSectionChange(e.target.value)}
          className="h-10 rounded-lg border border-calleditor-border bg-calleditor-input px-3 text-sm text-calleditor-text focus:outline-none focus:border-calleditor-accent"
        >
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.label}
            </option>
          ))}
        </select>
      </label>
    </div>

    <div className="hidden md:block">
      <Scroll
        className={cn(
          "w-44 shrink-0 border-r border-calleditor-border select-none",
          sidebarClassName,
        )}
      >
        <div className="flex flex-col gap-px p-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-left cursor-pointer transition-colors",
                  isActive
                    ? "bg-calleditor-button text-calleditor-text font-medium"
                    : "text-calleditor-text-secondary hover:bg-calleditor-button/50 hover:text-calleditor-text",
                )}
              >
                <Icon size={16} className="shrink-0" />
                {section.label}
              </button>
            );
          })}
        </div>
      </Scroll>
    </div>

    <Scroll className={cn("min-h-0 flex-1", contentClassName)}>
      {children}
    </Scroll>
  </div>
);

// -- Exports ------------------------------------------------------------------

export { ModalNavLayout };
export type { ModalNavSection };
