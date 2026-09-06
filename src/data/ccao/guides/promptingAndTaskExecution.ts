import { ServiceGuide } from "../../../types/guide";

export const promptingAndTaskExecutionGuide: ServiceGuide = {
  id: "ccao-prompting-task-execution",
  service: "Prompting and Task Execution",
  domain: "fundamentals",
  tagline:
    "Craft effective prompts, decompose complex tasks, and iterate toward high-quality Claude outputs",
  intro:
    "Domain 1 of the CCAO-F exam (14% weight) covers how users and operators write prompts that produce reliable, high-quality responses from Claude. This includes the principles of clear and specific instructions, structuring complex requests with XML tags, decomposing multi-step tasks, using few-shot examples and chain-of-thought techniques, and iterating prompts systematically to improve output quality across different task types.",

  sections: [
    {
      heading: "Effective Prompt Principles",
      body: `Every high-quality Claude interaction starts with a prompt that is **clear**, **specific**, and **complete**. Clarity means the instruction is unambiguous — if a human reader would hesitate over what is being asked, Claude will too. Specificity means stating exactly what you want: format, length, tone, audience, and any constraints. Completeness means supplying all the context Claude needs to answer without having to guess at unstated requirements.

A vague prompt like "Write something about our product launch" can produce anything from a press release to a bullet list to an internal memo. A specific prompt — "Write a 150-word announcement for our product launch aimed at existing customers, in an enthusiastic but professional tone, highlighting the two key new features: faster processing and lower cost" — leaves Claude no room to guess and produces a predictable, usable result every time.

**Instruction placement matters.** Claude processes a prompt sequentially, and instructions placed early receive more attention than those buried in the middle of a long message. Put your most critical constraints — output format, must-not-include rules, audience definition — near the top of the system prompt or at the opening of the user turn. This is especially important for long prompts where important details can get lost.`,
      quiz: [
        {
          question:
            "A marketing team asks Claude to 'write something about our new product' and receives wildly inconsistent outputs — sometimes a press release, sometimes a social post, sometimes a feature list. What is the MOST effective fix?",
          options: [
            "Rewrite the prompt to specify the format, audience, tone, length, and key points to include",
            "Use a higher temperature setting so Claude explores more creative options",
            "Switch to a more powerful Claude model to improve consistency",
            "Add the phrase 'please be consistent' to the existing prompt",
          ],
          correctIndex: 0,
          explanation:
            "Inconsistent outputs are caused by underspecification — Claude fills in missing details differently each time. The fix is to make the prompt specific: define the format, audience, tone, length, and required content. Temperature controls randomness, not output structure. A more powerful model may improve quality but won't enforce a format without instructions. Asking for consistency without specifying what consistent means provides no guidance.",
        },
        {
          question:
            "Where in a long system prompt should the most critical behavioral constraints be placed for maximum effect?",
          options: [
            "Near the top of the system prompt, before background context",
            "At the very end of the system prompt so they are the last thing Claude reads",
            "Repeated three times throughout the prompt to ensure Claude notices them",
            "In the user turn rather than the system prompt",
          ],
          correctIndex: 0,
          explanation:
            "Critical instructions should be placed early in the system prompt because Claude processes prompts sequentially and earlier instructions receive more attention. Placing constraints at the end risks them being underweighted in long prompts. Repetition can cause inconsistencies if the repeated versions differ slightly. The system prompt is the right location for behavioral constraints — that is its purpose.",
        },
      ],
    },
    {
      heading: "Structuring Complex Prompts with XML Tags",
      body: `When a prompt contains multiple types of content — background context, behavioral rules, examples, user input — **XML tags** are the recommended way to organize them. Claude is trained to recognize XML-style tags as semantic boundaries. Wrapping sections in tags like \`<context>\`, \`<instructions>\`, \`<example>\`, and \`<user_input>\` tells Claude exactly what kind of information each section contains and prevents different sections from blurring together.

For example, a customer support system prompt might read:

\`\`\`xml
<context>
You are a support assistant for Acme Software. Acme offers three products:
Starter, Pro, and Enterprise. Starter supports up to 5 users; Pro up to 50;
Enterprise is unlimited.
</context>

<instructions>
Answer only questions about Acme products. If a question is outside this
scope, politely decline and redirect to support@acme.com.
</instructions>
\`\`\`

Without tags, a long prose system prompt forces Claude to infer which sentences are background facts versus which are directives — an inference that can go wrong at the boundaries. Tags eliminate that ambiguity. They are especially valuable when untrusted user content is injected into the prompt: wrapping user-submitted text in \`<user_document>\` tags and instructing Claude to treat that section as data rather than instructions is a primary defense against prompt injection.

Avoid contradicting or duplicating instructions across sections. If the same rule appears in both \`<instructions>\` and a later paragraph without tags, Claude may receive conflicting signals. Keep each instruction in one authoritative location.`,
      quiz: [
        {
          question:
            "A developer is building a Claude-powered app that processes user-submitted documents. They want to prevent users from embedding instructions that override the system prompt. What is the BEST technique?",
          options: [
            "Wrap user document content in XML tags (e.g., <user_document>) and instruct Claude to treat that section as data, not instructions",
            "Set temperature to 0 to reduce Claude's responsiveness to injected instructions",
            "Use Claude Haiku, which is less susceptible to prompt injection than other models",
            "Increase the system prompt length to outweigh any injected instructions",
          ],
          correctIndex: 0,
          explanation:
            "Wrapping untrusted content in XML delimiters and explicitly instructing Claude to treat it as data is the primary defense against prompt injection. Temperature controls sampling randomness, not instruction-following behavior. All Claude models are equally susceptible to injection — this is not a model-tier issue. A longer system prompt does not structurally protect against injection; it just adds more content for Claude to weigh.",
        },
      ],
    },
    {
      heading: "Task Decomposition for Complex Requests",
      body: `**Task decomposition** is the practice of breaking a complex, multi-step request into a sequence of smaller, focused subtasks rather than asking Claude to do everything in a single prompt. This is one of the most powerful techniques for improving output quality on difficult tasks because each subtask can be optimized, reviewed, and corrected independently before the next step depends on it.

Consider the task: "Research our three main competitors, identify gaps in their offerings, draft a competitive positioning statement, and create a slide deck outline." Submitted as a single prompt, this is likely to produce shallow results at each step because Claude must split its attention across all four goals simultaneously. Decomposed into four sequential prompts, each step can be thorough, and the output of each step can be reviewed before it becomes the input to the next.

**How to decompose effectively:**
- Identify the natural dependencies between steps — what must be done before something else can proceed
- Define a clear output format for each subtask so the output can be reliably used as input to the next step
- Use XML tags to pass outputs from one step to the next (e.g., wrap the step-1 output in \`<research_findings>\` when submitting it to step 2)
- Review each output before proceeding — catch errors early rather than letting them propagate through the chain

Task decomposition is applicable across all task types: analysis tasks become a research step followed by a synthesis step; drafting tasks become an outline step followed by a writing step; decision tasks become a criteria-definition step followed by an evaluation step.`,
      quiz: [
        {
          question:
            "A product manager asks Claude in a single prompt to analyze customer feedback, identify the top three pain points, prioritize them by business impact, and draft a product roadmap section addressing each one. The output is shallow and inconsistent. What is the BEST approach?",
          options: [
            "Decompose the request into sequential subtasks: analyze feedback first, then identify pain points, then prioritize, then draft the roadmap section",
            "Use chain-of-thought prompting to ask Claude to reason step by step within the single prompt",
            "Increase the max_tokens parameter to give Claude more room to complete all steps",
            "Use few-shot examples showing the complete four-step output in a single response",
          ],
          correctIndex: 0,
          explanation:
            "Task decomposition into sequential subtasks is the correct approach when a single prompt requires too many steps for deep, reliable output. Each subtask can be thorough and reviewed before the next step depends on it. Chain-of-thought helps Claude reason within a single prompt but doesn't solve the problem of trying to do four deep tasks at once. Increasing max_tokens gives more room but doesn't improve the quality of each step. Few-shot examples of a four-step output would be extremely long and still wouldn't decompose the workload.",
        },
      ],
    },
    {
      heading: "Few-Shot Examples and Chain-of-Thought",
      body: `**Few-shot prompting** provides Claude with labeled examples of the desired input-output pattern directly in the prompt. Instead of describing the desired format in abstract terms, you show it: "Here is an input and the correct output I expect." Claude learns the pattern from the examples and applies it to new inputs, producing far more consistent results than description alone — especially for tasks involving custom formats, specialized terminology, or nuanced classification.

The quality of examples matters more than quantity. Two or three excellent, diverse, representative examples outperform ten mediocre ones. Examples should cover the range of real inputs, including edge cases if they are common. Examples that are too similar to each other teach only a narrow slice of the target behavior. For classification tasks with multiple categories, include at least one example per category.

**Chain-of-thought (CoT) prompting** instructs Claude to reason step by step before producing a final answer. Asking Claude to "think step by step" or "show your reasoning before concluding" dramatically improves accuracy on multi-step tasks — logical reasoning, complex analysis, policy evaluation, mathematical problems — because working through intermediate steps surfaces assumptions, catches errors, and breaks the problem into manageable pieces.

CoT increases output token count and therefore cost and latency. For simple tasks like short-answer lookups or straightforward extraction, CoT adds overhead without benefit. Apply it selectively to tasks where reasoning genuinely improves accuracy or where the reasoning chain itself is valuable to the user (e.g., explaining a decision). You can combine both techniques: provide few-shot examples that include a reasoning chain, demonstrating both the reasoning style and the final output format you want.`,
      quiz: [
        {
          question:
            "A legal team wants Claude to categorize contracts into one of six internal risk tiers. The distinctions between tiers are subtle and based on internal policy nuance. Which technique is MOST effective?",
          options: [
            "Few-shot examples — provide 2–3 labeled contracts for each of the six risk tiers",
            "Zero-shot — describe all six tiers in detailed prose and trust Claude to categorize correctly",
            "Temperature 0 — deterministic output ensures consistent categorization",
            "Increase max_tokens to give Claude more room to consider all six categories",
          ],
          correctIndex: 0,
          explanation:
            "Few-shot examples are the most effective technique when category distinctions are subtle and policy-specific. Showing labeled examples of each tier is far clearer than prose descriptions of nuanced differences. Zero-shot with prose descriptions alone struggles when boundaries between categories are close. Temperature 0 affects sampling randomness, not the ability to distinguish subtle categories. Increasing max_tokens gives more output room but doesn't improve categorization quality.",
        },
        {
          question:
            "A developer asks Claude to evaluate a complex business scenario involving multiple interdependent rules and find the correct outcome. Accuracy is poor with a direct prompt. What is the MOST likely effective fix?",
          options: [
            "Add chain-of-thought instructions — ask Claude to reason through each rule step by step before concluding",
            "Use a higher temperature to allow Claude to explore more possible outcomes",
            "Use a lower temperature to make the output more deterministic",
            "Reduce the length of the prompt to remove distracting context",
          ],
          correctIndex: 0,
          explanation:
            "Chain-of-thought is the most effective technique for complex multi-step reasoning. Having Claude work through each rule step by step before concluding dramatically improves accuracy by surfacing errors in intermediate steps. Higher temperature increases randomness, which hurts accuracy on logic tasks. Lower temperature makes output more deterministic but doesn't improve the underlying reasoning. Reducing prompt length removes context Claude needs to reason correctly.",
        },
      ],
    },
    {
      heading: "Iterating Prompts and Adapting by Task Type",
      body: `**Prompt iteration** is the process of systematically improving a prompt based on observed outputs. The cardinal rule is: **change one variable at a time**. If you simultaneously change the role definition, add few-shot examples, and restructure the output format, you cannot know which change produced the improvement (or introduced a new problem). Isolate variables: test one change, evaluate the result, then test the next change.

A productive iteration workflow:
1. Run the prompt on a representative set of inputs — not just one example, because a single lucky result can mislead
2. Identify the specific failure mode: Is the format wrong? Is reasoning shallow? Is the tone off? Is important information missing?
3. Form a hypothesis: "If I add an explicit format instruction, the format inconsistency will resolve"
4. Change only that one thing and re-test on the same input set
5. Evaluate whether the failure mode improved without introducing new problems

**Adapting strategy by task type** is also tested on the CCAO-F exam. Different task categories call for different primary techniques:

- **Analysis tasks** (summarization, evaluation, comparison): Be explicit about the analytical framework. Use CoT for complex analyses. Define the criteria you want applied.
- **Research tasks** (gathering information, synthesizing sources): Break into subtasks — gather, then synthesize. Ask Claude to cite specific parts of provided documents.
- **Drafting tasks** (emails, reports, proposals): Specify audience, tone, length, and required sections. Use an outline step before a full-draft step.
- **Brainstorming tasks** (idea generation, options exploration): Higher temperature helps. Ask for quantity over quality in the first pass, then filter. Avoid evaluating ideas during generation — it suppresses creativity.

The exam tests whether you can match the right technique to the task type, not just whether you know the techniques in isolation.`,
      quiz: [
        {
          question:
            "A team is iterating on a prompt and makes three changes at once: adds a role definition, switches from zero-shot to few-shot, and changes the output format. The new output is better, but they cannot reproduce the improvement reliably on different inputs. What went wrong?",
          options: [
            "They changed multiple variables simultaneously, making it impossible to identify which change caused the improvement",
            "They did not increase the temperature to explore more output variations",
            "They should have used chain-of-thought instead of few-shot examples",
            "The improvement was caused by the output format change and should be kept as the final prompt",
          ],
          correctIndex: 0,
          explanation:
            "Changing multiple prompt variables simultaneously violates the core principle of prompt iteration. When results change, you cannot attribute the cause to any specific change, so you cannot reliably reproduce or extend the improvement. The correct approach is to change one variable at a time, evaluate, and then proceed to the next change. Increasing temperature and switching techniques are separate concerns unrelated to the iteration methodology failure. Assuming the format change caused the improvement is speculation — without controlled testing, you cannot know.",
        },
        {
          question:
            "A user wants Claude to generate as many creative product name ideas as possible before narrowing them down. Which approach is MOST aligned with best practices for brainstorming tasks?",
          options: [
            "Use higher temperature and ask for quantity first, then evaluate and filter in a separate step",
            "Use temperature 0 to get the single best product name Claude can produce",
            "Ask Claude to generate ideas and simultaneously evaluate and rank them in the same response",
            "Use chain-of-thought to have Claude reason carefully before suggesting any name",
          ],
          correctIndex: 0,
          explanation:
            "Brainstorming tasks benefit from higher temperature (more diverse outputs) and separating generation from evaluation. Asking for quantity first, then filtering in a follow-up step, produces the best brainstorming results. Temperature 0 produces the single most probable output — the opposite of creative exploration. Simultaneous generation and evaluation suppresses creative output because the model self-censors during generation. Chain-of-thought is suited for reasoning tasks, not creative generation.",
        },
      ],
    },
  ],

  keyFacts: [
    "Domain 1 is 14% of the CCAO-F exam — the second-smallest domain but foundational to all others",
    "Effective prompts are clear, specific, and complete — vague instructions produce unpredictable outputs",
    "Place critical constraints early in the system prompt; they receive more weight than late instructions",
    "XML tags (e.g., <context>, <instructions>, <example>) are the recommended way to structure complex prompts",
    "Few-shot examples outperform prose descriptions for tasks with subtle distinctions or custom formats",
    "Chain-of-thought ('think step by step') improves accuracy on multi-step reasoning tasks at higher token cost",
    "Task decomposition breaks complex requests into sequential subtasks — each can be reviewed before the next step",
    "Change only one variable at a time when iterating prompts — batch changes hide causality",
    "Brainstorming: use higher temperature and separate generation from evaluation for best results",
    "Drafting tasks: define audience, tone, length, and required sections; use an outline step first",
  ],

  relatedServices: [
    "Prompt Engineering",
    "Claude Models",
    "Capabilities and Limitations",
    "Safety and Responsible AI",
  ],

  examTips: [
    "Underspecified prompts = inconsistent outputs — the fix is always more specific instructions, not a different model",
    "XML tags are the go-to answer for structuring complex system prompts and delimiting untrusted content",
    "Few-shot examples beat prose descriptions when category boundaries are subtle or formats are custom",
    "Chain-of-thought is the right technique for complex reasoning tasks — expect a cost/latency trade-off",
    "Task decomposition is the answer when a single prompt tries to do too many deep steps at once",
    "Prompt iteration: change one variable at a time — the exam may present a scenario where batching changes is the mistake",
    "Match technique to task type: CoT for analysis/reasoning, few-shot for classification, higher temperature for brainstorming",
  ],

  topicQuiz: [
    {
      question:
        "Which combination of techniques is MOST appropriate for a complex research-and-drafting task where a user must analyze competitor products and then write a positioning document?",
      options: [
        "Task decomposition (research step, then drafting step) with explicit output format for each step",
        "A single prompt with chain-of-thought instructions covering all steps at once",
        "Few-shot examples showing a complete research-and-draft output in one response",
        "Temperature 0 to ensure the most accurate research findings",
      ],
      correctIndex: 0,
      explanation:
        "Task decomposition is the best approach for multi-step tasks where each step needs depth and the output of one step feeds the next. Splitting research and drafting into separate prompts allows each to be thorough and reviewed before proceeding. A single chain-of-thought prompt can help with reasoning but doesn't decompose the workload the way sequential prompts do. Few-shot examples of a combined output would be enormous and still don't decompose the task. Temperature 0 helps with consistency but not with task complexity.",
    },
  ],
};
