import type { LinkGroup } from "@/stores/project";
import { GroupBanner } from "@/views/timeline/group-banner";
import { useTimelineStore } from "@/views/timeline/timeline-store";
import { memo } from "react";

// -- Types ---------------------------------------------------------------------

interface GroupHeaderRowProps {
  group: LinkGroup;
  instanceIdx: number;
  totalInstances: number;
  instanceStart: number;
  instanceEnd: number;
}

// -- Constants -----------------------------------------------------------------

const GROUP_HEADER_HEIGHT = 26;

// -- Component -----------------------------------------------------------------

const GroupHeaderRowComponent: React.FC<GroupHeaderRowProps> = ({
  group,
  instanceIdx,
  totalInstances,
  instanceStart,
  instanceEnd,
}) => {
  const zoom = useTimelineStore((s) => s.zoom);
  const scrollLeft = useTimelineStore((s) => s.scrollLeft);
  const collapsedInstances = useTimelineStore((s) => s.collapsedInstances);
  const isCollapsed = collapsedInstances[`${group.id}:${instanceIdx}`] ?? false;

  return (
    <div
      className="relative flex"
      style={{ height: GROUP_HEADER_HEIGHT }}
      data-group-header={`${group.id}:${instanceIdx}`}
    >
      <div
        className="shrink-0 bg-composer-bg w-12 sticky left-0 z-[60] border-r border-composer-border"
        style={{ borderRightColor: group.color }}
      />
      <div className="flex-1 overflow-hidden border-b border-composer-border relative">
        <GroupBanner
          group={group}
          instanceIdx={instanceIdx}
          totalInstances={totalInstances}
          instanceStart={instanceStart}
          instanceEnd={instanceEnd}
          isCollapsed={isCollapsed}
          zoom={zoom}
          scrollLeft={scrollLeft}
        />
      </div>
    </div>
  );
};

const GroupHeaderRow = memo(GroupHeaderRowComponent);

// -- Exports -------------------------------------------------------------------

export { GroupHeaderRow, GROUP_HEADER_HEIGHT };
export type { GroupHeaderRowProps };
