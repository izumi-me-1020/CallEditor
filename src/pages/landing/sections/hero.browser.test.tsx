import { describe, expect, it } from "vitest";
import { Hero } from "@/pages/landing/sections/hero";
import { render } from "@/test/render";

describe("Hero", () => {
  it("renders the headline and primary CTA", async () => {
    const screen = await render(
      <Hero
        headline="Make synced lyrics"
        subhead="The fastest way"
        primaryCta={{ label: "Open", href: "/" }}
      />,
      { withRouter: true },
    );
    await expect.element(screen.getByText("Make synced lyrics")).toBeInTheDocument();
    await expect.element(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders an optional eyebrow and secondary CTA", async () => {
    const screen = await render(
      <Hero
        eyebrow="New"
        headline="Title"
        subhead="Sub"
        primaryCta={{ label: "Go", href: "/" }}
        secondaryCta={{ label: "Docs", href: "/docs" }}
      />,
      { withRouter: true },
    );
    expect(screen.container.textContent).toContain("New");
    await expect.element(screen.getByText("Docs")).toBeInTheDocument();
  });
});
