import { ServiceGuide } from "../../../../types/guide";

export const s3Guide: ServiceGuide = {
  id: "saa-s3",
  service: "Amazon S3",
  domain: "fundamentals",
  tagline: "Infinitely scalable object storage with 11 nines of durability",
  intro:
    "S3 stores objects (files) in buckets. It is the most heavily tested service on SAA-C03. Every architect needs to know storage classes, security controls, replication, lifecycle policies, and performance patterns.",

  sections: [
    {
      heading: "Storage Classes",
      body: `S3 offers multiple storage classes optimized for different access patterns and cost profiles. **S3 Standard** is the default — high durability (11 nines), high availability (99.99%), and no retrieval fee. Use for frequently accessed data. **S3 Standard-IA** (Infrequent Access) costs less per GB stored but charges a retrieval fee per GB accessed — suitable for data accessed monthly. **S3 One Zone-IA** stores data in a single AZ at lower cost but with less availability.

**S3 Glacier Instant Retrieval** retrieves in milliseconds but costs less than Standard-IA — ideal for quarterly access patterns. **S3 Glacier Flexible Retrieval** retrieves in minutes to hours (Expedited: 1-5 min, Standard: 3-5 hrs, Bulk: 5-12 hrs) with the lowest storage cost of the Glacier tiers. **S3 Glacier Deep Archive** is the cheapest storage option — retrieval takes 12 to 48 hours. Use for compliance archives accessed once or twice a year. **S3 Intelligent-Tiering** automatically moves objects between tiers based on access patterns — no retrieval fees, small monitoring fee per object.`,
      quiz: [
        {
          question:
            "A company stores compliance data that must be kept for 7 years and is almost never accessed. Which storage class minimizes cost?",
          options: [
            "S3 Glacier Deep Archive",
            "S3 Glacier Flexible Retrieval",
            "S3 Standard-IA",
            "S3 Intelligent-Tiering",
          ],
          correctIndex: 0,
          explanation:
            "S3 Glacier Deep Archive has the lowest storage cost of any S3 class — ideal for long-term compliance archives that are rarely accessed. Retrieval takes 12-48 hours, which is acceptable for data accessed once or twice a year. Standard-IA and Intelligent-Tiering cost more per GB.",
        },
      ],
    },
    {
      heading: "S3 Security: Bucket Policies, ACLs, and Block Public Access",
      body: `S3 bucket security has multiple layers. **Bucket policies** are resource-based policies written in JSON that control access to the bucket and all objects in it — they can grant cross-account access without IAM role assumption. **Block Public Access** settings can be applied at the bucket or account level and prevent public access even if the bucket policy or ACL would allow it — this is the recommended safeguard against accidental public exposure.

**S3 ACLs** are a legacy access control mechanism at the object level — AWS recommends disabling ACLs and using bucket policies instead. **S3 Access Points** simplify managing access at scale by creating named network endpoints with their own access policies — useful when many teams share a bucket. **Object Ownership** controls whether the object uploader retains ownership or the bucket owner does. For shared buckets, setting bucket owner preferred ownership eliminates ACL management.`,
      quiz: [
        {
          question:
            "A developer accidentally made an S3 bucket public by creating an overly permissive bucket policy. The security team wants to prevent this from ever happening again across the entire account. What is the BEST solution?",
          options: [
            "Enable S3 Block Public Access at the account level",
            "Enable S3 versioning on all buckets",
            "Create an SCP that denies s3:PutBucketPolicy",
            "Enable AWS Config with an S3 public bucket rule",
          ],
          correctIndex: 0,
          explanation:
            "S3 Block Public Access at the account level is a hard guardrail that prevents any bucket in the account from being made public, regardless of bucket policy or ACL settings. SCPs can restrict policy changes but are more complex. AWS Config detects violations after the fact but doesn't prevent them.",
        },
      ],
    },
    {
      heading: "S3 Versioning and Replication",
      body: `**Versioning** keeps multiple versions of an object in the same bucket. When enabled, deletions create a delete marker rather than removing the object — enabling recovery. Once enabled, versioning cannot be disabled, only suspended. Versioning is required for **Cross-Region Replication (CRR)** and **Same-Region Replication (SRR)**.

**CRR** replicates objects to a bucket in a different region — use for compliance (geographic copies), latency reduction, or disaster recovery. **SRR** replicates to a bucket in the same region — use for log aggregation or maintaining a test copy of production data. Replication is asynchronous (not real-time) and only replicates new objects after replication is enabled; existing objects are not retroactively replicated. Delete markers are not replicated by default (you can opt in). You can use S3 Batch Replication to replicate existing objects.`,
      quiz: [
        {
          question:
            "A company enables S3 Cross-Region Replication on a bucket with 1 million existing objects. How are the existing objects handled?",
          options: [
            "Existing objects are NOT replicated automatically — use S3 Batch Replication",
            "All existing objects are replicated immediately when CRR is enabled",
            "Existing objects are replicated over the next 24 hours",
            "Only objects modified after CRR is enabled plus existing objects are replicated",
          ],
          correctIndex: 0,
          explanation:
            "CRR (and SRR) only replicates objects created or modified AFTER replication is enabled. Existing objects require a separate S3 Batch Replication job to copy them to the destination bucket. This is a common exam trap — enabling replication does not backfill existing data.",
        },
      ],
    },
    {
      heading: "S3 Lifecycle Policies",
      body: `**Lifecycle policies** automate the transition of objects between storage classes and their eventual deletion. Transitions move objects to cheaper storage tiers after specified days (e.g., move to Standard-IA after 30 days, then to Glacier after 90 days, delete after 2,555 days). Expiration actions delete objects (or specific versions) after a specified number of days.

Minimum storage durations exist and affect cost: Standard-IA and One Zone-IA have a 30-day minimum; Glacier Instant Retrieval has 90 days; Glacier Flexible Retrieval has 90 days; Glacier Deep Archive has 180 days. If you transition an object to Glacier Flexible Retrieval after 1 day, you still pay for 90 days. Always factor minimum storage durations into cost analysis questions.`,
      quiz: [
        {
          question:
            "A lifecycle policy moves objects to S3 Glacier Flexible Retrieval after 1 day. An object is deleted after 10 days. How many days of Glacier Flexible Retrieval storage are charged?",
          options: [
            "90 days (minimum storage duration)",
            "10 days (actual storage duration)",
            "9 days (Glacier duration)",
            "1 day (upload only)",
          ],
          correctIndex: 0,
          explanation:
            "S3 Glacier Flexible Retrieval has a 90-day minimum storage duration. Even if an object is deleted after 10 days in Glacier, you are charged for the full 90-day minimum. This is an important cost consideration when architecting lifecycle policies for short-lived objects.",
        },
      ],
    },
    {
      heading: "S3 Encryption",
      body: `S3 offers several encryption options. **SSE-S3** uses AWS-managed keys (AES-256) — AWS handles all key management. Enabled by default on all new buckets as of 2023. **SSE-KMS** uses KMS customer-managed keys — provides key rotation audit logs in CloudTrail and enables envelope encryption. The KMS key usage appears in CloudTrail, giving you visibility over who decrypted what. **SSE-C** (Customer-Provided Keys) — the client provides the encryption key on every request; AWS encrypts/decrypts but never stores the key.

**Client-side encryption** means the client encrypts data before uploading — AWS stores only the ciphertext and has no ability to decrypt. Use client-side encryption for maximum control. **Bucket default encryption** specifies the encryption applied to objects when no encryption is specified on the PUT request. **Bucket policies** can enforce encryption by denying PutObject requests that don't include the x-amz-server-side-encryption header.`,
      quiz: [
        {
          question:
            "A compliance requirement mandates that all S3 encryption key usage must be auditable in CloudTrail. Which encryption option satisfies this?",
          options: [
            "SSE-KMS with a customer-managed key",
            "SSE-S3",
            "SSE-C",
            "Client-side encryption with a local key",
          ],
          correctIndex: 0,
          explanation:
            "SSE-KMS records every key usage event (Decrypt, GenerateDataKey) in CloudTrail, providing a full audit trail. SSE-S3 uses AWS-managed keys with no visibility into individual key operations. SSE-C requires the client to supply the key but AWS doesn't log its usage in a way tied to a specific audit trail.",
        },
      ],
    },
    {
      heading: "S3 Performance and Transfer Acceleration",
      body: `S3 achieves high throughput by using multiple prefixes. S3 supports at least **3,500 PUT/COPY/POST/DELETE** and **5,500 GET/HEAD** requests per second per prefix. By spreading objects across many prefixes, you can scale reads and writes linearly. With 10 prefixes you get 55,000 GET requests per second. Avoid sequential prefixes (like dates) if all traffic is from the same client — instead use random prefixes.

**Multipart Upload** is recommended for objects over 100 MB and required for objects over 5 GB. It splits the object into parts uploaded in parallel, maximizing throughput and enabling retry of individual failed parts. **S3 Transfer Acceleration** routes uploads through CloudFront edge locations over the AWS backbone to accelerate uploads from distant geographic locations — ideal for users spread globally uploading to a single S3 bucket. Use **S3 Byte-Range Fetches** to parallelize downloads by requesting specific byte ranges simultaneously.`,
      quiz: [
        {
          question:
            "A media company uploads 10 GB video files from offices around the world to a single S3 bucket in us-east-1. Uploads are slow for offices in Asia and Europe. What is the MOST effective solution?",
          options: [
            "Enable S3 Transfer Acceleration",
            "Enable S3 Cross-Region Replication to regional buckets",
            "Use multipart upload",
            "Switch to S3 Intelligent-Tiering",
          ],
          correctIndex: 0,
          explanation:
            "S3 Transfer Acceleration uses CloudFront edge locations as upload entry points, routing data over the optimized AWS backbone to S3. This significantly reduces upload latency for geographically distant users. Multipart upload helps with large files but doesn't reduce latency from distance. CRR copies data after upload, not during.",
        },
      ],
    },
    {
      heading: "S3 Event Notifications and Static Website Hosting",
      body: `**S3 Event Notifications** trigger actions when objects are created, deleted, or restored. Destinations include SNS, SQS, Lambda, and EventBridge. EventBridge is the most flexible — it supports more event types, filtering, and multiple destinations simultaneously. Use EventBridge for complex event routing; use direct SQS/Lambda triggers for simple patterns.

**S3 Static Website Hosting** serves HTML, CSS, JS, and other static files directly from S3 over HTTP. The bucket must have versioning disabled or enabled, and public access must be granted via bucket policy. The website endpoint URL format is different from the REST API endpoint. Use CloudFront in front of an S3 static website to add HTTPS, custom domain, and caching — S3 website hosting alone only supports HTTP. Enable CORS on the bucket when browsers make cross-origin requests to S3.`,
      quiz: [
        {
          question:
            "A developer wants to trigger a Lambda function whenever a new image is uploaded to an S3 bucket and also send a notification to an SNS topic. Which approach supports both destinations from a single S3 event?",
          options: [
            "Use Amazon EventBridge with the S3 event notification source",
            "Configure two separate S3 event notifications — one to Lambda and one to SNS",
            "Chain Lambda to call SNS after processing the S3 event",
            "Use S3 Batch Operations to trigger downstream workflows",
          ],
          correctIndex: 0,
          explanation:
            "Amazon EventBridge supports S3 event notifications and can route a single event to multiple targets simultaneously (Lambda, SNS, SQS, Step Functions, etc.) with filtering. Direct S3 event notifications can also send to multiple targets, but EventBridge is more flexible and is the recommended approach for complex routing.",
        },
      ],
    },
  ],

  keyFacts: [
    "S3 durability: 99.999999999% (11 nines). S3 Standard availability: 99.99%",
    "Minimum storage durations: Standard-IA/One Zone-IA = 30 days; Glacier Flexible/Instant = 90 days; Deep Archive = 180 days",
    "Block Public Access overrides bucket policies and ACLs — apply at account level to prevent all public access",
    "Versioning cannot be disabled once enabled — only suspended",
    "CRR and SRR only replicate objects after replication is enabled — use Batch Replication for existing objects",
    "SSE-KMS records key usage in CloudTrail; SSE-S3 does not provide per-operation audit",
    "S3 Transfer Acceleration uses CloudFront edge locations for faster global uploads",
    "Multipart upload required for objects > 5 GB; recommended for > 100 MB",
    "5,500 GET/HEAD per second per prefix; 3,500 PUT/DELETE per second per prefix",
    "S3 static website hosting is HTTP only — add CloudFront for HTTPS",
    "Intelligent-Tiering: no retrieval fees, monitors access and moves objects automatically, per-object monitoring charge",
    "S3 Glacier Instant Retrieval: millisecond retrieval; Flexible: minutes-hours; Deep Archive: 12-48 hours",
    "S3 MFA Delete: requires MFA to permanently delete object versions or change versioning state — only the root account can enable it",
    "S3 Object Lock: Governance mode (users with special permissions can override); Compliance mode (no overrides — not even by root)",
  ],

  relatedServices: [
    "Amazon CloudFront",
    "AWS KMS",
    "AWS Lambda",
    "Amazon EventBridge",
    "AWS Glue",
    "Amazon Athena",
    "AWS DataSync",
  ],

  examTips: [
    "S3 Intelligent-Tiering is the right answer when access patterns are unknown or change over time",
    "When asked for 'lowest cost long-term archive', the answer is S3 Glacier Deep Archive",
    "Block Public Access at the account level is the guardrail that prevents accidental public bucket exposure",
    "For compliance audit of encryption key usage, SSE-KMS is required (not SSE-S3)",
    "CRR requires versioning enabled on both source and destination buckets",
    "S3 pre-signed URLs give time-limited access to private objects — no IAM credentials needed by the recipient",
    "S3 Select queries CSV/JSON data server-side using SQL — reduces data transfer vs. downloading entire object",
    "Requester Pays configuration shifts data transfer and request costs to the downloading account",
    "S3 Object Lock in Compliance mode cannot be overridden even by the root user — WORM compliance",
    "For global uploads to a single bucket, Transfer Acceleration beats CRR (which copies after upload)",
    "MFA Delete prevents accidental or malicious deletion of object versions — enable for compliance-sensitive versioned buckets",
  ],
};
