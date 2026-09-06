import { ServiceGuide } from "../../../../types/guide";

export const capabilitiesAndLimitationsGuide: ServiceGuide = {
  id: "ccao-capabilities-limitations",
  service: "Capabilities and Limitations",
  domain: "fundamentals",
  tagline:
    "What Claude can and cannot do — and how to design around its boundaries",
  intro:
    "Understanding Claude's actual capabilities and hard limitations is essential for AI operations. Building on false assumptions about what Claude can do leads to poor architecture decisions, user disappointment, and safety gaps. This guide covers what Claude does well, where it falls short, and how to design systems that work with its boundaries rather than against them.",

  sections: [
    {
      heading: "Knowledge Cutoff",
      body: `Claude's training data has a **knowledge cutoff date** — a point in time after which it has no awareness of world events, new software releases, regulatory changes, market conditions, or any other developments. Asking Claude about events after its cutoff will either produce a hallucinated answer (if Claude doesn't recognize the gap) or an honest acknowledgment of uncertainty (the preferred behavior).

The knowledge cutoff is **not the same as the current date**. Claude may be deployed months or years after its training cutoff, meaning the gap between what Claude knows and what is currently true can be substantial. In production applications, assume Claude's knowledge is stale on anything time-sensitive: current pricing, recent legislation, current API versions, news events, personnel changes, and market data.

**Mitigations**: For time-sensitive facts, use RAG to inject current information from live data sources into the prompt. Instruct Claude to express uncertainty when asked about potentially recent events ("I may not have current information on this — my training has a cutoff date"). For applications where currency of information matters, always surface Claude's knowledge cutoff to users so they can verify time-sensitive claims independently.`,
      quiz: [
        {
          question:
            "A user asks a Claude-powered assistant about the current interest rate set by the Federal Reserve. Claude confidently provides a specific rate. What is the PRIMARY risk in this scenario?",
          options: [
            "The rate Claude states reflects its training data cutoff, not the current rate — it may be significantly out of date",
            "Claude cannot answer questions about financial topics due to safety restrictions",
            "The Federal Reserve's data is proprietary and Claude would not have been trained on it",
            "Claude would refuse this question because it involves real-time market data",
          ],
          correctIndex: 0,
          explanation:
            "Claude's training has a cutoff date, and financial data like interest rates changes frequently. Claude may confidently state a rate that was accurate at training time but is now outdated. The correct architectural response is to use RAG with a live data source for any time-sensitive financial information, and to surface Claude's knowledge limitation clearly to users.",
        },
      ],
    },
    {
      heading: "What Claude Cannot Do Natively",
      body: `Without tools explicitly provided by the operator, Claude has no ability to interact with the external world. **Claude cannot browse the internet**, access live data, look up current information, or retrieve URLs. It cannot **execute code** — it can write code but has no runtime to run it and cannot observe the output. It cannot **send emails, make API calls, access databases, or modify files** on its own. Every external action requires a tool that the operator defines and the application executes.

Claude has **no persistent memory** between separate API calls by default. Each request is stateless — Claude starts fresh with only the context provided in the current request. It does not remember previous conversations unless the application explicitly includes that history in the messages array.

Claude cannot **see or hear** unless given the appropriate inputs: vision-capable models can process images passed in the request, but Claude cannot open a camera, take a screenshot, or observe a user's screen. It processes only what is explicitly provided in the API request.

Understanding these defaults is critical for system design. If your application needs Claude to browse the web, you must implement a web search tool. If it needs persistent memory, you must build that memory layer. If it needs to see a user's screen, you must capture and pass that image. Claude is powerful but entirely dependent on the application layer for any external interaction.`,
      quiz: [
        {
          question:
            "A developer asks: 'Can Claude look up the current weather in Paris and include it in its response?' What is the correct answer?",
          options: [
            "Not without a tool — Claude cannot browse the internet or access live data; a weather API tool must be defined and the application must execute it",
            "Yes — Claude has access to real-time weather data through its training",
            "Yes — Claude can make HTTP requests to weather APIs if instructed in the system prompt",
            "Not with any Claude model — real-time data integration is not supported by the Anthropic API",
          ],
          correctIndex: 0,
          explanation:
            "Claude cannot access the internet or any live data source natively. To include real-time weather, the operator must define a weather tool (e.g., get_weather(city)), the application calls a weather API when Claude invokes that tool, and the result is passed back to Claude as a tool_result. Claude can then incorporate that data into its response. This is a fundamental architectural pattern — all external access requires an operator-defined tool.",
        },
      ],
    },
    {
      heading: "Hallucination",
      body: `**Hallucination** is Claude generating plausible-sounding but factually incorrect information with apparent confidence. It is not a bug or a malfunction — it is an inherent property of how large language models work. Claude generates text that is statistically coherent with its training, which can produce convincing falsehoods when asked about specific facts, niche topics, recent events, or proprietary data it was never trained on.

Hallucination is most common and most dangerous in these categories: **specific facts** (exact statistics, exact quotes, precise URLs, specific people's credentials), **recent events** (anything after the training cutoff), **proprietary or niche information** (your company's internal products, private policies, local regulations), and **precise technical details** (exact API parameter names, specific version features, code that actually runs without testing).

Claude's hallucinations often sound confident and authoritative — this is what makes them dangerous. Unlike a search engine that says "no results found," Claude will generate a plausible answer even when it has no reliable basis. Applications must be designed with this in mind: never use Claude as the sole authoritative source for factual claims that matter. Use RAG to ground responses in verified documents, include disclaimers, implement fact-checking steps, and always surface uncertainty to users when Claude expresses it.`,
      quiz: [
        {
          question:
            "An operator notices that Claude frequently cites non-existent research papers with realistic-sounding author names, journal names, and page numbers. What best describes this behavior?",
          options: [
            "Hallucination — Claude generates plausible-sounding citations that were never trained on real sources; this is an inherent LLM limitation",
            "A bug specific to citation tasks that Anthropic can fix with a model update",
            "Claude is accessing an outdated research database from its training data",
            "This only occurs with Haiku; Opus would generate accurate citations",
          ],
          correctIndex: 0,
          explanation:
            "Generating fabricated but realistic-looking citations is a well-known form of hallucination. LLMs learn the statistical pattern of how citations look and can generate convincing ones that do not actually exist. This is not a bug that will be patched — it is a fundamental property of the model. The architectural fix is to require Claude to cite only from documents retrieved via RAG and verified to exist, or to have a post-processing step that validates citation existence.",
        },
      ],
    },
    {
      heading: "Long-Context Degradation",
      body: `While Claude supports very large context windows (up to 200K tokens on some models), **performance can degrade as context length grows**. The most well-documented pattern is the **"lost in the middle" effect**: information presented in the middle of a very long context receives less attention than information at the beginning or end of the context. For tasks that require precise recall of a specific fact from a long document, this can cause Claude to miss or misremember details that are buried in the middle of a large context.

Long contexts also increase **latency and cost linearly** — a 100K-token prompt takes longer and costs more than a 10K-token prompt. Applications using very long contexts should be tested specifically at their maximum intended context length, not just at typical lengths.

**Design implications**: For RAG applications, retrieve only the most relevant chunks rather than injecting entire documents. For long-document analysis, consider chunking and processing sections separately, then synthesizing. Place the most critical instructions and most important context at the beginning or end of the prompt, not buried in the middle of large blocks of retrieved text. Test your application at realistic maximum context lengths before production deployment.`,
      quiz: [
        {
          question:
            "A developer is building a RAG application that retrieves the top 50 document chunks (totalling 80,000 tokens) and injects all of them into Claude's context for every query. What is the PRIMARY concern with this approach?",
          options: [
            "Relevant chunks buried in the middle of a very large context may receive less attention, and the approach is expensive and slow due to the large per-request token count",
            "Claude cannot process more than 10 retrieved chunks per request",
            "RAG only works with the Batch API, not the standard Messages API",
            "Injecting document chunks as context violates the Messages API schema",
          ],
          correctIndex: 0,
          explanation:
            "Injecting 50 chunks creates a very large context with two problems: (1) the 'lost in the middle' degradation means chunks near the center of the 80K-token block receive less attention than those at the start or end, reducing answer accuracy; (2) 80K input tokens per query is expensive and slow. The better approach is to retrieve only the top 5–10 most semantically similar chunks and tune the retrieval pipeline rather than compensating with a larger context.",
        },
      ],
    },
    {
      heading: "What Claude Does Well",
      body: `Understanding limitations is only half the picture — Claude genuinely excels at a distinct set of tasks that operators should lean into. Claude performs best at: **natural language understanding and generation** (summarization, drafting, editing, translation, classification), **reasoning and analysis** (breaking down complex problems, evaluating arguments, identifying patterns in text), **code generation and explanation** (writing, reviewing, and explaining code across dozens of languages), **structured data extraction** (parsing unstructured text into JSON or structured formats), and **following nuanced instructions** (adhering to complex style guides, personas, and behavioral rules expressed in natural language).

Claude is particularly strong at tasks that benefit from broad context and common sense reasoning rather than precise factual recall. A legal document drafter that uses Claude to summarize and draft arguments is playing to Claude's strengths. A fact-checking system that relies on Claude for ground truth without retrieval is playing to its weaknesses.

**Matching task to capability**: when evaluating whether to use Claude for a task, ask: does this task require precise recall of specific facts (weakness), or does it require reasoning over provided context (strength)? Does it need real-time data (weakness) or does it work on stable information (strength)? Does it need deterministic exact outputs (weakness) or nuanced, high-quality natural language (strength)? The best Claude applications are built around what Claude genuinely does well.`,
      quiz: [
        {
          question:
            "Which of these tasks is BEST suited to Claude's strengths without requiring additional architectural patterns like RAG?",
          options: [
            "Summarizing a customer support transcript provided in the prompt and drafting a follow-up email",
            "Looking up a customer's account balance from a live database",
            "Verifying whether a specific claim in a news article is currently accurate",
            "Executing a Python script and returning its output",
          ],
          correctIndex: 0,
          explanation:
            "Summarizing provided text and drafting a response are core Claude strengths — they require reasoning over provided context, natural language understanding, and generation. No external tools or real-time data are needed. Account balance lookup requires database access (a tool). Verifying current news accuracy requires web access or RAG. Executing Python requires a code execution tool. The summary/draft task uses Claude's innate capabilities without additional architectural complexity.",
        },
      ],
    },
  ],

  keyFacts: [
    "Claude has a training knowledge cutoff — it has no awareness of events after that date",
    "Time elapsed since cutoff can be months or years — assume all time-sensitive data is stale",
    "Claude cannot browse the internet, execute code, or access external systems without operator-defined tools",
    "Claude has no persistent memory between API calls — history must be provided in each request",
    "Hallucination is an inherent LLM property, not a bug — never use Claude as the sole source for critical facts",
    "Hallucination is worst on specific facts, recent events, and proprietary data not in training",
    "Long contexts can suffer 'lost in the middle' degradation — critical info belongs at start or end",
    "Context window = hard ceiling; exceeding it returns an error, not silent truncation",
    "Claude excels at: reasoning over provided context, NLU/NLG, code generation, structured extraction",
    "Use RAG to ground Claude in current or proprietary facts; use tools for any real-world actions",
  ],

  relatedServices: [
    "Claude Models",
    "Agentic Workflows",
    "Evaluations and Testing",
    "Safety and Responsible AI",
    "Prompt Engineering",
  ],

  examTips: [
    "Knowledge cutoff ≠ current date — assume stale for anything time-sensitive",
    "Claude has no native internet, code execution, or external access — all require operator tools",
    "Hallucination = confident-sounding falsehood; worst on specific facts and proprietary data",
    "RAG is the fix for hallucination on domain-specific or time-sensitive facts",
    "Lost in the middle: critical context belongs at the start or end of a long prompt",
    "Claude's strengths: reasoning over context, NLU/NLG, code, extraction — not precise factual recall",
  ],
};
