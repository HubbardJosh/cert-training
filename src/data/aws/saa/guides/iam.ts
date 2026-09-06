import { ServiceGuide } from "../../../../types/guide";

export const iamGuide: ServiceGuide = {
  id: "saa-iam",
  service: "AWS IAM",
  domain: "security",
  tagline: "Control who can access which AWS resources and how",
  intro:
    "IAM is the foundation of AWS security. It lets you create users, groups, roles, and policies that control authentication and authorization for every AWS API call.",

  sections: [
    {
      heading: "IAM Principals: Users, Groups, and Roles",
      body: `An IAM **user** is a permanent identity with long-term credentials (password and/or access keys). A **group** is a collection of users that share the same policies — groups cannot be nested and cannot be used as principals in resource-based policies. An IAM **role** is a temporary identity assumed by trusted principals (users, services, or external accounts); when a role is assumed, AWS STS issues short-lived credentials. Roles are the preferred pattern for granting EC2 instances, Lambda functions, and cross-account access because they eliminate long-term key management.

The root account user has unrestricted access to everything in the account and should never be used for day-to-day operations. Best practice is to create an IAM admin user immediately after account creation, enable MFA on root, and lock the root credentials away.`,
      quiz: [
        {
          question:
            "Which IAM principal type issues temporary credentials when assumed?",
          options: ["IAM Role", "IAM User", "IAM Group", "IAM Policy"],
          correctIndex: 0,
          explanation:
            "When an IAM Role is assumed via AWS STS, temporary credentials (access key, secret key, session token) are issued with a configurable expiration. Users and groups use long-term credentials; policies are not principals at all.",
        },
      ],
    },
    {
      heading: "IAM Policies: Identity-Based vs. Resource-Based",
      body: `**Identity-based policies** are attached to users, groups, or roles and define what actions that principal can perform. **Resource-based policies** are attached directly to resources (S3 buckets, KMS keys, SQS queues, Lambda functions, etc.) and define who can access that resource. Resource-based policies can grant cross-account access without requiring role assumption.

When both an identity-based and a resource-based policy apply to a **same-account** request, AWS uses a logical OR — access is allowed if either policy permits it. For **cross-account** requests, BOTH the identity policy in the calling account AND the resource-based policy in the target account must allow the action. An explicit **Deny** in any policy always overrides any Allow. **Permissions boundaries** set the maximum permissions an identity-based policy can grant to a user or role — they do not grant permissions themselves.`,
      quiz: [
        {
          question:
            "An explicit Deny in an IAM policy and an explicit Allow in another policy both apply to the same action. What is the result?",
          options: [
            "Deny wins — access is blocked",
            "Allow wins — access is granted",
            "The more specific policy wins",
            "The policy attached to the resource wins",
          ],
          correctIndex: 0,
          explanation:
            "In IAM, an explicit Deny always overrides any Allow. This is a core evaluation rule: if any applicable policy contains an explicit Deny for the action, access is denied regardless of how many Allows exist.",
        },
      ],
    },
    {
      heading: "Policy Evaluation Logic",
      body: `AWS evaluates policies in a specific order. First, it checks for an explicit Deny in any policy — if found, access is denied immediately. Next, it checks for an explicit Allow — if found, access is granted. If neither is present, the default is an **implicit Deny**. This means IAM is deny-by-default; every permission must be explicitly granted.

For cross-account requests, both the calling account's identity policy and the resource account's resource-based policy (or a role trust policy) must allow the action. AWS evaluates service control policies (SCPs) from AWS Organizations before evaluating IAM policies. If an SCP does not allow the action, IAM policies cannot override it.`,
      quiz: [
        {
          question:
            "A user's IAM policy allows s3:PutObject on a bucket. No resource-based policy exists on the bucket. The user's AWS Organization SCP does not explicitly allow s3:PutObject. What happens?",
          options: [
            "Access is denied because the SCP must explicitly allow the action",
            "Access is granted because the IAM policy allows it",
            "Access is granted because S3 uses bucket ACLs, not SCPs",
            "Access depends on whether the bucket is in the same account",
          ],
          correctIndex: 0,
          explanation:
            "SCPs act as guardrails — they restrict what IAM policies can do. If the SCP does not include an Allow for s3:PutObject, the action is blocked even if the IAM identity policy permits it. SCPs do not grant permissions; they set the maximum allowed permissions.",
        },
      ],
    },
    {
      heading: "IAM Roles for AWS Services",
      body: `EC2 instances should access other AWS services via an **instance profile** (a container for a single IAM role attached to the instance). The EC2 metadata service (169.254.169.254) vends temporary credentials from the role automatically, rotating them before expiry. Lambda functions are assigned an **execution role** that grants permissions to log to CloudWatch, access DynamoDB, call other services, etc.

For cross-account access, a role in the target account must have a **trust policy** allowing the source account's principals to assume it. The caller then uses STS AssumeRole to obtain temporary credentials for the target account role. This is the safest pattern for cross-account automation because no long-term credentials are shared.`,
      quiz: [
        {
          question:
            "An EC2 instance needs to read from S3. What is the MOST secure way to grant this access?",
          options: [
            "Attach an IAM role with S3 read permissions to the EC2 instance profile",
            "Store AWS access keys in the EC2 user data",
            "Create an IAM user for the instance and store its credentials in environment variables",
            "Use the root account credentials stored in a config file on the instance",
          ],
          correctIndex: 0,
          explanation:
            "An IAM role attached via an instance profile provides temporary, automatically-rotating credentials via the EC2 metadata service. Hardcoding access keys anywhere (user data, environment variables, config files) is a security risk because they are long-term credentials that can be leaked.",
        },
      ],
    },
    {
      heading: "STS and Temporary Credentials",
      body: `AWS STS (Security Token Service) is the global service that issues temporary security credentials. Key STS APIs include **AssumeRole** (assume an IAM role, optionally with a session policy to further restrict permissions), **AssumeRoleWithWebIdentity** (for OIDC federated users — used by Cognito and Kubernetes service accounts), and **GetSessionToken** (for MFA-protected API calls). Temporary credentials consist of an access key ID, a secret access key, and a session token. Duration varies by API: **AssumeRole** supports 15 minutes to 12 hours maximum; **GetSessionToken** supports up to 36 hours.

**Session policies** are policy documents you pass with AssumeRole to further restrict (never expand) the permissions of the assumed role. The effective permissions are the intersection of the role's permissions and the session policy.`,
      quiz: [
        {
          question:
            "Which STS API action is used when a web identity provider (such as Google or an OIDC provider) authenticates a user who then needs AWS access?",
          options: [
            "AssumeRoleWithWebIdentity",
            "AssumeRole",
            "GetFederationToken",
            "GetSessionToken",
          ],
          correctIndex: 0,
          explanation:
            "AssumeRoleWithWebIdentity is the STS API for OIDC federation — the user authenticates with an external identity provider, receives a JWT, and exchanges it for temporary AWS credentials. Cognito User Pools and Kubernetes IRSA use this flow.",
        },
      ],
    },
    {
      heading: "IAM Best Practices for the Exam",
      body: `The exam heavily tests IAM best practices. The **principle of least privilege** means granting only the exact permissions needed for a task — start with deny-all and add permissions incrementally. Never use the root account for daily tasks; protect it with MFA and lock the access keys. Rotate IAM user credentials regularly and use **IAM Access Analyzer** to identify external access to resources.

Use IAM **conditions** to restrict policies by IP address, time of day, MFA status, or request region. The \`aws:MultiFactorAuthPresent\` condition key ensures an action can only be taken if the user authenticated with MFA — essential for protecting sensitive operations like deleting S3 buckets or stopping EC2 instances.`,
      quiz: [
        {
          question:
            "A security policy requires that IAM users can only delete S3 buckets if they authenticated with MFA. How is this enforced?",
          options: [
            "Add a Deny statement with a condition on aws:MultiFactorAuthPresent being false",
            "Create a separate MFA-only IAM group for S3 delete permissions",
            "Enable MFA Delete on the S3 bucket and attach an S3 bucket policy",
            "Require MFA at the AWS Organizations SCP level",
          ],
          correctIndex: 0,
          explanation:
            "An IAM policy Deny with `aws:MultiFactorAuthPresent: false` blocks the action unless MFA was used during authentication. This is the standard pattern — the Deny fires when MFA is absent, so the action is only allowed when MFA is present.",
        },
      ],
    },
  ],

  keyFacts: [
    "IAM is global — users, groups, roles, and policies are not region-specific",
    "Explicit Deny always overrides any Allow — IAM default is implicit Deny",
    "IAM roles issue temporary credentials via STS; users have long-term credentials",
    "SCPs from AWS Organizations restrict what IAM policies can permit — SCPs do not grant permissions",
    "Permissions boundaries set maximum permissions but do not grant anything themselves",
    "Resource-based policies can grant cross-account access without role assumption",
    "Instance profiles are containers for IAM roles attached to EC2 instances",
    "AssumeRoleWithWebIdentity is for OIDC/JWT federation (Cognito, Kubernetes IRSA)",
    "aws:MultiFactorAuthPresent condition enforces MFA requirements in policies",
    "IAM Access Analyzer identifies unintended external access to resources",
    "Root account credentials should be locked; use MFA and never create access keys for root",
    "Groups cannot be nested; groups cannot be used as principals in resource-based policies",
  ],

  relatedServices: [
    "AWS STS",
    "AWS Organizations / SCPs",
    "Amazon Cognito",
    "AWS KMS",
    "AWS Secrets Manager",
    "AWS IAM Identity Center",
    "AWS Control Tower",
  ],

  examTips: [
    "When a question asks about 'most secure' access from EC2/Lambda to AWS services, the answer is almost always an IAM role — never access keys stored in code or environment variables",
    "Cross-account access requires BOTH the source account to allow AssumeRole AND the target role's trust policy to allow the source principal",
    "SCPs restrict permissions for all principals in an OU or account — the root account of the management account is not affected by SCPs",
    "Permissions boundaries intersect with identity policies — the effective permission is the overlap (AND), not the union (OR)",
    "Session policies further restrict (never expand) the permissions of an assumed role",
    "A Deny in a permissions boundary does not deny access — it simply prevents the identity policy from granting that permission",
    "IAM policy conditions using aws:SourceIp restrict access to requests from specified IP ranges — useful for limiting console access to corporate IPs",
    "Resource-based policies that allow a principal from another account do NOT require the external principal to also assume a role — the resource policy alone can grant access",
    "IAM Identity Center (SSO) is the recommended solution for multi-account access — create permission sets instead of creating IAM users in each account",
    "An SCP Allow does NOT grant permissions — it only sets the maximum boundary. IAM policies must still explicitly allow the action",
  ],
};
