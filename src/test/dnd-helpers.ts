import { page } from "@vitest/browser/context";

const DND_KIT_ACTIVATION_DISTANCE = 8;

interface Point {
  x: number;
  y: number;
}

async function dragLocator(
  fromLocator: { element: () => Element },
  toPoint: Point,
): Promise<void> {
  const element = fromLocator.element();
  const rect = element.getBoundingClientRect();
  const start: Point = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };

  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + DND_KIT_ACTIVATION_DISTANCE + 1, start.y);
  await page.mouse.move(toPoint.x, toPoint.y);
  await page.mouse.up();
}

export { dragLocator, DND_KIT_ACTIVATION_DISTANCE };
export type { Point };
