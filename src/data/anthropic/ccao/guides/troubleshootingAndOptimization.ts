import { ServiceGuide } from "../../../../types/guide";

export const troubleshootingAndOptimizationGuide: ServiceGuide = {
  id: "ccao-troubleshooting-optimization",
  service: "Troubleshooting and Optimization",
  domain: "troubleshooting",
  tagline:
    "Diagnosing poor outputs, iterating on prompts, and tuning workflows for speed, cost, and quality",
  intro:
    "Troubleshooting and Optimization (Domain 7) covers how to identify why Claude is producing poor outputs, how to systematically fix them, and how to optimize workflows once they are working. This includes recognizing failure modes, applying a structured troubleshooting process, managing context windows, and choosing the right levers — model, prompt length, format, task decomposition — to hit your quality, speed, and cost targets.",

  sections: [
    {
      heading: "Recognizing Output Failure Modes",
      body: `Before you can fix a bad output, you need to name the failure. The most common failure modes each have a distinct root cause and a distinct fix.

**Too vague or generic** — the output sounds plausible but lacks specificity. Root cause: the prompt did not provide enough context or detail about the task, the audience, or the required depth. Fix: add domain context, specify the audience, and state what level of detail you need.

**Wrong format** — Claude returned prose when you wanted JSON, or a numbered list when you wanted a table. Root cause: the output format was not explicitly specified. Fix: state the exact format — schema, example, or template — in the prompt.

**Hallucinations** — Claude asserted facts that are not in its training data or in the provided context. Root cause: Claude generated plausible-sounding content to fill gaps in its knowledge. Fix: provide the authoritative source material in the prompt context, instruct Claude to say it doesn't know when uncertain, and validate factual claims independently.

**Too long or too short** — the response is padded with unnecessary text or cuts off before the key content. Root cause: \`max_tokens\` was not set, or no length guidance was given. Fix: set \`max_tokens\` for the API, and include explicit length instructions ("respond in exactly 3 sentences" or "provide a comprehensive analysis of at least 400 words").

**Off-topic drift** — Claude addresses a tangent instead of the core request. Root cause: the system prompt or instructions were not clear enough about scope, or the conversation has drifted from the original goal. Fix: tighten the system prompt to specify scope explicitly, and start a new conversation when the current one has gone off-track.

**Inconsistency across calls** — identical prompts return meaningfully different answers. Root cause: model outputs are non-deterministic by nature; even at the same temperature, the model samples from a probability distribution. Fix: lower temperature via the API (temperature 0 is the most deterministic setting), and use consistent test cases to measure variance rather than assuming calls will be identical.

**Biased or one-sided** — Claude argues a single perspective without acknowledging others. Root cause: the prompt did not explicitly ask for a balanced treatment. Fix: add an instruction like "present multiple perspectives" or "argue both sides before reaching a conclusion."`,
      quiz: [
        {
          question:
            "A Claude-powered application returns wildly different answers to the same question on different API calls. The developer wants more consistency. What is the MOST effective fix?",
          options: [
            "Set temperature to 0 in the API request to minimize sampling randomness",
            "Switch to a more powerful model, which is inherently more deterministic",
            "Add more examples to the system prompt to narrow Claude's range of responses",
            "Increase max_tokens so Claude has room to give a complete answer every time",
          ],
          correctIndex: 0,
          explanation:
            "Model outputs are non-deterministic by nature. Setting temperature to 0 instructs Claude to make the highest-probability token choice at each step, which produces the most consistent and repeatable output. Switching models does not eliminate non-determinism. More examples can help with format consistency but don't address sampling variance. max_tokens controls length, not consistency.",
        },
        {
          question:
            "Claude is summarizing internal documents and frequently includes plausible-sounding facts that are not in those documents. This is BEST described as which failure mode?",
          options: [
            "Hallucination — Claude fabricated facts not present in its training data or the provided context",
            "Off-topic drift — Claude addressed tangential information instead of the core document",
            "Biased output — Claude presented a one-sided view of the document content",
            "Format error — Claude used the wrong output structure for the summarization task",
          ],
          correctIndex: 0,
          explanation:
            "When Claude asserts facts not found in its knowledge base or the provided context, that is hallucination. The fix is to ground Claude in authoritative source material, instruct it to signal uncertainty rather than guess, and validate factual claims independently. Off-topic drift, bias, and format errors are separate failure modes with different root causes and fixes.",
        },
      ],
    },
    {
      heading: "The Troubleshooting Process",
      body: `Fixing a bad prompt is an experiment. Like any experiment, it requires a controlled method — otherwise you change multiple variables at once, and you don't know which change produced the improvement (or the regression).

The recommended troubleshooting process follows four steps: **identify the failure mode → isolate the variable → change one thing at a time → re-evaluate**.

**Identify the failure mode** first. Use the taxonomy from the previous section (too vague, wrong format, hallucination, wrong length, off-topic, inconsistent, biased) to name what is wrong. A diagnosis shapes the fix: if the failure is "wrong format," the fix is in the prompt's format instructions, not in the model choice.

**Isolate the variable** that is most likely responsible for the failure. Is the system prompt too vague? Is the user message missing context? Is there no format instruction at all? Has the conversation accumulated irrelevant history? Narrow it to one candidate cause before experimenting.

**Change one thing at a time.** Changing the model, removing context, and rewriting the system prompt simultaneously makes it impossible to attribute the improvement. Make one change, evaluate the result against your test cases, then decide whether to keep or revert it before making the next change.

**Re-evaluate with consistent test cases.** Eyeballing a single response is not sufficient. Define 3–5 representative test cases that cover the range of inputs you expect in production — including edge cases — and score Claude's output on each one after every change. This surfaces regressions that would be invisible when looking at only one response.

**Keep a changelog.** Record what you changed, what improved, and what degraded. This is the difference between iterating intelligently and going in circles. A simple table — "change | result | decision" — prevents redoing experiments you already ran.`,
      quiz: [
        {
          question:
            "A developer is trying to improve Claude's outputs and simultaneously rewrites the system prompt, switches from Sonnet to Haiku, and removes several few-shot examples. The results improve slightly. What is the problem with this approach?",
          options: [
            "Changing multiple variables at once makes it impossible to identify which change caused the improvement",
            "Switching models should always be done last, not first, in the troubleshooting process",
            "Removing few-shot examples is never a valid optimization step",
            "The developer should have used temperature 0 before making any other changes",
          ],
          correctIndex: 0,
          explanation:
            "The core principle of controlled iteration is changing one thing at a time. When multiple variables change simultaneously, you cannot attribute the result to any specific change. The improvement may be entirely from one change while the other two were neutral or harmful — or worse, two changes improved results while a third regressed them, and you kept all three. Isolate variables to learn what actually works.",
        },
      ],
    },
    {
      heading: "Prompt Iteration Best Practices",
      body: `Effective prompt iteration is an engineering discipline, not guesswork. The practices below separate teams that improve quickly from those that iterate in circles.

**Maintain a prompt changelog.** Every time you modify a prompt, record the date, the specific change made, and the outcome measured against your test cases. Did it improve, degrade, or show no change? This record prevents repeating failed experiments and makes it possible to revert to a known-good baseline when a chain of changes produces a regression.

**Use consistent test cases across iterations.** Before you start iterating, define a fixed evaluation set: representative inputs, including edge cases and the failure cases that triggered the work. Run every prompt version against the same set. Avoid evaluating only on the specific failure case that motivated the change — a fix that addresses one case often breaks another.

**Test one failure mode at a time.** If your prompt has multiple problems (format is wrong and outputs are too long), fix format first, verify the improvement, then address length. Mixing fixes makes attribution impossible.

**Start simple, then add complexity.** A minimal prompt that partially works tells you more than a complex prompt that fails — the minimal version identifies what Claude already does well by default, and you can add targeted instructions to address only the gaps.

**Know when to restart.** When a conversation has accumulated many turns and is producing off-target results, starting a new conversation is often faster than trying to correct course mid-thread. Long conversation histories can cause Claude to weight early context differently, and accumulated misunderstandings compound. Starting fresh with a refined system prompt is a legitimate fix, not a last resort.

**Know when to summarize.** When conversation history is long but the earlier content is genuinely relevant to the current task, summarizing earlier turns rather than discarding them is the right approach. Ask Claude to produce a summary of what has been discussed, then use that summary as context in a new conversation. This preserves relevant information while reducing the effective context window usage.`,
      quiz: [
        {
          question:
            "A team has been iterating on a prompt for two weeks and is now getting worse results than they started with, but can't identify which change caused the regression. What practice would have prevented this?",
          options: [
            "Maintaining a prompt changelog that records each change and its measured outcome",
            "Using a more powerful model that is less sensitive to prompt wording",
            "Running all iterations on Claude.ai instead of the API to avoid parameter variability",
            "Keeping the system prompt as short as possible throughout all iterations",
          ],
          correctIndex: 0,
          explanation:
            "A prompt changelog — recording each change and the resulting outcome against consistent test cases — is what makes it possible to trace a regression to its source and revert to a known-good baseline. Without it, multiple changes accumulate and their individual effects become indistinguishable. Model power doesn't help with this; it's a process discipline issue. Platform choice and prompt length are separate concerns.",
        },
      ],
    },
    {
      heading: "Context Window and Conversation Management",
      body: `Claude has a finite context window. Every token of system prompt, conversation history, and documents consumes space in that window. As a conversation grows, earlier content may receive less effective attention, and eventually the window fills entirely, causing errors or truncated context. Managing the context window is a core operational concern for any long-running Claude application.

**When to restart a conversation:** Start a new conversation when the context window is filling up with content no longer relevant to the current task, when the conversation has gone significantly off-track and correction attempts are not working, or when you are starting a new task that is unrelated to the current conversation. Beginning fresh ensures Claude processes the current task with a clean, focused context rather than a cluttered history.

**When to summarize instead of restarting:** If earlier conversation history is genuinely relevant — for example, decisions and constraints established in previous turns that still apply — summarize rather than discard. Instruct Claude to produce a concise summary of key decisions, facts, and context established so far. Use that summary as the opening context of a new conversation. This is more efficient than restarting entirely and more reliable than hoping Claude attends correctly to a very long history.

**Sizing your context:** For API applications, be deliberate about what goes into the context window. Long system prompts, large reference documents, and verbose conversation history all compete for the same space. Reduce system prompt length to the minimum needed. Retrieve only the document sections relevant to the current query rather than injecting entire documents. Prune old conversation turns that are no longer relevant before each API call.

**Temperature and the API vs. Claude.ai:** Claude.ai does not expose temperature controls to users — the platform manages these settings internally. Developers using the API have full control over temperature (0 = most deterministic, 1 = most creative). This distinction matters for the exam: troubleshooting strategies that rely on adjusting temperature require API access.`,
      quiz: [
        {
          question:
            "A user is working through a complex multi-hour research task in Claude.ai. The conversation is now very long and Claude is starting to lose track of constraints established early in the conversation. What is the BEST approach?",
          options: [
            "Ask Claude to summarize the key decisions and constraints established so far, then start a new conversation using that summary as opening context",
            "Delete the oldest messages from the conversation to free up context space",
            "Switch to Claude Opus 5, which has a larger context window",
            "Repeat the key constraints at the end of each new message to ensure Claude attends to them",
          ],
          correctIndex: 0,
          explanation:
            "When a long conversation causes Claude to lose track of earlier context, the recommended fix is to summarize the relevant prior context and start a fresh conversation with that summary. This preserves the important information while giving Claude a clean, focused context. Deleting messages is not available in Claude.ai. Switching models may provide more context capacity but doesn't solve the underlying attention problem. Repeating constraints every turn adds friction and consumes tokens without addressing the root issue.",
        },
      ],
    },
    {
      heading: "Optimization Levers: Cost, Speed, and Quality",
      body: `Once a workflow produces correct outputs, the next goal is efficiency. The key optimization levers are model selection, prompt length reduction, output format specification, task decomposition, and platform features.

**Model selection — the cost/speed/quality tradeoff.** The Claude model family spans a range: Haiku 4.5 is the fastest and cheapest, with a reliable knowledge cutoff of February 2025; Sonnet 5 balances cost and capability, with a reliable knowledge cutoff of January 2026; Opus 5 is the most capable, with a reliable knowledge cutoff of May 2026; Fable 5.1, with a reliable knowledge cutoff of June 2026, is optimized for specific use cases. Match the model to the task — using Opus 5 for simple classification wastes cost; using Haiku 4.5 for complex multi-step reasoning may sacrifice quality. For many pipelines, a tiered approach works well: use a cheaper, faster model for triage or preprocessing and a more capable model only for the steps that require it.

**Prompt length reduction.** Shorter prompts cost fewer input tokens and process faster. Audit your system prompt for redundant instructions, restatements of Claude's defaults, and content that is never actually relevant to the queries you run. A focused 200-token system prompt often outperforms a bloated 2,000-token one — and costs ten times less in input tokens.

**Output format specification.** Unstructured prose responses are often longer than necessary. Specifying a precise output format — JSON, a fixed-field table, a numbered list with a maximum item count — reduces output token count, which directly reduces cost and latency, and makes downstream processing simpler and more reliable.

**Task decomposition.** Complex multi-step tasks often produce better results when broken into sequential sub-tasks, each with a focused prompt, than when attempted in a single large prompt. Decomposition also makes failures easier to diagnose: if step 3 fails, you know exactly where the breakdown occurred and can fix only that step.

**Claude.ai Projects for consistency.** Claude.ai Projects allow operators to define a persistent system prompt and knowledge base that applies to every conversation in the project. This eliminates "prompt drift" — the gradual degradation that occurs when different users or conversations use slightly different instruction sets. Projects are the Claude.ai mechanism for enforcing consistent behavior across a team without API access.

**Web search for current information.** When Claude needs information beyond its training cutoff, enabling web search in Claude.ai or using a tool-enabled API setup allows Claude to retrieve current data. This is the correct solution when hallucinations or outdated information occur because the question requires knowledge more recent than the model's cutoff — not a prompt fix.

**API rate limits.** API users may encounter rate limits expressed as requests per minute (RPM) or tokens per minute (TPM). When a rate limit is hit, the correct response is to back off and retry with exponential backoff — not to send more requests. Design production pipelines with retry logic, respect the \`Retry-After\` header when present, and request higher rate limits from Anthropic if the workload genuinely requires them.`,
      quiz: [
        {
          question:
            "A team runs a high-volume pipeline that first categorizes support tickets (easy task) and then drafts detailed responses (complex task). They are currently using Claude Opus 5 for both steps. What optimization should they make?",
          options: [
            "Use Claude Haiku 4.5 for the categorization step and reserve Opus 5 for the response drafting step",
            "Switch the entire pipeline to Haiku 4.5 to reduce cost across all steps",
            "Combine both steps into a single prompt to reduce the number of API calls",
            "Use Claude Sonnet 5 for both steps as a balanced compromise",
          ],
          correctIndex: 0,
          explanation:
            "A tiered model strategy — cheaper, faster model for simple tasks; more capable model only for complex tasks — is the canonical cost/quality optimization. Categorization is a simple classification task well within Haiku 4.5's capability, so using Opus 5 there wastes money. Response drafting is complex and benefits from Opus 5's capability. Switching the entire pipeline to Haiku risks quality degradation on the complex step. Combining steps reduces API calls but often reduces output quality and makes failures harder to diagnose.",
        },
        {
          question:
            "A Claude application using the Anthropic API suddenly starts receiving HTTP 429 responses. What is the correct response?",
          options: [
            "Implement exponential backoff and retry logic — the application has hit a rate limit",
            "Switch to a different Claude model, which has separate rate limit buckets",
            "Increase the max_tokens parameter to process more in fewer requests",
            "Move the application to Claude.ai, which does not have rate limits",
          ],
          correctIndex: 0,
          explanation:
            "HTTP 429 indicates a rate limit has been hit — too many requests per minute or too many tokens per minute. The correct engineering response is exponential backoff with retry: wait, then retry, increasing the wait time on each subsequent failure. Switching models does not bypass rate limits; limits are applied at the account level across models. Increasing max_tokens does not help and may worsen token-per-minute limits. Claude.ai is a consumer product, not a rate-limit-free alternative for production API workloads.",
        },
      ],
    },
  ],

  keyFacts: [
    "Common failure modes: too vague, wrong format, hallucination, wrong length, off-topic, inconsistent, biased — each has a distinct root cause",
    "Hallucination = Claude fabricated facts not in its training data or provided context; fix with grounding and uncertainty instructions",
    "Model outputs are non-deterministic by nature — temperature 0 (API only) minimizes but does not eliminate variance",
    "Troubleshooting process: identify the failure mode → isolate the variable → change one thing at a time → re-evaluate",
    "Keep a prompt changelog: record each change and its measured outcome to prevent re-running failed experiments",
    "Restart a conversation when context is filling up or the conversation has gone off-track; summarize when prior context is still relevant",
    "Claude.ai does not expose temperature controls to users — temperature adjustment requires API access",
    "Model knowledge cutoffs: Haiku 4.5 (Feb 2025), Sonnet 5 (Jan 2026), Opus 5 (May 2026), Fable 5.1 (Jun 2026)",
    "Use web search when Claude needs information beyond its training cutoff — this is a capability gap, not a prompt problem",
    "API rate limits (HTTP 429) require exponential backoff and retry — not more requests or model switching",
  ],

  relatedServices: [
    "Prompt Engineering",
    "Claude Models",
    "Messages API",
    "Evaluations and Testing",
    "Anthropic Products",
  ],

  examTips: [
    "Each failure mode has a specific root cause — the exam tests whether you can match failure → cause → fix without mixing them up",
    "Temperature controls sampling randomness only; it does not improve reasoning quality or fix content failures",
    "Temperature adjustment requires API access — Claude.ai users cannot change temperature, so exam scenarios involving temperature control imply API usage",
    "Change one thing at a time when iterating on prompts — the exam favors controlled, methodical iteration over shotgun changes",
    "Summarize long but relevant conversation history; restart when history is long AND irrelevant — know which situation calls for which action",
    "Model selection = cost/speed/quality tradeoff; match the model tier to the task complexity rather than defaulting to the most powerful model for everything",
  ],
};
