---
name: add-cert-aws
description: Adds a new AWS certification to the aws-training study app. Validates the AWS cert code, collects AWS-specific metadata, then delegates all content creation to /add-cert. Use when the user runs /add-cert-aws followed by a certification code (e.g. /add-cert-aws SAA-C03).
---

You are the **intake and validation layer** for adding an AWS certification. Your job is to validate the cert code, derive all AWS-specific metadata, and hand everything off to `/add-cert` to do the actual content and file creation.

The argument passed after `/add-cert-aws` is the AWS certification code (e.g. `SAA-C03`, `SCS-C02`). Extract it from the invocation.

---

## Step 0 — Fetch official cert details

Before doing anything else, fetch authoritative exam details for the requested cert code.

1. **WebFetch** `https://aws.amazon.com/certification/` — the AWS certification hub. Navigate from here to the specific cert matching the code (e.g. "AWS Certified Solutions Architect – Associate" for `SAA-C03`). Follow any links to the cert's dedicated page to capture:
   - Official full cert name
   - Exam format: number of questions, time limit, passing score
   - Domains and their percentage weightings
   - Topic areas and services explicitly listed
   - Any listed prerequisites or recommended experience

2. If the cert page links to an official exam guide PDF (typically on `d1.awsstatic.com`), **WebFetch** that URL too and extract domain breakdowns and topic lists from it.

Use all data gathered here to populate `fullName`, `examInfo`, domain weights, guide topics, flashcard terms, and quiz question scenarios in later steps. Real data from these pages takes priority over model estimates. If a page is unreachable or the cert does not appear, note it and fall back to model knowledge.

---

## Step 1 — Validate the certification code

A valid AWS certification code matches the pattern `[A-Z]+-C[0-9]+` (e.g. `SAA-C03`, `DVA-C02`, `SCS-C02`, `ANS-C01`, `DOP-C02`, `SOA-C02`, `MLS-C01`, `DAS-C01`, `PAS-C01`, `AIF-C01`, `CLF-C02`).

Check two things:

1. **Format check**: does the code match `[A-Z]+-C[0-9]+`?
2. **Known cert check**: is this a real AWS certification you have knowledge of (exam name, domains, services tested)?

If either check fails, stop and respond:

> ❌ **"{CODE}"** is not a recognized AWS certification code.
>
> Valid examples: `SAA-C03`, `DVA-C02`, `SCS-C02`, `ANS-C01`, `DOP-C02`, `SOA-C02`, `MLS-C01`, `DAS-C01`, `AIF-C01`, `CLF-C02`
>
> Please check the code and try again.

Also check whether the cert is **already implemented** by reading `src/context/CertContext.tsx` and checking if the lowercased code already appears in the `CertificationId` union. If it does, stop and respond:

> ℹ️ **"{CODE}"** is already implemented in this app. No changes needed.

---

## Step 2 — Derive AWS metadata

From the cert code, derive the following and pass them to `/add-cert`:

- **provider**: `"aws"`
- **code**: the original cert code (e.g. `SAA-C03`)
- **certId**: full lowercase code (e.g. `"saa-c03"`)
- **slug**: prefix before the version suffix, lowercased (`SAA` → `saa`, `SCS` → `scs`)
- **storageKey**: `"aws_training_progress_<slug>"`
- **name**: the short display name (same as code, e.g. `"SAA-C03"`)
- **fullName**: official cert title (e.g. `"AWS Certified Solutions Architect – Associate"`)
- **examInfo**: format string (e.g. `"65 questions · 130 min · Passing score: 720/1000"`)
- **icon**: an Ionicons icon name fitting the cert's identity
- **color**: a hex color fitting the cert's identity
- **level**: one of `"Foundational"`, `"Associate"`, `"Professional"`, `"Specialty"`
- **prev**: recommended prerequisite cert code(s), if any (e.g. `"CLF-C02"`)
- **next**: natural next cert(s), if any (e.g. `"SAP-C02 / DOP-C02"`)

---

## Step 3 — Hand off to /add-cert

Invoke `/add-cert` and pass all the metadata above so it can build out guides, flashcards, quiz questions, register the cert in `CertContext.tsx`, wire up `useCertData.ts`, add sources, and update `CertSelectScreen.tsx`.
