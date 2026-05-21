import { useAppLanguage } from "@/lib/i18n";
import { useSettingsStore } from "@/stores/settings";
import { SliderSetting, ToggleSetting } from "@/ui/settings/setting-controls";
import { useTimelineStore } from "@/views/timeline/timeline-store";

// -- Timeline Section ---------------------------------------------------------

const TimelineSection: React.FC = () => {
  const set = useSettingsStore((s) => s.set);
  const { t } = useAppLanguage();

  return (
    <div className="divide-y divide-calleditor-border">
      <SliderSetting
        label={t("settings.timeline.defaultZoom.label")}
        description={t("settings.timeline.defaultZoom.description")}
        settingKey="defaultZoom"
        min={20}
        max={500}
        step={20}
        format={(v) => `${v} px/s`}
        action={{
          label: t("settings.useCurrent"),
          onClick: () => set("defaultZoom", useTimelineStore.getState().zoom),
        }}
      />
      <SliderSetting
        label={t("settings.timeline.defaultRowHeight.label")}
        description={t("settings.timeline.defaultRowHeight.description")}
        settingKey="defaultRowHeight"
        min={32}
        max={120}
        step={4}
        format={(v) => `${v}px`}
        action={{
          label: t("settings.useCurrent"),
          onClick: () =>
            set(
              "defaultRowHeight",
              useTimelineStore.getState().defaultRowHeight,
            ),
        }}
      />
      <ToggleSetting
        label={t("settings.timeline.snap.label")}
        description={t("settings.timeline.snap.description")}
        settingKey="timelineSnap"
      />
      <SliderSetting
        label={t("settings.timeline.snapThreshold.label")}
        description={t("settings.timeline.snapThreshold.description")}
        settingKey="timelineSnapThreshold"
        min={4}
        max={24}
        step={1}
        format={(v) => `${v}px`}
      />
      <ToggleSetting
        label={t("settings.timeline.follow.label")}
        description={t("settings.timeline.follow.description")}
        settingKey="followPlayhead"
      />
      <ToggleSetting
        label={t("settings.timeline.horizontalScroll.label")}
        description={t("settings.timeline.horizontalScroll.description")}
        settingKey="timelineHorizontalScroll"
      />
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { TimelineSection };
