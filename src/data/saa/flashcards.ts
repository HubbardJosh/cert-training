import { FlashCard } from "../../types";

export const flashcards: FlashCard[] = [
  // ─── DOMAIN 1: DESIGN SECURE ARCHITECTURES ────────────────────────────────

  // IAM
  {
    id: "saa-fc-001",
    service: "AWS IAM",
    domain: "security",
    difficulty: "easy",
    question: "What is the difference between an IAM role and an IAM user?",
    answer:
      "An IAM user has permanent long-term credentials (password/access keys). An IAM role provides temporary credentials issued by STS when assumed — preferred for EC2, Lambda, and cross-account access.",
    keyPoints: [
      "Roles issue temporary credentials via STS AssumeRole",
      "Users have persistent credentials that must be rotated manually",
      "EC2 instance profiles are containers for IAM roles",
      "Roles can be assumed by services, users, or external accounts",
    ],
    tags: ["iam", "roles", "users", "security"],
  },
  {
    id: "saa-fc-002",
    service: "AWS IAM",
    domain: "security",
    difficulty: "medium",
    question: "What is the IAM policy evaluation order and what always wins?",
    answer:
      "AWS evaluates: 1) Explicit Deny (any policy) → DENY immediately. 2) Explicit Allow → GRANT. 3) No match → implicit DENY (default). An explicit Deny ALWAYS overrides any Allow.",
    keyPoints: [
      "Default is implicit Deny — all permissions must be explicitly granted",
      "Explicit Deny in any policy overrides all Allows",
      "SCPs from Organizations are evaluated before IAM policies",
      "Cross-account requires both identity policy AND resource policy (or role trust)",
    ],
    tags: ["iam", "policy", "evaluation", "deny"],
  },
  {
    id: "saa-fc-003",
    service: "AWS IAM",
    domain: "security",
    difficulty: "hard",
    question:
      "What is a permissions boundary and how does it interact with identity policies?",
    answer:
      "A permissions boundary sets the MAXIMUM permissions an identity-based policy can grant. The effective permission is the INTERSECTION (AND) of the identity policy and the boundary — the boundary cannot grant permissions itself.",
    keyPoints: [
      "Permissions boundary = ceiling, not a grant",
      "Effective permission = identity policy ∩ permissions boundary",
      "Used to delegate permission management safely (e.g., allow devs to create roles but not exceed their own permissions)",
      "SCPs work similarly at the account/OU level",
    ],
    tags: ["iam", "permissions-boundary", "delegation"],
  },
  {
    id: "saa-fc-004",
    service: "AWS IAM",
    domain: "security",
    difficulty: "medium",
    question:
      "Which STS API is used for OIDC federation (e.g., Google Sign-In, Cognito)?",
    answer:
      "AssumeRoleWithWebIdentity — the user authenticates with an OIDC provider, receives a JWT token, and exchanges it for temporary AWS credentials by calling STS.",
    keyPoints: [
      "Used by Cognito Identity Pools for mobile/web app access",
      "Used by Kubernetes IRSA (IAM Roles for Service Accounts)",
      "AssumeRole is for IAM principal→role. AssumeRoleWithSAML is for enterprise SSO",
      "Temporary credentials expire in 15 min to 36 hours",
    ],
    tags: ["iam", "sts", "federation", "oidc", "cognito"],
  },

  // VPC
  {
    id: "saa-fc-005",
    service: "Amazon VPC",
    domain: "security",
    difficulty: "easy",
    question: "What is the difference between a Security Group and a NACL?",
    answer:
      "Security Groups: stateful, instance-level, Allow rules only. NACLs: stateless, subnet-level, Allow AND Deny rules, evaluated in number order (lowest first).",
    keyPoints: [
      "Stateful = return traffic is automatically allowed",
      "Stateless = must write rules for both inbound and outbound",
      "Security groups cannot explicitly deny an IP — NACLs can",
      "Default NACL: allows all. Custom NACL: denies all by default",
    ],
    tags: ["vpc", "security-group", "nacl", "stateful", "stateless"],
  },
  {
    id: "saa-fc-006",
    service: "Amazon VPC",
    domain: "security",
    difficulty: "medium",
    question: "How many IP addresses are reserved in every VPC subnet?",
    answer:
      "AWS reserves 5 IP addresses per subnet: .0 (network), .1 (VPC router), .2 (DNS), .3 (future use), .255 (broadcast). A /28 = 16 total − 5 reserved = 11 usable.",
    keyPoints: [
      "Always subtract 5 from subnet size to find usable IPs",
      "/28 is the smallest allowed subnet in a VPC (11 usable)",
      ".1 is always the default gateway (VPC router)",
      ".2 is always the DNS resolver (Route 53 Resolver)",
    ],
    tags: ["vpc", "subnets", "cidr", "ip-addressing"],
  },
  {
    id: "saa-fc-007",
    service: "Amazon VPC",
    domain: "security",
    difficulty: "medium",
    question: "What is VPC peering and what is its key limitation?",
    answer:
      "VPC peering creates a private connection between two VPCs. Key limitation: it is NON-TRANSITIVE — VPC A peered with B and B peered with C does not let A reach C. Use Transit Gateway for transitive routing.",
    keyPoints: [
      "Peering works across accounts and regions",
      "CIDRs cannot overlap between peered VPCs",
      "Both route tables and security groups must be updated",
      "TGW is the hub-and-spoke alternative that supports transitive routing",
    ],
    tags: ["vpc", "peering", "transit-gateway", "transitive"],
  },
  {
    id: "saa-fc-008",
    service: "Amazon VPC",
    domain: "security",
    difficulty: "hard",
    question: "What are the two VPC endpoint types and when do you use each?",
    answer:
      "Gateway endpoints (S3 and DynamoDB only): free, route-table based, no ENI. Interface endpoints (PrivateLink): hourly fee + data charges, create an ENI in your subnet, support most AWS services and third-party services.",
    keyPoints: [
      "Gateway endpoints: S3 and DynamoDB — always use these (free)",
      "Interface endpoints: KMS, SSM, SQS, Secrets Manager, etc.",
      "Interface endpoints support on-premises access via Direct Connect/VPN",
      "Gateway endpoints only work within the same region",
    ],
    tags: ["vpc", "endpoints", "privatelink", "s3", "dynamodb"],
  },

  // EC2
  {
    id: "saa-fc-009",
    service: "Amazon EC2",
    domain: "fundamentals",
    difficulty: "easy",
    question: "Compare EC2 purchasing options from cheapest to most expensive.",
    answer:
      "Spot (up to 90% off, interruptible) < Reserved/Savings Plans (up to 72% off, commitment) < On-Demand (no commitment) < Dedicated Host (physical server, BYOL). On-Demand is the baseline rate.",
    keyPoints: [
      "Spot: up to 90% savings, 2-min termination notice",
      "Standard RI: up to 72%, locked family/region",
      "Convertible RI: up to 54%, can change attributes",
      "Compute Savings Plans: up to 66%, broadest flexibility (EC2+Fargate+Lambda)",
    ],
    tags: ["ec2", "pricing", "reserved", "spot", "savings-plans"],
  },
  {
    id: "saa-fc-010",
    service: "Amazon EC2",
    domain: "fundamentals",
    difficulty: "medium",
    question:
      "What are the three EC2 placement group types and their use cases?",
    answer:
      "Cluster: same rack, ultra-low latency HPC (single AZ, risk of correlated failure). Spread: each instance on distinct hardware, max 7/AZ (critical instances needing HA). Partition: rack-level isolation for large distributed DBs like Cassandra/Hadoop.",
    keyPoints: [
      "Cluster: best performance, worst fault tolerance",
      "Spread: best fault tolerance, max 7 instances/AZ",
      "Partition: rack-level failure domains, up to 7 partitions/AZ",
      "Partition is purpose-built for HDFS, HBase, Cassandra",
    ],
    tags: ["ec2", "placement-groups", "ha", "hpc"],
  },
  {
    id: "saa-fc-011",
    service: "Amazon EBS",
    domain: "fundamentals",
    difficulty: "medium",
    question: "What are the EBS volume types and their IOPS limits?",
    answer:
      "gp3: up to 16,000 IOPS (general purpose SSD). io2 Block Express: up to 256,000 IOPS (critical databases). st1: HDD, up to 500 MB/s throughput (sequential reads). sc1: coldest HDD, lowest cost (archival).",
    keyPoints: [
      "gp3: baseline 3,000 IOPS, can provision up to 16,000 independently of size",
      "io2 Block Express: highest durability (99.999%), multi-attach capable",
      "st1/sc1 cannot be boot volumes",
      "Instance store: highest IOPS, ephemeral (lost on stop/terminate)",
    ],
    tags: ["ebs", "iops", "storage", "gp3", "io2"],
  },

  // S3
  {
    id: "saa-fc-012",
    service: "Amazon S3",
    domain: "fundamentals",
    difficulty: "easy",
    question: "What are the S3 storage class minimum storage durations?",
    answer:
      "Standard: none. Standard-IA: 30 days. One Zone-IA: 30 days. Glacier Instant Retrieval: 90 days. Glacier Flexible Retrieval: 90 days. Glacier Deep Archive: 180 days.",
    keyPoints: [
      "If an object is deleted before the minimum duration, you pay for the full minimum",
      "Intelligent-Tiering has no retrieval fee but has per-object monitoring charge",
      "Deep Archive: cheapest storage, 12-48 hour retrieval",
      "Glacier Instant Retrieval: ms retrieval, quarterly access pattern",
    ],
    tags: ["s3", "storage-classes", "glacier", "cost"],
  },
  {
    id: "saa-fc-013",
    service: "Amazon S3",
    domain: "security",
    difficulty: "medium",
    question: "What is S3 Block Public Access and why is it important?",
    answer:
      "Block Public Access is a hard guardrail that prevents S3 buckets from being made publicly accessible, even if a bucket policy or ACL would allow it. Apply at the account level to protect all buckets org-wide.",
    keyPoints: [
      "Overrides permissive bucket policies and ACLs",
      "Apply at account level to prevent accidental public exposure",
      "Four settings: BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, RestrictPublicBuckets",
      "S3 Object Lock (Compliance mode): WORM, cannot be overridden even by root",
    ],
    tags: ["s3", "security", "public-access", "bucket-policy"],
  },
  {
    id: "saa-fc-014",
    service: "Amazon S3",
    domain: "fundamentals",
    difficulty: "hard",
    question: "What is S3 CRR and what are its prerequisites and limitations?",
    answer:
      "Cross-Region Replication asynchronously copies objects to a bucket in a different region. Prerequisites: versioning enabled on both source and destination. Limitation: only replicates NEW objects after enabling — use Batch Replication for existing objects.",
    keyPoints: [
      "Replication is asynchronous (near real-time, not instantaneous)",
      "Delete markers not replicated by default (opt-in setting)",
      "Requires IAM role with permission to replicate",
      "SRR = same-region replication (log aggregation, test environment copy)",
    ],
    tags: ["s3", "replication", "crr", "versioning"],
  },
  {
    id: "saa-fc-015",
    service: "Amazon S3",
    domain: "security",
    difficulty: "medium",
    question: "Compare SSE-S3, SSE-KMS, and SSE-C encryption options.",
    answer:
      "SSE-S3: AWS manages keys (AES-256), no CloudTrail visibility, default on new buckets. SSE-KMS: KMS CMK, every key usage logged in CloudTrail, audit trail. SSE-C: client provides key on every request, AWS encrypts but never stores the key.",
    keyPoints: [
      "SSE-KMS: compliance audit of who decrypted what",
      "SSE-C: client key management, HTTPS required",
      "Client-side encryption: AWS stores only ciphertext, cannot decrypt",
      "Enforce SSE-KMS via bucket policy: deny PutObject without x-amz-server-side-encryption: aws:kms",
    ],
    tags: ["s3", "encryption", "kms", "sse"],
  },

  // RDS & Aurora
  {
    id: "saa-fc-016",
    service: "Amazon RDS",
    domain: "fundamentals",
    difficulty: "easy",
    question: "What is the difference between RDS Multi-AZ and Read Replicas?",
    answer:
      "Multi-AZ: synchronous standby in another AZ for HA and automatic failover (NOT readable). Read Replicas: asynchronous copies for read scaling (readable). Multi-AZ = availability. Read Replicas = performance.",
    keyPoints: [
      "Multi-AZ failover: 60-120 seconds via DNS CNAME flip",
      "Up to 5 read replicas for RDS, 15 for Aurora",
      "Read replicas can be cross-region (DR strategy)",
      "Read replicas can be promoted to standalone (breaks replication)",
    ],
    tags: ["rds", "multi-az", "read-replica", "ha"],
  },
  {
    id: "saa-fc-017",
    service: "Amazon Aurora",
    domain: "fundamentals",
    difficulty: "medium",
    question:
      "What makes Aurora's storage architecture different from standard RDS?",
    answer:
      "Aurora uses a shared distributed SSD storage layer with 6 copies across 3 AZs (automatically). Storage auto-scales to 128 TB. Aurora replicas all share this storage, so failover (~30s) is faster than RDS Multi-AZ (~2 min) because no data copy is needed.",
    keyPoints: [
      "6 copies = can tolerate 2 copy loss for writes, 3 for reads",
      "Aurora storage auto-scales — no manual resize",
      "Aurora Global Database: cross-region, sub-second lag, < 1 min failover",
      "Aurora Serverless v2: fine-grained auto-scaling (Aurora Capacity Units)",
    ],
    tags: ["aurora", "storage", "ha", "failover"],
  },
  {
    id: "saa-fc-018",
    service: "Amazon RDS",
    domain: "fundamentals",
    difficulty: "medium",
    question: "What does RDS PITR do and what is its key behavior?",
    answer:
      "Point-in-Time Recovery restores the database to any second within the automated backup retention window (1-35 days). IMPORTANT: PITR creates a NEW RDS instance — it does NOT overwrite the current database.",
    keyPoints: [
      "PITR requires automated backups to be enabled",
      "Retention period: 1-35 days (default 7 days)",
      "Manual snapshots persist until you delete them (no expiry)",
      "PITR protects against accidental deletes/corruption — Multi-AZ does not",
    ],
    tags: ["rds", "pitr", "backup", "recovery"],
  },
  {
    id: "saa-fc-019",
    service: "Amazon RDS",
    domain: "applications",
    difficulty: "hard",
    question: "Why is RDS Proxy important for Lambda-to-RDS architectures?",
    answer:
      "Lambda creates a new execution environment (and database connection) per concurrent invocation, quickly exhausting RDS connection limits. RDS Proxy pools and reuses connections, multiplexing thousands of Lambda invocations into a small number of DB connections.",
    keyPoints: [
      "Lambda concurrency ≠ connections needed if RDS Proxy pools them",
      "RDS Proxy stores credentials in Secrets Manager",
      "Proxy reduces failover impact by maintaining connection pool during Multi-AZ failover",
      "RDS Proxy is deployed in the same VPC as RDS, not publicly accessible",
    ],
    tags: ["rds", "proxy", "lambda", "connections"],
  },

  // ELB
  {
    id: "saa-fc-020",
    service: "Elastic Load Balancing",
    domain: "fundamentals",
    difficulty: "easy",
    question: "When should you use ALB vs. NLB?",
    answer:
      "ALB: Layer 7, HTTP/HTTPS, path/host/header routing, WebSocket, WAF integration. NLB: Layer 4, TCP/UDP, ultra-low latency (~100ms), static IPs, source IP preservation, extreme throughput.",
    keyPoints: [
      "ALB replaces client source IP with its own — use X-Forwarded-For to get original IP",
      "NLB preserves source IP natively",
      "ALB supports Lambda targets; NLB does not",
      "GLB: Layer 3, transparent inline appliance routing (firewalls, IDS)",
    ],
    tags: ["elb", "alb", "nlb", "layer7", "layer4"],
  },

  // CloudFront
  {
    id: "saa-fc-021",
    service: "Amazon CloudFront",
    domain: "fundamentals",
    difficulty: "medium",
    question: "What is Origin Access Control (OAC) and why use it?",
    answer:
      "OAC restricts S3 bucket access exclusively to a CloudFront distribution. The bucket policy allows only the OAC principal — users cannot access S3 directly. OAC uses SigV4 signing and supports SSE-KMS encrypted objects (OAI did not).",
    keyPoints: [
      "OAC is the modern replacement for OAI (Origin Access Identity)",
      "Enables HTTPS-only serving from S3 through CloudFront",
      "Prevents direct S3 URL access even for unauthenticated users",
      "ACM certificate for CloudFront MUST be in us-east-1",
    ],
    tags: ["cloudfront", "s3", "oac", "security"],
  },
  {
    id: "saa-fc-022",
    service: "Amazon CloudFront",
    domain: "fundamentals",
    difficulty: "medium",
    question:
      "What is the difference between CloudFront signed URLs and signed cookies?",
    answer:
      "Signed URLs: time-limited access to a single specific file. Signed cookies: time-limited access to multiple files without changing URLs. Use signed cookies for video streaming (many HLS segments); use signed URLs for individual file downloads.",
    keyPoints: [
      "Both use CloudFront key groups (recommended) or legacy CloudFront key pairs",
      "Both include an expiration time and cryptographic signature",
      "Tampered or expired URLs/cookies return 403",
      "Signed cookies work transparently with the same CDN URLs",
    ],
    tags: ["cloudfront", "signed-url", "signed-cookie", "security"],
  },

  // Route 53
  {
    id: "saa-fc-023",
    service: "Amazon Route 53",
    domain: "fundamentals",
    difficulty: "easy",
    question:
      "Why can't you use a CNAME at the zone apex and what is the solution?",
    answer:
      "DNS specification prohibits CNAMEs at the zone apex (root domain like example.com). Route 53 Alias records solve this — they work at the apex, are free to query, and auto-track the IP of AWS resources (ALB, CloudFront, S3 website, etc.).",
    keyPoints: [
      "Alias records can only point to specific AWS resource types",
      "Alias records have no TTL — not cached like CNAMEs",
      "CNAME can be used for subdomains (api.example.com) but not the apex",
      "Alias records to AWS resources: no extra DNS lookup charge",
    ],
    tags: ["route53", "alias", "cname", "dns", "apex"],
  },
  {
    id: "saa-fc-024",
    service: "Amazon Route 53",
    domain: "fundamentals",
    difficulty: "medium",
    question: "What are the six Route 53 routing policies and their use cases?",
    answer:
      "Simple: one resource. Weighted: % split (A/B testing). Latency: lowest network latency region. Geolocation: by country/continent. Failover: primary/secondary with health checks. Multi-value: up to 8 healthy records returned.",
    keyPoints: [
      "Latency ≠ geolocation — latency is network performance, not physical location",
      "Failover requires health checks on the primary record",
      "Multi-value is NOT a load balancer — it returns multiple IPs for client-side selection",
      "Geoproximity routing requires Traffic Flow feature (additional cost)",
    ],
    tags: ["route53", "routing", "latency", "failover", "weighted"],
  },

  // SQS/SNS
  {
    id: "saa-fc-025",
    service: "Amazon SQS",
    domain: "applications",
    difficulty: "medium",
    question:
      "What is the SQS visibility timeout and what happens if it's too short?",
    answer:
      "Visibility timeout is how long a message is invisible after a consumer receives it. If too short (less than processing time), the message reappears and is processed again (duplicate). Set to at least 6× the consumer's processing time.",
    keyPoints: [
      "Default: 30 seconds. Max: 12 hours",
      "Consumer can call ChangeMessageVisibility to extend timeout mid-processing",
      "DLQ captures messages that exceed maxReceiveCount attempts",
      "FIFO queues prevent duplicates via deduplication ID (5-min window)",
    ],
    tags: ["sqs", "visibility-timeout", "duplicate", "dlq"],
  },
  {
    id: "saa-fc-026",
    service: "Amazon SNS",
    domain: "applications",
    difficulty: "easy",
    question: "What is the SNS fan-out pattern and when is it used?",
    answer:
      "Fan-out: one SNS topic publishes to multiple SQS queues simultaneously. Each queue has its own consumer processing at its own rate. Use when one event must trigger multiple independent downstream services.",
    keyPoints: [
      "SNS does not persist messages — use SQS between SNS and consumers for reliability",
      "SNS subscription filter policies: deliver only matching messages to each subscriber",
      "SNS FIFO topics → SQS FIFO queues: ordered fan-out",
      "SNS can send to: SQS, Lambda, HTTP/HTTPS, Email, SMS, mobile push",
    ],
    tags: ["sns", "fan-out", "sqs", "decoupling"],
  },

  // Lambda
  {
    id: "saa-fc-027",
    service: "AWS Lambda",
    domain: "applications",
    difficulty: "medium",
    question:
      "What is the difference between Reserved and Provisioned Concurrency?",
    answer:
      "Reserved Concurrency: sets the MAX concurrent executions for a function (throttles beyond this limit; also guarantees capacity). Provisioned Concurrency: pre-initializes execution environments to eliminate cold starts (no waiting for init code).",
    keyPoints: [
      "Reserved = 0 disables the function entirely",
      "Provisioned = warm environments ready to respond in milliseconds",
      "Provisioned Concurrency incurs extra cost (per GB-second for pre-initialized envs)",
      "Use Provisioned for latency-sensitive APIs; Reserved for rate limiting",
    ],
    tags: ["lambda", "concurrency", "cold-start", "provisioned"],
  },
  {
    id: "saa-fc-028",
    service: "AWS Lambda",
    domain: "applications",
    difficulty: "hard",
    question:
      "A Lambda function in a VPC needs to call DynamoDB. What is needed?",
    answer:
      "A Gateway VPC Endpoint for DynamoDB (free). Without it, VPC Lambda loses internet access and must go through NAT Gateway ($0.045/GB) to reach DynamoDB. Gateway endpoints route to DynamoDB via AWS backbone at no charge.",
    keyPoints: [
      "VPC Lambda has no internet access by default — NAT Gateway required for internet",
      "Gateway endpoints: S3 and DynamoDB only, free, route-table based",
      "Interface endpoints: all other AWS services, hourly fee",
      "RDS in VPC: Lambda needs VPC config + RDS Proxy for connection pooling",
    ],
    tags: ["lambda", "vpc", "dynamodb", "endpoints", "nat"],
  },

  // CloudFormation
  {
    id: "saa-fc-029",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "medium",
    question: "What is a CloudFormation StackSet and when is it used?",
    answer:
      "StackSets deploy a single CloudFormation template to multiple accounts and/or regions simultaneously from one management account. Use for org-wide deployments: Config rules, IAM roles, VPC configurations across all accounts.",
    keyPoints: [
      "Requires AWS Organizations integration or self-managed cross-account roles",
      "New accounts added to an OU can auto-receive the stack",
      "Drift detection works on StackSets",
      "Use Change Sets before updating production stacks",
    ],
    tags: ["cloudformation", "stacksets", "organizations", "multi-account"],
  },

  // DynamoDB
  {
    id: "saa-fc-030",
    service: "Amazon DynamoDB",
    domain: "fundamentals",
    difficulty: "medium",
    question: "What is the difference between a GSI and an LSI in DynamoDB?",
    answer:
      "LSI: same partition key, different sort key, must be created at table creation, max 5, shares table throughput, supports strongly consistent reads. GSI: any PK/SK, created anytime, max 20, own throughput, eventually consistent only.",
    keyPoints: [
      "LSI cannot be added after table creation — plan access patterns upfront",
      "GSI can be added/deleted at any time",
      "GSI only supports eventually consistent reads",
      "Use GSI to support alternate query patterns (e.g., query by email when PK is userId)",
    ],
    tags: ["dynamodb", "gsi", "lsi", "indexes"],
  },
  {
    id: "saa-fc-031",
    service: "Amazon DynamoDB",
    domain: "fundamentals",
    difficulty: "easy",
    question: "What is DynamoDB TTL and what is its cost?",
    answer:
      "TTL automatically deletes items based on a timestamp attribute. Deletions are FREE — no WCU consumed. Items may persist up to 48 hours after expiry before physical deletion. Use for session tokens, temporary data, and time-bounded events.",
    keyPoints: [
      "TTL deletions do not consume WCU",
      "Expired items may still be returned in queries — use FilterExpression to exclude them",
      "Items deleted by TTL appear in DynamoDB Streams (if enabled)",
      "TTL attribute must be a Number type (Unix epoch seconds)",
    ],
    tags: ["dynamodb", "ttl", "cost", "expiry"],
  },
  {
    id: "saa-fc-032",
    service: "Amazon DynamoDB",
    domain: "fundamentals",
    difficulty: "medium",
    question: "What is DAX and when should you use it vs. ElastiCache?",
    answer:
      "DAX (DynamoDB Accelerator) is an API-compatible in-memory cache for DynamoDB — microsecond reads with no code changes. Use DAX for DynamoDB read offloading. Use ElastiCache for RDS read offloading or when you need Redis data structures (sorted sets, pub/sub).",
    keyPoints: [
      "DAX: compatible with DynamoDB API, microsecond latency",
      "DAX does NOT help strongly consistent reads (bypasses cache)",
      "ElastiCache Redis: persistence, replication, pub/sub, sorted sets",
      "ElastiCache Memcached: simple caching, no persistence, multi-threaded",
    ],
    tags: ["dynamodb", "dax", "elasticache", "caching"],
  },

  // Monitoring
  {
    id: "saa-fc-033",
    service: "Amazon CloudWatch",
    domain: "deployment",
    difficulty: "easy",
    question: "Which metrics does EC2 NOT report to CloudWatch by default?",
    answer:
      "Memory utilization, disk space usage, and process-level metrics are NOT reported by default — these require the CloudWatch Agent installed on the instance. EC2 only reports hypervisor-level metrics: CPU, network I/O, disk I/O (for instance store).",
    keyPoints: [
      "CloudWatch Agent: publishes memory, disk, process metrics as custom metrics",
      "Detailed monitoring: 1-minute intervals (vs 5-min basic) — additional cost",
      "High-resolution custom metrics: 1-second granularity",
      "Metric Filters: extract patterns from logs and publish as metrics",
    ],
    tags: ["cloudwatch", "ec2", "metrics", "cloudwatch-agent"],
  },
  {
    id: "saa-fc-034",
    service: "AWS CloudTrail",
    domain: "security",
    difficulty: "easy",
    question: "What does CloudTrail record and what does it NOT record?",
    answer:
      "CloudTrail records: every AWS API call (who, when, from where, what resource, success/fail). Management events: free 90-day retention. Data events (S3 object ops, Lambda invocations, DynamoDB item ops): NOT enabled by default, additional cost.",
    keyPoints: [
      "CloudTrail is NOT real-time — there's typically a 15-minute delay to S3",
      "Integrity validation: detect log tampering with hash chains",
      "Organizational trail: covers all accounts in an AWS Organization",
      "CloudTrail Insights: detects unusual API call volume patterns",
    ],
    tags: ["cloudtrail", "audit", "api", "compliance"],
  },

  // Security
  {
    id: "saa-fc-035",
    service: "Security Services",
    domain: "security",
    difficulty: "medium",
    question: "Compare AWS Shield Standard vs. Shield Advanced.",
    answer:
      "Shield Standard: free, automatic for all AWS customers, protects against common Layer 3/4 DDoS. Shield Advanced: $3,000/month minimum, enhanced protection for EC2/ELB/CloudFront/Route 53, 24/7 DRT access, cost protection during attacks.",
    keyPoints: [
      "Shield Advanced includes automatic WAF rule creation during attacks",
      "Cost protection: AWS credits attack-related scaling costs",
      "DRT (DDoS Response Team): 24/7 expert assistance for Shield Advanced customers",
      "Firewall Manager: manage WAF + Shield Advanced across multiple accounts centrally",
    ],
    tags: ["shield", "ddos", "waf", "security"],
  },
  {
    id: "saa-fc-036",
    service: "Security Services",
    domain: "security",
    difficulty: "medium",
    question:
      "What data sources does GuardDuty analyze and does it require agents?",
    answer:
      "GuardDuty analyzes CloudTrail logs, VPC Flow Logs, DNS query logs, S3 access logs, EKS audit logs, and Lambda network activity. NO agents or infrastructure changes required — enable with one click.",
    keyPoints: [
      "GuardDuty detects: malicious IPs, credential exfiltration, crypto mining, S3 exfiltration",
      "Findings → EventBridge → Lambda for automated remediation",
      "30-day free trial available",
      "Delegated admin account for org-wide centralized findings",
    ],
    tags: ["guardduty", "threat-detection", "security"],
  },
  {
    id: "saa-fc-037",
    service: "Security Services",
    domain: "security",
    difficulty: "hard",
    question:
      "What is the difference between KMS customer managed keys and CloudHSM?",
    answer:
      "KMS CMK: multi-tenant, FIPS 140-2 Level 2, AWS manages hardware but you control key policy. CloudHSM: dedicated single-tenant hardware, FIPS 140-2 Level 3, you manage keys completely (AWS cannot access them).",
    keyPoints: [
      "CloudHSM required when regulations mandate exclusive key control or FIPS 140-2 Level 3",
      "CloudHSM cluster: multiple HSMs across AZs for HA",
      "KMS is cheaper and simpler; CloudHSM for compliance requirements",
      "Both can be used with envelope encryption",
    ],
    tags: ["kms", "cloudhsm", "encryption", "compliance", "fips"],
  },

  // DR
  {
    id: "saa-fc-038",
    service: "High Availability & DR",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What are RPO and RTO and what DR strategies provide the lowest values?",
    answer:
      "RPO = maximum acceptable data loss (time). RTO = maximum acceptable downtime. Lowest RPO/RTO: Active-Active (near zero both). Then Warm Standby (minutes), Pilot Light (minutes/hours), Backup & Restore (hours/days).",
    keyPoints: [
      "Lower RPO/RTO = higher cost (more always-on infrastructure)",
      "Active-Active: full capacity in multiple regions, near-zero both",
      "Pilot Light: data only (DB replication), compute off",
      "Warm Standby: scaled-down full environment",
    ],
    tags: ["dr", "rpo", "rto", "ha", "failover"],
  },

  // Cost
  {
    id: "saa-fc-039",
    service: "Cost Optimization",
    domain: "deployment",
    difficulty: "medium",
    question:
      "How does a Gateway VPC Endpoint reduce costs for S3 access from a VPC?",
    answer:
      "NAT Gateway charges $0.045/GB for data processing. A Gateway VPC Endpoint for S3 routes traffic via the AWS backbone at zero cost (no per-GB charge, no hourly fee). For high-volume S3 traffic from VPC instances, this can save significantly.",
    keyPoints: [
      "Gateway endpoints: S3 and DynamoDB only — always free",
      "NAT Gateway = $0.045/GB processing + $0.045/GB data transfer out",
      "VPC endpoint routes S3 traffic to AWS backbone, not internet",
      "Interface endpoints have hourly + per-GB charges (but cheaper than NAT for high volume)",
    ],
    tags: ["cost", "vpc", "nat", "s3", "endpoints"],
  },
  {
    id: "saa-fc-040",
    service: "Cost Optimization",
    domain: "deployment",
    difficulty: "easy",
    question:
      "Which AWS tool sends alerts when forecasted spend will exceed a budget threshold?",
    answer:
      "AWS Budgets — supports alerts on actual OR forecasted cost/usage exceeding thresholds. CloudWatch billing alarms only alert on actual (not forecasted) spend. Budgets can trigger SNS notifications or Lambda-based remediation.",
    keyPoints: [
      "Budgets supports cost, usage, RI/Savings Plan utilization, and coverage budgets",
      "Cost Explorer: visualization and forecasting (no alerting)",
      "CUR: most detailed billing data, delivered to S3 hourly",
      "Trusted Advisor cost checks: require Business/Enterprise support for full access",
    ],
    tags: ["cost", "budgets", "billing", "cloudwatch"],
  },

  // Kinesis
  {
    id: "saa-fc-041",
    service: "Amazon Kinesis",
    domain: "applications",
    difficulty: "medium",
    question:
      "What is the key difference between Kinesis Data Streams and Kinesis Data Firehose?",
    answer:
      "KDS: real-time (ms latency), records persist 24h-365d, multiple consumers, custom processing needed. KDF: near-real-time (seconds buffering), delivers directly to S3/Redshift/OpenSearch, no consumer code needed, supports Lambda transformation.",
    keyPoints: [
      "KDS: replay capability, custom consumers, ordering per shard",
      "KDF: managed delivery, format conversion (JSON→Parquet), no shard management",
      "KDS can feed KDF as a consumer — dual-path architecture",
      "SQS: at-least-once, messages deleted after consumption, task queue pattern",
    ],
    tags: ["kinesis", "kds", "kdf", "streaming", "real-time"],
  },

  // Storage
  {
    id: "saa-fc-042",
    service: "Storage: EFS, FSx & Storage Gateway",
    domain: "fundamentals",
    difficulty: "easy",
    question: "When should you use EFS vs. EBS vs. S3?",
    answer:
      "EFS: shared NFS for multiple Linux EC2 instances across AZs (auto-scales). EBS: single-instance persistent block storage (manual size). S3: object storage for unstructured data, backups, static website, data lake (unlimited, cheap).",
    keyPoints: [
      "EFS: NFS protocol, Linux only, cross-AZ access, pay for storage used",
      "EBS: attached to ONE instance (except io2 Multi-Attach), must pre-provision size",
      "S3: not mountable as block/file system natively, eventual consistency (strong on new writes)",
      "FSx for Windows: SMB protocol, AD integration",
    ],
    tags: ["efs", "ebs", "s3", "storage", "comparison"],
  },
  {
    id: "saa-fc-043",
    service: "Storage: EFS, FSx & Storage Gateway",
    domain: "fundamentals",
    difficulty: "medium",
    question: "What are the three Storage Gateway types and their use cases?",
    answer:
      "S3 File Gateway: NFS/SMB files stored as S3 objects. Tape Gateway: iSCSI VTL storing virtual tapes in S3/Glacier (replace physical tapes). Volume Gateway: iSCSI block storage — Stored (local primary + S3 backup) or Cached (S3 primary + local cache).",
    keyPoints: [
      "File Gateway: on-premises apps transparently use S3 as a file share",
      "Tape Gateway: existing backup software uses VTL without code changes",
      "Volume Gateway Cached: most data in S3, frequently accessed data cached locally",
      "DataSync: online migration service (not persistent hybrid connectivity)",
    ],
    tags: ["storage-gateway", "s3", "tape", "hybrid"],
  },
];
