import { ServiceGuide } from "../../../types/guide";

export const claudeModelsGuide: ServiceGuide = {
  id: "ccao-claude-models",
  service: "Claude Models",
  domain: "fundamentals",
  tagline:
    "Understanding the Claude model family and how to choose the right model",
  intro:
    "Anthropic offers a family of Claude models — Opus, Sonnet, and Haiku — each optimized for different combinations of capability, speed, and cost. Choosing the right model is a foundational AI operations decision.",

  sections: [
    {
      heading: "The Claude Model Family",
      body: `Claude models are organized into three tiers: **Opus**, **Sonnet**, and **Haiku**. Opus is Anthropic's most capable model, designed for complex reasoning, nuanced analysis, and tasks where output quality is the top priority regardless of cost or latency. Sonnet balances intelligence and speed, making it the most popular choice for production applications that need strong reasoning without the cost of Opus. Haiku is the fastest and most compact model in the family, optimized for tasks requiring near-instant responses at the lowest cost per token.

Model versions are identified by a version number appended to the family name (e.g., \`claude-3-5-sonnet-20241022\`, \`claude-3-opus-20240229\`). When Anthropic releases a new version within a family, the older version remains available under its full versioned ID, giving operators full control over when to upgrade. The model ID used in API calls must exactly match a published model string — there are no aliases like "latest" in production use.

The key selection axes are: **intelligence** (how well the model reasons through hard problems), **speed** (time to first token and tokens per second), and **cost** (input and output token pricing). Opus scores highest on intelligence but lowest on speed and highest on cost. Haiku inverts all three. Sonnet sits in the middle across all axes and is often the pragmatic default.`,
      quiz: [
        {
          question:
            "A team is building a customer-facing chat feature that must respond within 1 second. The queries are straightforward FAQ lookups. Which Claude model is the best fit?",
          options: [
            "claude-3-haiku — fastest and lowest cost, ideal for simple high-throughput tasks",
            "claude-3-opus — most intelligent and will give the best answers",
            "claude-3-sonnet — best balance of speed and intelligence",
            "Any model works; latency is not affected by model choice",
          ],
          correctIndex: 0,
          explanation:
            "Haiku is optimized for speed and cost, making it ideal for simple, high-volume, latency-sensitive tasks like FAQ lookups. Opus would add unnecessary cost and latency for straightforward queries. Sonnet is a reasonable middle ground but Haiku is the most appropriate for this specific profile.",
        },
      ],
    },
    {
      heading: "Model Versioning and Stability",
      body: `Every Claude model is identified by a precise version string such as \`claude-3-5-sonnet-20241022\`. The date suffix is not a suggestion — it is part of the canonical model ID and must be used verbatim in API calls. Anthropic does not support a \`latest\` alias because production systems require stability: the same model ID must produce deterministically similar outputs over time to avoid unexpected regressions.

When Anthropic releases a newer version (e.g., \`claude-3-5-sonnet-20241022\` supersedes \`claude-3-sonnet-20240229\`), operators choose their own upgrade timing. Older model versions are deprecated on a published schedule with advance notice, typically many months. Deprecated models continue to serve requests until a final sunset date, after which they return an error. Monitoring model deprecation notices and planning migrations is a key AI operations responsibility.

Anthropic also releases **model snapshots** used in the Claude.ai products that may differ from API-available models. The API model catalog is the authoritative list of what is available for programmatic use; what appears in Claude.ai may lag or differ.`,
      quiz: [
        {
          question:
            "An operator wants to ensure their production application always uses the same Claude model behavior and never automatically upgrades. What should they do?",
          options: [
            "Pin the exact versioned model ID (e.g., claude-3-5-sonnet-20241022) in their code",
            "Use a 'latest' alias so Anthropic automatically serves the best model",
            "Use the family name without a version suffix",
            "Subscribe to Anthropic's auto-upgrade program",
          ],
          correctIndex: 0,
          explanation:
            "Pinning the exact versioned model ID is the correct approach for production stability. Anthropic does not offer a 'latest' alias precisely because operators need stability. Using the family name without a version suffix is not valid — the API requires the full versioned ID.",
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
      body: `The **context window** is the maximum number of tokens a model can process in a single API call — encompassing the system prompt, all conversation turns, tool results, and the generated response. Claude models have large context windows (up to 200K tokens for some versions), enabling processing of entire books, large codebases, or long conversation histories in a single call.

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
    "Three model tiers: Opus (most capable), Sonnet (balanced), Haiku (fastest/cheapest)",
    "Model IDs are versioned strings — no 'latest' alias exists for production use",
    "Context windows range up to 200K tokens depending on model version",
    "Input and output tokens are billed separately; output tokens cost more",
    "Vision (image input) is supported on select models — check capability before building",
    "Model deprecation follows a published schedule with advance notice",
    "Start with Sonnet as default; evaluate before upgrading to Opus or downgrading to Haiku",
    "Exceeding the context window returns a hard API error — Claude does not truncate silently",
  ],

  relatedServices: [
    "Messages API",
    "Prompt Engineering",
    "Token Counting",
    "Anthropic Console",
  ],

  examTips: [
    "Know which tier to recommend for a given latency/cost/quality scenario",
    "Understand that model IDs must be exact versioned strings — 'latest' is not valid",
    "Context window overflow causes an API error, not silent truncation",
    "Vision capability is model-specific — not all Claude models accept images",
    "Evaluation-driven model selection (not assumption) is the recommended practice",
  ],
};
