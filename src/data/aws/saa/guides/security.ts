import { ServiceGuide } from "../../../../types/guide";

export const securityGuide: ServiceGuide = {
  id: "saa-security",
  service: "Security Services",
  domain: "security",
  tagline: "GuardDuty, WAF, Shield, KMS, Secrets Manager, and more",
  intro:
    "SAA-C03 Domain 1 (30% of exam) covers a wide range of AWS security services. Knowing which service to use for threat detection, data protection, network defense, and secret management is essential.",

  sections: [
    {
      heading: "AWS KMS: Key Management Service",
      body: `KMS is the central service for encryption key management in AWS. **Customer Managed Keys (CMK)** are keys you create and control — you define key policies, enable/disable the key, rotate it annually, and can delete it (with a 7-30 day waiting period). **AWS Managed Keys** are created and managed by AWS on your behalf for specific services (e.g., aws/s3, aws/rds) — automatic annual rotation, no cost to use them, you cannot manage them directly. **AWS Owned Keys** are entirely owned and managed by AWS, not visible in your account.

KMS uses **envelope encryption**: a data key (DEK) encrypts your data, and the DEK itself is encrypted by a KMS CMK. The encrypted DEK is stored alongside the data. KMS never stores plaintext data keys — it decrypts DEKs on-demand when the caller has permission to use the CMK. All KMS API calls are logged in CloudTrail, providing a full audit trail of who used which key to encrypt or decrypt what data.`,
      quiz: [
        {
          question:
            "A compliance requirement mandates that all S3 encryption key usage must appear in CloudTrail audit logs. Which encryption option satisfies this?",
          options: [
            "SSE-KMS with a customer managed key",
            "SSE-S3 with AWS managed keys",
            "SSE-C with customer-provided keys",
            "Client-side encryption with a local key",
          ],
          correctIndex: 0,
          explanation:
            "SSE-KMS records every KMS API call (GenerateDataKey, Decrypt) in CloudTrail with the CMK ID and caller identity. SSE-S3 uses AWS managed keys with no per-operation CloudTrail visibility. SSE-C requires the client to supply the key on each request — AWS doesn't log the key usage in CloudTrail.",
        },
      ],
    },
    {
      heading: "AWS Secrets Manager",
      body: `Secrets Manager stores and manages secrets such as database credentials, API keys, and OAuth tokens. It supports automatic rotation for RDS, Redshift, DocumentDB, and custom secrets via Lambda rotation functions. When rotation occurs, Secrets Manager calls the Lambda function, which updates the secret in Secrets Manager and the underlying service. Applications retrieve secrets via the Secrets Manager API (never hardcoded) — the SDK automatically caches secrets locally.

Secrets Manager charges per secret per month plus per 10,000 API calls. **SSM Parameter Store** is a cheaper alternative for non-secret configuration values — it also stores strings and SecureStrings (encrypted with KMS). Parameter Store is better for non-sensitive config (feature flags, connection strings without passwords). Use Secrets Manager when automatic rotation and fine-grained access control are required.`,
      quiz: [
        {
          question:
            "A Lambda function needs to connect to RDS and the database password must rotate automatically every 30 days. What is the BEST solution?",
          options: [
            "Store the password in Secrets Manager with automatic RDS rotation configured",
            "Store the password in SSM Parameter Store as a SecureString",
            "Hardcode the password in an environment variable and rotate manually",
            "Use IAM database authentication so no password is needed",
          ],
          correctIndex: 0,
          explanation:
            "Secrets Manager is purpose-built for credential rotation — it automatically rotates RDS passwords on a schedule and updates both Secrets Manager and the RDS instance atomically. SSM Parameter Store doesn't support automatic rotation. IAM database authentication is excellent but requires RDS MySQL/PostgreSQL and IAM configuration changes.",
        },
      ],
    },
    {
      heading: "Amazon GuardDuty",
      body: `GuardDuty is a managed threat detection service that analyzes CloudTrail logs, VPC Flow Logs, DNS query logs, and (optionally) S3 access logs and EKS audit logs for malicious activity. It uses ML and threat intelligence to identify findings such as: EC2 instances communicating with known malicious IPs, unusual API call patterns (credential exfiltration), cryptocurrency mining activity, and S3 bucket exfiltration.

GuardDuty operates without any agents or infrastructure changes — you enable it with one click and it immediately begins analyzing data sources. Findings are delivered to the GuardDuty console and can be forwarded to EventBridge for automated remediation (e.g., isolate an EC2 instance by modifying its security group). GuardDuty has a 30-day free trial. For multi-account organizations, designate a delegated administrator account to centralize GuardDuty findings.`,
      quiz: [
        {
          question:
            "A security team wants to detect if any EC2 instance starts communicating with a known cryptocurrency mining command-and-control server. Which AWS service provides this detection?",
          options: [
            "Amazon GuardDuty",
            "AWS WAF",
            "VPC Flow Logs with CloudWatch alarms",
            "Amazon Inspector",
          ],
          correctIndex: 0,
          explanation:
            "GuardDuty analyzes VPC Flow Logs against AWS threat intelligence feeds that include known malicious IPs (C2 servers, cryptocurrency mining pools). It automatically generates a finding like CryptoCurrency:EC2/BitcoinTool. WAF protects web applications from HTTP attacks. Inspector scans for software vulnerabilities, not network-level threat indicators.",
        },
      ],
    },
    {
      heading: "AWS WAF, Shield, and Firewall Manager",
      body: `**AWS WAF** is a web application firewall that filters HTTP/HTTPS traffic based on rules. WAF can be attached to CloudFront, ALB, API Gateway, and AppSync. Rules can match IP addresses, geographic origin, HTTP headers, URI strings, SQL injection patterns, XSS patterns, and rate limits (rate-based rules block IPs exceeding a request threshold). **Managed Rule Groups** from AWS and AWS Marketplace provide pre-built protection for common threats (OWASP Top 10, bot detection, known bad IPs).

**AWS Shield Standard** is automatically enabled for all AWS customers at no cost — it protects against common Layer 3/4 DDoS attacks (SYN floods, UDP floods). **AWS Shield Advanced** ($3,000/month minimum) provides enhanced DDoS protection for EC2, ELB, CloudFront, and Route 53 with 24/7 access to the AWS DDoS Response Team (DRT), cost protection during attacks, and advanced attack dashboards. **Firewall Manager** centrally manages WAF rules, Shield Advanced protections, and Security Group policies across multiple accounts in an Organization.`,
      quiz: [
        {
          question:
            "A web application behind CloudFront is experiencing SQL injection attacks. Which service should be configured to block these attacks?",
          options: [
            "AWS WAF with SQL injection match rules attached to the CloudFront distribution",
            "AWS Shield Advanced on the CloudFront distribution",
            "NACLs blocking the source IP ranges",
            "GuardDuty with CloudFront data source enabled",
          ],
          correctIndex: 0,
          explanation:
            "WAF inspects HTTP request content (headers, body, URI) and can match and block SQL injection patterns using managed rule groups or custom rules. Shield protects against volumetric DDoS at Layer 3/4, not Layer 7 application attacks. NACLs are IP-based and can't inspect HTTP content. GuardDuty detects threats but doesn't block traffic.",
        },
      ],
    },
    {
      heading: "Amazon Inspector and Macie",
      body: `**Amazon Inspector** continuously scans EC2 instances, container images in ECR, and Lambda functions for software vulnerabilities (CVEs) and unintended network exposure. Inspector uses an agent on EC2 (AWS Systems Manager Agent) and automatically re-scans when new CVEs are published or software packages change. Findings are risk-scored so teams can prioritize remediation.

**Amazon Macie** uses ML to discover and classify sensitive data (PII, financial information, credentials) stored in S3. Macie generates findings when it detects sensitive data in buckets that should be secured or when bucket policies allow unexpected access. Macie is useful for data governance, privacy compliance (GDPR, HIPAA), and detecting accidental exposure of sensitive data in S3. Both Inspector and Macie are regional services that can be centralized across an Organization via a delegated administrator.`,
      quiz: [
        {
          question:
            "A company stores customer data in S3 and needs to automatically identify which buckets contain PII to meet GDPR requirements. Which service provides this capability?",
          options: [
            "Amazon Macie",
            "Amazon Inspector",
            "AWS Config with S3 bucket rules",
            "CloudTrail data events on S3",
          ],
          correctIndex: 0,
          explanation:
            "Macie uses ML to scan S3 object content and classify sensitive data including PII (names, addresses, social security numbers, credit card numbers). It identifies which buckets contain sensitive data and flags policy violations. Inspector scans for software vulnerabilities, not data content. Config monitors bucket configuration (public access settings), not data content.",
        },
      ],
    },
    {
      heading: "AWS Certificate Manager and CloudHSM",
      body: `**ACM** provisions, manages, and automatically renews SSL/TLS certificates for AWS services. ACM certificates are free and integrate with CloudFront, ALB, and API Gateway. Certificates for CloudFront must be provisioned in us-east-1 (ACM is regional, but CloudFront is global and uses the us-east-1 ACM endpoint). ACM handles certificate renewal automatically — no manual renewal process needed.

**CloudHSM** provides dedicated hardware security modules (HSMs) for cryptographic key generation and operations. Unlike KMS (which is multi-tenant), CloudHSM gives you exclusive access to the hardware — required for regulatory environments mandating FIPS 140-2 Level 3 compliance. CloudHSM is managed by you (not AWS) — AWS provisions the hardware but you manage the keys. HSMs are deployed in clusters across multiple AZs for high availability.`,
      quiz: [
        {
          question:
            "A financial company must store encryption keys in hardware that meets FIPS 140-2 Level 3 compliance and where AWS has no access to the keys. Which service should be used?",
          options: [
            "AWS CloudHSM",
            "AWS KMS with a customer managed key",
            "AWS Secrets Manager",
            "AWS Certificate Manager",
          ],
          correctIndex: 0,
          explanation:
            "CloudHSM provides dedicated FIPS 140-2 Level 3 compliant hardware where you control all keys — AWS cannot access the cryptographic material. KMS is FIPS 140-2 Level 2 and AWS manages the underlying hardware (even for customer managed keys). Secrets Manager is for storing credentials, not HSM-level key operations.",
        },
      ],
    },
  ],

  keyFacts: [
    "KMS CMK: you control it. AWS Managed Key: AWS controls, automatic rotation. AWS Owned: invisible to you",
    "KMS envelope encryption: data key encrypts data; CMK encrypts the data key",
    "KMS key deletion: 7-30 day waiting period (cannot be immediate)",
    "Secrets Manager: automatic rotation for RDS, custom secrets via Lambda. Charges per secret/month",
    "SSM Parameter Store: free tier for standard parameters, cheaper than Secrets Manager for non-rotating config",
    "GuardDuty: analyzes CloudTrail, VPC Flow Logs, DNS — no agents required, 30-day free trial",
    "WAF: Layer 7 HTTP/HTTPS filtering (SQL injection, XSS, rate limiting)",
    "Shield Standard: free, Layer 3/4 DDoS. Shield Advanced: $3K/month, DRT access, cost protection",
    "Inspector: CVE scanning for EC2, ECR images, Lambda. Macie: PII/sensitive data discovery in S3",
    "ACM certificates: free, auto-renew. CloudFront ACM cert must be in us-east-1",
    "CloudHSM: FIPS 140-2 Level 3, dedicated hardware, you manage keys (AWS cannot access them)",
    "KMS key rotation: enabling automatic annual rotation creates a new key version — old versions are retained to decrypt existing ciphertext",
    "Amazon Detective: investigates security findings from GuardDuty and CloudTrail using graph-based analysis — for incident investigation, not threat detection",
    "AWS Network Firewall: stateful managed firewall inside a VPC — for deep packet inspection and Layer 7 filtering of VPC traffic",
  ],

  relatedServices: [
    "AWS IAM",
    "Amazon VPC",
    "AWS CloudTrail",
    "Amazon EventBridge",
    "AWS Organizations",
    "AWS Security Hub",
  ],

  examTips: [
    "KMS for key management and encryption audit trails. CloudHSM for FIPS 140-2 Level 3 and dedicated hardware",
    "Secrets Manager for rotating credentials. SSM Parameter Store for non-rotating config values",
    "GuardDuty detects threats (no blocking). WAF blocks HTTP attacks. Shield defends against DDoS",
    "Inspector = vulnerability scanning (CVEs). Macie = sensitive data discovery (PII in S3)",
    "WAF attaches to CloudFront, ALB, API Gateway — not EC2 directly",
    "Shield Advanced required for cost protection during DDoS attacks and DRT support",
    "Firewall Manager manages WAF rules and Shield across multiple accounts — requires Organizations",
    "ACM certificates for CloudFront must be in us-east-1 — a very common exam trap",
    "GuardDuty findings → EventBridge → Lambda for automated remediation (isolate instance, revoke credentials)",
    "Security Hub aggregates findings from GuardDuty, Inspector, Macie, and third-party tools into a single dashboard",
    "GuardDuty detects threats; Detective investigates them — use both together for a detect-and-investigate security workflow",
  ],
};
