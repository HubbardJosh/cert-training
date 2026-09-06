import { QuizQuestion } from "../../types";

// All questions aligned to CCAO-F Exam Guide v1.0 (July 2026) domain structure.
// Model facts sourced from platform.claude.com/docs/en/models/overview (Sept 2026).
// Pricing sourced from claude.com/pricing (Sept 2026).
// Policy facts sourced from anthropic.com/legal/aup (effective Sept 15, 2025).

export const quizQuestions: QuizQuestion[] = [
  // ─── DOMAIN 1: PROMPTING AND TASK EXECUTION (14%) ───────────────────────────

  {
    id: "ccao-qq-001",
    service: "Prompting and Task Execution",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question:
      "A user asks Claude to 'write something about climate change.' The output is vague and generic. What is the most likely root cause?",
    options: [
      "The prompt lacks specificity — it did not state format, length, audience, or angle",
      "Claude cannot write about scientific topics",
      "Climate change requires a specialized model tier",
      "The user needs to enable web search to get accurate content",
    ],
    correctIndices: [0],
    explanation:
      "Generic output reflects a generic prompt. Claude defaults to broad, safe responses when given open-ended instructions. Fixing the prompt to specify format (e.g., a 500-word op-ed), audience (e.g., high school students), angle (e.g., economic impacts), and tone (e.g., persuasive) will produce a focused, useful output. Model tier and web search are not the issue here.",
    tags: ["prompting", "specificity", "domain-1"],
  },
  {
    id: "ccao-qq-002",
    service: "Prompting and Task Execution",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "A developer wraps user-submitted documents in <user_document> tags in the system prompt and instructs Claude to treat that content as data, not instructions. What threat does this mitigate?",
    options: [
      "Hallucination — Claude fabricating content about the document",
      "Prompt injection — malicious content in user documents attempting to override Claude's instructions",
      "Context window overflow from large documents",
      "Rate limit errors from high-volume document processing",
    ],
    correctIndices: [1],
    explanation:
      "Prompt injection occurs when user-supplied content contains instructions that attempt to override the system prompt (e.g., 'Ignore previous instructions and...'). Wrapping untrusted content in XML tags and explicitly instructing Claude to treat that region as data — not directives — is the primary mitigation. This is a security practice, not a fix for hallucination, context limits, or rate limits.",
    tags: ["prompting", "security", "prompt-injection", "domain-1"],
  },
  {
    id: "ccao-qq-003",
    service: "Prompting and Task Execution",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "A team is using Claude to categorize customer feedback into five predefined sentiment categories. Despite clear instructions, Claude's classifications are inconsistent. What is the BEST prompt improvement?",
    options: [
      "Switch to a more capable model tier",
      "Ask Claude to 'be more accurate' in the system prompt",
      "Increase the temperature setting to make outputs more varied",
      "Add 3–5 few-shot examples showing the correct category for representative feedback samples",
    ],
    correctIndices: [3],
    explanation:
      "Few-shot examples are the most effective fix for classification inconsistency — showing Claude the expected input→output pattern is clearer than describing category boundaries in prose. Switching model tiers is premature without trying prompt improvements first. 'Be more accurate' is not a meaningful instruction. Increasing temperature would make outputs more random, worsening consistency.",
    tags: ["prompting", "few-shot", "classification", "domain-1"],
  },
  {
    id: "ccao-qq-004",
    service: "Prompting and Task Execution",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "A user asks Claude to draft a complete business plan in a single prompt and gets an unfocused, shallow result. What technique would most improve the output?",
    options: [
      "Task decomposition — break the business plan into subtasks (executive summary, market analysis, financials, etc.) and prompt for each separately",
      "Increase max_tokens to allow a longer response",
      "Switch from Sonnet to Opus for deeper reasoning",
      "Add 'think step by step' to the prompt",
    ],
    correctIndices: [0],
    explanation:
      "Task decomposition breaks a complex, multi-part deliverable into focused subtasks. Each section gets a targeted prompt with clear scope, producing higher-quality individual sections that can then be assembled. Increasing max_tokens allows longer output but doesn't improve focus or depth. Switching models is premature. Chain-of-thought ('think step by step') helps with reasoning tasks, not multi-section writing.",
    tags: ["prompting", "task-decomposition", "domain-1"],
  },
  {
    id: "ccao-qq-005",
    service: "Prompting and Task Execution",
    domain: "fundamentals",
    difficulty: "hard",
    type: "single",
    question:
      "A team iterates on a system prompt and makes three changes simultaneously. The output quality drops. What is the primary problem with this approach?",
    options: [
      "System prompts should never be changed more than once per week",
      "Three simultaneous changes always causes a quality regression — changes should be sequential",
      "The model requires a 24-hour cooldown period after system prompt changes",
      "Changing multiple elements at once makes it impossible to attribute the quality drop to any specific change",
    ],
    correctIndices: [3],
    explanation:
      "The fundamental mistake is batching changes. When the eval score drops, there is no way to know which of the three changes caused it. The correct practice is to change one prompt element per iteration, measure the impact, then proceed. There is no weekly change limit, no cooldown period, and no rule that sequential changes are always safe — the issue is attribution, not the number of changes made over time.",
    tags: ["prompting", "iteration", "domain-1"],
  },

  // ─── DOMAIN 2: OUTPUT EVALUATION AND VALIDATION (21%) ───────────────────────

  {
    id: "ccao-qq-006",
    service: "Output Evaluation and Validation",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question:
      "Claude confidently states that a specific regulation was enacted in 2019 and cites a specific provision. A user later discovers the regulation was enacted in 2021 and the provision does not exist. What term describes this phenomenon?",
    options: [
      "A knowledge cutoff error — the regulation postdates Claude's training data",
      "A prompt injection attack by a third party",
      "A formatting error in Claude's output",
      "Hallucination — Claude generated confident-sounding but factually incorrect information",
    ],
    correctIndices: [3],
    explanation:
      "Hallucination is when Claude generates plausible-sounding but factually wrong content — including invented citations, incorrect dates, and nonexistent provisions. This is an inherent property of large language models, not a bug. A knowledge cutoff error would mean the regulation simply wasn't in the training data; hallucination means Claude fabricated a specific false fact with confidence. All specific factual claims in Claude's output require independent verification.",
    tags: ["evaluation", "hallucination", "domain-2"],
  },
  {
    id: "ccao-qq-007",
    service: "Output Evaluation and Validation",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "A healthcare company uses Claude to draft patient discharge summaries. Under Anthropic's Usage Policy (effective September 15, 2025), what governance control is required before these summaries are given to patients?",
    options: [
      "Human review of each summary and disclosure to patients that AI assisted in drafting it",
      "Routing all healthcare queries to Claude Opus 5 for maximum accuracy",
      "A minimum 48-hour review period before any AI-drafted content is used",
      "Enabling web search so Claude can reference current medical literature",
    ],
    correctIndices: [0],
    explanation:
      "Anthropic's Usage Policy explicitly lists healthcare as a high-risk use case requiring two controls: human review of AI outputs and disclosure to recipients that AI assisted in creating the content. These are mandatory governance requirements, not optional best practices. Switching models, enabling web search, and time-based review periods are not specified — the policy requires human review and disclosure specifically.",
    tags: ["evaluation", "human-review", "governance", "domain-2"],
  },
  {
    id: "ccao-qq-008",
    service: "Output Evaluation and Validation",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "A user wants Claude to produce a reusable HTML email template they can save and share with their team. Which Claude.ai feature is most appropriate for this output?",
    options: [
      "Projects — stores the template as a knowledge file for future conversations",
      "Web search — finds existing HTML email templates to use as a starting point",
      "Artifacts — creates a standalone HTML document in a separate pane that can be saved and shared",
      "Memory — saves the template to Claude's persistent memory for the user",
    ],
    correctIndices: [2],
    explanation:
      "Artifacts is Claude.ai's feature for creating standalone, reusable documents — including HTML files, code, SVGs, and markdown. It renders the output in a separate pane alongside the chat and supports iterative refinement. Projects store knowledge files and instructions, not deliverable outputs. Memory stores user facts, not documents. Web search retrieves external content — it doesn't produce reusable artifacts.",
    tags: ["evaluation", "artifacts", "output-formats", "domain-2"],
  },
  {
    id: "ccao-qq-009",
    service: "Output Evaluation and Validation",
    domain: "fundamentals",
    difficulty: "hard",
    type: "single",
    question:
      "A marketing manager asks Claude to write a product comparison that evaluates their product vs. two competitors. The output heavily favors their product without acknowledging any weaknesses. What validation step should be applied?",
    options: [
      "Accept the output since the user's goal was to promote their product",
      "Switch to Claude Fable 5.1 for more objective outputs",
      "Review the output for bias — explicitly check whether any weaknesses were omitted or framed unfairly, and edit for balance",
      "Run the prompt again with a higher temperature to get a different result",
    ],
    correctIndices: [2],
    explanation:
      "Claude's outputs can reflect the framing of the prompt and produce one-sided content when asked to write promotional material. Validation for bias means checking whether the output omits relevant negative information or frames facts unfairly. The human reviewer must edit for appropriate balance. Re-running at a higher temperature changes randomness, not bias. Switching models doesn't address a framing problem. The user's promotional intent doesn't remove the obligation to validate for accuracy and balance.",
    tags: ["evaluation", "bias", "validation", "domain-2"],
  },
  {
    id: "ccao-qq-010",
    service: "Output Evaluation and Validation",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "A user asks Claude to review its own answer for any factual errors before finalizing. Claude reports no errors found, but an independent check reveals a wrong statistic. What does this illustrate?",
    options: [
      "Self-review is not a substitute for independent verification — Claude can miss errors in its own outputs",
      "Claude's self-review feature is disabled and must be enabled in settings",
      "Self-review only works for code, not factual prose",
      "The independent check must be wrong — Claude's self-review is definitive",
    ],
    correctIndices: [0],
    explanation:
      "Claude's self-critique can surface obvious errors and uncertainty, but it is not infallible — Claude may miss the same errors it made during generation. Self-review is a useful first filter, but independent verification against authoritative sources remains required for any factual claim that matters. There is no self-review setting to enable; it works by prompting Claude to check its response.",
    tags: ["evaluation", "self-check", "verification", "domain-2"],
  },

  // ─── DOMAIN 3: PRODUCT AND MODEL SELECTION (12%) ────────────────────────────

  {
    id: "ccao-qq-011",
    service: "Product and Model Selection",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question:
      "A team needs to process 500 customer emails per night, classifying each into one of four support queues. Cost is a primary concern. Which current Claude model is MOST appropriate?",
    options: [
      "Claude Opus 5 — most capable model ensures best classification accuracy",
      "Claude Fable 5.1 — best for high-volume batch workloads",
      "Claude Sonnet 5 — balanced default for all production workloads",
      "Claude Haiku 4.5 — fastest and lowest cost at $1/$5 per MTok, well-suited for straightforward classification",
    ],
    correctIndices: [3],
    explanation:
      "Haiku 4.5 is the fastest and cheapest current model ($1 input / $5 output per million tokens) and is appropriate for straightforward classification tasks. Simple classification into four queues does not require the reasoning depth of Opus 5 ($5/$25 per MTok) or Fable 5.1 ($10/$50 per MTok). Sonnet 5 is a good default but Haiku should be evaluated first when cost is the primary concern. Always evaluate before assuming a higher tier is needed.",
    tags: ["model-selection", "models", "cost", "domain-3"],
  },
  {
    id: "ccao-qq-012",
    service: "Product and Model Selection",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "A researcher needs to analyze an entire 400,000-word academic corpus in a single API call. Which Claude models support this context window size?",
    options: [
      "No current Claude model supports more than 200K tokens",
      "Claude Fable 5.1, Opus 5, and Sonnet 5 — all have 1M token context windows (≈555K words)",
      "All current Claude models support up to 500K tokens",
      "Claude Haiku 4.5 — it has the largest context window at 1M tokens",
    ],
    correctIndices: [1],
    explanation:
      "Fable 5.1, Opus 5, and Sonnet 5 each have 1M token context windows, which at approximately 555,000 words on the current tokenizer comfortably fits a 400,000-word corpus. Haiku 4.5 has a 200K token context window (≈150K words) — too small for this task. The context window is a hard limit; exceeding it returns an error.",
    tags: ["model-selection", "context-window", "domain-3"],
  },
  {
    id: "ccao-qq-013",
    service: "Product and Model Selection",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "An organization wants 200 employees to use Claude.ai with centralized admin controls, SSO, and no training on their company data. Which plan is appropriate?",
    options: [
      "Team or Enterprise — both provide SSO and admin controls; Enterprise adds no-training commitment and advanced security",
      "Pro — provides all advanced Claude features for individual professionals",
      "Free — sufficient for basic team use with shared access",
      "Max — higher usage limits cover the volume of 200 employees",
    ],
    correctIndices: [0],
    explanation:
      "Team (Standard at $20/seat or Premium at $100/seat) and Enterprise ($20/seat + API costs) both provide centralized admin controls and SSO. Enterprise adds the no-training-on-org-data commitment, SCIM provisioning, audit logs, custom data retention, and HIPAA-ready options. Pro is an individual plan. Max is also an individual-tier plan with higher usage limits. Free does not include SSO or admin controls.",
    tags: ["model-selection", "plans", "enterprise", "domain-3"],
  },
  {
    id: "ccao-qq-014",
    service: "Product and Model Selection",
    domain: "fundamentals",
    difficulty: "hard",
    type: "single",
    question:
      "A user's Claude.ai conversation has accumulated 60 turns over a week and responses are becoming less focused and coherent. What is the BEST approach?",
    options: [
      "Switch to a model with a larger context window",
      "Start a new conversation, optionally asking Claude to first summarize the key context from the current conversation to carry forward",
      "Upgrade to a higher plan tier for more conversation capacity",
      "Delete older messages from the conversation history",
    ],
    correctIndices: [1],
    explanation:
      "As conversations grow, context accumulates noise and coherence can degrade even within the context window limit. Starting fresh — with a compact summary of essential prior context — is the standard approach. Switching to a larger-context model doesn't fix coherence degradation from accumulated turns. Claude.ai doesn't support deleting individual messages from a conversation. Plan tier affects usage limits, not per-conversation coherence.",
    tags: ["model-selection", "context-management", "domain-3"],
  },

  // ─── DOMAIN 4: WORKFLOW INTEGRATION AND SOLUTION DESIGN (16%) ───────────────

  {
    id: "ccao-qq-015",
    service: "Workflow Integration and Solution Design",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A legal team wants to use Claude to draft contract summaries. A partner insists that all final summaries be reviewed by a lawyer before going to clients. This is an example of what integration pattern?",
    options: [
      "Full automation — Claude produces client-ready output without human involvement",
      "RAG integration — Claude retrieves contract clauses from a database to generate summaries",
      "Workflow redesign — the entire contract review process has been restructured around Claude",
      "Draft-then-review — Claude handles the time-consuming drafting step while humans retain final editorial and approval control",
    ],
    correctIndices: [3],
    explanation:
      "Draft-then-review is the integration pattern where Claude produces a first draft and a human reviews, edits, and approves before the output is finalized or shared. This is appropriate for legal content where professional judgment and accountability are required. Full automation would skip the human review. Workflow redesign means restructuring the entire process, not just adding a drafting step. RAG refers to retrieving documents to ground Claude's responses.",
    tags: ["workflow", "draft-review", "integration", "domain-4"],
  },
  {
    id: "ccao-qq-016",
    service: "Workflow Integration and Solution Design",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company is introducing Claude to its operations team. What limitation is MOST important to communicate to the team upfront?",
    options: [
      "Claude can hallucinate — it may confidently state incorrect facts, so outputs must be verified before acting on them",
      "Claude requires a minimum of 10 prompts before it learns a user's preferences",
      "Claude's responses are limited to 500 words per request",
      "Claude can only process text, not spreadsheets or documents",
    ],
    correctIndices: [0],
    explanation:
      "Hallucination is the most critical limitation to communicate — it directly affects trust and the risk of acting on wrong information. If users assume Claude is always factually correct, they may make decisions based on fabricated data. Claude can process documents and images (with vision-capable models). Claude does not learn from individual interactions unless Memory is enabled. Response length is controlled by max_tokens, not a fixed 500-word limit.",
    tags: [
      "workflow",
      "stakeholder-communication",
      "hallucination",
      "domain-4",
    ],
  },
  {
    id: "ccao-qq-017",
    service: "Workflow Integration and Solution Design",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A data team needs to run sentiment analysis on 80,000 customer reviews collected over the past month. Results are needed by morning for a Monday presentation. Which approach is MOST cost-effective?",
    options: [
      "Anthropic Batch API — 50% cost discount for async processing; submitting 80,000 requests processes within 24 hours",
      "Claude Fable 5.1 via standard API — highest capability model for accurate sentiment analysis",
      "Standard API with parallel threads — real-time processing at full price",
      "Claude.ai Pro with Projects — projects handle bulk document processing automatically",
    ],
    correctIndices: [0],
    explanation:
      "The Batch API provides a 50% cost discount on all API usage for asynchronous processing of up to 100,000 requests, with results delivered within 24 hours. Submitting 80,000 reviews overnight and retrieving results by morning is exactly the use case it is designed for. Claude.ai Projects are for persistent workspaces, not bulk programmatic processing. Standard API parallel threads process in real-time at full price. Fable 5.1 is the most expensive model — model tier should be chosen by quality need, not volume.",
    tags: ["workflow", "batch-api", "cost", "domain-4"],
  },
  {
    id: "ccao-qq-018",
    service: "Workflow Integration and Solution Design",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A product team is using Claude to help design a new feature. They ask Claude to analyze user research, suggest a solution architecture, and draft a requirements document — all in one prompt. Results are shallow across all three areas. What is the BEST fix?",
    options: [
      "Add 'be thorough' to the prompt and increase max_tokens",
      "Switch to Claude Fable 5.1 to handle complex multi-step tasks in one prompt",
      "Decompose into three sequential prompts: first analyze the research, then design the architecture using that analysis, then draft requirements using both",
      "Use Claude.ai Research mode instead of the standard chat interface",
    ],
    correctIndices: [2],
    explanation:
      "Task decomposition — breaking the three-part request into sequential focused prompts where each output informs the next — produces deeper, higher-quality results on each step. Single mega-prompts produce shallow outputs because Claude must divide attention across all parts simultaneously. Switching models doesn't fix a structural prompt problem. 'Be thorough' is not a meaningful instruction. Research mode helps gather external information; it doesn't fix multi-step prompt structure.",
    tags: ["workflow", "task-decomposition", "solution-design", "domain-4"],
  },

  // ─── DOMAIN 5: CONFIGURATION AND KNOWLEDGE MANAGEMENT (12%) ─────────────────

  {
    id: "ccao-qq-019",
    service: "Configuration and Knowledge Management",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A consultant creates a Claude.ai Project for client onboarding. She uploads the client's brand guide and sets project instructions defining Claude's persona. What will be true for every conversation she starts within this project?",
    options: [
      "Claude will have access to the brand guide and project instructions in every conversation, maintaining consistent behavior",
      "The brand guide is only accessible if explicitly referenced in each message",
      "Claude will remember all prior conversations within the project and build on them",
      "The project instructions only apply to the first conversation — subsequent ones start fresh",
    ],
    correctIndices: [0],
    explanation:
      "Claude Projects persist project instructions (system prompt) and uploaded knowledge files across every conversation within the project. Each conversation starts with the same consistent instructions and knowledge base. However, Projects do NOT share conversation history between separate conversations — each conversation is independent. The brand guide and instructions are always available without needing to be re-referenced in each message.",
    tags: ["configuration", "projects", "domain-5"],
  },
  {
    id: "ccao-qq-020",
    service: "Configuration and Knowledge Management",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A team's Claude Project uses uploaded PDFs of their internal policies. The policies are updated quarterly. What must the team do to keep Claude's knowledge current?",
    options: [
      "Connect to Google Drive using a connector so the PDFs sync automatically",
      "Delete and recreate the project each quarter with fresh PDFs",
      "Re-upload the updated PDFs each quarter — uploaded knowledge files are static snapshots and do not update automatically",
      "Enable auto-sync in project settings so uploaded files refresh automatically",
    ],
    correctIndices: [2],
    explanation:
      "Uploaded knowledge files in Claude Projects are static — they reflect the document's state at the time of upload. When source documents change, the files must be manually re-uploaded. There is no auto-sync for uploaded files. Recreating the project is unnecessary — only the affected files need to be re-uploaded. Using a Google Drive connector would provide automatic sync, but only if the PDFs are stored in Google Drive and the connector is configured — this was not the described setup.",
    tags: ["configuration", "knowledge-management", "domain-5"],
  },
  {
    id: "ccao-qq-021",
    service: "Configuration and Knowledge Management",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "What is the key difference between a Google Drive connector and an uploaded knowledge file in a Claude Project?",
    options: [
      "Uploaded files support PDF format; connectors only support Google Docs",
      "Connectors are only available on the Free plan; uploaded files require a paid plan",
      "Connectors provide faster response times because Claude doesn't need to parse the file",
      "Connectors pull live data from Google Drive that updates as the source changes; uploaded files are static snapshots requiring manual re-upload when content changes",
    ],
    correctIndices: [3],
    explanation:
      "Connectors (like Google Drive and Gmail) sync live data from external services, so Claude's knowledge stays current as the source documents change. Uploaded files are a static snapshot — they must be manually re-uploaded when the originals change. Connectors require authorization to the external service and are available on supported paid plans, not the Free plan. Both connectors and uploaded files support multiple formats. Response time is determined by model and context size, not the source type.",
    tags: ["configuration", "connectors", "knowledge-management", "domain-5"],
  },
  {
    id: "ccao-qq-022",
    service: "Configuration and Knowledge Management",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A manager writes project instructions that say 'Be helpful and professional.' Claude's responses in the project are still inconsistent in tone and scope. What should be improved?",
    options: [
      "The manager needs to switch to a higher-tier Claude model for better instruction following",
      "The instructions need specific role definition, task scope, constraints, output format requirements, and concrete examples of good responses",
      "The instructions should be moved from the project level to each individual message",
      "Project instructions cannot control Claude's tone — that is determined by the model itself",
    ],
    correctIndices: [1],
    explanation:
      "Effective project instructions must be specific: define Claude's role (e.g., 'You are a customer support assistant for Acme Corp'), the task scope (what to help with), explicit constraints (what to decline), output format expectations (e.g., 'Always respond in 3 sentences or fewer'), and concrete examples. 'Be helpful and professional' is too vague to produce consistent behavior. Model tier does not fix underspecified instructions. Project instructions are exactly the right level for these controls — moving them to individual messages defeats the purpose of Projects.",
    tags: ["configuration", "system-prompt", "domain-5"],
  },

  // ─── DOMAIN 6: GOVERNANCE, RISK, AND RESPONSIBLE USE (15%) ──────────────────

  {
    id: "ccao-qq-023",
    service: "Governance, Risk, and Responsible Use",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question:
      "An operator instructs Claude via the system prompt to claim it is a human customer service agent named 'Alex' whenever a user asks if they are talking to an AI. Can Claude follow this instruction?",
    options: [
      "No — claiming to be human when sincerely asked is a hardcoded constraint that no operator instruction can override",
      "Yes — operators have full control over Claude's persona and self-identification",
      "No — operators cannot create custom personas; Claude must always identify as Claude",
      "Yes — if the instruction is included in the system prompt, it overrides Claude's default honesty behavior",
    ],
    correctIndices: [0],
    explanation:
      "Claiming to be human when sincerely asked is a hardcoded behavior that Anthropic sets and no operator or user instruction can override. Operators can create custom personas and instruct Claude not to reveal which underlying model it is. But Claude must acknowledge being an AI when a user sincerely asks — even while maintaining the 'Alex' persona. The trust hierarchy is Anthropic > Operator > User; hardcoded behaviors sit above all.",
    tags: ["governance", "hardcoded", "honesty", "domain-6"],
  },
  {
    id: "ccao-qq-024",
    service: "Governance, Risk, and Responsible Use",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "An HR software company wants to use the Anthropic API to generate automated hiring recommendations that determine which candidates advance. What does Anthropic's Usage Policy require?",
    options: [
      "Submission of the use case to Anthropic for pre-approval before deployment",
      "Use of Claude Opus 5 exclusively for employment decisions to ensure accuracy",
      "Human review of AI-generated hiring recommendations and disclosure to candidates that AI was used in the process",
      "A maximum of 100 AI-generated recommendations per day to limit risk",
    ],
    correctIndices: [2],
    explanation:
      "Employment decisions are listed as a high-risk use case in Anthropic's Usage Policy (effective September 15, 2025). For this category, providers must implement human review of AI outputs and disclose to candidates that AI assisted in the process. The policy does not specify which model to use, does not require pre-approval from Anthropic, and sets no daily volume limits. The two requirements are human review and disclosure.",
    tags: ["governance", "compliance", "high-risk", "domain-6"],
  },
  {
    id: "ccao-qq-025",
    service: "Governance, Risk, and Responsible Use",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "A startup wants to use Claude via the standard API to process confidential client financial data. What privacy consideration is MOST important?",
    options: [
      "The Anthropic API automatically encrypts all financial data at rest and in transit, making it safe for any plan",
      "By default, Anthropic may use API inputs and outputs for safety research; confidential data requires a plan with appropriate privacy commitments and a data processing agreement",
      "The Free plan provides sufficient data privacy for confidential financial data",
      "Financial data processing is prohibited under Anthropic's Usage Policy regardless of plan",
    ],
    correctIndices: [1],
    explanation:
      "By default on standard API plans, Anthropic may use inputs and outputs for safety research. Before sending confidential or regulated financial data, the team must confirm the plan includes appropriate privacy commitments (Enterprise provides a no-training commitment) and execute a data processing agreement. While Anthropic uses encryption in transit, that does not address data use for model training. Financial data processing is not prohibited — it is a high-risk category requiring appropriate controls. The Free plan has the weakest privacy protections.",
    tags: ["governance", "privacy", "data-sensitivity", "domain-6"],
  },
  {
    id: "ccao-qq-026",
    service: "Governance, Risk, and Responsible Use",
    domain: "security",
    difficulty: "hard",
    type: "single",
    question:
      "A content platform operator wants to use Claude to generate adult content for a verified adult audience. Is this possible under Anthropic's policies?",
    options: [
      "No — sexually explicit content is a hardcoded prohibition that no operator can override",
      "Yes — operators have unlimited control over Claude's content generation",
      "Only if the operator switches to a self-hosted Claude deployment",
      "Potentially yes — generating explicit adult content is a softcoded default that operators may be able to enable for appropriate platforms, within Anthropic's policy limits",
    ],
    correctIndices: [3],
    explanation:
      "Anthropic distinguishes hardcoded behaviors (absolute, unchangeable) from softcoded defaults (adjustable by operators within policy limits). Generating explicit sexual content between adults for verified adult platforms is listed as a potentially adjustable softcoded behavior, not a hardcoded prohibition. However, content involving minors is always hardcoded-prohibited. Operators cannot override hardcoded behaviors. There is no self-hosted Claude deployment option that removes policy limits — Anthropic's policies apply regardless of deployment method.",
    tags: ["governance", "softcoded", "operator-controls", "domain-6"],
  },

  // ─── DOMAIN 7: TROUBLESHOOTING AND OPTIMIZATION (10%) ───────────────────────

  {
    id: "ccao-qq-027",
    service: "Troubleshooting and Optimization",
    domain: "troubleshooting",
    difficulty: "easy",
    type: "single",
    question:
      "A user asks Claude about a software library released in March 2026, and Claude says it has no information about it. What is the most likely explanation?",
    options: [
      "Claude refuses to discuss third-party software libraries for safety reasons",
      "Claude's context window is too small to store information about all software libraries",
      "The library was released after Claude's knowledge cutoff — Claude Haiku 4.5 cuts off at February 2025; Claude Sonnet 5 at January 2026",
      "The user needs to enable web search to query programming topics",
    ],
    correctIndices: [2],
    explanation:
      "Claude's training data has a cutoff date. Claude Haiku 4.5's reliable knowledge cutoff is February 2025; Claude Sonnet 5's is January 2026; Claude Opus 5's is May 2026; Claude Fable 5.1's is June 2026. A library released in March 2026 would be after Haiku 4.5 and Sonnet 5's cutoffs. Claude does not refuse software topics for safety reasons. The context window limits per-call input, not the scope of training knowledge. Enabling web search would allow Claude to look up current information.",
    tags: ["troubleshooting", "knowledge-cutoff", "domain-7"],
  },
  {
    id: "ccao-qq-028",
    service: "Troubleshooting and Optimization",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    question:
      "Claude's outputs for the same customer support query vary significantly between runs — sometimes formal, sometimes casual, sometimes missing key information. What is the BEST way to improve consistency?",
    options: [
      "Ask Claude to 'always be consistent' in the system prompt",
      "Run each query 10 times and pick the best response manually",
      "Use a Claude Project with specific instructions defining tone, format, and required response elements — combined with few-shot examples of correct responses",
      "Switch to Claude Fable 5.1 which produces more deterministic outputs",
    ],
    correctIndices: [2],
    explanation:
      "Claude Projects with well-specified instructions (tone, format, required elements) and few-shot examples are the most effective tools for improving response consistency across conversations. Non-determinism is inherent to LLMs — running queries multiple times wastes cost without fixing the root cause. No model tier is guaranteed more deterministic than others for this task. 'Always be consistent' is too vague to produce meaningful behavioral change.",
    tags: ["troubleshooting", "consistency", "projects", "domain-7"],
  },
  {
    id: "ccao-qq-029",
    service: "Troubleshooting and Optimization",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    question:
      "A Claude.ai user finds that their responses are taking increasingly long and the quality is deteriorating as their conversation grows. What should they do?",
    options: [
      "Switch to a model with a larger context window",
      "Delete the oldest messages in the conversation to free up context",
      "Upgrade to the Max plan for higher performance in long conversations",
      "Start a new conversation — long conversation threads degrade coherence; carry forward only a brief summary of essential prior context",
    ],
    correctIndices: [3],
    explanation:
      "As conversations grow, accumulated context can degrade coherence even before hitting the hard context window limit. Starting a new conversation with a brief summary of only the essential prior context resolves this. Plan tier affects usage limits, not per-conversation quality. Claude.ai does not support deleting individual messages from a conversation. Switching to a larger context window model doesn't fix coherence degradation from accumulated conversational noise.",
    tags: ["troubleshooting", "context-management", "optimization", "domain-7"],
  },
  {
    id: "ccao-qq-030",
    service: "Troubleshooting and Optimization",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    question:
      "A company's Claude integration costs $8,000 per month. The team uses Claude Opus 5 for all requests, including simple FAQ lookups. What is the HIGHEST-IMPACT optimization to reduce costs?",
    options: [
      "Reduce max_tokens to limit output length and cut output token costs",
      "Switch to the Batch API to get a 50% discount on all requests",
      "Evaluate whether Haiku 4.5 meets quality requirements for FAQ lookups — at $1/$5 vs. $5/$25 per MTok, routing simple queries to Haiku could reduce those costs by ~80%",
      "Enable prompt caching for all requests to reduce input token costs by 90%",
    ],
    correctIndices: [2],
    explanation:
      "Model selection is the largest single cost lever. Claude Haiku 4.5 costs $1 input / $5 output per million tokens vs. Claude Opus 5 at $5 input / $25 output per million tokens — a 5x difference on input and output. If FAQ lookups (which are typically simple) can be handled by Haiku with acceptable quality, routing them there reduces those costs by approximately 80%. Prompt caching helps for repeated large system prompts. The Batch API helps for offline async workloads, not real-time FAQ. Reducing max_tokens only helps if responses are consistently long.",
    tags: [
      "troubleshooting",
      "cost-optimization",
      "model-selection",
      "domain-7",
    ],
  },
  {
    id: "ccao-qq-031",
    service: "Troubleshooting and Optimization",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    question:
      "A team changes their project instructions to fix a formatting issue, and Claude now performs worse on tone. What should they do?",
    options: [
      "Revert the instructions to the previous version and make the formatting change alone — then test tone before proceeding",
      "Accept the tone regression as a necessary trade-off for correct formatting",
      "Switch to a more capable model that can handle the formatting requirements without affecting tone",
      "Reset the project entirely and start from scratch",
    ],
    correctIndices: [0],
    explanation:
      "The correct troubleshooting discipline is to change one element at a time. If a change to fix formatting also broke tone, revert and isolate: first make only the formatting change, test, confirm tone is unchanged, then proceed. Accepting regressions means quality degrades over time. Full project reset loses all prior configuration. Switching models doesn't fix a prompt engineering problem — the instructions are the variable.",
    tags: ["troubleshooting", "iteration", "domain-7"],
  },
  {
    id: "ccao-qq-032",
    service: "Troubleshooting and Optimization",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    question:
      "A user's Claude outputs on a research task include some statements the user cannot verify. Which combination of approaches BEST addresses this?",
    options: [
      "Enable web search (for current sourced information) AND ask Claude to flag any claims it is uncertain about — then independently verify flagged claims against authoritative sources",
      "Switch to Claude Fable 5.1 which has a training cutoff of June 2026 and therefore more current knowledge",
      "Ask Claude to only state facts it is 100% certain about",
      "Use the Batch API to run the same prompt 5 times and accept the most common answer",
    ],
    correctIndices: [0],
    explanation:
      "Combining web search (so Claude can ground claims in current sources) with explicit uncertainty flagging (so the human knows which claims need more scrutiny) is the best practical approach. Independent verification against authoritative sources remains required. Switching to Fable 5.1 helps with recency but doesn't eliminate hallucination. Asking Claude to only state 100% certain facts isn't effective — Claude cannot reliably self-identify its own uncertainty. Running the same prompt multiple times via Batch API and taking the most common answer (majority voting) can help with consistency but not factual accuracy.",
    tags: ["troubleshooting", "verification", "web-search", "domain-7"],
  },

  // ─── CROSS-DOMAIN SCENARIO QUESTIONS ────────────────────────────────────────

  {
    id: "ccao-qq-033",
    service: "Governance, Risk, and Responsible Use",
    domain: "security",
    difficulty: "hard",
    type: "single",
    question:
      "A user in a Claude.ai chat asks the assistant to help them write a phishing email template to 'test their company's employees.' The user claims they are an IT security professional conducting authorized phishing simulations. How should this be handled?",
    options: [
      "Claude should help since phishing simulation is a widely accepted security practice",
      "Claude should help since the user has stated a legitimate security testing purpose",
      "Claude may decline or ask for more context — creating phishing email content designed to deceive people falls under prohibited uses, and Claude cannot verify authorization claims from users",
      "Claude should help if the user provides their company email address as verification",
    ],
    correctIndices: [2],
    explanation:
      "Creating deceptive content designed to manipulate people (phishing templates) falls under Anthropic's prohibited use categories, including fraud and unauthorized surveillance facilitation. Claude cannot verify authorization claims made by users. While authorized phishing simulations are a legitimate security practice, Claude's position in the trust hierarchy means user claims do not unlock capabilities restricted by Anthropic's policy. Legitimate penetration testers typically use established tooling rather than AI-generated phishing content.",
    tags: ["governance", "prohibited-use", "trust-hierarchy", "domain-6"],
  },
  {
    id: "ccao-qq-034",
    service: "Output Evaluation and Validation",
    domain: "fundamentals",
    difficulty: "hard",
    type: "single",
    question:
      "A financial analyst uses Claude to summarize a 200-page earnings report. The summary looks polished and complete. What validation steps are MOST important before using it in a client presentation?",
    options: [
      "Run the prompt a second time and compare the two summaries for consistency",
      "Cross-check specific figures, percentages, and key claims against the original document, and have a qualified reviewer confirm nothing material was omitted",
      "Verify that Claude's training data includes financial documents to confirm it is qualified for this task",
      "Check the summary length — if it covers the document proportionally, it is likely complete",
    ],
    correctIndices: [1],
    explanation:
      "For a client-facing financial document, verification must be substantive: check every specific number, percentage, and material claim against the original report. An earnings summary that omits a key risk factor or misquotes a revenue figure could cause real harm. Running the prompt twice checks consistency, not accuracy. Summary length is not a proxy for completeness. Claude's ability to process financial documents is not a quality guarantee — hallucination can occur on any topic.",
    tags: ["evaluation", "verification", "financial", "domain-2"],
  },
  {
    id: "ccao-qq-035",
    service: "Configuration and Knowledge Management",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A small team shares a Claude.ai Team plan and creates a Project for their weekly meeting notes. A team member notices Claude sometimes references facts from meeting notes that were updated months ago. What is the likely cause?",
    options: [
      "Claude.ai Projects automatically archive knowledge files after 30 days",
      "The team member is using a different conversation within the project that has a separate knowledge set",
      "The Project is using an older model tier that has an earlier knowledge cutoff",
      "The knowledge files were uploaded months ago and not re-uploaded after the meeting notes were updated — uploaded files are static snapshots",
    ],
    correctIndices: [3],
    explanation:
      "Uploaded knowledge files in Claude Projects are static snapshots of the document at the time of upload. When the underlying meeting notes change, the uploaded files must be manually re-uploaded to reflect the updates. The model tier's knowledge cutoff refers to the model's training data, not project file freshness. Projects do not auto-archive knowledge files. All conversations in a project share the same project instructions and knowledge files.",
    tags: ["configuration", "knowledge-management", "static-files", "domain-5"],
  },
  {
    id: "ccao-qq-036",
    service: "Prompting and Task Execution",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "A user wants Claude to brainstorm 10 creative product names. The user specifies the product category, target audience, and desired tone. Claude produces 10 very similar names. What prompt change would MOST increase variety?",
    options: [
      "Increase the max_tokens setting to allow longer responses",
      "Remove the tone constraint so Claude has more creative freedom",
      "Ask Claude to generate names across multiple distinct creative directions (e.g., 'Generate 2–3 names in each of these 4 styles: playful, professional, abstract, descriptive')",
      "Switch to Claude Fable 5.1 for more creative outputs",
    ],
    correctIndices: [2],
    explanation:
      "Specifying distinct creative directions forces Claude to explore different conceptual angles rather than variations of the same approach. This is a prompting technique, not a model or parameter issue. Increasing max_tokens allows longer responses, not more varied ideas. Switching models is premature when the prompt structure is the variable. Removing the tone constraint may help marginally but doesn't address the root cause — Claude needs explicit direction to explore diverse approaches.",
    tags: ["prompting", "brainstorming", "task-type", "domain-1"],
  },
  {
    id: "ccao-qq-037",
    service: "Product and Model Selection",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "A Claude.ai Free plan user wants to save a custom persona and topic restrictions so they apply to all their conversations. What should they do?",
    options: [
      "Use the Memory feature to save the persona, which applies across all conversations on the Free plan",
      "Create a Claude.ai Team account to access Projects at no additional cost",
      "Set the persona in every conversation's first message as a workaround",
      "Upgrade to Pro or higher — Projects (which enable persistent instructions) are not available on the Free plan",
    ],
    correctIndices: [3],
    explanation:
      "Claude Projects — which store persistent instructions and knowledge — are available on Pro ($17/mo annual or $20/mo monthly), Max, Team, and Enterprise plans. The Free plan does not include Projects. Setting the persona in every conversation's first message works but is manual and not persistent. Memory stores personal facts about the user, not system-level instructions like persona and topic restrictions. Team accounts are paid ($20/seat/month minimum) and not free.",
    tags: ["model-selection", "plans", "projects", "domain-3"],
  },
  {
    id: "ccao-qq-038",
    service: "Workflow Integration and Solution Design",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A nonprofit wants to use Claude to analyze 5,000 grant applications and produce ranked shortlists. What combination of approaches best serves this use case?",
    options: [
      "Claude.ai Pro with Projects to store all 5,000 applications as knowledge files for Claude to reference",
      "Claude Fable 5.1 via standard API — the highest capability model ensures the most accurate ranking",
      "Batch API for cost-effective async processing of all 5,000 applications, with human review of the shortlist before final decisions — disclosing AI was used in the screening",
      "Standard API with streaming for real-time ranked output as applications are submitted",
    ],
    correctIndices: [2],
    explanation:
      "The Batch API (50% cost discount, up to 100,000 requests, processes within 24 hours) is designed for exactly this kind of high-volume offline processing. Employment and grant decisions are high-risk use cases under Anthropic's policy — human review and AI disclosure are required. Projects have knowledge storage limits and are not designed for bulk programmatic analysis. Streaming is for real-time interactive features, not batch analysis. Model tier should match quality needs, not volume — Haiku or Sonnet may be sufficient and far cheaper for structured analysis tasks.",
    tags: ["workflow", "batch-api", "governance", "domain-4"],
  },
  {
    id: "ccao-qq-039",
    service: "Output Evaluation and Validation",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question:
      "A user asks Claude to write a 1,000-word article. The output is 1,000 words but contains several factually incorrect claims about historical events. Which evaluation criterion did the output fail?",
    options: [
      "Completeness — the article should have been longer to include correct facts",
      "Accuracy — the output met the length requirement but contains factually incorrect information",
      "Relevance — the topic was too complex for Claude to handle accurately",
      "Format — the article should have included citations to prevent factual errors",
    ],
    correctIndices: [1],
    explanation:
      "Accuracy and completeness are separate evaluation criteria. The output met the length (format) requirement but failed on accuracy by containing incorrect historical facts. Completeness refers to whether required content was omitted, not length. Format refers to structure, not factual correctness. Historical topics are within Claude's capabilities — the issue is that Claude can hallucinate historical facts, which is why independent verification is always required.",
    tags: ["evaluation", "accuracy", "validation", "domain-2"],
  },
  {
    id: "ccao-qq-040",
    service: "Governance, Risk, and Responsible Use",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "An organization wants to build an internal Claude-powered assistant that answers employee questions about HR policies. The system prompt should restrict Claude to only discussing HR topics. This is an example of what kind of behavior configuration?",
    options: [
      "Hardcoded behavior configuration — restricting topics requires Anthropic's direct involvement",
      "Model fine-tuning — the model must be retrained to restrict topic scope",
      "User-level permission setting — employees can configure their own topic restrictions",
      "Softcoded behavior adjustment — operators can restrict Claude's defaults via the system prompt to narrow its scope to a specific domain",
    ],
    correctIndices: [3],
    explanation:
      "Operators can use the system prompt to restrict Claude's behavior to a specific domain (e.g., 'Only answer questions related to our HR policies. Decline all other requests politely.'). This is a softcoded behavior adjustment — operators tightening Claude's defaults within what Anthropic's policy allows. Hardcoded behaviors are Anthropic-level absolute limits, not operator-configurable. Users cannot set their own topic restrictions unless operators explicitly permit it. Model fine-tuning is a separate, much more involved process.",
    tags: ["governance", "softcoded", "operator-controls", "domain-6"],
  },
  {
    id: "ccao-qq-041",
    service: "Troubleshooting and Optimization",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    question:
      "A team uses the Anthropic API with a 4,000-token system prompt sent with every request. They make 1,000 requests per hour. What is the BEST approach to reduce input token costs?",
    options: [
      "Switch to the Batch API to get a 50% discount on all requests including system prompt tokens",
      "Enable prompt caching — at 1,000 requests per hour (one every ~3.6 seconds), the cache is hit on every call, reducing the 4,000-token system prompt cost to ~10% of normal price",
      "Compress the system prompt to 2,000 tokens by removing examples and details",
      "Move the system prompt to a Project knowledge file to reduce per-request token usage",
    ],
    correctIndices: [1],
    explanation:
      "Prompt caching is designed for exactly this scenario: a large repeated system prompt sent at high frequency. At 1,000 requests per hour, there is a request every 3.6 seconds — well within the 5-minute cache TTL. After the first request writes the cache, all subsequent requests pay approximately 10% of normal input token price for those 4,000 tokens. Projects are a Claude.ai feature, not an API feature for reducing per-request tokens. The Batch API provides 50% off but is for async offline workloads, not real-time high-frequency requests. Compressing the prompt may reduce quality — caching should be tried first.",
    tags: [
      "troubleshooting",
      "prompt-caching",
      "cost-optimization",
      "domain-7",
    ],
  },
  {
    id: "ccao-qq-042",
    service: "Prompting and Task Execution",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question:
      "A user is using Claude to help plan a project timeline. Claude's first response misses several dependencies between tasks. What is the BEST next step?",
    options: [
      "Start a new conversation — Claude cannot revise its outputs once generated",
      "Accept the output and manually add the dependencies afterward",
      "Switch to a more capable model to handle project planning complexity",
      "Provide specific feedback identifying the missing dependencies and ask Claude to revise, adding those constraints to the prompt",
    ],
    correctIndices: [3],
    explanation:
      "Prompt iteration is a core CCAO-F skill. Providing specific, targeted feedback ('You missed that Task B cannot start until Task A is complete, and Task D depends on both B and C') allows Claude to revise its output with the correct constraints. Claude can refine outputs within a conversation. Switching models is premature when the issue is incomplete input (missing constraints), not model capability. Manually editing the output foregoes Claude's ability to incorporate the constraints into a coherent revised plan.",
    tags: ["prompting", "iteration", "task-execution", "domain-1"],
  },
];
