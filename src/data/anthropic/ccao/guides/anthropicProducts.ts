import { ServiceGuide } from "../../../../types/guide";

export const anthropicProductsGuide: ServiceGuide = {
  id: "ccao-anthropic-products",
  service: "Anthropic Products and Ecosystem",
  domain: "services",
  tagline:
    "Understanding Anthropic's product portfolio, tools, and developer resources",
  intro:
    "Anthropic offers a suite of products and tools beyond the core Messages API — including Claude.ai for end users, the Anthropic Console for developers, the Workbench for prompt testing, and SDKs for multiple programming languages.",

  sections: [
    {
      heading: "Claude.ai and API Access",
      body: `**Claude.ai** is Anthropic's consumer and business web interface for interacting with Claude directly, without writing code. It provides access to Claude for end users, knowledge workers, and teams through subscription plans (Free, Pro, Team, Enterprise). Claude.ai is separate from API access — using Claude.ai does not provide programmatic API access, and an API key does not grant Claude.ai access.

The **Anthropic API** is accessed via api.anthropic.com and requires an API key obtained through console.anthropic.com. API keys are distinct from Claude.ai accounts. Organizations typically have both: business users access Claude through Claude.ai with a Team or Enterprise plan, while engineering teams use API keys to build integrations and products. The two access paths are billed and managed separately.

**Claude for Enterprise** (available through Claude.ai Enterprise) adds features like SSO/SAML integration, centralized admin controls, enhanced privacy (no training on Enterprise data by default), custom retention policies, and usage analytics for enterprise governance. Enterprise features are distinct from API usage — they are specific to Claude.ai deployments.`,
      quiz: [
        {
          question:
            "A company wants to allow 500 employees to use Claude for daily work tasks through a web interface, with centralized admin controls and SSO. What is the appropriate Anthropic product?",
          options: [
            "Claude.ai Enterprise — provides the web interface, SSO, admin controls, and appropriate scale",
            "Anthropic API with a high rate limit tier — programmatic access scales to any number of users",
            "Claude.ai Pro — provides advanced Claude capabilities for professional use",
            "Claude.ai Team plan combined with individual API keys for each employee",
          ],
          correctIndex: 0,
          explanation:
            "Claude.ai Enterprise is the right product for large-scale employee access with SSO and centralized admin controls. It provides a managed web interface with enterprise governance features. The API is for programmatic integrations, not end-user web access. Pro is for individual users. Team plan is for smaller groups without enterprise governance requirements.",
        },
      ],
    },
    {
      heading: "Anthropic Console and Workbench",
      body: `The **Anthropic Console** (console.anthropic.com) is the developer dashboard for managing API access. From the Console, developers can: create and manage API keys, view API usage and token consumption, set spending limits, monitor rate limit status, access billing and invoicing, and view model deprecation notices. Every API-using team should have a designated Console administrator responsible for key management and usage monitoring.

The **Workbench** (accessible within the Console) is an interactive prompt testing environment. Developers can craft system prompts, test user messages, compare model outputs across Claude versions and tiers, adjust parameters (temperature, max_tokens, stop sequences), and iterate on prompts without writing any code. The Workbench is the standard starting point for prompt development before embedding prompts in application code.

The Console also provides access to **usage metrics** — daily token consumption by model, API key, and time range. These metrics inform cost forecasting, budget allocation, and capacity planning. The Console does not provide per-request logs (those must be implemented in your own application infrastructure), but it gives aggregate visibility into API consumption patterns.`,
      quiz: [
        {
          question:
            "A developer wants to experiment with a new system prompt before integrating it into the codebase. What Anthropic tool is designed for this?",
          options: [
            "The Workbench in the Anthropic Console — an interactive prompt testing environment requiring no code",
            "Claude.ai — the web interface supports custom system prompts for testing",
            "The Anthropic API directly via curl commands in the terminal",
            "The model playground in the Anthropic documentation site",
          ],
          correctIndex: 0,
          explanation:
            "The Workbench is specifically designed for interactive prompt iteration without writing code. It allows testing system prompts, comparing models, adjusting parameters, and reviewing outputs in a structured interface. Claude.ai does not support custom system prompt injection by developers. While curl works, it lacks the structured comparison and parameter controls the Workbench provides. The documentation site has examples but not an interactive playground with API access.",
        },
      ],
    },
    {
      heading: "Anthropic SDKs",
      body: `Anthropic provides official SDKs for **Python** and **TypeScript/JavaScript**, available as \`anthropic\` on PyPI and \`@anthropic-ai/sdk\` on npm. The SDKs wrap the HTTP API with language-native types, automatic retry logic with exponential backoff, streaming helpers, and ergonomic async/await patterns. Using the official SDK is strongly preferred over raw HTTP calls — it handles retry logic, error parsing, and streaming correctly out of the box.

The Python SDK is the most commonly used for data science, backend services, and scripting. The TypeScript SDK is used for Node.js backend services and server-side rendering in Next.js and similar frameworks. For other languages (Go, Java, Ruby, etc.), Anthropic recommends using the HTTP API directly or a community-maintained client library.

Key SDK features include: automatic retry on 429/529 errors with configurable max retries, streaming support via async iterators, type-safe request and response objects, and helper methods for common patterns like counting tokens. The SDK is open source — developers can inspect the implementation for any request format questions.`,
      quiz: [
        {
          question:
            "What advantage does the official Anthropic Python SDK provide over making raw HTTP requests to the API?",
          options: [
            "Automatic retry with exponential backoff, type-safe objects, streaming helpers, and correct error parsing out of the box",
            "Access to additional API endpoints not available via raw HTTP",
            "Lower latency because the SDK uses a private API endpoint",
            "The ability to use Claude without an API key for development",
          ],
          correctIndex: 0,
          explanation:
            "The official SDK provides automatic retry logic, type safety, streaming helpers, and correct error parsing. These are non-trivial to implement correctly from scratch, especially exponential backoff with jitter for 429 errors and proper streaming event parsing. The SDK does not access private endpoints — it wraps the same public API. Latency is identical. An API key is still required.",
        },
      ],
    },
    {
      heading: "Prompt Caching",
      body: `**Prompt caching** is an Anthropic API feature that reduces the cost and latency of requests where large portions of the prompt repeat across calls. When you mark a prompt segment with a \`cache_control\` block (type: \`"ephemeral"\`), the first request processes and caches that segment. Subsequent requests that send the same cached segment pay a **cache read price** (approximately 10% of the standard input token price for most models) rather than the full input price.

There are two cache TTL tiers to choose from. The **5-minute TTL** cache write costs 1.25x the base input token price — suitable for high-frequency applications where the prompt is called at least once every 5 minutes. The **1-hour TTL** cache write costs 2x the base input token price — worth the higher write cost when call frequency is lower (e.g., once every few minutes to once per hour) because the cache stays warm much longer. Cache reads cost ~10% of base input price regardless of which TTL tier is used.

Cacheable content must appear **before** non-cacheable content in the prompt. The typical pattern is: cache the large, stable system prompt (thousands of tokens of instructions or context), and leave the small, variable user message uncached. This maximizes cache utility because the system prompt repeats identically across all calls while the user message varies.`,
      quiz: [
        {
          question:
            "A developer wants to use prompt caching for a system prompt that is only called once per hour. Will caching provide a cost benefit?",
          options: [
            "It depends on TTL tier — the 5-minute TTL cache would expire between hourly calls; the 1-hour TTL tier would stay warm and provide a cost benefit",
            "Yes — once cached, the system prompt is stored indefinitely until explicitly invalidated",
            "Yes — the cache is per-API-key and persists across sessions regardless of call frequency",
            "No — prompt caching only benefits output tokens, not input tokens",
          ],
          correctIndex: 0,
          explanation:
            "There are two cache TTL tiers. The 5-minute TTL would expire between hourly calls (55 minutes of inactivity exceeds the 5-minute TTL), providing no benefit. However, the 1-hour TTL tier is designed exactly for lower-frequency use cases — an hourly call would keep the 1-hour cache warm. The write cost for the 1-hour tier is 2x base input price, but cache reads cost only ~10%, so for a sufficiently large system prompt it still pays off. The developer should use the 1-hour TTL tier for this workload.",
        },
      ],
    },
    {
      heading: "The Batch API",
      body: `The **Anthropic Batch API** allows sending large numbers of requests for asynchronous processing at a **50% discount** compared to standard API pricing. Instead of sending requests one at a time and waiting for responses, you submit a batch of up to 100,000 requests and Anthropic processes them within 24 hours. This is designed for offline workloads — data processing pipelines, document analysis, evaluation runs, content generation at scale — where immediate responses are not required.

Batch requests are submitted as a JSONL file where each line is an individual API request with a custom ID. When processing completes, results are available for download as a JSONL file where each line contains the custom ID and the corresponding response. If any individual request in the batch fails, it fails independently — successful requests in the batch are not affected.

The Batch API should not be used for interactive features where users are waiting for responses — it has no latency guarantees beyond "within 24 hours." The 50% cost reduction makes it appropriate for high-volume offline workloads where cost optimization is more important than real-time response.`,
      quiz: [
        {
          question:
            "Which scenario is the BEST fit for the Anthropic Batch API?",
          options: [
            "Nightly processing of 50,000 customer reviews to extract sentiment and themes",
            "A real-time customer support chat feature serving 10,000 users simultaneously",
            "A streaming code completion feature in a developer IDE",
            "An interactive document Q&A feature where users ask questions and expect immediate answers",
          ],
          correctIndex: 0,
          explanation:
            "Nightly batch processing of reviews is the ideal Batch API use case: high volume, offline, no real-time requirement, and cost-sensitive. The 50% discount and up-to-24-hour processing window are acceptable trade-offs for this workload. Real-time chat, streaming completion, and interactive Q&A all require immediate responses and cannot tolerate the Batch API's asynchronous nature.",
        },
      ],
    },
  ],

  keyFacts: [
    "Claude.ai and API access are separate products with separate billing and credentials",
    "Claude.ai Enterprise adds SSO, admin controls, and enhanced privacy for organizations",
    "Anthropic Console manages API keys, usage metrics, rate limits, and billing",
    "Workbench is the interactive prompt testing tool — no code required",
    "Official SDKs: anthropic (Python), @anthropic-ai/sdk (npm/TypeScript)",
    "SDK provides automatic retry, type safety, streaming helpers out of the box",
    "Prompt cache has two TTL tiers: 5-minute (write cost 1.25x base input price) and 1-hour (write cost 2x base input price)",
    "Cache reads cost ~10% of base input token price for most models (~90% discount vs. uncached)",
    "Batch API: 50% discount, async processing within 24 hours, up to 100K requests",
    "Batch API is for offline workloads only — not suitable for real-time features",
  ],

  relatedServices: [
    "Messages API",
    "Claude Models",
    "Production Deployment",
    "Safety and Responsible AI",
  ],

  examTips: [
    "Claude.ai ≠ API access — separate products, separate credentials",
    "Workbench = where to test prompts before writing code",
    "Prompt cache TTL tiers: 5-minute (1.25x write cost) and 1-hour (2x write cost) — match the TTL to your call frequency; cache reads always cost ~10%",
    "Batch API = 50% cost reduction but async (up to 24 hours) — offline workloads only",
    "SDK vs raw HTTP: SDK provides retry logic, streaming helpers, type safety",
    "Console = key management, usage metrics, billing — not per-request logs",
  ],
};
