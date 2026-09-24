import { FlashCard } from "../../../types";

// Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/
// Source: https://aws.amazon.com/bedrock/agentcore/pricing/
export const flashcards: FlashCard[] = [
  // ─── Overview ────────────────────────────────────────────────────────────────
  {
    id: "agc-fc-001",
    service: "Amazon Bedrock AgentCore",
    domain: "development",
    difficulty: "easy",
    question: "What is Amazon Bedrock AgentCore?",
    answer:
      "A fully managed platform providing the infrastructure, security, and tooling to deploy AI agents to production — handling execution isolation, memory, identity, tool connectivity, and observability so you focus on agent logic.",
    keyPoints: [
      "7 components: Runtime, Memory, Identity, Gateway, Code Interpreter, Browser, AWS Agent Registry",
      "Framework-agnostic: LangGraph, Strands, CrewAI, OpenAI Agents SDK, Claude Agent SDK, custom",
      "Model-agnostic: Bedrock models, Anthropic, OpenAI, Google Gemini",
      "Solves the production gap — prototype to prod without rebuilding common infrastructure",
    ],
    tags: ["agentcore", "overview", "platform"],
  },
  {
    id: "agc-fc-002",
    service: "Amazon Bedrock AgentCore",
    domain: "development",
    difficulty: "medium",
    question: "What are the 7 components of Amazon Bedrock AgentCore?",
    answer:
      "Runtime, Memory, Identity, Gateway, Code Interpreter, Browser, AWS Agent Registry.",
    keyPoints: [
      "Runtime: secure serverless hosting for agent code",
      "Memory: short-term and long-term conversation memory",
      "Identity: workload identity and credential management",
      "Gateway: unified entry point for tools, agents, and models",
      "Code Interpreter: sandboxed code execution (Python, JS, TS)",
      "Browser: containerized remote browser for web interaction",
      "AWS Agent Registry: discover and share agents/tools across org",
    ],
    tags: ["agentcore", "components", "overview"],
  },
  {
    id: "agc-fc-003",
    service: "Amazon Bedrock AgentCore",
    domain: "development",
    difficulty: "medium",
    question:
      "How does Amazon Bedrock AgentCore Runtime differ from Amazon Bedrock Agents (legacy)?",
    answer:
      "Bedrock Agents is an opinionated managed service where AWS manages the agent loop (you define action groups via console/API). AgentCore Runtime is a framework-flexible hosting environment — you write the agent loop yourself (or use LangGraph, Strands, etc.) and AgentCore provides secure execution infrastructure.",
    keyPoints: [
      "Bedrock Agents: AWS manages orchestration; you declare tools",
      "AgentCore Runtime: you own the agent logic; AgentCore provides execution",
      "Runtime supports any framework and any model",
      "Runtime is the newer, more flexible approach",
    ],
    tags: ["agentcore", "runtime", "bedrock-agents", "comparison"],
  },

  // ─── Runtime ─────────────────────────────────────────────────────────────────
  {
    id: "agc-fc-010",
    service: "AgentCore Runtime",
    domain: "deployment",
    difficulty: "easy",
    question:
      "What are the two compute types available in AgentCore Runtime, and when do you use each?",
    answer:
      "microVMs (serverless, max 8 hours, consumption pricing) and Instances (EC2-backed, max 14 days, supports GPU, multiple collaborating agents). Use microVMs for bursty interactive workloads; use Instances for long-running, GPU, or multi-agent workloads.",
    keyPoints: [
      "microVMs: serverless, max 8 hours, consumption billing",
      "Instances: EC2-backed, max 14 days, GPU G-series support",
      "microVM CPU billing pauses during I/O wait",
      "Instances: EC2 On-Demand + 12% CPU or 7.8% GPU management fee",
    ],
    tags: ["agentcore", "runtime", "microvms", "instances", "compute"],
  },
  {
    id: "agc-fc-011",
    service: "AgentCore Runtime",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What happens to a microVM session when it ends in AgentCore Runtime?",
    answer:
      "The entire microVM is terminated and its memory is sanitized. This provides deterministic security — complete isolation between sessions — even for non-deterministic AI workloads.",
    keyPoints: [
      "Termination + memory sanitization is automatic at session end",
      "Each session has isolated CPU, memory, and filesystem",
      "V2 platform uses snapshots for fast cold starts on the next session",
      "Persistent filesystem survives stop/resume (not full termination)",
    ],
    tags: ["agentcore", "runtime", "security", "session-isolation"],
  },
  {
    id: "agc-fc-012",
    service: "AgentCore Runtime",
    domain: "deployment",
    difficulty: "hard",
    question: "What is the pricing for AgentCore Runtime microVMs (V2)?",
    answer:
      "$0.1276 per vCPU-hour and $0.0169 per GB-hour. Minimum 1-second billing increments, 128 MB minimum memory. CPU billing typically pauses during I/O wait periods.",
    keyPoints: [
      "vCPU: $0.1276/hour; Memory: $0.0169/GB-hour",
      "1-second minimum billing; 128 MB minimum memory",
      "CPU billing pauses during I/O wait (e.g., waiting for LLM responses)",
      "Consumption-based: pay only for active processing",
    ],
    tags: ["agentcore", "runtime", "pricing", "microvms"],
  },
  {
    id: "agc-fc-013",
    service: "AgentCore Runtime",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What protocols does AgentCore Runtime support for agent communication?",
    answer:
      "MCP (Model Context Protocol) for tool connectivity, A2A (Agent-to-Agent) for inter-agent communication, AG-UI for user-facing interfaces, HTTP, and WebSocket for bidirectional streaming.",
    keyPoints: [
      "MCP: agents expose or consume tools",
      "A2A: agents delegate tasks to other agents",
      "AG-UI: structured user interface integration",
      "WebSocket: real-time bidirectional streaming",
      "Max payload: 100 MB",
    ],
    tags: ["agentcore", "runtime", "protocols", "mcp", "a2a"],
  },
  {
    id: "agc-fc-014",
    service: "AgentCore Runtime",
    domain: "deployment",
    difficulty: "medium",
    question: "What is the AgentCore Runtime V2 platform and its key benefit?",
    answer:
      "V2 starts agents from a snapshot rather than a fresh boot, keeping cold starts fast and consistent regardless of concurrency level or container image size. Lowers cost for always-on or bursty agents.",
    keyPoints: [
      "Snapshot-based startup: consistent cold start time",
      "No penalty for large container images",
      "Better economics for always-on or bursty workloads",
      "V2 is the current recommended platform version",
    ],
    tags: ["agentcore", "runtime", "v2", "cold-start"],
  },

  // ─── Memory ──────────────────────────────────────────────────────────────────
  {
    id: "agc-fc-020",
    service: "AgentCore Memory",
    domain: "development",
    difficulty: "easy",
    question:
      "What are the two memory types in AgentCore Memory and what does each store?",
    answer:
      "Short-term memory: turn-by-turn context within a single session (resolves references like 'What about tomorrow?'). Long-term memory: automatically extracted facts, preferences, and session summaries persisted across sessions.",
    keyPoints: [
      "Short-term: scoped to one session; resolves in-session references",
      "Long-term: cross-session; stores preferences, facts, summaries",
      "Long-term extraction is automatic — no custom pipeline needed",
      "Both types are fully managed; no vector database to provision",
    ],
    tags: ["agentcore", "memory", "short-term", "long-term"],
  },
  {
    id: "agc-fc-021",
    service: "AgentCore Memory",
    domain: "development",
    difficulty: "hard",
    question: "What is the pricing for AgentCore Memory?",
    answer:
      "Short-term: $0.25 per 1,000 new events. Long-term storage: $0.75 per 1,000 records/month. Long-term retrieval: $0.50 per 1,000 memory record retrievals.",
    keyPoints: [
      "Short-term events: $0.25/1,000",
      "Long-term storage: $0.75/1,000 records/month",
      "Long-term retrieval: $0.50/1,000 retrievals",
      "Three distinct charges: events, storage, retrieval",
    ],
    tags: ["agentcore", "memory", "pricing"],
  },
  {
    id: "agc-fc-022",
    service: "AgentCore Memory",
    domain: "development",
    difficulty: "medium",
    question: "How does AgentCore long-term memory handle extraction?",
    answer:
      "Extraction is automatic — AgentCore Memory analyzes conversations and extracts preferences, important facts, and session summaries without custom extraction code. Developers configure what types of facts to retain.",
    keyPoints: [
      "No custom extraction pipeline required",
      "Automatic analysis of conversations for key information",
      "Configurable extraction strategies",
      "Session summaries avoid replaying full conversation histories",
    ],
    tags: ["agentcore", "memory", "long-term", "extraction"],
  },

  // ─── Identity ────────────────────────────────────────────────────────────────
  {
    id: "agc-fc-030",
    service: "AgentCore Identity",
    domain: "security",
    difficulty: "medium",
    question:
      "What is the difference between inbound and outbound authentication in AgentCore Identity?",
    answer:
      "Inbound authentication: verifying the identity of agents or users calling INTO the agent (integration with Okta, Microsoft Entra, Cognito). Outbound authentication: credentials the agent uses to call external services (OAuth, API keys for Slack, GitHub, Salesforce, etc.).",
    keyPoints: [
      "Inbound: who can call my agent (IdP integration)",
      "Outbound: what my agent can call (OAuth, API key management)",
      "Gateway handles both directions for tool connectivity",
      "Identity is the only managed service providing both in a single service",
    ],
    tags: ["agentcore", "identity", "authentication", "oauth"],
  },
  {
    id: "agc-fc-031",
    service: "AgentCore Identity",
    domain: "security",
    difficulty: "hard",
    question:
      "What is the pricing for AgentCore Identity, and when is it free?",
    answer:
      "$0.010 per 1,000 token or API key requests. FREE when used through AgentCore Runtime or Gateway.",
    keyPoints: [
      "Standard rate: $0.010/1,000 token or API key requests",
      "Free when Identity is used through Runtime or Gateway flows",
      "Incentivizes using the integrated AgentCore platform",
      "Charge applies only when Identity is called independently",
    ],
    tags: ["agentcore", "identity", "pricing"],
  },
  {
    id: "agc-fc-032",
    service: "AgentCore Identity",
    domain: "security",
    difficulty: "medium",
    question:
      "Which corporate identity providers does AgentCore Identity support for inbound authentication?",
    answer:
      "Okta, Microsoft Entra ID (formerly Azure AD), and Amazon Cognito. Private/on-premises IdPs are also supported via private connectivity.",
    keyPoints: [
      "Okta: enterprise SSO",
      "Microsoft Entra ID: enterprise SSO (formerly Azure AD)",
      "Amazon Cognito: AWS-native user pools",
      "Private IdPs: via private connectivity",
    ],
    tags: ["agentcore", "identity", "idp", "sso"],
  },
  {
    id: "agc-fc-033",
    service: "AgentCore Identity",
    domain: "security",
    difficulty: "medium",
    question:
      "What is the AgentCore Identity consent portal and why is it important?",
    answer:
      "A built-in portal where users authorize agents to act on their behalf for specific services. Creates an auditable record of user authorization — similar to 'Grant this app access to your Google Drive' OAuth consent screens.",
    keyPoints: [
      "Users explicitly grant agent access to specific services",
      "Auditable record of what agents are authorized to do",
      "Required for delegated outbound auth (agent acts as user)",
      "Critical for compliance and access control governance",
    ],
    tags: ["agentcore", "identity", "consent", "oauth", "compliance"],
  },

  // ─── Gateway ─────────────────────────────────────────────────────────────────
  {
    id: "agc-fc-040",
    service: "AgentCore Gateway",
    domain: "development",
    difficulty: "easy",
    question: "What does AgentCore Gateway do?",
    answer:
      "A fully managed AI gateway providing a single, secure entry point for agentic traffic. Converts APIs, Lambda functions, and services into MCP tools; routes A2A and model inference traffic; and manages both inbound and outbound authentication.",
    keyPoints: [
      "Converts OpenAPI, Smithy, Lambda → MCP-compatible tools",
      "1-click integrations: Salesforce, Slack, Jira, Asana, Zendesk",
      "Only managed service with BOTH inbound + outbound auth",
      "Semantic tool selection for large tool catalogs",
    ],
    tags: ["agentcore", "gateway", "mcp", "tools"],
  },
  {
    id: "agc-fc-041",
    service: "AgentCore Gateway",
    domain: "development",
    difficulty: "medium",
    question: "What is semantic tool selection in AgentCore Gateway?",
    answer:
      "Agents search the tool catalog using natural language context to find the most relevant tools. Only matching tool definitions are included in the prompt, keeping context window usage small even when thousands of tools are registered.",
    keyPoints: [
      "Solves the 'too many tools for the prompt' problem",
      "Agents send semantic search queries; Gateway returns relevant tools",
      "Search API: $0.025/1,000 invocations",
      "Tool indexing: $0.02/100 tools indexed per month",
    ],
    tags: ["agentcore", "gateway", "semantic-search", "tool-selection"],
  },
  {
    id: "agc-fc-042",
    service: "AgentCore Gateway",
    domain: "development",
    difficulty: "hard",
    question: "What are the pricing tiers for AgentCore Gateway?",
    answer:
      "API invocations: $0.005/1,000. Semantic search API: $0.025/1,000. Tool indexing: $0.02/100 tools/month. Identity auth is free when used through Gateway.",
    keyPoints: [
      "Tool call invocations: $0.005/1,000",
      "Semantic tool search: $0.025/1,000 queries",
      "Tool indexing: $0.02/100 tools/month (recurring)",
      "Policy authorization: $0.000025/request (separate)",
    ],
    tags: ["agentcore", "gateway", "pricing"],
  },
  {
    id: "agc-fc-043",
    service: "AgentCore Gateway",
    domain: "development",
    difficulty: "easy",
    question:
      "Which enterprise services have 1-click integrations in AgentCore Gateway?",
    answer: "Salesforce, Slack, Jira, Asana, and Zendesk.",
    keyPoints: [
      "All five use OAuth-managed authentication",
      "No custom integration code required",
      "Pre-built MCP tool definitions included",
      "Additional services available via OpenAPI/Smithy/Lambda",
    ],
    tags: ["agentcore", "gateway", "integrations"],
  },

  // ─── Code Interpreter ────────────────────────────────────────────────────────
  {
    id: "agc-fc-050",
    service: "AgentCore Code Interpreter",
    domain: "development",
    difficulty: "easy",
    question: "What languages does AgentCore Code Interpreter support?",
    answer: "Python, JavaScript, and TypeScript.",
    keyPoints: [
      "Pre-installed common libraries in default environment",
      "Custom environments supported with additional packages",
      "Sandboxed containerized execution — isolated from host",
      "Code runs deterministically unlike LLM reasoning",
    ],
    tags: ["agentcore", "code-interpreter", "languages"],
  },
  {
    id: "agc-fc-051",
    service: "AgentCore Code Interpreter",
    domain: "development",
    difficulty: "medium",
    question:
      "What are the file size limits for AgentCore Code Interpreter, and how do they differ?",
    answer:
      "Inline upload (API request): up to 100 MB. Via S3 using terminal commands: up to 5 GB.",
    keyPoints: [
      "100 MB limit for inline/direct file uploads",
      "5 GB limit when referencing S3 files via terminal",
      "Use S3 path for large datasets (CSV, Excel, JSON)",
      "CloudTrail logging captures all execution",
    ],
    tags: ["agentcore", "code-interpreter", "file-limits"],
  },
  {
    id: "agc-fc-052",
    service: "AgentCore Code Interpreter",
    domain: "development",
    difficulty: "medium",
    question:
      "What is the default and maximum execution time for a Code Interpreter session?",
    answer: "Default: 15 minutes. Maximum: 8 hours.",
    keyPoints: [
      "Default 15 min is configurable",
      "Maximum matches Runtime microVM max (8 hours)",
      "Long execution supports complex data pipelines",
      "Use try/except and close sessions when done",
    ],
    tags: ["agentcore", "code-interpreter", "session", "timeout"],
  },

  // ─── Browser ─────────────────────────────────────────────────────────────────
  {
    id: "agc-fc-060",
    service: "AgentCore Browser",
    domain: "development",
    difficulty: "medium",
    question:
      "What is the difference between the AWS-managed browser and a custom browser in AgentCore?",
    answer:
      "AWS-managed (aws.browser.v1): quick setup with defaults. Custom browser: adds session recording (stored in S3), custom network settings, specific IAM execution roles, and custom root CA certificates.",
    keyPoints: [
      "aws.browser.v1: ready-to-use, no config",
      "Custom: session recording, custom network, custom IAM role",
      "Session recording stores to your S3 bucket",
      "Both support Playwright, Nova Act, Strands",
    ],
    tags: ["agentcore", "browser", "custom", "session-recording"],
  },
  {
    id: "agc-fc-061",
    service: "AgentCore Browser",
    domain: "development",
    difficulty: "easy",
    question: "What is Live View in AgentCore Browser?",
    answer:
      "A real-time stream of the browser session that allows a human to observe and directly interact with the browser while the agent is running — enabling human-in-the-loop supervision for sensitive workflows.",
    keyPoints: [
      "Real-time monitoring and interaction",
      "Human can take over browser control",
      "Does NOT produce a stored replay (that's session recording)",
      "Available on both aws.browser.v1 and custom browsers",
    ],
    tags: ["agentcore", "browser", "live-view", "human-in-loop"],
  },
  {
    id: "agc-fc-062",
    service: "AgentCore Browser",
    domain: "development",
    difficulty: "hard",
    question:
      "What does session recording capture in AgentCore Browser and where is it stored?",
    answer:
      "DOM changes, user actions performed by the agent, browser console logs, and network events. Stored in your Amazon S3 bucket. Replayable through the AWS Console with video playback, timeline navigation, and action tracking.",
    keyPoints: [
      "Custom browsers only (not aws.browser.v1)",
      "Captured: DOM changes, actions, console logs, network events",
      "Stored in customer's S3 bucket",
      "Replay in AWS Console: video, timeline, action tracking",
    ],
    tags: ["agentcore", "browser", "session-recording", "observability"],
  },
  {
    id: "agc-fc-063",
    service: "AgentCore Browser",
    domain: "development",
    difficulty: "hard",
    question: "What is the pricing for AgentCore Browser and Code Interpreter?",
    answer:
      "Both are $0.0895 per vCPU-hour and $0.00945 per GB-hour — identical pricing, and lower than Runtime microVMs ($0.1276/vCPU-hr, $0.0169/GB-hr).",
    keyPoints: [
      "Browser = Code Interpreter pricing (same rates)",
      "Both cheaper per vCPU-hr than Runtime microVMs",
      "Browser profile storage: S3 Standard rates (from April 2026)",
      "Web Search: separate $7.00/1,000 queries",
    ],
    tags: ["agentcore", "browser", "code-interpreter", "pricing"],
  },

  // ─── AWS Agent Registry ───────────────────────────────────────────────────────
  {
    id: "agc-fc-070",
    service: "AWS Agent Registry",
    domain: "development",
    difficulty: "medium",
    question: "What is AWS Agent Registry and what is its free tier?",
    answer:
      "A service for discovering and sharing agents and tools across an organization. Free tier: 5,000 records, 1M Search API calls, and 2M combined Get/List API calls per month.",
    keyPoints: [
      "Discover and share agents/tools org-wide",
      "Free tier: 5,000 records, 1M search calls, 2M get/list calls/month",
      "After free tier: $0.400/1,000 records, $0.020/1,000 search calls",
      "Part of the AgentCore platform",
    ],
    tags: ["agentcore", "agent-registry", "free-tier"],
  },
];
