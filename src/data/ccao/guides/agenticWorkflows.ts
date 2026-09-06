import { ServiceGuide } from "../../../types/guide";

export const agenticWorkflowsGuide: ServiceGuide = {
  id: "ccao-agentic-workflows",
  service: "Agentic Workflows",
  domain: "applications",
  tagline:
    "Designing multi-step AI systems where Claude takes sequences of actions to complete goals",
  intro:
    "Agentic workflows extend Claude beyond single question-answer exchanges into systems that plan, take action, observe results, and iterate. Understanding agentic patterns, design principles, and failure modes is essential for AI operations.",

  sections: [
    {
      heading: "What Makes a Workflow Agentic",
      body: `A workflow is **agentic** when Claude takes multiple sequential actions toward a goal rather than responding to a single query. The defining characteristics are: Claude makes decisions about what to do next (not just following a fixed script), Claude's actions have effects in external systems (via tool calls), and the appropriate sequence of actions may vary depending on intermediate results.

Agentic systems exist on a spectrum of **autonomy**. At the low end, a simple tool use workflow where Claude always calls the same single tool is barely agentic. At the high end, a fully autonomous agent that browses the web, writes and executes code, sends emails, and manages files with minimal human oversight is highly agentic. Most production systems sit somewhere in the middle.

The key design question for any agentic system is: **how much autonomy is appropriate for this task?** Higher autonomy enables more complex tasks but increases the risk of errors compounding, irreversible actions being taken, and unexpected behavior. The right level of autonomy depends on the stakes of the task, the reliability of available tools, the cost of mistakes, and the feasibility of human oversight at each decision point.`,
      quiz: [
        {
          question:
            "What is the defining characteristic that makes a Claude-powered workflow 'agentic'?",
          options: [
            "Claude takes multiple sequential actions toward a goal, making decisions about what to do next based on intermediate results",
            "Claude uses more than one tool in a single API call",
            "The workflow runs without any human interaction from start to finish",
            "Claude generates more than 1,000 tokens per response",
          ],
          correctIndex: 0,
          explanation:
            "The defining characteristic of agentic behavior is sequential decision-making — Claude takes actions, observes results, and decides what to do next based on those results. Using multiple tools in one call is a feature of parallel tool use. Full autonomy without human interaction is one point on the autonomy spectrum, not the definition. Token count is irrelevant to agentic behavior.",
        },
      ],
    },
    {
      heading: "Common Agentic Patterns",
      body: `Several well-established patterns structure agentic Claude applications. The **ReAct pattern** (Reason + Act) interleaves reasoning and tool use: Claude explains its thinking, calls a tool, receives the result, reasons about it, calls another tool, and so on until it can give a final answer. This makes the agent's decision process transparent and auditable.

The **plan-and-execute pattern** separates planning from execution: in a first pass, Claude generates a structured plan (a sequence of steps with the tools and inputs needed for each). Then the application executes the plan step by step, either autonomously or with human approval at each checkpoint. This is useful when the full plan should be visible before any irreversible actions are taken.

**Multi-agent systems** use multiple Claude instances (or a Claude instance alongside other AI models) working in concert. An **orchestrator** Claude instance decomposes a high-level goal into subtasks and delegates them to **worker** instances or specialized tools. Workers report results back to the orchestrator, which synthesizes them and determines next steps. Multi-agent systems can tackle tasks too large for a single context window by distributing work across specialized agents.`,
      quiz: [
        {
          question:
            "An operator is building a system that helps with complex research tasks. Before any external actions are taken (web searches, database queries), the operator wants to review what Claude plans to do. Which pattern fits best?",
          options: [
            "Plan-and-execute — Claude generates a full plan for human review before any execution begins",
            "ReAct — Claude interleaves reasoning and tool calls in real time",
            "Multi-agent — delegate planning to one agent and execution to another",
            "Zero-shot tool use — let Claude decide and execute without a planning phase",
          ],
          correctIndex: 0,
          explanation:
            "Plan-and-execute is specifically designed for scenarios requiring human review before action. Claude generates the full plan in a first pass, the operator reviews and approves it, then execution proceeds. ReAct interleaves reasoning and action in real time without a separate review gate. Multi-agent adds complexity without addressing the human review requirement. Zero-shot tool use has no planning phase.",
        },
      ],
    },
    {
      heading: "Human-in-the-Loop Design",
      body: `**Human-in-the-loop (HITL)** design adds human checkpoints to agentic workflows at key decision points, particularly before irreversible or high-stakes actions. HITL is not all-or-nothing — the goal is to place human oversight where it provides the most value (high-stakes, hard-to-reverse actions) while allowing full automation for low-risk reversible steps.

Common HITL checkpoint types: **approval gates** (Claude proposes an action, human approves or rejects before Claude proceeds), **sampling-based review** (Claude acts autonomously, but a percentage of actions are randomly selected for human review), **exception-based review** (Claude flags low-confidence decisions for human input while handling confident decisions autonomously), and **post-hoc audit** (Claude acts fully autonomously, humans review logs after the fact).

The appropriate HITL design depends on stakes and reversibility. Sending an email to a customer is irreversible — an approval gate is appropriate. Adding a row to an internal staging database is reversible — full automation may be acceptable. Financial transactions, external communications, data deletion, and permission changes are canonical high-stakes actions that warrant explicit human approval.`,
      quiz: [
        {
          question:
            "An agentic system helps employees draft and send emails to enterprise customers. At what point should a human checkpoint be placed?",
          options: [
            "Before sending each email — sending is irreversible and high-stakes; require human approval",
            "After every tool call — all agentic steps should have approval gates",
            "Only before batch sends of more than 100 emails",
            "No checkpoint needed — Claude is reliable enough for this task autonomously",
          ],
          correctIndex: 0,
          explanation:
            "Sending emails to enterprise customers is irreversible and carries reputational and relationship risk — a human approval checkpoint before sending is appropriate. Approving every tool call (including low-stakes steps like looking up a customer record) adds overhead without proportional risk reduction. Volume thresholds miss the risk that even a single inappropriate email can cause damage. The reliability of Claude doesn't eliminate the irreversibility and stakes of the action.",
        },
      ],
    },
    {
      heading: "Retrieval-Augmented Generation (RAG)",
      body: `**Retrieval-Augmented Generation (RAG)** is an architecture pattern where relevant information is retrieved from an external knowledge base and included in the prompt context before Claude generates a response. This grounds Claude's answers in up-to-date, domain-specific content rather than relying solely on training data, dramatically reducing hallucination on proprietary or recent information.

A RAG pipeline has three components: an **embedding model** that converts text to vector representations, a **vector database** that stores and enables similarity search across embedded documents, and the **Claude inference step** that receives the retrieved documents and the user query together. When a user asks a question, the query is embedded, the most semantically similar document chunks are retrieved, and those chunks are injected into the Claude prompt as context.

RAG is the right choice when: the knowledge base changes frequently (retraining is impractical), the knowledge is proprietary and not in Claude's training data, factual accuracy on specific content is critical, or answers must be citable (Claude can reference the specific retrieved document). RAG is not magic — retrieval quality directly determines answer quality. If the wrong documents are retrieved, Claude will either hallucinate or give an irrelevant answer. Chunk size, embedding model quality, and similarity threshold are all critical RAG parameters.`,
      quiz: [
        {
          question:
            "A company's internal HR policy documents change quarterly. An AI assistant must answer employee questions based on the current policy. What is the BEST architecture?",
          options: [
            "RAG — index the current policy documents, retrieve relevant sections per query, and include them in Claude's context",
            "Fine-tune Claude on the HR documents each quarter when they change",
            "Include all HR documents in the system prompt for every request",
            "Train a custom model on HR data using Anthropic's model training service",
          ],
          correctIndex: 0,
          explanation:
            "RAG is the correct architecture for frequently-updated proprietary documents. Indexing and retrieval is fast and cheap to update quarterly. Fine-tuning is expensive, slow, and not designed for factual recall — fine-tuned models still hallucinate on specific facts. Including all HR documents in the system prompt may exceed the context window and is expensive at scale. Anthropic does not offer a public custom model training service.",
        },
      ],
    },
    {
      heading: "Failure Modes and Safeguards",
      body: `Agentic systems have failure modes that simple chat interfaces do not. **Compounding errors**: early mistakes in a multi-step workflow propagate and amplify through subsequent steps, leading to outputs far worse than any single-step error. A hallucinated fact in step 2 becomes an incorrect database query in step 3, which corrupts a record in step 4. Design checkpoints to catch errors early before they cascade.

**Infinite loops** occur when tool call failures or unexpected results cause Claude to repeatedly attempt the same action. Always implement maximum iteration limits. **Scope creep** occurs when an agent, given broad access and an under-specified goal, takes actions beyond what was intended — for example, an agent authorized to clean up old files deleting things it shouldn't have. The principle of **minimal footprint** recommends giving agents only the permissions necessary for the task, preferring reversible actions over irreversible ones, and defaulting to doing less and confirming when intent is unclear.

**Tool failure handling**: when a tool returns an error, the error should be clearly communicated back to Claude in the \`tool_result\` block so Claude can adapt its approach. If tool errors are silently swallowed, Claude has no signal to change strategy. Include the error message, the tool that failed, and any relevant context in the tool result. Claude can then decide whether to retry, try a different approach, or inform the user that the task cannot be completed.`,
      quiz: [
        {
          question:
            "An agentic system is being designed to manage cloud infrastructure. What is the MOST important design principle to apply?",
          options: [
            "Minimal footprint — grant only necessary permissions, prefer reversible actions, and require human approval before destructive changes",
            "Maximum capability — give the agent full admin access so it can complete any task without interruption",
            "Full autonomy — human checkpoints slow down the agent and reduce its effectiveness",
            "Optimistic execution — proceed with all actions and roll back later if something goes wrong",
          ],
          correctIndex: 0,
          explanation:
            "Minimal footprint is the critical design principle for high-stakes agentic systems like infrastructure management. Grant the minimum permissions needed, prefer reversible operations (scale-up before scale-down), and require human approval for destructive changes (deleting resources, modifying prod configs). Full admin access violates least-privilege and creates catastrophic failure potential. Full autonomy removes the oversight needed for irreversible actions. Optimistic execution with rollback is not always possible — many infrastructure changes cannot be easily undone.",
        },
      ],
    },
  ],

  keyFacts: [
    "Agentic = Claude makes sequential decisions and takes actions based on intermediate results",
    "ReAct pattern: interleaves reasoning and tool use, making decisions transparent",
    "Plan-and-execute: generate full plan first, then execute — enables human review before action",
    "Multi-agent: orchestrator Claude delegates subtasks to worker agents or specialized tools",
    "HITL checkpoints belong before irreversible, high-stakes actions",
    "Minimal footprint principle: least permissions, prefer reversible actions, confirm when unsure",
    "RAG: retrieve relevant documents and inject them into context to ground Claude's answers",
    "Compounding errors are a unique risk in multi-step agents — checkpoints catch them early",
    "Always pass tool errors back to Claude in tool_result so it can adapt its strategy",
    "Infinite loop safeguard: always implement maximum iteration limits",
  ],

  relatedServices: [
    "Tool Use",
    "Messages API",
    "Safety and Responsible AI",
    "Evaluations and Testing",
    "Production Deployment",
  ],

  examTips: [
    "Plan-and-execute = the pattern when human review before action is required",
    "Minimal footprint = least permissions + prefer reversible + confirm when intent unclear",
    "RAG = fix for hallucination on proprietary/recent data that changes frequently",
    "Tool errors must be passed back to Claude — silent swallowing prevents recovery",
    "HITL checkpoint placement: before irreversible or high-stakes actions, not every step",
    "Compounding errors are the main risk that makes early checkpoints valuable in long chains",
  ],
};
