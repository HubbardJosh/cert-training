import { ServiceGuide } from "../../../../types/guide";

export const evaluationsAndTestingGuide: ServiceGuide = {
  id: "ccao-evaluations-testing",
  service: "Evaluations and Testing",
  domain: "troubleshooting",
  tagline:
    "Measuring and improving Claude application quality through systematic evaluation",
  intro:
    "Evaluating LLM applications requires different techniques than traditional software testing. Because Claude's outputs are probabilistic and hard to evaluate with simple equality checks, AI operations requires evaluation frameworks, human review, and automated metrics to ensure quality.",

  sections: [
    {
      heading: "Why LLM Evaluation Is Different",
      body: `Traditional software testing uses exact assertions: a function either returns the correct value or it does not. LLM evaluation cannot rely on exact match because Claude's outputs are natural language — multiple phrasings can all be correct, and small prompt changes can produce different but equally valid responses. Evaluating Claude requires **approximate correctness** methods: human judgment, reference-based metrics, model-based evaluation, and task-specific automated checks.

The **non-determinism** of LLMs (especially at temperature > 0) means a single test run is insufficient. A prompt that works correctly 90% of the time will fail 10% of the time on identical inputs. Evaluation must use statistical sampling across many inputs and runs. Passing a single test case does not demonstrate robustness — you need to evaluate across a representative distribution of real inputs.

**Regression testing** is essential: as you improve Claude prompts, you must verify that changes don't degrade previously working behavior. Maintain an **evaluation dataset** — a curated set of inputs with expected outputs or quality criteria — and run it against every prompt change. What passes today might fail with the next prompt iteration.`,
      quiz: [
        {
          question:
            "Why is traditional unit testing with exact-match assertions insufficient for evaluating Claude-powered features?",
          options: [
            "Claude's outputs are probabilistic natural language — multiple phrasings can all be correct, and identical inputs may produce different valid outputs",
            "The Claude API does not support deterministic mode, so exact matches are technically impossible",
            "Unit testing is not applicable to AI — only manual testing is valid for LLM applications",
            "Claude always produces different outputs even at temperature 0, making any testing unreliable",
          ],
          correctIndex: 0,
          explanation:
            "The fundamental issue is that natural language has many valid expressions of the same correct answer, and LLMs are probabilistic. Exact-match assertions fail correct outputs that are phrased differently. At temperature 0 Claude becomes more consistent, but even then, multiple valid phrasings exist. LLM evaluation requires approximate methods — human judgment, semantic similarity, task-specific checks — not exact string comparison.",
        },
      ],
    },
    {
      heading: "Building an Evaluation Dataset",
      body: `An **evaluation dataset** (eval set) is a collection of inputs with associated expected outputs, quality criteria, or reference answers used to measure prompt and model performance. Building a good eval set is one of the highest-leverage investments in an AI application's quality. A representative eval set lets you measure the impact of every prompt change before deploying to production.

Eval sets should cover: **typical cases** (the most common inputs your application receives), **edge cases** (unusual inputs that are hard to handle correctly), **adversarial cases** (inputs designed to trip up the model or elicit policy violations), and **regression cases** (inputs where the model previously failed and was fixed). Draw from real production traffic where possible — real user inputs are more representative than synthetic examples.

Eval sets require **ground truth**: for each input, you need either a reference answer to compare against or evaluation criteria (a rubric) a reviewer can apply. For factual tasks, ground truth is a known correct answer. For open-ended generation tasks, ground truth is a rubric: "Does the response address the user's question? Is it appropriately concise? Does it avoid hallucinating facts?" Creating high-quality ground truth is labor-intensive but essential.`,
      quiz: [
        {
          question:
            "What is the MOST important source of inputs for a production evaluation dataset?",
          options: [
            "Real production traffic — actual user inputs are the most representative of what the application will face",
            "Synthetically generated inputs created by Claude — faster to produce and more diverse",
            "The development team's manually crafted test cases — they know the application best",
            "Competitor applications' public outputs — benchmarks against industry standards",
          ],
          correctIndex: 0,
          explanation:
            "Real production traffic is the gold standard for eval set inputs because actual user behavior is the most accurate reflection of what the application will encounter in production. Synthetic inputs may miss the distribution of real user queries. Developer-crafted cases reflect the developer's assumptions rather than real user behavior. Competitor benchmarks measure something other than your specific application's quality.",
        },
      ],
    },
    {
      heading: "Automated Evaluation Methods",
      body: `Several automated methods can evaluate Claude's outputs at scale. **Reference-based metrics** compare the output to a known correct answer: exact match (for extractable facts), BLEU/ROUGE (for text overlap, common in summarization), semantic similarity (embedding distance between output and reference, better than token overlap for meaning comparison), and F1 for classification tasks with defined categories.

**Model-based evaluation (LLM-as-judge)** uses a separate Claude call (often a more capable model) to evaluate the output of a primary Claude call. For example: send both the original prompt and Claude's response to an evaluator model that scores the response on a rubric (0–5 scale for helpfulness, accuracy, and safety). This is powerful for tasks where no simple reference answer exists — the evaluator model can apply nuanced criteria that would be expensive for humans to evaluate at scale.

**Task-specific automated checks** are custom validators for your application's requirements: verifying that output is valid JSON, that extracted dates are in the correct format, that generated code compiles, that required fields are present, or that prohibited content is absent. These are inexpensive to run at scale and catch the most common failure modes before human review.`,
      quiz: [
        {
          question:
            "An application uses Claude to generate marketing copy. There is no single 'correct' answer and quality is subjective. What is the MOST scalable evaluation approach?",
          options: [
            "LLM-as-judge — use a capable Claude model to evaluate outputs against a quality rubric",
            "BLEU score — measure token overlap between Claude's output and reference marketing copy",
            "Exact match — compare against a golden set of approved marketing phrases",
            "Human review of every single output before publishing",
          ],
          correctIndex: 0,
          explanation:
            "LLM-as-judge is the most scalable approach for subjective open-ended tasks where no single correct answer exists. A capable evaluator model can apply a nuanced quality rubric across thousands of outputs. BLEU measures token overlap, which is a poor proxy for marketing copy quality. Exact match is inappropriate for creative content. Human review of every output is the highest quality method but does not scale — reserve it for spot-checking and calibrating automated evaluators.",
        },
      ],
    },
    {
      heading: "Prompt Iteration and A/B Testing",
      body: `Improving Claude application quality is an iterative process: write a prompt, evaluate it against your eval set, identify failure modes, modify the prompt, evaluate again. This loop should be systematic rather than ad hoc. Keep a **prompt changelog** that records every version, its eval set scores, and why changes were made. Never overwrite prompts without recording what was changed.

**A/B testing** compares two or more prompt variants in production to measure which performs better on real traffic. Unlike offline eval sets, A/B testing measures real user behavior — click-through rates, task completion, user ratings, or downstream conversion metrics. A/B testing is especially valuable for measuring impact on subjective quality dimensions that are hard to capture in an eval set.

When iterating prompts, change one thing at a time. Changing multiple prompt components simultaneously makes it impossible to attribute quality changes to specific modifications. Start with the highest-impact changes (role, core instructions, output format) before fine-tuning (tone adjustments, edge case handling, stylistic details).`,
      quiz: [
        {
          question:
            "A developer changes multiple parts of a system prompt simultaneously and the eval set score drops. What mistake did they make?",
          options: [
            "Changed multiple prompt components at once — impossible to identify which change caused the regression",
            "Did not run enough test cases — the eval set is too small to be reliable",
            "Used the eval set for both development and testing — data leakage invalidated results",
            "Should have used A/B testing in production instead of an eval set",
          ],
          correctIndex: 0,
          explanation:
            "The fundamental mistake is changing multiple things simultaneously. When the eval score drops, there is no way to determine which change was responsible. The correct practice is to change one element at a time, measure impact, then proceed to the next change. This allows attribution of quality changes to specific prompt modifications.",
        },
      ],
    },
    {
      heading: "Hallucination Detection and Grounding",
      body: `**Hallucination** occurs when Claude generates confident-sounding but factually incorrect information. This is one of the most significant quality risks in production AI applications. Hallucination is more common when Claude is asked about: very recent events beyond its training cutoff, highly specific facts (exact statistics, exact quotes, specific URLs), topics with limited training data, and tasks requiring precise recall rather than reasoning.

Mitigation strategies: **retrieval-augmented generation (RAG)** provides Claude with relevant source documents in the prompt, grounding its response in verified content and enabling citation. **Factual verification workflows** route Claude's output through an automated or human fact-checking step before publication. **Uncertainty elicitation** instructs Claude to express uncertainty ("I'm not certain about this") rather than generate confident incorrect answers — combined with a fallback that routes uncertain responses to human review.

Evaluate hallucination rates in your eval set by including inputs that require specific factual recall and checking outputs against known ground truth. Track hallucination rates as a production metric using sampling-based human review. A drop in hallucination rate is one of the most impactful quality improvements for factual applications.`,
      quiz: [
        {
          question:
            "An application uses Claude to answer questions about a company's internal product catalog. Users frequently report that Claude invents product details that don't exist. What is the BEST architectural fix?",
          options: [
            "Implement RAG — retrieve relevant product catalog entries and include them in the prompt context for each query",
            "Use Opus instead of Sonnet — more capable models hallucinate less",
            "Add a system prompt instruction 'Do not make up product details'",
            "Fine-tune Claude on the product catalog data",
          ],
          correctIndex: 0,
          explanation:
            "RAG is the correct architectural fix for hallucination on specific factual domains. By retrieving actual product catalog data and including it in the prompt, Claude's responses are grounded in verified information it can cite rather than recalled from training. More capable models hallucinate less in general but still hallucinate on specific proprietary data they were not trained on. System prompt instructions help but are insufficient against strong hallucination tendencies on unfamiliar data. Fine-tuning is a larger investment than RAG and still doesn't guarantee factual accuracy on a changing catalog.",
        },
      ],
    },
  ],

  keyFacts: [
    "LLM evaluation requires approximate methods — exact match is insufficient for natural language",
    "Evaluation datasets should include typical, edge, adversarial, and regression cases",
    "Real production traffic is the best source for eval set inputs",
    "LLM-as-judge scales subjective quality evaluation to large volumes",
    "Change one prompt element at a time to attribute quality improvements correctly",
    "Hallucination is most common on specific facts, recent events, and proprietary data",
    "RAG grounds Claude responses in verified source documents, reducing hallucination",
    "A/B testing in production measures real user behavior impact of prompt changes",
    "Prompt changelog: always record what changed, eval scores, and why",
    "Track hallucination rate as a production metric via sampling-based human review",
  ],

  relatedServices: [
    "Prompt Engineering",
    "Claude Models",
    "Production Deployment",
    "Safety and Responsible AI",
  ],

  examTips: [
    "Exact match testing is insufficient for LLMs — use approximate methods",
    "LLM-as-judge = scalable evaluation for subjective tasks with no single correct answer",
    "RAG = the architectural fix for hallucination on proprietary or specific factual data",
    "Change one prompt element at a time to identify what caused quality changes",
    "Eval datasets need real traffic samples, not just synthetic developer-crafted examples",
    "Hallucination is worst on specific facts, recent events, and data not in training",
  ],
};
