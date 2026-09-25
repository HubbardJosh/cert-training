import { ServiceGuide } from "../../../../types/guide";

// Sources (verified 2026-09-25):
// - https://platform.claude.com/docs/en/about-claude/models/overview
// - https://platform.claude.com/docs/en/about-claude/pricing
// - https://platform.claude.com/docs/en/about-claude/model-deprecations
// Correction applied: prior version listed "Opus 5" as current; Opus 5.5 shipped
// 2026-09-22 and is now the current Opus tier. Mythos 5.1 (limited-access,
// Project Glasswing) added. Vision now supported on all current models
// (previously described as model-specific).

export const claudeModelsGuide: ServiceGuide = {
  id: "ccao-claude-models",
  service: "Claude Models",
  domain: "fundamentals",
  tagline:
    "Understanding the Claude model family and how to choose the right model",
  intro:
    "Anthropic offers a family of Claude models — Fable, Opus, Sonnet, and Haiku (with a limited-access Mythos tier) — each optimized for different combinations of capability, speed, and cost. Choosing the right model is a foundational AI operations decision.",

  sections: [
    {
      heading: "The Claude Model Family",
      body: `Claude models are organized into named tiers. As of September 2026, the current lineup is **Fable 5.1**, **Opus 5.5**, **Sonnet 5**, and **Haiku 4.5**, with a limited-access **Mythos 5.1** tier available through Project Glasswing. Claude Fable 5.1 is Anthropic's top offering for demanding reasoning and long-horizon agentic work, with adaptive thinking always on and a 1M token context window. Claude Opus 5.5 (released 2026-09-22) is the current Opus tier for long-running agentic coding and knowledge work, also with adaptive thinking always on and a 1M token context window. Claude Sonnet 5 is the balanced default for production applications, with a 1M token context window and adaptive thinking (not always on). Claude Haiku 4.5 is the fastest and most compact model at the lowest cost per token, with a 200K token context window and extended (manual) thinking rather than adaptive.

Model IDs are pinned snapshots. From the Claude 4.6 generation onward, Fable, Opus, and Sonnet use dateless named IDs that are themselves the pinned snapshot (e.g., \`claude-fable-5-1\`, \`claude-opus-5-5\`, \`claude-sonnet-5\`). Haiku 4.5's pinned snapshot is \`claude-haiku-4-5-20251001\`; the alias \`claude-haiku-4-5\` also works. The older date-suffix pattern (e.g., \`claude-3-5-sonnet-20241022\`) is not used for current models. Anthropic does not offer a "latest" alias — production systems require stable, pinned IDs.

The key selection axes are: **intelligence** (how well the model reasons through hard problems), **speed** (time to first token and tokens per second), and **cost** (input and output token pricing). Fable 5.1 scores highest on intelligence with always-on adaptive thinking. Haiku 4.5 inverts all three — fastest and cheapest. Sonnet 5 sits in the middle across all axes and is often the pragmatic default. Legacy models (Fable 5, Opus 5, Opus 4.8, Opus 4.7, Opus 4.6, Opus 4.5, Sonnet 4.6, Sonnet 4.5) remain available but should not be chosen for new work.`,
      quiz: [
        {
          question:
            "A team is building a customer-facing chat feature that must respond within 1 second. The queries are straightforward FAQ lookups. Which Claude model is the best fit?",
          options: [
            "claude-haiku-4-5 — fastest and lowest cost, ideal for simple high-throughput tasks",
            "claude-opus-5-5 — most intelligent Opus tier and will give the best answers",
            "claude-sonnet-5 — best balance of speed and intelligence",
            "Any model works; latency is not affected by model choice",
          ],
          correctIndex: 0,
          explanation:
            "Haiku 4.5 is optimized for speed and cost, making it ideal for simple, high-volume, latency-sensitive tasks like FAQ lookups. Opus 5.5 would add unnecessary cost and latency for straightforward queries. Sonnet 5 is a reasonable middle ground but Haiku 4.5 is the most appropriate for this specific profile.",
        },
      ],
    },
    {
      heading: "Model Versioning and Stability",
      body: `Current Claude models use named pinned snapshot IDs — for example, \`claude-fable-5-1\`, \`claude-opus-5-5\`, \`claude-sonnet-5\`. From the Claude 4.6 generation onward, the date-suffix pattern (e.g., \`claude-3-5-sonnet-20241022\`) is no longer used for Fable, Opus, and Sonnet; their model IDs are dateless named snapshots and are themselves pinned. Haiku 4.5 has a dated pinned snapshot ID (\`claude-haiku-4-5-20251001\`); the dateless alias \`claude-haiku-4-5\` also works. Anthropic does not support a \`latest\` alias because production systems require stability: the same model ID must produce deterministically similar outputs over time to avoid unexpected regressions.

When Anthropic releases a newer version (e.g., \`claude-opus-5-5\` supersedes \`claude-opus-5\`), operators choose their own upgrade timing. Older model versions are deprecated on a published schedule with advance notice — for example, Claude Opus 5.5 has a retirement date not sooner than September 22, 2027, and Sonnet 5 not sooner than June 30, 2027. Deprecated models continue to serve requests until a final sunset date, after which they return an error. Monitoring model deprecation notices and planning migrations is a key AI operations responsibility.

Anthropic also releases model snapshots used in the Claude.ai products that may differ from API-available models. The API model catalog is the authoritative list of what is available for programmatic use; what appears in Claude.ai may lag or differ. Retired models may still be available on partner cloud platforms (Amazon Bedrock, Google Cloud) with independent lifecycle dates set by those providers.`,
      quiz: [
        {
          question:
            "An operator wants to ensure their production application always uses the same Claude model behavior and never automatically upgrades. What should they do?",
          options: [
            "Pin the exact named snapshot model ID (e.g., claude-opus-5-5) in their code",
            "Use a 'latest' alias so Anthropic automatically serves the best model",
            "Use the model family name without a snapshot identifier",
            "Subscribe to Anthropic's auto-upgrade program",
          ],
          correctIndex: 0,
          explanation:
            "Pinning the exact named snapshot model ID is the correct approach for production stability. Anthropic does not offer a 'latest' alias precisely because operators need stability. Using only the model family name without a snapshot identifier is not valid — the API requires the full model ID string.",
        },
      ],
    },
    {
      heading: "Selecting a Model for a Use Case",
      body: `Model selection should follow a structured decision process rather than always reaching for the most capable model. Start by asking: what is the complexity of the reasoning required? Simple extraction, classification, summarization, and short Q&A tasks rarely need Opus 5.5 or Fable 5.1. Complex multi-step reasoning, code generation involving architecture decisions, long-horizon agentic work, and nuanced analysis of long documents benefit from Opus 5.5 or Fable 5.1.

Next, consider **latency requirements**. Interactive user-facing features typically require responses in under two seconds. Background batch jobs, overnight report generation, and async processing pipelines have much looser latency budgets, making them candidates for Opus 5.5 or Fable 5.1. Cost compounds with volume: a feature called millions of times per day at Haiku pricing ($1/$5 per MTok input/output) is orders of magnitude cheaper than at Fable pricing ($10/$50 per MTok).

A practical approach is to **start with Opus 5.5** for most workloads (per Anthropic's current guidance), or Sonnet 5 when cost is a bigger constraint. Run evaluations to measure output quality on representative inputs, and then only upgrade to Fable 5.1 where quality is measurably insufficient (or when your evals on Opus 5.5 at higher effort still fall short), or downgrade to Haiku 4.5 where speed/cost matters and quality remains acceptable. This evaluation-driven model selection is a core AI operations practice.`,
      quiz: [
        {
          question:
            "A company runs a nightly batch job that analyzes 10,000 legal contracts, extracting key clauses and flagging unusual terms. The job takes 6 hours and cost is a concern. What guidance applies to model selection?",
          options: [
            "Use Haiku — batch jobs have loose latency budgets, so optimize for cost",
            "Always use Fable 5.1 for legal work to ensure accuracy",
            "Evaluate Opus 5.5, Sonnet 5, and Haiku 4.5 on a sample set (also consider the Batch API's 50% discount) and pick the cheapest that meets quality requirements",
            "Run Opus 5.5 for flagging and Haiku 4.5 for extraction in parallel without any evaluation",
          ],
          correctIndex: 2,
          explanation:
            "The correct approach is evaluation-driven: test models on a representative sample of contracts, measure quality, and choose the cheapest model that meets the quality bar. The Batch API is a natural fit for nightly jobs and applies a 50% discount on both input and output tokens. Legal complexity might warrant Sonnet 5 or Opus 5.5, but that should be determined by evaluation rather than assumption.",
        },
      ],
    },
    {
      heading: "Context Windows",
      body: `The **context window** is the maximum number of tokens a model can process in a single API call — encompassing the system prompt, all conversation turns, tool results, and the generated response. Claude models have large context windows — up to **1M tokens** for Fable 5.1, Opus 5.5, and Sonnet 5, and **200K tokens** for Haiku 4.5 — enabling processing of entire books, large codebases, or long conversation histories in a single call. On Claude 4.6 and later models, the full 1M-token context window is priced at the standard per-token rate (a 900K-token request is billed at the same per-token rate as a 9K-token request).

**Maximum output** (synchronous Messages API) is 128K tokens for Fable 5.1, Opus 5.5, and Sonnet 5, and 64K tokens for Haiku 4.5. The Message Batches API supports up to 300K output tokens on Opus 5.5, Opus 5, Sonnet 5, and several earlier models with the \`output-300k-2026-03-24\` beta header.

Tokens are the unit of text the model processes. On the tokenizer introduced with Claude Opus 4.7, 1M tokens is roughly 555K words or 2.5M Unicode characters; the newer tokenizer produces approximately 30% more tokens for the same text than the previous one used by Sonnet 4.6 and earlier. Input tokens (what you send) and output tokens (what the model generates) are both counted and billed separately, with output tokens typically priced 5x higher than input tokens.

Critically, the context window is a **hard ceiling**, not a recommendation. Sending more tokens than the model's context window allows will return an error. Operators must implement chunking strategies, summarization, or retrieval-augmented generation (RAG) when their data exceeds the context window. Longer context also increases latency and cost linearly.`,
      quiz: [
        {
          question:
            "A developer is building an application that sends a 250,000-token document to Claude Haiku 4.5, which has a 200K context window. What will happen?",
          options: [
            "The API will return an error because the input exceeds the context window",
            "Claude will silently truncate the document to fit",
            "Claude will process only the first 200K tokens without error",
            "The request will be queued until a larger context window becomes available",
          ],
          correctIndex: 0,
          explanation:
            "Exceeding the context window returns an API error — it is a hard limit. Claude does not silently truncate input. The developer must implement chunking, summarization, or RAG — or switch to a 1M-context model (Fable 5.1, Opus 5.5, or Sonnet 5) — to handle documents larger than the context window.",
        },
      ],
    },
    {
      heading: "Multimodal Capabilities",
      body: `All current Claude models (Fable 5.1, Opus 5.5, Sonnet 5, and Haiku 4.5) support **text and image input, text output, multilingual capabilities, vision, and tool use** per the current models overview. Images can be provided either as base64-encoded data inline in the request or as URLs pointing to publicly accessible image resources. Supported image formats include JPEG, PNG, GIF, and WebP. Each image consumes tokens from the context window, with the token count depending on image dimensions.

Vision is useful for document processing (extracting data from PDFs rendered as images), visual QA, UI screenshot analysis, chart interpretation, and multimodal search. However, Claude cannot perform fine-grained pixel-level measurements, read very small text in low-resolution images reliably, or process video frames natively — these limitations should be understood when designing vision workflows.

Note that some **legacy** and retired models may not support vision — always check the model's capability card in the Anthropic documentation, or query the Models API's \`capabilities\` object programmatically, before assuming a legacy model can accept images. Attempting to send images to a text-only model will return an error.`,
      quiz: [
        {
          question:
            "A developer is building a feature that extracts structured data from scanned invoice images and is choosing among current Claude models. Which statement is TRUE?",
          options: [
            "All current Claude models (Fable 5.1, Opus 5.5, Sonnet 5, Haiku 4.5) support vision, so the choice can be made on cost/latency/quality tradeoffs",
            "Only Opus tier models support vision",
            "Images must be converted to text via OCR before sending to Claude",
            "Claude cannot process images — use a dedicated OCR service instead",
          ],
          correctIndex: 0,
          explanation:
            "All current Claude models support vision per the Anthropic models overview. Model selection for a vision task should be driven by cost, latency, and quality on evaluations rather than by which model can accept images. Claude can process images directly without a separate OCR step.",
        },
      ],
    },
  ],

  keyFacts: [
    "Current tiers (2026-09): Fable 5.1 (top capability, adaptive thinking always on), Opus 5.5 (current Opus, released 2026-09-22, adaptive thinking always on), Sonnet 5 (balanced default, adaptive thinking), Haiku 4.5 (fastest/cheapest, extended thinking — not adaptive)",
    "Fable 5.1, Opus 5.5, and Sonnet 5 have 1M token context windows; Haiku 4.5 has 200K tokens",
    "Max output (sync Messages API): 128K for Fable/Opus/Sonnet, 64K for Haiku; Batch API supports 300K output on Opus 5.5, Opus 5, Sonnet 5 (+beta header)",
    "Model IDs: claude-fable-5-1, claude-opus-5-5, claude-sonnet-5 (dateless snapshots); claude-haiku-4-5 aliases claude-haiku-4-5-20251001",
    "From Claude 4.6 onward, date-suffixed IDs (e.g., claude-3-5-sonnet-20241022) are no longer the pattern — named snapshots are canonical",
    "No 'latest' alias exists — pin the exact named snapshot ID",
    "Pricing per MTok (input/output): Fable 5.1 $10/$50, Opus 5.5 $4/$20, Sonnet 5 $2/$10, Haiku 4.5 $1/$5",
    "All current models support vision, tool use, and multilingual text — check legacy models via Models API before assuming",
    "Batch API applies a 50% discount on both input and output tokens",
    "Full 1M context window is priced at standard per-token rates on 4.6+ models",
    "Mythos 5.1 is a limited-access tier via Project Glasswing (invitation only)",
    "Exceeding the context window returns a hard API error — Claude does not truncate silently",
  ],

  relatedServices: [
    "Messages API",
    "Prompt Engineering",
    "Token Counting",
    "Anthropic Console",
    "Batch API",
  ],

  examTips: [
    "Know all four current tiers and their IDs: Fable 5.1, Opus 5.5, Sonnet 5, Haiku 4.5 — Opus 5 is now legacy",
    "Fable 5.1 and Opus 5.5 have adaptive thinking always on; Sonnet 5 has adaptive; Haiku 4.5 uses extended (manual) thinking",
    "Fable/Opus/Sonnet use dateless snapshot IDs; Haiku 4.5's pinned snapshot is claude-haiku-4-5-20251001 (claude-haiku-4-5 is the alias)",
    "Context window: 1M tokens for Fable 5.1 / Opus 5.5 / Sonnet 5; 200K for Haiku 4.5",
    "Context window overflow causes an API error, not silent truncation",
    "All current Claude models support vision — model-specific gating only applies to legacy models",
    "Evaluation-driven model selection (not assumption) is the recommended practice; start with Opus 5.5 for most workloads per current Anthropic guidance",
  ],
};
