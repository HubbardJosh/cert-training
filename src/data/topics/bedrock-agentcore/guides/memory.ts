import { ServiceGuide } from "../../../../types/guide";

// Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html
// Source: https://aws.amazon.com/bedrock/agentcore/pricing/
export const memoryGuide: ServiceGuide = {
  id: "agentcore-memory",
  service: "AgentCore Memory",
  domain: "development",
  tagline:
    "Managed short-term and long-term memory — agents that remember across sessions",
  intro:
    "AgentCore Memory addresses the fundamental problem of agent statelessness: without memory, every conversation starts cold. Memory provides managed short-term (within-session context) and long-term (cross-session knowledge retention) storage with automatic extraction of facts, preferences, and summaries — no custom vector store or extraction pipeline required.",

  sections: [
    {
      heading: "The Statelessness Problem",
      body: `AI agents powered by LLMs are stateless by default. Every new API call to the model has no memory of previous calls unless you explicitly include prior conversation history in the prompt.

**The naive solution** — include the entire conversation history in every prompt — breaks down quickly:
- Context windows are finite (even 200K tokens runs out for long-running agents)
- Long histories increase latency and cost on every call
- Not all history is relevant — including irrelevant context degrades response quality

**AgentCore Memory solves this** by separating memory into two tiers that address different time horizons:

1. **Short-term memory**: Recent conversation turns within the current session — the immediate context window an agent needs to resolve references like "What about tomorrow?" (referring to Seattle from two turns ago)

2. **Long-term memory**: Extracted knowledge that persists across sessions — user preferences, important facts, and session summaries stored so future sessions can retrieve what's relevant without including everything

The service manages both tiers, automatically extracting information from conversations for long-term storage, so you don't build custom extraction pipelines or manage vector databases.`,
      quiz: [
        {
          question:
            "A user is booking a flight. They say 'I want to go to Paris' then three turns later ask 'What's the cheapest option?' The agent needs to know 'cheapest option for what' without the user repeating themselves. Which memory type handles this?",
          options: [
            "Long-term memory — the destination preference is stored across sessions",
            "Short-term memory — recent conversation turns provide immediate context within the session",
            "AgentCore Gateway — session state is maintained at the routing layer",
            "AgentCore Runtime's persistent filesystem — the agent writes session state to disk",
          ],
          correctIndex: 1,
          explanation:
            "Short-term memory captures turn-by-turn interactions within a single session, allowing the agent to understand context like 'cheapest option for Paris' without the user restating the destination. Long-term memory is for cross-session persistence (e.g., the user always prefers window seats). Gateway and Runtime filesystem are not memory solutions.",
        },
        {
          question:
            "During a hotel booking session, a customer mentions they prefer king beds and high floors. Six months later, they start a new booking session. Which memory type ensures the agent proactively offers these preferences?",
          options: [
            "Short-term memory — maintains session context",
            "AgentCore Runtime persistent filesystem — stores user profiles",
            "Long-term memory — automatically extracts and retains preferences across sessions",
            "AgentCore Identity — stores user attribute claims",
          ],
          correctIndex: 2,
          explanation:
            "Long-term memory automatically extracts and stores key insights from conversations — including user preferences — and makes them available in future sessions. This is a cross-session capability. Short-term memory only persists within a single session. Runtime filesystem stores files; Identity manages authentication credentials, not conversation preferences.",
        },
      ],
    },
    {
      heading: "Short-Term Memory",
      body: `**Short-term memory** captures turn-by-turn interactions within a single agent session.

**What it stores**: The recent conversation history — user messages, agent responses, tool calls, and observations within the current session.

**How it's used**: The agent retrieves relevant recent context before generating its next response, allowing it to:
- Resolve pronoun and reference ambiguity ("What about tomorrow?" → weather in Seattle)
- Maintain task state across multiple reasoning steps without re-asking the user
- Understand the flow of a complex multi-step task

**Key characteristic**: Short-term memory is **scoped to a session**. When the session ends, short-term memory is not automatically persisted — only long-term memory extraction preserves insights across sessions.

**Pricing**: $0.25 per 1,000 new events stored.`,
      quiz: [
        {
          question:
            "What is the scope of short-term memory in AgentCore Memory?",
          options: [
            "Shared across all users in an organization for the past 24 hours",
            "Scoped to a single agent session — context within the current conversation",
            "Persisted for 30 days after the session ends for potential retrieval",
            "Shared between all agents using the same memory store",
          ],
          correctIndex: 1,
          explanation:
            "Short-term memory is scoped to a single session — it captures the recent conversation context within that session and is not automatically available in future sessions. When a session ends, short-term memory events are not persisted unless they are extracted into long-term memory. It is not shared across users or between agents.",
        },
      ],
    },
    {
      heading: "Long-Term Memory",
      body: `**Long-term memory** automatically extracts and stores durable knowledge from conversations across multiple sessions.

**What gets extracted**: AgentCore Memory analyzes conversations and extracts:
- **User preferences** (e.g., "prefers window seats", "vegetarian diet")
- **Important facts** (e.g., "works at Acme Corp", "has a premium subscription")
- **Session summaries** (compressed representation of what happened in prior sessions)

**How it's used**: When a new session starts, the agent queries long-term memory for relevant context about the user or task, retrieving a compact set of facts rather than replaying entire conversation histories.

**Architecture**: Long-term memory is stored in a managed store (no separate vector database to provision). The extraction is automatic — you do not write extraction code. You can configure extraction strategies and what types of facts to retain.

**Pricing**:
- Storage: $0.75 per 1,000 records/month
- Retrieval: $0.50 per 1,000 memory record retrievals
- Short-term events (feeding long-term): $0.25 per 1,000 new events`,
      quiz: [
        {
          question:
            "What is the correct pricing for long-term memory storage in AgentCore Memory?",
          options: [
            "$0.25 per 1,000 records/month",
            "$0.50 per 1,000 records/month",
            "$0.75 per 1,000 records/month",
            "$1.00 per 1,000 records/month",
          ],
          correctIndex: 2,
          explanation:
            // Source: https://aws.amazon.com/bedrock/agentcore/pricing/
            "Long-term memory storage is priced at $0.75 per 1,000 records/month. Retrieval (querying memory) is $0.50 per 1,000 retrievals. Short-term memory events (which can feed into long-term extraction) are $0.25 per 1,000 new events. These are distinct charges for different operations.",
        },
      ],
    },
    {
      heading: "Use Cases",
      body: `AgentCore Memory enables a range of agent patterns that are impractical without managed memory:

**Conversational agents** — A customer support chatbot remembers a user's previous issues and product preferences, enabling relevant assistance without asking the user to repeat themselves.

**Task-oriented / workflow agents** — An AI agent orchestrating a multi-step business process (e.g., invoice approval) uses memory to track the status of each workflow step and maintain progress across sessions that may span days.

**Multi-agent systems** — A team of AI agents managing supply chain can share memory to synchronize inventory levels, anticipate demand, and optimize logistics — each agent reading and writing to a shared memory store.

**Autonomous / planning agents** — An agent working on a long research project uses session summaries in long-term memory to pick up where it left off in subsequent sessions without replaying the full conversation history.

**Key benefits**:
- More natural conversations (no "What were we discussing?" re-orientation)
- Personalized experiences at scale
- Reduced development complexity (no custom state management code)`,
      quiz: [
        {
          question:
            "An invoice approval workflow spans multiple sessions over three days. The agent needs to remember that Step 1 (budget check) and Step 2 (manager approval) are complete when it resumes on Day 3 to execute Step 3. Which memory approach is most appropriate?",
          options: [
            "Short-term memory — the session context is maintained between days",
            "Long-term memory — workflow state is extracted and stored as facts across sessions",
            "AgentCore Runtime persistent filesystem — the agent writes workflow state to a file",
            "AgentCore Gateway session state — the gateway tracks multi-session workflows",
          ],
          correctIndex: 1,
          explanation:
            "Long-term memory is designed for cross-session persistence. Workflow state (steps completed, pending approvals) can be stored as facts in long-term memory and retrieved when the agent resumes on Day 3. Short-term memory only persists within a single session. Runtime filesystem could store files but is not designed for semantic knowledge retrieval. Gateway has no session state concept.",
        },
      ],
    },
  ],

  keyFacts: [
    "Two memory types: short-term (within-session) and long-term (cross-session)",
    "Short-term: captures turn-by-turn context; scoped to a single session",
    "Long-term: automatically extracts preferences, facts, and session summaries",
    "No custom vector database or extraction pipeline required — fully managed",
    "Pricing: short-term $0.25/1,000 events; long-term storage $0.75/1,000 records/month; long-term retrieval $0.50/1,000 retrievals",
    "Multi-agent use case: teams of agents can share a memory store for coordination",
    "Extraction is automatic — AgentCore analyzes conversations and decides what to retain",
    "Session summaries compressed to avoid replaying full conversation histories",
    // Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html
  ],

  relatedServices: [
    "Amazon Bedrock AgentCore Runtime",
    "Amazon Bedrock Knowledge Bases (for document-based RAG)",
    "Amazon DynamoDB (alternative for custom state)",
    "Amazon ElastiCache (alternative for short-term cache)",
  ],

  examTips: [
    "Short-term = within ONE session; long-term = ACROSS sessions — know the distinction",
    "Long-term memory auto-extracts from conversations — you don't write extraction code",
    "Pricing three-part: events ($0.25) → short-term; storage ($0.75) + retrieval ($0.50) → long-term",
    "Memory ≠ Knowledge Bases: Memory is for conversation state; Knowledge Bases is for document RAG",
    "Multi-agent coordination via shared memory store — agents read/write the same memory",
    "Session summaries avoid replaying full histories — compressed cross-session context",
  ],
};
