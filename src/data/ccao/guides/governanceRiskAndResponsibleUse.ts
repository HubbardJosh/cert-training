import { ServiceGuide } from "../../../types/guide";

export const governanceRiskAndResponsibleUseGuide: ServiceGuide = {
  id: "ccao-governance-risk-responsible-use",
  service: "Governance, Risk, and Responsible Use",
  domain: "security",
  tagline:
    "Applying Anthropic's policies, trust hierarchy, and organizational controls to deploy Claude responsibly",
  intro:
    "Governance, Risk, and Responsible Use covers how organizations should decide when to use Claude, what data is appropriate to share, how to align deployments with Anthropic's published usage policies, and how to build internal oversight structures that keep AI use ethical, legal, and trustworthy.",

  sections: [
    {
      heading: "Appropriate and Inappropriate Use Cases",
      body: `Assessing whether a use case is appropriate for Claude starts with Anthropic's **Universal Usage Standards** — a set of prohibited categories that apply to every user and operator regardless of plan or context. No operator instruction or user request can authorize these uses.

Prohibited uses include: violating laws or engaging in illegal activity; compromising critical infrastructure or computer systems; developing weapons or explosives; inciting, facilitating, or promoting violent extremism, terrorism, or hateful behavior; violating privacy rights or impersonating humans without disclosure; creating content involving child exploitation; generating psychologically harmful content such as suicide promotion, harassment, animal cruelty, or graphic violence; creating or spreading misinformation; undermining democratic processes; facilitating criminal justice abuses or unauthorized surveillance; engaging in fraudulent or predatory practices; abusing the platform through automation, account circumvention, or jailbreaking; and generating sexually explicit content.

**Appropriate use cases** are those that provide genuine value without facilitating harm — drafting documents, summarizing information, writing and reviewing code, answering questions, brainstorming, generating customer-facing copy, and automating knowledge-work tasks. The key evaluation questions are: Does this use case produce outputs a reasonable person would consider beneficial? Does it remain within Anthropic's usage policy? And does the organization have appropriate safeguards for the sensitivity level of the task?`,
      quiz: [
        {
          question:
            "Which of the following is an example of a use case prohibited under Anthropic's Universal Usage Standards regardless of operator configuration?",
          options: [
            "Generating content that facilitates targeted harassment of an individual",
            "Summarizing legal case files for an internal legal team",
            "Restricting Claude's responses to a specific product domain via system prompt",
            "Enabling Claude to discuss medication dosages for a licensed healthcare platform",
          ],
          correctIndex: 0,
          explanation:
            "Generating harassment content is explicitly prohibited under Anthropic's Universal Usage Standards — it falls under psychologically harmful content and cannot be authorized by any operator. Summarizing legal files, restricting topics via system prompt, and discussing medication for licensed healthcare providers are all permissible use cases within policy.",
        },
        {
          question:
            "An organization wants to use Claude to create automated social media posts that present AI-generated opinion pieces as written by human journalists. Why is this prohibited?",
          options: [
            "It violates the prohibitions on impersonating humans without disclosure and creating misinformation",
            "Social media use cases are banned under Anthropic's policy",
            "Automated posting requires a special enterprise license",
            "Journalism is listed as a high-risk use case requiring human review, not a prohibited use case",
          ],
          correctIndex: 0,
          explanation:
            "Presenting AI-generated content as written by a human without disclosure violates two prohibitions: impersonating humans without disclosure and creating or spreading misinformation. Journalism is also a high-risk category requiring human review and disclosure that AI assisted — but the impersonation and misinformation violations apply here as the primary disqualifiers. Social media use is not categorically banned.",
        },
      ],
    },
    {
      heading: "Data Sensitivity, Regulatory, and Privacy Considerations",
      body: `Before using Claude with organizational data, classify the **sensitivity level** of that data. Public or non-sensitive information — marketing copy, open-source code, publicly available text — can generally be used with standard API plans. Internal business data, customer PII, financial records, protected health information (PHI), and attorney-client privileged material require careful evaluation before being sent to any third-party API.

Anthropic's **default data handling**: on standard API plans, Anthropic may use inputs and outputs for safety research and model improvement. Organizations that cannot allow this — due to regulatory requirements (HIPAA, GDPR, financial regulations) or contractual obligations — must use a plan that provides a **no-training commitment**. Claude.ai Enterprise and enterprise API agreements provide commitments that organization data is not used for training by default.

**Privacy rights** are a protected category under the Universal Usage Standards. Claude must not be used to aggregate public data about individuals in ways that violate their reasonable privacy expectations, build surveillance systems, or generate content that reveals private information about identifiable people without consent. For regulated industries, additional requirements apply: HIPAA requires a Business Associate Agreement (BAA) before processing PHI; GDPR requires data processing agreements and data residency considerations; financial regulations may restrict what can be shared with external AI providers. Governance programs must map data flows from source to Claude to output storage and ensure each step meets applicable requirements.`,
      quiz: [
        {
          question:
            "A healthcare company wants to use the standard Claude API to analyze patient records for clinical documentation. What is the PRIMARY governance concern?",
          options: [
            "Standard API plans may use inputs for safety research; PHI requires a plan with a no-training commitment and a Business Associate Agreement",
            "Claude cannot process medical text regardless of plan type",
            "Healthcare is a prohibited use case under Anthropic's Universal Usage Standards",
            "The company must obtain patient consent before using any AI model to read records",
          ],
          correctIndex: 0,
          explanation:
            "The primary concern is that Anthropic's standard API may use inputs/outputs for safety research, which is incompatible with HIPAA requirements for PHI. Organizations processing PHI need a plan with a no-training commitment and a Business Associate Agreement. Healthcare analysis is a permissible (though high-risk) use case — it is not prohibited. Patient consent and clinical validation are also important but the API data handling issue is the primary governance blocker here.",
        },
      ],
    },
    {
      heading: "High-Risk Use Cases and Human Review Requirements",
      body: `Anthropic's usage policy identifies specific **high-risk use cases** where the consequences of AI error or misuse are severe enough that human oversight is mandatory. These categories are: legal services, healthcare, insurance, financial advice, employment decisions, housing decisions, academic testing and credentialing, and journalistic applications.

For each of these categories, providers must implement two requirements: **human review** of AI-generated outputs before they affect real decisions, and **disclosure** that AI assisted in creating the outputs. Human review means a qualified person — not another AI — evaluates the output for accuracy and appropriateness before it is acted upon. Disclosure means the recipient knows that AI was involved in producing the information or recommendation they received.

The rationale is that errors in these domains cause concrete harm: a legally incorrect contract clause, an inaccurate insurance denial, a flawed clinical recommendation, or a biased employment screening can damage people's lives and expose organizations to legal liability. Operators building products in these categories must design workflows with explicit human-in-the-loop checkpoints, not just disclaimer text. Relying on a disclaimer that says "this is AI-generated, not professional advice" is insufficient if the product's actual workflow routes decisions directly from Claude's output to action without human evaluation.`,
      quiz: [
        {
          question:
            "A company builds a tool that uses Claude to screen job applications and automatically advance or reject candidates based solely on Claude's assessment. Which Anthropic policy requirement does this violate?",
          options: [
            "Employment decisions are a high-risk use case requiring human review before decisions are made — automated routing without human evaluation violates this requirement",
            "Using AI for employment screening is categorically prohibited under Anthropic's usage policy",
            "The tool would be compliant as long as a disclaimer is shown to applicants",
            "Operators can automate employment decisions if the system prompt instructs Claude to be unbiased",
          ],
          correctIndex: 0,
          explanation:
            "Employment is an explicitly listed high-risk category. Anthropic's policy requires human review of AI outputs before they affect real decisions in this domain. Automatically advancing or rejecting candidates without human evaluation violates this requirement. Employment screening is not categorically prohibited — it is permitted with appropriate human oversight. A disclaimer does not substitute for actual human review. Prompt-level bias instructions do not eliminate the human review requirement.",
        },
      ],
    },
    {
      heading: "Organizational AI Policies and Governance Standards",
      body: `Building an organizational governance program for Claude starts with **documenting use cases** — maintaining a registry of all internal and external deployments, who owns each, what data they access, and what controls are in place. Without a use-case registry, organizations cannot assess their aggregate risk exposure or ensure policy compliance across teams.

A written **AI use policy** should specify: which use cases are approved, which require additional review before proceeding, which are prohibited, how employees should classify data before using Claude, what must not be sent to any external AI provider, and how to report suspected policy violations. The policy should be version-controlled, reviewed at a defined cadence, and communicated to all employees who may use AI tools.

**Employee training** is a governance control, not a one-time event. Employees need to understand what Claude can and cannot do, where it can make errors, how to recognize inappropriate outputs, and what to do if they encounter a potential violation. Training should be role-specific — a developer integrating the API needs different guidance than a marketing employee using Claude.ai. Training records should be maintained.

**Output monitoring** in production deployments should log inputs and outputs (with appropriate privacy controls on the logs themselves), flag anomalous or high-risk outputs for human review, and feed into a periodic review of whether the deployment remains within approved parameters. Governance is ongoing — a deployment that was compliant at launch can drift out of compliance as use patterns evolve or policy changes.`,
      quiz: [
        {
          question:
            "Which element is MOST critical for an organization to have before deploying Claude across multiple teams?",
          options: [
            "A documented AI use policy specifying approved uses, prohibited uses, data classification requirements, and reporting procedures",
            "A dedicated AI ethics board with veto power over all AI outputs",
            "Approval from Anthropic for each specific use case before deployment",
            "A custom-trained version of Claude fine-tuned on internal company data",
          ],
          correctIndex: 0,
          explanation:
            "A documented AI use policy is the foundational governance control — without it, teams have no consistent guidance on what is permitted, what data can be shared, or how to handle issues. Ethics boards, Anthropic approval, and fine-tuning are not standard requirements. Anthropic does not pre-approve individual use cases; operators agree to the usage policy and take responsibility for compliance. The use policy document is what operationalizes that responsibility internally.",
        },
        {
          question:
            "An organization's AI governance program should treat employee training as:",
          options: [
            "An ongoing control with role-specific content and maintained training records",
            "A one-time onboarding activity covering general AI awareness",
            "Optional for technical employees who understand how AI models work",
            "Exclusively the responsibility of the AI vendor (Anthropic) to provide",
          ],
          correctIndex: 0,
          explanation:
            "Effective governance requires ongoing, role-specific training. A developer integrating the API has different risk exposures than a business analyst using Claude.ai, and both need targeted guidance. One-time onboarding cannot keep pace with evolving policy or new use cases. Technical understanding of model mechanics does not substitute for policy and ethical use training. AI vendors provide general guidelines; organizational training on internal policies is the employer's responsibility.",
        },
      ],
    },
    {
      heading: "Ethical Implications of AI Use",
      body: `Understanding the ethical dimensions of Claude's use requires thinking beyond policy compliance to the broader effects on individuals and society. **Fairness and bias** are core concerns: Claude's outputs reflect patterns in training data, which can encode historical biases. In high-stakes domains — hiring, lending, healthcare — biased AI outputs can systematically disadvantage protected groups. Organizations must evaluate outputs for disparate impact, not just aggregate accuracy.

**Transparency and explainability** are ethical obligations as well as practical governance requirements. When Claude assists in a consequential decision, affected parties have an interest in knowing AI was involved and — in regulated contexts — how the decision was reached. Presenting AI-generated analysis as if it were pure human judgment undermines informed consent and trust.

**Human autonomy** must be preserved. Claude should augment human decision-making, not replace it in contexts where the stakes are high enough that humans should retain ultimate authority. Over-reliance on AI — deferring to Claude's output without critical evaluation — erodes the human judgment and accountability that governance frameworks depend on. Ethical AI use means treating Claude as a capable tool that still requires human direction and oversight, not as an autonomous authority.

**Accountability** requires that someone in the organization is responsible for each AI deployment's outcomes. Diffuse responsibility — "the AI decided" — is not an acceptable response to harmful outputs. Governance programs must assign clear ownership: who approved the use case, who monitors outputs, who has authority to pause or shut down a deployment, and who is the escalation point for incidents. The trust hierarchy — Anthropic's policies setting the outer bounds, operators taking responsibility for their deployments, users operating within what operators permit — means operators cannot disclaim accountability for how their products use Claude.`,
      quiz: [
        {
          question:
            "A financial services company uses Claude to assist with loan application reviews and notices that approval recommendations differ significantly by applicant demographic group. What is the CORRECT governance response?",
          options: [
            "Pause or add human review to the AI-assisted process, conduct a bias audit, and correct the source of disparate impact before resuming automated assistance",
            "Adjust the system prompt to instruct Claude to ignore demographic information in its analysis",
            "Add a disclaimer to loan decisions noting that AI was used in the process",
            "Accept the disparity as reflecting underlying data patterns and document it in the AI use registry",
          ],
          correctIndex: 0,
          explanation:
            "Disparate impact in lending is both an ethical violation and a legal risk (fair lending laws). The correct response is to pause automated AI assistance, audit for bias sources, and remediate before continuing. Instructing Claude to ignore demographic data is insufficient — bias can operate through proxies. A disclaimer does not remediate discriminatory outcomes. Documenting a known disparate impact without remediation is not an acceptable governance response.",
        },
      ],
    },
  ],

  keyFacts: [
    "Anthropic's Universal Usage Standards apply to all users and operators — no operator can authorize prohibited uses",
    "Prohibited uses include: illegal activity, weapons development, extremism, CSAM, misinformation, harassment, and unauthorized surveillance",
    "High-risk categories require human review AND disclosure: legal, healthcare, insurance, financial, employment, housing, academic testing, and journalism",
    "Standard API plans may use inputs/outputs for safety research — regulated data (PHI, PII) requires a no-training enterprise plan",
    "Claude.ai Enterprise and enterprise API agreements include no-training commitments for organization data",
    "Trust hierarchy: Anthropic sets outer policy bounds; operators are accountable for their deployments; users operate within operator permissions",
    "Organizational governance requires: use-case registry, written AI policy, role-specific employee training, and output monitoring",
    "Accountability cannot be delegated to the AI — organizations must assign human owners for each deployment's outcomes",
    "Fairness audits for disparate impact are necessary in high-stakes domains like lending, hiring, and healthcare",
    "Human autonomy must be preserved — Claude augments human judgment but should not replace it where accountability matters",
  ],

  relatedServices: [
    "Safety and Responsible AI",
    "Anthropic Products",
    "Production Deployment",
    "Claude Models",
  ],

  examTips: [
    "Memorize the high-risk categories (legal, healthcare, insurance, financial, employment, housing, academic testing, journalism) — they require both human review AND disclosure",
    "Universal Usage Standards are non-negotiable — no operator system prompt can authorize prohibited uses",
    "Data sensitivity classification comes BEFORE sending data to Claude — determine the plan type needed first",
    "Standard API plans may use data for safety research; regulated data requires an enterprise no-training plan",
    "Accountability stays with the operator — 'the AI decided' is never an acceptable response to a harmful output",
    "Governance is ongoing: use-case registry + written policy + role-specific training + output monitoring — all four are required, not optional",
  ],
};
