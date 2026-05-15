# City Hall Customer Support – Developer Challenge Levels

Welcome to the City Hall Customer Support project! You've joined the team behind two surfaces that always have to stay in sync: the **citizen-facing chat portal** and the **support-agent dashboard**, both built with Next.js and shadcn/ui.

The five levels below are a deliberate difficulty ramp. **Level 1 is a gentle warm-up** — config and copy changes only. Each level after it adds more moving parts, and **Level 5 is a genuinely hard production bug hunt** where your fixes have to stay consistent with features you built earlier. Almost every level asks you to touch *both* the citizen side and the agent side of the product.

For this scenario, the support agent demo credentials are:

| Role          | Username | Password    |
| ------------- | -------- | ----------- |
| Support Agent | admin    | admin123    |

---

## 🎮 Level 1: Onboarding & Citizen-Facing Branding
**Difficulty: ⭐ Very Easy**
**Estimated Time: 25–40 minutes**

### Scenario
Two audiences reach this product on day one: citizens looking for help and agents logging in to give it. Before touching any logic, get both surfaces running locally and make sure the contact details and brand copy that citizens see are driven by configuration — not hard-coded strings scattered across pages.

### Tasks

#### Task 1.1: Environment & Contact Configuration
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

#### Task 1.2: Brand & Button Copy
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

## 🎮 Level 2: A Smarter Self-Service Layer
**Difficulty: ⭐⭐ Easy**
**Estimated Time: 1–1.5 hours**

### Scenario
The AI assistant answers with the *first* keyword it stumbles across, so "I have a permit question about my tax bill" gets a permits answer and ignores taxes entirely. Meanwhile agents retype the same greetings dozens of times a day. This level is still small in scope — two self-contained modules — but it's your first taste of writing real logic.

### Tasks

#### Task 2.1: Intent-Matching AI Engine
The starter `getAIResponse` in [`src/app/support/page.tsx`](src/app/support/page.tsx:80) returns the first `aiResponses` entry whose key appears in the message — order-dependent and easily wrong.

1. Create [`src/lib/intentMatcher.ts`](src/lib/intentMatcher.ts:1) with this keyword map (a *hit* is a keyword that appears as a substring of the lower-cased input):

   | Intent      | Keywords                                                   |
   |-------------|------------------------------------------------------------|
   | `permits`   | `permit`, `license`, `application`                         |
   | `taxes`     | `tax`, `taxes`, `assessment`, `property tax`               |
   | `trash`     | `trash`, `garbage`, `recycling`, `pickup`, `collection`    |
   | `utilities` | `water`, `electricity`, `utility`, `outage`, `sewer`       |
   | `parking`   | `parking`, `meter`, `ticket`, `tow`                        |
   | `hours`     | `hours`, `open`, `closed`, `schedule`                      |

2. Export `matchIntent(input: string): { intent: string; score: number }`:
   - `score` is the number of keyword hits for the winning intent.
   - Return the intent with the highest score; on a tie, any tied intent is acceptable.
   - When nothing matches, return `{ intent: "fallback", score: 0 }`.
3. Export `getAssistantReply(input: string): string`:
   - Returns a helpful reply for the matched intent.
   - The `fallback` reply must offer to connect the citizen to a human **agent**.
4. Replace the inline `getAIResponse` logic in the support page chat flow with `getAssistantReply` from the new module.

#### Task 2.2: Agent Quick-Reply Snippets
1. Create [`src/lib/quickReplies.ts`](src/lib/quickReplies.ts:1) exporting `quickReplies`, a non-empty array of `{ id: string; label: string; text: string }` canned snippets (e.g. a greeting, a "looking into it" holding line, a closing).
2. On the agent dashboard ([`src/app/agent/page.tsx`](src/app/agent/page.tsx:1)), render a row of quick-reply buttons directly above the message input — one button per snippet, labelled with `snippet.label`.
3. Clicking a snippet appends its `text` to the current message input value (it must not wipe text the agent has already typed).

