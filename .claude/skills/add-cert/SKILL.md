---
name: add-cert
description: Generic cert builder for the aws-training study app. Accepts a normalized cert descriptor (from /add-cert-aws or /add-cert-cc) and builds out all guides, flashcards, quiz questions, and app wiring. Can also be invoked directly with an AWS cert code (e.g. /add-cert SAA-C03) for backwards compatibility.
---

You are the **content builder** for the aws-training study app at `/Users/joshhubbard/aws-training`.

You may be invoked in two ways:

1. **Directly** — the user ran `/add-cert <CODE>` where CODE is an AWS cert code (e.g. `SAA-C03`). Treat this identically to `/add-cert-aws <CODE>`: validate the AWS code format, derive AWS metadata, then proceed.
2. **Via a sub-skill** — `/add-cert-aws` or `/add-cert-cc` already validated and derived the cert descriptor and is passing it to you. The descriptor contains all fields listed in the **Cert Descriptor** section below. Skip straight to Step 0 (architecture review).

---

## Cert Descriptor

When called from a sub-skill, expect these fields:

```
provider      "aws" | "claude"
code          Original cert code (e.g. "SAA-C03", "CCDV-F")
certId        Lowercase ID used as the CertificationId key (e.g. "saa-c03", "ccdv-f")
slug          Short lowercase slug for directory and import names (e.g. "saa", "ccdv")
storageKey    AsyncStorage key (e.g. "aws_training_progress_saa")
name          Short display name matching the code (e.g. "SAA-C03")
fullName      Full official title (e.g. "AWS Certified Solutions Architect – Associate")
examInfo      Exam format string (e.g. "65 questions · 130 min · Passing score: 720/1000")
icon          Ionicons icon name
color         Hex color string
level         "Foundational" | "Associate" | "Professional" | "Specialty" (AWS)
              or "Foundational" | "Professional" (Claude certs)
prev          Optional prerequisite cert code string
next          Optional next cert code string
```

---

## Core principle

**Cover everything needed to pass the exam.** Do not use arbitrary counts or ranges as targets. Every guide, flashcard set, and quiz question bank should be as large as necessary to fully cover what the exam actually tests. Ask yourself: "Could a student pass this exam using only this app?" If not, add more.

For guides: write as many sections as the service warrants based on how deeply the exam tests it. A heavily tested service like Lambda or DynamoDB may need 10–12 sections. A lightly tested service may only need 5. Let exam weight and topic depth drive the decision.

For quiz questions: write enough questions per service to cover all the distinct scenarios, edge cases, and gotchas the exam is known to test.

For flashcards: every key concept, service comparison, limit, default, and exam-critical fact should have a card.

---

## Step 0 — Read the architecture

Before writing anything, read these files to understand the full pattern:

- `src/context/CertContext.tsx` — `CertificationId` union type and `CERT_META` registry
- `src/context/useCertData.ts` — switch that maps cert ID to data imports
- `src/data/dva/guides/dynamodb.ts` — example of a deep guide
- `src/data/dva/flashcards.ts` — example flashcard file (first 40 lines)
- `src/data/dva/quizQuestions.ts` — example quiz questions file (first 40 lines)
- `src/types/index.ts` — `FlashCard` and `QuizQuestion` interfaces (source of truth)
- `src/types/guide.ts` — `ServiceGuide` and `GuideSection` interfaces (source of truth)

---

## Step 1 — Map the exam to topics

Study the official exam guide for this cert (use your training knowledge). Identify:

- Every domain and its percentage weighting
- Every topic area explicitly or implicitly tested
- Which topics are tested deeply vs. lightly
- The exam format (question count, time, passing score)

Create one guide file per distinct service or topic area. The number of guide files should match the breadth of the exam — there is no minimum or maximum.

**Domain mapping** — the app uses a fixed `Domain` union:
`development | security | deployment | troubleshooting | fundamentals | services | applications`

For **AWS certs**: map each AWS service to the domain that best describes how it is tested.

For **Claude certs**: use this mapping:

