# User Stories

## Story 1: Reuse Availability Logic
As a developer,
I want availability checks in a reusable helper,
So that the logic stays consistent across views.

**Acceptance:**
- [ ] Availability logic is extracted to helper `isBookAvailable` in `client/src/utils/helpers.ts`
- [ ] Helper input/output is clear: number of available copies in, boolean availability out
- [ ] Existing borrow page behavior remains correct after extraction
- [ ] Helper can be reused by other UI components without renaming/redefining
- [ ] Using a different helper name/path is treated as incomplete implementation
- [ ] Multiple valid implementations are allowed; evaluation focuses on behavior and contract, not exact line-by-line code
