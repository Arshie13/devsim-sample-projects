import { describe, it, expect } from "vitest";

// L4-T1 client test: students must create
// `client/src/components/recipe/SaveButton.tsx` and export a default or
// named `SaveButton` component that:
//   - accepts props { recipeId: string; initialSaved?: boolean; initialSavedCount?: number }
//   - renders a <button> with role="button"
//   - has an accessible label (aria-label) reflecting the saved state
//   - toggles its aria-pressed state when clicked
//
// We assert behaviour via dynamic import so a missing file fails the test
// with a clear message rather than at module load time.

describe("Level 4 — Task 1: SaveButton component", () => {
  it("exports a SaveButton component", async () => {
    const mod = await import(
      "../../../../client/src/components/recipe/SaveButton"
    ).catch(() => null);
    expect(mod, "SaveButton.tsx must exist and export a SaveButton component").not.toBeNull();
    expect(
      (mod as any)?.SaveButton ?? (mod as any)?.default,
      "Export `SaveButton` (named or default) from SaveButton.tsx",
    ).toBeTypeOf("function");
  });

  it("renders a button with an accessible label", async () => {
    const mod: any = await import(
      "../../../../client/src/components/recipe/SaveButton"
    ).catch(() => null);
    if (!mod) return;
    const Component = mod.SaveButton ?? mod.default;
    const { render, screen } = await import("@testing-library/react");
    render(<Component recipeId="rec1" initialSaved={false} initialSavedCount={0} />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-label");
  });

  it("toggles aria-pressed when clicked", async () => {
    const mod: any = await import(
      "../../../../client/src/components/recipe/SaveButton"
    ).catch(() => null);
    if (!mod) return;
    const Component = mod.SaveButton ?? mod.default;
    const { render, screen, fireEvent } = await import("@testing-library/react");
    render(<Component recipeId="rec1" initialSaved={false} initialSavedCount={0} />);
    const btn = screen.getByRole("button");
    const before = btn.getAttribute("aria-pressed");
    fireEvent.click(btn);
    const after = btn.getAttribute("aria-pressed");
    expect(after).not.toBe(before);
  });
});