### Success Criteria
- [ ] `matchIntent` scores keyword hits and returns the strongest intent
- [ ] Unmatched input resolves to the `fallback` intent
- [ ] `getAssistantReply` powers the support chat; the fallback offers a human agent
- [ ] One quick-reply button renders per snippet and inserts its text on click

---

## 🎮 Level 3: Triage & Service Levels
**Difficulty: ⭐⭐⭐ Medium**
**Estimated Time: 2–2.5 hours**

### Scenario
The agent dashboard lists conversations in whatever order they arrived. Agents can't tell who has been waiting longest, who has unread messages piling up, or who still hasn't had a single reply. This level steps up the difficulty: your modules now *change how the dashboard renders* — the list re-orders and new indicators appear.

### Tasks

#### Task 3.1: Priority Scoring & Sorting
1. Create [`src/lib/priority.ts`](src/lib/priority.ts:1).
2. Export `getPriorityScore(conversation): number`:
   - A `resolved` conversation always scores `0`.
   - Otherwise the score is `statusWeight + unreadCount * 10 + ageBonus`, where:
     - `statusWeight` = `40` for `waiting`, `10` for `active`
     - `ageBonus` = `Math.min(Math.floor(hoursSinceCreated), 12)`
3. Export `getPriorityLevel(conversation): "low" | "normal" | "high" | "urgent"`:
   - `urgent` when score ≥ 70, `high` when score ≥ 35, `normal` when score ≥ 10, otherwise `low`.
4. In [`src/app/agent/page.tsx`](src/app/agent/page.tsx:1), sort the conversation list by priority score, highest first, and surface each row's priority level.

#### Task 3.2: First-Response SLA Indicator
1. Create [`src/lib/sla.ts`](src/lib/sla.ts:1).
2. Export `hasAgentReplied(conversation): boolean` — `true` when at least one message has `role === "agent"`.
3. Export `getServiceState(conversation): "awaiting-first-reply" | "in-progress" | "resolved"`:
   - `resolved` when the conversation status is `resolved`.
   - `awaiting-first-reply` when no agent message exists yet.
   - `in-progress` otherwise.
4. On the agent dashboard, show an **"Awaiting first reply"** badge on every conversation whose service state is `awaiting-first-reply`, and a header stat with the count of such conversations.

### Success Criteria
- [ ] `getPriorityScore` ranks waiting > active > resolved and rewards unread messages
- [ ] `getPriorityLevel` maps scores to the four tiers
- [ ] The conversation list is sorted by priority, highest first
- [ ] Conversations with no agent reply show the "Awaiting first reply" badge

---

## 🎮 Level 4: Live Queue & Agent Tooling
**Difficulty: ⭐⭐⭐⭐ Hard**
**Estimated Time: 3–4 hours**

### Scenario
When a citizen asks for a human, the app shows a hard-coded "2 in queue" with no idea how long that means. And agents work the dashboard all day with a mouse. This is a hard level: you'll build a real wait estimator wired into a live queue, and add genuine interaction handling with global keyboard events.

### Tasks

#### Task 4.1: Live Queue Estimator
1. Create [`src/lib/queue.ts`](src/lib/queue.ts:1).
2. Export `estimateWaitMinutes(position: number, avgHandleMinutes?: number): number`:
   - `avgHandleMinutes` defaults to `4`.
   - Returns `position * avgHandleMinutes`, never negative.
3. Export `formatWait(minutes: number): string`:
   - `< 1` → `"less than a minute"`
   - `< 60` → `"about N minutes"`
   - `≥ 60` → `"over an hour"`
   - Invalid input (`NaN` / non-finite) → `""`.
4. In [`src/app/support/page.tsx`](src/app/support/page.tsx:1), when the "Connect with an Agent" form is submitted, display the citizen's queue position and a line of the form `Estimated wait: <formatWait(...)>`. As the queue advances, the position and estimate update.

