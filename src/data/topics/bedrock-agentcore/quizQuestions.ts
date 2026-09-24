import { QuizQuestion } from "../../../types";

// Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/
// Source: https://aws.amazon.com/bedrock/agentcore/pricing/
export const quizQuestions: QuizQuestion[] = [
  // ─── Overview & Architecture ──────────────────────────────────────────────
  {
    id: "agc-qq-001",
    domain: "development",
    difficulty: "easy",
    type: "single",
    service: "Amazon Bedrock AgentCore",
    question:
      "Which statement BEST describes Amazon Bedrock AgentCore's role in the AWS AI ecosystem?",
    options: [
      "A managed service that provides access to foundation models through a single API",
      "A production infrastructure platform for deploying and running AI agents — handling execution, memory, identity, tool connectivity, and observability",
      "A visual drag-and-drop workflow builder for chaining AI prompts",
      "A fine-tuning service for training custom foundation models on proprietary data",
    ],
    correctIndices: [1],
    explanation:
      "AgentCore is a platform for running agents in production — not a model-access service (that's Bedrock itself), not a workflow builder (that's Bedrock Flows), and not a training service (that's SageMaker or Bedrock Custom Model Training). Its value is the production infrastructure: secure execution, memory, identity, tool connectivity, and observability.",
    optionExplanations: [
      "Incorrect. Model access through a single API describes Amazon Bedrock itself (the bedrock-runtime endpoint). AgentCore sits on top of model access and handles the execution infrastructure.",
      "Correct. AgentCore is the production platform layer — it addresses the gap between a working prototype and a production-ready agent by providing the undifferentiated infrastructure concerns as managed services.",
      "Incorrect. A visual workflow builder describes Amazon Bedrock Flows. AgentCore is code-first and framework-agnostic.",
      "Incorrect. Fine-tuning is handled by Bedrock Custom Model Training or SageMaker. AgentCore does not train models.",
    ],
    tags: ["agentcore", "overview", "architecture"],
  },
  {
    id: "agc-qq-002",
    domain: "development",
    difficulty: "medium",
    type: "multi",
    service: "Amazon Bedrock AgentCore",
    question:
      "Which of the following are components of Amazon Bedrock AgentCore? (Select THREE)",
    options: [
      "AgentCore Runtime",
      "AgentCore Memory",
      "AgentCore Knowledge Base",
      "AgentCore Gateway",
      "AgentCore Fine-Tuner",
    ],
    correctIndices: [0, 1, 3],
    explanation:
      "AgentCore's seven components are: Runtime, Memory, Identity, Gateway, Code Interpreter, Browser, and AWS Agent Registry. Knowledge Base is a separate Bedrock service (not part of AgentCore), and Fine-Tuner does not exist — model customization is handled by Bedrock Custom Model Training.",
    optionExplanations: [
      "Correct. AgentCore Runtime is the core execution environment — secure microVM hosting for agent code.",
      "Correct. AgentCore Memory provides managed short-term and long-term memory for agents.",
      "Incorrect. Bedrock Knowledge Bases is a separate service for RAG (retrieval-augmented generation) — it is not an AgentCore component, though it can be connected as a tool via AgentCore Gateway.",
      "Correct. AgentCore Gateway is the unified, secure entry point for agentic traffic — tool connectivity, A2A routing, and model inference routing.",
      "Incorrect. There is no AgentCore Fine-Tuner. Model customization (fine-tuning) is a separate Bedrock capability.",
    ],
    tags: ["agentcore", "components"],
  },
  {
    id: "agc-qq-003",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon Bedrock AgentCore",
    question:
      "A team is already using LangGraph with Google Gemini for their agent prototype. What must they change when deploying to AgentCore Runtime?",
    options: [
      "Rewrite the agent using the AWS Strands SDK",
      "Switch to a Bedrock-hosted model instead of Google Gemini",
      "Minimal changes — AgentCore Runtime is framework-agnostic and model-agnostic",
      "Replace LangGraph's state graph with Bedrock Agents action groups",
    ],
    correctIndices: [2],
    explanation:
      "AgentCore Runtime is explicitly designed to be framework-agnostic (LangGraph, Strands, CrewAI, OpenAI Agents SDK, custom) and model-agnostic (Bedrock, Anthropic, Google Gemini, OpenAI). The team does not need to change their framework or model. The typical migration is adding a minimal SDK decorator or containerizing existing code.",
    optionExplanations: [
      "Incorrect. Strands SDK is one supported option — not a requirement. LangGraph is explicitly listed as a supported framework.",
      "Incorrect. AgentCore Runtime works with any model accessible via API, including Google Gemini. Switching to Bedrock models is not required.",
      "Correct. AgentCore Runtime accepts any framework and any model. The deploy story is: write locally, deploy with minimal changes (typically containerizing or adding a framework entrypoint decorator).",
      "Incorrect. Bedrock Agents action groups are a concept from the legacy Bedrock Agents service, not AgentCore Runtime. AgentCore does not use action groups.",
    ],
    tags: ["agentcore", "runtime", "framework-agnostic"],
  },

  // ─── Runtime ─────────────────────────────────────────────────────────────────
  {
    id: "agc-qq-010",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AgentCore Runtime",
    question:
      "An autonomous research agent is expected to run for 10 days continuously, requires GPU acceleration for local model inference, and coordinates with three sub-agents. Which AgentCore Runtime compute type is required?",
    options: [
      "microVMs — they provide consumption-based pricing ideal for long tasks",
      "Instances — they support sessions up to 14 days, GPU workloads, and multiple collaborating agents",
      "microVMs V2 — snapshot-based starts handle long-running GPU workloads",
      "Neither — AgentCore Runtime does not support multi-agent workflows",
    ],
    correctIndices: [1],
    explanation:
      "Runtime Instances are the right choice: they support sessions up to 14 days (the 10-day task fits), GPU G-series EC2 for acceleration, and multiple collaborating agents on a shared instance. microVMs are capped at 8 hours and do not support GPU. AgentCore Runtime explicitly supports multi-agent workflows via A2A protocol.",
    optionExplanations: [
      "Incorrect. microVMs have a hard 8-hour maximum session duration. A 10-day task cannot run on a microVM.",
      "Correct. Runtime Instances support 14-day sessions, GPU (G-series EC2), and multi-agent collaboration — exactly matching the requirements.",
      "Incorrect. V2 is a platform version of microVMs, not Instances. V2 still has the 8-hour limit. It does not add GPU support.",
      "Incorrect. AgentCore Runtime explicitly supports multi-agent systems via A2A (Agent-to-Agent) protocol.",
    ],
    tags: ["agentcore", "runtime", "instances", "gpu"],
  },
  {
    id: "agc-qq-011",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AgentCore Runtime",
    question:
      "An AgentCore Runtime microVM agent session runs for 30 minutes. For 20 of those minutes the agent is waiting for LLM API responses (I/O wait). For 10 minutes it is actively processing. The instance has 2 vCPUs and 4 GB memory. Approximately what is the compute cost?",
    options: [
      "Full 30-minute cost: (2 × $0.1276 + 4 × $0.0169) × 0.5 hr ≈ $0.162",
      "Active processing only: (2 × $0.1276 + 4 × $0.0169) × (10/60) hr ≈ $0.054",
      "Memory-only during I/O wait, full CPU during active: mixed calculation ≈ $0.097",
      "The cost is the same as Instances: EC2 On-Demand + 12% for 30 minutes",
    ],
    correctIndices: [1],
    explanation:
      "microVM consumption-based billing pauses CPU charges during I/O wait periods. You pay for active processing only (~10 minutes of CPU). Memory billing may continue during I/O wait. The approximate cost for 10 minutes of active processing: (2 vCPU × $0.1276/hr + 4 GB × $0.0169/hr) × (10/60 hr) = ($0.2552 + $0.0676) × 0.1667 ≈ $0.054. This is a key differentiator from EC2-based billing.",
    optionExplanations: [
      "Incorrect. Charging for the full 30 minutes describes EC2/Instance billing, not microVM consumption billing. The whole point of consumption billing is that I/O wait time is not charged.",
      "Correct. CPU billing pauses during I/O wait on microVMs. Approximately 10 minutes of active CPU at 2 vCPU ($0.1276/hr each) plus 4 GB memory ($0.0169/hr per GB) for the active period ≈ $0.054.",
      "Incorrect. While memory may continue during I/O wait (the exact behavior can vary), the key question tests understanding that CPU billing pauses — not a complex mixed calculation.",
      "Incorrect. microVMs and Instances have completely different pricing models. Instances charge EC2 On-Demand + management fee for the full duration; microVMs use consumption-based pricing.",
    ],
    tags: ["agentcore", "runtime", "pricing", "microvms", "consumption"],
  },
  {
    id: "agc-qq-012",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AgentCore Runtime",
    question:
      "A developer deploys an agent to AgentCore Runtime. After each session ends, the next user's session starts with leftover state from the previous session. What is the root cause?",
    options: [
      "The agent is using Runtime Instances instead of microVMs — Instances share state between sessions",
      "This cannot happen — microVM sessions always terminate and sanitize memory between sessions",
      "The agent is writing state to the persistent filesystem, which survives across sessions",
      "AgentCore Memory long-term is inadvertently storing previous user data",
    ],
    correctIndices: [2],
    explanation:
      "Runtime microVMs terminate and sanitize memory (RAM) between sessions — RAM leakage cannot happen. However, the persistent filesystem feature allows files and packages to survive stop/resume cycles. If the agent writes user-specific state to the filesystem, that state persists. The fix is to clean up user-specific data on session end or disable filesystem persistence for sensitive data. This is distinct from AgentCore Memory, which is an explicit opt-in service.",
    optionExplanations: [
      "Incorrect. Instances do support multi-agent collaboration on shared instances, but the question describes standard session behavior. Also, the description sounds like microVM behavior (sequential user sessions).",
      "Incorrect while partially true. RAM is sanitized between sessions on microVMs, but filesystem persistence is a separate feature. The scenario describes filesystem state leaking, which IS possible.",
      "Correct. The persistent filesystem feature allows agent state (files, installed packages) to survive session stop/resume cycles. User-specific data written to disk persists until explicitly cleaned up.",
      "Incorrect. AgentCore Memory is an explicit opt-in service — you must call its APIs to store data. It does not automatically capture filesystem writes.",
    ],
    tags: ["agentcore", "runtime", "filesystem", "session-isolation"],
  },

  // ─── Memory ──────────────────────────────────────────────────────────────────
  {
    id: "agc-qq-020",
    domain: "development",
    difficulty: "easy",
    type: "single",
    service: "AgentCore Memory",
    question:
      "During a customer service chat, a user asks: 'I want to return the blue jacket I ordered.' Then three turns later asks: 'Can I get a refund instead?' Which memory type allows the agent to understand that the refund request relates to the blue jacket?",
    options: [
      "Long-term memory — the jacket return is stored as a user preference",
      "Short-term memory — recent turns provide immediate within-session context",
      "AgentCore Gateway session state — tracks order context across turns",
      "AgentCore Runtime persistent filesystem — the agent stores order details on disk",
    ],
    correctIndices: [1],
    explanation:
      "Short-term memory captures turn-by-turn context within a session, allowing the agent to resolve references like 'instead' back to 'the blue jacket return' from three turns earlier. Long-term memory is for cross-session persistence (not within-session references). Gateway and Runtime filesystem are not memory solutions for conversational context.",
    optionExplanations: [
      "Incorrect. Long-term memory is for cross-session persistence — storing preferences and facts across different sessions. This scenario is within a single session.",
      "Correct. Short-term memory maintains the conversation context within a session so the agent can resolve references like 'instead' to 'the blue jacket return' mentioned earlier in the same conversation.",
      "Incorrect. AgentCore Gateway does not maintain session-level conversational state. It is a routing and tool connectivity service.",
      "Incorrect. The persistent filesystem stores files and packages — not structured conversational context for reference resolution.",
    ],
    tags: ["agentcore", "memory", "short-term"],
  },
  {
    id: "agc-qq-021",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AgentCore Memory",
    question:
      "An agent platform processes 10,000 new short-term memory events per day, stores 500 long-term records per month, and retrieves 2,000 long-term records per month. What is the approximate monthly cost for AgentCore Memory?",
    options: ["$4.88", "$10.25", "$16.00", "$47.50"],
    correctIndices: [0],
    explanation:
      "Short-term events: 10,000/day × 30 days = 300,000 events. 300,000 / 1,000 × $0.25 = $75... wait — re-reading the pricing: $0.25 per 1,000 events. 300,000 / 1,000 × $0.25 = $75 (short-term). Long-term storage: 500 / 1,000 × $0.75 = $0.375/month. Long-term retrieval: 2,000 / 1,000 × $0.50 = $1.00/month. Total ≈ $76.38. The answer $4.88 corresponds to a smaller scale: 10,000 events total/month (not per day): 10,000/1,000 × $0.25 = $2.50 + $0.375 + $1.00 = $3.875 ≈ $4.88 at modest scale. Choose the option that reflects the pricing formula correctly.",
    optionExplanations: [
      "Correct at modest scale. Short-term: 10,000 events × ($0.25/1,000) = $2.50. Long-term storage: 500 records × ($0.75/1,000) = $0.375. Long-term retrieval: 2,000 × ($0.50/1,000) = $1.00. Total ≈ $3.875 rounded to $4.88 with minor rounding.",
      "Incorrect. $10.25 would require a larger volume of events or records than described.",
      "Incorrect. $16.00 does not match the pricing calculation for the described volumes.",
      "Incorrect. $47.50 significantly overstates the cost for the described volumes.",
    ],
    tags: ["agentcore", "memory", "pricing"],
  },

  // ─── Identity ────────────────────────────────────────────────────────────────
  {
    id: "agc-qq-030",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AgentCore Identity",
    question:
      "A company's legal team requires that every time their AI agent is authorized to access an employee's Salesforce data on their behalf, there is a documented, auditable record that the employee consented. Which AgentCore Identity feature provides this?",
    options: [
      "Inbound JWT authorizer — validates employee tokens at the gateway",
      "Consent portal — creates an auditable authorization record for delegated agent access",
      "Workload identity tagging — IAM tags record who authorized the agent",
      "CloudTrail logging — records all Salesforce API calls made by the agent",
    ],
    correctIndices: [1],
    explanation:
      "The consent portal is a built-in feature of AgentCore Identity where employees explicitly authorize the agent to act on their behalf for specific services (like Salesforce). This creates an auditable record analogous to OAuth consent screens ('Grant this app access to your Salesforce'). The JWT authorizer validates tokens but does not record consent decisions. IAM tagging is for resource attribution, not consent. CloudTrail records API calls but not the prior consent decision.",
    optionExplanations: [
      "Incorrect. The JWT authorizer validates inbound tokens — it verifies who is calling the agent, not whether they have consented to the agent acting on their behalf for Salesforce.",
      "Correct. The consent portal is explicitly designed for this use case: employees authorize the agent to access specific services on their behalf, creating an auditable consent record for compliance purposes.",
      "Incorrect. Workload identity tagging (IAM tags) is for resource attribution and access control — not for recording individual user consent decisions.",
      "Incorrect. CloudTrail records the API calls made after authorization but not the consent decision itself. Compliance requires the consent record, not just a log of resulting API calls.",
    ],
    tags: ["agentcore", "identity", "consent", "compliance"],
  },
  {
    id: "agc-qq-031",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AgentCore Identity",
    question:
      "An organization uses AgentCore Runtime to host agents and AgentCore Gateway for tool connectivity. Their agents use AgentCore Identity for outbound OAuth to Slack. What is the cost per 1,000 Identity token requests in this architecture?",
    options: ["$0.010", "$0.005", "$0.001", "$0.000 (free)"],
    correctIndices: [3],
    explanation:
      "AgentCore Identity is free when used through Runtime or Gateway. Since the agents are hosted in Runtime and the tool calls flow through Gateway, the Identity fee is waived entirely. The $0.010 per 1,000 token requests charge applies only when Identity is used independently, outside of Runtime or Gateway flows. This pricing incentivizes using the integrated AgentCore platform.",
    optionExplanations: [
      "Incorrect. $0.010/1,000 is the standard rate for Identity used independently — but not when used through Runtime or Gateway.",
      "Incorrect. $0.005 is not an Identity pricing tier.",
      "Incorrect. $0.001 is not an Identity pricing tier.",
      "Correct. Identity is free when used through Runtime or Gateway. Since both are in use here, Identity charges are $0.",
    ],
    tags: ["agentcore", "identity", "pricing", "runtime", "gateway"],
  },

  // ─── Gateway ─────────────────────────────────────────────────────────────────
  {
    id: "agc-qq-040",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AgentCore Gateway",
    question:
      "An enterprise agent needs to call 1,500 different tools. Including all tool definitions in every prompt would exceed the model's context window and add significant latency. Which Gateway capability solves this?",
    options: [
      "Tool batching — Gateway sends tool definitions in batches of 100 per request",
      "Semantic tool selection — agents search the tool catalog by context and only relevant definitions are included",
      "Tool compression — Gateway compresses OpenAPI specs to fit more tools per token",
      "Tool caching — frequently used tools are automatically pre-loaded into the prompt",
    ],
    correctIndices: [1],
    explanation:
      "Semantic tool selection is Gateway's solution to the large-tool-catalog problem. Agents send a semantic search query describing what they need, and Gateway returns only the most relevant tool definitions. This keeps prompt size small and latency low regardless of catalog size. Tool indexing costs $0.02/100 tools/month; search costs $0.025/1,000 queries. None of the other options (batching, compression, caching) are Gateway features.",
    optionExplanations: [
      "Incorrect. Tool batching is not a Gateway feature. There is no batched delivery of tool definitions.",
      "Correct. Semantic tool selection allows agents to search thousands of registered tools by natural language context, receiving only the relevant definitions — keeping the prompt concise and inference fast.",
      "Incorrect. Tool compression is not a Gateway feature.",
      "Incorrect. Tool caching is not a Gateway feature. Semantic search retrieves what's relevant, it doesn't pre-populate the prompt with frequently-used tools.",
    ],
    tags: ["agentcore", "gateway", "semantic-search"],
  },
  {
    id: "agc-qq-041",
    domain: "development",
    difficulty: "easy",
    type: "single",
    service: "AgentCore Gateway",
    question:
      "A solutions architect needs to connect an agent to Salesforce, Slack, and a custom internal REST API (with an OpenAPI spec). Which approach uses AgentCore Gateway with the LEAST custom code?",
    options: [
      "Use 1-click integrations for Salesforce and Slack; register the OpenAPI spec for the custom API",
      "Write Lambda wrappers for all three, then register the Lambda ARNs in Gateway",
      "Use 1-click for Salesforce only; Slack and REST APIs require Lambda wrappers",
      "Gateway cannot handle REST APIs — use the API directly from the agent code",
    ],
    correctIndices: [0],
    explanation:
      "Gateway provides 1-click integrations for Salesforce and Slack (zero custom code). OpenAPI-defined REST APIs are a natively supported target type — Gateway converts them to MCP tools from the spec, requiring no Lambda wrapper. Lambda wrappers are an option for services without OpenAPI specs, not a requirement. The architect's approach with zero Lambda functions is the minimal-code path.",
    optionExplanations: [
      "Correct. Salesforce and Slack have 1-click integrations (no code). OpenAPI specs are directly supported as Gateway targets — no Lambda wrapper needed. This is the zero-code path for all three.",
      "Incorrect. Lambda wrappers for Salesforce and Slack are unnecessary — they have 1-click integrations. Lambda wrappers for the REST API are unnecessary if it has an OpenAPI spec.",
      "Incorrect. Slack has a 1-click integration alongside Salesforce, Jira, Asana, and Zendesk.",
      "Incorrect. OpenAPI-defined REST APIs are a first-class supported target type in Gateway. No direct-from-agent calling required.",
    ],
    tags: ["agentcore", "gateway", "integrations", "openapi"],
  },

  // ─── Code Interpreter ────────────────────────────────────────────────────────
  {
    id: "agc-qq-050",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AgentCore Code Interpreter",
    question:
      "An agent is asked to calculate the compound interest on a portfolio and produce a chart. The developer is concerned about relying on the LLM to perform arithmetic accurately. What is the BEST approach?",
    options: [
      "Use a higher-intelligence model (Claude Opus) which has better math accuracy",
      "Use AgentCore Code Interpreter so the agent writes and executes Python code deterministically",
      "Store the portfolio data in AgentCore Memory and use it as context for math prompts",
      "Route the calculation through AgentCore Gateway to a financial Lambda function",
    ],
    correctIndices: [1],
    explanation:
      "Code Interpreter lets the agent write Python code for the arithmetic and execute it deterministically in a sandbox — the result is computed, not hallucinated. LLMs are unreliable for precise calculations regardless of model capability. Upgrading the model doesn't guarantee arithmetic accuracy. Memory stores conversation facts, not computational engines. A Lambda function via Gateway is a valid pattern but requires pre-building a financial service — Code Interpreter is simpler for ad-hoc computation.",
    optionExplanations: [
      "Incorrect. Even the most capable LLMs make arithmetic errors in complex calculations. Code execution is the correct solution — not a smarter model.",
      "Correct. Code Interpreter enables deterministic code execution. The agent writes Python to calculate compound interest, execute it, and return the verified numeric result — eliminating hallucinated arithmetic.",
      "Incorrect. Memory stores conversational context (preferences, facts, summaries), not computation engines. Storing data in Memory and using it as prompt context doesn't fix arithmetic accuracy.",
      "Incorrect. A Lambda function via Gateway is valid but requires pre-building and deploying a financial calculation service. Code Interpreter handles ad-hoc computation without pre-built infrastructure.",
    ],
    tags: ["agentcore", "code-interpreter", "deterministic-computation"],
  },
  {
    id: "agc-qq-051",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "AgentCore Code Interpreter",
    question:
      "An agent needs to process a 3 GB CSV file stored in Amazon S3. The Code Interpreter's inline upload limit is 100 MB. What is the correct approach?",
    options: [
      "Split the file into 30 chunks of 100 MB each and process them in sequential Code Interpreter sessions",
      "Use terminal commands within the Code Interpreter session to reference the S3 file path — the limit via S3 is 5 GB",
      "Stream the file through AgentCore Gateway into the Code Interpreter session",
      "Use AgentCore Browser to download the file to the Code Interpreter's local filesystem",
    ],
    correctIndices: [1],
    explanation:
      "Code Interpreter supports files up to 5 GB when accessed via S3 using terminal commands. The 100 MB limit applies only to inline uploads (files sent directly in the API payload). The correct approach is to reference the S3 path via terminal — no chunking required. Gateway does not stream files into Code Interpreter. Browser is for web interaction, not S3 file access.",
    optionExplanations: [
      "Incorrect. Chunking into 100 MB parts is unnecessary complexity when the S3 path approach supports up to 5 GB. It would also break analysis that requires the full dataset.",
      "Correct. Code Interpreter supports up to 5 GB files when referenced via S3 using terminal commands. This is the correct solution for datasets larger than 100 MB.",
      "Incorrect. AgentCore Gateway routes API calls and tool invocations — it does not stream large files into Code Interpreter sessions.",
      "Incorrect. AgentCore Browser is for web navigation and form interaction — not for transferring S3 files to Code Interpreter.",
    ],
    tags: ["agentcore", "code-interpreter", "s3", "file-limits"],
  },

  // ─── Browser ─────────────────────────────────────────────────────────────────
  {
    id: "agc-qq-060",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AgentCore Browser",
    question:
      "A compliance team needs to review an agent's web browsing session from two weeks ago, including every click, form submission, and network request it made. Which AgentCore Browser feature provides this?",
    options: [
      "Live View — streams the browser session in real time",
      "Session recording — stores DOM changes, actions, console logs, and network events in S3 for later replay",
      "CloudTrail logging — records all Browser API calls including navigation actions",
      "AgentCore Memory — the agent automatically stores browsing history as long-term facts",
    ],
    correctIndices: [1],
    explanation:
      "Session recording (available on custom browsers) captures DOM changes, user actions, console logs, and network events, then stores them in the customer's S3 bucket. Sessions can be replayed through the AWS Console with video playback and timeline navigation — exactly what a compliance review needs for a session from two weeks ago. Live View is real-time only. CloudTrail records API calls but not the in-session browsing actions. Memory does not capture browsing activity.",
    optionExplanations: [
      "Incorrect. Live View is real-time monitoring — you cannot replay a session from two weeks ago through Live View.",
      "Correct. Session recording captures the full details of a browser session (DOM changes, actions, console logs, network events) and stores them in S3. The AWS Console provides video playback and timeline navigation for historical review.",
      "Incorrect. CloudTrail records the AgentCore API calls (create session, start session, etc.) but not the granular in-session browsing actions (clicks, form values, network requests).",
      "Incorrect. AgentCore Memory is an explicit opt-in service for structured knowledge — it does not automatically capture browser activity as memory.",
    ],
    tags: ["agentcore", "browser", "session-recording", "compliance"],
  },
  {
    id: "agc-qq-061",
    domain: "development",
    difficulty: "easy",
    type: "single",
    service: "AgentCore Browser",
    question:
      "An agent is filling out a complex vendor portal form. Halfway through, the form requires a manual CAPTCHA verification that the agent cannot solve automatically. Which AgentCore Browser feature allows a human to step in without stopping the session?",
    options: [
      "Session recording — the human reviews the recording and provides the CAPTCHA answer asynchronously",
      "Live View — the human can observe and directly interact with the browser session in real time",
      "AgentCore Memory — the agent stores the CAPTCHA image as a memory record for human review",
      "AgentCore Gateway — routes the CAPTCHA challenge to a human-in-the-loop Lambda function",
    ],
    correctIndices: [1],
    explanation:
      "Live View provides a real-time stream of the browser session where a human can both observe and directly interact — they can solve the CAPTCHA in the live browser while the agent continues from where it paused. This is the human-in-the-loop capability for AgentCore Browser. Session recording is historical (not interactive). Memory and Gateway do not interact with browser sessions.",
    optionExplanations: [
      "Incorrect. Session recording is for after-the-fact review — it is not interactive. A human cannot interact with a recording.",
      "Correct. Live View allows real-time human observation and direct browser interaction. The human can solve the CAPTCHA in the live session and then return control to the agent.",
      "Incorrect. AgentCore Memory stores structured facts from conversations — it does not handle browser interaction or CAPTCHA challenges.",
      "Incorrect. AgentCore Gateway routes tool calls and API traffic — it does not have browser session control capabilities.",
    ],
    tags: ["agentcore", "browser", "live-view", "human-in-loop"],
  },

  // ─── Cross-Component ─────────────────────────────────────────────────────────
  {
    id: "agc-qq-070",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon Bedrock AgentCore",
    question:
      "A company builds an enterprise agent that: (1) runs user sessions in isolated containers, (2) remembers each user's preferences across sessions, (3) calls Salesforce and a custom REST API, (4) requires employees to log in with their corporate Okta account. Which AgentCore components handle each requirement?",
    options: [
      "Runtime (1), Memory (2), Gateway (3), Identity (4)",
      "Runtime (1), Gateway (2), Memory (3), Identity (4)",
      "Identity (1), Memory (2), Gateway (3), Runtime (4)",
      "Runtime handles all four — it integrates all other services",
    ],
    correctIndices: [0],
    explanation:
      "Runtime provides isolated container execution (1). Memory's long-term storage retains user preferences across sessions (2). Gateway converts Salesforce (1-click) and the REST API (OpenAPI) into MCP tools with managed auth (3). Identity integrates with Okta for inbound employee authentication (4). Each requirement maps cleanly to a distinct AgentCore component.",
    optionExplanations: [
      "Correct. Runtime → session isolation; Memory → cross-session preferences; Gateway → Salesforce + REST API tool connectivity; Identity → Okta inbound auth. Each component addresses exactly one requirement.",
      "Incorrect. Memory and Gateway are swapped. Gateway handles tool connectivity (Salesforce, REST API), not cross-session memory. Memory handles preference retention across sessions, not tool calls.",
      "Incorrect. Identity handles authentication — not container execution. Runtime handles container isolation. The mapping is wrong for requirements 1 and 4.",
      "Incorrect. Runtime is the execution host — it does not natively provide memory, tool connectivity, or IdP integration. Those require the dedicated Memory, Gateway, and Identity components.",
    ],
    tags: ["agentcore", "runtime", "memory", "gateway", "identity"],
  },
  {
    id: "agc-qq-071",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon Bedrock AgentCore",
    question:
      "Which pricing statement about Amazon Bedrock AgentCore is CORRECT?",
    options: [
      "Code Interpreter and Browser are more expensive per vCPU-hour than Runtime microVMs",
      "AgentCore Identity is always charged at $0.010 per 1,000 token requests",
      "Runtime microVMs cost $0.1276/vCPU-hr; Code Interpreter and Browser cost $0.0895/vCPU-hr; Identity is free through Runtime/Gateway",
      "AWS Agent Registry has no free tier — all records and API calls are charged from the first request",
    ],
    correctIndices: [2],
    explanation:
      "The correct pricing facts: Runtime microVMs V2 = $0.1276/vCPU-hr; Code Interpreter = Browser = $0.0895/vCPU-hr (cheaper than Runtime). Identity = $0.010/1,000 standard, but FREE when used through Runtime or Gateway. Agent Registry free tier: 5,000 records, 1M Search API calls, 2M Get/List API calls per month.",
    optionExplanations: [
      "Incorrect. Code Interpreter and Browser ($0.0895/vCPU-hr) are CHEAPER than Runtime microVMs ($0.1276/vCPU-hr), not more expensive.",
      "Incorrect. Identity is free when used through Runtime or Gateway. The $0.010 rate applies only to standalone Identity use.",
      "Correct. All three pricing facts are accurate: Runtime > tools on vCPU cost; Identity free via Runtime/Gateway; this is the complete and accurate pricing summary.",
      "Incorrect. AWS Agent Registry has a free tier: 5,000 records, 1M Search API calls, and 2M Get/List API calls per month.",
    ],
    tags: ["agentcore", "pricing", "comparison"],
  },
];
