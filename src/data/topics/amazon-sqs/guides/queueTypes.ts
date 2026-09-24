import { ServiceGuide } from "../../../../types/guide";

// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html
// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html
// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html
export const queueTypesGuide: ServiceGuide = {
  id: "amazon-sqs-queue-types",
  service: "Standard vs FIFO Queues",
  domain: "development",
  tagline:
    "Choosing between at-least-once best-effort and exactly-once ordered delivery",
  intro:
    "Amazon SQS offers two fundamentally different queue types — Standard and FIFO — each making different trade-offs between throughput, ordering, and delivery guarantees. Selecting the wrong type for your workload leads to either wasted ordering constraints (using FIFO when you don't need it) or hard-to-debug duplicate processing bugs (using Standard when you need exactly-once).",

  sections: [
    {
      heading: "Standard Queues: Maximum Throughput",
      body: `Standard queues are designed for maximum throughput. They support a nearly unlimited number of API calls per second for \`SendMessage\`, \`ReceiveMessage\`, and \`DeleteMessage\` operations — there is no documented TPS ceiling. This makes Standard queues appropriate for high-volume workloads like log ingestion, event processing, and task queuing where throughput is the priority.

Standard queues provide **at-least-once delivery**: every message is delivered at least once, but occasionally a copy may be delivered more than once. This happens because SQS replicates messages across multiple servers, and in rare cases a consumer may receive a message that was already delivered and deleted. Your consumers must be **idempotent** — processing the same message twice should produce the same result as processing it once.

Standard queues also provide **best-effort ordering**: messages are generally delivered in the order they were sent, but no strict FIFO guarantee is made. If ordering is critical to your application's correctness, use a FIFO queue instead.`,
      quiz: [
        {
          question:
            "A Standard SQS queue occasionally delivers the same message twice. What property must your consumer implement to handle this safely?",
          options: [
            "Transactional processing",
            "Idempotency",
            "At-least-once acknowledgment",
            "Message deduplication using the MessageDeduplicationId field",
          ],
          correctIndex: 1,
          explanation:
            "Idempotency means that processing a message multiple times produces the same result as processing it once. Because Standard queues guarantee at-least-once delivery, duplicates can occur. MessageDeduplicationId is a FIFO queue feature — it is not available on Standard queues. Consumers on Standard queues must be designed to handle duplicate delivery.",
        },
      ],
    },
    {
      heading: "FIFO Queues: Ordering and Exactly-Once",
      body: `FIFO queues provide two guarantees that Standard queues do not: strict ordering within a message group, and exactly-once processing. FIFO queue names must end with the \`.fifo\` suffix. Messages are grouped by a **MessageGroupId** — within a single group, messages are delivered in the exact order they were sent and each message is processed exactly once. Different message groups can be processed in parallel.

Exactly-once processing is enabled by **content-based deduplication** or an explicit **MessageDeduplicationId**. If you enable content-based deduplication, SQS generates a deduplication hash from the message body. If you provide a \`MessageDeduplicationId\`, SQS rejects duplicate messages with the same ID within a 5-minute deduplication interval. This prevents consumers from processing the same logical event twice even if a producer retries a send.

FIFO queues are ideal for use cases where order or exactly-once semantics matter: financial transactions, order processing workflows, inventory adjustments, or any system where processing an event twice would cause incorrect state.`,
      quiz: [
        {
          question:
            "A FIFO queue consumer is processing messages for multiple orders simultaneously. Order #1 has 3 messages in sequence. What ensures messages for Order #1 are processed in order while messages for Order #2 proceed in parallel?",
          options: [
            "Setting a unique MessageDeduplicationId for each order",
            "Using a separate FIFO queue per order",
            "Setting the MessageGroupId to the order ID for all messages in that order",
            "Enabling content-based deduplication on the FIFO queue",
          ],
          correctIndex: 2,
          explanation:
            "MessageGroupId groups messages that must be processed in strict FIFO order within that group. Messages in different groups (e.g., order #1 vs order #2) are independent and can be processed in parallel. MessageDeduplicationId prevents duplicate delivery — it does not control ordering. Using separate queues per order would require creating thousands of queues, which doesn't scale.",
        },
      ],
    },
    {
      heading: "FIFO Throughput: Standard Mode vs High-Throughput Mode",
      body: `FIFO queues have throughput limits that Standard queues do not. In **standard FIFO mode**, each API action (\`SendMessage\`, \`ReceiveMessage\`, \`DeleteMessage\`) is limited to 300 transactions per second (TPS). With batching (up to 10 messages per call), this translates to 3,000 messages per second. This is sufficient for most ordered-processing workloads but may be limiting for high-volume applications.

**High-throughput FIFO mode** removes this constraint. Throughput limits in high-throughput mode vary by AWS Region: US East (N. Virginia), US West (Oregon), and Europe (Ireland) support up to 70,000 TPS per API action (700,000 messages/second with batching). Other regions have lower but still substantial limits. To maximize throughput in high-throughput FIFO mode, distribute messages across many different \`MessageGroupId\` values — messages within a single group are still processed sequentially, so more groups = more parallelism.

High-throughput mode can be enabled on an existing FIFO queue without recreating it. Once enabled, the queue still maintains all FIFO ordering and deduplication guarantees — you only gain throughput capacity.`,
      quiz: [
        {
          question:
            "A FIFO queue in standard mode is receiving 500 messages per second, all with the same MessageGroupId. What will happen?",
          options: [
            "SQS will automatically enable high-throughput mode to handle the load",
            "SQS will throttle requests once the 300 TPS limit is exceeded",
            "Messages will be delivered out of order to accommodate the higher rate",
            "The queue will convert to a Standard queue to handle the throughput",
          ],
          correctIndex: 1,
          explanation:
            "Standard FIFO mode is limited to 300 TPS per API action. If you send 500 messages per second, SQS will throttle (reject with ThrottlingException) once the limit is exceeded. Using a single MessageGroupId also limits parallelism. To handle higher throughput, enable high-throughput FIFO mode and/or distribute messages across multiple MessageGroupId values.",
        },
      ],
    },
    {
      heading: "Choosing the Right Queue Type",
      body: `The decision between Standard and FIFO queues comes down to three questions: Do you need strict message ordering? Do you need exactly-once processing guarantees? Can your application tolerate duplicate messages?

Use **Standard queues** when: throughput is the priority, your consumers are idempotent, ordering is not critical to correctness (or you handle ordering in your application), or you need more than 300 TPS in ordered-processing mode. Examples: email delivery pipelines, background job queues, log aggregation, fanout subscribers.

Use **FIFO queues** when: message order within a logical group must be preserved, duplicate processing would cause incorrect state (financial adjustments, inventory decrements, state machine transitions), or you need exactly-once semantics enforced at the queue level rather than in application logic. Examples: e-commerce order processing, stock trade execution, change-data-capture consumers, audit log pipelines.

A common mistake is defaulting to FIFO "just to be safe." FIFO queues have lower throughput in standard mode, require a \`.fifo\` name suffix, and the deduplication window means producers must track MessageDeduplicationId within a 5-minute window. Use FIFO only when its guarantees provide value you'd otherwise have to implement yourself.`,
      quiz: [
        {
          question:
            "You are building a background job queue that runs image resize tasks. The same image being resized twice is harmless. You expect 2,000 messages per second. Which queue type should you choose?",
          options: [
            "FIFO queue in standard mode",
            "FIFO queue in high-throughput mode",
            "Standard queue",
            "Standard queue with content-based deduplication enabled",
          ],
          correctIndex: 2,
          explanation:
            "This workload is a perfect fit for a Standard queue: throughput (2,000 msg/s) exceeds FIFO standard mode limits (300 TPS), the task is idempotent (resizing the same image twice is harmless), and ordering is irrelevant for independent image resize jobs. Content-based deduplication is a FIFO feature — it is not available on Standard queues. High-throughput FIFO would work but is unnecessary overhead when Standard is sufficient.",
        },
      ],
    },
    {
      heading: "FIFO Deduplication: Content-Based vs Explicit IDs",
      body: `FIFO queues prevent duplicate messages through a 5-minute deduplication window. Two deduplication strategies are available. With **content-based deduplication**, SQS computes a SHA-256 hash of the message body and uses it as the deduplication ID. Any two messages with identical bodies sent within 5 minutes of each other to the same \`MessageGroupId\` are treated as duplicates; the second is silently discarded. This is convenient but breaks if two legitimately different messages happen to have identical bodies.

With **explicit MessageDeduplicationId**, your producer generates and attaches a unique deduplication ID to each message. This gives you full control — you can make the ID meaningful (an idempotency key from your database, a request UUID, or a content hash you compute yourself). If you retry a failed send with the same \`MessageDeduplicationId\` within 5 minutes, SQS will reject the duplicate silently. After 5 minutes, the same ID can be reused.

The deduplication window is always exactly 5 minutes and cannot be configured. If your producer needs to resend a message after more than 5 minutes for any reason, a new \`MessageDeduplicationId\` must be used. Content-based deduplication and explicit IDs cannot be mixed on the same message — you must use one or the other per queue.`,
      quiz: [
        {
          question:
            "A producer sends a message to a FIFO queue with MessageDeduplicationId='order-123'. Due to a network timeout, the producer retries the send 2 minutes later with the same MessageDeduplicationId='order-123'. What happens?",
          options: [
            "The second message is delivered and both copies are in the queue",
            "The second message is rejected as a duplicate; only the original is delivered",
            "The second message replaces the first message in the queue",
            "An error is returned because duplicate MessageDeduplicationIds are not allowed",
          ],
          correctIndex: 1,
          explanation:
            "FIFO queues maintain a 5-minute deduplication window. If a message with the same MessageDeduplicationId is sent within 5 minutes, SQS silently discards the duplicate — the producer receives a success response but the message is not added to the queue again. This enables safe producer retries without duplicate processing. After 5 minutes, the same ID can be used again for a new message.",
        },
      ],
    },
  ],

  keyFacts: [
    "Standard queues: at-least-once delivery, best-effort ordering, unlimited throughput",
    "FIFO queues: exactly-once processing, strict ordering per MessageGroupId",
    "FIFO queue names must end with .fifo suffix",
    "FIFO standard mode: 300 TPS per API action (3,000 msg/s with batching of 10)",
    "FIFO high-throughput mode: up to 70,000 TPS in us-east-1/us-west-2/eu-west-1",
    "FIFO deduplication window: 5 minutes — same MessageDeduplicationId within 5 min is rejected",
    "Content-based deduplication uses SHA-256 hash of the message body",
    "MessageGroupId required for all messages sent to a FIFO queue",
    "Messages within the same MessageGroupId are processed in strict FIFO order",
    "Different MessageGroupIds can be processed in parallel for higher throughput",
    "Standard queue consumers MUST be idempotent — duplicates can occur",
  ],

  relatedServices: [
    "Amazon SNS",
    "AWS Lambda",
    "Amazon EventBridge",
    "AWS Step Functions",
  ],

  examTips: [
    "FIFO queue name must end with .fifo — creating one without this suffix will fail",
    "If you need > 300 TPS with ordering, enable high-throughput FIFO mode, don't switch to Standard",
    "Use many different MessageGroupIds to maximize FIFO throughput through parallelism",
    "Content-based deduplication breaks if two legitimately different messages have identical bodies",
    "The 5-minute deduplication window is fixed — it cannot be extended or shortened",
    "Standard queue consumers must handle duplicate delivery — design for idempotency first",
    "FIFO doesn't guarantee ordering ACROSS different message groups, only within a single group",
  ],
};
