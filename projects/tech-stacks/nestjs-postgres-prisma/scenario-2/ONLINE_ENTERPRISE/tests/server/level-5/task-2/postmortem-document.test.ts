import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const POSTMORTEM_PATH = resolve(__dirname, "../../../../POSTMORTEM.md");

describe("Level 5 / Task 2 — Postmortem Document", () => {
  it("POSTMORTEM.md exists at the project root", () => {
    expect(existsSync(POSTMORTEM_PATH)).toBe(true);
  });

  it("POSTMORTEM.md mentions the race condition / oversell root cause", () => {
    const content = readFileSync(POSTMORTEM_PATH, "utf-8").toLowerCase();
    const hasMention =
      content.includes("race condition") ||
      content.includes("concurren") ||
      content.includes("oversell") ||
      content.includes("locking");
    expect(hasMention).toBe(true);
  });

  it("POSTMORTEM.md mentions the decimal precision root cause", () => {
    const content = readFileSync(POSTMORTEM_PATH, "utf-8").toLowerCase();
    const hasMention =
      content.includes("decimal") ||
      content.includes("precision") ||
      content.includes("rounding") ||
      content.includes("float");
    expect(hasMention).toBe(true);
  });

  it("POSTMORTEM.md mentions the timezone root cause", () => {
    const content = readFileSync(POSTMORTEM_PATH, "utf-8").toLowerCase();
    const hasMention =
      content.includes("timezone") ||
      content.includes("utc") ||
      content.includes("date boundary") ||
      content.includes("midnight");
    expect(hasMention).toBe(true);
  });
});
