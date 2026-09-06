import { ServiceGuide } from "../../../types/guide";

export const toolUseGuide: ServiceGuide = {
  id: "ccao-tool-use",
  service: "Tool Use",
  domain: "development",
  tagline:
    "Enabling Claude to call external functions and APIs as part of its reasoning",
  intro:
    "Tool use (also called function calling) allows Claude to invoke developer-defined functions during a response. This bridges Claude's reasoning with external systems — databases, APIs, calculators, or any callable service — enabling far more capable agentic applications.",

  sections: [
    {
      heading: "How Tool Use Works",
      body: `Tool use follows a structured **request-response cycle** between the application and Claude. The developer defines one or more tools in the API request, each described by a name, description, and JSON Schema for its input parameters. When Claude determines that invoking a tool would help answer the user's request, it stops generating prose and instead returns a \`tool_use\` content block specifying the tool name and the arguments it wants to pass.

The application is then responsible for **actually executing the tool** — Claude does not call external APIs directly; it only outputs the intent. The application runs the tool, collects the result, and sends it back to Claude as a \`tool_result\` content block in the next user turn. Claude then incorporates the result and continues generating its response, potentially invoking more tools or producing a final answer.

This cycle can repeat multiple times within a single user request — Claude may call several tools in sequence, using each result to inform the next. The stop_reason \`"tool_use"\` signals that Claude is waiting for a tool result rather than having finished responding. The application must handle this stop reason by running the requested tool and continuing the conversation.`,
      quiz: [
        {
          question:
            "After sending a Messages API request with tools defined, the application receives a response with stop_reason 'tool_use'. What should the application do next?",
          options: [
            "Execute the requested tool, then send the result back to Claude as a tool_result in the next user turn",
            "The response is complete — extract the tool_use block as the final answer",
            "Retry the same request; tool_use indicates Claude could not determine an answer",
            "Switch to a model that supports direct API calling without needing tool results",
          ],
          correctIndex: 0,
          explanation:
            "stop_reason 'tool_use' means Claude wants to invoke a tool and is waiting for the result. The application must execute the tool, collect the output, and send it back as a tool_result content block in a new user turn. Claude does not call external services itself — the application is the executor. The response is not complete until Claude returns stop_reason 'end_turn'.",
        },
      ],
    },
    {
      heading: "Defining Tools",
      body: `Each tool is defined as a JSON object with three fields: \`name\` (a string identifier Claude uses to invoke the tool), \`description\` (a natural language explanation of what the tool does and when to use it — this is what Claude reads to decide whether to invoke it), and \`input_schema\` (a JSON Schema object describing the tool's parameters, their types, and which are required).

The \`description\` field is critically important — it is the primary signal Claude uses to decide whether and when to invoke a tool. A vague description leads to incorrect invocation decisions. A precise description that explains the tool's purpose, its inputs, its outputs, and any important caveats enables Claude to use tools correctly without explicit instruction in the user message.

Tool names should be descriptive and unambiguous. If two tools have similar purposes, their names and descriptions must clearly distinguish them. JSON Schema for \`input_schema\` supports standard types (string, number, boolean, array, object), required fields, and descriptions for each property. Property descriptions help Claude construct correct arguments, especially for fields with non-obvious semantics.`,
      quiz: [
        {
          question:
            "Claude is frequently calling the wrong tool when two similar tools are available. What is the MOST likely cause and fix?",
          options: [
            "The tool descriptions are too similar — rewrite them to clearly distinguish each tool's purpose and when to use each",
            "Claude cannot handle more than one tool at a time — remove one tool",
            "Increase temperature so Claude explores tool selection more broadly",
            "Add more tools to give Claude more options to choose from",
          ],
          correctIndex: 0,
          explanation:
            "Tool selection is driven primarily by the description field. If two tool descriptions are ambiguous or too similar, Claude cannot reliably distinguish between them. The fix is to rewrite descriptions to clearly explain each tool's distinct purpose, inputs, and the specific circumstances under which it should be used. More tools adds more ambiguity, not less. Temperature affects randomness but doesn't fix structural description ambiguity.",
        },
      ],
    },
    {
      heading: "Parallel and Sequential Tool Calls",
      body: `Claude can invoke tools in two patterns: **sequential** (one tool at a time, using each result before deciding on the next) and **parallel** (requesting multiple tool calls simultaneously in a single response). Parallel tool calls appear when Claude can determine upfront that multiple independent tools are needed and their results don't depend on each other.

For example, if a user asks "What's the weather in Paris and what's the current EUR/USD exchange rate?", Claude may return two simultaneous \`tool_use\` blocks — one for a weather tool and one for a currency tool — because neither result depends on the other. The application must handle this by executing both tools (ideally in parallel for efficiency), then sending both \`tool_result\` blocks back in a single user turn.

Sequential tool calls occur when each tool's result informs the next decision — for example, first looking up a customer record, then using the customer ID from that result to query their order history. The application must follow the full cycle for each tool invocation. Designing tools to be parallelizable where possible reduces overall latency in agentic workflows.`,
      quiz: [
        {
          question:
            "A Messages API response contains two tool_use content blocks in the same response. How should the application handle this?",
          options: [
            "Execute both tools (ideally in parallel), then send both tool_result blocks back in a single user turn",
            "Execute the first tool, send its result, wait for Claude to request the second tool",
            "This is an API error — Claude can only request one tool per response",
            "Execute the tools sequentially and send each result in a separate API call",
          ],
          correctIndex: 0,
          explanation:
            "Multiple tool_use blocks in a single response indicate Claude wants parallel tool execution. The application should run both tools (ideally concurrently for efficiency) and send both tool_result blocks back together in a single user turn. Executing them sequentially with separate API calls would work but is slower and less efficient than the intended parallel pattern.",
        },
      ],
    },
    {
      heading: "Tool Choice Control",
      body: `By default, Claude decides autonomously whether to use any of the available tools or respond directly. This behavior can be overridden with the \`tool_choice\` parameter. Setting \`tool_choice: { type: "auto" }\` is the default — Claude decides. Setting \`tool_choice: { type: "any" }\` forces Claude to use at least one tool (useful when you know a tool call is always required). Setting \`tool_choice: { type: "tool", name: "..." }\` forces Claude to use a specific named tool.

Forcing tool use is useful in structured workflows where you need to guarantee Claude produces a structured tool invocation rather than free-form prose. For example, an information extraction pipeline might force a specific \`extract_entities\` tool to ensure output is always a structured JSON payload rather than a narrative description of the entities found.

The tradeoff is flexibility vs. predictability. Forcing tool use prevents Claude from using its judgment — if the forced tool is inappropriate for the input, Claude may produce poor-quality arguments or the tool may return an error. Use forced tool choice only when you are confident the tool is always the right action for every input the application will receive.`,
      quiz: [
        {
          question:
            "An information extraction pipeline must always receive structured JSON output from Claude, never prose. Which tool_choice setting achieves this?",
          options: [
            "tool_choice: { type: 'tool', name: 'extract_structured_data' } — forces Claude to always invoke the extraction tool",
            "tool_choice: { type: 'auto' } — Claude will choose the tool when it determines it is needed",
            "Set temperature to 0 to make Claude always choose the tool",
            "Include 'always use the extract_structured_data tool' in the system prompt",
          ],
          correctIndex: 0,
          explanation:
            "Forcing a specific tool with tool_choice guarantees Claude always invokes the named tool, ensuring structured JSON output every time. 'auto' mode lets Claude decide and may result in prose responses for some inputs. Temperature affects randomness, not tool selection. System prompt instructions are a best-effort guide but can be overridden by Claude's judgment in edge cases — tool_choice is a hard constraint.",
        },
      ],
    },
    {
      heading: "Agentic Patterns with Tools",
      body: `Tool use is the foundation of **agentic applications** — systems where Claude takes sequences of actions to accomplish a goal rather than simply responding to a single query. In an agentic loop, the application repeatedly sends Claude's tool results back until Claude returns \`stop_reason: "end_turn"\`, at which point the agent has completed its task.

Common agentic patterns include: **ReAct** (Reason + Act — Claude reasons about what to do, acts by calling a tool, observes the result, then reasons again), **plan-and-execute** (Claude generates a multi-step plan first, then executes each step sequentially), and **multi-agent orchestration** (Claude acting as an orchestrator that delegates subtasks to specialized sub-agents or tools).

Agentic systems require careful **loop and error handling**. Infinite loops can occur if Claude repeatedly calls tools that return errors or unexpected results. Applications must implement maximum iteration limits, error handling for tool failures, and graceful degradation. Tool results that indicate errors should be clearly communicated back to Claude with guidance on how to proceed rather than silently ignored.`,
      quiz: [
        {
          question:
            "An agentic application using Claude with tools occasionally enters an infinite loop, repeatedly calling the same tool. What is the BEST safeguard?",
          options: [
            "Implement a maximum iteration limit and return an error to Claude if tool calls repeatedly fail",
            "Use tool_choice: 'any' to force Claude to always try a different tool",
            "Reduce the number of available tools to limit Claude's options",
            "Increase max_tokens so Claude has more room to reason out of the loop",
          ],
          correctIndex: 0,
          explanation:
            "A maximum iteration limit is the essential safeguard against infinite agentic loops. When the limit is reached or a tool repeatedly returns errors, the application should surface a clear error to Claude (or terminate gracefully). tool_choice 'any' doesn't prevent loops — it just forces tool use. Fewer tools doesn't address loop conditions. max_tokens affects output length per call, not loop termination.",
        },
      ],
    },
  ],

  keyFacts: [
    "Claude does not call external APIs directly — it outputs tool_use blocks; the application executes the tool",
    "stop_reason 'tool_use' means Claude is waiting for a tool result — not a completed response",
    "Tool description quality is the primary driver of correct tool selection",
    "Multiple tool_use blocks in one response = parallel tool calls; send all results back together",
    "tool_choice parameter: 'auto' (default), 'any' (force a tool), or specific tool name",
    "Agentic loops must have maximum iteration limits to prevent infinite loops",
    "Tool input_schema uses JSON Schema — include property descriptions for complex params",
    "The full multi-turn cycle continues until stop_reason is 'end_turn'",
  ],

  relatedServices: [
    "Messages API",
    "Prompt Engineering",
    "Claude Models",
    "Safety and Responsible AI",
  ],

  examTips: [
    "Claude outputs tool intent — the application executes — this separation is fundamental",
    "stop_reason 'tool_use' = application must run the tool and continue the conversation",
    "Two tool_use blocks in one response = run both tools in parallel, send both results together",
    "tool_choice: type 'tool' is how you guarantee structured output via tool invocation",
    "Agentic loops require max iteration guards — Claude can loop indefinitely without them",
    "Tool description is what Claude reads to decide when to use a tool — make it precise",
  ],
};
