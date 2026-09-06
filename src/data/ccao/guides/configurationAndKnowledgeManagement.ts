import { ServiceGuide } from "../../../types/guide";

export const configurationAndKnowledgeManagementGuide: ServiceGuide = {
  id: "ccao-configuration-knowledge-management",
  service: "Configuration and Knowledge Management",
  domain: "services",
  tagline:
    "Using Claude Projects, system instructions, and knowledge sources to build persistent, context-aware Claude experiences",
  intro:
    "Claude Projects are persistent workspaces on Claude.ai that retain a system prompt and uploaded knowledge files across every conversation in the project. Combined with connectors to external services like Google Drive and Gmail, Projects let you configure Claude once and have it behave consistently — with the right persona, rules, and reference material — for every subsequent session.",

  sections: [
    {
      heading: "Claude Projects Overview",
      body: `**Claude Projects** are persistent workspaces available on Pro, Max, Team, and Enterprise plans on Claude.ai. A Project groups together three things: a set of **project instructions** (a system prompt applied to every conversation in the project), **knowledge files** (uploaded documents Claude can reference), and the **conversation history** of all chats created within the project.

Without Projects, each Claude.ai conversation starts fresh — Claude has no memory of previous sessions and no pre-configured behavior. Projects change this by ensuring the same instructions and knowledge are present at the start of every conversation, eliminating the need to re-paste context each time.

Projects are ideal for recurring workflows: a legal team might create a Project with their contract-review checklist as instructions and their standard clause library as knowledge files; a support team might create a Project with their product documentation uploaded and instructions telling Claude to respond concisely and escalate edge cases. Once configured, any team member who opens the Project starts with a fully primed Claude instance.

**Plan availability** matters for the exam: Free plan users do not have access to Projects. Pro, Max, Team, and Enterprise plans all include Projects, with Enterprise plans adding additional governance and privacy controls.`,
      quiz: [
        {
          question:
            "A team wants Claude to apply the same persona, rules, and reference documents every time any team member starts a new conversation. Which Claude.ai feature enables this without pasting context manually each time?",
          options: [
            "Claude Projects — a persistent workspace that applies project instructions and knowledge files to every conversation automatically",
            "Saved responses — a clipboard feature that stores frequently used prompts for quick re-use",
            "Claude memory — a per-user feature that remembers facts across the user's own conversations",
            "Shared conversation links — allowing team members to continue the same conversation thread",
          ],
          correctIndex: 0,
          explanation:
            "Claude Projects provide a persistent workspace where project instructions and knowledge files are automatically applied to every new conversation opened within the project. This eliminates manual context-pasting and ensures consistent behavior for all team members. Saved responses and shared links do not configure Claude's behavior automatically. Memory is per-user, not team-wide, and covers remembered facts rather than structured instructions.",
        },
      ],
    },
    {
      heading: "Project Instructions: Writing Effective System Prompts",
      body: `**Project instructions** function as the system prompt for every conversation in a Claude Project. They appear before the user's first message and establish Claude's persona, scope, rules, and output expectations for the entire project. Writing strong project instructions is one of the highest-leverage configuration decisions you can make.

A well-structured set of project instructions follows this order: **role definition → task context → rules and constraints → output format → examples**.

- **Role definition**: Tell Claude who it is for this project. "You are a senior technical writer specializing in API documentation." A clear role shapes tone, vocabulary, and judgment calls throughout every conversation.
- **Task context**: Explain the purpose of the project. What kinds of tasks will users bring? What background is relevant? "Users will ask you to review and improve draft API reference entries."
- **Rules and constraints**: List what Claude should and should not do. Use clear, direct language. "Always include a code example in every endpoint description. Never speculate about undocumented behavior — flag it for the user to verify."
- **Output format**: Specify structure when it matters. "Respond in Markdown. Use H2 headings for each parameter. Provide a JSON example block."
- **Examples**: When possible, include one or two short examples of ideal input/output pairs. Examples dramatically reduce ambiguity and anchor Claude to the expected quality level.

**Specificity reduces drift.** Vague instructions like "be helpful and professional" leave Claude to interpret what "helpful" and "professional" mean for your context. Specific instructions like "limit responses to three paragraphs unless the user explicitly asks for more detail" produce predictable, consistent behavior.

**Delimiters help Claude parse structure.** Using XML-style tags, headers, or labeled sections in your instructions makes it easier for Claude to distinguish the role section from the rules section, reducing the chance of misinterpretation.`,
      quiz: [
        {
          question:
            "Which structure represents the recommended order for project instructions in a Claude Project?",
          options: [
            "Role definition → task context → rules and constraints → output format → examples",
            "Examples → rules and constraints → output format → role definition → task context",
            "Output format → examples → role definition → task context → rules and constraints",
            "Task context → output format → role definition → examples → rules and constraints",
          ],
          correctIndex: 0,
          explanation:
            "The recommended structure starts with the role definition so Claude understands who it is from the outset, then provides task context so it understands the purpose, followed by rules and constraints that govern behavior, output format specifications, and finally examples to anchor expectations. This ordering ensures each subsequent element builds on the foundation established before it, reducing ambiguity.",
        },
        {
          question:
            "A team notices their Claude Project gives inconsistent responses — sometimes too verbose, sometimes too terse. Which change to their project instructions is MOST likely to fix this?",
          options: [
            "Replace vague guidance like 'be concise' with a specific rule such as 'limit responses to three paragraphs unless the user asks for more detail'",
            "Add more knowledge files to give Claude additional context to draw from",
            "Switch to a more capable Claude model within the Project settings",
            "Enable the memory feature so Claude can learn the preferred response length over time",
          ],
          correctIndex: 0,
          explanation:
            "Inconsistent response length is a symptom of vague instructions. Replacing 'be concise' with a measurable rule like a paragraph limit gives Claude an unambiguous constraint to follow consistently. Adding knowledge files addresses what Claude knows, not how it responds. A more capable model still interprets vague instructions vaguely. Memory learns personal facts, not response style preferences from project instructions.",
        },
      ],
    },
    {
      heading: "Knowledge Files and Storage Limits",
      body: `**Knowledge files** are documents uploaded directly to a Claude Project. Claude can reference these files when answering questions within any conversation in the project. Supported formats include PDFs, plain text files, Markdown, and other document types. Once uploaded, knowledge files persist across all conversations in the project until you remove or replace them.

**How Claude uses knowledge files**: Knowledge file content is included in the context that Claude receives at the start of each conversation. Claude can cite, summarize, quote, and reason over the content of these files in its responses. This makes them powerful for grounding Claude in your organization's specific documentation, policies, or reference material.

**Storage limits apply**: Projects have a knowledge storage limit. This means you cannot upload unlimited documents — large document sets must be **prioritized by relevance**. Include the documents users are most likely to need in conversations; exclude rarely referenced material that can be fetched on demand. Prioritization is an ongoing maintenance task as your document library grows.

**Updating knowledge**: Claude.ai does not automatically sync knowledge files with their source documents. If the source PDF or text file changes, you must **manually re-upload the updated file** to the Project. The old file does not update itself. For frequently changing documents, connectors (covered in the next section) offer a better solution because they pull fresher data from the source system.

**Context window constraint**: All project instructions, knowledge file contents, and conversation messages must fit within the model's context window for a given conversation. Very large knowledge bases can consume much of the available context, leaving less room for conversation. If you find Claude's responses degrading in long conversations with large knowledge files, the context window limit is likely the cause.`,
      quiz: [
        {
          question:
            "A team uploaded a policy document to their Claude Project six months ago. The policy has since been updated significantly. What must the team do to ensure Claude references the current version?",
          options: [
            "Manually remove the old file and re-upload the updated document — knowledge files do not sync automatically with source changes",
            "Nothing — Claude.ai automatically detects when the source document changes and refreshes the knowledge file",
            "Use the 'refresh' button in the Project settings to trigger a re-index of all uploaded files",
            "Delete the Project and create a new one with the updated document uploaded",
          ],
          correctIndex: 0,
          explanation:
            "Knowledge files in Claude Projects are static uploads — they do not automatically sync with external source documents. When the source changes, you must manually remove the outdated file and upload the new version. There is no auto-refresh or re-index mechanism for uploaded files. Deleting and recreating the entire Project would work but is unnecessarily disruptive when only the file needs updating.",
        },
      ],
    },
    {
      heading: "Connectors: Google Drive, Gmail, and Live Data Sources",
      body: `**Connectors** allow Claude.ai to pull in content from external services rather than relying solely on manually uploaded files. The key distinction from knowledge files is currency: connectors pull **live data** from the connected source, meaning Claude has access to more up-to-date content without manual re-upload cycles.

**Supported connectors** (on eligible plans) include **Google Drive** and **Gmail**. A Google Drive connector lets Claude access documents and files stored in your Drive; a Gmail connector lets Claude reference email content. After authorizing the connection, Claude can search and reference content from the connected service within Project conversations.

**Connectors vs. knowledge files** is an important comparison for the exam:

- **Knowledge files**: Static uploads. Content reflects the file at upload time. Must be manually updated when the source changes. Best for stable, well-curated reference documents.
- **Connectors**: Dynamic pulls from a live source. Content is fresher. Best for documents that change frequently or that need to reflect the current state of an external system.

**Plan and availability considerations**: Connectors are available on supported plans. Not all plans include connector access — check plan details for the current availability. Enterprise plans typically include expanded connector options with additional administrative controls over which services can be connected and by whom.

**Authorization model**: Connectors require the user to explicitly authorize the connection to the external service (for example, signing in with Google to grant Drive access). Claude only accesses content the authorized user has permission to view — it respects the underlying service's access controls.`,
      quiz: [
        {
          question:
            "A team frequently updates a shared Google Drive document that Claude should reference in Project conversations. Which approach keeps Claude's knowledge most current with the least manual effort?",
          options: [
            "Use a Google Drive connector — it pulls live data from Drive so Claude references the current document without manual re-uploads",
            "Export the document as a PDF and re-upload it to the Project's knowledge files each time it changes",
            "Paste the updated document content into the project instructions each time it changes",
            "Create a new Claude Project every time the document is updated",
          ],
          correctIndex: 0,
          explanation:
            "A Google Drive connector is the purpose-built solution for this scenario. It pulls live content from the connected Drive, so Claude always references the current version of the document without any manual upload steps. Re-uploading a PDF manually works but creates overhead on every document change. Pasting into project instructions is impractical for large documents and would consume instruction space. Creating a new Project on every change is highly disruptive.",
        },
      ],
    },
    {
      heading: "Memory and Maintaining Claude Configurations",
      body: `**Claude memory** is a separate feature from Project knowledge files. Memory allows Claude.ai to remember facts about the **individual user** across conversations — things like the user's preferred response style, their role, or recurring context they share. Memory is user-specific: it persists for a given user across their conversations, not across all Project users. Users can view, edit, and delete their memories at any time from the Claude.ai settings.

Memory is distinct from Project knowledge in two key ways: **scope** (memory is per-user; knowledge files are per-project, shared by all users) and **content type** (memory captures learned facts about a user; knowledge files contain curated reference documents).

**Maintaining and updating configurations** is an ongoing responsibility, not a one-time task. Effective Project management includes:

- **Reviewing project instructions regularly**: As your team's workflows evolve, instructions that made sense at launch may become outdated or incomplete. Schedule periodic reviews.
- **Updating knowledge files when sources change**: Stale knowledge files produce stale answers. Establish a process for identifying when source documents have changed and re-uploading them promptly.
- **Pruning outdated files**: Files that are no longer relevant consume storage quota and add noise to Claude's context. Remove them proactively.
- **Testing after changes**: After updating instructions or knowledge files, run representative test conversations to verify Claude's behavior matches expectations. Changes to project instructions can have unintended effects on response quality.
- **Monitoring context usage**: In projects with large knowledge bases or long conversations, watch for signs that context limits are being reached (degraded response quality, inability to reference earlier content). Reduce knowledge file size or split into multiple projects if needed.

**Good configuration hygiene** treats Claude Projects like a living configuration artifact — requiring the same ongoing care as application configuration files, database schemas, or documentation: version awareness, regular review, and deliberate change management.`,
      quiz: [
        {
          question:
            "A Claude.ai user notices that Claude no longer seems to remember their preferred response style, even though it worked in previous sessions. Where should the user look to manage this stored preference?",
          options: [
            "The memory settings in Claude.ai — memories are user-specific and can be viewed, edited, or deleted there",
            "The Project's knowledge files — preferred response style is stored as a knowledge document",
            "The project instructions — this is where Claude learns user-specific preferences",
            "The Anthropic Console — user preferences are managed through the developer dashboard",
          ],
          correctIndex: 0,
          explanation:
            "Claude's memory feature stores user-specific facts and preferences and is managed through Claude.ai's memory settings. Users can view all stored memories, edit them, or delete them. This is separate from knowledge files (which hold curated project documents) and project instructions (which define project-wide behavior). The Anthropic Console manages API keys and developer resources, not end-user Claude.ai preferences.",
        },
      ],
    },
  ],

  keyFacts: [
    "Claude Projects are available on Pro, Max, Team, and Enterprise plans — not on the Free plan",
    "Project instructions act as a system prompt applied automatically to every conversation in the project",
    "Recommended instruction structure: role definition → task context → rules and constraints → output format → examples",
    "Knowledge files are static uploads — they do not auto-sync when source documents change; re-upload is required",
    "Projects have a knowledge storage limit — prioritize files by relevance and prune outdated documents",
    "All project instructions, knowledge files, and conversation content must fit within the model's context window",
    "Connectors (Google Drive, Gmail) pull live data from external services, keeping Claude's knowledge fresher than static uploads",
    "Memory is user-specific and persists across a user's conversations — it is separate from project-level knowledge files",
    "Users can view, edit, and delete their Claude memories at any time in Claude.ai settings",
    "Project configurations require ongoing maintenance: reviewing instructions, updating files, pruning stale content, and testing after changes",
  ],

  relatedServices: [
    "Anthropic Products and Ecosystem",
    "Prompt Engineering",
    "Capabilities and Limitations",
    "Safety and Responsible AI",
  ],

  examTips: [
    "Projects ≠ Free plan — Project access requires Pro, Max, Team, or Enterprise subscription",
    "Knowledge files are static — source document changes require manual re-upload; connectors solve this for live sources",
    "Memory is per-user; knowledge files are per-project — know the scope difference",
    "Context window = instructions + knowledge + conversation — large knowledge bases leave less room for dialogue",
    "Instruction quality drives consistency — vague instructions cause variable output; specific, structured instructions produce predictable behavior",
    "Connectors (Google Drive, Gmail) pull live data — prefer them over uploaded files when the source changes frequently",
  ],
};
