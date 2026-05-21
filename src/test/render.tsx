import { DndContext } from "@dnd-kit/core";
import { MotionConfig } from "motion/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import {
  render as baseRender,
  type RenderOptions,
  type RenderResult,
} from "vitest-browser-react";

interface CallEditorRenderOptions extends RenderOptions {
  dndContext?: boolean;
  withRouter?: boolean | { initialEntries?: string[]; initialIndex?: number };
}

function buildWrapper(
  dndContext: boolean,
  withRouter: CallEditorRenderOptions["withRouter"],
) {
  return function CallEditorWrapper({ children }: { children: ReactNode }) {
    let tree: ReactNode = (
      <MotionConfig reducedMotion="always">{children}</MotionConfig>
    );
    if (dndContext) tree = <DndContext>{tree}</DndContext>;
    if (withRouter) {
      const routerOptions = typeof withRouter === "object" ? withRouter : {};
      tree = (
        <MemoryRouter
          initialEntries={routerOptions.initialEntries ?? ["/"]}
          initialIndex={routerOptions.initialIndex ?? 0}
        >
          {tree}
        </MemoryRouter>
      );
    }
    return <>{tree}</>;
  };
}

function render(
  ui: ReactElement,
  options: CallEditorRenderOptions = {},
): Promise<RenderResult> {
  const { dndContext = false, withRouter = false, ...rest } = options;
  return baseRender(ui, {
    ...rest,
    wrapper: buildWrapper(dndContext, withRouter),
  });
}

export { render };
