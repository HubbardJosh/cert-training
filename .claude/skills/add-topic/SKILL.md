---
name: add-topic
description: Adds a new deep-dive topic to the cert-training app. Use when the user runs /add-topic "Topic Name". Creates all guides, flashcards, and quiz questions for the topic and wires it into TopicContext and useTopicData.
---

You are the **content builder** for deep-dive topics in the cert-training study app at `/Users/joshhubbard/cert-training`.

The argument passed after `/add-topic` is the topic name in quotes (e.g. `"AWS Lambda Internals"`, `"Anthropic Claude API"`). Extract it from the invocation.

---

## Core principle

**Cover the topic exhaustively.** Deep-dive topics go beyond what certification curricula cover — they are for mastering a specific service or technology in depth. Ask yourself: "Would an experienced practitioner find gaps here?" Write enough to satisfy a thorough learner, not just someone preparing for a multiple-choice exam.

For guides: write as many sections as the topic warrants. Each section should cover a distinct sub-concept with enough depth that a reader comes away understanding it, not just recognizing it.

For flashcards: every concept, limit, default, API behavior, comparison, and architectural pattern should have a card.

For quiz questions: write scenario-based questions that test real understanding — not just recall.

---

## Step 0 — Read the architecture

Before writing anything, read these files:

- `src/context/TopicContext.tsx` — `TopicMeta` interface and `TOPIC_META` registry
- `src/context/useTopicData.ts` — switch that maps topic ID to data imports
- `src/data/topics/bedrock-agentcore/guides/index.ts` — example guide index
- `src/data/topics/bedrock-agentcore/guides/overview.ts` — example deep guide (read the first 60 lines)
- `src/data/topics/bedrock-agentcore/flashcards.ts` — example flashcard file (read the first 50 lines)
- `src/data/topics/bedrock-agentcore/quizQuestions.ts` — example quiz questions file (read the first 60 lines)
- `src/types/index.ts` — `FlashCard` and `QuizQuestion` interfaces (source of truth)
- `src/types/guide.ts` — `ServiceGuide` and `GuideSection` interfaces (source of truth)

---

## Step 1 — Fetch authoritative sources

Before writing any content, fetch the primary official documentation for this topic.

1. Identify the canonical documentation URL(s) for the topic (AWS docs, Anthropic docs, official GitHub, etc.).
2. **WebFetch** the key documentation pages to gather:
   - Official feature names and terminology
   - Concrete limits, defaults, and pricing (where applicable)
   - API names, parameters, and behaviors
   - Architecture patterns and how components relate
   - Known gotchas, constraints, and best practices from the official docs

Use real data from these pages for all content. If a page is unreachable, note it with a `// TODO: verify against <url>` comment and fall back to model knowledge.

---

## Step 2 — Derive topic metadata

From the topic name, derive:

- **id**: kebab-case identifier (e.g. `"aws-lambda-internals"`, `"claude-api"`)
- **name**: short display name (e.g. `"Lambda Internals"`, `"Claude API"`)
- **fullName**: full official name (e.g. `"AWS Lambda — Execution Model & Internals"`)
- **tagline**: one-line description of what this topic covers
- **icon**: an Ionicons icon name fitting the topic (e.g. `"hardware-chip"`, `"code-slash"`, `"flask"`)
- **color**: a hex color fitting the topic's identity (distinct from existing topics)
- **storageKey**: `"topic_progress_<id_with_underscores>"` (e.g. `"topic_progress_aws_lambda_internals"`)
- **category**: the broader grouping for the TopicSelectScreen (e.g. `"AWS Compute"`, `"AWS AI & ML"`, `"Anthropic"`, `"AWS Networking"`)
- **slug**: short slug for the data directory and import names (e.g. `"lambda-internals"`, `"claude-api"`)

Check `src/context/TopicContext.tsx` to confirm the id is not already taken. If it is, stop and report:

> ℹ️ **"{id}"** is already implemented as a topic. No changes needed.

---

## Step 3 — Plan the guide structure

Based on what you fetched in Step 1, plan the guide files. Each guide file covers one coherent sub-topic. Think of these as chapters in a deep-dive book on the topic.

Order guides so each one builds on the previous — foundational concepts first, then mechanics, then advanced patterns, then operational concerns.

There is no minimum or maximum number of guides. Let the topic's depth drive the count. A narrowly scoped topic might have 4 guides; a broad one might have 10+.

