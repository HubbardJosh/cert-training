import { ServiceGuide } from "../../../../types/guide";

// Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html
// Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html
// Source: https://aws.amazon.com/bedrock/agentcore/pricing/
export const codeInterpreterBrowserGuide: ServiceGuide = {
  id: "agentcore-tools",
  service: "AgentCore Code Interpreter & Browser",
  domain: "development",
  tagline: "Sandboxed code execution and remote web browsing for AI agents",
  intro:
    "AgentCore Code Interpreter and Browser are built-in tool services that extend what agents can do beyond language reasoning. Code Interpreter lets agents write and run Python, JavaScript, and TypeScript in secure sandboxes. Browser gives agents a containerized web browser to navigate sites, fill forms, and extract information — with full observability and session recording.",

  sections: [
    {
      heading: "Code Interpreter: Overview and Capabilities",
      body: `**AgentCore Code Interpreter** enables AI agents to write and execute code in isolated sandbox environments. This extends agents beyond pure language reasoning into computational execution.

**Supported languages**:
- Python
- JavaScript
- TypeScript

**Pre-installed libraries**: Common data science and utility libraries are pre-installed in the default environment (no setup required for standard use cases). Custom environments with additional libraries can be configured.

**File support**:
- Inline file upload: up to **100 MB**
- Via S3 (terminal commands): up to **5 GB**

**Execution time**:
- Default: **15 minutes**
- Maximum (configurable): **8 hours**

**Data format support**: CSV, Excel, JSON, and other structured data formats. Agents can perform data cleaning, analysis, and transformation.

**Why this matters for agents**: Many reasoning tasks that seem simple are hard to do accurately in natural language. Asking an LLM to compute compound interest or sort 10,000 rows is unreliable. Code Interpreter lets the agent write the code and execute it deterministically — then return the verified result.`,
      quiz: [
        {
          question:
            "An agent needs to analyze a 2 GB CSV dataset stored in Amazon S3. What is the correct approach using AgentCore Code Interpreter?",
          options: [
            "Cannot be done — Code Interpreter only supports files up to 100 MB",
            "Use terminal commands to reference the S3 file; Code Interpreter supports up to 5 GB via S3",
            "Chunk the file into 100 MB parts and process them sequentially with inline upload",
            "Use AgentCore Gateway to stream the S3 file directly into the Code Interpreter session",
          ],
          correctIndex: 1,
          explanation:
            "Code Interpreter supports files up to 5 GB when accessed via S3 through terminal commands. The 100 MB limit applies to inline uploads (files sent directly in the API request). The agent would reference the S3 path in terminal commands to process the 2 GB dataset. Chunking is unnecessary when the S3 path is available.",
        },
        {
          question:
            "What is the maximum configurable execution time for a Code Interpreter session?",
          options: ["15 minutes", "1 hour", "4 hours", "8 hours"],
          correctIndex: 3,
          explanation:
            "Code Interpreter sessions default to 15 minutes but can be extended up to a maximum of 8 hours for complex, long-running data processing or computational tasks. This matches the maximum session duration for AgentCore Runtime microVMs.",
        },
      ],
    },
    {
      heading: "Code Interpreter: Security Model",
      body: `Code Interpreter's security design is critical — agents may execute user-provided or AI-generated code, which is inherently untrusted.

**Sandbox isolation**: Code runs in a containerized environment within AgentCore. The execution is isolated from the host system and from other sessions.

**Network access**: Configurable. The developer can choose whether code has internet access (for fetching external data) or runs air-gapped (for sensitive workloads).

**CloudTrail logging**: All code execution is logged via CloudTrail for audit purposes.

**Execution role**: Developers can specify a custom IAM execution role for the Code Interpreter session, controlling which AWS services the code can access.

**Root CA certificates**: Custom root certificate authority support is available for environments that use private PKI.

**Best practices from AWS docs**:
- Keep code snippets concise and focused
- Use \`try/except\` blocks to handle errors gracefully
- Use the \`code_session\` context manager to ensure cleanup
- Close sessions when done to release resources
- Clean up temporary files to avoid storage accumulation`,
      quiz: [
        {
          question:
            "An agent is processing sensitive financial data and must not allow the Code Interpreter to make any external network calls. How is this configured?",
          options: [
            "Remove the agent's IAM permissions for outbound VPC routing",
            "Configure the Code Interpreter session with a restricted network mode (no internet access)",
            "Use AgentCore Identity to block outbound OAuth flows from the session",
            "Set the Code Interpreter execution time to zero to prevent any external calls",
          ],
          correctIndex: 1,
          explanation:
            "Code Interpreter supports configurable network modes. Developers can restrict internet access for sessions handling sensitive data, running the sandbox in an air-gapped mode. This is done via session properties — not IAM permissions, Identity configuration, or execution time limits. CloudTrail logging records all execution regardless of network mode.",
        },
      ],
    },
    {
      heading: "Browser: Overview and Capabilities",
      body: `**AgentCore Browser** provides a secure, containerized remote browser that agents use to interact with web applications — as a human would, but automated.

**Core capabilities**:
- Navigate to URLs
- Click elements, buttons, and links
- Fill out forms and submit data
- Take screenshots (for visual understanding)
- Parse dynamic content (JavaScript-rendered pages, SPAs)
- Handle authentication flows (login pages, MFA prompts with human-in-loop)

**Session configuration**:
- Default session timeout: **15 minutes**
- Maximum session duration: **8 hours**
- Multiple sessions can run simultaneously

**Library support**: Compatible with Playwright, Nova Act, Strands for programmatic browser control.

**Two browser types**:
1. **AWS-managed browser** (\`aws.browser.v1\`): Quick setup, default configuration
2. **Custom browser**: Advanced features — session recording, custom network settings, specific IAM execution roles, custom root CA certificates

**Human-in-loop via Live View**: A human can watch the browser session in real time and interact directly through a live stream — enabling supervised automation for sensitive workflows.`,
      quiz: [
        {
          question:
            "An agent is automating a workflow on a web application, but one step requires human approval via the web UI. Which AgentCore Browser feature allows a human to intervene without stopping and restarting the session?",
          options: [
            "Session recording — the human reviews the recording and provides async approval",
            "Live View — the human can watch and interact with the browser session in real time",
            "AgentCore Memory — the agent stores the pending approval state and waits",
            "AgentCore Gateway — routes the approval request to a human-in-the-loop service",
          ],
          correctIndex: 1,
          explanation:
            "Live View provides real-time observation and interaction with a running browser session — a human can watch what the agent is doing and directly interact with the browser when their input is needed. This is the human-in-the-loop capability for Browser. Session recording captures what happened (for replay/audit) but is not interactive. Memory and Gateway are not involved in browser session control.",
        },
        {
          question:
            "What is the difference between the AWS-managed browser (aws.browser.v1) and a custom browser in AgentCore Browser?",
          options: [
            "The AWS-managed browser supports Playwright; custom browsers require Selenium",
            "The AWS-managed browser is free; custom browsers incur additional charges per session",
            "The AWS-managed browser provides quick setup with defaults; custom browsers add session recording, custom network settings, and custom IAM execution roles",
            "The AWS-managed browser is multi-tenant; custom browsers provide dedicated hardware",
          ],
          correctIndex: 2,
          explanation:
            "The AWS-managed browser (aws.browser.v1) provides a ready-to-use browser with sensible defaults for quick setup. Custom browsers add advanced capabilities: session recording (stored to S3), custom network configuration (VPC, proxies), specific IAM execution roles, and custom root CA certificates. Both support Playwright and other libraries. Pricing is the same model; the distinction is feature set, not cost tier or tenancy model.",
        },
      ],
    },
    {
      heading: "Browser: Observability and Compliance",
      body: `Browser sessions provide the richest observability in AgentCore — important for auditing and debugging automated web interactions:

**Live View**: Real-time stream of the browser session. A human can observe and interact.

**Session recording** (custom browsers only): Captures:
- DOM changes over time
- User actions performed by the agent
- Browser console logs
- Network events (requests and responses)

Recordings are stored in **your Amazon S3 bucket** and can be replayed through the AWS Console with:
- Video playback
- Timeline navigation
- User action tracking
- Comprehensive logs for troubleshooting

**CloudTrail logging**: All browser API calls are logged for compliance.

**CloudWatch metrics**: Real-time performance insights (session counts, errors, latency).

**Browser profiles**: Sessions can optionally use persistent browser profiles (cookies, local storage) stored in S3. Storage charges apply at S3 Standard rates starting April 2026.

**Pricing**:
- CPU: $0.0895 per vCPU-hour
- Memory: $0.00945 per GB-hour
- Browser profile storage: S3 Standard rates (from April 2026)`,
      quiz: [
        {
          question:
            "A compliance team needs to review every web action an agent took during a specific vendor portal session from last week. Which observability feature provides this capability?",
          options: [
            "Live View — replay the live stream from memory",
            "CloudWatch metrics — the metrics log all URLs visited",
            "Session recording — stores DOM changes, actions, console logs, and network events in S3 for replay",
            "CloudTrail logging — shows the exact browser API calls that were made",
          ],
          correctIndex: 2,
          explanation:
            "Session recording (available on custom browsers) captures DOM changes, user actions, console logs, and network events, then stores them in S3. The recordings can be replayed through the AWS Console with video playback and timeline navigation — exactly what a compliance review needs. Live View is real-time only (not replayable from a week ago). CloudWatch metrics give aggregates, not session-level action detail. CloudTrail records API calls, not the browsing actions within a session.",
        },
      ],
    },
    {
      heading: "Pricing Comparison: Code Interpreter vs Browser",
      body: `Both tools use CPU and memory consumption-based pricing, but at different rates:

| Tool | CPU rate | Memory rate |
|---|---|---|
| Code Interpreter | $0.0895 per vCPU-hour | $0.00945 per GB-hour |
| Browser | $0.0895 per vCPU-hour | $0.00945 per GB-hour |

Both tools have **identical pricing** — the same CPU and memory rates.

For comparison, Runtime microVMs (V2) cost more per vCPU-hour ($0.1276) and GB-hour ($0.0169) — the built-in tools (Code Interpreter, Browser) are priced lower than the full Runtime environment.

**Additional Browser costs**:
- Browser profile storage: S3 Standard rates (from April 2026)
- No additional charge for session recording storage beyond S3 costs

**Web Search** (a separate built-in tool): $7.00 per 1,000 queries.

Source: https://aws.amazon.com/bedrock/agentcore/pricing/`,
      quiz: [
        {
          question:
            "Compared to AgentCore Runtime microVMs, how are Code Interpreter and Browser priced?",
          options: [
            "Higher — specialized tools cost more per vCPU-hour than general Runtime",
            "The same — all AgentCore components share a single compute rate",
            "Lower — Code Interpreter and Browser ($0.0895/vCPU-hr) are cheaper than Runtime microVMs ($0.1276/vCPU-hr)",
            "Free when used within a Runtime session — no separate charge",
          ],
          correctIndex: 2,
          explanation:
            "Code Interpreter and Browser are priced at $0.0895 per vCPU-hour, which is lower than Runtime microVMs V2 at $0.1276 per vCPU-hour. They are separate services with separate billing — they are not free when used within a Runtime session. Memory rates also differ: tools at $0.00945/GB-hr vs Runtime microVMs at $0.0169/GB-hr.",
        },
      ],
    },
  ],

  keyFacts: [
    "Code Interpreter languages: Python, JavaScript, TypeScript",
    "Code Interpreter file limits: 100 MB inline, 5 GB via S3 terminal commands",
    "Code Interpreter execution time: default 15 min, max 8 hours",
    "Browser session: default 15 min timeout, max 8 hours, multiple concurrent sessions",
    "Browser types: aws.browser.v1 (default) and custom (adds session recording, network settings, IAM role)",
    "Session recording: DOM changes, actions, console logs, network events — stored in your S3",
    "Live View: real-time human observation and interaction with the browser session",
    "Pricing: Code Interpreter = Browser = $0.0895/vCPU-hr, $0.00945/GB-hr",
    "Runtime microVMs cost more: $0.1276/vCPU-hr vs $0.0895/vCPU-hr for tools",
    "CloudTrail logging on both tools for compliance auditing",
    "Web Search (separate tool): $7.00 per 1,000 queries",
    // Source: https://aws.amazon.com/bedrock/agentcore/pricing/
  ],

  relatedServices: [
    "Amazon Bedrock AgentCore Runtime",
    "Amazon S3 (session recording storage, browser profiles)",
    "AWS CloudTrail",
    "Amazon CloudWatch",
    "Amazon Bedrock AgentCore Gateway",
  ],

  examTips: [
    "Code Interpreter and Browser have IDENTICAL pricing ($0.0895/vCPU-hr) — LOWER than Runtime ($0.1276/vCPU-hr)",
    "100 MB inline vs 5 GB via S3 — know both Code Interpreter file limits",
    "Both tools default to 15 min session, max 8 hours — same as Runtime microVM max",
    "Session recording is custom browser only — aws.browser.v1 does NOT record",
    "Live View = real-time; Session recording = historical replay — different use cases",
    "Playwright, Nova Act, Strands = supported Browser automation libraries",
    "Code Interpreter is sandboxed — network access is configurable, can be air-gapped",
  ],
};
