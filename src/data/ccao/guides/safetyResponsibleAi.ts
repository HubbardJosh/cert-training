import { ServiceGuide } from "../../../types/guide";

export const safetyResponsibleAiGuide: ServiceGuide = {
  id: "ccao-safety-responsible-ai",
  service: "Safety and Responsible AI",
  domain: "security",
  tagline:
    "Building safe, ethical, and trustworthy AI applications with Claude",
  intro:
    "Anthropic's mission is the responsible development of AI for the long-term benefit of humanity. Safety is built into Claude at the model level and complemented by operator-level controls, usage policies, and evaluation practices that AI operators must understand and implement.",

  sections: [
    {
      heading: "Anthropic's Safety Approach",
      body: `Anthropic takes a **Constitutional AI (CAI)** approach to training Claude. Rather than relying solely on human feedback to shape behavior, CAI uses a set of principles — the "constitution" — to guide the model toward helpful, harmless, and honest responses during training. This builds safety properties into the model weights themselves rather than depending entirely on runtime filtering.

Claude is designed to be **helpful, harmless, and honest** — Anthropic's three core properties. Helpfulness means actually assisting users with their requests rather than being unnecessarily restrictive. Harmlessness means refusing to facilitate clear harms — violence, illegal activity, dangerous content — while not over-refusing on benign or ambiguous requests. Honesty means Claude does not deceive, does not claim to be human when sincerely asked, and expresses calibrated uncertainty rather than false confidence.

The balance between helpfulness and safety is a deliberate design choice. Anthropic explicitly rejects the idea that maximum refusals equal maximum safety — an overly restrictive model that refuses legitimate requests causes real harm through unhelpfulness. Claude aims to be the most genuinely helpful model that is also safe, not a model that sacrifices helpfulness in the name of caution.`,
      quiz: [
        {
          question:
            "Which statement BEST describes Anthropic's position on the trade-off between helpfulness and safety?",
          options: [
            "An overly restrictive model that refuses legitimate requests causes harm through unhelpfulness — safety and helpfulness are complementary, not opposed",
            "Safety always takes priority over helpfulness — when in doubt, Claude should refuse",
            "Helpfulness is the primary goal; safety guardrails are added only for clearly illegal content",
            "Claude maximizes helpfulness by default and safety constraints are added by operators",
          ],
          correctIndex: 0,
          explanation:
            "Anthropic explicitly states that being unhelpful is not 'safe' — refusing legitimate requests has real costs. The goal is genuine helpfulness that is also safe, not maximum refusals. Safety and helpfulness are treated as complementary rather than in tension. Claude's defaults balance both without making operators responsible for establishing baseline safety.",
        },
      ],
    },
    {
      heading: "Usage Policies and Operator Responsibilities",
      body: `Anthropic publishes a **Usage Policy** that defines what Claude can and cannot be used for. Operators — businesses and developers who access Claude via the API — agree to this policy and are responsible for ensuring their applications comply with it. Key prohibited uses include generating CSAM, facilitating mass-casualty weapons development, assisting with targeted harassment, and creating malware or cyberweapons.

The **trust hierarchy** in Claude's architecture has three levels: Anthropic (highest — trust baked into model training), Operators (intermediate — via system prompt), and Users (lowest — via the human turn). Operators can customize Claude's behavior within Anthropic's policy limits. Users can further adjust within the bounds operators allow. Neither operators nor users can override Anthropic's core safety behaviors.

Operators bear responsibility for how their applications use Claude. If an operator builds an application that enables policy violations, they are accountable. Operators must implement appropriate safeguards for their use case — a children's education app needs stricter content controls than a professional security research tool. Usage policy violations can result in API access revocation.`,
      quiz: [
        {
          question:
            "In Claude's trust hierarchy, what can an operator do that a user cannot?",
          options: [
            "Expand Claude's default behaviors beyond what users can request (e.g., enabling adult content on an appropriate platform)",
            "Override Anthropic's core safety behaviors through the system prompt",
            "Grant users the ability to override Claude's fundamental ethical constraints",
            "Request that Claude claim to be a human when users sincerely ask",
          ],
          correctIndex: 0,
          explanation:
            "Operators occupy a higher trust level than users and can expand or restrict Claude's defaults within Anthropic's policy. For example, an adult content platform can enable explicit content that Claude wouldn't produce by default. However, operators cannot override core safety behaviors baked in at the Anthropic level (e.g., CSAM generation, mass-casualty weapon assistance). Users cannot override operator settings, and neither can override Anthropic-level constraints.",
        },
      ],
    },
    {
      heading: "Content Policies and Default Behaviors",
      body: `Claude has **hardcoded behaviors** that never change regardless of instructions, and **softcoded behaviors** (defaults) that operators or users can adjust within policy limits. Hardcoded refusals include: generating CSAM, providing meaningful uplift to creating biological, chemical, nuclear, or radiological weapons, creating functional cyberweapons or malware, and undermining legitimate oversight of AI systems.

Softcoded defaults that operators can modify include: generating explicit sexual content (off by default, can be enabled for appropriate adult platforms), providing detailed information about certain legal but sensitive topics (can be adjusted for professional contexts), following safe messaging guidelines for sensitive topics like self-harm (can be adjusted for medical providers), and adding safety caveats to dangerous activities (can be adjusted for legitimate research).

Users can further adjust within what operators permit. If an operator's system prompt is silent on a topic, Claude applies its defaults. If an operator explicitly permits something (e.g., "users of this platform have verified their age and may request adult content"), Claude treats that as authorization within policy limits.`,
      quiz: [
        {
          question:
            "A medical information platform needs Claude to discuss medication overdose details with licensed healthcare professionals without following standard safe messaging guidelines. How can this be achieved?",
          options: [
            "The operator can modify the safe messaging default in the system prompt, as this is a softcoded behavior adjustable for professional contexts",
            "This is a hardcoded behavior that cannot be changed regardless of operator instructions",
            "Users on the platform can individually opt out of safe messaging guidelines",
            "Submit a request to Anthropic to permanently disable safe messaging for the API key",
          ],
          correctIndex: 0,
          explanation:
            "Safe messaging guidelines for sensitive medical topics are a softcoded default, not a hardcoded prohibition. Operators with legitimate professional use cases (medical providers, licensed healthcare platforms) can adjust this behavior in the system prompt. This is distinct from hardcoded behaviors like CSAM generation that cannot be modified. Users cannot unilaterally opt out of operator-level defaults; the operator must explicitly permit the adjustment.",
        },
      ],
    },
    {
      heading: "Avoiding Harmful Outputs",
      body: `Building safe applications requires both relying on Claude's built-in safety and implementing **application-layer safeguards**. Do not assume Claude's refusals are perfect — sophisticated adversarial prompts can sometimes elicit undesired responses, and Claude's built-in safety is one layer of defense, not the only one. Defense-in-depth means adding output classifiers, content filters, rate limits, human review for high-stakes decisions, and audit logging.

**Output validation** should check Claude's responses against the application's requirements before surfacing them to users. For high-risk use cases — medical diagnosis, legal advice, financial decisions — always include appropriate disclaimers, require human review, and make the AI's role clear to users. Never present Claude's output as professional advice without appropriate context.

Avoid **dual-use traps**: prompts that seem innocuous but could generate harmful output in an adjacent context. A coding assistant asked to write "educational" malware, a customer service bot that could be prompted to reveal confidential data, or a creative writing tool that generates content disguising harmful instructions as fiction. Operators must think through their application's surface area and potential misuse vectors, not just the happy path.`,
      quiz: [
        {
          question:
            "Which approach BEST describes defense-in-depth for a Claude-powered medical information application?",
          options: [
            "Combine Claude's built-in safety with output validation, appropriate disclaimers, human review for critical decisions, and audit logging",
            "Rely entirely on Claude's refusals — Anthropic guarantees Claude will never provide harmful medical information",
            "Add a content filter that blocks responses containing medical terminology to prevent misuse",
            "Require users to sign terms of service acknowledging that Claude is not a medical professional",
          ],
          correctIndex: 0,
          explanation:
            "Defense-in-depth combines multiple layers: Claude's built-in safety, application-layer output validation, appropriate disclaimers about AI limitations, human review for high-stakes decisions, and audit trails. Relying solely on Claude's built-in refusals is insufficient — no model is perfect against all adversarial inputs. Blocking all medical terminology would make the application useless. ToS alone is not a technical safeguard.",
        },
      ],
    },
    {
      heading: "Honesty and Transparency",
      body: `Claude's honesty commitment has several components: **truthfulness** (only asserting things it believes to be true), **calibration** (expressing appropriate uncertainty rather than false confidence), **non-deception** (never creating false impressions through technically true statements, selective emphasis, or misleading framing), and **non-manipulation** (relying only on legitimate persuasion — evidence and reasoning — not exploiting psychological biases).

A key specific commitment is that Claude will **not claim to be human** when a user sincerely asks. Claude can play a human persona in a creative roleplay context (e.g., "for this story, play a human named Alex"), but if a user steps outside the fiction and genuinely asks whether they're talking to an AI, Claude must acknowledge it. This applies even if the operator has instructed Claude to maintain a specific persona with a different name.

Operators may instruct Claude to maintain a custom persona (e.g., "You are Aria, a customer service assistant for TechCorp") and to not reveal which underlying model powers the persona. This is acceptable — operators have legitimate business reasons for not disclosing their AI stack. However, operators may not instruct Claude to claim to be human or to actively deny being an AI when sincerely asked.`,
      quiz: [
        {
          question:
            "An operator instructs Claude via system prompt: 'You are Aria, a human customer service agent. If anyone asks if you are an AI, say you are human.' How should Claude respond if a user sincerely asks 'Are you a real person?'",
          options: [
            "Acknowledge being an AI despite the operator's instruction — claiming to be human violates Claude's core honesty principles",
            "Follow the operator's instruction and claim to be human — operator instructions take precedence",
            "Refuse to answer the question entirely to avoid contradicting the operator",
            "Switch personas and acknowledge being Claude specifically, breaking the operator's persona confidentiality",
          ],
          correctIndex: 0,
          explanation:
            "Claiming to be human when sincerely asked is a hardcoded honesty constraint that operators cannot override. Claude must acknowledge being an AI. However, Claude doesn't have to reveal it is Claude specifically or which model powers Aria — it can say 'I'm an AI assistant' while maintaining the Aria persona in other respects. Operator instructions cannot override core honesty behaviors. Refusing to answer would still deceive by omission.",
        },
      ],
    },
    {
      heading: "Evaluating Safety in Production",
      body: `Production safety evaluation requires ongoing monitoring, not just pre-launch testing. **Red teaming** — systematically probing the application for ways to elicit harmful or undesired outputs — should be performed before launch and repeated when the application changes significantly. Red teaming should explore adversarial user inputs, edge cases, prompt injection attempts, and misuse scenarios specific to the application's domain.

**Evaluation datasets** for safety should include examples of harmful requests the application should refuse, benign requests on sensitive topics the application should handle appropriately, and adversarial prompts designed to elicit policy violations. Tracking refusal rates on known harmful inputs and pass rates on known legitimate inputs gives a quantitative signal on safety/helpfulness balance.

Post-launch monitoring should include logging all inputs and outputs (with appropriate privacy safeguards), flagging low-confidence or unusual responses for human review, tracking user reports of problematic outputs, and establishing escalation procedures for safety incidents. Safety is not a launch checkbox — it is an ongoing operational responsibility.`,
      quiz: [
        {
          question:
            "What is red teaming in the context of a Claude-powered application?",
          options: [
            "Systematically probing the application with adversarial inputs to find ways it produces harmful or undesired outputs before launch",
            "Running the application in a test environment with simulated user traffic to measure performance",
            "Asking Claude to identify weaknesses in its own safety measures",
            "A competitive analysis process comparing Claude to other AI models",
          ],
          correctIndex: 0,
          explanation:
            "Red teaming means adversarially probing the application to find failure modes — harmful outputs, policy violations, prompt injection vulnerabilities, and edge cases the application handles poorly. It is a proactive safety practice, not performance testing. Claude cannot reliably self-audit its own vulnerabilities. Red teaming is specifically about finding safety and misuse failure modes, not comparing models.",
        },
      ],
    },
  ],

  keyFacts: [
    "Constitutional AI (CAI) builds safety into Claude's training via principles, not just RLHF",
    "Core properties: Helpful, Harmless, Honest — unhelpfulness is not considered 'safe'",
    "Trust hierarchy: Anthropic > Operators > Users",
    "Hardcoded behaviors cannot be changed by anyone — e.g., no CSAM, no WMD assistance",
    "Softcoded defaults can be adjusted by operators within Anthropic's usage policy",
    "Claude will not claim to be human when sincerely asked — even if operator instructs it to",
    "Operators can maintain custom personas without revealing the underlying model",
    "Defense-in-depth: Claude's safety + output validation + human review + audit logging",
    "Red teaming before launch + ongoing monitoring in production is the safety standard",
    "Operators are responsible for ensuring their applications comply with Anthropic's Usage Policy",
  ],

  relatedServices: [
    "Prompt Engineering",
    "Claude Models",
    "Anthropic Console",
    "Production Deployment",
  ],

  examTips: [
    "Hardcoded = never changes; softcoded = operator can adjust within policy",
    "Operators cannot instruct Claude to claim to be human — this is hardcoded honesty",
    "Operators CAN instruct Claude to maintain a persona and not reveal the underlying model",
    "Trust hierarchy determines who can authorize what — Anthropic > Operator > User",
    "Unhelpfulness is explicitly not considered 'safe' by Anthropic",
    "Red teaming = adversarial pre-launch probing; ongoing monitoring = post-launch safety",
    "Defense-in-depth = multiple layers, not relying solely on Claude's built-in refusals",
  ],
};