#### Task 4.2: Agent Keyboard Shortcuts
In [`src/app/agent/page.tsx`](src/app/agent/page.tsx:1), add a global `keydown` handler so agents can work without the mouse:
1. `ArrowDown` / `ArrowUp` move the selected conversation to the next / previous one in the visible list.
2. `Ctrl+Enter` (or `Cmd+Enter`) inside the message input sends the current message.
3. `Escape` clears the message input.

### Success Criteria
- [ ] `estimateWaitMinutes` and `formatWait` behave per spec, including safe fallbacks
- [ ] Submitting the agent-request form shows a position and an estimated wait
- [ ] Arrow keys move the conversation selection
- [ ] Ctrl/Cmd+Enter sends, Escape clears the message input

---

## 🎮 Level 5: Production Bug Hunt
**Difficulty: ⭐⭐⭐⭐⭐ Very Hard**
**Estimated Time: 4–6 hours**

### Issue Report
> "The agent dashboard is misbehaving in production. One: when an agent sets themselves to **Offline**, they can still type and send replies — citizens think someone's there who has gone home. Two: the red unread badge on a conversation never goes away, even after the agent has clearly opened it. And separately — supervisors keep asking us to hand them a transcript of a conversation, and our README is still the create-next-app boilerplate."

This is the hardest level. The two dashboard bugs interact with the Level 3 priority sort and SLA badges, so a careless fix quietly breaks those features. Trace the dashboard's state flow carefully before changing anything.

### Tasks

#### Task 5.1: Fix Two Dashboard Bugs
**Bug A — the status selector is cosmetic.** Nothing reads `agentStatus`.
1. In [`src/app/agent/page.tsx`](src/app/agent/page.tsx:1), when `agentStatus` is `"offline"`:
   - Disable the message input and its send button.
   - Show an inline notice that reads exactly: **"You are offline — set your status to Online to reply."**
2. Returning to `"online"` (or `"away"`) re-enables replying and removes the notice.

**Bug B — the unread badge never clears.** Clicking a conversation selects it but never resets its unread count.

3. When the agent opens a conversation, set that conversation's `unreadCount` to `0`.
4. Reset the count on the `conversations` array itself — not on a detached copy — so the Level 3 priority score recomputes and the sorted list and SLA badges stay consistent. Other conversations' unread counts must be left untouched.

#### Task 5.2: Transcript Export & Documentation
1. Create [`src/lib/transcript.ts`](src/lib/transcript.ts:1) exporting `formatTranscript(conversation): string`:
   - A plain-text transcript: a header line with the customer's full name, then one line per message in the form `[HH:MM] Role: content`.
   - Must return a string for any input, including a conversation with no messages (never throws).
2. Add an **"Export Transcript"** button on the agent dashboard that builds the transcript for the selected conversation with `formatTranscript`.
3. Replace the boilerplate [`README.md`](README.md:1) with:
   - Project overview (City Hall customer support portal)
   - Demo credentials
   - How to run the dev server
   - List of routes (`/`, `/support`, `/agent/login`, `/agent`)

### Success Criteria
- [ ] An offline agent cannot type or send; the notice appears, and Online restores both
- [ ] Opening a conversation clears its unread badge; other conversations are unaffected
- [ ] The priority sort and SLA badges stay correct after the unread reset
- [ ] `formatTranscript` produces a readable transcript and never throws
- [ ] An "Export Transcript" button exists on the dashboard
- [ ] `README.md` documents the project, credentials, dev workflow, and routes

---

## 🏆 Scoring

| Level | Difficulty | Points |
|-------|------------|--------|
| Level 1 | ⭐ Very Easy | 10 pts |
| Level 2 | ⭐⭐ Easy | 30 pts |
| Level 3 | ⭐⭐⭐ Medium | 50 pts |
| Level 4 | ⭐⭐⭐⭐ Hard | 70 pts |
| Level 5 | ⭐⭐⭐⭐⭐ Very Hard | 85 pts |

**Bonus:** +20 pts for clean code, module organization, and comprehensive tests.

**Total:** 245 pts + bonus

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [MDN: KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)
- [React Hooks Reference](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Good luck, developer! City Hall is counting on you. 🏛️📞*
