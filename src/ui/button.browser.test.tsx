import { describe, expect, it } from "vitest";
import { Button } from "@/ui/button";
import { render } from "@/test/render";

// -- Render -------------------------------------------------------------------

describe("Button", () => {
  it("renders children inside a button element", async () => {
    const screen = await render(<Button>Click me</Button>);
    await expect.element(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("fires onClick when activated by the mouse", async () => {
    let clicks = 0;
    const screen = await render(<Button onClick={() => clicks++}>Press</Button>);
    await screen.getByRole("button", { name: "Press" }).click();
    expect(clicks).toBe(1);
  });

  it("fires onClick when activated by the keyboard", async () => {
    let clicks = 0;
    const screen = await render(<Button onClick={() => clicks++}>Press</Button>);
    const button = screen.getByRole("button", { name: "Press" });
    (button.element() as HTMLButtonElement).focus();
    await button.element().dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    (button.element() as HTMLButtonElement).click();
    expect(clicks).toBeGreaterThanOrEqual(1);
  });

  // -- Disabled state ---------------------------------------------------------

  it("does not fire onClick when disabled", async () => {
    let clicks = 0;
    const screen = await render(
      <Button disabled onClick={() => clicks++}>
        Press
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Press" }).element() as HTMLButtonElement;
    expect(el.disabled).toBe(true);
    el.click();
    expect(clicks).toBe(0);
  });

  // -- Variants ---------------------------------------------------------------

  it("applies primary variant classes when variant='primary'", async () => {
    const screen = await render(<Button variant="primary">Go</Button>);
    const el = screen.getByRole("button", { name: "Go" }).element();
    expect(el.className).toContain("bg-composer-accent-dark");
  });

  it("applies secondary variant classes by default", async () => {
    const screen = await render(<Button>Go</Button>);
    const el = screen.getByRole("button", { name: "Go" }).element();
    expect(el.className).toContain("bg-composer-button");
  });

  it("applies ghost variant classes when variant='ghost'", async () => {
    const screen = await render(<Button variant="ghost">Go</Button>);
    const el = screen.getByRole("button", { name: "Go" }).element();
    expect(el.className).toContain("text-composer-text-muted");
  });

  // -- Size + icon padding ----------------------------------------------------

  it("uses symmetric padding without hasIcon", async () => {
    const screen = await render(<Button size="md">Go</Button>);
    const el = screen.getByRole("button", { name: "Go" }).element();
    expect(el.className).toContain("px-3");
  });

  it("uses asymmetric padding with hasIcon", async () => {
    const screen = await render(
      <Button size="md" hasIcon>
        Go
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Go" }).element();
    expect(el.className).toContain("pl-2.5");
    expect(el.className).toContain("pr-3.5");
  });

  it("renders a square icon button when size='icon'", async () => {
    const screen = await render(
      <Button size="icon" aria-label="settings">
        S
      </Button>,
    );
    const el = screen.getByRole("button", { name: "settings" }).element();
    expect(el.className).toContain("h-8");
    expect(el.className).toContain("w-8");
  });
});
