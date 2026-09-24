import { ServiceGuide } from "../../../../types/guide";

// Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html
// Source: https://aws.amazon.com/bedrock/agentcore/pricing/
export const runtimeGuide: ServiceGuide = {
  id: "agentcore-runtime",
  service: "AgentCore Runtime",
  domain: "deployment",
  tagline:
    "Secure, serverless hosting for AI agents — any framework, isolated sessions",
  intro:
    "AgentCore Runtime provides a purpose-built execution environment for AI agents. Every user session runs in a dedicated microVM with isolated CPU, memory, and filesystem. When the session ends, the microVM is wiped — delivering deterministic security even for non-deterministic AI workloads. Agents deploy from local code to production with minimal changes.",

  sections: [
    {
      heading: "Two Compute Types: microVMs vs Instances",
      body: `AgentCore Runtime offers two compute models for different workload profiles:

**microVMs (Serverless)**
- Fully managed, serverless execution
- Starts from a snapshot for fast, consistent cold starts (V2 platform)
- Pay only for what you consume — CPU billing pauses during I/O wait (e.g., waiting for LLM responses)
- Sessions run up to **8 hours**
- Minimum 1-second billing increment, 128 MB minimum memory
- Best for: interactive agents, customer-facing apps, variable or bursty traffic

**Instances (EC2-backed)**
- Runs on AWS-managed Amazon EC2 in your account
- Sessions persist up to **14 days**
- Supports GPU-accelerated workloads (G-series instances, 7.8% management fee)
- Multiple collaborating agents can share a single instance
- CPU instances: EC2 On-Demand price + 12% management fee
- Best for: long-running autonomous agents, multi-agent workflows, GPU workloads

**Key difference**: microVMs are ephemeral and fully managed; Instances are persistent and support heavier workloads. Both provide session isolation.`,
      quiz: [
        {
          question:
            "An autonomous agent is tasked with a multi-day code refactor that runs for 72+ hours, requires GPU acceleration, and involves several collaborating sub-agents. Which AgentCore Runtime compute type should be used?",
          options: [
            "microVMs — they offer consumption-based pricing to reduce cost",
            "Instances — they support sessions up to 14 days, GPU workloads, and multi-agent collaboration",
            "microVMs V2 — the snapshot start reduces cold-start overhead for long tasks",
            "Neither — AgentCore Runtime only supports tasks under 8 hours",
          ],
          correctIndex: 1,
          explanation:
            "Runtime Instances support sessions up to 14 days, GPU-accelerated workloads (G-series EC2), and multiple collaborating agents on a shared instance — exactly the requirements described. microVMs are capped at 8 hours and are better for shorter, bursty workloads. AgentCore Runtime does support tasks beyond 8 hours via Instances.",
        },
        {
          question:
            // Source: https://aws.amazon.com/bedrock/agentcore/pricing/
            "What is the management fee added on top of EC2 On-Demand pricing for CPU-based Runtime Instances?",
          options: ["5%", "7.8%", "12%", "20%"],
          correctIndex: 2,
          explanation:
            "CPU-based Runtime Instances cost EC2 On-Demand price plus a 12% management fee. GPU G-series instances have a lower 7.8% management fee. microVMs use a different model: $0.1276 per vCPU-hour and $0.0169 per GB-hour for consumption-based pricing.",
        },
      ],
    },
    {
      heading: "Session Isolation and Security Model",
      body: `The security model of AgentCore Runtime centers on **session isolation via microVMs**:

- Each user session runs in a **dedicated microVM** with isolated CPU, memory, and filesystem
- Sessions are completely separated — one session cannot read another's memory or state
- After session completion, the **entire microVM is terminated and memory is sanitized**
- This provides deterministic security even for non-deterministic AI workloads (where agent reasoning is unpredictable)
- For Instances: sessions persist and multiple agents can share an instance, but IAM controls govern access

**Inbound authentication** (who can reach your agent) and **outbound authentication** (credentials the agent uses to call external services) are both handled natively through AgentCore Identity integration.

**Persistent filesystems**: Runtime supports persisting filesystem state across session stop/resume cycles. An agent's files, installed packages, and build artifacts survive session stops without needing external storage (e.g., S3 or EFS).`,
      quiz: [
        {
          question:
            "What happens to a microVM and its memory after an AgentCore Runtime session ends?",
          options: [
            "The microVM is paused and resumed for the next session to reduce startup time",
            "The microVM is terminated and memory is sanitized, providing deterministic security",
            "Memory state is archived to S3 for audit purposes before termination",
            "The microVM remains running for 30 minutes in case the user reconnects",
          ],
          correctIndex: 1,
          explanation:
            "When a session ends, the entire microVM is terminated and its memory is sanitized. This is a deliberate security design: it provides deterministic isolation even when the agent's reasoning is non-deterministic. The V2 platform uses snapshots for fast startup without retaining prior session state.",
        },
      ],
    },
    {
      heading: "Protocol Support and Communication",
      body: `AgentCore Runtime agents communicate using standard protocols, enabling interoperability across tools and agents:

**MCP (Model Context Protocol)**: Agents can deploy and expose tools as MCP servers, or connect to external MCP servers. MCP is the emerging standard for tool-use in agentic systems.

**A2A (Agent-to-Agent)**: Agents can communicate with other agents using the A2A protocol, enabling multi-agent collaboration where agents delegate sub-tasks to specialized agents.

**AG-UI**: For user-facing agents that need rich interactive interfaces, AG-UI protocol support enables structured front-end integration.

**HTTP and WebSocket**: Agents can be invoked via standard HTTP API calls or maintain persistent WebSocket connections for real-time bidirectional streaming. WebSocket connections enable immediate response feedback and maintained conversation context for interactive applications.

**Payload limits**: AgentCore Runtime handles payloads up to **100 MB**, supporting multi-modal content (text, images, audio, video) and large datasets.`,
      quiz: [
        {
          question:
            "A multi-agent system has a coordinator agent that delegates research tasks to a specialized research agent and writing tasks to a writing agent. Which protocol enables agent-to-agent communication in AgentCore Runtime?",
          options: [
            "MCP (Model Context Protocol) — the standard for tool-to-agent communication",
            "A2A (Agent-to-Agent) protocol — designed for agents communicating with other agents",
            "HTTP REST — standard request/response for all agent invocations",
            "AG-UI — the user interface protocol for agent orchestration",
          ],
          correctIndex: 1,
          explanation:
            "A2A (Agent-to-Agent) protocol is specifically designed for agents communicating with other agents in AgentCore Runtime, enabling multi-agent collaboration and task delegation. MCP is for agents connecting to tools (not other agents). HTTP REST is for external invocations of agents, not inter-agent communication. AG-UI is for user-facing interactive interfaces.",
        },
      ],
    },
    {
      heading: "Observability and Debugging",
      body: `AgentCore Runtime provides specialized observability designed for agent workloads — not just standard metrics, but agent-specific traces:

**Agent tracing**: Built-in tracing captures:
- Agent reasoning steps (the LLM's chain of thought)
- Tool invocations (what tool was called, with what parameters, and the result)
- Model interactions (which model, which prompt, latency)

This is critical because standard distributed tracing (X-Ray traces of Lambda calls) doesn't capture the semantic reasoning of an agent. You need to understand *why* an agent made a decision, not just *that* it called a function.

**CloudTrail integration**: All API calls are logged for compliance auditing.

**CloudWatch metrics**: Standard AWS metrics for request rates, errors, and latency at the service level.

The observability stack makes it possible to debug agent failures, identify reasoning errors, and audit agent behavior — all requirements for production AI systems.`,
      quiz: [
        {
          question:
            "Why does AgentCore Runtime provide specialized agent tracing rather than relying on standard AWS X-Ray distributed tracing?",
          options: [
            "X-Ray is not compatible with containerized workloads",
            "Standard tracing records function calls but not the semantic reasoning steps that explain why an agent made a decision",
            "Agent tracing is cheaper than X-Ray for high-volume workloads",
            "X-Ray cannot trace WebSocket connections used by agents",
          ],
          correctIndex: 1,
          explanation:
            "Standard distributed tracing (like X-Ray) records function calls, latency, and errors — but for an AI agent you need to understand the reasoning chain: why did the agent choose this tool, what did it 'think' before making the call, and how did it interpret the result. AgentCore's agent-specific tracing captures reasoning steps, tool invocations with parameters, and model interactions, giving the semantic visibility needed to debug agentic behavior.",
        },
      ],
    },
    {
      heading: "Pricing Model",
      body: `AgentCore Runtime uses a consumption-based pricing model that aligns costs with actual work done:

**microVMs (V2)**
| Resource | Price |
|---|---|
| CPU | $0.1276 per vCPU-hour |
| Memory | $0.0169 per GB-hour |
| Minimum billing | 1-second increments, 128 MB minimum |

*CPU billing typically pauses during I/O wait periods (e.g., while waiting for an LLM response), so you only pay for active processing.*

**Instances**
| Compute type | Price |
|---|---|
| CPU instances | EC2 On-Demand price + 12% management fee |
| GPU G-series | EC2 On-Demand price + 7.8% management fee |

*Sessions persist up to 14 days; you pay for the underlying EC2 instance duration.*

**Key pricing insight**: For interactive agents with bursty usage, microVMs are typically cheaper because you don't pay for idle time. For always-on or long-running agents, Instances may offer better economics at scale. As of October 2026, a committed baseline option for microVMs is planned.

Source: https://aws.amazon.com/bedrock/agentcore/pricing/`,
      quiz: [
        {
          question:
            "A developer is building a customer support agent that handles 200 concurrent users, each session lasting ~5 minutes with significant time spent waiting for the LLM to respond. Why are microVMs likely the more cost-effective choice?",
          options: [
            "microVMs cost 50% less per vCPU-hour than EC2 instances",
            "microVMs do not charge for cold starts, unlike Instances",
            "microVM billing pauses during I/O wait, so agents spending time waiting for LLM responses incur little CPU cost",
            "microVMs provide free sessions under 5 minutes",
          ],
          correctIndex: 2,
          explanation:
            "microVMs use consumption-based pricing that aligns CPU charges with actual active processing — charges are typically eliminated during I/O wait periods (like waiting for an LLM response). For an interactive support agent where most session time is I/O wait, actual CPU charges will be very low. This is different from EC2-backed Instances which charge for the full instance duration regardless of activity.",
        },
      ],
    },
  ],

  keyFacts: [
    "microVM sessions: up to 8 hours; Instance sessions: up to 14 days",
    "microVM pricing: $0.1276/vCPU-hour, $0.0169/GB-hour; 1-second billing minimum",
    "Instance pricing: EC2 On-Demand + 12% (CPU) or 7.8% (GPU G-series) management fee",
    "CPU billing pauses during I/O wait on microVMs — pay only for active processing",
    "Session isolation: each microVM session has isolated CPU, memory, filesystem",
    "After session ends: entire microVM terminated, memory sanitized",
    "Persistent filesystem: files/packages survive session stop/resume without external storage",
    "Max payload: 100 MB (text, images, audio, video, large datasets)",
    "Protocol support: MCP, A2A, AG-UI, HTTP, WebSocket (bidirectional streaming)",
    "V2 platform: snapshot-based cold starts — fast and consistent regardless of image size",
    "Frameworks: LangGraph, Strands, CrewAI, OpenAI Agents SDK, Claude Agent SDK, custom",
    // Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html
  ],

  relatedServices: [
    "Amazon Bedrock AgentCore Identity",
    "Amazon Bedrock AgentCore Gateway",
    "Amazon Bedrock AgentCore Memory",
    "Amazon EC2 (backing for Instances)",
    "AWS CloudTrail",
    "Amazon CloudWatch",
    "AWS X-Ray",
  ],

  examTips: [
    "microVMs = serverless, max 8 hours, consumption billing; Instances = EC2-backed, max 14 days, GPU support",
    "Key microVM differentiator: CPU billing PAUSES during I/O wait — important for LLM-heavy agents",
    "Session isolation is per-microVM: complete CPU/memory/filesystem separation; VM wiped after session",
    "V2 platform uses snapshots for fast cold starts — no penalty for large images",
    "100 MB payload limit enables multi-modal agents (images, audio, video)",
    "Persistent filesystem survives stop/resume — no need to re-download packages between pauses",
    "A2A = agent-to-agent; MCP = model-to-tool; AG-UI = agent-to-user-interface",
  ],
};
