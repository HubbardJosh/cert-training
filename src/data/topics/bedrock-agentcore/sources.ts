import { Source } from "../../sources";

// Sources verified 2026-09-25 against current AWS docs (bedrock-agentcore devguide)
export const sources: Source[] = [
  {
    title: "Amazon Bedrock AgentCore – Overview",
    url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-agentcore.html",
    topics: [
      "Fully managed platform for deploying AI agents at scale",
      "Framework-agnostic: works with LangGraph, CrewAI, Strands, OpenAI Agents SDK, custom agents",
      "Components: Runtime, Gateway, Memory, Identity, Code Interpreter, Browser, AWS Agent Registry",
      "Replaces need to manage custom agent infrastructure",
    ],
  },
  {
    title: "AgentCore Runtime",
    url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html",
    topics: [
      "Two compute types: microVMs (serverless, max 8 hours) and Instances (EC2-backed, max 14 days)",
      "microVM v2 pricing: $0.1276/vCPU-hour, $0.0169/GB-hour (consumption-based)",
      "Instance pricing: EC2 On-Demand + 12% CPU management fee, 7.8% GPU management fee",
      "Session isolation: dedicated microVM per user session, wiped after session ends",
      "Protocol support: MCP, A2A, AG-UI, HTTP, WebSocket",
    ],
  },
  {
    title: "AgentCore Gateway",
    url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html",
    topics: [
      "Converts OpenAPI, Smithy, and Lambda into MCP-compatible tools",
      "1-click integrations: Salesforce, Slack, Jira, Asana, Zendesk",
      "Handles both inbound auth (who reaches the gateway) and outbound auth (credentials per tool)",
      "Semantic tool selection: agents search thousands of tools by context",
      "API invocations: $0.005/1,000; semantic search: $0.025/1,000; tool indexing: $0.02/100 tools/month",
    ],
  },
  {
    title: "AgentCore Memory",
    url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html",
    topics: [
      "Short-term: within-session context; $0.25/1,000 new events",
      "Long-term: cross-session extraction; $0.75/1,000 records/month storage, $0.50/1,000 retrievals",
      "Automatic extraction of preferences, facts, and session summaries",
      "No custom vector database or extraction pipeline required",
    ],
  },
  {
    title: "AgentCore Identity",
    url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html",
    topics: [
      "Workload identities for agents; integrates Okta, Microsoft Entra ID, Amazon Cognito",
      "Outbound auth: OAuth, API keys, token refresh for agent-to-service calls",
      "Consent portal for auditable user authorization",
      "Pricing: $0.010/1,000 token or API key requests; FREE when used through Runtime or Gateway",
    ],
  },
  {
    title: "AgentCore Code Interpreter",
    url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html",
    topics: [
      "Languages: Python, JavaScript, TypeScript",
      "File limits: 100 MB inline, 5 GB via S3",
      "Execution time: default 15 min, max 8 hours",
      "Network access is configurable (can be air-gapped for sensitive workloads)",
      "Pricing: $0.0895/vCPU-hour, $0.00945/GB-hour",
    ],
  },
  {
    title: "AgentCore Browser",
    url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html",
    topics: [
      "Session: default 15 min, max 8 hours",
      "Two browser types: aws.browser.v1 (quick setup) and custom (session recording, network settings)",
      "Session recording: DOM changes, actions, console logs, network events — stored in S3",
      "Live View: real-time human observation and interaction",
      "Pricing: $0.0895/vCPU-hour, $0.00945/GB-hour (identical to Code Interpreter)",
    ],
  },
  {
    title: "AgentCore Pricing",
    url: "https://aws.amazon.com/bedrock/agentcore/pricing/",
    topics: [
      "All per-component pricing confirmed 2026-09-25",
      "Web Search: $7.00/1,000 queries",
      "microVM v1: $0.0895/vCPU-hour (same rate as Code Interpreter and Browser)",
      "microVM v2 committed baseline: $0.0997/vCPU-hour (vs $0.1276 consumption)",
    ],
  },
];