---

## Step 4 — Create the directory structure

```
src/data/topics/<slug>/
  guides/
    <guide1>.ts
    <guide2>.ts
    ...
    index.ts
  flashcards.ts
  quizQuestions.ts
  index.ts
```

---

## Step 5 — Write the guide files

For each guide, write `src/data/topics/<slug>/guides/<name>.ts`:

```ts
import { ServiceGuide } from "../../../../types/guide";

// Source: <url you fetched>
export const <camelCaseName>Guide: ServiceGuide = {
  id: "<slug>-<name>",
  service: "<Display Name>",
  domain: "development",   // use the most fitting domain
  tagline: "...",
  intro: "...",
  sections: [
    {
      heading: "...",
      body: `...`,          // full prose, 3–6 sentences
      quiz: [
        {
          question: "...",
          options: ["...", "...", "...", "..."],
          correctIndex: 0,   // GuideQuizQuestion uses correctIndex (singular integer)
          explanation: "...",
        },
      ],
    },
    // as many sections as the sub-topic warrants
  ],
  keyFacts: [
    // every concrete fact, limit, default, and gotcha worth memorizing
  ],
  relatedServices: [
    // services/topics this guide is commonly compared or combined with
  ],
  examTips: [
    // practical insights, architectural patterns, and common mistakes
  ],
};
```

**Domain values** — use the domain that best describes the sub-topic's nature:

| Nature of sub-topic                | Domain            |
| ---------------------------------- | ----------------- |
| API usage, SDKs, programming model | `development`     |
| IAM, auth, encryption, compliance  | `security`        |
| CI/CD, IaC, containers, hosting    | `deployment`      |
| Debugging, observability, cost     | `troubleshooting` |

**CRITICAL — backtick escaping**: `body` fields are template literals. Any inline code inside a body MUST use `\`` (escaped backtick):

```ts
body: `Use \`aws lambda invoke\` to test functions locally.`;
```

A bare backtick inside a template literal closes it and causes a TypeScript syntax error.

**Answer index distribution**: `correctIndex` values across all section quizzes in a guide file must be evenly spread across positions 0–3. Vary them so no single position dominates.

---

## Step 6 — Write the guides index

`src/data/topics/<slug>/guides/index.ts`:

```ts
import { ServiceGuide } from "../../../../types/guide";
import { <name1>Guide } from "./<file1>";
// ... all imports

export const allGuides: ServiceGuide[] = [
  // Platform overview / foundational concepts first
  <guide1>,
  // Then progressively deeper / more advanced
  <guide2>,
  // ...
];

export { ServiceGuide };
```

Order is the recommended study sequence — foundational first, advanced last.

---

## Step 7 — Write the flashcards file

`src/data/topics/<slug>/flashcards.ts`:

```ts
import { FlashCard } from "../../../types";

// Source: <url>
export const flashcards: FlashCard[] = [
  {
    id: "<slug-prefix>-fc-001",
    service: "<Display Name>",
    domain: "development",
    difficulty: "easy" | "medium" | "hard",
    question: "...",
    answer: "...",
    keyPoints: ["...", "..."],
    tags: ["...", "..."],
  },
  // ...
];
```

Use the id prefix derived from the topic slug (e.g. topic `aws-lambda-internals` → prefix `ali`). Keep IDs sequential: `ali-fc-001`, `ali-fc-002`, etc.

Cover per guide:

- What it is and why it matters
- Every major concept
- Key limits, defaults, API behaviors
- Common comparisons and gotchas

Mix difficulties: roughly 30% easy, 50% medium, 20% hard.

---

## Step 8 — Write the quiz questions file

`src/data/topics/<slug>/quizQuestions.ts`:

```ts
import { QuizQuestion } from "../../../types";

