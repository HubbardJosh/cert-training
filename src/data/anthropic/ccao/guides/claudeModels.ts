import { ServiceGuide } from "../../../../types/guide";

export const claudeModelsGuide: ServiceGuide = {
  id: "ccao-claude-models",
  service: "Claude Models",
  domain: "fundamentals",
  tagline:
    "Understanding the Claude model family and how to choose the right model",
  intro:
    "Anthropic offers a family of Claude models — Fable, Opus, Sonnet, and Haiku — each optimized for different combinations of capability, speed, and cost. Choosing the right model is a foundational AI operations decision.",

  sections: [
    {
      heading: "The Claude Model Family",
      body: `Claude models are organized into four tiers: **Fable**, **Opus**, **Sonnet**, and **Haiku**. Claude Fable 5.1 sits at the top — Anthropic's most capable model, with always-on adaptive thinking and a 1M token context window, designed for the most demanding reasoning and analysis tasks. Claude Opus 5 handles complex agentic work and deep analysis, also with a 1M token context window. Claude Sonnet 5 is the balanced default for production applications that need strong reasoning at reasonable cost, with a 1M token context window. Claude Haiku 4.5 is the fastest and most compact model, optimized for tasks requiring near-instant responses at the lowest cost per token, with a 200K token context window.

Model versions use named pinned snapshot IDs without date suffixes (e.g., \`claude-fable-5-1\`, \`claude-opus-5\`, \`claude-sonnet-5\`, \`claude-haiku-4-5\`). From the Claude 4.6 generation onward, the canonical model ID is a named snapshot — the date suffix format used by older model generations (e.g., \`claude-3-5-sonnet-20241022\`) is no longer the pattern for current models. The model ID used in API calls must exactly match a published model string — there are no aliases like "latest" in production use.

The key selection axes are: **intelligence** (how well the model reasons through hard problems), **speed** (time to first token and tokens per second), and **cost** (input and output token pricing). Fable 5.1 scores highest on intelligence with always-on adaptive thinking. Haiku 4.5 inverts all three — fastest and cheapest. Sonnet 5 sits in the middle across all axes and is often the pragmatic default.`,
      quiz: [
        {
          question:
            "A team is building a customer-facing chat feature that must respond within 1 second. The queries are straightforward FAQ lookups. Which Claude model is the best fit?",
          options: [
            "claude-haiku-4-5 — fastest and lowest cost, ideal for simple high-throughput tasks",
            "claude-opus-5 — most intelligent and will give the best answers",
            "claude-sonnet-5 — best balance of speed and intelligence",
            "Any model works; latency is not affected by model choice",
          ],
          correctIndex: 0,
          explanation:
            "Haiku 4.5 is optimized for speed and cost, making it ideal for simple, high-volume, latency-sensitive tasks like FAQ lookups. Opus 5 would add unnecessary cost and latency for straightforward queries. Sonnet 5 is a reasonable middle ground but Haiku 4.5 is the most appropriate for this specific profile.",
        },
      ],
    },
    {
      heading: "Model Versioning and Stability",
      body: `Current Claude models use named pinned snapshot IDs without date suffixes — for example, \`claude-fable-5-1\`, \`claude-opus-5\`, \`claude-sonnet-5\`, and \`claude-haiku-4-5\`. From the Claude 4.6 generation onward, the date-suffix pattern (e.g., \`claude-3-5-sonnet-20241022\`) is no longer used; model IDs are named snapshots. Anthropic does not support a \`latest\` alias because production systems require stability: the same model ID must produce deterministically similar outputs over time to avoid unexpected regressions.

When Anthropic releases a newer version (e.g., \`claude-sonnet-5\` supersedes an earlier Sonnet generation), operators choose their own upgrade timing. Older model versions are deprecated on a published schedule with advance notice, typically many months. Deprecated models continue to serve requests until a final sunset date, after which they return an error. Monitoring model deprecation notices and planning migrations is a key AI operations responsibility.

Anthropic also releases **model snapshots** used in the Claude.ai products that may differ from API-available models. The API model catalog is the authoritative list of what is available for programmatic use; what appears in Claude.ai may lag or differ.`,
      quiz: [
        {
          question:
            "An operator wants to ensure their production application always uses the same Claude model behavior and never automatically upgrades. What should they do?",
          options: [
            "Pin the exact named snapshot model ID (e.g., claude-sonnet-5) in their code",
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
      body: `Model selection should follow a structured decision process rather than always reaching for the most capable model. Start by asking: what is the complexity of the reasoning required? Simple extraction, classification, summarization, and short Q&A tasks rarely need Opus. Complex multi-step reasoning, code generation involving architecture decisions, and nuanced analysis of long documents benefit from Opus or the latest Sonnet.

Next, consider **latency requirements**. Interactive user-facing features typically require responses in under two seconds. Background batch jobs, overnight report generation, and async processing pipelines have much looser latency budgets, making them candidates for Opus. Cost compounds with volume: a feature called millions of times per day at Haiku pricing is orders of magnitude cheaper than at Opus pricing.

A practical approach is to **start with Sonnet** as the default, run evaluations to measure output quality on representative inputs, and then only upgrade to Opus where quality is measurably insufficient or downgrade to Haiku where speed/cost matters and quality remains acceptable. This evaluation-driven model selection is a core AI operations practice.`,
      quiz: [
        {
          question:
            "A company runs a nightly batch job that analyzes 10,000 legal contracts, extracting key clauses and flagging unusual terms. The job takes 6 hours and cost is a concern. What guidance applies to model selection?",
          options: [
            "Use Haiku — batch jobs have loose latency budgets, so optimize for cost",
            "Always use Opus for legal work to ensure accuracy",
            "Evaluate Opus, Sonnet, and Haiku on a sample set and pick the cheapest that meets quality requirements",
            "Run Opus for flagging and Haiku for extraction in parallel",
          ],
          correctIndex: 2,
          explanation:
            "The correct approach is evaluation-driven: test all three models on a representative sample of contracts, measure quality, and choose the cheapest model that meets the quality bar. Legal complexity might warrant Sonnet or Opus, but that should be determined by evaluation rather than assumption. Haiku alone may miss nuanced legal language; always using Opus ignores cost without evidence of need.",
        },
      ],
    },
    {
      heading: "Context Windows",
      body: `The **context window** is the maximum number of tokens a model can process in a single API call — encompassing the system prompt, all conversation turns, tool results, and the generated response. Claude models have large context windows — up to 1M tokens for Fable 5.1, Opus 5, and Sonnet 5, and 200K tokens for Haiku 4.5 — enabling processing of entire books, large codebases, or long conversation histories in a single call.

Tokens are the unit of text the model processes. English text averages roughly 3–4 characters per token, so 100K tokens is approximately 75,000 words. Input tokens (what you send) and output tokens (what the model generates) are both counted and billed separately, with output tokens typically priced higher than input tokens.

Critically, the context window is a **hard ceiling**, not a recommendation. Sending more tokens than the model's context window allows will return an error. Operators must implement chunking strategies, summarization, or retrieval-augmented generation (RAG) when their data exceeds the context window. Longer context also increases latency and cost linearly — sending a 100K-token prompt costs 10x more than a 10K-token prompt.`,
      quiz: [
        {
          question:
            "A developer is building an application that sends a 180,000-token document to Claude. The model being used has a 100K context window. What will happen?",
          options: [
            "The API will return an error because the input exceeds the context window",
            "Claude will silently truncate the document to fit",
            "Claude will process only the first 100K tokens without error",
            "The request will be queued until a larger context window becomes available",
          ],
          correctIndex: 0,
          explanation:
            "Exceeding the context window returns an API error — it is a hard limit. Claude does not silently truncate input. The developer must implement chunking, summarization, or RAG to handle documents larger than the context window.",
        },
      ],
    },
    {
      heading: "Multimodal Capabilities",
      body: `Claude's vision-capable models can accept **images** alongside text in the same API request. Supported image formats include JPEG, PNG, GIF, and WebP. Images can be provided either as base64-encoded data inline in the request or as URLs pointing to publicly accessible image resources. Each image consumes tokens from the context window, with the token count depending on image dimensions.

Vision is useful for document processing (extracting data from PDFs rendered as images), visual QA, UI screenshot analysis, chart interpretation, and multimodal search. However, Claude cannot perform fine-grained pixel-level measurements, read very small text in low-resolution images reliably, or process video frames natively — these limitations should be understood when designing vision workflows.

Not all Claude models support vision — check the model's capability card in the Anthropic documentation before building a vision feature. Attempting to send images to a text-only model will return an error. When vision is required, model selection must account for this additional capability requirement.`,
      quiz: [
        {
          question:
            "A developer is building a feature that extracts structured data from scanned invoice images. Which consideration is MOST important when selecting a Claude model for this task?",
          options: [
            "The selected model must support vision (image input) capabilities",
            "Always use Opus for document processing tasks",
            "Images must be converted to text via OCR before sending to Claude",
            "Claude cannot process images — use a dedicated OCR service instead",
          ],
          correctIndex: 0,
          explanation:
            "The most important consideration is ensuring the selected model supports vision. Not all Claude models accept image inputs. Claude can process images directly without a separate OCR step, though pre-processing can sometimes improve results for very low-quality scans. Model selection must account for vision capability as a hard requirement.",
        },
      ],
    },
  ],

  keyFacts: [
    "Four model tiers: Fable 5.1 (most capable, always-on adaptive thinking), Opus 5 (complex agentic work), Sonnet 5 (balanced default), Haiku 4.5 (fastest/cheapest)",
    "Fable 5.1, Opus 5, and Sonnet 5 support up to 1M token context windows; Haiku 4.5 supports 200K tokens",
    "Current model IDs are named pinned snapshots without date suffixes: claude-fable-5-1, claude-opus-5, claude-sonnet-5, claude-haiku-4-5",
    "From the Claude 4.6 generation onward, date-suffixed IDs (e.g., claude-3-5-sonnet-20241022) are no longer the pattern — named snapshots are canonical",
    "No 'latest' alias exists for production use — pin the exact named snapshot ID",
    "Input and output tokens are billed separately; output tokens cost more",
    "Vision (image input) is supported on select models — check capability before building",
    "Model deprecation follows a published schedule with advance notice",
    "Start with Sonnet 5 as default; evaluate before upgrading to Opus 5/Fable 5.1 or downgrading to Haiku 4.5",
    "Exceeding the context window returns a hard API error — Claude does not truncate silently",
  ],

  relatedServices: [
    "Messages API",
    "Prompt Engineering",
    "Token Counting",
    "Anthropic Console",
  ],

  examTips: [
    "Know all four tiers: Fable 5.1 (top capability + adaptive thinking), Opus 5 (complex agentic), Sonnet 5 (balanced default), Haiku 4.5 (fastest/cheapest)",
    "Current model IDs are named snapshots without date suffixes — e.g., claude-haiku-4-5, not claude-3-haiku-20240307",
    "Context window: 1M tokens for Fable 5.1 / Opus 5 / Sonnet 5; 200K for Haiku 4.5",
    "Context window overflow causes an API error, not silent truncation",
    "Vision capability is model-specific — not all Claude models accept images",
    "Evaluation-driven model selection (not assumption) is the recommended practice",
  ],
};