| Claude topic area                               | App domain        |
| ----------------------------------------------- | ----------------- |
| Prompt engineering, model interaction           | `development`     |
| Safety, responsible AI, guardrails              | `security`        |
| API integration, SDK usage, tool use            | `development`     |
| Deployment patterns, production systems         | `deployment`      |
| Debugging, evaluations, observability           | `troubleshooting` |
| Core concepts, model capabilities, tokenization | `fundamentals`    |
| Anthropic products, Claude.ai, Console          | `services`        |
| Agentic workflows, multi-turn, RAG              | `applications`    |

---

## Step 2 — Create the directory structure

```
src/data/<slug>/
  guides/
    <topic1>.ts
    <topic2>.ts
    ...
    index.ts
  abbreviations.ts
  flashcards.ts
  quizQuestions.ts
```

---

## Step 2.5 — Build the abbreviation registry

Before writing any content, identify every acronym and abbreviation that will appear in the cert's guides, flashcards, and quiz questions. Write `src/data/<slug>/abbreviations.ts`:

```ts
export const <SLUG_UPPER>_ABBREVIATIONS: Record<string, string> = {
  // Group by category (e.g., "// API & developer concepts", "// AI concepts", "// Safety")
  ABBR: "Full expansion — one-sentence description of what it means in this cert's context",
  // ...
};
```

What to include:

- Every service name acronym used in guides (e.g., `IAM`, `S3`, `EC2` for AWS; `API`, `SDK`, `SSE` for Claude certs)
- Every technical abbreviation that appears two or more times across guides, flashcards, or quiz questions
- Every certification identifier referenced (e.g., `CCAO`, `CCDV`, `SAA`)
- Every domain-specific acronym a student might not immediately know (e.g., `RAG`, `CoT`, `RLHF`, `PII`, `HITL`)

What NOT to include:

- Common English words and obvious terms (e.g., `URL`, `PDF` are fine; `IT` or `AI` alone may be too obvious)
- Abbreviations only used once and fully spelled out inline in that context

**Naming convention**: export name is `<SLUG_UPPER>_ABBREVIATIONS` where `<SLUG_UPPER>` is the slug in uppercase (e.g., slug `ccdv` → `CCDV_ABBREVIATIONS`, slug `saa` → `SAA_ABBREVIATIONS`).

Then register it in `src/components/AbbreviatedText.tsx`:

1. Add the import:
   ```ts
   import { <SLUG_UPPER>_ABBREVIATIONS } from "../data/<slug>/abbreviations";
   ```
2. Add an entry to the `registries` object:
   ```ts
   "<certId>": <SLUG_UPPER>_ABBREVIATIONS,
   ```

---

## Step 3 — Write the guide files

For **each topic**, write `src/data/<slug>/guides/<topicName>.ts`:

```ts
import { ServiceGuide } from "../../../types/guide";

export const <camelCaseName>Guide: ServiceGuide = {
  id: "<slug>-<topicName>",
  service: "<Display Name>",
  domain: "development",
  tagline: "...",
  intro: "...",
  sections: [
    {
      heading: "...",
      body: `...`,
      quiz: [
        {
          question: "...",
          options: ["...", "...", "...", "..."],
          correctIndex: 0,        // singular integer — GuideQuizQuestion uses correctIndex, not correctIndices
          explanation: "...",
        },
      ],
    },
    // as many sections as the topic warrants
  ],
  keyFacts: [
    // every exam-critical fact, limit, default, and gotcha
  ],
  relatedServices: [
    // topics the exam commonly compares or combines with this one
  ],
  examTips: [
    // every scenario, trap, or distinction the exam is known to test
  ],
};
```

**Section depth guidance:**

- Write as many sections as needed to cover every sub-topic the exam tests
- Each section body is full prose (3–6 sentences), not bullet lists
- Every section should have a `quiz` question testing the most important concept in that section

**Abbreviation usage:**

