import { ServiceGuide } from "../../../../types/guide";

// Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-agentcore.html
// Source: https://aws.amazon.com/bedrock/agentcore/
export const overviewGuide: ServiceGuide = {
  id: "agentcore-overview",
  service: "Amazon Bedrock AgentCore",
  domain: "development",
  tagline:
    "The production platform for AI agents — any framework, any model, secure at scale",
  intro:
    "Amazon Bedrock AgentCore is a fully managed platform that provides the infrastructure, security, and tooling needed to deploy AI agents to production. Rather than rebuilding common agent infrastructure (secure execution, memory, identity, tool connectivity) for every project, AgentCore offers these as composable managed services. You write agent logic locally with any framework, then deploy it to production unchanged.",

  sections: [
    {
      heading: "What Problem AgentCore Solves",
      body: `Building a prototype AI agent is straightforward. Getting that agent production-ready is not. The gap between "demo" and "production" typically involves solving several undifferentiated infrastructure problems:

- **Secure execution**: Each user's agent session must be isolated so one session can't read another's memory or state
- **Long-running tasks**: Agents orchestrating multi-step workflows can run for hours; standard web servers time out in seconds
- **Tool connectivity**: Agents need to call internal APIs, Lambda functions, Slack, Salesforce, and dozens of other services — each with its own auth flow
- **Memory**: Without a memory layer, each conversation starts cold with no knowledge of prior sessions
- **Identity**: Agents acting on behalf of users must prove identity and be granted only the permissions that user holds
- **Observability**: Unlike a deterministic function, an agent makes chains of decisions — you need visibility into every reasoning step and tool call

AgentCore packages all of these as managed services so you focus on your agent's core business logic instead.`,
      quiz: [
        {
          question:
            "What is the primary problem Amazon Bedrock AgentCore is designed to solve?",
          options: [
            "Providing access to foundation models through a single API",
            "Reducing the undifferentiated infrastructure work required to run AI agents in production",
            "Replacing AWS Lambda for serverless compute workloads",
            "Offering a visual drag-and-drop interface for building AI workflows",
          ],
          correctIndex: 1,
          explanation:
            "AgentCore addresses the production gap: prototype agents are easy to build, but deploying them securely at scale requires solving execution isolation, long-running tasks, tool connectivity, memory, identity, and observability. AgentCore packages these as managed services. It is not a model-access service (that's Bedrock itself), not a replacement for Lambda, and has no drag-and-drop UI.",
        },
        {
          question:
            "Which of the following is NOT a problem that Amazon Bedrock AgentCore is designed to address?",
          options: [
            "Session isolation between concurrent agent users",
            "Long-running task execution beyond standard HTTP timeouts",
            "Training foundation models from scratch on custom datasets",
            "Credential management for agents calling third-party services",
          ],
          correctIndex: 2,
          explanation:
            "AgentCore handles execution, memory, identity, tool connectivity, and observability — all the production infrastructure around running agents. Training foundation models from scratch is addressed by SageMaker or Bedrock Custom Model Training, not AgentCore. AgentCore consumes already-trained models.",
        },
      ],
    },
    {
      heading: "The Seven Components of AgentCore",
      body: `AgentCore is not a single service — it is a platform composed of seven integrated components, each addressing a specific production concern:

**1. Runtime** — Secure, serverless hosting for agent code. Deploys containers into isolated microVMs (or EC2 instances for GPU/long-running workloads). Each user session gets its own microVM; after the session ends the VM is wiped. Supports sessions up to 8 hours on microVMs, up to 14 days on Instances.

**2. Memory** — Managed short-term and long-term memory for agents. Short-term captures turn-by-turn context within a session. Long-term automatically extracts and stores preferences, facts, and summaries across sessions. Eliminates the need to build your own vector store + extraction pipeline.

**3. Identity** — Workload identity and credential management for agents. Assigns identities to agents, integrates with corporate identity providers (Okta, Microsoft Entra, Cognito), and manages outbound OAuth/API-key flows so agents can call third-party services securely on behalf of users.

**4. Gateway** — Unified, secure entry point for all agentic traffic. Converts APIs, Lambda functions, and services into MCP-compatible tools. Routes model inference across providers. Handles both inbound auth (who can reach the gateway) and outbound auth (credentials for each tool). Includes 1-click integrations for Slack, Salesforce, Jira, Asana, and Zendesk.

**5. Code Interpreter** — Sandboxed code execution environment. Agents can write and run Python, JavaScript, and TypeScript code in isolated containers. Supports files up to 100 MB inline, 5 GB via S3. Default execution time is 15 minutes; extensible up to 8 hours.

**6. Browser** — Containerized remote browser for web interaction. Agents can navigate websites, click elements, fill forms, and take screenshots. Sessions default to 15 minutes, maximum 8 hours. Includes live view (real-time human observation), session recording (stored in S3), and CloudTrail logging.

**7. AWS Agent Registry** — Discover and share agents and tools across your organization. Free tier includes 5,000 records, 1M Search API calls, and 2M Get/List API calls per month.`,
      quiz: [
        {
          question:
            "An AI agent needs to remember a user's seating preference from a flight booking session six months ago and apply it automatically in a new session. Which AgentCore component handles this?",
          options: [
            "AgentCore Runtime (persistent filesystem)",
            "AgentCore Memory (long-term)",
            "AgentCore Identity (user profile)",
            "AgentCore Gateway (session state)",
          ],
          correctIndex: 1,
          explanation:
            "Long-term memory in AgentCore Memory automatically extracts and stores preferences, facts, and summaries across sessions. This is the exact use case described: remembering a user preference from a prior session and surfacing it in a new one. Runtime's persistent filesystem stores files, not extracted knowledge. Identity manages authentication, not conversation knowledge. Gateway handles tool routing.",
        },
        {
          question:
            "An agent needs to call Slack, Salesforce, and an internal Lambda function, each requiring different authentication. Which AgentCore component simplifies this?",
          options: [
            "AgentCore Runtime",
            "AgentCore Code Interpreter",
            "AgentCore Gateway",
            "AgentCore Browser",
          ],
          correctIndex: 2,
          explanation:
            "AgentCore Gateway handles both inbound and outbound authentication, manages OAuth flows and credential storage for third-party services, and converts APIs and Lambda functions into MCP-compatible tools behind a single endpoint. It includes 1-click integrations for Slack and Salesforce. Runtime is the execution environment; Code Interpreter is for running code; Browser is for web navigation.",
        },
      ],
    },
    {
      heading: "Framework and Model Flexibility",
      body: `A key design principle of AgentCore is that it does not force you into a specific agent framework or model provider. You can deploy agents built with:

- **LangGraph** (LangChain's stateful graph-based agent framework)
- **Strands** (AWS's own agent SDK, tight integration with AgentCore)
- **CrewAI** (multi-agent collaboration framework)
- **OpenAI Agents SDK**
- **Claude Agent SDK**
- **LlamaIndex**
- **Custom framework** (any code that serves HTTP or WebSocket requests)

Similarly, AgentCore Runtime works with any model — Amazon Bedrock models (Claude, Nova, Titan), Anthropic Claude directly, Google Gemini, OpenAI, or any model accessible via API.

**The deploy story**: You write your agent code locally, test it there, then deploy it to AgentCore Runtime with minimal changes — typically just adding the \`@bedrock_agentcore_client.entrypoint\` decorator (for the Strands SDK) or containerizing your existing code. The code that runs locally is the same code that runs in production.`,
      quiz: [
        {
          question:
            "A team has already built a production LangGraph agent that uses Gemini as its model. What happens when they migrate to AgentCore Runtime?",
          options: [
            "They must rewrite the agent using the Strands SDK",
            "They must switch to a Bedrock-hosted model",
            "They can deploy their existing LangGraph code using any model without rewriting",
            "They need to use Bedrock Agents instead of AgentCore Runtime",
          ],
          correctIndex: 2,
          explanation:
            "AgentCore Runtime is framework-agnostic and model-agnostic. LangGraph, CrewAI, Strands, OpenAI Agents SDK, and custom frameworks are all supported. Models from any provider — including Google Gemini — work without modification. The key value is that local code deploys to production unchanged.",
        },
      ],
    },
    {
      heading: "How AgentCore Relates to Other Bedrock Services",
      body: `Amazon Bedrock is an umbrella service containing multiple capabilities. Understanding where AgentCore fits relative to other Bedrock services prevents confusion:

| Bedrock capability | What it does | Relationship to AgentCore |
|---|---|---|
| **Bedrock model inference** | Call foundation models (Claude, Nova, etc.) via API | AgentCore uses Bedrock models, but also works with non-Bedrock models |
| **Bedrock Agents** (legacy) | High-level orchestration: define action groups in the console, attach knowledge bases, invoke via InvokeAgent API | Older, more opinionated approach. AgentCore Runtime is the newer, framework-flexible replacement for hosting agent logic |
| **Bedrock Knowledge Bases** | Managed RAG: chunk documents, embed, store in vector DB, retrieve at query time | Can be connected as a tool through AgentCore Gateway |
| **Bedrock Flows** | Visual workflow builder for chaining prompts and tools | Separate from AgentCore; for simpler, predefined workflows |
| **AgentCore** | Infrastructure platform for running any agent in production | The execution, memory, identity, connectivity, and observability layer |

**Key distinction**: Bedrock Agents is a managed, opinionated orchestration service where AWS handles the agent loop. AgentCore Runtime gives you full control — you write the agent loop yourself (or use a framework), and AgentCore provides the secure execution environment, session isolation, and integrated tooling.`,
      quiz: [
        {
          question:
            "How does Amazon Bedrock AgentCore Runtime differ from Amazon Bedrock Agents (the legacy service)?",
          options: [
            "AgentCore Runtime is only available for Python; Bedrock Agents supports any language",
            "Bedrock Agents requires you to write the agent loop; AgentCore Runtime manages it automatically",
            "AgentCore Runtime gives you control over the agent framework and loop; Bedrock Agents is opinionated about orchestration",
            "AgentCore Runtime is only for single-turn interactions; Bedrock Agents supports multi-turn",
          ],
          correctIndex: 2,
          explanation:
            "Bedrock Agents (legacy) is an opinionated managed service where AWS manages the agent loop — you define action groups and knowledge bases via the console/API, and AWS orchestrates reasoning and tool calls. AgentCore Runtime is the framework-flexible hosting environment: you write your own agent loop (or use LangGraph, Strands, CrewAI, etc.) and AgentCore provides secure execution, session isolation, and integrated services. AgentCore supports any language that can be containerized and supports multi-turn sessions up to 14 days.",
        },
      ],
    },
  ],

  keyFacts: [
    "AgentCore = 7 components: Runtime, Memory, Identity, Gateway, Code Interpreter, Browser, AWS Agent Registry",
    "Framework-agnostic: LangGraph, Strands, CrewAI, OpenAI Agents SDK, Claude Agent SDK, custom",
    "Model-agnostic: works with Bedrock models, Anthropic, OpenAI, Google Gemini, and others",
    "Runtime microVM sessions: up to 8 hours; Runtime Instance sessions: up to 14 days",
    "Code Interpreter: Python, JavaScript, TypeScript; 100 MB inline files, 5 GB via S3; default 15 min, max 8 hours",
    "Browser: default 15-min session, max 8 hours; live view, session recording (S3), CloudTrail logging",
    "Gateway: converts APIs, Lambda, and services into MCP tools; 1-click integrations for Slack, Salesforce, Jira, Asana, Zendesk",
    "Memory: short-term (within session) + long-term (across sessions, auto-extracted facts/preferences)",
    "Identity: workload identities for agents; integrates Okta, Microsoft Entra, Cognito; manages outbound OAuth/API keys",
    "AWS Agent Registry free tier: 5,000 records, 1M Search API calls, 2M Get/List API calls per month",
    // Source: https://aws.amazon.com/bedrock/agentcore/pricing/
  ],

  relatedServices: [
    "Amazon Bedrock (model inference)",
    "Amazon Bedrock Agents (legacy orchestration)",
    "Amazon Bedrock Knowledge Bases",
    "AWS Lambda",
    "Amazon S3",
    "Amazon CloudWatch",
    "AWS CloudTrail",
    "Amazon Cognito",
    "AWS IAM",
  ],

  examTips: [
    "AgentCore is the INFRASTRUCTURE platform — it doesn't replace your agent logic, it hosts it securely",
    "Runtime microVM = serverless, pay-per-second, max 8 hours; Runtime Instance = EC2-backed, up to 14 days, supports GPU",
    "Gateway handles BOTH inbound auth (who reaches the gateway) AND outbound auth (credentials for each tool) — only managed service that does both",
    "Memory short-term = within session context; long-term = automatic extraction of facts/preferences across sessions",
    "AgentCore ≠ Bedrock Agents: Bedrock Agents manages the agent loop; AgentCore Runtime is where YOUR code runs",
    "Code Interpreter is sandboxed: secure, isolated execution — important for agents running untrusted or user-generated code",
    "AgentCore is framework-agnostic by design — LangGraph, Strands, CrewAI, etc. all work unchanged",
  ],

  topicQuiz: [
    {
      question:
        "A company wants to deploy an agent that browses internal SharePoint sites, fills out approval forms, and logs all web activity for compliance. Which AgentCore component addresses this?",
      options: [
        "AgentCore Code Interpreter (runs the form-filling logic)",
        "AgentCore Browser (isolated browser with session recording and CloudTrail logging)",
        "AgentCore Gateway (converts the SharePoint API into an MCP tool)",
        "AgentCore Runtime (deploys the agent in a secure container)",
      ],
      correctIndex: 1,
      explanation:
        "AgentCore Browser provides a secure, containerized browser where agents can navigate websites, fill forms, and click elements. Critically, it includes session recording (stored in S3) and CloudTrail logging for compliance audit trails. Code Interpreter runs code; Gateway converts APIs to MCP tools; Runtime is the execution host for the agent code itself, not for browser sessions.",
    },
    {
      question:
        "Which AgentCore pricing model charges only for actual CPU and memory consumed during active processing, excluding I/O wait time?",
      options: [
        "Runtime Instances (EC2-backed)",
        "Runtime microVMs (consumption-based)",
        "Gateway (per-invocation)",
        "Memory (per-event)",
      ],
      correctIndex: 1,
      explanation:
        // Source: https://aws.amazon.com/bedrock/agentcore/pricing/
        "Runtime microVMs use consumption-based pricing that aligns CPU billing with actual active processing — charges are typically eliminated during I/O wait periods when agents are waiting for LLM responses. Runtime Instances charge EC2 on-demand prices plus a management fee (12% for CPU, 7.8% for GPU G-series). Gateway charges per invocation. Memory charges per event and per record.",
    },
    {
      question:
        "An enterprise agent platform has 500 different tools (Lambda functions, APIs, Slack, Salesforce) that agents may call. The agent's context window is too small to include all 500 tool descriptions in every prompt. Which AgentCore capability addresses this?",
      options: [
        "AgentCore Memory (long-term storage of tool metadata)",
        "AgentCore Identity (access policies per tool)",
        "AgentCore Gateway (semantic tool selection)",
        "AgentCore Runtime (dynamic tool loading at session start)",
      ],
      correctIndex: 2,
      explanation:
        "AgentCore Gateway includes semantic tool selection — agents can search across thousands of available tools based on task context, finding the most relevant tools without needing all tool descriptions in the prompt. This reduces prompt size and latency at scale. Memory stores conversation knowledge; Identity manages credentials; Runtime hosts the agent code.",
    },
  ],
};
