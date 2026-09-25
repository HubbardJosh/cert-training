# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Cloud engineers and professionals preparing for AWS or Anthropic cloud/AI certification exams. Shared with a small group of colleagues studying together. Users study in short, focused sessions — on commute, between meetings, or at a desk — and need to track progress across multiple certifications simultaneously.

## Product Purpose

A local-first mobile certification study app covering AWS (CLF-C02, DVA-C02, SAA-C03, AIF-C01, MLS-C01) and Anthropic (CCAO-F) exams. It combines flashcards, timed practice quizzes, deep-dive study guides, and per-domain progress tracking so learners can prepare fully offline, without account creation or a backend dependency. Success means a user passes their target exam having studied only with this tool.

## Positioning

All study content is bundled locally and works entirely offline — no login, no subscription, no server. Progress is device-local and immediate. The app covers both traditional AWS services and AI/ML certs including Anthropic's model-specific certification, a combination not found in standard study platforms.

## Operating Context

- Used across iOS, Android, and web (React Native / Expo)
- Portrait-only on mobile; responsive layout at 768px for larger screens
- Sessions are short and interruptible; state must persist across restarts (AsyncStorage)
- Multiple certifications selectable; users switch between them in-session
- Content is bundled at build time; updates require an app update
- Text-to-speech available for flashcard review

## Capabilities and Constraints

- Flashcards with flip animation, domain/difficulty filters, and spaced repetition tracking
- Timed practice quizzes with instant feedback and missed-question review
- Detailed study guides with code examples, acronym tooltips, and syntax highlighting
- Domain-by-domain accuracy breakdown, streak counter, and session history on the Progress screen
- Sources screen linking to official AWS and Anthropic documentation
- Dark / light / system theme toggle
- No backend; all data is local (AsyncStorage); no auth, no sync, no network dependency
- Adding a new certification requires a code update and app rebuild

## Brand Commitments

- No formal product name or logo; utility-first aesthetic
- AWS-inspired color palette is intentional and should be preserved:
  - Primary: #FF9900 (AWS Orange), dark variant #E68900
  - Secondary: #232F3E (AWS Dark Slate)
  - Accent: #00A8E8 (AWS Light Blue)
- Domain-coded colors (not decorative; carry semantic meaning):
  - Development #00A8E8, Security #E91E8C, Deployment #2ECC71, Troubleshooting #9B59B6
  - Difficulty: Easy (green), Medium (orange), Hard (red)
- System fonts; no custom typeface commitment
- Ionicons icon set (@expo/vector-icons)

## Evidence on Hand

- Six fully built certifications with flashcard, quiz, and guide content bundled in source
- Theme system with dark/light variants in `constants/theme.ts`
- Progress tracking implemented end-to-end (streak, domain accuracy, session history)
- Adaptive icon assets present for iOS and Android

## Product Principles

1. **Offline first, always.** No feature should require a network connection. Content and progress must work on a locked-down exam-day device.
2. **Signal over noise.** Every screen should help the user know exactly where they stand and what to study next — not overwhelm with options.
3. **Semantics in color.** Domain and difficulty colors carry real information; they must remain distinct and consistent across every surface.
4. **Low friction, high repetition.** The path from launch to a flashcard or quiz question must be fast. The app is used in short bursts; friction kills retention.
5. **Extensible by convention.** Adding a new certification or topic should follow a clear, repeatable pattern — no one-off hacks per cert.

## Accessibility & Inclusion

Color-blind friendliness is the primary concern. Domain and difficulty colors are the main risk surface — ensure they are distinguishable without relying on hue alone (consider labels, icons, or patterns as supplements where needed). No formal WCAG target established.
