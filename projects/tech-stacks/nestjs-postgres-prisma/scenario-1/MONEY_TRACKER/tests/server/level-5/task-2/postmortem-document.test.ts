import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

// The learner is expected to create POSTMORTEM.md at the project root.
const POSTMORTEM_PATH = resolve(__dirname, "../../../../POSTMORTEM.md");

describe("Level 5 / Task 2 — Postmortem Document", () => {
  it("POSTMORTEM.md exists at the project root", () => {
    expect(existsSync(POSTMORTEM_PATH)).toBe(true);
  });

  it("POSTMORTEM.md mentions balance drift root cause", () => {
    const content = readFileSync(POSTMORTEM_PATH, "utf-8").toLowerCase();
    const hasMention =
      content.includes("balance") ||
      content.includes("concurren") ||
      content.includes("race condition") ||
      content.includes("locking");
    expect(hasMention).toBe(true);
  });

  it("POSTMORTEM.md mentions timezone root cause", () => {
    const content = readFileSync(POSTMORTEM_PATH, "utf-8").toLowerCase();
    const hasMention = content.includes("timezone") || content.includes("utc") || content.includes("date boundary");
    expect(hasMention).toBe(true);
  });

  it("POSTMORTEM.md mentions division-by-zero root cause", () => {
    const content = readFileSync(POSTMORTEM_PATH, "utf-8").toLowerCase();
    const hasMention =
      content.includes("division") ||
      content.includes("nan") ||
      content.includes("infinity") ||
      content.includes("zero") ||
      content.includes("budget amount");
    expect(hasMention).toBe(true);
  });
});
