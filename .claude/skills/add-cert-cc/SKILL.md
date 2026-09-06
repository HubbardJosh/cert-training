---
name: add-cert-cc
description: Adds a new Anthropic Claude certification to the aws-training study app. Validates the Claude cert code, collects Claude-specific metadata, then delegates all content creation to /add-cert. Use when the user runs /add-cert-cc followed by a certification code (e.g. /add-cert-cc CCDV-F).
---

You are the **intake and validation layer** for adding an Anthropic Claude certification. Your job is to validate the cert code, derive all Claude-specific metadata, and hand everything off to `/add-cert` to do the actual content and file creation.

The argument passed after `/add-cert-cc` is the Claude certification code (e.g. `CCAO-F`, `CCDV-F`). Extract it from the invocation.

---

## Claude certification codes

Known Claude certs follow the pattern `CC[A-Z]+-[A-Z]` where:

- `CC` prefix indicates Anthropic/Claude cert
- Middle segment identifies the track (e.g. `AO` = AI Operations, `DV` = Developer, `AR` = Architect)
- Suffix letter indicates level (`F` = Foundations, `P` = Professional)

Currently known codes: `CCAO-F`, `CCDV-F`, `CCAR-F`, `CCAR-P`

---

## Step 0 — Fetch official cert pages to establish base structure

Before doing anything else, fetch both of these pages to gather authoritative exam details (domains, topic areas, question count, time limit, prerequisites, etc.) for the requested cert code:

1. **WebFetch** `https://www.pearsonvue.com/us/en/anthropic.html` — lists all Anthropic exams currently offered through Pearson VUE; look for the entry matching the cert code to confirm it exists and capture any published exam details.
2. **WebFetch** `https://anthropic-partners.skilljar.com/page/partner-certifications` — partner certification hub; navigate to or locate the specific cert matching the code to find the official exam guide, domain breakdown, and topic weightings.

If either page returns an error or the cert code does not appear on both pages, note the discrepancy but continue — use whatever authoritative content was found and fall back to model knowledge for missing fields.

Use the data gathered here to populate `examInfo`, `level`, domain weights, guide topics, flashcard terms, and quiz question scenarios in later steps. Real data from these pages takes priority over model estimates.

---

## Step 1 — Validate the certification code

Check two things:

1. **Format check**: does the code match `CC[A-Z]+-[A-Z]`?
2. **Known cert check**: is this a Claude cert code you have knowledge of, or does it at least structurally fit the known pattern above?

If the format check fails, stop and respond:

> ❌ **"{CODE}"** is not a recognized Claude certification code.
>
> Valid examples: `CCAO-F`, `CCDV-F`, `CCAR-F`, `CCAR-P`
>
> Please check the code and try again.

Also check whether the cert is **already implemented** by reading `src/context/CertContext.tsx` and checking if the lowercased code already appears in the `CertificationId` union. If it does, stop and respond:

> ℹ️ **"{CODE}"** is already implemented in this app. No changes needed.

---

## Step 2 — Derive Claude cert metadata

From the cert code, derive the following and pass them to `/add-cert`:

- **provider**: `"claude"`
- **code**: the original cert code (e.g. `CCDV-F`)
- **certId**: full lowercase code with provider prefix (e.g. `"ccdv-f"`)
- **slug**: lowercased code without the hyphen-suffix, prefixed with `cc` (e.g. `CCDV-F` → `ccdv`)
- **storageKey**: `"aws_training_progress_<slug>"`
- **name**: the short display name (same as code, e.g. `"CCDV-F"`)
- **fullName**: the full cert title based on the track:
  - `CCAO-*`: "Anthropic Claude AI Operations"
  - `CCDV-*`: "Anthropic Claude Developer"
  - `CCAR-*`: "Anthropic Claude Architect"
  - Append the level: " – Foundations" for `F`, " – Professional" for `P`
- **examInfo**: best estimate from your knowledge; if unknown, use `"Questions and time TBD · See Anthropic docs for current exam details"`
- **icon**: an Ionicons icon name fitting the cert identity (e.g. `"sparkles"`, `"code-working"`, `"construct"`)
- **color**: a hex color fitting Anthropic's brand palette (e.g. `"#D97706"` orange, `"#7C3AED"` purple)
- **level**: one of `"Foundational"`, `"Associate"`, `"Professional"`, `"Specialty"` — map from the suffix (`F` → `"Foundational"`, `P` → `"Professional"`)
- **prev**: recommended prerequisite cert code(s), if any
- **next**: natural next cert(s), if any

### Domain mapping for Claude certs

The app uses a fixed `Domain` union: `development | security | deployment | troubleshooting | fundamentals | services | applications`.

Map Claude cert topic areas to these domains as follows:

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

Use these mappings when writing guide files, flashcards, and quiz questions for Claude certs.

### Content guidance for Claude certs

Because Claude certs test Anthropic-specific knowledge rather than cloud infrastructure, the content emphasis shifts:

**Guides**: Focus on Claude API concepts (messages API, system prompts, tool use, vision, streaming), prompt engineering patterns, model selection (Opus/Sonnet/Haiku), safety best practices, and production deployment patterns.

**Flashcards**: Key API parameters, model context windows and pricing tiers, prompt patterns, safety concepts, and Anthropic product features.

**Quiz questions**: Scenario-based questions about API usage, choosing the right model, prompt design decisions, handling edge cases, and responsible AI deployment.

---

## Step 3 — Hand off to /add-cert

Invoke `/add-cert` and pass all the metadata above so it can build out guides, flashcards, quiz questions, register the cert in `CertContext.tsx`, wire up `useCertData.ts`, add sources, and update `CertSelectScreen.tsx`.

When `/add-cert` runs, it should use `"Anthropic"` as the section group label in `CertSelectScreen.tsx` rather than an AWS level — instruct it to add a new `"Anthropic"` group (or `"Claude Certifications"` group) if one doesn't already exist, placing it after the AWS cert groups.
