# User Stories

## Story 1: Stabilize Overdue Report Classification
As a developer,
I want the overdue report to classify records by source-of-truth fields,
So that client-visible overdue output remains correct even with stale status data.

**Acceptance:**
- [ ] Returned records are excluded even when status is stale
- [ ] Past-due unreturned records are included in overdue output
- [ ] UTC boundary behavior is validated with deterministic test data
