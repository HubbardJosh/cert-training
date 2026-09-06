import { ServiceGuide } from "../../../../types/guide";

export const messagesApiGuide: ServiceGuide = {
  id: "ccao-messages-api",
  service: "Messages API",
  domain: "development",
  tagline:
    "The core API for sending messages to Claude and receiving responses",
  intro:
    "The Messages API is Anthropic's primary interface for interacting with Claude. Every request sends a structured list of messages and receives a structured response object containing Claude's reply, stop reason, and token usage.",

  sections: [
    {
      heading: "Request Structure",
      body: `Every Messages API request requires three top-level fields: **model**, **max_tokens**, and **messages**. The \`model\` field specifies the exact versioned Claude model ID to use. The \`max_tokens\` field sets the maximum number of tokens Claude will generate in its response — the request will error if this is not provided, and the response will be cut off if Claude reaches this limit before naturally completing its answer. The \`messages\` array contains the conversation history as an ordered list of turn objects.

Each message object has a \`role\` (\`"user"\` or \`"assistant"\`) and \`content\`. The \`content\` can be a plain string for simple text or an array of content blocks for multimodal requests containing images and text. Messages must alternate between user and assistant roles — two consecutive user messages or two consecutive assistant messages will return a validation error. The conversation must always start with a user message.

Optional top-level parameters include \`system\` (a system prompt applied before the conversation — accepts either a plain string or an array of content blocks, enabling granular \`cache_control\` placement on individual system prompt segments), \`temperature\` (controls output randomness, 0–1), \`top_p\`, \`top_k\`, and \`stop_sequences\` (strings that cause Claude to stop generating when encountered). These parameters tune Claude's behavior for specific use cases.`,
      quiz: [
        {
          question:
            "Which three fields are REQUIRED in every Messages API request?",
          options: [
            "model, max_tokens, messages",
            "model, system, messages",
            "model, temperature, messages",
            "api_key, model, messages",
          ],
          correctIndex: 0,
          explanation:
            "The three required fields are model (the versioned model ID), max_tokens (the generation limit), and messages (the conversation array). system, temperature, and other parameters are optional. The API key is passed as a header, not a body field.",
        },
      ],
    },
    {
      heading: "The System Prompt",
      body: `The **system prompt** is an optional top-level field that provides instructions, context, and persona to Claude before the conversation begins. Unlike user messages, the system prompt is not part of the alternating user/assistant turn structure — it occupies a privileged position that Claude treats as operator-level instructions. Use the system prompt to define Claude's role, set behavioral constraints, provide background context, and specify output format requirements.

System prompts are processed as part of the input token count and billed accordingly. Because system prompts repeat with every request in a stateless API, long system prompts directly increase cost per call. A common optimization is **prompt caching** — Anthropic's API supports marking a system prompt as cacheable, so that repeated identical system prompts are served from cache at a significantly reduced token cost (approximately 90% cheaper for cached reads versus fresh reads for most models).

Well-structured system prompts use clear sections, explicit instructions, and examples. Ambiguous or contradictory system prompts lead to inconsistent behavior. The system prompt should not replicate what is already the model's default behavior — only specify what differs from defaults.`,
      quiz: [
        {
          question:
            "A high-volume application sends the same 2,000-token system prompt with every request. What Anthropic feature reduces the cost of this pattern?",
          options: [
            "Prompt caching — marks the system prompt as cacheable, reducing repeated input token costs by ~90%",
            "Batch API — groups requests to reduce per-request overhead",
            "Streaming — delivers tokens incrementally to reduce perceived latency",
            "Temperature 0 — deterministic outputs reduce the need for retry calls",
          ],
          correctIndex: 0,
          explanation:
            "Prompt caching is specifically designed for this pattern. By marking the system prompt with a cache_control block, subsequent requests that send the same system prompt pay only a cache read price (~10% of normal input cost) instead of the full input token price. The Batch API reduces per-request overhead for offline jobs but doesn't reduce token costs. Streaming and temperature affect output behavior, not input token billing.",
        },
      ],
    },
    {
      heading: "Response Structure",
      body: `The Messages API returns a structured JSON response object. The key fields are: \`id\` (unique message ID), \`type\` (always \`"message"\`), \`role\` (always \`"assistant"\`), \`content\` (array of content blocks), \`model\` (the exact model used), \`stop_reason\`, and \`usage\`.

The \`stop_reason\` field indicates why Claude stopped generating. \`"end_turn"\` means Claude naturally completed its response. \`"max_tokens"\` means the response was cut off because it hit the \`max_tokens\` limit — this is a signal to increase \`max_tokens\` or restructure the prompt if complete responses are required. \`"stop_sequence"\` means a stop sequence from \`stop_sequences\` was encountered. \`"tool_use"\` means Claude is invoking a tool and waiting for a result.

The \`usage\` object contains \`input_tokens\` and \`output_tokens\`, which are the billable token counts for that request. Logging and monitoring these per-request counts is essential for cost tracking and detecting prompt inflation or runaway output generation.`,
      quiz: [
        {
          question:
            "An application receives a Messages API response where stop_reason is 'max_tokens'. What does this indicate?",
          options: [
            "Claude's response was truncated because it reached the max_tokens limit before finishing",
            "Claude refused to answer because the prompt exceeded the maximum allowed length",
            "The request was rejected due to token budget constraints",
            "Claude successfully completed its response within the token budget",
          ],
          correctIndex: 0,
          explanation:
            "A stop_reason of 'max_tokens' means Claude's output was cut off at the max_tokens limit — the response is incomplete. The application should either increase max_tokens or redesign the prompt to produce shorter responses. It does not indicate a refusal or a rejection; it means generation simply ran out of budget.",
        },
      ],
    },
    {
      heading: "Stateless Conversations and Turn Management",
      body: `The Messages API is **stateless** — Anthropic's servers do not store conversation history between requests. Each API call must include the complete conversation history in the \`messages\` array for Claude to have context about prior turns. This means the client application is responsible for accumulating and sending the full message history with every request.

This stateless design has important implications: conversation history grows with every turn, increasing input token cost and eventually approaching the context window limit. Applications must implement **context management strategies** such as summarizing older turns, trimming messages beyond a certain history depth, or using RAG to retrieve only relevant prior context rather than sending everything.

When building multi-turn applications, the pattern is: (1) start with user message, (2) send to API, (3) append the assistant response to your local history array, (4) append the next user message, (5) send the full array again. Never send only the latest message — without history, Claude has no context of prior turns.`,
      quiz: [
        {
          question:
            "After 20 conversation turns, a chat application's API calls are becoming expensive and slow. What is the BEST strategy to manage this?",
          options: [
            "Summarize older turns and replace them with a condensed summary to reduce token count",
            "Use a different API endpoint that stores conversation state server-side",
            "Increase max_tokens to allow Claude to reference more history",
            "Send only the last 3 user messages to reduce context size",
          ],
          correctIndex: 0,
          explanation:
            "Summarizing older turns is the recommended context management strategy — it preserves the semantic content of prior conversation while reducing token count. Anthropic's API is stateless and has no server-side conversation storage endpoint. Increasing max_tokens affects output length, not input size. Sending only the last 3 messages drops context abruptly and will cause Claude to lose track of earlier conversation threads.",
        },
      ],
    },
    {
      heading: "Streaming Responses",
      body: `By default, the Messages API returns the complete response as a single JSON object after Claude finishes generating. For long responses, this means users wait with no visible output until generation is complete. **Streaming** allows the application to receive tokens as they are generated, enabling a typing-indicator-style UX where text appears progressively.

To enable streaming, set \`stream: true\` in the request. The response changes from a single JSON object to a sequence of **server-sent events (SSE)**. Event types include \`message_start\` (contains the message ID and initial metadata), \`content_block_delta\` (contains incremental text), \`message_delta\` (contains the final stop_reason and usage), and \`message_stop\` (signals the end of the stream). Applications must parse these events incrementally and assemble the full response from the deltas.

Streaming does not change the model's output or token usage — it only changes delivery timing. The same \`max_tokens\` limit, stop reasons, and billing apply. Streaming is strongly recommended for any user-facing interactive feature to improve perceived responsiveness.`,
      quiz: [
        {
          question:
            "A developer enables streaming on the Messages API. Which statement about streaming is correct?",
          options: [
            "Streaming changes only response delivery timing — token usage and billing are identical to non-streaming",
            "Streaming reduces output token cost because tokens are delivered incrementally",
            "Streaming requires a different model endpoint than non-streaming requests",
            "Streaming is only available for Haiku due to its low latency architecture",
          ],
          correctIndex: 0,
          explanation:
            "Streaming changes only how the response is delivered to the client — tokens arrive incrementally via server-sent events instead of as a single JSON object at the end. Token usage, billing, max_tokens limits, and stop reasons are identical between streaming and non-streaming. The same model endpoint supports both via the stream parameter. All Claude models support streaming.",
        },
      ],
    },
    {
      heading: "Rate Limits and Error Handling",
      body: `The Anthropic API enforces **rate limits** on requests per minute (RPM) and tokens per minute (TPM) per API key. When a rate limit is exceeded, the API returns a \`429 Too Many Requests\` HTTP status. Applications must implement **exponential backoff with jitter** — waiting progressively longer between retry attempts with randomization to avoid synchronized retry storms.

Other important error codes: \`400 Bad Request\` for invalid request structure (e.g., missing required fields, invalid model ID, malformed messages array), \`401 Unauthorized\` for invalid or missing API key, \`403 Forbidden\` when the API key lacks permission for the requested operation, \`529 Overloaded\` when Anthropic's API is experiencing high load. The \`529\` error is distinct from a rate limit — it indicates server-side overload and also warrants exponential backoff.

Production applications should never make Claude API calls from the browser or client side — the API key would be exposed. All API calls must be proxied through a server-side component. Additionally, always set reasonable timeouts on API calls; very long requests (large context windows with complex reasoning) can take tens of seconds and should not block user interactions indefinitely.`,
      quiz: [
        {
          question:
            "A production application receives a 429 error from the Anthropic API. What is the correct response?",
          options: [
            "Implement exponential backoff with jitter and retry the request after a delay",
            "Switch to a different Claude model to bypass the rate limit",
            "Increase max_tokens to reduce the number of requests needed",
            "Log the error and drop the request — rate limits cannot be retried",
          ],
          correctIndex: 0,
          explanation:
            "A 429 error indicates a rate limit was exceeded. The correct response is exponential backoff with jitter — wait a progressively longer randomized delay before retrying. Switching models does not bypass rate limits, which are per API key. Increasing max_tokens would increase token consumption, worsening the TPM rate limit situation. Dropping requests is not appropriate for a production application.",
        },
      ],
    },
  ],

  keyFacts: [
    "Required fields: model, max_tokens, messages — all three must be present",
    "Messages must alternate user/assistant roles; conversation must start with 'user'",
    "system prompt occupies a privileged position outside the turn structure",
    "stop_reason 'max_tokens' means response was truncated — not a refusal",
    "API is stateless — full conversation history must be sent with every request",
    "Streaming uses server-sent events (SSE) and does not change token billing",
    "Rate limit exceeded returns HTTP 429; use exponential backoff with jitter",
    "Never expose the API key client-side — always proxy through a server",
    "Prompt caching reduces repeated system prompt cost by ~90% for most models",
    "The system field can accept an array of content blocks (not just a string) — enables granular cache_control placement on individual system prompt segments",
    "usage field in response contains input_tokens and output_tokens for billing",
  ],

  relatedServices: [
    "Claude Models",
    "Prompt Engineering",
    "Tool Use",
    "Prompt Caching",
    "Anthropic Console",
  ],

  examTips: [
    "Know all three required request fields — model, max_tokens, messages",
    "stop_reason 'max_tokens' = truncated response, not a content refusal",
    "Stateless API means full history must be sent every turn",
    "Streaming changes delivery, not billing or behavior",
    "Prompt caching is the solution to expensive repeated system prompts",
    "429 → exponential backoff with jitter; 529 → server overload, same treatment",
    "Never call the API from a browser/client — always server-side proxy",
  ],
};
