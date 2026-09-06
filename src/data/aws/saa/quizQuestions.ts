import { QuizQuestion } from "../../../types";

export const quizQuestions: QuizQuestion[] = [
  // ─── DOMAIN 1: DESIGN SECURE ARCHITECTURES (30%) ───────────────────────────

  {
    id: "saa-qq-001",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS IAM",
    question:
      "A company wants to allow developers to create IAM roles but prevent them from creating roles with more permissions than the developers themselves have. Which IAM feature enforces this?",
    options: [
      "Permissions boundaries on roles created by developers",
      "Service Control Policies applied to the developers' OU",
      "IAM Access Analyzer monitoring for overly permissive roles",
      "Resource-based policies on the IAM service",
    ],
    correctIndices: [0],
    explanation:
      "Permissions boundaries set the maximum permissions a role can have. If developers must attach a permissions boundary when creating roles, the new role cannot have more permissions than what the boundary allows — even if the role's identity policy requests broader access. SCPs apply to accounts/OUs, not individual role creation. Access Analyzer detects issues after the fact but doesn't prevent creation.",
    tags: ["iam", "permissions-boundary", "delegation"],
  },
  {
    id: "saa-qq-002",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS IAM",
    question:
      "An EC2 instance in Account A needs to access an S3 bucket in Account B. The S3 bucket has a resource policy that allows the EC2 instance role from Account A. Account A's IAM policy for the EC2 role allows s3:GetObject. Is access granted?",
    options: [
      "Yes — the resource policy in Account B plus the IAM policy in Account A together grant access",
      "No — the EC2 role must explicitly assume a role in Account B to access cross-account resources",
      "No — S3 bucket policies cannot grant cross-account access to EC2 roles",
      "Yes — but only if the bucket is in the same region as the EC2 instance",
    ],
    correctIndices: [0],
    explanation:
      "For cross-account access to S3, AWS requires both the resource-based policy (bucket policy in Account B) to allow the principal from Account A AND Account A's identity policy to allow the action. When both exist, access is granted without requiring role assumption. This is unique to S3 — most other cross-account access requires role assumption.",
    tags: ["iam", "cross-account", "s3", "resource-policy"],
  },
  {
    id: "saa-qq-003",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "Amazon VPC",
    question:
      "A security team needs to block all traffic from IP address 203.0.113.5 to any resource in a specific subnet. Which approach is correct?",
    options: [
      "Add a NACL Deny rule for 203.0.113.5/32 with a lower rule number than the Allow rules",
      "Add a Security Group rule denying traffic from 203.0.113.5",
      "Create a blackhole route in the route table for 203.0.113.5/32",
      "Use AWS WAF to block the IP address at the subnet level",
    ],
    correctIndices: [0],
    explanation:
      "NACLs support Deny rules and apply at the subnet level. Placing the Deny rule with a lower number ensures it's evaluated before any Allow rules (NACLs evaluate in ascending number order, stop at first match). Security groups don't support Deny rules. Route table blackholes don't filter inbound traffic. WAF only works with ALB/CloudFront/API Gateway, not at the subnet level.",
    tags: ["vpc", "nacl", "security-group", "deny"],
  },
  {
    id: "saa-qq-004",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "Amazon VPC",
    question:
      "A company has a private EC2 instance that needs to download OS patches from the internet without being directly reachable from the internet. What is required?",
    options: [
      "A NAT Gateway in a public subnet with a route from the private subnet to the NAT Gateway",
      "An Internet Gateway attached to the private subnet",
      "An Elastic IP address attached to the private instance",
      "A VPN connection to the internet provider",
    ],
    correctIndices: [0],
    explanation:
      "NAT Gateway allows private subnet instances to initiate outbound internet connections while blocking unsolicited inbound connections. It must be placed in a public subnet (one with an IGW route). The private subnet's route table adds a 0.0.0.0/0 route pointing to the NAT Gateway. The instance never gets a public IP, so it's not directly reachable from the internet.",
    tags: ["vpc", "nat", "private-subnet", "internet"],
  },
  {
    id: "saa-qq-005",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "Amazon S3",
    question:
      "A company requires that S3 objects can only be uploaded if they are encrypted with SSE-KMS using a specific KMS key. How is this enforced?",
    options: [
      "S3 bucket policy with a Deny condition requiring x-amz-server-side-encryption: aws:kms and the specific key ARN",
      "S3 default encryption setting specifying the KMS key",
      "KMS key policy restricting which S3 buckets can use the key",
      "AWS Config rule triggering encryption when unencrypted objects are detected",
    ],
    correctIndices: [0],
    explanation:
      "A bucket policy Deny with conditions on the encryption headers is the only way to enforce that every PutObject uses a specific KMS key. Default encryption applies SSE-KMS when no encryption is specified on upload, but it doesn't prevent uploads with a different encryption type or key. AWS Config detects non-compliance after the fact but doesn't block uploads.",
    tags: ["s3", "encryption", "kms", "bucket-policy"],
  },
  {
    id: "saa-qq-006",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "Security Services",
    question:
      "A company's security team wants to be automatically notified when an IAM user creates access keys for the root account. Which combination of services achieves this?",
    options: [
      "CloudTrail + EventBridge rule matching CreateAccessKey event + SNS notification",
      "GuardDuty with a custom threat intelligence feed for root account activity",
      "AWS Config rule evaluating root account access key existence + SNS notification",
      "CloudWatch metric alarm on IAM API calls + SNS notification",
    ],
    correctIndices: [0],
    explanation:
      "CloudTrail records all API calls including CreateAccessKey. An EventBridge rule matching the CloudTrail event pattern for CreateAccessKey on the root account triggers an SNS notification in near-real-time. AWS Config can detect that root access keys exist but doesn't alert on the creation event specifically. GuardDuty analyzes patterns but isn't purpose-built for this specific alert.",
    tags: ["cloudtrail", "eventbridge", "sns", "root-account", "security"],
  },
  {
    id: "saa-qq-007",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS KMS",
    question:
      "A company wants to encrypt RDS data at rest and requires that all key usage be auditable. Which encryption approach should be used?",
    options: [
      "RDS with SSE using a KMS customer managed key",
      "RDS with SSE using an AWS managed key (aws/rds)",
      "Encrypt the data in the application before writing to RDS",
      "Enable RDS encryption with the default service key and review CloudWatch logs",
    ],
    correctIndices: [0],
    explanation:
      "KMS customer managed keys log every key usage (GenerateDataKey, Decrypt) in CloudTrail, providing a complete audit trail. AWS managed keys (aws/rds) are used automatically by RDS but don't provide per-operation CloudTrail visibility in the same auditable way. Application-level encryption adds complexity. CloudWatch doesn't track KMS key usage.",
    tags: ["kms", "rds", "encryption", "audit", "cloudtrail"],
  },
  {
    id: "saa-qq-008",
    domain: "security",
    difficulty: "hard",
    type: "multi",
    service: "Security Services",
    question:
      "A company needs to protect their web application from SQL injection attacks and also detect if any EC2 instances are communicating with known malicious IP addresses. Which TWO services should be implemented?",
    options: [
      "AWS WAF with SQL injection match rules attached to the ALB",
      "Amazon GuardDuty analyzing VPC Flow Logs and CloudTrail",
      "AWS Shield Advanced for layer 7 attack protection",
      "Amazon Inspector scanning EC2 instances for vulnerabilities",
      "VPC Flow Logs with CloudWatch alarms on suspicious IPs",
    ],
    correctIndices: [0, 1],
    explanation:
      "WAF with SQL injection match rules blocks SQL injection at the HTTP layer before requests reach the application. GuardDuty analyzes VPC Flow Logs against AWS threat intelligence to detect EC2 instances communicating with known malicious IPs. Shield Advanced protects against DDoS (Layer 3/4), not SQL injection. Inspector scans for software vulnerabilities, not runtime network behavior. VPC Flow Logs alone don't have built-in threat intelligence.",
    tags: ["waf", "guardduty", "sql-injection", "threat-detection"],
  },

  // ─── DOMAIN 2: DESIGN RESILIENT ARCHITECTURES (26%) ────────────────────────

  {
    id: "saa-qq-009",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "High Availability & DR",
    question:
      "A company's database in us-east-1 goes down due to a region-wide outage. The RTO is 15 minutes and RPO is 5 minutes. Which architecture achieves this?",
    options: [
      "Aurora Global Database with a secondary region — automatic failover in under 1 minute",
      "RDS Multi-AZ with a read replica in us-west-2",
      "Automated RDS snapshots replicated hourly to us-west-2",
      "RDS in us-east-1 with AWS Backup copying snapshots to us-west-2 daily",
    ],
    correctIndices: [0],
    explanation:
      "Aurora Global Database provides sub-second cross-region replication lag (RPO < 1 second) and can be promoted in under 1 minute (RTO < 1 minute) — far exceeding the 15-minute RTO and 5-minute RPO requirements. RDS Multi-AZ is within a single region. Hourly snapshots have at least 1-hour RPO. Daily backups have 24-hour RPO — both miss the 5-minute RPO requirement.",
    tags: ["aurora", "global-database", "dr", "rpo", "rto"],
  },
  {
    id: "saa-qq-010",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "High Availability & DR",
    question:
      "An application stores session state in-memory on EC2 instances behind an ALB. During an AZ failure, users in the failed AZ lose their sessions. What architectural change fixes this?",
    options: [
      "Store session state in ElastiCache Redis — all instances can access it regardless of AZ",
      "Enable ALB sticky sessions to route returning users to the same AZ",
      "Deploy EC2 instances only in a single AZ to prevent cross-AZ session loss",
      "Use an NLB instead of an ALB for better session persistence",
    ],
    correctIndices: [0],
    explanation:
      "Externalizing session state to ElastiCache Redis makes the application stateless — any EC2 instance can serve any user because sessions are stored externally. Sticky sessions make AZ failures worse by binding users to instances that may fail. Single-AZ eliminates HA. NLB doesn't add session persistence capabilities.",
    tags: ["ha", "elasticache", "session", "stateless", "multi-az"],
  },
  {
    id: "saa-qq-011",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "Elastic Load Balancing",
    question:
      "A company needs to deploy a fleet of network packet inspection appliances (NGFW) in AWS that transparently intercept all inbound VPC traffic for security inspection. Which load balancer type enables this?",
    options: [
      "Gateway Load Balancer — designed for inline network appliance fleets using GENEVE",
      "Network Load Balancer with the NGFW instances as targets",
      "Application Load Balancer with WAF rules for deep packet inspection",
      "Classic Load Balancer with SSL pass-through to NGFW instances",
    ],
    correctIndices: [0],
    explanation:
      "GLB is purpose-built for transparent inline network appliances. It uses GENEVE protocol encapsulation to send traffic to appliances without changing source/destination IPs, and returns inspected traffic for forwarding. NLB cannot do transparent inline inspection. ALB/WAF is Layer 7 HTTP only. Classic LB is legacy and doesn't support this use case.",
    tags: ["elb", "glb", "firewall", "ngfw", "geneve"],
  },
  {
    id: "saa-qq-012",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "Amazon EC2",
    question:
      "An Auto Scaling Group must maintain at least 2 running EC2 instances at all times for high availability. During a scale-in event, a specific instance (which coordinates background tasks) should never be terminated. How is this configured?",
    options: [
      "Enable scale-in protection on that specific EC2 instance",
      "Set the ASG minimum capacity to 2 and mark the instance as a dedicated instance",
      "Use a placement group to isolate the coordinator instance from scale-in",
      "Add a lifecycle hook that delays termination of the coordinator instance indefinitely",
    ],
    correctIndices: [0],
    explanation:
      "Instance-level scale-in protection prevents the ASG from terminating a specific instance during scale-in events. The ASG minimum capacity (set to 2) ensures at least 2 instances always run, but doesn't protect a specific one. Dedicated instances control hardware placement, not termination behavior. Lifecycle hooks delay termination but don't prevent it.",
    tags: ["ec2", "asg", "scale-in-protection", "ha"],
  },
  {
    id: "saa-qq-013",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    service: "Amazon SQS",
    question:
      "A distributed application sends messages to an SQS Standard queue. After processing, the consumer fails to delete some messages, causing them to be processed multiple times. What is the root cause?",
    options: [
      "The visibility timeout expires before the consumer finishes processing",
      "The SQS queue does not have a Dead Letter Queue configured",
      "Standard SQS queues inherently deliver messages at-least-once",
      "Long polling is not enabled, causing duplicate polling",
    ],
    correctIndices: [0],
    explanation:
      "When a consumer receives a message, it becomes invisible for the visibility timeout duration. If processing takes longer than the visibility timeout, the message reappears and another consumer picks it up. The consumer must delete the message before the timeout expires, or extend the visibility timeout mid-processing. Standard SQS does have at-least-once delivery, but visibility timeout expiry is the specific cause of repeated processing here.",
    tags: ["sqs", "visibility-timeout", "duplicate", "consumer"],
  },
  {
    id: "saa-qq-014",
    domain: "applications",
    difficulty: "hard",
    type: "single",
    service: "Amazon SQS",
    question:
      "An order processing system requires that orders are processed in the exact sequence they arrive AND that each order is processed exactly once. The system processes 500 orders per second. Which SQS configuration satisfies both requirements?",
    options: [
      "SQS FIFO queue with Message Group IDs and batching (up to 3,000 TPS with batching)",
      "SQS Standard queue with sequence numbers in the message body and consumer-side deduplication",
      "SQS FIFO queue — it handles 300 TPS per queue without batching",
      "SQS Standard queue with a Lambda consumer using DynamoDB for deduplication tracking",
    ],
    correctIndices: [0],
    explanation:
      "FIFO queues provide exactly-once processing and strict ordering. With batching (10 messages/request), FIFO supports 3,000 TPS — enough for 500 orders/second. Without batching it's only 300 TPS, insufficient. Standard queues have best-effort ordering and at-least-once delivery — application-level deduplication adds complexity and doesn't guarantee order.",
    tags: ["sqs", "fifo", "ordering", "exactly-once", "throughput"],
  },
  {
    id: "saa-qq-015",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    service: "AWS Lambda",
    question:
      "A Lambda function processes records from a Kinesis Data Stream. A single malformed record consistently causes the function to throw an error, which causes the entire batch to retry indefinitely — blocking all subsequent records in the shard. What is the BEST solution?",
    options: [
      "Enable BisectBatchOnFunctionError on the event source mapping",
      "Set a DLQ on the Lambda function for failed invocations",
      "Reduce the batch size to 1 so each record is processed individually",
      "Add a try/catch in the Lambda function to skip malformed records",
    ],
    correctIndices: [0],
    explanation:
      "BisectBatchOnFunctionError splits the failing batch in half and retries each half independently, recursively isolating the malformed record. The bad record is then sent to a failure destination (S3, SQS, SNS, or EventBridge). DLQ doesn't work for stream event source mappings. Batch size of 1 works but is extremely inefficient. Try/catch doesn't handle all failure modes and requires code changes.",
    tags: ["lambda", "kinesis", "bisect", "error-handling", "streams"],
  },

  // ─── DOMAIN 3: DESIGN HIGH-PERFORMING ARCHITECTURES (24%) ──────────────────

  {
    id: "saa-qq-016",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    service: "Amazon S3",
    question:
      "A global media company uploads large video files (10-50 GB each) from offices in Asia and Europe to an S3 bucket in us-east-1. Upload speeds are consistently slow. What is the MOST effective solution?",
    options: [
      "Enable S3 Transfer Acceleration to route uploads through nearby CloudFront edge locations",
      "Enable CRR to create bucket replicas in Asia and Europe",
      "Use multipart upload for files larger than 100 MB",
      "Switch to an S3 bucket in a region closer to the uploading offices",
    ],
    correctIndices: [0],
    explanation:
      "S3 Transfer Acceleration uses CloudFront edge locations as optimized upload entry points, routing uploads over the AWS global backbone to the S3 bucket. This significantly reduces upload time for distant users. CRR copies data after upload, not during. Multipart upload improves parallelism but not geographic latency. Switching regions would require changing the destination for users in different continents.",
    tags: ["s3", "transfer-acceleration", "performance", "global"],
  },
  {
    id: "saa-qq-017",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    service: "Amazon RDS",
    question:
      "A read-heavy e-commerce application's RDS MySQL database is a performance bottleneck. 80% of queries are reads. What is the MOST cost-effective architectural change?",
    options: [
      "Create 2-3 RDS Read Replicas and configure the application to send read queries to the replica endpoint",
      "Upgrade the RDS instance to a larger instance type (vertical scaling)",
      "Enable RDS Multi-AZ to distribute read traffic across primary and standby",
      "Migrate the database to DynamoDB for better read performance",
    ],
    correctIndices: [0],
    explanation:
      "Read replicas offload read traffic from the primary at relatively low cost. For an 80% read workload, routing reads to replicas dramatically reduces primary load. RDS Multi-AZ standby is NOT readable — it only provides failover. Vertical scaling is more expensive and doesn't scale as well as horizontal read replicas. DynamoDB migration requires significant application changes and may not support all SQL query patterns.",
    tags: ["rds", "read-replica", "performance", "scaling"],
  },
  {
    id: "saa-qq-018",
    domain: "fundamentals",
    difficulty: "hard",
    type: "single",
    service: "Amazon DynamoDB",
    question:
      "A DynamoDB table has userId as the partition key and timestamp as the sort key. The application needs to query all items for a specific product category. Product category is not part of the primary key. Which solution enables this query efficiently?",
    options: [
      "Create a GSI with productCategory as the partition key and timestamp as the sort key",
      "Create an LSI with productCategory as the sort key",
      "Use a DynamoDB Scan with a FilterExpression on productCategory",
      "Migrate to RDS to support flexible SQL queries across all attributes",
    ],
    correctIndices: [0],
    explanation:
      "A GSI with productCategory as the partition key supports queries like 'all items for category X' efficiently. An LSI must share the userId partition key so it can't support productCategory-based queries. Scan with FilterExpression reads all items then filters in memory — expensive and slow. Migrating to RDS for this specific use case is excessive when a GSI solves it.",
    tags: ["dynamodb", "gsi", "query", "partition-key"],
  },
  {
    id: "saa-qq-019",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    service: "Amazon CloudFront",
    question:
      "A streaming video service wants to allow subscribers to access an entire season of a show through CloudFront for 48 hours after purchasing. Each episode has multiple quality-level HLS segments. Which CloudFront feature is MOST appropriate?",
    options: [
      "CloudFront signed cookies granting access to /shows/season1/* for 48 hours",
      "CloudFront signed URLs for each individual episode segment",
      "S3 pre-signed URLs distributed directly to subscribers",
      "CloudFront Origin Access Control with a 48-hour cache TTL",
    ],
    correctIndices: [0],
    explanation:
      "Signed cookies grant time-limited access to multiple resources matching a path pattern without changing URLs. For a season with hundreds of HLS segment URLs across multiple episodes and quality levels, signed cookies are far more practical than generating individual signed URLs for every segment. S3 pre-signed URLs bypass CloudFront caching and expose S3 directly. OAC restricts access to CloudFront but doesn't provide subscriber-level time-limited access.",
    tags: ["cloudfront", "signed-cookies", "signed-urls", "streaming"],
  },
  {
    id: "saa-qq-020",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    service: "Amazon ElastiCache",
    question:
      "An application uses ElastiCache to cache database query results. The cache must survive a restart and support failover between nodes. Which ElastiCache engine and configuration satisfies both requirements?",
    options: [
      "Redis with persistence (RDB/AOF) and Multi-AZ replication group",
      "Memcached with Multi-AZ deployment",
      "Redis with cluster mode disabled and no persistence",
      "Memcached with periodic cache warming from the database",
    ],
    correctIndices: [0],
    explanation:
      "Redis supports persistence (RDB snapshots and AOF logging) so data survives restarts, and replication groups with Multi-AZ automatic failover for high availability. Memcached has no persistence and no native replication — data is always lost on restart. Redis with no persistence satisfies failover but not restart survival.",
    tags: ["elasticache", "redis", "memcached", "persistence", "ha"],
  },
  {
    id: "saa-qq-021",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    service: "Amazon Kinesis",
    question:
      "A data pipeline receives real-time IoT events that must be processed in under 1 second by a Lambda function AND archived to S3 in Parquet format. Which architecture correctly separates these two requirements?",
    options: [
      "Kinesis Data Streams → Lambda (real-time processing) + Kinesis Data Firehose with Lambda transformation (S3 Parquet archival)",
      "Kinesis Data Firehose → Lambda trigger (real-time) + S3 directly (Parquet)",
      "SQS → Lambda (real-time) + S3 event notification (archival)",
      "Kinesis Data Streams → Lambda (both real-time and S3 archival in the same function)",
    ],
    correctIndices: [0],
    explanation:
      "KDS supports multiple consumers simultaneously: a Lambda consumer for sub-second processing AND KDF reading from KDS for near-real-time Parquet conversion and S3 delivery. KDF alone has seconds of buffering latency — insufficient for sub-second processing. SQS deletes messages after consumption so only one consumer gets each message. A single Lambda function handling both concerns is a design anti-pattern and harder to scale independently.",
    tags: ["kinesis", "kds", "kdf", "lambda", "s3", "streaming"],
  },
  {
    id: "saa-qq-022",
    domain: "fundamentals",
    difficulty: "hard",
    type: "single",
    service: "Amazon Route 53",
    question:
      "A company wants to route users in Europe to an EU region and users in Asia to an AP region. If the EU endpoint fails health checks, European users should automatically route to the AP region as a fallback. Which Route 53 configuration achieves this?",
    options: [
      "Geolocation routing for EU→eu-west-1 and AP→ap-southeast-1, with failover records pointing each to a multi-value set including the other region",
      "Latency-based routing with health checks — Route 53 automatically routes to the fastest healthy endpoint",
      "Weighted routing 50/50 between EU and AP regions with health checks",
      "Two failover routing policies — primary EU, secondary AP — with geolocation routing on top",
    ],
    correctIndices: [0],
    explanation:
      "Geolocation routing directs users by location. Adding health checks to geolocation records causes Route 53 to use the default (catch-all) record when the primary record for a location fails — effectively falling back to the AP region for European users when EU is unhealthy. Latency routing routes to the fastest, not by geography. Weighted routing doesn't respect geography.",
    tags: ["route53", "geolocation", "failover", "health-check"],
  },

  // ─── DOMAIN 4: DESIGN COST-OPTIMIZED ARCHITECTURES (20%) ───────────────────

  {
    id: "saa-qq-023",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    service: "Cost Optimization",
    question:
      "A company runs a development environment EC2 instance that is only used Monday-Friday 9am-6pm. Which purchasing strategy minimizes cost?",
    options: [
      "On-Demand instance with an EventBridge Scheduler to start/stop on a schedule",
      "Reserved Instance for 1 year to get the discount",
      "Spot Instance with a persistent request",
      "Savings Plan with Compute coverage",
    ],
    correctIndices: [0],
    explanation:
      "An On-Demand instance that's stopped outside business hours (nights and weekends) runs approximately 45 hours/week instead of 168 — a ~73% reduction in compute hours. Even at On-Demand pricing, this beats a Reserved Instance (which charges whether the instance runs or not). Spot instances can be terminated unexpectedly, disrupting developer work. Savings Plans still apply to running compute usage — stopping eliminates the compute cost entirely.",
    tags: ["ec2", "cost", "on-demand", "scheduling"],
  },
  {
    id: "saa-qq-024",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "Cost Optimization",
    question:
      "A company frequently runs large-scale batch analytics jobs on EC2 that can be interrupted and restarted without data loss. These jobs run multiple times daily but at unpredictable times. Which EC2 purchasing option minimizes cost?",
    options: [
      "Spot Instances using a Spot Fleet with diversification across instance types and AZs",
      "On-Demand Instances with Auto Scaling",
      "Reserved Instances (1-year term, Standard)",
      "Dedicated Instances for performance consistency",
    ],
    correctIndices: [0],
    explanation:
      "Spot Instances offer up to 90% savings and are ideal for fault-tolerant, restartable batch workloads. A Spot Fleet with instance type diversification reduces the chance of simultaneous interruption across all instances. On-Demand costs significantly more. Reserved Instances are for predictable 24/7 workloads. Dedicated Instances are for licensing compliance, not cost optimization.",
    tags: ["ec2", "spot", "batch", "cost"],
  },
  {
    id: "saa-qq-025",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "Amazon S3",
    question:
      "A company stores 500 TB of log files in S3 Standard. Files are analyzed frequently in the first 7 days, occasionally for the next 23 days, then almost never for 2 years before being deleted. Which lifecycle policy minimizes storage cost?",
    options: [
      "Keep in Standard for 7 days, transition to Standard-IA at day 30, transition to Glacier Flexible Retrieval at day 90, expire at day 730",
      "Transition to Glacier Deep Archive immediately, expire at day 730",
      "Enable S3 Intelligent-Tiering for automatic cost optimization",
      "Keep in Standard for 30 days then move to Glacier Flexible Retrieval until day 730",
    ],
    correctIndices: [0],
    explanation:
      "This lifecycle correctly accounts for access patterns and minimum storage durations. Standard-IA transition at day 30 satisfies the 30-day minimum. Glacier Flexible Retrieval at day 90 satisfies its 90-day minimum. Deep Archive from day 0 would charge retrieval fees during frequent access. Intelligent-Tiering adds per-object monitoring fees and doesn't account for the clear access pattern boundaries here.",
    tags: ["s3", "lifecycle", "glacier", "cost", "storage-classes"],
  },
  {
    id: "saa-qq-026",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "Cost Optimization",
    question:
      "A company runs EC2 instances in a private VPC subnet that make heavy use of the S3 API. CloudWatch shows significant NAT Gateway data processing charges. What is the MOST cost-effective fix?",
    options: [
      "Create a Gateway VPC Endpoint for S3 — eliminates NAT Gateway data processing for S3 traffic",
      "Move the EC2 instances to a public subnet with direct internet access",
      "Create an Interface VPC Endpoint for S3",
      "Compress all S3 data before upload to reduce the bytes transferred through NAT",
    ],
    correctIndices: [0],
    explanation:
      "Gateway VPC Endpoints for S3 are free — no hourly charge and no per-GB data processing fee. S3 traffic from the VPC routes through the endpoint directly to S3 via the AWS backbone, bypassing the NAT Gateway entirely. Interface endpoints have hourly + per-GB fees. Moving instances to a public subnet adds security risk. Data compression reduces payload size but still routes through the NAT Gateway at $0.045/GB.",
    tags: ["cost", "vpc", "nat", "s3", "endpoint"],
  },
  {
    id: "saa-qq-027",
    domain: "deployment",
    difficulty: "hard",
    type: "multi",
    service: "Cost Optimization",
    question:
      "A company wants to reduce costs for their production workloads. They run EC2 instances 24/7 for a web tier (predictable load) and a batch processing tier (interruptible, runs 6 hours/day). Which TWO purchasing strategies minimize cost?",
    options: [
      "1-year Reserved Instances or Savings Plans for the always-on web tier",
      "Spot Instances for the interruptible batch processing tier",
      "On-Demand Instances for the web tier to maintain flexibility",
      "Dedicated Hosts for the batch processing tier",
      "Spot Instances for the web tier since it handles HTTP traffic well",
    ],
    correctIndices: [0, 1],
    explanation:
      "Reserved Instances or Savings Plans (up to 72%) are ideal for predictable 24/7 web tier workloads — the commitment pays off because the instances always run. Spot Instances (up to 90% savings) are perfect for interruptible batch processing that can handle 2-minute termination notices. On-Demand for steady web traffic is far more expensive than committing. Spot for a web tier risks user-facing interruptions. Dedicated Hosts are for licensing compliance.",
    tags: ["ec2", "reserved", "spot", "cost", "savings-plans"],
  },
  {
    id: "saa-qq-028",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "Cost Optimization",
    question:
      "A company runs occasional SQL analytics queries against 50 TB of data in S3 — once or twice a week. They currently have a Redshift cluster running 24/7 to support these queries. How should they reduce cost?",
    options: [
      "Replace the Redshift cluster with Amazon Athena — pay per TB scanned (~$5/TB)",
      "Resize the Redshift cluster to the smallest node type",
      "Pause the Redshift cluster between queries using scheduled automation",
      "Use Amazon EMR with spot instances for the analytics queries",
    ],
    correctIndices: [0],
    explanation:
      "Athena charges ~$5/TB scanned with no infrastructure cost — perfect for infrequent analytical queries. At twice/week on 50 TB, Athena costs roughly $500/week vs a Redshift cluster's fixed $500-2,000+/month regardless of query frequency. Pausing Redshift reduces cost but still requires cluster management and storage. EMR is for large-scale processing, not simple SQL analytics.",
    tags: ["athena", "redshift", "cost", "analytics", "s3"],
  },

  // ─── ADDITIONAL SCENARIO QUESTIONS ─────────────────────────────────────────

  {
    id: "saa-qq-029",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "Amazon VPC",
    question:
      "A company has 15 VPCs across 3 AWS accounts that all need to communicate with each other and share a single AWS Direct Connect connection to on-premises. What is the MOST scalable architecture?",
    options: [
      "Transit Gateway shared across accounts via AWS RAM, connected to a Direct Connect gateway",
      "Full-mesh VPC peering between all 15 VPCs with shared Direct Connect",
      "A centralized VPC acting as a hub with peering connections to all 14 others",
      "Individual Direct Connect connections for each VPC",
    ],
    correctIndices: [0],
    explanation:
      "Transit Gateway supports transitive routing and can be shared across accounts using AWS Resource Access Manager. One TGW attachment per VPC scales to hundreds of VPCs. The TGW connects to a Direct Connect gateway for on-premises access. Full-mesh peering requires 105 connections (15×14/2) and is non-transitive. Hub-and-spoke peering is transitive through the hub but TGW is the purpose-built, scalable solution.",
    tags: ["vpc", "transit-gateway", "direct-connect", "multi-account"],
  },
  {
    id: "saa-qq-030",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    service: "Amazon EC2",
    question:
      "A company runs a tightly coupled HPC simulation that requires the lowest possible network latency between nodes. All nodes must start simultaneously. Which EC2 configuration should be used?",
    options: [
      "Cluster placement group with instances of the same family in one AZ",
      "Spread placement group across multiple AZs",
      "Partition placement group with all nodes in a single partition",
      "No placement group — EC2 automatically optimizes placement for low latency",
    ],
    correctIndices: [0],
    explanation:
      "Cluster placement groups co-locate instances on the same high-speed rack in a single AZ, enabling 10+ Gbps network throughput with ultra-low latency — ideal for tightly coupled HPC. Spread groups maximize fault tolerance (separate racks) but increase latency. Partition groups provide rack-level failure isolation for distributed DBs, not HPC performance. Default placement has no latency guarantees.",
    tags: ["ec2", "placement-group", "hpc", "latency"],
  },
  {
    id: "saa-qq-031",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CloudFormation",
    question:
      "A team needs to deploy identical infrastructure stacks to 20 AWS accounts across 3 regions for a new compliance baseline. What is the MOST efficient approach?",
    options: [
      "CloudFormation StackSets with AWS Organizations service-managed permissions",
      "Deploy 60 individual CloudFormation stacks manually (20 accounts × 3 regions)",
      "Use AWS CDK to generate and deploy templates to each account/region",
      "Create an AWS Config conformance pack across all accounts",
    ],
    correctIndices: [0],
    explanation:
      "StackSets with Organizations integration deploy a single template to all specified accounts and regions in one operation. You can target entire OUs or specific accounts. New accounts added to the OU auto-receive the stack. Manual deployment to 60 stacks is error-prone and doesn't scale. CDK generates templates but doesn't handle multi-account deployment automatically. Config conformance packs handle Config rules, not general infrastructure.",
    tags: ["cloudformation", "stacksets", "organizations", "multi-account"],
  },
  {
    id: "saa-qq-032",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "Amazon S3",
    question:
      "A financial company must ensure S3 compliance data cannot be deleted or overwritten for exactly 7 years, even by administrators or the root account. Which S3 feature enforces this?",
    options: [
      "S3 Object Lock in Compliance mode with a 7-year retention period",
      "S3 Object Lock in Governance mode with a 7-year retention period",
      "S3 versioning with MFA Delete enabled",
      "S3 Glacier Vault Lock with a 7-year retention policy",
    ],
    correctIndices: [0],
    explanation:
      "Object Lock Compliance mode prevents any user — including root and administrators — from deleting or overwriting objects before the retention period expires. Governance mode allows users with special permissions to override. MFA Delete requires MFA for deletions but can be bypassed by account administrators. Glacier Vault Lock is for Glacier vaults, not S3.",
    tags: ["s3", "object-lock", "compliance", "worm"],
  },
  {
    id: "saa-qq-033",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    service: "AWS Lambda",
    question:
      "A company's Lambda function connects to an RDS PostgreSQL database. During high traffic, the function throws 'too many connections' errors. What is the BEST architectural fix?",
    options: [
      "Add RDS Proxy between Lambda and RDS to pool and reuse database connections",
      "Increase the max_connections parameter in the RDS parameter group",
      "Increase Lambda's reserved concurrency to limit the number of simultaneous connections",
      "Switch from RDS PostgreSQL to DynamoDB to eliminate connection limits",
    ],
    correctIndices: [0],
    explanation:
      "RDS Proxy pools connections — thousands of Lambda invocations share a small number of actual database connections. This eliminates connection exhaustion without changing Lambda concurrency or the database. Increasing max_connections delays the problem but doesn't solve it at high Lambda concurrency. Reducing Lambda concurrency limits throughput. Migrating to DynamoDB requires major application changes and may not support all SQL operations.",
    tags: ["lambda", "rds", "proxy", "connections"],
  },
  {
    id: "saa-qq-034",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "Amazon CloudWatch",
    question:
      "A team needs to alert when their application logs contain more than 5 instances of the text 'CRITICAL ERROR' within a 1-minute window. What is the MOST direct implementation?",
    options: [
      "CloudWatch Logs Metric Filter extracting CRITICAL ERROR occurrences, then a CloudWatch alarm when the metric exceeds 5",
      "CloudWatch Logs Insights scheduled query alerting when results exceed 5",
      "CloudTrail event matching CRITICAL ERROR log entries with EventBridge alarm",
      "Lambda function scanning logs every minute and publishing a custom metric",
    ],
    correctIndices: [0],
    explanation:
      "Metric Filters extract patterns from log events in near-real-time and publish the count as a CloudWatch metric. A CloudWatch alarm on that metric triggers when the count exceeds 5 in a 1-minute period. Logs Insights is for interactive ad-hoc queries, not real-time alerting. CloudTrail records API calls, not application log content. A scheduled Lambda adds unnecessary complexity.",
    tags: ["cloudwatch", "metric-filter", "logs", "alarm"],
  },
  {
    id: "saa-qq-035",
    domain: "fundamentals",
    difficulty: "hard",
    type: "multi",
    service: "Amazon RDS",
    question:
      "A company needs a database solution that provides automatic failover within 30 seconds, supports up to 15 read replicas, and automatically scales storage without manual intervention. Which TWO characteristics describe the correct service?",
    options: [
      "Amazon Aurora with Aurora Replicas for read scaling",
      "Automatic storage scaling up to 128 TB without manual intervention",
      "Standard RDS MySQL with Multi-AZ and up to 5 read replicas",
      "DynamoDB with DAX for read replica functionality",
      "RDS PostgreSQL with provisioned IOPS and manual storage scaling",
    ],
    correctIndices: [0, 1],
    explanation:
      "Aurora supports up to 15 Aurora Replicas with ~30-second failover (because replicas share storage — no data copy needed). Aurora storage auto-scales from 10 GB to 128 TB automatically with no manual resize. Standard RDS supports only 5 read replicas and 60-120 second failover. DynamoDB with DAX is NoSQL, not a relational database solution. RDS requires manual storage scaling.",
    tags: ["aurora", "read-replica", "storage", "failover", "ha"],
  },
  {
    id: "saa-qq-036",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    service: "Storage: EFS, FSx & Storage Gateway",
    question:
      "A company is migrating 200 TB of on-premises NFS data to AWS. Their internet connection is 500 Mbps. How long would the transfer take over the internet, and what is the recommended solution?",
    options: [
      "~36 days over internet — use AWS Snowball Edge devices for physical transfer",
      "~9 days over internet — use AWS DataSync with parallel transfers",
      "~3 days over internet — use S3 Transfer Acceleration",
      "~18 days over internet — use Direct Connect for faster transfer",
    ],
    correctIndices: [0],
    explanation:
      "200 TB at 500 Mbps = 200×1024×8 Gb / 0.5 Gbps = ~3,277,000 seconds = ~38 days (assuming 100% utilization, which is unrealistic). AWS Snowball Edge devices (80 TB each) can physically transfer 200 TB in days via shipping. DataSync and Transfer Acceleration are still bound by the 500 Mbps connection. Direct Connect installation takes weeks and 500 Mbps Direct Connect has similar throughput.",
    tags: ["snowball", "migration", "datasync", "storage"],
  },
  {
    id: "saa-qq-037",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "Amazon CloudFront",
    question:
      "A company hosts a private S3 bucket behind CloudFront. They want to ensure S3 objects encrypted with SSE-KMS are accessible through CloudFront but not directly from S3 URLs. Which configuration is required?",
    options: [
      "Origin Access Control (OAC) — OAC supports SSE-KMS encrypted objects and signs requests with SigV4",
      "Origin Access Identity (OAI) — legacy OAI supports SSE-KMS encrypted objects",
      "Signed URLs on CloudFront with a KMS-encrypted signed payload",
      "S3 bucket policy allowing CloudFront's IP ranges with SSE-KMS enabled",
    ],
    correctIndices: [0],
    explanation:
      "OAC is the modern replacement for OAI. Unlike OAI, OAC supports accessing SSE-KMS encrypted S3 objects because it signs requests using SigV4, which is compatible with KMS. OAI used a different signing method incompatible with KMS-encrypted objects. IP-based bucket policies are unreliable because CloudFront IPs change. Signed URLs control access to CloudFront, not the S3 backend encryption.",
    tags: ["cloudfront", "s3", "oac", "kms", "sse-kms"],
  },
  {
    id: "saa-qq-038",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    service: "Amazon SNS",
    question:
      "An e-commerce platform publishes an 'order-created' event to an SNS topic. Three services consume from the topic: inventory (SQS queue), email notifications (Lambda), and analytics (Kinesis). One service occasionally falls behind. How does this architecture handle backpressure?",
    options: [
      "Each SQS queue and Lambda absorbs backpressure independently — the SNS topic is not affected by slow consumers",
      "SNS throttles all publishers when any subscriber falls behind",
      "SNS DLQ captures events when subscribers are slow, replaying them later",
      "The analytics Kinesis stream must be scaled up or SNS delivery will fail",
    ],
    correctIndices: [0],
    explanation:
      "SNS delivers to each subscriber independently. The SQS queue buffers messages for the inventory service. Lambda scales automatically. Kinesis handles its own throughput. A slow SQS consumer just accumulates messages in its queue — it doesn't affect SNS delivery to other subscribers. SNS doesn't throttle publishers based on subscriber speed. This isolation is exactly why SQS queues are placed between SNS and slow consumers.",
    tags: ["sns", "sqs", "decoupling", "backpressure", "fan-out"],
  },
  {
    id: "saa-qq-039",
    domain: "fundamentals",
    difficulty: "hard",
    type: "single",
    service: "Amazon Route 53",
    question:
      "A company has Route 53 failover routing configured: primary record points to an ALB in us-east-1 with a health check; secondary record points to an ALB in us-west-2. The TTL on the primary record is 60 seconds. The primary becomes unhealthy. What is the approximate time before all users are routed to us-west-2?",
    options: [
      "Route 53 health check interval + evaluation period + TTL ≈ 90-150 seconds total",
      "Exactly 60 seconds (one TTL expiry)",
      "Immediately — Route 53 removes the unhealthy record instantly",
      "Up to 300 seconds due to DNS propagation across all resolvers",
    ],
    correctIndices: [0],
    explanation:
      "The failover time is: health check interval (30 seconds default) × failure threshold (3 consecutive failures = ~90 seconds to mark unhealthy) + TTL (60 seconds for cached DNS to expire). Total: approximately 150 seconds. Failover isn't instant — Route 53 must detect the failure, update DNS, and wait for TTL to expire in DNS resolvers. Lower TTL = faster failover but more DNS queries.",
    tags: ["route53", "failover", "health-check", "ttl", "dns"],
  },
  {
    id: "saa-qq-040",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CloudFormation",
    question:
      "A CloudFormation stack update will replace an RDS instance (a destructive change). The team wants to review exactly which resources will be replaced before proceeding. What should they do?",
    options: [
      "Create a Change Set and review it before executing the update",
      "Enable stack drift detection before the update",
      "Deploy to a test stack first and observe what changes",
      "Check the CloudFormation events log from the previous deployment",
    ],
    correctIndices: [0],
    explanation:
      "Change Sets show exactly which resources will be added, modified, or replaced, and whether replacement causes downtime. The team can review the change set and choose not to execute if the RDS replacement is unintended. Drift detection finds manual changes to existing resources — it doesn't preview future update impacts. Test deployments consume real resources and don't directly preview production impacts.",
    tags: ["cloudformation", "change-set", "rds", "update"],
  },
];
