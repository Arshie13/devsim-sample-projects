# City Hall Customer Support – Developer Challenge Levels

Welcome to the City Hall Customer Support project! You've joined the team responsible for the citizen-facing chat portal and the support-agent dashboard, built with Next.js and shadcn/ui. Complete the levels below to demonstrate your frontend development skills.

For this scenario, the support agent demo credentials are:

| Role          | Username | Password    |
| ------------- | -------- | ----------- |
| Support Agent | admin    | admin123    |

---

## 🎮 Level 1: Setup & Simple UI Fixes
**Difficulty: ⭐ Easy**
**Estimated Time: 30 minutes**

### Scenario
City Hall has onboarded a new developer (you!) and needs the system running locally with environment configuration and minor UI tweaks.

### Tasks

#### Task 1.1: Environment Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables by creating a `.env.local` file at [`client/.env.local`](client/.env.local:1):
   ```
   NEXT_PUBLIC_APP_NAME=City Hall Support
   NEXT_PUBLIC_SUPPORT_PHONE=(555) 123-4567
   NEXT_PUBLIC_SUPPORT_EMAIL=support@cityhall.gov
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 and verify the app loads.
5. Replace the hard-coded phone number and email in the home page footer ([`src/app/page.tsx`](src/app/page.tsx:91)) and the support page ([`src/app/support/page.tsx`](src/app/support/page.tsx:1)) with values from `NEXT_PUBLIC_SUPPORT_PHONE` and `NEXT_PUBLIC_SUPPORT_EMAIL`.

#### Task 1.2: UI Text Updates
1. Change the agent login button label from **"Sign In"** to **"Login"**:
   - File: [`src/app/agent/login/page.tsx`](src/app/agent/login/page.tsx:139)
2. Change the support page logout button label from **"Return to menu"** to **"Logout"**:
   - File: [`src/app/support/page.tsx`](src/app/support/page.tsx:188)
3. Update the home page heading to read the value of `NEXT_PUBLIC_APP_NAME` instead of the hard-coded "City Hall Support":
   - File: [`src/app/page.tsx`](src/app/page.tsx:35)

### Success Criteria
- [ ] App runs without errors on `npm run dev`
- [ ] `.env.local` file is properly configured
- [ ] Updated text appears correctly
- [ ] Footer phone/email reflect environment variables

---

## 🎮 Level 2: Bug Fixing & Refactoring
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1 hour**

### Scenario
Agents report that the conversation status badges are visually noisy and similar messaging components are duplicated across pages.

### Tasks

#### Task 2.1: Fix Conversation Status Badge Colors
**Bug:** The agent dashboard uses inconsistent badge colors that hurt readability — e.g. waiting badges use `bg-yellow-500` (low contrast against white text).

- File: [`src/app/agent/page.tsx`](src/app/agent/page.tsx:255)
- Replace `getStatusBadge` so each status maps to a distinct, accessible Tailwind palette:
  - `active` → `bg-green-100 text-green-800`
  - `waiting` → `bg-yellow-100 text-yellow-800`
  - `resolved` → `bg-gray-100 text-gray-800`

#### Task 2.2: Refactor & Extract Component
1. Create a reusable [`MessageBubble`](src/components/MessageBubble.tsx:1) component:
   - Move the per-message JSX from both [`src/app/support/page.tsx`](src/app/support/page.tsx:307) and [`src/app/agent/page.tsx`](src/app/agent/page.tsx:409) into this component.
   - Accept a `message` prop with `{ id, role, content, timestamp }` and a `viewer` prop (`"customer"` | `"agent"`) so the bubble knows which side to align to.
   - Update both pages to use the new component.
2. Refactor the `activeCount` / `waitingCount` / resolved-count derivations on the agent page into a single `useMemo` returning `{ active, waiting, resolved }` instead of three inline `.filter()` calls.

### Success Criteria
- [ ] Status badges render with the new palette across `active`, `waiting`, and `resolved`
- [ ] `MessageBubble` component exists at `src/components/MessageBubble.tsx` and is used in both pages
- [ ] Agent dashboard derives counts via `useMemo`

---

## 🎮 Level 3: Feature Development
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2–3 hours**

### Scenario
Volume is up — agents need to find conversations quickly, and citizens want to revisit complaints they previously filed.

### Tasks

#### Task 3.1: Conversation Search & Status Filter
1. In [`src/app/agent/page.tsx`](src/app/agent/page.tsx:1), add a search input above the conversations list (placeholder: "Search conversations...").
2. Filter the list by either:
   - `customer.fullName` (case-insensitive), OR
   - `customer.complaint` (case-insensitive)
3. Add a status filter row (`All` / `Active` / `Waiting` / `Resolved`) that combines with the search.
4. When no conversations match, show "No conversations found" inside the conversations card.

#### Task 3.2: Citizen Complaint History Page
1. Create [`src/app/support/history/page.tsx`](src/app/support/history/page.tsx:1).
2. Read past complaints from `localStorage` under key `"customerComplaints"` (an array of `{ fullName, address, city, zipCode, complaint, submittedAt }`).
3. Display them in a table or card list with columns/fields for **Submitted**, **Name**, **City + ZIP**, and **Complaint**.
4. Show "No complaints submitted yet" when the list is empty.
5. Add a "View History" link/button in [`src/app/support/page.tsx`](src/app/support/page.tsx:1) that routes to `/support/history`.
6. When the citizen submits the agent-request form, push a new entry to `customerComplaints` in `localStorage` with `submittedAt = new Date().toISOString()`.

### Success Criteria
- [ ] Search input filters conversations by name or complaint text in real-time
- [ ] Status filter chips combine correctly with search
- [ ] "No conversations found" message renders when filters yield zero results
- [ ] History page lists previously submitted complaints from `localStorage`
- [ ] Submitting the support form persists a new complaint entry

---

## 🎮 Level 4: Integration & Edge Cases
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2–3 hours**

### Scenario
QA flagged that the citizen form accepts garbage input, and that messages and conversations vanish on page reload.

### Tasks

#### Task 4.1: Form & Message Validation
In [`src/app/support/page.tsx`](src/app/support/page.tsx:1), enforce these rules on the "Connect with an Agent" form:

1. `fullName` must be at least 2 characters.
2. `zipCode` must match exactly 5 digits (`/^\d{5}$/`).
3. `complaint` must be at least 10 characters.
4. On invalid input, show an inline error message under the offending field (e.g. `"ZIP code must be 5 digits"`) and disable the **Submit Request** button.
5. In the chat input on both `/support` and `/agent`, prevent sending when the message is whitespace-only (the existing `disabled={!inputValue.trim()}` should remain — verify it works and no whitespace-only message is appended).

#### Task 4.2: localStorage Persistence
1. Create a custom hook in [`src/hooks/useLocalStorage.ts`](src/hooks/useLocalStorage.ts:1):
   ```ts
   export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T) => void]
   ```
   It should hydrate from `localStorage` on mount and persist on every set.
2. In [`src/app/agent/page.tsx`](src/app/agent/page.tsx:1):
   - Persist the conversations list under `"agentConversations"`.
   - Persist `agentStatus` under `"agentStatus"`.
3. In [`src/app/support/page.tsx`](src/app/support/page.tsx:1):
   - Persist the chat messages under `"supportMessages"`.

### Success Criteria
- [ ] Submit button is disabled until all fields are valid
- [ ] Inline error messages appear for each failing field
- [ ] Whitespace-only chat messages cannot be sent
- [ ] Conversations, agent status, and chat messages survive page reload
- [ ] `useLocalStorage` hook exists and is used in both pages

---

## 🎮 Level 5: Real Client Issue
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3–4 hours**

### Issue Report
> "Agents complain that the unread badge stays red even after they click into a conversation. The badge count is also wrong — it doesn't match the number of unread customer messages. Also, we'd like timestamps to show as 'Just now' / '5m ago' instead of raw times."

### Tasks

#### Task 5.1: Fix Unread Count Bug
1. In [`src/app/agent/page.tsx`](src/app/agent/page.tsx:1), when the agent clicks a conversation, set its `unreadCount` to `0` immediately.
2. The unread badge should not render when `unreadCount === 0` (currently fine — verify it stays correct after fix).
3. Ensure the **header stats** (`activeCount`, `waitingCount`, resolved count from Task 2.2's `useMemo`) update correctly after a conversation is resolved (regression: don't break it).
4. The selected conversation's `unreadCount` shown in the customer-details / chat header context must match the underlying `conversations[i].unreadCount` after updates (i.e. update both `conversations` state and `selectedConversation` state on click — don't let them drift).

#### Task 5.2: Date Utilities & Documentation
1. Create [`src/lib/dateUtils.ts`](src/lib/dateUtils.ts:1) exporting:
   - `formatRelativeTime(date: Date | string): string` — `"Just now"` (<1m), `"Nm ago"` (<60m), `"Nh ago"` (<24h), otherwise the locale date string.
   - `isStale(date: Date | string): boolean` — returns `true` when `date` is older than 24 hours.
   - `formatTimestamp(date: Date | string): string` — `"Jan 15, 2026 14:32"` style.
   - All three must return safe values for invalid input (`""` for the strings, `false` for `isStale`).
2. Replace the inline `formatTime` helper in [`src/app/agent/page.tsx`](src/app/agent/page.tsx:242) with `formatRelativeTime` from the new module.
3. Update [`README.md`](README.md:1) with:
   - Project overview (City Hall customer support portal)
   - Demo credentials
   - How to run dev server
   - List of routes (`/`, `/support`, `/support/history`, `/agent/login`, `/agent`)

### Success Criteria
- [ ] Clicking a conversation clears its unread count
- [ ] Conversation list, selected conversation, and header stats stay in sync
- [ ] `dateUtils.ts` exports the three functions with correct behavior
- [ ] Agent page uses `formatRelativeTime` instead of the local helper
- [ ] `README.md` documents the project, credentials, dev workflow, and routes

---

## 🏆 Scoring

| Level | Points |
|-------|--------|
| Level 1 | 10 pts |
| Level 2 | 25 pts |
| Level 3 | 40 pts |
| Level 4 | 60 pts |
| Level 5 | 75 pts |

**Bonus:** +20 pts for clean code, component organization, and comprehensive tests.

**Total:** 210 pts + bonus

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hooks Reference](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Good luck, developer! City Hall is counting on you. 🏛️📞*
