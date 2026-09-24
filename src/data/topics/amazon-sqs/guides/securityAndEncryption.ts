import { ServiceGuide } from "../../../../types/guide";

// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-security-best-practices.html
// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-server-side-encryption.html
// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/security-iam.html
export const securityAndEncryptionGuide: ServiceGuide = {
  id: "amazon-sqs-security",
  service: "SQS Security & Encryption",
  domain: "security",
  tagline:
    "IAM policies, resource-based queue policies, SSE-SQS, SSE-KMS, and VPC endpoints",
  intro:
    "Amazon SQS provides layered security controls: identity-based IAM policies control who can call SQS APIs, resource-based queue policies control access at the queue level (including cross-account), server-side encryption protects message data at rest, and VPC endpoints ensure traffic never leaves the AWS network. Understanding the interaction between IAM and queue policies is essential for secure multi-account architectures.",

  sections: [
    {
      heading: "IAM Policies vs Queue Policies",
      body: `SQS access is controlled by two complementary policy types. **IAM policies** are identity-based: attached to users, groups, or roles, they grant or deny SQS API actions for those principals. IAM policies are the primary access control mechanism for same-account access. **Queue policies** (also called resource-based policies) are attached directly to the queue. They are essential for cross-account access, because IAM policies alone cannot grant cross-account access to SQS — both a queue policy on the target queue AND an IAM policy on the cross-account principal are required.

Queue policies use the same policy language as IAM but with a \`Principal\` element identifying the allowed entities. Queue policies can grant access to AWS services (like SNS, EventBridge, or Lambda event source mapping), specific AWS accounts, or specific IAM principals. Avoid using \`"Principal": "*"\` unless you explicitly intend to allow public access — this makes the queue accessible to anyone on the internet.

The three access control roles for SQS are: **Administrators** (create/modify/delete queues, manage policies), **Producers** (send messages), and **Consumers** (receive and delete messages). Follow least-privilege by granting each role only the specific API actions it needs: \`sqs:SendMessage\` for producers, \`sqs:ReceiveMessage\` + \`sqs:DeleteMessage\` for consumers.`,
      quiz: [
        {
          question:
            "An SNS topic in Account A needs to publish messages to an SQS queue in Account B. What is required to enable this?",
          options: [
            "An IAM role in Account A with sqs:SendMessage permission on the Account B queue",
            "A queue policy on the Account B queue granting sqs:SendMessage to the Account A SNS topic",
            "Both a queue policy on Account B's queue AND an IAM policy in Account A",
            "Only an IAM policy in Account B that trusts Account A's SNS service",
          ],
          correctIndex: 1,
          explanation:
            "For cross-account access FROM an AWS service (SNS) TO an SQS queue, a resource-based queue policy on the target SQS queue is the correct and sufficient mechanism. The queue policy grants sqs:SendMessage to the SNS topic's ARN as the Principal. You don't need an IAM policy in Account A for service-to-service cross-account access — the queue policy alone is sufficient when the caller is an AWS service principal.",
        },
      ],
    },
    {
      heading: "Server-Side Encryption: SSE-SQS vs SSE-KMS",
      body: `SQS offers two server-side encryption options for messages at rest. **SSE-SQS** uses an AWS-managed key owned and operated by SQS — there is no additional cost, no KMS API calls, and no configuration beyond enabling it. SSE-SQS is the default recommended option for most workloads that need encryption at rest without custom key management.

**SSE-KMS** uses a customer-managed key (CMK) in AWS Key Management Service. Every message encrypt/decrypt operation triggers a KMS API call, which incurs KMS costs (approximately $0.03 per 10,000 API calls). SSE-KMS is required when you need: key rotation control, cross-account access using key policies, CloudTrail auditing of key usage, or integration with other KMS-encrypted services. When using SSE-KMS, the producer's IAM identity must have \`kms:GenerateDataKey\` permission and the consumer must have \`kms:Decrypt\`.

Encryption applies at the message level when SQS stores messages. All messages are automatically decrypted when accessed by authorized consumers — there is no difference in how you call the SQS API. Encryption protects against unauthorized access to the underlying SQS infrastructure but does not protect in transit (use HTTPS for that).`,
      quiz: [
        {
          question:
            "A consumer IAM role has sqs:ReceiveMessage permission on an SSE-KMS encrypted queue. The consumer receives an empty response even though messages are in the queue. What is the most likely cause?",
          options: [
            "The consumer needs sqs:DecryptMessage permission",
            "The consumer's IAM role is missing kms:Decrypt permission on the KMS key",
            "SSE-KMS prevents consumers from receiving messages — only producers can interact with encrypted queues",
            "The consumer must use a different SDK that supports KMS-encrypted SQS",
          ],
          correctIndex: 1,
          explanation:
            "When using SSE-KMS, consumers need both sqs:ReceiveMessage AND kms:Decrypt permission on the KMS key used to encrypt the queue. Without kms:Decrypt, SQS cannot decrypt the message to return it — the ReceiveMessage call succeeds (no error) but returns no messages. There is no sqs:DecryptMessage action. The SQS SDK handles KMS decryption transparently — no special SDK is needed.",
        },
      ],
    },
    {
      heading: "Enforcing Encryption in Transit",
      body: `Server-side encryption protects data at rest. To protect data in transit, you must enforce HTTPS connections. By default, SQS accepts both HTTP and HTTPS requests. To deny all HTTP requests, add a condition to the queue policy using the \`aws:SecureTransport\` condition key.

The queue policy condition \`"aws:SecureTransport": "false"\` with effect \`Deny\` blocks any request that does not use TLS, returning an \`AccessDenied\` error for non-HTTPS callers. This is a security best practice recommended in the SQS Security Best Practices guide and should be applied to all queues handling sensitive data.

Note that this condition applies to all principals including AWS services. Ensure that services publishing to or consuming from the queue use HTTPS endpoints — virtually all AWS SDK default configurations already use HTTPS, so this is primarily a defense against misconfigured clients.`,
      quiz: [
        {
          question:
            "You want to ensure all SQS API calls to a queue use HTTPS (TLS). Which approach is correct?",
          options: [
            "Enable SSE-SQS encryption on the queue",
            "Add a Deny statement to the queue policy with the condition aws:SecureTransport=false",
            "Set the queue attribute RequireHTTPS=true via SetQueueAttributes",
            "Apply an SCP to the AWS account that requires HTTPS for all SQS calls",
          ],
          correctIndex: 1,
          explanation:
            "Adding a Deny effect to the queue policy with condition aws:SecureTransport=false blocks any request not using TLS. SSE-SQS encrypts data at rest — it does not affect transport security. There is no RequireHTTPS queue attribute. An SCP (Service Control Policy) would work but is an account-level control — a queue policy condition is the direct, queue-specific approach.",
        },
      ],
    },
    {
      heading: "VPC Endpoints for Private Queue Access",
      body: `By default, SQS API calls travel over the public internet. For workloads where data must not leave the AWS network, configure an **SQS VPC endpoint** (powered by AWS PrivateLink). A VPC endpoint creates a private connection between your VPC and the SQS service — traffic never traverses the public internet or requires internet gateways, NAT gateways, or VPN connections.

VPC endpoints for SQS are **interface endpoints** (not gateway endpoints like S3/DynamoDB). You create the endpoint in your VPC, selecting the subnets and security groups that control which resources can reach it. The endpoint receives a private DNS name that your applications use instead of the public SQS endpoint.

You can combine VPC endpoints with queue policies to enforce that all access to a queue comes only from a specific VPC or VPC endpoint. Use the \`aws:SourceVpc\` or \`aws:SourceVpce\` condition key in the queue policy to deny requests originating from outside the specified VPC or endpoint. This ensures that even if credentials were compromised, they could only be used from within your VPC.`,
      quiz: [
        {
          question:
            "A financial application running in a VPC requires that all SQS messages never traverse the public internet. Which combination of services achieves this?",
          options: [
            "Enable SSE-KMS on the SQS queue and use HTTPS",
            "Create an SQS VPC interface endpoint and optionally add a queue policy condition on aws:SourceVpce",
            "Deploy the SQS queue in the same Availability Zone as the application",
            "Use a VPC gateway endpoint for SQS",
          ],
          correctIndex: 1,
          explanation:
            "An SQS VPC interface endpoint (AWS PrivateLink) routes all SQS traffic through the AWS backbone network, never touching the public internet. Adding a queue policy condition on aws:SourceVpce ensures the queue only accepts requests via that specific endpoint. SSE-KMS + HTTPS encrypts data but doesn't keep traffic off the internet. SQS is a regional service — AZ placement doesn't affect internet routing. SQS uses interface endpoints (not gateway endpoints — gateway endpoints are only for S3 and DynamoDB).",
        },
      ],
    },
  ],

  keyFacts: [
    "IAM policies alone are insufficient for cross-account SQS access — queue policy is required",
    "Queue policy Principal=* makes the queue publicly accessible — avoid this",
    "SSE-SQS: AWS-managed key, no additional cost, no KMS API calls",
    "SSE-KMS: customer-managed key, incurs KMS API call costs, enables audit trail",
    "SSE-KMS consumers need sqs:ReceiveMessage AND kms:Decrypt on the KMS key",
    "SSE-KMS producers need sqs:SendMessage AND kms:GenerateDataKey",
    "Enforce HTTPS via queue policy Deny with condition aws:SecureTransport=false",
    "SQS VPC endpoint is an interface endpoint (PrivateLink) — not a gateway endpoint",
    "aws:SourceVpce condition in queue policy restricts access to specific VPC endpoints",
    "Three SQS roles: Administrators, Producers, Consumers — grant least privilege per role",
  ],

  relatedServices: [
    "AWS IAM",
    "AWS KMS",
    "AWS PrivateLink",
    "Amazon VPC",
    "AWS CloudTrail",
    "Amazon SNS",
  ],

  examTips: [
    "Cross-account access requires BOTH a queue policy AND IAM policy — neither alone is sufficient",
    "SSE-SQS = free, no config; SSE-KMS = auditable, rotatable, costs money per API call",
    "Missing kms:Decrypt on consumer = empty ReceiveMessage responses, not an error",
    "SQS VPC endpoint is interface (PrivateLink), NOT gateway — don't confuse with S3/DynamoDB",
    "aws:SecureTransport=false in Deny condition = block non-HTTPS callers",
    "SNS-to-SQS cross-account: queue policy granting SNS principal is sufficient (no IAM needed in source account)",
  ],
};