- Use abbreviations naturally throughout `body`, `intro`, `tagline`, `keyFacts`, and `examTips` — do not avoid them or always spell them out
- Every abbreviation that appears in the registry (from Step 2.5) should be used as-is in text; the app renders tappable tooltips automatically
- Do not parenthetically define an abbreviation inline (e.g., avoid "RAG (Retrieval-Augmented Generation)") — the tooltip handles that; just write `RAG`
- `keyFacts` and `examTips` are especially good places to use abbreviations densely, since students will tap to check definitions as they study

**CRITICAL — backtick escaping**: `body` fields are template literals. Any inline code inside a body MUST use `\`` (escaped backtick):

```ts
body: `Use \`aws s3 cp\` to copy objects between buckets.`;
```

A bare backtick inside a template literal closes it and causes a TypeScript syntax error.

---

## Step 4 — Write the guides index

`src/data/<slug>/guides/index.ts`:

```ts
import { ServiceGuide } from "../../../types/guide";
import { <name1>Guide } from "./<file1>";
// ... all imports

export const allGuides: ServiceGuide[] = [
  // <Domain A>
  <guide1>,
  <guide2>,
  // <Domain B>
  <guide3>,
  // ...
];

export const guidesByDomain = allGuides.reduce<Record<string, ServiceGuide[]>>(
  (acc, guide) => {
    if (!acc[guide.domain]) acc[guide.domain] = [];
    acc[guide.domain].push(guide);
    return acc;
  },
  {},
);
```

**Group guides by domain** in `allGuides` with a comment header for each domain (e.g. `// Security`, `// Fundamentals`, `// Deployment`). Within each group, order guides by conceptual dependency — foundational concepts before services that build on them. This is cosmetic (the app uses `guidesByDomain` for display), but keeps the index readable and consistent with all other certs.

---

## Step 5 — Write the flashcards file

`src/data/<slug>/flashcards.ts`

**Check `src/types/index.ts` for the exact FlashCard interface before writing.**

```ts
interface FlashCard {
  id: string; // "<slug>-<topic>-<n>"
  service: string;
  domain: Domain;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  answer: string;
  keyPoints: string[];
  tags: string[];
}
```

Write enough flashcards per topic to cover:

- What the topic is and its primary purpose
- Every major concept the exam tests
- Key limits, defaults, and parameters the exam expects you to know
- Common exam comparisons and gotchas

Mix difficulties proportionally to the complexity of the topic.

---

## Step 6 — Write the quiz questions file

`src/data/<slug>/quizQuestions.ts`

**Check `src/types/index.ts` for the exact QuizQuestion interface before writing.**

```ts
interface QuizQuestion {
  id: string; // "<slug>-qq-<n>" sequential
  service: string;
  domain: Domain;
  difficulty: "easy" | "medium" | "hard";
  type: "single" | "multi";
  question: string;
  options: string[]; // exactly 4 for single, exactly 5 for multi
  correctIndices: number[]; // [n] for single, [n,m] for multi (exactly 2 correct)
  explanation: string; // 2–3 sentences: why correct, why distractors are wrong
  tags: string[];
}
```

Hard rules:

- `"single"` type: exactly 4 options, `correctIndices: [n]`
- `"multi"` type: exactly 5 options, `correctIndices: [n, m]` — exactly 2 correct
- **Never use `correctIndex` (singular)** in QuizQuestion — always `correctIndices` (array)
- ~80% single, ~20% multi
- All questions must be exam-realistic and scenario-based where possible

---

## Step 7 — Register the cert in CertContext

Edit `src/context/CertContext.tsx`:

1. Add to the `CertificationId` union type
2. Add an entry to `CERT_META`:
   ```ts
   "<certId>": {
     id: "<certId>",
     name: "<code>",
     fullName: "<fullName>",
     examInfo: "<examInfo>",
     icon: "<icon>",
     color: "<color>",
     storageKey: "<storageKey>",
   },
   ```

---

## Step 8 — Register new domains in theme.ts

Before wiring up data, check whether any domain values used in the new cert's guides are missing from `src/utils/theme.ts`.

Read `src/utils/theme.ts` and check that every domain used in the new guides appears as a key in **both** the static `DOMAIN_META` object and the `getDomainMeta` function return value.

