import { ServiceGuide } from "../../../../types/guide";

export const productAndModelSelectionGuide: ServiceGuide = {
  id: "ccao-product-model-selection",
  service: "Product and Model Selection",
  domain: "fundamentals",
  tagline:
    "Choosing the right Claude product features and model tier for any task",
  intro:
    "Selecting the appropriate Claude product and model is a foundational skill for AI operators. The decision spans two axes: which Claude.ai product features to use (Projects, Research mode, Artifacts, chat), and which model tier (Fable, Opus, Sonnet, or Haiku) best matches the cost, speed, and quality requirements of the task.",

  sections: [
    {
      heading: "Claude.ai Product Features",
      body: `Claude.ai provides several distinct features that serve different workflows. **Chat** is the baseline: a single-session conversation with no persistent memory beyond the current window. Each new chat starts fresh, with no knowledge of previous sessions unless the user re-provides context.

**Projects** are persistent workspaces that maintain a shared system prompt (custom instructions) and a knowledge base of uploaded files across all conversations within the project. A Project is the right feature when you have recurring workflows — for example, a legal analyst who always needs Claude to follow a specific reasoning framework and reference the same policy documents. Instructions and knowledge set in a Project persist indefinitely and apply to every conversation opened under it.

**Artifacts** are standalone documents Claude generates within a conversation — formatted outputs such as code files, structured reports, or HTML pages that can be viewed, copied, and iterated on as discrete objects rather than inline chat text. Artifacts are useful when the goal is a deliverable, not just a conversational answer.

**Research mode** enables Claude to conduct multi-step web searches and synthesize findings from multiple sources before responding. It is designed for tasks requiring current information or broad topic coverage — market research, literature reviews, fact-checking recent events — where a single prompt without web access would produce incomplete or outdated results.`,
      quiz: [
        {
          question:
            "A marketing manager wants Claude to always follow the company's brand voice guidelines and have access to the company style guide document across all future conversations. Which Claude.ai feature is the best fit?",
          options: [
            "Projects — provides persistent custom instructions and a shared knowledge base across all conversations",
            "Artifacts — generates standalone documents that persist between sessions",
            "Research mode — enables Claude to search and retrieve the style guide from the web",
            "A new chat session each time, pasting the style guide manually",
          ],
          correctIndex: 0,
          explanation:
            "Projects are the correct feature for this use case. They maintain persistent custom instructions and uploaded knowledge files across all conversations within the project. The manager can upload the style guide once and set brand voice instructions once — every subsequent conversation automatically applies them. Artifacts are about output format, not persistent instructions. Research mode is for web search. Manual pasting is error-prone and not scalable.",
        },
        {
          question:
            "A researcher needs Claude to investigate a rapidly evolving topic by searching recent news and synthesizing findings from multiple sources. Which Claude.ai feature is designed for this?",
          options: [
            "Research mode — Claude conducts multi-step web searches and synthesizes results",
            "Projects — provides Claude with uploaded documents for reference",
            "Standard chat — Claude's training data is sufficient for any research task",
            "Artifacts — creates structured research documents from a single prompt",
          ],
          correctIndex: 0,
          explanation:
            "Research mode is purpose-built for multi-step, web-search-driven investigation. It allows Claude to search the web iteratively and synthesize findings before responding — critical for rapidly evolving topics where training data is stale. Projects require you to upload documents yourself. Standard chat lacks real-time web access. Artifacts are about the output format of a response, not about gathering live information.",
        },
      ],
    },
    {
      heading: "Claude.ai Subscription Plans",
      body: `Claude.ai is available on four subscription tiers, each designed for a different use profile. **Free** provides access to web and mobile chat, web search, memory, and basic features — suitable for casual personal use.

**Pro** at $17/month (annual) or $20/month (monthly) adds Claude Code, Projects, Microsoft 365 integration, and increased usage limits. It is targeted at individual professionals and power users who use Claude daily for substantial work tasks.

**Max** starts at $100/month and offers 5x or 20x Pro usage limits plus priority access to Claude. Max is designed for users who regularly hit Pro usage limits — heavy developers, researchers, or professionals running long agentic sessions throughout the day.

**Team** plans come in two tiers: Standard at $20/seat and Premium at $100/seat. They add centralized billing across all seats, SSO (single sign-on), and admin controls for managing members. Team plans are appropriate for organizations deploying Claude across a department or company.

**Enterprise** is priced at $20/seat plus API usage and adds SCIM provisioning for automated user lifecycle management, audit logs for compliance, custom data retention policies, and HIPAA-ready configuration. Enterprise is the appropriate choice when regulatory compliance, data governance, or large-scale organizational deployment is required.`,
      quiz: [
        {
          question:
            "A healthcare company needs to deploy Claude for 200 employees, with audit logs for compliance, SCIM provisioning, and HIPAA-ready configuration. Which Claude.ai plan is required?",
          options: [
            "Enterprise — provides audit logs, SCIM, custom data retention, and HIPAA-ready features",
            "Team Premium — provides SSO and admin controls sufficient for compliance requirements",
            "Team Standard — centralized billing covers compliance needs at lower cost",
            "Max — priority access ensures the performance needed for healthcare workloads",
          ],
          correctIndex: 0,
          explanation:
            "Enterprise is the only plan that includes HIPAA-ready configuration, audit logs, SCIM provisioning, and custom data retention — all required for regulated healthcare deployments. Team plans provide SSO and admin controls but lack audit logs, SCIM, and HIPAA-ready compliance. Max is an individual usage-scale plan, not an organizational governance plan.",
        },
      ],
    },
    {
      heading: "The Claude Model Lineup",
      body: `As of September 2026, Anthropic offers four production model tiers, each with distinct capability and cost profiles. All current models support text input, image input, text output, multilingual content, vision, and tool use.

**Claude Fable 5.1** is Anthropic's most capable model, designed for demanding reasoning, complex multi-step analysis, and long-horizon agentic work. It has a 1M-token context window and is priced at $10 per million input tokens and $50 per million output tokens. Fable 5.1 is the slowest model and is reserved for tasks where quality is paramount regardless of cost or latency.

**Claude Opus 5** targets complex agentic coding and enterprise workflows. It offers a 1M-token context window at $5 per million input tokens and $25 per million output tokens, with moderate speed. Opus 5 sits between Fable and Sonnet: more capable than Sonnet for multi-step code generation and reasoning chains, but faster and cheaper than Fable.

**Claude Sonnet 5** delivers the best balance of speed and intelligence. It has a 1M-token context window, priced at $2 per million input tokens and $10 per million output tokens, and runs fast. Sonnet 5 is the recommended default for most production applications — capable enough for complex tasks, fast enough for interactive use, and cost-efficient at scale.

**Claude Haiku 4.5** is the fastest model with near-frontier intelligence. It has a 200K-token context window, priced at $1 per million input tokens and $5 per million output tokens. Haiku 4.5 is optimized for high-throughput, latency-sensitive tasks where cost efficiency is critical and full reasoning depth is not required.`,
      quiz: [
        {
          question:
            "Which Claude model offers the largest context window and is designed for the most demanding reasoning tasks?",
          options: [
            "Claude Fable 5.1 — 1M-token context, highest capability, $10/$50 per MTok",
            "Claude Opus 5 — 1M-token context, complex agentic coding focus",
            "Claude Sonnet 5 — balanced speed and intelligence with 1M-token context",
            "Claude Haiku 4.5 — fastest model with 200K-token context",
          ],
          correctIndex: 0,
          explanation:
            "Claude Fable 5.1 is Anthropic's most capable model with a 1M-token context window and the highest per-token pricing ($10 input / $50 output per MTok), reflecting its positioning for the most demanding reasoning and long-horizon agentic work. Opus 5 also has a 1M-token context but is positioned for agentic coding rather than maximum reasoning depth. Haiku 4.5 has only a 200K-token context window.",
        },
        {
          question:
            "A team needs a model for a customer-facing chat feature with sub-second response requirements and high query volume. The queries are simple product FAQs. Which model is the best fit?",
          options: [
            "Claude Haiku 4.5 — fastest model, lowest cost, ideal for simple high-throughput tasks",
            "Claude Fable 5.1 — most capable, ensures the highest quality answers",
            "Claude Sonnet 5 — best balance of speed and intelligence",
            "Claude Opus 5 — appropriate for enterprise-facing customer support",
          ],
          correctIndex: 0,
          explanation:
            "Claude Haiku 4.5 is purpose-built for high-throughput, latency-sensitive tasks with near-frontier intelligence. Simple FAQ lookups do not require deep reasoning — the speed and cost advantages of Haiku 4.5 ($1/$5 per MTok, fastest) make it the obvious fit. Fable 5.1 and Opus 5 add cost and latency with no quality benefit for FAQ queries. Sonnet 5 is the sensible default but Haiku 4.5 is more appropriate when latency and cost dominate.",
        },
      ],
    },
    {
      heading: "Aligning Model Selection with Task Requirements",
      body: `Model selection should be driven by three variables evaluated against the specific task: **quality requirements** (how much reasoning depth does the task demand?), **latency requirements** (how fast must the response arrive?), and **cost at scale** (how many calls will this feature make, and at what volume does pricing matter?).

The recommended decision process is: start with **Sonnet 5** as the default for any new feature. Run evaluations on a representative sample of real inputs to measure output quality. If quality is measurably insufficient for the task, upgrade to Opus 5 or Fable 5.1. If quality is more than adequate and speed or cost is a concern, evaluate Haiku 4.5. Never assume a model tier — let evaluation data drive the decision.

**Cost compounds with volume.** A feature called one million times per day costs $1,000/day with Haiku 4.5 input tokens versus $10,000/day with Fable 5.1 input tokens for identical prompts. This 10x difference means model selection is a significant architectural and financial decision at scale, not a minor configuration detail.

**Latency profiles matter for user experience.** Interactive features (chat, search, autocomplete) require fast responses to avoid user frustration. Background batch jobs (nightly reports, data enrichment, document processing pipelines) have no real-time latency requirement, making them the natural home for Fable 5.1 or Opus 5 when task complexity warrants it.

Use **context window size** as an additional constraint. Tasks requiring processing of very long documents benefit from the 1M-token windows of Fable 5.1, Opus 5, and Sonnet 5. If your task reliably fits within 200K tokens, Haiku 4.5's smaller window is not a limitation and its speed and cost advantages apply.`,
      quiz: [
        {
          question:
            "A data team runs a nightly pipeline that generates 50,000 high-stakes financial analysis reports. Accuracy is critical and latency is not a concern. What is the correct model selection approach?",
          options: [
            "Evaluate Fable 5.1, Opus 5, and Sonnet 5 on a sample set; choose the cheapest model that meets the quality bar",
            "Always use Fable 5.1 for financial analysis to guarantee maximum accuracy",
            "Use Haiku 4.5 because batch jobs should optimize for cost",
            "Use Sonnet 5 as the default without evaluation since it is the balanced choice",
          ],
          correctIndex: 0,
          explanation:
            "The correct approach is evaluation-driven: test multiple models on representative samples and select the cheapest model that meets the accuracy requirement. High-stakes financial analysis may warrant Fable 5.1 or Opus 5 — but only if evaluation confirms that Sonnet 5 is insufficient. Assuming Fable 5.1 is always required ignores cost without evidence. Defaulting to Haiku 4.5 for cost reasons may sacrifice required accuracy. Evaluation data, not assumptions, drives the decision.",
        },
      ],
    },
    {
      heading: "Context Limitations and Memory Management",
      body: `Every Claude model has a **context window** — the maximum number of tokens that can be processed in a single conversation or API call, including the system prompt, all conversation turns, tool results, and the model's response. Claude Fable 5.1, Opus 5, and Sonnet 5 all support 1M-token contexts (approximately 555,000 words). Claude Haiku 4.5 supports 200K tokens (approximately 150,000 words). The context window is a hard ceiling: exceeding it returns an error, not a silent truncation.

As a conversation grows, it consumes more of the available context window. Users and operators must understand **when to act** to avoid hitting the ceiling unexpectedly. There are three management strategies:

**Restart the conversation** when prior turns are no longer relevant to the current task. Starting fresh with only the current task in context reduces cost, reduces latency, and eliminates irrelevant history that can dilute model focus.

**Summarize and compress** when some history is needed but the full transcript is too long. Ask Claude to summarize what has been discussed so far, then start a new conversation with that summary as the context. This preserves continuity without paying the full cost of the complete history.

**Persist to external storage** (a database, vector store, or file system) when information must survive beyond a single conversation. Claude's context window is ephemeral — nothing is remembered across separate API calls or chat sessions unless the application explicitly stores and re-injects it. Projects in Claude.ai provide a structured version of this pattern for knowledge base files and instructions.

For Claude.ai users, memory features can store facts about the user across sessions, but this is distinct from injecting full conversation transcripts. Operators building on the API must implement persistence themselves.`,
      quiz: [
        {
          question:
            "A user has been working in a long Claude.ai chat session over several hours. The conversation has grown very long and they need to continue the project tomorrow. What is the best approach to avoid context window issues while preserving continuity?",
          options: [
            "Ask Claude to summarize the key decisions and context, then start a new conversation with that summary",
            "Continue in the same chat — Claude's context window automatically expands as needed",
            "Export the full conversation transcript and paste it into tomorrow's session",
            "Switch to a model with a larger context window and continue in the same chat",
          ],
          correctIndex: 0,
          explanation:
            "Summarizing key decisions and starting a new conversation with the compressed summary is the most effective strategy. It preserves the essential context, reduces token consumption for tomorrow's session, and avoids the cost of re-processing the entire prior conversation. The context window does not expand automatically — it is a hard limit. Pasting a full transcript is inefficient and may itself hit the context limit. Switching models buys more headroom but doesn't eliminate the problem for very long sessions.",
        },
        {
          question:
            "An application needs to remember user preferences and interaction history across multiple separate Claude API calls over days and weeks. What is the correct approach?",
          options: [
            "Store preferences and relevant history in an external database and inject them into each new API call's system prompt or context",
            "Use the same API session across all calls — Claude retains context automatically",
            "Enable Claude's built-in persistent memory by setting the memory flag in the API request",
            "Use a 1M-token context window model so the full history fits in a single call indefinitely",
          ],
          correctIndex: 0,
          explanation:
            "Claude's context window is ephemeral — each API call is stateless. Nothing is remembered between separate calls unless the application explicitly persists and re-injects it. The correct architecture is to store user preferences and history in an external database and inject the relevant subset into each API call. There is no persistent memory flag in the Messages API. Even a 1M-token window would eventually overflow with weeks of history and becomes prohibitively expensive to send on every call.",
        },
      ],
    },
  ],

  keyFacts: [
    "Claude.ai features: Chat (single-session), Projects (persistent instructions + knowledge), Artifacts (standalone output documents), Research mode (multi-step web search)",
    "Projects maintain custom instructions and uploaded files across all conversations in the workspace",
    "Claude.ai plans: Free, Pro ($17-20/mo), Max ($100+/mo), Team ($20-100/seat), Enterprise ($20/seat + API)",
    "Enterprise adds SCIM, audit logs, custom data retention, and HIPAA-ready configuration",
    "Current model lineup: Fable 5.1 (most capable), Opus 5 (agentic coding), Sonnet 5 (balanced default), Haiku 4.5 (fastest)",
    "Fable 5.1 pricing: $10/$50 per MTok input/output; Haiku 4.5 pricing: $1/$5 per MTok input/output",
    "Fable 5.1, Opus 5, and Sonnet 5 support 1M-token contexts (~555K words); Haiku 4.5 supports 200K tokens (~150K words)",
    "Context window is a hard ceiling — exceeding it returns an error, not silent truncation",
    "Memory management strategies: restart conversation, summarize and compress, persist to external storage",
    "Claude's context is ephemeral between API calls — applications must implement their own persistence",
  ],

  relatedServices: [
    "Claude Models",
    "Anthropic Products and Ecosystem",
    "Messages API",
    "Agentic Workflows",
    "Production Deployment",
  ],

  examTips: [
    "Know which Claude.ai feature matches each scenario: Projects for persistent instructions, Research mode for live web search, Artifacts for standalone deliverables",
    "Enterprise is the only plan with SCIM, audit logs, and HIPAA-ready features — required for regulated industries",
    "Model selection rule: start with Sonnet 5, evaluate, then upgrade or downgrade based on evidence — never assume",
    "Haiku 4.5 has a 200K-token context ceiling; all other current models support 1M tokens",
    "Context window overflow is a hard API error — implement chunking, summarization, or RAG before hitting the limit",
    "Claude has no built-in memory across API calls — persistence requires external storage and re-injection per call",
  ],
};
