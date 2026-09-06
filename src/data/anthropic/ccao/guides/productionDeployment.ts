import { ServiceGuide } from "../../../../types/guide";

export const productionDeploymentGuide: ServiceGuide = {
  id: "ccao-production-deployment",
  service: "Production Deployment",
  domain: "deployment",
  tagline:
    "Patterns and best practices for deploying Claude-powered applications at scale",
  intro:
    "Deploying Claude in production requires architectural decisions around API integration, latency management, cost control, reliability, and observability. AI operations differs from traditional software ops in key ways that operators must understand.",

  sections: [
    {
      heading: "API Architecture Patterns",
      body: `Claude should always be accessed via a **server-side proxy**, never directly from client-side code (browsers, mobile apps). Exposing an Anthropic API key in client code is a critical security vulnerability — keys can be extracted from client bundles, used to make unauthorized API calls, and rack up large bills before detection. The standard architecture is: client → your server → Anthropic API, with the API key stored only on your server as an environment variable or secret.

Your server layer provides additional benefits beyond key security: it can implement **request validation** (reject malformed inputs before they reach Anthropic), **rate limiting** (prevent individual users from exhausting your quota), **caching** (serve repeated identical queries from cache without an API call), **logging** (capture all inputs and outputs for debugging and compliance), and **cost attribution** (track which users or features consume the most tokens).

For applications serving many users simultaneously, consider the **fan-out problem**: if 1,000 users simultaneously submit requests during a peak event, your server must handle 1,000 concurrent Anthropic API calls. Plan capacity and rate limits for realistic peak scenarios. Anthropic provides per-key rate limits that define the maximum requests per minute and tokens per minute your integration can sustain.`,
      quiz: [
        {
          question:
            "Why should Claude API calls always be made from a server, not directly from a browser-based client?",
          options: [
            "The API key would be exposed in client code and could be extracted and misused",
            "The Messages API is too slow for real-time browser interactions",
            "Claude only accepts requests from server IP addresses",
            "Browser CORS policies block direct calls to Anthropic's API",
          ],
          correctIndex: 0,
          explanation:
            "The primary reason is API key security. Keys embedded in browser code can be extracted from JavaScript bundles by anyone who inspects the page, enabling unauthorized use and potentially large unauthorized charges. The latency, CORS, and IP concerns are secondary or incorrect — the fundamental architectural requirement is keeping the API key server-side.",
        },
      ],
    },
    {
      heading: "Latency Management",
      body: `LLM latency has two components: **time to first token (TTFT)** — how long before the first character appears — and **total response time** — how long until generation is complete. For interactive user-facing features, TTFT is the most important metric: streaming allows you to start displaying content as soon as the first token arrives, making responses feel much faster even if total generation time is similar.

Strategies to reduce latency include: **streaming** (reduces perceived TTFT dramatically), **model selection** (Haiku is significantly faster than Opus — use the fastest model that meets quality requirements), **prompt caching** (cached prompts skip input processing, reducing TTFT for requests with large repeated system prompts), **shorter prompts** (input processing time scales with prompt length), and **reducing max_tokens** (Claude stops as soon as it finishes, but if max_tokens is set very high it doesn't add latency — however, shorter expected outputs with low max_tokens can guide Claude to be concise).

For latency-critical paths, pre-compute wherever possible. If Claude is used to generate a product description that rarely changes, cache the result and serve from cache. LLM inference is an expensive, slow operation — reserve it for tasks where real-time generation is genuinely required.`,
      quiz: [
        {
          question:
            "A user-facing Claude chat feature has high perceived latency — users see a spinner for 3 seconds before any text appears. What is the MOST effective single change to improve perceived responsiveness?",
          options: [
            "Enable streaming so text begins appearing immediately as Claude generates it",
            "Switch from Sonnet to Opus for faster generation",
            "Reduce max_tokens from 1024 to 256",
            "Move API calls to a geographically closer server",
          ],
          correctIndex: 0,
          explanation:
            "Streaming is the most impactful single change for perceived latency in interactive chat. It allows the first tokens to appear within milliseconds of generation starting rather than waiting for the complete response. Switching from Sonnet to Opus would make things slower, not faster — Opus is the most capable but slowest model. Reducing max_tokens affects maximum output length but doesn't change TTFT. Geographic proximity has marginal impact compared to streaming.",
        },
      ],
    },
    {
      heading: "Cost Management",
      body: `Claude API costs are driven by **input tokens** and **output tokens**. Input includes the system prompt, conversation history, and user message. Output is the generated response. Output tokens are priced higher than input tokens per unit. Total cost = (input tokens × input price) + (output tokens × output price).

The levers for cost control are: **model selection** (Haiku 4.5 is significantly cheaper than Opus 5 — approximately 5x cheaper, and approximately 10x cheaper than Fable 5.1 at list pricing), **prompt caching** (reduces the cost of repeated large system prompts by ~90%), **max_tokens** (setting a lower cap reduces runaway output costs — a max_tokens of 256 prevents Claude from writing a 2,000-token essay when 100 words would do), **context management** (trimming conversation history reduces input tokens per turn), and **caching at application layer** (cache identical or near-identical queries to avoid redundant API calls entirely).

Track cost per feature, per user, and per request type using the \`usage\` field in every API response. Establish cost budgets and alerts. Token costs compound at scale: a feature used 1 million times per day that costs $0.001 per call costs $1,000/day or $365,000/year — model selection and prompt optimization at that scale have enormous financial impact.`,
      quiz: [
        {
          question:
            "A high-volume application currently uses Claude Opus for all requests and the monthly API bill is $80,000. The team evaluates quality and finds Haiku meets their quality bar for 70% of requests. What is the MOST impactful cost reduction strategy?",
          options: [
            "Route 70% of requests to Haiku and keep the remaining 30% on Opus, reducing overall cost significantly",
            "Enable streaming on all requests to reduce token usage",
            "Reduce max_tokens from 1024 to 512 across all requests",
            "Enable prompt caching on the system prompt",
          ],
          correctIndex: 0,
          explanation:
            "Routing to Haiku 4.5 where quality allows is the most impactful change — Haiku 4.5 is approximately 5x cheaper than Opus 5 at list pricing. 70% of requests moving to Haiku 4.5 would dramatically cut the bill. Streaming does not affect token usage or cost. Reducing max_tokens by half saves output tokens on long responses but has no impact when responses are short. Prompt caching is valuable but produces at most ~10-20% savings on input tokens for a large system prompt — not comparable to a model switch for 70% of volume.",
        },
      ],
    },
    {
      heading: "Reliability and Error Handling",
      body: `Production Claude integrations must handle API errors gracefully. The main error categories and their correct responses: **429 (rate limited)** → exponential backoff with jitter and retry; **529 (overloaded)** → same as 429 — back off and retry; **500/503 (server error)** → retry with backoff, escalate if persistent; **400 (bad request)** → do not retry, fix the request (invalid model, malformed messages, exceeded context window); **401/403 (auth error)** → do not retry, fix the API key or permissions.

Design for **graceful degradation**: if the Claude API is unavailable, what does the user experience? In critical user-facing applications, have a fallback — a cached response, a simpler rule-based system, or a clear error message explaining the AI feature is temporarily unavailable. Never let an Anthropic API error result in an unhandled exception that crashes the application.

Implement **timeouts** on all API calls. Very large context window requests or complex reasoning tasks can take 30–60 seconds. Without a timeout, slow requests block resources indefinitely. Set a timeout appropriate to your latency SLA, handle the timeout gracefully, and log it for monitoring. Consider using streaming for long-running requests so users see progress and the connection stays active.`,
      quiz: [
        {
          question:
            "A production application receives a 400 error from the Anthropic API. What is the correct response?",
          options: [
            "Do not retry — investigate and fix the malformed request (invalid model ID, missing fields, exceeded context window)",
            "Implement exponential backoff and retry up to 3 times",
            "Switch to a different model and retry immediately",
            "Route the request to a fallback API provider",
          ],
          correctIndex: 0,
          explanation:
            "A 400 error indicates a client-side problem with the request — invalid model ID, missing required fields, malformed messages array, or context window exceeded. Retrying the same malformed request will always fail. The correct response is to log the error, investigate the request structure, and fix the bug before retrying. Exponential backoff is for 429/529 errors (rate limits and overload), not client errors.",
        },
      ],
    },
    {
      heading: "Observability and Monitoring",
      body: `AI applications require a specialized observability stack beyond traditional application monitoring. Standard metrics to track: **request count** (volume by model, feature, and user segment), **token usage** (input and output tokens per request and in aggregate), **latency** (p50/p95/p99 TTFT and total response time), **error rates** (by error code), **cost** (daily and monthly, by feature and model), and **cache hit rate** if using prompt caching.

**LLM-specific observability** requires logging prompts and responses (with PII scrubbing and appropriate retention policies), tracking output quality metrics (user thumbs up/down, downstream task success rates, human review outcomes), and monitoring for **distribution shift** — when the distribution of user inputs changes in ways that might degrade Claude's outputs even if error rates remain low.

Tools in the LLM observability ecosystem include Anthropic's own usage dashboard in the Console (aggregate API usage), and third-party platforms like LangSmith, Helicone, Arize, and others that provide prompt tracing, evaluation tracking, and production monitoring. At minimum, every production Claude integration should log the request ID, model used, input/output token counts, latency, and any errors — even if using only basic logging infrastructure.`,
      quiz: [
        {
          question:
            "Which metric is MOST unique to LLM production monitoring compared to traditional software monitoring?",
          options: [
            "Output quality metrics such as user ratings, human review outcomes, and downstream task success",
            "Request latency (p95 response time)",
            "Error rate by HTTP status code",
            "Daily active users and request volume",
          ],
          correctIndex: 0,
          explanation:
            "Output quality metrics are specific to LLM monitoring — traditional applications don't have 'response quality' as a measurable production metric. Latency, error rates, and usage volume are all standard software metrics that apply to any API. LLM monitoring adds the unique challenge of evaluating whether the generated content is accurate, appropriate, and useful — which requires user feedback, human review, or automated evaluation pipelines.",
        },
      ],
    },
  ],

  keyFacts: [
    "Always proxy API calls through a server — never expose the API key client-side",
    "Streaming dramatically improves perceived latency by delivering tokens incrementally",
    "Cost drivers: input tokens, output tokens (priced higher), model tier, and request volume",
    "Haiku 4.5 is ~5x cheaper than Opus 5 and ~10x cheaper than Fable 5.1 at list pricing — model selection is the biggest cost lever",
    "400 errors = fix the request, do not retry; 429/529 = exponential backoff and retry",
    "Always set request timeouts — long reasoning tasks can take 30-60 seconds",
    "Track usage field in every response for per-request cost attribution",
    "LLM observability adds output quality monitoring to standard infra metrics",
    "Graceful degradation: have a fallback for when the Claude API is unavailable",
    "Prompt caching reduces repeated large system prompt cost by ~90%",
  ],

  relatedServices: [
    "Messages API",
    "Claude Models",
    "Prompt Engineering",
    "Safety and Responsible AI",
    "Anthropic Console",
  ],

  examTips: [
    "Never client-side API calls — always server-side proxy",
    "Streaming = the fix for high perceived latency in interactive features",
    "400 = don't retry; 429/529 = exponential backoff with jitter",
    "Model selection is the biggest cost lever — Haiku 4.5 vs Opus 5 is ~5x price difference; Haiku 4.5 vs Fable 5.1 is ~10x",
    "LLM monitoring adds output quality metrics beyond standard infra metrics",
    "Always implement timeouts on API calls — long requests can block indefinitely without them",
  ],
};