If any domain is missing, add it to both places with an appropriate label, color (pick from the `ThemeColors` type — use `colors.accent` or another existing color as a fallback), weight (`""`), and icon (an Ionicons name).

**This step is mandatory.** A missing domain causes a white screen crash in `GuideListScreen` and `GuideDetailScreen` because both screens do `DOMAIN_META[guide.domain]` without a fallback.

---

## Step 9 — Wire up data in useCertData

Edit `src/context/useCertData.ts`:

1. Add three imports:

   ```ts
   import { allGuides as <slug>Guides } from "../data/<slug>/guides";
   import { flashcards as <slug>Flashcards } from "../data/<slug>/flashcards";
   import { quizQuestions as <slug>QuizQuestions } from "../data/<slug>/quizQuestions";
   ```

2. Add a case to the switch:
   ```ts
   case "<certId>":
     return {
       guides: <slug>Guides,
       flashcards: <slug>Flashcards,
       quizQuestions: <slug>QuizQuestions,
     };
   ```

---

## Step 9 — Add sources

Edit `src/data/sources.ts` and add a `CertSources` entry inside the `SOURCES` array:

```ts
{
  certId: "<certId>",
  sources: [
    {
      title: "<Official exam guide or documentation title>",
      url: "<real URL — no placeholders>",
      topics: ["...", "...", "..."],
    },
    // One Source entry per major topic area.
    // Use real documentation URLs only.
  ],
}
```

For **AWS certs**: start with the official exam guide PDF from `d1.awsstatic.com`, then add one source per major service from `docs.aws.amazon.com`.

For **Claude certs**: start with the Anthropic docs at `docs.anthropic.com`, the API reference, and any official cert guide URL if known.

---

## Step 10 — Update CertSelectScreen

Edit `src/screens/CertSelectScreen.tsx`.

**For AWS certs**: add the new cert to the appropriate group in `CERT_GROUPS` (`"Foundational"`, `"Associate"`, `"Specialty"`, `"Professional"`):

```ts
{
  meta: CERT_META["<certId>"],
  prev: "<PREREQ>",   // optional
  next: "<NEXT>",     // optional
}
```

**For Claude certs**: check if an `"Anthropic"` group already exists in `CERT_GROUPS`. If not, add one after the last AWS group:

```ts
{
  level: "Anthropic",
  description: "Anthropic Claude certifications",
  certs: [
    {
      meta: CERT_META["<certId>"],
      prev: "<PREREQ>",   // optional
      next: "<NEXT>",     // optional
    },
  ],
},
```

If the `"Anthropic"` group already exists, add the new cert entry to its `certs` array.

Also update the screen title logic if it currently hardcodes `"AWS Certifications"` — when Claude certs exist it should read `"Certifications"`.

**Update adjacent certs' prev/next pointers**: after inserting the new cert entry, scan all other entries in `AWS_GROUPS` (or `ANTHROPIC_GROUPS`) and update any `prev` or `next` strings that should now reference the new cert. For example, if the new cert sits between CLF-C02 and DVA-C02 in the learning path, update DVA-C02's `prev` to include the new cert code and CLF-C02's `next` to include it. Use the `prev`/`next` values from the cert descriptor as the source of truth for what adjacencies exist, then apply the inverse on the other side.

---

## Step 11 — Verify

```bash
npx tsc --noEmit 2>&1
```

Fix all errors before proceeding. Common causes:

- Bare backtick inside a template literal — escape as `\``
- `correctIndex` instead of `correctIndices` in QuizQuestion (or vice versa in GuideQuizQuestion)
- Import name mismatch between guide file export and index import

Do not skip this step.

---

## Step 12 — Format and report

```bash
npx prettier --write src/data/<slug>/**/*.ts src/context/CertContext.tsx src/context/useCertData.ts src/data/sources.ts src/screens/CertSelectScreen.tsx src/components/AbbreviatedText.tsx
```

Report:

- Provider and cert code added
- Number of guide files created and total sections written
- Total flashcard count
- Total quiz question count
- Total abbreviations registered
- Total sources added
- Any topics you assessed as needing more coverage than you could fit in one pass
