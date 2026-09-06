import { FlashCard } from "../../../types";

export const flashcards: FlashCard[] = [
  // ─── DOMAIN 1: PROMPTING AND TASK EXECUTION (14%) ───────────────────────────
  // Source: CCAO-F Exam Guide v1.0 (July 2026); Anthropic Prompt Engineering docs

  {
    id: "ccao-prompt-001",
    service: "Prompting and Task Execution",
    domain: "fundamentals",
    difficulty: "easy",
    question: "What are the three core characteristics of an effective prompt?",
    answer:
      "Clear (unambiguous language), Specific (exact format, length, tone, and audience stated), and Complete (all context Claude needs without guessing).",
    keyPoints: [
      "Vague prompts produce inconsistent, unpredictable outputs",
      "Format instructions must be explicit when structure matters",
      "Critical instructions belong early — not buried at the end",
      "Avoid contradictory or duplicated instructions",
    ],
    tags: ["prompting", "fundamentals", "domain-1"],
  },
  {
    id: "ccao-prompt-002",
    service: "Prompting and Task Execution",
    domain: "fundamentals",
    difficulty: "medium",
    question:
      "Why are XML tags recommended for structuring complex prompts in Claude?",
    answer:
      "Claude is trained to recognize XML-style tags as semantic boundaries, clearly distinguishing sections like <context> from <instructions>. This reduces ambiguity in long prompts and helps Claude apply each section appropriately.",
    keyPoints: [
      "XML tags are semantic delimiters, not just visual formatting",
      "Common tags: <context>, <instructions>, <examples>, <constraints>",
      "Reduces misinterpretation of what is background vs. directive",
      "More effective than ALL CAPS or prose separation for long prompts",
    ],
    tags: ["prompting", "xml-tags", "domain-1"],
  },
  {
    id: "ccao-prompt-003",
    service: "Prompting and Task Execution",
    domain: "fundamentals",
    difficulty: "medium",
    question:
      "When is few-shot prompting more effective than zero-shot description?",
    answer:
      "For tasks involving subtle distinctions, custom output formats, specialized terminology, or nuanced classification. Showing examples of the desired input→output pattern is clearer than describing it in prose.",
    keyPoints: [
      "Few-shot examples outperform prose for nuanced or format-sensitive tasks",
      "3 excellent diverse examples > 10 mediocre similar ones",
      "Cover the full distribution of real inputs in examples",
      "Edge cases in real data should appear in examples",
    ],
    tags: ["prompting", "few-shot", "domain-1"],
  },
  {
    id: "ccao-prompt-004",
    service: "Prompting and Task Execution",
    domain: "fundamentals",
    difficulty: "medium",
    question: "What is chain-of-thought prompting and when should it be used?",
    answer:
      "Instructing Claude to reason step by step before giving a final answer. Most effective for complex multi-step reasoning, math, logical analysis, and debugging. Adds output tokens — use selectively for tasks where reasoning genuinely improves accuracy.",
    keyPoints: [
      "Elicit with: 'Think step by step before answering'",
      "Effective for: complex reasoning, math, code debugging, policy analysis",
      "Avoid for: simple classification, extraction, short factual answers",
      "Chain-of-thought increases output tokens = higher cost and latency",
    ],
    tags: ["prompting", "chain-of-thought", "domain-1"],
  },
  {
    id: "ccao-prompt-005",
    service: "Prompting and Task Execution",
    domain: "fundamentals",
    difficulty: "hard",
    question:
      "What is task decomposition and why is it preferred over single complex prompts?",
    answer:
      "Breaking a complex task into smaller, sequential subtasks rather than asking Claude to do everything in one prompt. Each subtask has a clearer goal, making failures easier to diagnose and fix, and outputs easier to verify.",
    keyPoints: [
      "Single large prompts make failure attribution difficult",
      "Decomposition enables targeted iteration on each step",
      "Output of one subtask becomes input for the next",
      "Useful for: research → draft → edit workflows",
    ],
    tags: ["prompting", "task-decomposition", "domain-1"],
  },

  // ─── DOMAIN 2: OUTPUT EVALUATION AND VALIDATION (21%) ───────────────────────
  // Source: CCAO-F Exam Guide v1.0 (July 2026); Anthropic docs on hallucination, Artifacts

  {
    id: "ccao-eval-001",
    service: "Output Evaluation and Validation",
    domain: "fundamentals",
    difficulty: "easy",
    question: "What is hallucination in the context of Claude outputs?",
    answer:
      "Hallucination is when Claude generates confident-sounding but factually incorrect information. It is an inherent property of large language models, not a bug. Content may sound authoritative but be entirely fabricated.",
    keyPoints: [
      "Hallucinated content sounds authoritative — hard to detect without checking",
      "Most common for: specific facts, recent events, proprietary/niche data",
      "Claude cannot reliably flag its own hallucinations",
      "Verification against authoritative sources is always required for critical facts",
    ],
    tags: ["evaluation", "hallucination", "domain-2"],
  },
  {
    id: "ccao-eval-002",
    service: "Output Evaluation and Validation",
    domain: "fundamentals",
    difficulty: "medium",
    question:
      "What types of tasks require mandatory human review of Claude's output?",
    answer:
      "High-stakes decisions in legal, healthcare, insurance, financial, employment, housing, academic testing, and journalistic contexts. Anthropic's usage policy requires human review and disclosure that AI assisted in these use cases.",
    keyPoints: [
      "Anthropic Usage Policy (effective Sept 15, 2025) mandates human review for high-risk use cases",
      "Providers must also disclose that AI assisted in creating outputs",
      "High stakes = potential harm to individuals if output is wrong",
      "Human review is a governance control, not optional polish",
    ],
    tags: ["evaluation", "human-review", "governance", "domain-2"],
  },
  {
    id: "ccao-eval-003",
    service: "Output Evaluation and Validation",
    domain: "fundamentals",
    difficulty: "medium",
    question: "What is Claude.ai Artifacts and when should it be used?",
    answer:
      "Artifacts is a Claude.ai feature that creates standalone, reusable documents — code files, HTML pages, SVGs, markdown reports, etc. — separate from the chat conversation. Use it when the output is meant to be saved, shared, or used outside the conversation.",
    keyPoints: [
      "Artifacts renders outputs in a separate pane alongside the chat",
      "Supports: code, HTML, SVG, markdown, text documents",
      "Ideal for deliverables: reports, templates, code files, presentations",
      "Artifacts can be iteratively refined through follow-up messages",
    ],
    tags: ["evaluation", "artifacts", "output-formats", "domain-2"],
  },
  {
    id: "ccao-eval-004",
    service: "Output Evaluation and Validation",
    domain: "fundamentals",
    difficulty: "medium",
    question: "How can you instruct Claude to self-check its own outputs?",
    answer:
      "Ask Claude to review its response for errors, gaps, or inconsistencies before finalizing. Prompts like 'Review your answer and identify any factual claims you are uncertain about' or 'Check your reasoning for logical errors' can surface issues — though self-checking is not infallible.",
    keyPoints: [
      "Self-critique can surface obvious errors but is not a substitute for verification",
      "Claude may still miss errors in its own output — especially factual ones",
      "Combine self-check with external source verification for critical content",
      "Explicit review prompts work better than implicit 'be accurate' instructions",
    ],
    tags: ["evaluation", "self-check", "domain-2"],
  },
  {
    id: "ccao-eval-005",
    service: "Output Evaluation and Validation",
    domain: "fundamentals",
    difficulty: "hard",
    question:
      "What is the correct approach when Claude's output contains a mix of accurate and potentially inaccurate content?",
    answer:
      "Identify the specific claims requiring verification, check them against authoritative sources, and edit or discard the inaccurate portions. Never pass Claude's output through as final without review for factual claims — accuracy and completeness must be validated independently.",
    keyPoints: [
      "Partial accuracy is still inaccuracy — spot-check all specific facts",
      "Authoritative sources override Claude's confident-sounding assertions",
      "Fact-checking is the human's responsibility, not Claude's",
      "Document what was changed and why when editing AI-generated content",
    ],
    tags: ["evaluation", "fact-checking", "domain-2"],
  },

  // ─── DOMAIN 3: PRODUCT AND MODEL SELECTION (12%) ────────────────────────────
  // Source: CCAO-F Exam Guide v1.0 (July 2026); Anthropic models overview (Sept 2026);
  //         claude.com/pricing (Sept 2026)

  {
    id: "ccao-model-001",
    service: "Product and Model Selection",
    domain: "fundamentals",
    difficulty: "easy",
    question:
      "What are the four current Claude models and how do they differ in speed and cost?",
    answer:
      "Claude Fable 5.1 (slowest, $10/$50 per MTok), Claude Opus 5 (moderate, $5/$25 per MTok), Claude Sonnet 5 (fast, $2/$10 per MTok), and Claude Haiku 4.5 (fastest, $1/$5 per MTok). All support vision and tool use.",
    keyPoints: [
      "Fable 5.1: demanding reasoning and long-horizon agentic work",
      "Opus 5: complex agentic coding and enterprise work",
      "Sonnet 5: best balance of speed and intelligence",
      "Haiku 4.5: fastest, near-frontier intelligence, lowest cost",
    ],
    tags: ["model-selection", "models", "domain-3"],
  },
  {
    id: "ccao-model-002",
    service: "Product and Model Selection",
    domain: "fundamentals",
    difficulty: "medium",
    question:
      "What are the context window sizes for current Claude models and what do they mean in practice?",
    answer:
      "Fable 5.1, Opus 5, and Sonnet 5 each have 1M token context windows (≈555K words). Haiku 4.5 has a 200K token context window (≈150K words). The context window is the total limit for system prompt + conversation + response combined.",
    keyPoints: [
      "1M tokens ≈ 555,000 words on the current tokenizer",
      "200K tokens ≈ 150,000 words",
      "Exceeding the context window returns an error — it is a hard limit",
      "Longer context = higher cost and latency per request",
    ],
    tags: ["model-selection", "context-window", "domain-3"],
  },
  {
    id: "ccao-model-003",
    service: "Product and Model Selection",
    domain: "fundamentals",
    difficulty: "easy",
    question:
      "What Claude.ai plans support Projects for persistent knowledge and instructions?",
    answer:
      "Projects are available on Pro ($17/mo annual or $20/mo monthly), Max ($100+/mo), Team, and Enterprise plans. The Free plan does not include Projects.",
    keyPoints: [
      "Pro: $17/mo (annual) or $20/mo (monthly) — includes Projects",
      "Max: from $100/mo — 5x or 20x Pro usage + priority access",
      "Team Standard: $20/seat/mo; Team Premium: $100/seat/mo",
      "Enterprise: $20/seat + API costs, HIPAA-ready, audit logs",
    ],
    tags: ["model-selection", "claude-ai", "plans", "domain-3"],
  },
  {
    id: "ccao-model-004",
    service: "Product and Model Selection",
    domain: "fundamentals",
    difficulty: "medium",
    question:
      "When should you restart a conversation vs. summarize context to manage the context window?",
    answer:
      "Restart when: starting a completely new, unrelated task, or the conversation has accumulated so many unrelated turns that context is polluting the response. Summarize when: the prior context is still relevant but growing too long — ask Claude to produce a summary, then start fresh with that summary as context.",
    keyPoints: [
      "Context window fills up as conversation grows — each turn adds tokens",
      "Restart = new conversation with a clean slate",
      "Summarize = compress prior context into fewer tokens while retaining relevance",
      "Projects retain instructions and knowledge — not conversation history",
    ],
    tags: ["model-selection", "context-management", "domain-3"],
  },

  // ─── DOMAIN 4: WORKFLOW INTEGRATION AND SOLUTION DESIGN (16%) ───────────────
  // Source: CCAO-F Exam Guide v1.0 (July 2026); Anthropic documentation

  {
    id: "ccao-workflow-001",
    service: "Workflow Integration and Solution Design",
    domain: "services",
    difficulty: "easy",
    question:
      "What is the difference between workflow augmentation and workflow redesign with Claude?",
    answer:
      "Augmentation: Claude handles specific subtasks (drafting, summarizing, analyzing) while existing workflow steps and humans remain responsible for final decisions. Redesign: restructuring the process itself so Claude is central, with human checkpoints only at key decision points.",
    keyPoints: [
      "Augmentation: lower risk, easier adoption, Claude assists existing steps",
      "Redesign: higher efficiency potential, requires more trust and validation",
      "Start with augmentation; redesign after validating output quality",
      "Always keep humans in the loop for high-stakes decisions",
    ],
    tags: ["workflow", "integration", "domain-4"],
  },
  {
    id: "ccao-workflow-002",
    service: "Workflow Integration and Solution Design",
    domain: "services",
    difficulty: "medium",
    question:
      "What limitations must be communicated to stakeholders when introducing Claude?",
    answer:
      "Claude can hallucinate, has a training knowledge cutoff, cannot access real-time data or internal systems without integrations, and produces non-deterministic outputs. High-stakes outputs require human review. Claude is a productivity tool, not an infallible authority.",
    keyPoints: [
      "Hallucination: Claude can confidently state false information",
      "Knowledge cutoff: Claude Haiku 4.5 cuts off Feb 2025; Fable 5.1 cuts off Jun 2026",
      "No real-time data unless web search is enabled",
      "Non-deterministic: identical prompts may produce different outputs",
    ],
    tags: ["workflow", "stakeholder-communication", "domain-4"],
  },
  {
    id: "ccao-workflow-003",
    service: "Workflow Integration and Solution Design",
    domain: "services",
    difficulty: "medium",
    question:
      "What is the draft-then-review integration pattern and when is it appropriate?",
    answer:
      "Claude produces a first draft (email, report, code, plan) which a human then reviews and edits before finalizing. Appropriate for any workflow where the human's final judgment is required but the drafting phase is time-consuming and repetitive.",
    keyPoints: [
      "Claude accelerates drafting; human retains editorial control",
      "Appropriate for: emails, reports, code, contracts, proposals",
      "Human review step must not become a rubber stamp",
      "Define clear quality criteria so reviewers know what to check",
    ],
    tags: ["workflow", "draft-review", "domain-4"],
  },
  {
    id: "ccao-workflow-004",
    service: "Workflow Integration and Solution Design",
    domain: "services",
    difficulty: "hard",
    question:
      "What is the Anthropic Batch API and which workflow scenarios is it designed for?",
    answer:
      "The Batch API provides 50% cost reduction for offline, asynchronous processing of up to 100,000 requests, completed within 24 hours. Results are available for 29 days. Designed for: nightly data processing, bulk content generation, large-scale evaluation runs — not real-time features.",
    keyPoints: [
      "50% discount vs. standard API pricing",
      "Up to 100,000 requests per batch, 256 MB max batch size",
      "Processing within 24 hours; results available for 29 days",
      "Not for interactive or real-time features — asynchronous only",
    ],
    tags: ["workflow", "batch-api", "domain-4"],
  },

  // ─── DOMAIN 5: CONFIGURATION AND KNOWLEDGE MANAGEMENT (12%) ─────────────────
  // Source: CCAO-F Exam Guide v1.0 (July 2026); claude.ai product documentation

  {
    id: "ccao-config-001",
    service: "Configuration and Knowledge Management",
    domain: "services",
    difficulty: "easy",
    question: "What is a Claude Project and what does it persist?",
    answer:
      "A Project is a persistent workspace in Claude.ai that retains project instructions (a system prompt) and uploaded knowledge files across all conversations within the project. Each conversation within a project starts with the same instructions and knowledge, but conversation history is not shared between conversations.",
    keyPoints: [
      "Available on: Pro, Max, Team, Enterprise plans",
      "Persists: project instructions (system prompt) and uploaded knowledge files",
      "Does NOT persist: conversation history between separate conversations",
      "Connectors (Google Drive, Gmail) can sync live documents into the project",
    ],
    tags: ["configuration", "projects", "domain-5"],
  },
  {
    id: "ccao-config-002",
    service: "Configuration and Knowledge Management",
    domain: "services",
    difficulty: "medium",
    question:
      "What should effective project instructions (system prompts) include?",
    answer:
      "Role definition, task context, rules and constraints, output format expectations, and examples. Structure: define who Claude is for this project → what it should help with → what it should not do → how outputs should be formatted.",
    keyPoints: [
      "Role definition: 'You are a customer support assistant for Acme Corp'",
      "Constraints: topics to stay within, things to decline",
      "Output format: response length, tone, structure",
      "Examples are the most effective teaching mechanism in instructions",
    ],
    tags: ["configuration", "system-prompt", "domain-5"],
  },
  {
    id: "ccao-config-003",
    service: "Configuration and Knowledge Management",
    domain: "services",
    difficulty: "medium",
    question:
      "What is the difference between uploaded knowledge files and connectors in Claude Projects?",
    answer:
      "Uploaded knowledge files are static documents you manually upload — they reflect the document's state at upload time. Connectors (Google Drive, Gmail) pull live documents from external services, providing fresher data that updates as the source changes.",
    keyPoints: [
      "Uploaded files: static snapshot, must be re-uploaded when source changes",
      "Connectors: live sync from Google Drive, Gmail, etc.",
      "Connectors require authorization to the external service",
      "Both types count toward the project's knowledge storage limit",
    ],
    tags: ["configuration", "knowledge-management", "connectors", "domain-5"],
  },
  {
    id: "ccao-config-004",
    service: "Configuration and Knowledge Management",
    domain: "services",
    difficulty: "hard",
    question:
      "What is Claude.ai Memory and how does it differ from project knowledge?",
    answer:
      "Memory is a Claude.ai feature where Claude remembers facts about the user across all conversations (e.g., name, preferences, job role). Users can view, edit, and delete memories. Project knowledge is scoped to a specific project and contains documents and instructions — not personal facts about the user.",
    keyPoints: [
      "Memory: personal facts about the user, persists across all conversations",
      "Project knowledge: documents and instructions scoped to one project",
      "Users control memory — can view, add, or delete entries",
      "Memory is not available on all plans — check plan features",
    ],
    tags: ["configuration", "memory", "domain-5"],
  },

  // ─── DOMAIN 6: GOVERNANCE, RISK, AND RESPONSIBLE USE (15%) ──────────────────
  // Source: CCAO-F Exam Guide v1.0 (July 2026);
  //         Anthropic Usage Policy (effective Sept 15, 2025)

  {
    id: "ccao-gov-001",
    service: "Governance, Risk, and Responsible Use",
    domain: "security",
    difficulty: "easy",
    question:
      "What are Claude's hardcoded behaviors and why can't operators override them?",
    answer:
      "Hardcoded behaviors are absolute limits that Claude will never perform regardless of any instructions — including CSAM generation, weapons of mass destruction assistance, and claiming to be human when sincerely asked. These are set by Anthropic and cannot be changed by operators or users.",
    keyPoints: [
      "Hardcoded = absolute, no override possible at any trust level",
      "Examples: CSAM, WMD assistance, claiming to be human",
      "Trust hierarchy: Anthropic > Operator > User",
      "Operators can only adjust softcoded (default) behaviors within Anthropic's policy",
    ],
    tags: ["governance", "hardcoded", "domain-6"],
  },
  {
    id: "ccao-gov-002",
    service: "Governance, Risk, and Responsible Use",
    domain: "security",
    difficulty: "medium",
    question:
      "Under Anthropic's Usage Policy, what use cases require human review and AI disclosure?",
    answer:
      "Legal, healthcare, insurance, financial, employment, housing, academic testing, and journalistic applications. For these high-risk use cases, providers must implement human review of AI outputs and disclose that AI assisted in creating them. This requirement is part of Anthropic's Usage Policy effective September 15, 2025.",
    keyPoints: [
      "8 high-risk categories: legal, healthcare, insurance, financial, employment, housing, academic testing, journalism",
      "Two requirements: human review AND disclosure of AI assistance",
      "Risk: potential individual harm if AI output is wrong",
      "Human review must be substantive, not a rubber-stamp",
    ],
    tags: ["governance", "human-review", "compliance", "domain-6"],
  },
  {
    id: "ccao-gov-003",
    service: "Governance, Risk, and Responsible Use",
    domain: "security",
    difficulty: "medium",
    question:
      "What data privacy considerations apply to using Claude with sensitive organizational data?",
    answer:
      "By default, Anthropic may use API inputs and outputs for safety research. Enterprise plans include a no-training commitment on organizational data. Sensitive data (PII, trade secrets, regulated health/financial data) should only be input into plans with appropriate privacy commitments and data processing agreements.",
    keyPoints: [
      "Free/Pro API: Anthropic may use inputs/outputs for safety research by default",
      "Enterprise: no training on org data by default",
      "HIPAA-ready: Enterprise plan; requires a BAA from Anthropic",
      "Classify data sensitivity before choosing a plan",
    ],
    tags: ["governance", "privacy", "data-sensitivity", "domain-6"],
  },
  {
    id: "ccao-gov-004",
    service: "Governance, Risk, and Responsible Use",
    domain: "security",
    difficulty: "hard",
    question:
      "What are four prohibited use cases under Anthropic's Universal Usage Standards?",
    answer:
      "Violating laws, compromising critical infrastructure or computer systems, developing weapons or explosives, inciting violent extremism or terrorism, violating privacy rights, creating CSAM, generating misinformation, or generating sexually explicit content. The full prohibited list is in the AUP (effective Sept 15, 2025).",
    keyPoints: [
      "AUP prohibitions apply to all Anthropic products (API and Claude.ai)",
      "Violations may result in throttling, suspension, or termination",
      "Jailbreaking and account circumvention are also prohibited",
      "Anthropic's Safeguards Team monitors compliance",
    ],
    tags: ["governance", "usage-policy", "prohibited", "domain-6"],
  },

  // ─── DOMAIN 7: TROUBLESHOOTING AND OPTIMIZATION (10%) ───────────────────────
  // Source: CCAO-F Exam Guide v1.0 (July 2026); Anthropic documentation

  {
    id: "ccao-trouble-001",
    service: "Troubleshooting and Optimization",
    domain: "troubleshooting",
    difficulty: "easy",
    question:
      "Claude's response is too vague and generic. What is the most likely root cause?",
    answer:
      "The prompt lacks specificity — it didn't state the desired format, length, audience, tone, or context. Claude defaults to generic helpful responses when given open-ended prompts. Fix by adding explicit constraints and examples.",
    keyPoints: [
      "Generic output = generic prompt — Claude reflects what it's given",
      "Add: output format, audience, length, tone, and context",
      "Few-shot examples are the fastest fix for format problems",
      "Change one thing at a time when iterating prompts",
    ],
    tags: ["troubleshooting", "prompt-iteration", "domain-7"],
  },
  {
    id: "ccao-trouble-002",
    service: "Troubleshooting and Optimization",
    domain: "troubleshooting",
    difficulty: "medium",
    question:
      "What are the current reliable knowledge cutoff dates for Claude models?",
    answer:
      "Claude Haiku 4.5: February 2025. Claude Sonnet 5: January 2026. Claude Opus 5: May 2026. Claude Fable 5.1: June 2026. Use web search or RAG for information beyond these dates.",
    keyPoints: [
      "Knowledge cutoff ≠ release date — there is always a gap",
      "Claude may confidently state outdated facts past its cutoff",
      "Enable web search in Claude.ai for current information",
      "Explicitly tell users when the task depends on recent events",
    ],
    tags: ["troubleshooting", "knowledge-cutoff", "domain-7"],
  },
  {
    id: "ccao-trouble-003",
    service: "Troubleshooting and Optimization",
    domain: "troubleshooting",
    difficulty: "medium",
    question:
      "Claude's outputs are inconsistent — similar prompts produce very different results. What approaches help?",
    answer:
      "Claude is non-deterministic by nature. To improve consistency: use the API with temperature 0 for deterministic tasks, tighten prompt specificity, use few-shot examples to anchor the expected pattern, and use Projects with stable instructions to reduce prompt drift.",
    keyPoints: [
      "Non-determinism is inherent — identical prompts can vary",
      "Temperature 0 (API only) maximizes determinism",
      "Few-shot examples anchor output format and style",
      "Claude.ai Projects keep instructions consistent across conversations",
    ],
    tags: ["troubleshooting", "consistency", "domain-7"],
  },
  {
    id: "ccao-trouble-004",
    service: "Troubleshooting and Optimization",
    domain: "troubleshooting",
    difficulty: "hard",
    question:
      "What is the correct troubleshooting process when a Claude prompt produces poor results?",
    answer:
      "Identify the specific failure mode (wrong format, hallucination, wrong tone, missing content) → isolate the variable causing it → change one element at a time → re-evaluate against consistent test cases. Never batch multiple changes in one iteration — you won't know which change caused improvement or regression.",
    keyPoints: [
      "Identify failure mode first — be specific about what went wrong",
      "Change one prompt element per iteration",
      "Use consistent test cases to measure improvement objectively",
      "Keep a changelog: what changed, before/after quality",
    ],
    tags: ["troubleshooting", "iteration", "domain-7"],
  },
  {
    id: "ccao-trouble-005",
    service: "Troubleshooting and Optimization",
    domain: "troubleshooting",
    difficulty: "medium",
    question:
      "What optimization levers are available when Claude responses are too slow or too expensive?",
    answer:
      "Model selection is the largest lever — Haiku 4.5 ($1/$5 per MTok) costs significantly less than Opus 5 ($5/$25 per MTok). Also: reduce prompt length, limit max output tokens, use Projects to avoid repeating large system prompts across conversations, and use the Batch API (50% discount) for non-real-time workloads.",
    keyPoints: [
      "Model downgrade is the single biggest cost/speed improvement",
      "Evaluate quality before downgrading — don't assume Haiku is insufficient",
      "Batch API: 50% off for async, offline workloads",
      "Prompt caching (API): ~90% discount on repeated large prompt segments",
    ],
    tags: ["troubleshooting", "optimization", "cost", "domain-7"],
  },
];
