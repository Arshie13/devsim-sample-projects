# Acceptance Criteria

## AC-1: Overdue Output Correctness
- [ ] `/api/borrow-records/overdue` excludes any record with `returnedAt != null` regardless of status value
- [ ] `/api/borrow-records/overdue` includes past-due unreturned records

## AC-2: Production Edge Reliability
- [ ] A stale-status discrepancy case is reproducible and covered by tests
- [ ] A UTC midnight boundary case is covered by deterministic test data
