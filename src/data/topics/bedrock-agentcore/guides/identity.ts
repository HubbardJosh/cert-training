import { ServiceGuide } from "../../../../types/guide";

// Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html
// Source: https://aws.amazon.com/bedrock/agentcore/pricing/
export const identityGuide: ServiceGuide = {
  id: "agentcore-identity",
  service: "AgentCore Identity",
  domain: "security",
  tagline:
    "Workload identity and credential management built specifically for AI agents",
  intro:
    "AgentCore Identity is an identity and credential management service designed for AI agents and automated workloads. It assigns distinct identities to agents, integrates with corporate identity providers, manages outbound OAuth and API key flows, and ensures agents act only on behalf of users who have authorized them — with full audit trails.",

  sections: [
    {
      heading: "The Agent Identity Problem",
      body: `Traditional IAM solutions are designed for humans or static services. AI agents introduce new identity challenges:

**Acting on behalf of users**: An agent shouldn't have more permissions than the user it serves. If a user can only read their own Salesforce records, the agent acting for them should not have admin access to all records.

**Multiple external services**: A single agent workflow might call Slack, GitHub, Salesforce, and an internal API — each with different auth mechanisms (OAuth 2.0, API keys, SAML). Managing token refresh, expiry, and secure storage for each is complex.

**Audit requirements**: Enterprises need to know exactly what an agent did, on whose behalf, and when — for compliance, forensics, and debugging.

**Dynamic workloads**: Unlike a static Lambda function with a fixed IAM role, agent sessions are ephemeral and dynamic — identity must be provisioned and revoked per session.

AgentCore Identity addresses all of these by treating agents as **workload identities** — specialized identities with attributes that enable agent-specific capabilities while maintaining compatibility with industry-standard identity patterns.`,
      quiz: [
        {
          question:
            "Why are traditional IAM roles insufficient for AI agent identity management?",
          options: [
            "IAM roles cannot be attached to containerized workloads",
            "IAM roles do not support OAuth 2.0 for third-party services",
            "IAM roles are static and don't model acting on behalf of a specific user with user-scoped permissions",
            "IAM roles are incompatible with AgentCore Runtime microVMs",
          ],
          correctIndex: 2,
          explanation:
            "Traditional IAM roles grant permissions to a service or function statically — they don't model the concept of 'act on behalf of this specific user with only the permissions that user holds.' An agent needs user-scoped permissions that change based on who initiated the session, along with outbound credential management for third-party services. IAM roles work for AWS resources but don't cover OAuth/API key management for external services or per-user permission scoping.",
        },
      ],
    },
    {
      heading: "Workload Identities for Agents",
      body: `AgentCore Identity implements agent identities as **workload identities** — distinct from human user identities but compatible with enterprise identity infrastructure.

**What workload identities provide**:
- A stable identity for an agent (not tied to a specific EC2 instance or Lambda execution)
- Integration with corporate IdPs (Okta, Microsoft Entra ID, Amazon Cognito) for inbound user authentication
- Automatic token issuance and management for agent-to-service calls
- Support for OAuth, API keys, and other credential types in outbound flows

**Inbound authentication** (users authenticating to the agent):
- Corporate SSO via Okta, Microsoft Entra, or Cognito
- End users are authenticated before their requests reach the agent
- Ensures only authorized users can invoke agents they have access to

**Outbound authentication** (agent authenticating to tools):
- OAuth flows to Slack, GitHub, Salesforce, etc.
- API key injection for services that use keys
- Token refresh handled automatically — agents don't manage token expiry
- Agents can operate on behalf of users (delegated) or autonomously (service account mode)

**Pricing**: $0.010 per 1,000 token or API key requests. **Free** when Identity is used through Runtime or Gateway.`,
      quiz: [
        {
          question:
            "An agent needs to post Slack messages as the user who invoked it (using that user's Slack token), not as a service account. Which AgentCore Identity feature enables this?",
          options: [
            "Inbound authentication — the user's identity is verified at the gateway",
            "Outbound authentication in delegated mode — the agent uses OAuth to act on behalf of the authenticated user",
            "API key injection — the agent's API key grants user-level Slack access",
            "Workload identity tagging — the agent's IAM role is tagged with the user's email",
          ],
          correctIndex: 1,
          explanation:
            "Outbound authentication in delegated mode allows an agent to perform OAuth flows on behalf of an authenticated user — acquiring tokens scoped to that user's Slack permissions and using them for API calls. This is distinct from service account mode (the agent acts as itself) and from inbound authentication (verifying the user calling the agent). API key injection is for services using static keys, not user-scoped OAuth.",
        },
        {
          question:
            "What is the cost of AgentCore Identity when it is used as part of an AgentCore Runtime or Gateway flow?",
          options: [
            "$0.010 per 1,000 token requests",
            "$0.005 per 1,000 token requests (50% discount)",
            "Free — the fee is waived when used through Runtime or Gateway",
            "$0.001 per 1,000 token requests (bundled rate)",
          ],
          correctIndex: 2,
          explanation:
            // Source: https://aws.amazon.com/bedrock/agentcore/pricing/
            "AgentCore Identity is free when used as part of Runtime or Gateway flows. The $0.010 per 1,000 token or API key requests charge only applies when Identity is used independently, outside of Runtime or Gateway. This incentivizes using the integrated AgentCore platform rather than calling Identity in isolation.",
        },
      ],
    },
    {
      heading: "Supported Identity Providers and Consent",
      body: `AgentCore Identity integrates with major enterprise and consumer identity providers:

**Supported IdPs for inbound user authentication**:
- **Okta** — enterprise SSO
- **Microsoft Entra ID** (formerly Azure AD) — enterprise SSO
- **Amazon Cognito** — AWS-native user pools
- Private/on-premises IdPs via private connectivity

**OAuth provider support for outbound credentials** (via credential providers):
- Google (Gmail, Drive, Calendar)
- GitHub
- Salesforce
- Slack
- Microsoft 365 / SharePoint
- Any OAuth 2.0-compliant service

**Consent portal**: AgentCore Identity includes a built-in consent portal where users can authorize agents to act on their behalf for specific services. This creates an auditable record of user authorization, similar to "Grant this app access to your Google Drive" flows in consumer applications.

**JWT authorizer**: For services using JSON Web Tokens, Identity provides a configurable JWT authorizer for inbound request validation.`,
      quiz: [
        {
          question:
            "A company uses Microsoft Entra ID for all employee authentication. Their agent should only be accessible to employees who have logged in. Which AgentCore Identity feature enables this?",
          options: [
            "Outbound credential provider configured for Microsoft Entra",
            "Inbound authentication integrated with Microsoft Entra ID as the corporate IdP",
            "JWT authorizer that validates Entra-issued tokens at the Gateway",
            "Workload identity with an Entra group membership claim",
          ],
          correctIndex: 1,
          explanation:
            "Inbound authentication in AgentCore Identity integrates with corporate IdPs including Microsoft Entra ID — employees authenticate via Entra SSO before their requests reach the agent. This is the standard pattern for ensuring only authorized employees access an agent. The JWT authorizer is for fine-grained token validation, not the IdP integration itself. Outbound credential providers are for the agent calling external services, not for verifying the user calling the agent.",
        },
      ],
    },
  ],

  keyFacts: [
    "AgentCore Identity = workload identity and credential management for AI agents",
    "Inbound auth: integrates Okta, Microsoft Entra ID, Amazon Cognito; verifies users calling the agent",
    "Outbound auth: manages OAuth, API keys, token refresh for agent-to-service calls (delegated or service account)",
    "Consent portal: built-in user authorization flow — auditable record of what agents can access",
    "JWT authorizer: configurable validation of JWT tokens for inbound requests",
    "Pricing: $0.010/1,000 token or API key requests; FREE when used through Runtime or Gateway",
    "Supports private/on-premises IdPs via private connectivity",
    "OAuth outbound providers include: Google, GitHub, Salesforce, Slack, Microsoft 365",
    // Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html
  ],

  relatedServices: [
    "Amazon Cognito",
    "AWS IAM",
    "Amazon Bedrock AgentCore Gateway",
    "Amazon Bedrock AgentCore Runtime",
    "Microsoft Entra ID (external)",
    "Okta (external)",
  ],

  examTips: [
    "Identity solves TWO directions: inbound (who calls the agent) and outbound (what the agent calls)",
    "Identity is FREE through Runtime/Gateway — charge only applies when called independently",
    "Delegated mode = agent uses USER's OAuth token; Service account mode = agent uses its own credentials",
    "Consent portal = auditable record that the user authorized the agent — key for compliance",
    "Supported IdPs: Okta, Microsoft Entra, Amazon Cognito — NOT Google Workspace SSO as an inbound IdP",
    "Token refresh is automatic — agents never need to handle token expiry themselves",
  ],
};
