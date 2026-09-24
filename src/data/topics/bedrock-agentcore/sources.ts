import { Source } from "../../sources";

// Source: https://docs.aws.amazon.com/bedrock/latest/userguide/agents-agentcore.html
export const sources: Source[] = [
  {
    title: "Amazon Bedrock AgentCore – Overview",
    url: "https://docs.aws.amazon.com/bedrock/latest/userguide/agents-agentcore.html",
    topics: [
      "Fully managed platform for deploying AI agents at scale",
      "Framework-agnostic: works with LangGraph, CrewAI, Strands, custom agents",
      "Components: Runtime, Gateway, Memory, Identity, Code Interpreter, Browser",
      "Replaces need to manage custom agent infrastructure",
    ],
  },
  {
    title: "AgentCore Runtime",
    url: "https://docs.aws.amazon.com/bedrock/latest/userguide/agents-agentcore-runtime.html",
    topics: [
      "Containerized agent execution environment",
      "Auto-scaling from 0 to thousands of concurrent sessions",
      "Session context maintained per invocation",
      "CloudWatch Logs and X-Ray tracing integration",
      "VPC support for private network access",
    ],
  },
  {
    title: "AgentCore Gateway",
    url: "https://docs.aws.amazon.com/bedrock/latest/userguide/agents-agentcore-gateway.html",
    topics: [
      "Connects agents to external APIs and enterprise systems",
      "Supported protocols: REST (OpenAPI), GraphQL, MCP",
      "Automatic credential injection — agents never see raw secrets",
      "Lambda executor for custom tool logic",
      "mTLS support for secure upstream connections",
    ],
  },
  {
    title: "AgentCore Memory",
    url: "https://docs.aws.amazon.com/bedrock/latest/userguide/agents-agentcore-memory.html",
    topics: [
      "In-session memory: scoped to a single conversation",
      "Cross-session memory: persists facts across conversations",
      "Semantic search over stored memories",
      "Automatic summarization of long conversations",
      "Memory namespaces for multi-tenant isolation",
    ],
  },
  {
    title: "AgentCore Identity",
    url: "https://docs.aws.amazon.com/bedrock/latest/userguide/agents-agentcore-identity.html",
    topics: [
      "OAuth 2.0 token exchange for acting on behalf of users",
      "Supported providers: Cognito, Okta, Ping, custom OIDC",
      "Scoped permissions — agents receive user-scoped tokens only",
      "Audit trail of all identity operations via CloudTrail",
    ],
  },
  {
    title: "AgentCore Code Interpreter",
    url: "https://docs.aws.amazon.com/bedrock/latest/userguide/agents-agentcore-code-interpreter.html",
    topics: [
      "Sandboxed Python execution for agents",
      "Supports data analysis, chart generation, and file processing",
      "Network-isolated sandbox — no internet access",
      "Session-scoped filesystem: files persist within a session only",
      "Pre-installed: NumPy, Pandas, Matplotlib, scikit-learn",
    ],
  },
  {
    title: "AgentCore Browser",
    url: "https://docs.aws.amazon.com/bedrock/latest/userguide/agents-agentcore-browser.html",
    topics: [
      "Managed headless browser for web navigation",
      "Actions: navigate, click, type, screenshot, extract",
      "Screenshot-based interaction using vision models",
      "Session isolation — each agent session gets its own browser",
      "Not a general web scraper: designed for agent-driven task completion",
    ],
  },
  {
    title: "Amazon Bedrock – User Guide",
    url: "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html",
    topics: [
      "Foundation model access via unified API",
      "Agents for Bedrock (pre-AgentCore orchestration layer)",
      "Knowledge Bases for RAG",
      "Guardrails for content filtering and PII redaction",
      "Model evaluation and prompt management",
    ],
  },
];
