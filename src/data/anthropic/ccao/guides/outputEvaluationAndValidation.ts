import { ServiceGuide } from "../../../../types/guide";

export const outputEvaluationAndValidationGuide: ServiceGuide = {
  id: "ccao-output-evaluation-validation",
  service: "Output Evaluation and Validation",
  domain: "fundamentals",
  tagline:
    "Assess, verify, and refine Claude's outputs to ensure accuracy, completeness, and fitness for purpose",
  intro:
    "Output evaluation and validation is the highest-weighted domain in the CCAO-F exam at 21% — reflecting how central this skill is to responsible AI operations. Knowing how to identify hallucinations, spot biases, apply fact-checking techniques, determine when human review is required, and select appropriate output formats is essential for anyone deploying or working with Claude in a professional context.",

  sections: [
    {
      heading: "Evaluating Outputs for Accuracy and Completeness",
      body: `Evaluating a Claude response for accuracy means verifying that every factual claim it makes is true and traceable to a reliable source. Evaluating for completeness means confirming that the response actually addresses the full scope of the original request — not just the easiest or most prominent parts.

**Accuracy checks** should focus on specific, falsifiable claims: names, dates, statistics, quotes, URLs, regulatory requirements, and technical specifications. These are the categories most vulnerable to hallucination. A response that sounds authoritative and well-structured can still contain incorrect details embedded within otherwise accurate prose. Evaluators must not assume that a well-formatted response is a correct one.

**Completeness checks** require returning to the original prompt and confirming each sub-question or requirement has been addressed. Claude may produce a response that handles the most prominent aspect of a request while silently omitting secondary requirements. For multi-part questions, a structured checklist approach — one item per requirement — is more reliable than a general "does this feel complete?" impression.

Both accuracy and completeness evaluations benefit from **rubric-based scoring** rather than holistic judgment. Defining explicit criteria before evaluating (e.g., "must cite a source for every statistic," "must address all three sub-questions") produces more consistent, auditable assessments than evaluating by impression alone. When accuracy cannot be confirmed through available sources, the output should be flagged for further verification rather than assumed correct.`,
      quiz: [
        {
          question:
            "A Claude-generated report contains a paragraph with fluent prose, correct grammar, and a logical structure — but includes a specific statistic that the reviewer cannot locate in any cited source. How should the reviewer handle this?",
          options: [
            "Flag the statistic for independent verification before using the report, regardless of how well-written the surrounding text is",
            "Accept it — well-structured outputs with no grammatical errors are generally factually reliable",
            "Ask Claude to confirm the statistic in a follow-up message; if it repeats it confidently, treat it as verified",
            "Discard the entire report because a single unverifiable statistic invalidates the whole document",
          ],
          correctIndex: 0,
          explanation:
            "Fluent, well-structured writing is not evidence of factual accuracy. Claude can hallucinate specific statistics with full confidence and natural prose. The correct action is to flag the specific claim for independent verification from an authoritative source. Re-asking Claude is not verification — it may simply repeat the same hallucination. And discarding the entire report is not necessary; targeted fact-checking of specific claims is the appropriate approach.",
        },
        {
          question:
            "An operator asks Claude a five-part question. Claude's response is detailed and addresses parts 1, 2, 3, and 5 clearly. What is the most important evaluation step before considering the output complete?",
          options: [
            "Return to the original prompt and explicitly verify that part 4 was addressed; if not, request a follow-up response covering the missing requirement",
            "Assume part 4 was implicitly addressed within the answer to part 3 or 5",
            "Accept the response — Claude's length and detail indicate thorough coverage",
            "Re-submit the full question; Claude will automatically detect which parts were missed",
          ],
          correctIndex: 0,
          explanation:
            "Completeness evaluation requires explicitly checking each requirement against the original prompt. Claude can omit parts of a multi-part question without signaling that it has done so — the response can appear thorough while missing a requirement entirely. The evaluator must perform a deliberate cross-check, not infer completeness from length or detail. Re-submitting without review wastes resources and may produce the same gap.",
        },
      ],
    },
    {
      heading: "Identifying Hallucinations, Inconsistencies, and Biases",
      body: `**Hallucination** is Claude confidently stating information that is false. It is not a malfunction — it is an inherent property of how large language models generate text. Claude produces statistically coherent continuations of text, and that process can yield plausible-sounding falsehoods, particularly for specific facts it was not reliably trained on: niche statistics, precise quotes, specific URLs, proprietary internal data, and events after its training cutoff.

High-risk hallucination categories include: citations and bibliographic details (fabricated authors, journal names, and page numbers that look real), specific numerical claims (percentages, dollar amounts, dates), claims about named individuals (roles, credentials, statements they made), and technical specifics (exact API parameter names, version-specific behavior). Evaluators should treat any specific factual claim in these categories as unverified until confirmed against an independent source.

**Inconsistencies** within a single Claude output are a separate signal. If Claude states in paragraph two that a policy applies to all users and states in paragraph five that it applies only to enterprise users, one of those claims is wrong — or the prompt was ambiguous. Inconsistencies often reveal that Claude has handled different parts of a long response with different implicit assumptions. Reviewing a long output for internal contradictions is a necessary validation step.

**Bias** in Claude's outputs reflects patterns in training data and does not require malicious intent to be harmful. Bias can appear as: systematically favoring one cultural, political, or demographic perspective; using language that implicitly centers one group; presenting one side of a contested topic as settled while treating the other as fringe; or producing subtly different advice depending on names or demographic signals embedded in the prompt. Evaluating for bias requires awareness that a response can be factually accurate but still systematically skewed in framing, emphasis, or omission.`,
      quiz: [
        {
          question:
            "A reviewer notices that a Claude-generated legal summary quotes a case as 'Smith v. Johnson, 482 U.S. 522 (1987)' with specific page numbers and holding details. The reviewer cannot find this case in a legal database. What most likely explains this?",
          options: [
            "Claude hallucinated the citation — fabricating realistic-looking legal citations with case names, volume numbers, and holdings is a known hallucination pattern",
            "The case is real but the database has a gap; Claude's citations are generally reliable for U.S. Supreme Court cases",
            "Claude accessed a proprietary legal database during generation and the citation reflects a real but obscure case",
            "The citation format is incorrect, which caused the search to fail; the underlying case is real",
          ],
          correctIndex: 0,
          explanation:
            "Fabricating realistic-looking citations — including plausible case names, reporter volumes, page numbers, and holdings — is one of the most well-documented hallucination patterns in LLMs. Claude cannot access external legal databases; it generates text based on statistical patterns learned during training. A citation that cannot be located in authoritative legal databases should be treated as a hallucination, not a database gap. Legal, medical, and academic citations from Claude must always be independently verified.",
        },
      ],
    },
    {
      heading: "Applying Fact-Checking and Validation Techniques",
      body: `Effective fact-checking of Claude outputs combines several techniques depending on the nature of the claim and the stakes involved. No single technique covers all cases.

**Source triangulation** means verifying a claim against at least two independent authoritative sources. A claim that appears in only one source — especially a secondary source — warrants more scrutiny. For factual claims in Claude's output, the standard should be: can this be confirmed by a primary source (an original study, an official government document, an authoritative reference work) rather than just a plausible-sounding assertion?

**Prompt-based self-critique** asks Claude to review its own output for potential errors or uncertainties. You can ask Claude to identify the claims in a response it is least confident about, to flag statements that depend on information that could have changed since its training, or to distinguish between what it knows with high confidence versus what it is inferring. This technique is useful for scoping where to focus external verification effort, but it is not itself a verification step — Claude can be confidently wrong and may not flag its own hallucinations.

**Structured decomposition** breaks a complex output into individual atomic claims, each of which can be evaluated independently. This is more rigorous than reviewing prose holistically because it forces explicit attention to each specific assertion rather than allowing vague impressions of accuracy to substitute for actual verification.

**Cross-checking with retrieved context** is especially relevant in RAG architectures: if Claude was given source documents as context, each factual claim in the output can be checked against those specific documents. Claims that appear in the output but have no basis in the retrieved context are candidates for hallucination or unsupported inference.

For high-stakes outputs, validation should be documented — not just performed mentally. A written checklist with each claim and its verified source creates an auditable record that supports accountability and allows others to replicate the review.`,
      quiz: [
        {
          question:
            "An operator asks Claude to identify the weakest factual claims in its own response so the team knows where to focus verification effort. What is the correct interpretation of this technique?",
          options: [
            "It is a useful scoping tool that narrows verification focus, but Claude's self-assessment is not itself verification — Claude may still be confidently wrong about the claims it does not flag",
            "It is a reliable verification step — if Claude does not flag a claim as uncertain, that claim can be treated as verified",
            "It is not useful because Claude cannot evaluate its own outputs",
            "It replaces the need for external source checking for all claims Claude expresses confidence about",
          ],
          correctIndex: 0,
          explanation:
            "Self-critique prompting is a useful triage tool — it can direct human effort toward the most uncertain areas of a response. However, Claude can hallucinate with apparent confidence and may not flag those hallucinations when asked to self-assess. Self-critique narrows verification scope; it does not substitute for independent verification against authoritative sources. High-confidence Claude claims can still be wrong.",
        },
      ],
    },
    {
      heading: "Determining When Human Review Is Required",
      body: `Not all Claude outputs carry equal risk. A response used to draft an internal brainstorm note and a response used to inform a medical treatment decision require very different levels of validation. Calibrating when to require human review — and how intensive that review should be — is a core operational skill.

**High-stakes domains require human review by default.** Medical, legal, and financial decisions based on AI outputs can cause direct, irreversible harm if incorrect. Claude's outputs in these domains should be reviewed by a qualified professional before being acted upon, regardless of how accurate the output appears. This is not a commentary on Claude's quality — it is a recognition that the consequences of an undetected error are too severe to accept without expert oversight.

**Novelty and ambiguity increase review need.** If a prompt is unusual, edge-case, or tests the boundaries of Claude's training, the output is more likely to be unreliable. Standard, well-scoped tasks within Claude's documented strengths carry lower risk than novel or highly specific tasks. When a task departs from common patterns, escalate to human review.

**Non-determinism is a reason to review final outputs.** Claude's outputs are non-deterministic — the same prompt can produce different results across runs. A response that happened to be generated at a particular moment should not be treated as the canonical correct answer for all time. For important decisions, sampling multiple responses and comparing them can reveal variability that signals uncertainty.

**Automated consistency checks** can partially substitute for human review in structured output contexts: if Claude is generating JSON that must conform to a schema, automated validation against that schema can catch structural errors immediately. But schema conformance does not guarantee factual accuracy — it only ensures structural correctness.

A practical decision framework: if an error in this output would cause financial loss, legal liability, physical harm, reputational damage, or a consequential irreversible decision, require human review. If an error would cause minor inconvenience or be easily corrected, automated validation may be sufficient.`,
      quiz: [
        {
          question:
            "A healthcare company uses Claude to draft patient-facing information about medication dosages. The team has reviewed the prompt design and found Claude's responses to be generally accurate in testing. Should human review still be required before distribution?",
          options: [
            "Yes — medication dosage information is a high-stakes medical domain where an undetected error could cause patient harm; qualified human review is required regardless of observed accuracy in testing",
            "No — if internal testing shows high accuracy, human review adds unnecessary cost and slows distribution",
            "Only if the patient explicitly requests a human review of the content",
            "Only for new medications; established medications are well-represented in Claude's training data",
          ],
          correctIndex: 0,
          explanation:
            "Medical dosage information is a paradigmatic high-stakes domain. Even high observed accuracy in testing does not eliminate the risk of an undetected hallucination or error in production. The consequences of incorrect dosage information include serious patient harm. Human review by a qualified medical professional is required before distribution — this is not optional and is not made unnecessary by strong testing results. The standard is: could an error cause irreversible harm? If yes, require human review.",
        },
        {
          question:
            "A developer generates the same Claude prompt five times and receives noticeably different answers each time. What does this variability signal about evaluation?",
          options: [
            "Claude's non-determinism means a single output should not be treated as a definitive answer; variability signals uncertainty and warrants closer review or additional verification",
            "Variability means Claude has a bug that needs to be reported to Anthropic",
            "The prompt is poorly written and needs to be fixed before any evaluation is possible",
            "Variability is expected and means all responses are equally valid — any one can be used",
          ],
          correctIndex: 0,
          explanation:
            "Non-determinism is an inherent property of LLMs — Claude can produce meaningfully different responses to the same prompt across runs. High variability across runs signals that Claude does not have a confident, stable answer to the question, which is itself a signal that the output warrants closer scrutiny, additional verification, or human review. It does not indicate a bug, and it does not mean all outputs are equally valid.",
        },
      ],
    },
    {
      heading: "Editing, Adapting, and Selecting Output Formats",
      body: `A Claude output that is accurate and complete may still require editing to be useful — because the format, tone, length, or level of detail is wrong for the intended audience or downstream use. Evaluation is not finished when factual correctness is confirmed; fitness for purpose requires attention to form as well as content.

**Audience adaptation** means adjusting vocabulary, assumed background knowledge, level of detail, and tone to match who will consume the output. A technically accurate explanation written for a machine learning engineer may be incomprehensible to an executive audience, and vice versa. Claude can be instructed to write for a specific audience level, but operators should verify that the resulting output genuinely meets that audience's needs — not just that it contains the right facts in a different register.

**Output format selection** is a deliberate decision, not a default. Claude supports a range of output structures that should be matched to the downstream use:

- **Artifacts** (in Claude.ai): standalone documents — code files, HTML pages, SVGs, and rich text documents — that can be previewed and used independently. Appropriate when the output is a self-contained deliverable rather than a conversational reply.
- **Markdown formatting**: headers, bold, bullet lists, numbered lists, and code blocks. Appropriate for documentation, study guides, and any context where a markdown renderer will display the output. Not appropriate for plain-text contexts where the asterisks and symbols would appear literally.
- **Structured data (JSON, CSV, tables)**: appropriate when the output will be parsed programmatically, loaded into a database, or displayed in a structured UI. Requesting JSON output explicitly — and providing a schema — is more reliable than asking Claude to format data in prose.
- **Inline prose**: appropriate for conversational responses, explanations, and contexts where a human reader is the direct consumer and formatting overhead would be distracting.

**Refining outputs through iteration** is a normal and expected part of working with Claude. A first-pass output can be improved by providing Claude with specific feedback: "this is too long," "the third bullet is unclear," "rewrite the conclusion for a non-technical audience," or "add more detail on X." Iteration is faster than trying to write a single perfect prompt, and targeted feedback produces more reliable improvements than vague dissatisfaction.

When curating information from Claude across multiple responses — for example, assembling a report from several Claude conversations — evaluators must ensure consistency in terminology, level of detail, and framing across the assembled pieces. Outputs generated from different prompts may make subtly conflicting assumptions that only become apparent when placed side by side.`,
      quiz: [
        {
          question:
            "A product manager asks Claude to generate a summary of a technical architecture document for a board presentation. Claude's output is accurate but filled with API terminology and implementation details. What is the most appropriate next step?",
          options: [
            "Request a revision instructing Claude to rewrite the summary for a non-technical executive audience, removing implementation details and focusing on business impact",
            "Use the output as-is — accuracy is the only evaluation criterion that matters",
            "Ask an engineer to verify the technical terms before presenting to the board",
            "Discard the output and write the summary manually, since Claude cannot adjust its level of technical detail",
          ],
          correctIndex: 0,
          explanation:
            "Accuracy is necessary but not sufficient — fitness for the intended audience is equally important. Claude can adjust its level of technical detail when explicitly instructed. Requesting a revision targeting the board audience (non-technical, executive focus, business impact framing) is the appropriate and efficient next step. Using the technical output as-is risks confusion for the audience. Claude can absolutely adjust register and detail level when given clear instructions.",
        },
        {
          question:
            "An operator needs Claude to generate product data that will be directly loaded into a database. Which output format should they explicitly request?",
          options: [
            "JSON with a defined schema — structured data format that is machine-parseable and can be validated against the expected schema before ingestion",
            "Markdown bullet lists — they are easy for Claude to generate and can be parsed by a script",
            "Inline prose — the database ingestion layer can handle any text format",
            "Artifacts via Claude.ai — artifacts are the only format suitable for structured data",
          ],
          correctIndex: 0,
          explanation:
            "When output will be parsed programmatically and loaded into a database, JSON is the appropriate format to request explicitly. JSON is machine-parseable, supports schema validation, and maps cleanly to database structures. Markdown bullet lists require fragile parsing logic. Prose is not suitable for structured ingestion. Artifacts are a Claude.ai feature for standalone documents — they are not the mechanism for requesting structured data output via the API.",
        },
      ],
    },
  ],

  keyFacts: [
    "Output Evaluation and Validation is the highest-weighted CCAO-F domain at 21% of the exam",
    "Hallucination is an inherent LLM property — Claude can state false information confidently; it is not a bug",
    "High-risk hallucination categories: specific statistics, citations, quotes, URLs, and post-cutoff events",
    "Completeness evaluation requires checking each requirement in the original prompt explicitly — not inferring from length",
    "Self-critique prompting is a scoping tool, not a verification step — Claude may not flag its own hallucinations",
    "Human review is required for high-stakes domains: medical, legal, and financial decisions",
    "Claude's outputs are non-deterministic — the same prompt can produce meaningfully different results across runs",
    "Bias in outputs reflects training data patterns and can affect framing, emphasis, and omission — not just explicit claims",
    "Output format must match downstream use: JSON for programmatic parsing, markdown for rendered docs, prose for conversation",
    "Claude.ai Artifacts are for standalone deliverables (code, HTML, text documents) — distinct from inline conversational responses",
  ],

  relatedServices: [
    "Capabilities and Limitations",
    "Evaluations and Testing",
    "Prompt Engineering",
    "Safety and Responsible AI",
    "Anthropic Products",
  ],

  examTips: [
    "Accuracy and completeness are separate checks — a factually correct response can still be incomplete",
    "Fluent, well-structured prose is NOT evidence of factual accuracy — specific claims must be independently verified",
    "Self-critique prompting narrows where to focus verification; it does not replace verification against authoritative sources",
    "High-stakes domains (medical, legal, financial) require human review regardless of observed accuracy in testing",
    "Non-determinism means treat a single output as one sample, not the definitive answer — variability signals uncertainty",
    "Format selection is a deliberate decision: JSON for programmatic use, markdown for rendered docs, artifacts for standalone deliverables",
  ],
};
