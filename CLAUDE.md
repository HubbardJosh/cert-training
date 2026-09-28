@AGENTS.md

# Git

Never commit changes unless explicitly asked to. Do not commit as part of completing a task, summarizing work, or any other reason unless the user directly requests a commit.

# Informational Content (Guides, Quizzes, Flashcards)

When creating, reviewing, or updating any informational content — including study guides, quiz questions, flashcard decks, explanations, and answer options — **do not rely on training data alone**. Training data may be outdated, imprecise, or wrong for rapidly-changing topics like AWS service limits, pricing tiers, API parameters, and model specifications.

This rule applies to **all cert and deep-dive topic work**: `/add-cert`, `/add-cert-aws`, `/add-cert-cc`, `/add-topic`, and any manual edits to existing guide, flashcard, or quiz files.

## Required process

1. **Fetch the authoritative source first.** Use `WebFetch` to retrieve the current official documentation before writing or verifying any fact. Prefer the primary source (AWS docs, Anthropic docs, official exam guides) over third-party summaries. Do not skip this step even if you believe your training data is correct — it may be stale.
2. **Cite the source URL inline.** Every guide section, quiz explanation, and flashcard answer that states a specific fact (a limit, a price, a default value, a feature name, an API parameter) must include the source URL it was verified against, either as a comment in the file or in a `sources` field if the data structure supports it.
3. **Flag unverified facts.** If a source cannot be fetched (network unavailable, page not found), note it explicitly with a `// TODO: verify against <url>` comment rather than falling back to training data silently.
4. **Do not invent or extrapolate.** If the documentation does not state a specific number or behavior, do not guess. Write "refer to current documentation" or leave it as a TODO.
5. **Exam domains and weightings must be verified.** When adding a cert, fetch the official exam guide PDF or page to confirm domain names, percentages, and question counts. Do not use training-data guesses for these.

## What counts as a fact requiring verification

- Service limits (e.g., max read replicas, max message size, max timeout)
- Pricing (dollar amounts, percentage tiers, free-tier quotas)
- Default values for API parameters
- Model names, model IDs, context window sizes, and token pricing
- Feature availability by plan or region
- Retention periods, TTLs, minimum durations
- Deprecated or removed features
- Exam domain names, domain weightings, and total question counts
- API endpoint names, SDK method signatures, and CLI flag names