// Source: <url>
export const quizQuestions: QuizQuestion[] = [
  {
    id: "<prefix>-qq-001",
    service: "<Display Name>",
    domain: "development",
    difficulty: "easy" | "medium" | "hard",
    type: "single" | "multi",
    question: "...",
    options: ["...", "...", "...", "..."], // exactly 4 for single
    correctIndices: [n], // [n] for single, [n,m] for multi
    explanation: "...",
    optionExplanations: ["...", "...", "...", "..."], // one per option
    tags: ["...", "..."],
  },
  // ...
];
```

Hard rules:

- `"single"` type: exactly 4 options, `correctIndices: [n]`
- `"multi"` type: exactly 5 options, `correctIndices: [n, m]` — exactly 2 correct
- **Always `correctIndices` (array) — never `correctIndex` (singular)**
- ~80% single, ~20% multi
- Questions must be scenario-based and test real understanding
- **Answer index distribution**: spread correct answers evenly across positions 0–3 (and 0–4 for multi). No index should appear correct more than ~30% of the time.

---

## Step 9 — Write the sources file

`src/data/topics/<slug>/sources.ts`:

```ts
import { Source } from "../../sources";

// Source: <primary url fetched in Step 1>
export const sources: Source[] = [
  {
    title: "<Official doc page title>",
    url: "<exact URL fetched>",
    topics: [
      // Bullet-point list of specific facts, limits, and concepts covered by this page
      // that informed the guides, flashcards, and quiz questions
      "...",
    ],
  },
  // One entry per documentation page fetched in Step 1
];
```

Rules:

- One entry per distinct documentation page that was fetched.
- `topics` bullets should be specific — list the actual facts, limits, and API behaviors from that page that appear in the content (not generic descriptions of what the page covers).
- Include the primary service guide, any sub-topic pages (FIFO, security, DLQ, etc.), and any cross-service integration pages referenced.
- URLs must be exact — copy them from the WebFetch calls in Step 1.
- If a page was unreachable, still include it with a note: `"// TODO: verify — page unreachable during authoring"` as the first topic bullet.

---

## Step 10 — Write the topic barrel index

`src/data/topics/<slug>/index.ts`:

```ts
export { allGuides } from "./guides";
export { flashcards } from "./flashcards";
export { quizQuestions } from "./quizQuestions";
export { sources } from "./sources";
```

---

## Step 11 — Register in TopicContext

Edit `src/context/TopicContext.tsx` — add an entry to `TOPIC_META`:

```ts
"<id>": {
  id: "<id>",
  name: "<name>",
  fullName: "<fullName>",
  tagline: "<tagline>",
  icon: "<icon>",
  color: "<color>",
  storageKey: "<storageKey>",
  category: "<category>",
},
```

---

## Step 12 — Wire up in useTopicData

Edit `src/context/useTopicData.ts`:

1. Add four imports:

   ```ts
   import { allGuides as <camelSlug>Guides } from "../data/topics/<slug>/guides";
   import { flashcards as <camelSlug>Flashcards } from "../data/topics/<slug>/flashcards";
   import { quizQuestions as <camelSlug>QuizQuestions } from "../data/topics/<slug>/quizQuestions";
   ```

2. Add a case to the switch:
   ```ts
   case "<id>":
     return {
       guides: <camelSlug>Guides,
       flashcards: <camelSlug>Flashcards,
       quizQuestions: <camelSlug>QuizQuestions,
     };
   ```

---

## Step 13 — Register sources in SourcesScreen

Edit `src/screens/SourcesScreen.tsx`:

1. Add an import for the new topic's sources:

   ```ts
   import { sources as <camelSlug>Sources } from "../data/topics/<slug>/sources";
   ```

2. Add an entry to the `TOPIC_SOURCES` map inside the component:

   ```ts
   const TOPIC_SOURCES: Record<string, Source[]> = {
     // existing entries...
     "<id>": <camelSlug>Sources,
   };
   ```

---

## Step 14 — Verify

```bash
npx tsc --noEmit 2>&1
```

Fix all errors before continuing. Common causes:

- Bare backtick inside a template literal — escape as `` \` ``
- `correctIndex` (singular) instead of `correctIndices` (array) in QuizQuestion
- Import name mismatch between guide file export and index import
- Missing domain in `src/utils/theme.ts` — if any guide uses a domain not already in `getDomainMeta`, add it

Do not skip this step.

---

## Step 15 — Format and report

```bash
npx prettier --write \
  "src/data/topics/<slug>/**/*.ts" \
  src/context/TopicContext.tsx \
  src/context/useTopicData.ts \
  src/screens/SourcesScreen.tsx
```

Report:

- Topic id and display name registered
- Number of guide files created and total sections written
- Total flashcard count
- Total quiz question count
- Sources file: number of documentation pages listed
- Primary sources fetched
- Any areas where you had to fall back to model knowledge (flag these for verification)
