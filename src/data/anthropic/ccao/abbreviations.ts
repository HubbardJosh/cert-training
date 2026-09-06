export const CCAO_ABBREVIATIONS: Record<string, string> = {
  // Prompting techniques
  CoT: "Chain of Thought — prompting technique that asks Claude to reason step by step before answering",
  RAG: "Retrieval-Augmented Generation — augments Claude's responses with retrieved external knowledge",
  RLHF: "Reinforcement Learning from Human Feedback — fine-tuning technique using human preference ratings",

  // API & developer concepts
  API: "Application Programming Interface — contract for how software components communicate",
  SDK: "Software Development Kit — libraries and tools for building with a specific service",
  JSON: "JavaScript Object Notation — lightweight, human-readable data interchange format",
  JSONL:
    "JSON Lines — newline-delimited JSON format used for batch API inputs and outputs",
  XML: "Extensible Markup Language — tag-based format used to structure complex Claude prompts",
  HTML: "HyperText Markup Language — standard language for structuring web page content",
  HTTP: "HyperText Transfer Protocol — foundation of data communication on the web",
  CSV: "Comma-Separated Values — tabular data format commonly used for batch inputs",
  PDF: "Portable Document Format — document format supported by Claude's file reading capability",
  SSE: "Server-Sent Events — streaming protocol used to deliver Claude token output in real time",
  CORS: "Cross-Origin Resource Sharing — browser security mechanism controlling API access from web pages",
  TTL: "Time to Live — duration before a cached resource (e.g., a prompt cache entry) expires",
  RPM: "Requests Per Minute — rate limit measuring how many API calls are allowed per minute",
  TPM: "Tokens Per Minute — rate limit measuring token throughput allowed per minute",
  TTFT: "Time to First Token — latency metric for how quickly Claude begins streaming a response",
  SLA: "Service Level Agreement — contractual commitment to uptime, latency, or support response times",
  IDE: "Integrated Development Environment — code editor used to build Claude-powered applications",
  UI: "User Interface — the visual layer of an application through which users interact",
  UX: "User Experience — the overall quality of a user's interaction with a product",

  // AI / Claude concepts
  LLM: "Large Language Model — a deep learning model trained on vast text to generate language",
  NLU: "Natural Language Understanding — AI capability to interpret meaning and intent in human text",
  NLG: "Natural Language Generation — AI capability to produce coherent human-readable text",
  BLEU: "Bilingual Evaluation Understudy — metric scoring machine translation or generation quality",
  ROUGE:
    "Recall-Oriented Understudy for Gisting Evaluation — metric for summarisation quality",
  OCR: "Optical Character Recognition — extracts printed or handwritten text from images",

  // Safety & governance
  PII: "Personally Identifiable Information — data that can identify a specific individual",
  PHI: "Protected Health Information — individually identifiable health data regulated under HIPAA",
  HIPAA:
    "Health Insurance Portability and Accountability Act — US healthcare data privacy law",
  GDPR: "General Data Protection Regulation — EU law governing personal data privacy",
  BAA: "Business Associate Agreement — HIPAA contract governing handling of protected health information",
  AUP: "Acceptable Use Policy — rules defining permitted and prohibited uses of a product or service",
  CSAM: "Child Sexual Abuse Material — illegal content that Claude is unconditionally trained to refuse",
  WMD: "Weapons of Mass Destruction — category of harmful content Claude is trained to never assist with",
  HITL: "Human in the Loop — design pattern requiring a human to review or approve AI outputs",

  // Identity & access
  SSO: "Single Sign-On — allows users to authenticate once and access multiple systems",
  SAML: "Security Assertion Markup Language — standard for federated identity and single sign-on",
  SCIM: "System for Cross-domain Identity Management — standard for automating user provisioning",

  // Agentic / workflow
  QA: "Quality Assurance — the process of verifying that outputs meet required standards",
  FAQ: "Frequently Asked Questions — curated list of common user queries and their answers",
  CRM: "Customer Relationship Management — software for managing customer interactions and data",
  GIF: "Graphics Interchange Format — animated image format supported in Claude's vision input",
  JPEG: "Joint Photographic Experts Group — compressed image format supported by Claude's vision",
  PNG: "Portable Network Graphics — lossless image format supported by Claude's vision input",

  // Cert identifiers
  CCAO: "Claude Certified Associate – Operator (CCAO-F) — Anthropic's foundational operator certification",
};
