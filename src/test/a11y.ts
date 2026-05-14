import axe, { type AxeResults } from "axe-core";

async function runAxe(container: Element): Promise<AxeResults> {
  return axe.run(container, {
    rules: {
      "color-contrast": { enabled: false },
    },
  });
}

function formatViolations(results: AxeResults): string {
  if (results.violations.length === 0) return "";
  return results.violations
    .map((v) => `${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? "" : "s"})`)
    .join("\n");
}

export { runAxe, formatViolations };
