import { ShortcutSection, useShortcutSections } from "@/ui/shortcut-reference";

// -- Keyboard Shortcuts -------------------------------------------------------

const KeyboardShortcutsSection: React.FC = () => {
  const sections = useShortcutSections();

  return (
    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
      {sections.map((section) => (
        <ShortcutSection key={section.title} {...section} />
      ))}
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { KeyboardShortcutsSection };
