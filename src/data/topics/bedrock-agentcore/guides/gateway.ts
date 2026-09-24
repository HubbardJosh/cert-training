import { ServiceGuide } from "../../../../types/guide";

// Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html
// Source: https://aws.amazon.com/bedrock/agentcore/pricing/
export const gatewayGuide: ServiceGuide = {
  id: "agentcore-gateway",
  service: "AgentCore Gateway",
  domain: "development",
  tagline:
    "Unified, secure entry point for agentic traffic — tools, agents, and models through one endpoint",
  intro:
    "AgentCore Gateway is a fully managed AI gateway that provides a single, secure entry point for all agentic traffic. It converts APIs, Lambda functions, and services into MCP-compatible tools; routes agent-to-agent traffic; manages model inference across providers; and handles both inbound and outbound authentication — all without custom integration code.",

  sections: [
    {
      heading: "What Gateway Does",
      body: `Gateway unifies four distinct connectivity concerns behind one managed service:

**1. Tool conversion** — Transforms existing APIs (OpenAPI specs, Smithy), Lambda functions, and enterprise services into **MCP-compatible tools** that any agent framework can discover and call. Eliminates weeks of writing adapter code for each integration.

**2. Agent-to-agent routing (A2A)** — Routes traffic between agents using the A2A protocol, enabling orchestrator agents to delegate work to specialist agents. Also supports HTTP passthrough for any agent or service that speaks HTTP.

**3. Model inference routing** — Routes inference requests across multiple model providers (Bedrock, Anthropic, OpenAI, etc.) through a single unified endpoint. Enables model failover, load balancing, and provider switching without changing application code.

**4. Authentication management** — Handles both:
- **Inbound auth**: Verifying the identity of agents or users reaching the gateway (OAuth authorization)
- **Outbound auth**: Injecting the correct credentials for each downstream tool — OAuth flows, token refresh, API keys, stored securely

Gateway is described as "the only solution that provides both comprehensive ingress authentication and egress authentication in a fully managed service."`,
      quiz: [
        {
          question:
            "A developer's agent needs to call five different services: Slack (OAuth), an internal REST API (API key), a Lambda function (IAM), Salesforce (OAuth), and another agent (A2A). They want a single integration point. Which AgentCore component addresses all five?",
          options: [
            "AgentCore Identity — manages all credentials centrally",
            "AgentCore Runtime — the agent runs inside Runtime which handles tool calls",
            "AgentCore Gateway — unified entry point converting all sources to MCP tools with managed auth",
            "AgentCore Memory — stores credentials and connection details for all services",
          ],
          correctIndex: 2,
          explanation:
            "AgentCore Gateway converts APIs, Lambda functions, and services into MCP-compatible tools with managed outbound authentication (OAuth, API keys, IAM). It also routes A2A traffic for agent-to-agent calls and includes 1-click integrations for Slack and Salesforce. A single Gateway endpoint replaces five separate integrations. Identity manages workload identities; Runtime is the execution host; Memory stores conversation knowledge.",
        },
        {
          question:
            "What does 'inbound authentication' mean in the context of AgentCore Gateway?",
          options: [
            "The credentials Gateway uses to call downstream tools on behalf of the agent",
            "Verifying the identity of agents or users who are calling into the Gateway",
            "The OAuth token the agent presents when calling external APIs",
            "The IAM role attached to the Lambda function behind the Gateway",
          ],
          correctIndex: 1,
          explanation:
            "Inbound authentication means verifying who is allowed to reach your Gateway — ensuring that only authorized agents or users can invoke it. This is distinct from outbound authentication, which is the credentials Gateway injects when calling downstream tools (Slack tokens, Salesforce OAuth, API keys, etc.). Gateway manages both directions, which is the key differentiator from other gateway products.",
        },
      ],
    },
    {
      heading: "Semantic Tool Selection",
      body: `One of Gateway's most powerful capabilities for production deployments is **semantic tool selection**:

**The problem**: An enterprise with 500+ tools cannot include all tool descriptions in every agent prompt — the prompt would exceed most model context windows, slow down inference, and increase cost.

**Gateway's solution**: Agents can **search** the tool catalog using natural language. Gateway's built-in semantic search finds the most relevant tools for the current task context, and only those tool descriptions are injected into the prompt.

**How it works**:
1. Tools are indexed in Gateway (OpenAPI spec, Lambda schema, etc.)
2. At query time, the agent sends a semantic search query describing what it needs
3. Gateway returns the most relevant tool definitions
4. The agent includes only those definitions in its prompt

**Result**: Agents can work effectively across thousands of tools while maintaining small prompt sizes and low latency. Tool indexing costs $0.02 per 100 tools indexed per month; semantic search API costs $0.025 per 1,000 invocations.

**Supported input types**: OpenAPI, Smithy, and Lambda function definitions.`,
      quiz: [
        {
          question:
            "An agent platform has 2,000 registered tools. The agent's LLM has a 200K token context window, but including all 2,000 tool descriptions would exceed it and significantly slow inference. What is the Gateway feature that solves this?",
          options: [
            "Gateway tool pagination — tools are loaded in batches of 50",
            "Gateway semantic tool selection — agents search for relevant tools by context and only those descriptions are included in the prompt",
            "Gateway tool compression — tool schemas are compressed before being sent to the model",
            "Gateway tool caching — frequently used tools are pre-loaded into the agent's context",
          ],
          correctIndex: 1,
          explanation:
            "Semantic tool selection allows agents to search the tool catalog using natural language context and retrieve only the most relevant tool definitions. This keeps prompt sizes small regardless of how many tools exist in the catalog. Tools are indexed (at $0.02/100 tools/month) and retrieved via semantic search (at $0.025/1,000 invocations). No compression, pagination, or caching approach is offered.",
        },
      ],
    },
    {
      heading: "1-Click Integrations and Supported Targets",
      body: `Gateway provides pre-built 1-click integrations for popular enterprise tools:

| Service | Integration |
|---|---|
| Salesforce | OAuth-managed CRM access |
| Slack | OAuth-managed messaging and channels |
| Jira | OAuth-managed project/issue tracking |
| Asana | OAuth-managed task management |
| Zendesk | OAuth-managed support ticketing |

Beyond 1-click integrations, Gateway supports any of these as targets:
- **OpenAPI-defined REST APIs** (convert to MCP tools)
- **Smithy-defined APIs** (convert to MCP tools)
- **AWS Lambda functions** (convert to MCP tools)
- **Other agents** (A2A passthrough)
- **HTTP services** (passthrough targets)
- **Model providers** (for the inference routing endpoint)

**Framework compatibility**: Gateway works with CrewAI, LangGraph, LlamaIndex, and Strands Agents out of the box.`,
      quiz: [
        {
          question:
            "A development team wants to give their agent access to Jira and Asana for project management, plus their internal ticketing system (a REST API with an OpenAPI spec). Which statement about AgentCore Gateway is correct?",
          options: [
            "Jira and Asana require custom OAuth integration code; only Salesforce and Slack have 1-click support",
            "The OpenAPI REST API can be converted to an MCP tool, but Jira and Asana must be handled by AgentCore Identity",
            "Jira and Asana both have 1-click integrations; the OpenAPI REST API can be registered as an MCP tool via its spec",
            "All three require Lambda function wrappers before Gateway can route to them",
          ],
          correctIndex: 2,
          explanation:
            "Jira and Asana are both in Gateway's 1-click integration list (alongside Salesforce, Slack, and Zendesk). OpenAPI-defined REST APIs are a natively supported target type — Gateway converts them to MCP-compatible tools from the spec. No Lambda wrappers or custom OAuth code are needed for any of the three. Identity manages workload identities, not third-party OAuth flows; Gateway handles those.",
        },
      ],
    },
    {
      heading: "Pricing",
      body: `Gateway pricing is per-invocation with separate rates for different operation types:

| Operation | Price |
|---|---|
| API invocations (tool calls) | $0.005 per 1,000 invocations |
| Semantic search API | $0.025 per 1,000 invocations |
| Tool indexing | $0.02 per 100 tools indexed per month |
| Identity (inbound/outbound auth via Gateway) | **Free** when used through Runtime or Gateway |

The $0.005 per 1,000 invocations rate applies to standard tool calls through the Gateway. Semantic search (used when agents query the tool catalog) is priced separately at $0.025 per 1,000 invocations.

**Identity cost note**: AgentCore Identity normally costs $0.010 per 1,000 token or API key requests, but this fee is waived when Identity is used as part of Runtime or Gateway flows.

Source: https://aws.amazon.com/bedrock/agentcore/pricing/`,
      quiz: [
        {
          question:
            "An agent makes 500,000 tool calls per day through AgentCore Gateway. What is the daily cost for these invocations at standard rates?",
          options: ["$0.25", "$2.50", "$25.00", "$250.00"],
          correctIndex: 1,
          explanation:
            // 500,000 / 1,000 = 500 units × $0.005 = $2.50
            "Gateway API invocations are priced at $0.005 per 1,000 invocations. 500,000 invocations = 500 units × $0.005 = $2.50 per day. This excludes any semantic search queries (priced separately at $0.025/1,000) and tool indexing fees ($0.02/100 tools/month).",
        },
      ],
    },
  ],

  keyFacts: [
    "Gateway = unified entry point for tools, agents (A2A), and model inference",
    "Converts OpenAPI, Smithy, and Lambda into MCP-compatible tools",
    "1-click integrations: Salesforce, Slack, Jira, Asana, Zendesk",
    "Only managed service providing both inbound AND outbound authentication",
    "Semantic tool selection: agents search thousands of tools by context, keeping prompt size small",
    "API invocations: $0.005/1,000; semantic search: $0.025/1,000; tool indexing: $0.02/100 tools/month",
    "Identity auth is FREE when used through Runtime or Gateway",
    "Framework support: CrewAI, LangGraph, LlamaIndex, Strands Agents",
    "Supports A2A (agent-to-agent), passthrough HTTP, and model inference routing",
    // Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html
  ],

  relatedServices: [
    "Amazon Bedrock AgentCore Runtime",
    "Amazon Bedrock AgentCore Identity",
    "AWS Lambda",
    "Amazon API Gateway",
    "Salesforce",
    "Slack",
    "Jira",
  ],

  examTips: [
    "Gateway is the ONLY managed service providing BOTH inbound + outbound auth — a key differentiator",
    "Semantic tool selection = agents search by context, not include ALL tools in every prompt",
    "1-click integrations: Salesforce, Slack, Jira, Asana, Zendesk — memorize this list",
    "Identity auth costs $0 when used through Runtime or Gateway (waived)",
    "Supported input types for tools: OpenAPI, Smithy, Lambda — NOT arbitrary HTTP URLs",
    "Model inference routing = switch providers without changing application code",
    "A2A through Gateway = agent delegates to another agent (not tool calls)",
  ],
};
