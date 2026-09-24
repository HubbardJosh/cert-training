import { FlashCard } from "../../../types";

// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html
// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html
// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html
export const flashcards: FlashCard[] = [
  // ─── Overview ────────────────────────────────────────────────────────────────
  {
    id: "sqs-fc-001",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "easy",
    question:
      "What is Amazon SQS and what architectural pattern does it enable?",
    answer:
      "Amazon Simple Queue Service (SQS) is a fully managed message queuing service. It enables asynchronous decoupling of distributed systems: producers send messages to a queue without waiting for consumers, and consumers retrieve messages at their own pace. Neither side needs to know about the other.",
    keyPoints: [
      "Fully managed — no broker to provision or maintain",
      "Asynchronous: producers and consumers operate independently",
      "Messages stored redundantly across multiple servers in the region",
      "Pay per API request — no upfront or minimum fees",
    ],
    tags: ["sqs", "overview", "decoupling", "messaging"],
  },
  {
    id: "sqs-fc-002",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "easy",
    question: "What are the three phases of the SQS message lifecycle?",
    answer:
      "Send → Receive → Delete. A producer calls SendMessage; a consumer calls ReceiveMessage (message becomes invisible for the visibility timeout duration); the consumer calls DeleteMessage after successful processing.",
    keyPoints: [
      "Send: producer calls SendMessage; SQS stores redundantly",
      "Receive: consumer calls ReceiveMessage; message enters visibility timeout",
      "Delete: consumer calls DeleteMessage with receipt handle after processing",
      "If DeleteMessage is not called before timeout expires, message reappears",
    ],
    tags: ["sqs", "message-lifecycle", "visibility-timeout"],
  },
  {
    id: "sqs-fc-003",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "easy",
    question: "What is the maximum size of an SQS message?",
    answer:
      "1 MiB (1,048,576 bytes). For larger payloads up to 2 GB, use the SQS Extended Client Library to store the body in Amazon S3 and put a reference pointer in the SQS message.",
    keyPoints: [
      "Max: 1 MiB (1,048,576 bytes)",
      "Minimum: 1 byte",
      "Extended Client Library (Java/Python) supports up to 2 GB via S3",
      "All message attributes count toward the 1 MiB limit",
    ],
    tags: ["sqs", "limits", "message-size", "extended-client"],
  },
  {
    id: "sqs-fc-004",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "easy",
    question:
      "What is the default message retention period, and what is the range?",
    answer:
      "Default: 4 days. Range: 60 seconds (1 minute) to 1,209,600 seconds (14 days). Configured via the MessageRetentionPeriod queue attribute.",
    keyPoints: [
      "Default: 4 days",
      "Minimum: 60 seconds",
      "Maximum: 14 days (1,209,600 seconds)",
      "Set via SetQueueAttributes or at queue creation",
    ],
    tags: ["sqs", "retention", "limits"],
  },
  {
    id: "sqs-fc-005",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "easy",
    question: "What is the default visibility timeout, and what is the range?",
    answer:
      "Default: 30 seconds. Minimum: 0 seconds. Maximum: 12 hours. The visibility timeout starts when the message is returned to the consumer, not when processing begins.",
    keyPoints: [
      "Default: 30 seconds",
      "Minimum: 0 seconds (immediately visible again)",
      "Maximum: 12 hours",
      "Use ChangeMessageVisibility to extend; 12-hour max is from initial receive time",
    ],
    tags: ["sqs", "visibility-timeout", "limits"],
  },
  // ─── Standard vs FIFO ────────────────────────────────────────────────────────
  {
    id: "sqs-fc-006",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question: "What delivery guarantees does a Standard SQS queue provide?",
    answer:
      "At-least-once delivery (messages may be delivered more than once) and best-effort ordering (messages are generally in order but not guaranteed). Consumers MUST be idempotent.",
    keyPoints: [
      "At-least-once delivery: duplicates can occur due to distributed storage",
      "Best-effort ordering: generally FIFO but no strict guarantee",
      "Throughput: nearly unlimited TPS",
      "Consumers must be idempotent to safely handle duplicates",
    ],
    tags: ["sqs", "standard-queue", "idempotency", "delivery-guarantees"],
  },
  {
    id: "sqs-fc-007",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question: "What delivery guarantees does a FIFO SQS queue provide?",
    answer:
      "Exactly-once processing (no duplicates) and strict FIFO ordering within a MessageGroupId. FIFO queue names must end with .fifo. Standard throughput: 300 TPS per API action (3,000 msg/s with batching).",
    keyPoints: [
      "Exactly-once processing via deduplication (content-based or explicit ID)",
      "Strict FIFO ordering within each MessageGroupId",
      "Different MessageGroupIds can be processed in parallel",
      "Queue name must end with .fifo suffix",
    ],
    tags: ["sqs", "fifo-queue", "ordering", "deduplication"],
  },
  {
    id: "sqs-fc-008",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question:
      "What is MessageGroupId and how does it affect FIFO queue behavior?",
    answer:
      "MessageGroupId groups messages that must be processed in strict FIFO order. Within a group, messages are delivered in order and one at a time. Different groups can be processed in parallel. Required for all FIFO queue messages.",
    keyPoints: [
      "Required for all FIFO queue messages",
      "Messages in same group: strict FIFO order, one in-flight at a time",
      "Different groups: parallel processing, independent ordering",
      "Max length: 128 characters",
    ],
    tags: ["sqs", "fifo", "message-group-id", "ordering"],
  },
  {
    id: "sqs-fc-009",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question:
      "What is the FIFO queue deduplication window, and what are the two deduplication methods?",
    answer:
      "The deduplication window is 5 minutes. Two methods: (1) Content-based deduplication — SQS computes SHA-256 hash of message body as the deduplication ID. (2) Explicit MessageDeduplicationId — producer provides a unique ID per message.",
    keyPoints: [
      "Deduplication window: exactly 5 minutes (not configurable)",
      "Content-based: SHA-256 hash of message body — fails if two different messages have identical bodies",
      "Explicit MessageDeduplicationId: producer controls the ID",
      "Same deduplicationId within 5 min = silently rejected (producer gets success response)",
    ],
    tags: ["sqs", "fifo", "deduplication", "exactly-once"],
  },
  {
    id: "sqs-fc-010",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "hard",
    question:
      "What are the throughput limits for FIFO queues in standard mode vs high-throughput mode?",
    answer:
      "Standard mode: 300 TPS per API action (3,000 msg/s with batching of 10). High-throughput mode in us-east-1/us-west-2/eu-west-1: up to 70,000 TPS per API action (700,000 msg/s with batching).",
    keyPoints: [
      "Standard FIFO: 300 TPS per API action (SendMessage, ReceiveMessage, DeleteMessage)",
      "Standard FIFO with batching: 3,000 messages/second (300 × 10)",
      "High-throughput FIFO us-east-1: 70,000 TPS / 700,000 msg/s batched",
      "High-throughput mode can be enabled without recreating the queue",
    ],
    tags: ["sqs", "fifo", "throughput", "high-throughput"],
  },
  // ─── Visibility & Polling ─────────────────────────────────────────────────────
  {
    id: "sqs-fc-011",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question:
      "How does ChangeMessageVisibility work, and what is its 12-hour constraint?",
    answer:
      "ChangeMessageVisibility resets the visibility timeout countdown from the current moment. The 12-hour maximum is measured from the INITIAL receive time — not from the extension call. You cannot extend visibility beyond 12 hours from when the message was first received.",
    keyPoints: [
      "Resets countdown from current moment to new VisibilityTimeout value",
      "Maximum 12 hours measured from initial ReceiveMessage call",
      "Set VisibilityTimeout=0 to immediately release message back to queue",
      "Used for heartbeat pattern: extend timeout while processing long tasks",
    ],
    tags: ["sqs", "visibility-timeout", "change-message-visibility"],
  },
  {
    id: "sqs-fc-012",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "easy",
    question:
      "What is the difference between short polling and long polling in SQS?",
    answer:
      "Short polling (default, WaitTimeSeconds=0): queries a random subset of servers, returns immediately even if empty. Long polling (WaitTimeSeconds 1-20): queries ALL servers, waits up to 20 seconds for a message. Long polling reduces empty responses and cost.",
    keyPoints: [
      "Short polling: samples subset of servers, can return false empty responses",
      "Long polling: queries all servers, waits for a message (max 20 seconds)",
      "Set WaitTimeSeconds > 0 for long polling (max 20)",
      "Long polling recommended — reduces API calls and costs significantly",
    ],
    tags: ["sqs", "polling", "long-polling", "cost-optimization"],
  },
  {
    id: "sqs-fc-013",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question:
      "What happens when a Standard SQS queue exceeds ~120,000 in-flight messages?",
    answer:
      "SQS returns an OverLimit error for short polling ReceiveMessage calls. With long polling, no new messages are returned (no error, just empty responses). In-flight messages are those received but not yet deleted.",
    keyPoints: [
      "In-flight limit: ~120,000 for Standard queues",
      "Short polling: OverLimit error when limit exceeded",
      "Long polling: returns no messages when limit exceeded (no error)",
      "Remediation: process and delete faster, add consumers, reduce receive rate",
    ],
    tags: ["sqs", "in-flight-messages", "limits", "overlimit"],
  },
  // ─── Dead-Letter Queues ───────────────────────────────────────────────────────
  {
    id: "sqs-fc-014",
    service: "Amazon SQS",
    domain: "troubleshooting",
    difficulty: "easy",
    question:
      "What is a dead-letter queue (DLQ) and when does SQS move a message to it?",
    answer:
      "A DLQ is an ordinary SQS queue that receives messages SQS cannot process successfully. SQS moves a message to the DLQ when its ApproximateReceiveCount exceeds the maxReceiveCount in the source queue's redrive policy.",
    keyPoints: [
      "DLQ is a regular SQS queue — Standard DLQ for Standard source, FIFO DLQ for FIFO source",
      "Must be in the same AWS account and region as the source queue",
      "maxReceiveCount: number of receive attempts before dead-lettering",
      "Without a DLQ, unprocessable messages cycle in the source queue indefinitely",
    ],
    tags: ["sqs", "dlq", "dead-letter-queue", "error-handling"],
  },
  {
    id: "sqs-fc-015",
    service: "Amazon SQS",
    domain: "troubleshooting",
    difficulty: "medium",
    question:
      "How does message retention work differently for Standard vs FIFO queues when moved to a DLQ?",
    answer:
      "Standard queues: original enqueue timestamp is preserved — message continues aging against the DLQ's retention from its original send time. FIFO queues: enqueue timestamp RESETS when moved to DLQ — message gets a fresh retention window.",
    keyPoints: [
      "Standard: original timestamp preserved — DLQ retention must be LONGER than source",
      "FIFO: timestamp resets to when message arrived in DLQ",
      "Best practice: set DLQ retention to maximum (14 days)",
      "ApproximateAgeOfOldestMessage metric reflects when message moved to DLQ, not original send",
    ],
    tags: ["sqs", "dlq", "retention", "standard-vs-fifo"],
  },
  {
    id: "sqs-fc-016",
    service: "Amazon SQS",
    domain: "troubleshooting",
    difficulty: "medium",
    question:
      "What is the redrive allow policy on a DLQ, and what options are available?",
    answer:
      "The redrive allow policy controls which source queues can target the DLQ. Options: allowAll (default — any queue can use it), denyAll (cannot be used as a DLQ), or byQueue (specify up to 10 source queue ARNs).",
    keyPoints: [
      "Default: allowAll — any queue in the account/region can use the DLQ",
      "denyAll: prevents the queue from being used as a DLQ at all",
      "byQueue: restrict to up to 10 specific source queue ARNs",
      "Separate from the source queue's redrive policy (which sets maxReceiveCount)",
    ],
    tags: ["sqs", "dlq", "redrive-allow-policy"],
  },
  {
    id: "sqs-fc-017",
    service: "Amazon SQS",
    domain: "troubleshooting",
    difficulty: "hard",
    question:
      "How does DLQ redrive (StartMessageMoveTask) work and what is a critical pre-condition?",
    answer:
      "DLQ redrive replays messages from the DLQ back to the source queue (or another destination) at a configurable rate. Critical pre-condition: the underlying consumer bug MUST be fixed first — otherwise messages will just fail again and re-enter the DLQ.",
    keyPoints: [
      "API: StartMessageMoveTask (console, CLI, or SDK)",
      "Configurable replay rate to test fixes gradually",
      "Message attributes and body are preserved during redrive",
      "Fix the root cause BEFORE redriving — don't replay into a broken consumer",
    ],
    tags: ["sqs", "dlq", "redrive", "replay"],
  },
  // ─── Delay & Timers ───────────────────────────────────────────────────────────
  {
    id: "sqs-fc-018",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "easy",
    question: "What is a delay queue, and what is the maximum delay?",
    answer:
      "A delay queue postpones initial message delivery to consumers by a configured number of seconds. Default: 0 seconds. Maximum: 900 seconds (15 minutes). The message is invisible to consumers for the delay period when first added.",
    keyPoints: [
      "Hides message BEFORE first receipt (unlike visibility timeout which is after receipt)",
      "Default: 0 seconds (no delay); Maximum: 900 seconds (15 minutes)",
      "Set via DelaySeconds queue attribute",
      "For delays > 15 minutes, use Amazon EventBridge Scheduler",
    ],
    tags: ["sqs", "delay-queue", "scheduling"],
  },
  {
    id: "sqs-fc-019",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question:
      "How do message timers differ from delay queues, and which queue types support them?",
    answer:
      "Message timers use the DelaySeconds parameter in SendMessage to set a per-message delay that overrides the queue's delay setting. They are only supported on Standard queues — FIFO queues do NOT support per-message delay overrides.",
    keyPoints: [
      "Message timers: per-message DelaySeconds in SendMessage call",
      "Overrides queue-level DelaySeconds for that specific message",
      "Only on Standard queues — FIFO queues do not support message timers",
      "Same range as delay queues: 0–900 seconds",
    ],
    tags: ["sqs", "message-timers", "delay", "standard-vs-fifo"],
  },
  {
    id: "sqs-fc-020",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question:
      "Is changing the DelaySeconds setting on a queue retroactive for Standard vs FIFO queues?",
    answer:
      "Standard queues: NOT retroactive — existing messages use the delay in effect when they were sent. FIFO queues: IS retroactive — the new DelaySeconds applies to already-queued messages that haven't become visible yet.",
    keyPoints: [
      "Standard: change doesn't affect messages already in queue",
      "FIFO: change DOES affect messages already in queue",
      "Common exam trap: Standard non-retroactive vs FIFO retroactive",
    ],
    tags: ["sqs", "delay-queue", "standard-vs-fifo", "retroactive"],
  },
  // ─── Security ─────────────────────────────────────────────────────────────────
  {
    id: "sqs-fc-021",
    service: "Amazon SQS",
    domain: "security",
    difficulty: "medium",
    question:
      "When is a queue resource policy (queue policy) required vs IAM policy alone being sufficient?",
    answer:
      "A queue policy is required for cross-account access and for granting AWS services (SNS, EventBridge) access to send messages. IAM policies alone cannot grant cross-account access to SQS — both a queue policy AND IAM policy are required for cross-account users.",
    keyPoints: [
      "Same-account access: IAM policy alone is sufficient",
      "Cross-account access: BOTH queue policy AND IAM policy required",
      "AWS service access (SNS→SQS): queue policy alone is sufficient",
      "Avoid Principal=* in queue policies — creates public access",
    ],
    tags: ["sqs", "security", "iam", "queue-policy", "cross-account"],
  },
  {
    id: "sqs-fc-022",
    service: "Amazon SQS",
    domain: "security",
    difficulty: "medium",
    question:
      "What are the two SQS server-side encryption options and when should you use each?",
    answer:
      "SSE-SQS: AWS-managed key, no additional cost, no KMS API calls — use for most workloads. SSE-KMS: customer-managed key, enables audit trail/rotation/cross-account key policies — use when you need control over the key.",
    keyPoints: [
      "SSE-SQS: free, transparent, AWS manages the key",
      "SSE-KMS: incurs KMS API call costs (~$0.03/10,000 calls)",
      "SSE-KMS consumers need sqs:ReceiveMessage + kms:Decrypt",
      "SSE-KMS producers need sqs:SendMessage + kms:GenerateDataKey",
    ],
    tags: ["sqs", "encryption", "sse-sqs", "sse-kms", "security"],
  },
  {
    id: "sqs-fc-023",
    service: "Amazon SQS",
    domain: "security",
    difficulty: "hard",
    question:
      "What type of VPC endpoint does SQS use, and how is it different from S3/DynamoDB endpoints?",
    answer:
      "SQS uses an interface endpoint (AWS PrivateLink) — NOT a gateway endpoint. Interface endpoints create an ENI in your subnet with a private IP. Gateway endpoints (used by S3 and DynamoDB) modify route tables instead.",
    keyPoints: [
      "SQS endpoint type: interface endpoint (PrivateLink)",
      "S3 and DynamoDB use gateway endpoints (route table modification)",
      "Interface endpoints: ENI in your subnet, private DNS name",
      "Use aws:SourceVpce condition in queue policy to restrict to specific endpoint",
    ],
    tags: [
      "sqs",
      "vpc-endpoint",
      "privatelink",
      "interface-endpoint",
      "security",
    ],
  },
  // ─── Lambda Integration ───────────────────────────────────────────────────────
  {
    id: "sqs-fc-024",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question:
      "What IAM permissions does a Lambda execution role need to consume an SQS Standard queue?",
    answer:
      "sqs:ReceiveMessage, sqs:DeleteMessage, and sqs:GetQueueAttributes on the source queue. If SSE-KMS encrypted: also kms:Decrypt on the KMS key.",
    keyPoints: [
      "Required: sqs:ReceiveMessage, sqs:DeleteMessage, sqs:GetQueueAttributes",
      "SSE-KMS: additionally kms:Decrypt",
      "Lambda ESM manages polling automatically — no sqs:SendMessage needed",
      "Missing kms:Decrypt = empty ReceiveMessage responses, not an error",
    ],
    tags: ["sqs", "lambda", "iam", "event-source-mapping"],
  },
  {
    id: "sqs-fc-025",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question:
      "What is ReportBatchItemFailures in Lambda SQS processing, and why is it important?",
    answer:
      "FunctionResponseType=ReportBatchItemFailures enables partial batch failure: the function returns a batchItemFailures array with the messageIds of failed messages. Lambda deletes successful messages and retries only failed ones. Without it, any error retries the entire batch.",
    keyPoints: [
      "Default behavior: any error = entire batch retried",
      "ReportBatchItemFailures: return {batchItemFailures: [{itemIdentifier: messageId}]}",
      "Lambda deletes messages NOT in the failure list",
      "Critical for preventing good messages from being dead-lettered due to one bad message",
    ],
    tags: ["sqs", "lambda", "partial-batch-failure", "error-handling"],
  },
  {
    id: "sqs-fc-026",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "hard",
    question: "How does the Lambda SQS ESM scale for Standard vs FIFO queues?",
    answer:
      "Standard: starts with 5 poller instances, adds 60 more per minute until queue is drained or concurrency limit reached. FIFO: one concurrent Lambda execution per active MessageGroupId — different groups run in parallel.",
    keyPoints: [
      "Standard ESM: 5 initial pollers, +60/minute scaling",
      "FIFO ESM: max concurrency = number of active MessageGroupIds",
      "Reserved concurrency limits cap the drain rate on Standard queues",
      "Standard queue ESM BatchSize max: 10,000; FIFO ESM BatchSize max: 10",
    ],
    tags: ["sqs", "lambda", "scaling", "concurrency", "fifo"],
  },
  // ─── Performance ──────────────────────────────────────────────────────────────
  {
    id: "sqs-fc-027",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "easy",
    question:
      "What are the three SQS batch APIs and what is the maximum batch size?",
    answer:
      "SendMessageBatch (send up to 10 messages), ReceiveMessage with MaxNumberOfMessages=10 (receive up to 10), DeleteMessageBatch (delete up to 10). All batch up to 10 messages per API call.",
    keyPoints: [
      "SendMessageBatch: up to 10 messages, total request 256 KB",
      "ReceiveMessage: MaxNumberOfMessages 1–10",
      "DeleteMessageBatch: up to 10 messages by receipt handle",
      "SQS charges per API call — batching reduces cost by up to 10x",
    ],
    tags: ["sqs", "batching", "performance", "cost"],
  },
  {
    id: "sqs-fc-028",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question:
      "What is the SNS-to-SQS fan-out pattern and what problem does it solve?",
    answer:
      "A single SNS topic delivers a copy of each message to multiple subscribed SQS queues simultaneously. Solves the problem of delivering one event to multiple independent consumers without the producer needing to know about each consumer.",
    keyPoints: [
      "Publish once to SNS; each subscribed SQS queue gets its own copy",
      "Each downstream service consumes from its own independent queue",
      "Adding a new consumer = subscribing a new SQS queue to SNS (no producer changes)",
      "Cross-account: target SQS queue needs a queue policy granting SNS sqs:SendMessage",
    ],
    tags: ["sqs", "sns", "fan-out", "architecture", "pub-sub"],
  },
  {
    id: "sqs-fc-029",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "hard",
    question:
      "What is the SQS Extended Client Library and what are its key limitations?",
    answer:
      "A Java/Python library that stores messages > 1 MiB in S3 (up to 2 GB), putting a reference pointer in the SQS message. Limitations: only synchronous clients; S3 objects are NOT auto-deleted when SQS messages are deleted — must manage S3 lifecycle separately.",
    keyPoints: [
      "Available for Java and Python",
      "Producer needs s3:PutObject; consumer needs s3:GetObject",
      "S3 objects must be deleted explicitly — no auto-cleanup",
      "Only works with synchronous SQS clients (not async)",
    ],
    tags: ["sqs", "extended-client", "large-messages", "s3"],
  },
  {
    id: "sqs-fc-030",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question:
      "What CloudWatch metric should you use to auto-scale SQS consumers, and what does it measure?",
    answer:
      "ApproximateNumberOfMessagesVisible: the number of messages currently available for retrieval (queue depth). Scale out when this grows; scale in when it shrinks. ApproximateAgeOfOldestMessage is also useful for latency-sensitive workloads.",
    keyPoints: [
      "ApproximateNumberOfMessagesVisible = current queue depth",
      "Primary metric for scaling consumers up/down",
      "ApproximateAgeOfOldestMessage = oldest message age (latency sensitivity)",
      "Use Application Auto Scaling or EC2 Auto Scaling with custom CloudWatch metrics",
    ],
    tags: ["sqs", "auto-scaling", "cloudwatch", "performance"],
  },
];
