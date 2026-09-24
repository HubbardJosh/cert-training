import { QuizQuestion } from "../../../types";

// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html
// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html
// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html
export const quizQuestions: QuizQuestion[] = [
  // ─── Overview ─────────────────────────────────────────────────────────────────
  {
    id: "sqs-qq-001",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question:
      "A producer sends an order event to an SQS queue. The consumer service is temporarily down for maintenance. What happens to the message?",
    options: [
      "The message is lost because no consumer was available to receive it",
      "The message is returned to the producer with an error",
      "The message is stored in the queue and delivered when the consumer comes back online",
      "SQS automatically retries delivery every 30 seconds until the consumer is available",
    ],
    correctIndices: [2],
    explanation:
      "SQS stores messages durably until they are consumed or the retention period expires (default 4 days, max 14 days). When the consumer service comes back online and polls the queue, it will receive the message. This durability is the core value proposition of SQS — producers and consumers operate independently.",
    optionExplanations: [
      "Incorrect. SQS stores messages redundantly across multiple servers. The message is not lost if no consumer is available.",
      "Incorrect. SQS is asynchronous — the producer's SendMessage call succeeds regardless of consumer availability.",
      "Correct. SQS persists the message until a consumer retrieves it or the retention period expires.",
      "Incorrect. SQS does not actively push or retry delivery. Consumers poll the queue on their own schedule.",
    ],
    tags: ["sqs", "overview", "durability", "decoupling"],
  },
  {
    id: "sqs-qq-002",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A consumer receives a message from an SQS queue and successfully processes it but forgets to call DeleteMessage. The visibility timeout is 5 minutes. What is the consequence?",
    options: [
      "Nothing — SQS detects that the message was processed and removes it automatically",
      "The message is moved to the dead-letter queue after the timeout expires",
      "The message becomes visible again after 5 minutes and will be redelivered to a consumer",
      "The producer is notified that the message was not acknowledged",
    ],
    correctIndices: [2],
    explanation:
      "SQS uses an explicit delete model: consumers MUST call DeleteMessage to permanently remove a message. If DeleteMessage is not called before the visibility timeout expires, the message becomes visible again and will be redelivered. SQS has no built-in processing detection. The message only goes to the DLQ if its receive count exceeds maxReceiveCount.",
    optionExplanations: [
      "Incorrect. SQS does not detect processing success. Only an explicit DeleteMessage call removes the message.",
      "Incorrect. A single missed delete does not trigger DLQ routing. The message is simply redelivered; DLQ routing requires exceeding maxReceiveCount.",
      "Correct. After the 5-minute visibility timeout, the message returns to the visible state and will be returned to the next ReceiveMessage call.",
      "Incorrect. SQS is fully decoupled — producers have no visibility into consumer processing or acknowledgment.",
    ],
    tags: ["sqs", "visibility-timeout", "delete-message", "message-lifecycle"],
  },
  {
    id: "sqs-qq-003",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question:
      "Which statement correctly describes the difference between Amazon SQS and Amazon SNS?",
    options: [
      "SQS is synchronous; SNS is asynchronous",
      "SQS delivers each message to one consumer; SNS can deliver each message to multiple subscribers simultaneously",
      "SQS supports fan-out to multiple consumers; SNS supports only point-to-point delivery",
      "SQS requires a broker configuration; SNS is fully serverless",
    ],
    correctIndices: [1],
    explanation:
      "SQS is a queue — each message is retrieved by one consumer (the first to call ReceiveMessage during the visibility timeout window). SNS is a pub/sub service — publishing one message to an SNS topic delivers a copy to every subscriber (SQS queues, Lambda, HTTP endpoints, etc.) simultaneously. Both services are asynchronous and fully managed.",
    optionExplanations: [
      "Incorrect. Both SQS and SNS are asynchronous messaging services.",
      "Correct. This is the fundamental architectural difference: SQS = point-to-point, SNS = fan-out pub/sub.",
      "Incorrect. This is backwards — SNS fans out to multiple subscribers, SQS delivers to one consumer per message.",
      "Incorrect. Both SQS and SNS are fully managed serverless services. Neither requires broker configuration.",
    ],
    tags: ["sqs", "sns", "comparison", "pub-sub", "fan-out"],
  },
  // ─── Standard vs FIFO ─────────────────────────────────────────────────────────
  {
    id: "sqs-qq-004",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A financial trading system processes buy and sell orders. Each order must be executed exactly once and in the exact sequence it was submitted. Which SQS queue type and configuration should you use?",
    options: [
      "Standard queue with idempotent consumers",
      "Standard queue with deduplication logic in the application",
      "FIFO queue with MessageGroupId set to the trader's account ID",
      "FIFO queue with content-based deduplication enabled and a single MessageGroupId for all orders",
    ],
    correctIndices: [2],
    explanation:
      "A FIFO queue provides exactly-once processing and strict ordering within a MessageGroupId. Using the trader's account ID as the MessageGroupId ensures each trader's orders are processed in sequence, while different traders' orders can be processed in parallel — maximizing throughput without sacrificing per-trader order integrity. A single MessageGroupId for all orders would serialize all trading activity.",
    optionExplanations: [
      "Incorrect. Standard queues provide at-least-once delivery and best-effort ordering — both are unacceptable for financial order execution.",
      "Incorrect. Application-level deduplication on a Standard queue can handle duplicates but cannot guarantee ordering.",
      "Correct. FIFO queue + trader account ID as MessageGroupId guarantees per-trader ordering and exactly-once processing while allowing parallel processing across different traders.",
      "Partially correct but suboptimal. A single MessageGroupId serializes ALL orders globally, creating a throughput bottleneck. Per-trader MessageGroupIds allow parallelism.",
    ],
    tags: ["sqs", "fifo", "ordering", "message-group-id", "financial"],
  },
  {
    id: "sqs-qq-005",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "hard",
    type: "single",
    question:
      "A FIFO queue in standard mode is receiving 200 messages per second with 20 different MessageGroupIds. You need to scale to 800 messages per second with ordering maintained. What is the correct approach?",
    options: [
      "Switch to a Standard queue — Standard queues have no throughput limit",
      "Enable high-throughput FIFO mode on the existing queue",
      "Create 4 FIFO queues and route messages by MessageGroupId hash",
      "Increase maxReceiveCount to allow more concurrent consumers",
    ],
    correctIndices: [1],
    explanation:
      "High-throughput FIFO mode raises the per-API-action limit from 300 TPS to up to 70,000 TPS in supported regions (us-east-1, us-west-2, eu-west-1), while maintaining all FIFO ordering and deduplication guarantees. It can be enabled on an existing FIFO queue without recreating it. 800 msg/s is well within high-throughput FIFO limits. Switching to Standard would lose ordering guarantees.",
    optionExplanations: [
      "Incorrect. Switching to Standard would eliminate the ordering guarantee that the requirement specifies must be maintained.",
      "Correct. High-throughput FIFO mode enables up to 70,000 TPS per API action while preserving ordering and exactly-once semantics.",
      "Incorrect. Multiple FIFO queues would require cross-queue ordering logic, which is complex and fragile. High-throughput mode is simpler.",
      "Incorrect. maxReceiveCount is the DLQ redrive threshold — it has no effect on throughput.",
    ],
    tags: ["sqs", "fifo", "high-throughput", "scaling"],
  },
  {
    id: "sqs-qq-006",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A FIFO queue has content-based deduplication enabled. A producer sends two different messages with identical bodies within 3 minutes. What happens?",
    options: [
      "Both messages are delivered because they were sent at different times",
      "The second message is silently rejected — content-based deduplication uses the message body hash as the deduplication ID",
      "SQS returns a DuplicateMessageException for the second message",
      "The second message overwrites the first in the queue",
    ],
    correctIndices: [1],
    explanation:
      "Content-based deduplication computes a SHA-256 hash of the message body and uses it as the MessageDeduplicationId. Two messages with identical bodies sent to the same MessageGroupId within 5 minutes are treated as duplicates. The second send returns a success response but the message is not added to the queue. This is a gotcha: if two legitimately different messages happen to have identical bodies, one will be dropped.",
    optionExplanations: [
      "Incorrect. Content-based deduplication does not consider the send timestamp — only the message body hash within the 5-minute window.",
      "Correct. The SHA-256 hash of identical bodies produces the same deduplication ID, causing the second message to be silently discarded.",
      "Incorrect. SQS returns a success response even for duplicate messages — the duplicate is silently dropped, not rejected with an error.",
      "Incorrect. SQS does not support message replacement. The second message is discarded, not used to update the first.",
    ],
    tags: ["sqs", "fifo", "deduplication", "content-based"],
  },
  // ─── Visibility & Polling ─────────────────────────────────────────────────────
  {
    id: "sqs-qq-007",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A consumer is processing SQS messages that take variable amounts of time (30 seconds to 10 minutes). The queue's visibility timeout is 2 minutes. What pattern should you implement to prevent premature redelivery?",
    options: [
      "Set the queue visibility timeout to 10 minutes to cover the worst case",
      "Delete the message at the start of processing, before it completes",
      "Implement a heartbeat: periodically call ChangeMessageVisibility to extend the timeout while processing",
      "Use FIFO queues, which automatically extend the visibility timeout for long-running messages",
    ],
    correctIndices: [2],
    explanation:
      "The heartbeat pattern uses a background thread to periodically call ChangeMessageVisibility, resetting the countdown while the main thread processes. This handles variable processing times without setting an excessively long static timeout (which would delay retries on failure). Setting the timeout to max (10 min) means a crashed consumer delays retry by 10 minutes. Deleting before processing completes risks data loss if processing fails.",
    optionExplanations: [
      "Suboptimal. Setting timeout to worst case (10 minutes) means a consumer crash causes a 10-minute retry delay, even for messages that process in 30 seconds.",
      "Dangerous. Deleting before processing completes means if the consumer crashes, the message is permanently lost.",
      "Correct. A heartbeat pattern (background thread calling ChangeMessageVisibility) dynamically extends the timeout while processing is active, providing both safety and flexibility.",
      "Incorrect. FIFO queues do not automatically extend visibility timeouts. The behavior is the same as Standard queues — you must call ChangeMessageVisibility explicitly.",
    ],
    tags: [
      "sqs",
      "visibility-timeout",
      "heartbeat",
      "change-message-visibility",
    ],
  },
  {
    id: "sqs-qq-008",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question:
      "Your team is running 10 consumer threads on a low-traffic SQS queue (3 messages/hour). Monitoring shows thousands of empty ReceiveMessage API responses per hour. What is the best fix?",
    options: [
      "Reduce the number of consumer threads from 10 to 1",
      "Enable long polling by setting WaitTimeSeconds=20 on ReceiveMessage calls or on the queue",
      "Increase the visibility timeout to reduce how often messages are redelivered",
      "Set MaxNumberOfMessages=10 to retrieve more messages per call",
    ],
    correctIndices: [1],
    explanation:
      "Empty responses occur when short polling returns no messages (the default, WaitTimeSeconds=0). Long polling (WaitTimeSeconds=1–20) holds the connection open until a message arrives or the wait time expires, eliminating most empty responses. This reduces API call volume and cost significantly. Visibility timeout and MaxNumberOfMessages don't affect empty response frequency.",
    optionExplanations: [
      "This reduces API volume by 10x but doesn't address the root cause (short polling). Long polling is more effective.",
      "Correct. Long polling queries all SQS servers and waits up to WaitTimeSeconds for a message, dramatically reducing empty responses.",
      "Incorrect. Visibility timeout controls how long a received message stays invisible — it has no effect on empty response frequency.",
      "Incorrect. MaxNumberOfMessages controls how many messages to retrieve per call, but it doesn't reduce empty responses on a low-traffic queue.",
    ],
    tags: ["sqs", "long-polling", "cost-optimization", "empty-responses"],
  },
  {
    id: "sqs-qq-009",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "hard",
    type: "single",
    question:
      "A consumer receives a message from an SQS queue, determines it cannot process the message right now (downstream service is unavailable), and wants to immediately make the message available for another consumer to pick up. What should the consumer do?",
    options: [
      "Call DeleteMessage — then resend the message to the queue manually",
      "Call ChangeMessageVisibility with VisibilityTimeout=0",
      "Wait for the visibility timeout to expire naturally",
      "Call ReceiveMessage again — this automatically releases the previous message",
    ],
    correctIndices: [1],
    explanation:
      "Calling ChangeMessageVisibility with VisibilityTimeout=0 immediately makes the message visible again, available for any consumer to receive. This is the clean way to 'release' a message back to the queue without waiting for the visibility timeout to expire. Deleting and resending creates a new message (different messageId, different receive count). Waiting wastes time. Calling ReceiveMessage again does not affect previously received messages.",
    optionExplanations: [
      "Incorrect. Deleting and resending is wasteful and resets the receive count, potentially never triggering DLQ routing for a persistently unprocessable message.",
      "Correct. ChangeMessageVisibility with VisibilityTimeout=0 immediately releases the message to the visible state for other consumers.",
      "Suboptimal. Waiting for the natural timeout works but delays availability by the full timeout duration (up to 12 hours in extreme cases).",
      "Incorrect. Calling ReceiveMessage again is independent of previously received messages — those remain in their visibility timeout window.",
    ],
    tags: [
      "sqs",
      "visibility-timeout",
      "change-message-visibility",
      "poison-message",
    ],
  },
  // ─── Dead-Letter Queues ───────────────────────────────────────────────────────
  {
    id: "sqs-qq-010",
    service: "Amazon SQS",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    question:
      "A Standard SQS queue has a 3-day retention period and a configured DLQ with a 3-day retention period. A message is sent to the source queue and fails processing for 2 days before being dead-lettered. How long will the message remain in the DLQ?",
    options: [
      "3 days — the DLQ retention resets when the message arrives",
      "1 day — the message continues aging from its original enqueue timestamp",
      "3 days — FIFO queues reset the timestamp, Standard queues do not",
      "The message is immediately deleted because it has already been in the system for 2 days",
    ],
    correctIndices: [1],
    explanation:
      "For Standard queues, the original enqueue timestamp is preserved when a message moves to the DLQ. The message continues aging against its original send time. With a 3-day retention on both queues and 2 days already elapsed, the message has only 1 day remaining before SQS deletes it. This is why the DLQ retention period must always be set longer than the source queue's retention period.",
    optionExplanations: [
      "Incorrect. For Standard queues, the timestamp is NOT reset when moving to the DLQ. Only FIFO queues reset the timestamp.",
      "Correct. Original enqueue timestamp is preserved for Standard queues — only 1 day remains against the 3-day DLQ retention.",
      "Incorrect. This is backwards: Standard queues preserve the timestamp, FIFO queues reset it.",
      "Incorrect. SQS respects the full retention period from the original enqueue time — the message still has 1 day remaining.",
    ],
    tags: ["sqs", "dlq", "retention", "standard-queue"],
  },
  {
    id: "sqs-qq-011",
    service: "Amazon SQS",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    question:
      "You want to receive an alert when any message enters your SQS dead-letter queue. Which CloudWatch metric and alarm threshold should you configure?",
    options: [
      "ApproximateAgeOfOldestMessage > 0 seconds",
      "NumberOfMessagesSent > 0 on the DLQ",
      "ApproximateNumberOfMessagesVisible > 0 on the DLQ",
      "NumberOfMessagesDeleted < 1 on the source queue",
    ],
    correctIndices: [2],
    explanation:
      "ApproximateNumberOfMessagesVisible measures how many messages are available for consumption in the queue. Alarming when this metric goes above 0 on the DLQ means you're alerted as soon as any message fails enough times to be dead-lettered. NumberOfMessagesSent also works but is less direct (depends on CloudWatch data availability). ApproximateAgeOfOldestMessage is useful for latency monitoring but also works.",
    optionExplanations: [
      "Possible but indirect. ApproximateAgeOfOldestMessage tells you how old the oldest message is, which implies messages exist, but it lags and is harder to threshold correctly.",
      "NumberOfMessagesSent works but requires careful setup — it measures sends to the DLQ but has delayed metric availability.",
      "Correct. ApproximateNumberOfMessagesVisible > 0 on the DLQ is the direct, immediate signal that dead-lettered messages exist and need attention.",
      "Incorrect. Monitoring deletes on the source queue doesn't tell you if messages moved to the DLQ.",
    ],
    tags: ["sqs", "dlq", "cloudwatch", "monitoring", "alarms"],
  },
  {
    id: "sqs-qq-012",
    service: "Amazon SQS",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "multi",
    question:
      "You discover 500 messages in a DLQ after a bug caused consumers to fail. You fix the bug and want to safely replay the messages. Which TWO actions should you take?",
    options: [
      "Delete the DLQ and let the source queue automatically redeliver the messages",
      "Verify the consumer fix is deployed before starting the replay",
      "Use DLQ redrive (StartMessageMoveTask) with a limited replay rate to validate the fix",
      "Increase maxReceiveCount to 50 so messages have more retry attempts next time",
      "Recreate the source queue to clear any corrupted state",
    ],
    correctIndices: [1, 2],
    explanation:
      "Safe DLQ replay requires two steps: (1) confirm the fix is deployed — replaying into a broken consumer re-dead-letters everything, and (2) use DLQ redrive with a limited rate to validate the fix on a subset of messages before full replay. Deleting the DLQ loses the messages. Increasing maxReceiveCount affects future messages, not the already dead-lettered ones. Recreating the source queue is unnecessary and destructive.",
    optionExplanations: [
      "Incorrect. Deleting the DLQ permanently loses all 500 messages.",
      "Correct. Always verify the fix is in production before replaying — otherwise you'll just re-dead-letter all 500 messages.",
      "Correct. DLQ redrive with a limited rate lets you replay a small batch first to confirm the fix works before replaying all 500 messages.",
      "Incorrect. maxReceiveCount only affects future messages — it doesn't replay or recover already dead-lettered messages.",
      "Incorrect. Recreating the source queue is a destructive operation that's completely unnecessary for DLQ replay.",
    ],
    tags: ["sqs", "dlq", "redrive", "replay", "operations"],
  },
  // ─── Delay & Timers ───────────────────────────────────────────────────────────
  {
    id: "sqs-qq-013",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "You change a Standard SQS queue's DelaySeconds from 30 to 120. There are 500 messages currently in the queue that were sent while the delay was 30 seconds. What happens to those 500 messages?",
    options: [
      "They are now delayed for 120 seconds from when they were originally sent",
      "They become visible immediately because the change triggers a reset",
      "They remain delayed for 30 seconds from their original send time — the change is not retroactive",
      "SQS deletes and resends them with the new 120-second delay",
    ],
    correctIndices: [2],
    explanation:
      "For Standard queues, changing the DelaySeconds attribute is NOT retroactive. Messages already in the queue retain the delay that was in effect when they were sent. The 500 messages will become visible 30 seconds after they were sent, as originally configured. Only newly sent messages (after the change) will use the 120-second delay. FIFO queues behave differently — their delay changes ARE retroactive.",
    optionExplanations: [
      "Incorrect. Standard queues do not retroactively apply delay changes to existing messages.",
      "Incorrect. Changing the delay setting does not trigger any reset of existing messages.",
      "Correct. Standard queue delay changes are not retroactive — existing messages use their original delay value.",
      "Incorrect. SQS does not delete and resend messages when queue attributes change.",
    ],
    tags: ["sqs", "delay-queue", "retroactive", "standard-queue"],
  },
  {
    id: "sqs-qq-014",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "You need a specific SQS message to be processed 20 minutes from now. The queue has DelaySeconds=0. What should you do?",
    options: [
      "Send the message with DelaySeconds=1200 (20 minutes)",
      "Use Amazon EventBridge Scheduler to call SendMessage 20 minutes from now",
      "Send the message now and have the consumer check the message timestamp and re-queue if too early",
      "Change the queue DelaySeconds to 1200 before sending, then change it back",
    ],
    correctIndices: [1],
    explanation:
      "The maximum SQS delay (delay queues and message timers) is 900 seconds (15 minutes). 20 minutes exceeds this limit. Amazon EventBridge Scheduler is the AWS-recommended solution for scheduling beyond 15 minutes — it can call SendMessage at any future time. Option A would fail because 1200 seconds exceeds the maximum DelaySeconds of 900. Option C creates complex application logic that's an anti-pattern. Option D temporarily changes the queue delay affecting all producers.",
    optionExplanations: [
      "Incorrect. The maximum DelaySeconds value is 900 seconds (15 minutes). 1200 seconds would be rejected by the API.",
      "Correct. EventBridge Scheduler supports arbitrary future scheduling with no time limitation, and can call sqs:SendMessage at any specified future time.",
      "Incorrect. Having consumers re-queue messages is an anti-pattern that wastes API calls and complicates consumer logic.",
      "Incorrect. Temporarily changing the queue delay affects all messages sent during that window, not just the one target message. Use message timers for per-message delays.",
    ],
    tags: ["sqs", "delay", "eventbridge-scheduler", "scheduling"],
  },
  // ─── Security ─────────────────────────────────────────────────────────────────
  {
    id: "sqs-qq-015",
    service: "Amazon SQS",
    domain: "security",
    difficulty: "hard",
    type: "single",
    question:
      "An SNS topic in AWS Account A needs to publish messages to an SQS queue in AWS Account B. What configuration is required?",
    options: [
      "An IAM role in Account A with trust policy allowing SNS and sqs:SendMessage on Account B's queue",
      "A queue policy on Account B's SQS queue granting sqs:SendMessage to Account A's SNS topic ARN as Principal",
      "Both an IAM policy in Account A and a queue policy in Account B",
      "A VPC peering connection between the two accounts",
    ],
    correctIndices: [1],
    explanation:
      "For an AWS service (SNS) in Account A to send to an SQS queue in Account B, a queue resource policy on the target SQS queue is sufficient. The queue policy grants sqs:SendMessage with the SNS topic ARN as the Principal. No IAM role in Account A is needed for service-to-service cross-account access — the queue policy alone authorizes the action. VPC peering is irrelevant for SQS API calls.",
    optionExplanations: [
      "Incorrect. SNS uses the queue's resource policy for cross-account authorization — an IAM role in Account A is not required for service-to-account access patterns.",
      "Correct. A queue policy on Account B's SQS queue granting sqs:SendMessage to the SNS topic ARN is the correct and sufficient mechanism.",
      "Incorrect. Both policies are required when a human IAM user/role in Account A needs access. For AWS service-to-resource cross-account access, the resource policy alone is sufficient.",
      "Incorrect. SQS API calls are internet-routable by default; VPC peering is irrelevant. A VPC endpoint would be needed for private network access, not cross-account authorization.",
    ],
    tags: ["sqs", "security", "cross-account", "queue-policy", "sns"],
  },
  {
    id: "sqs-qq-016",
    service: "Amazon SQS",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "A Lambda function has sqs:ReceiveMessage permission on an SSE-KMS encrypted SQS queue but receives empty responses despite messages being present. What is the most likely cause?",
    options: [
      "Lambda functions cannot consume SSE-KMS encrypted SQS queues",
      "The Lambda execution role is missing kms:Decrypt permission on the KMS key",
      "The Lambda function needs sqs:GetQueueAttributes to decrypt messages",
      "SSE-KMS requires the consumer to call a separate KMS decrypt API before reading messages",
    ],
    correctIndices: [1],
    explanation:
      "When an SQS queue uses SSE-KMS, SQS must call KMS to decrypt messages before returning them. If the Lambda execution role lacks kms:Decrypt on the KMS key used by the queue, SQS cannot decrypt the messages — the ReceiveMessage call succeeds but returns no messages (empty response). The Lambda SDK handles KMS transparently — no separate decrypt call is needed. sqs:GetQueueAttributes is required for the ESM setup, not message decryption.",
    optionExplanations: [
      "Incorrect. Lambda can consume SSE-KMS encrypted SQS queues — the function just needs appropriate KMS permissions.",
      "Correct. Missing kms:Decrypt causes ReceiveMessage to return empty responses — SQS can't decrypt to return the messages.",
      "Incorrect. sqs:GetQueueAttributes is needed by the event source mapping for queue metadata, not for message decryption.",
      "Incorrect. The SQS SDK and Lambda runtime handle KMS decryption transparently — application code reads the plaintext message body directly.",
    ],
    tags: ["sqs", "security", "sse-kms", "lambda", "kms-decrypt"],
  },
  {
    id: "sqs-qq-017",
    service: "Amazon SQS",
    domain: "security",
    difficulty: "medium",
    type: "multi",
    question:
      "A compliance team requires that all data in an SQS queue be encrypted and that traffic never leave the AWS network. Which TWO configurations achieve these requirements?",
    options: [
      "Enable SSE-SQS or SSE-KMS encryption on the queue",
      "Create an SQS VPC interface endpoint (PrivateLink) and update consumer configurations to use it",
      "Enable SSL/TLS termination on the SQS queue",
      "Configure a VPC gateway endpoint for SQS",
      "Set a queue policy with aws:SecureTransport=false in a Deny statement",
    ],
    correctIndices: [0, 1],
    explanation:
      "Two requirements: (1) data encrypted at rest = SSE-SQS or SSE-KMS; (2) traffic never leaves AWS network = SQS VPC interface endpoint (PrivateLink). SSE-SQS is sufficient for encryption at rest without additional cost. A VPC interface endpoint routes all SQS API calls through the AWS backbone. There is no SSL termination on SQS queues — encryption in transit is handled by HTTPS. SQS uses interface endpoints, NOT gateway endpoints (those are S3 and DynamoDB only).",
    optionExplanations: [
      "Correct. SSE-SQS or SSE-KMS encrypts all messages at rest in the queue.",
      "Correct. A VPC interface endpoint (PrivateLink) keeps all SQS API traffic within the AWS network, never traversing the public internet.",
      "Incorrect. There is no concept of SSL/TLS termination configuration on an SQS queue itself. Use HTTPS clients and the aws:SecureTransport queue policy condition.",
      "Incorrect. SQS does NOT support gateway endpoints — only S3 and DynamoDB have gateway endpoints. SQS uses interface endpoints.",
      "Incorrect. This enforces HTTPS in transit but does not prevent traffic from traversing the public internet — a VPC endpoint is needed for that.",
    ],
    tags: ["sqs", "security", "encryption", "vpc-endpoint", "compliance"],
  },
  // ─── Lambda Integration ───────────────────────────────────────────────────────
  {
    id: "sqs-qq-018",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "hard",
    type: "single",
    question:
      "A Lambda function processes SQS batches of 10 messages. In a batch of 10, message 3 contains invalid data that causes the function to throw an exception. Messages 1, 2, 4–10 are valid and should not be retried. What is the correct implementation?",
    options: [
      "Set BatchSize=1 so each message is processed independently",
      "Catch the exception for message 3, process all other messages, then throw the exception at the end",
      "Enable ReportBatchItemFailures on the ESM and return a batchItemFailures response listing only message 3's messageId",
      "Manually call sqs:DeleteMessage for messages 1, 2, 4–10 within the function, then throw for message 3",
    ],
    correctIndices: [2],
    explanation:
      "ReportBatchItemFailures (FunctionResponseType=ReportBatchItemFailures on the ESM) is the designed solution: process all messages, catch per-message errors, and return a response body with batchItemFailures listing only the failed messageIds. Lambda deletes all messages NOT in the list and retries only those in the list. BatchSize=1 prevents batching entirely (kills throughput). Manually deleting is fragile. Throwing at the end retries the entire batch.",
    optionExplanations: [
      "Works functionally but sacrifices throughput and is not the designed solution for batch processing.",
      "Incorrect. Throwing an exception at the end (even after processing others) causes Lambda to retry the entire batch — all 10 messages are redelivered.",
      "Correct. ReportBatchItemFailures enables partial batch failure: return the messageId of message 3 in batchItemFailures, and Lambda handles the rest.",
      "Risky. Manually deleting messages then throwing an exception works in happy path but is fragile — if the function crashes before all deletes, some messages may be double-processed.",
    ],
    tags: [
      "sqs",
      "lambda",
      "partial-batch-failure",
      "report-batch-item-failures",
    ],
  },
  {
    id: "sqs-qq-019",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A Lambda function with reserved concurrency=5 is processing a Standard SQS queue. The queue is receiving 100 messages per second and each message takes 1 second to process. What is the effective message processing rate?",
    options: [
      "100 messages per second — Standard queues have unlimited throughput",
      "5 messages per second — limited by reserved concurrency",
      "50 messages per second — Lambda ESM starts with 5 pollers and scales to 50",
      "500 messages per second — Lambda batches 10 messages per invocation × 5 concurrent",
    ],
    correctIndices: [1],
    explanation:
      "Reserved concurrency=5 means maximum 5 Lambda invocations at once. With BatchSize=1 (default assumption here) and 1 second per message, the throughput is 5 messages/second. With BatchSize=10, it would be 50 messages/second. Reserved concurrency is the bottleneck — the queue will accumulate a backlog of 95+ messages/second since consumption can't keep up with production.",
    optionExplanations: [
      "Incorrect. Standard queue throughput is unlimited, but Lambda's reserved concurrency caps the consumption rate.",
      "Correct. 5 concurrent executions × 1 message per second = 5 messages/second at BatchSize=1.",
      "Incorrect. Lambda can scale Standard queue processing beyond 5 pollers, but reserved concurrency caps it at 5 concurrent invocations total.",
      "Incorrect. 5 concurrent invocations × BatchSize=10 = 50 msg/s, not 500. And 1 second per batch of 10 gives 50 msg/s, not 500.",
    ],
    tags: [
      "sqs",
      "lambda",
      "concurrency",
      "reserved-concurrency",
      "throughput",
    ],
  },
  // ─── Performance Patterns ─────────────────────────────────────────────────────
  {
    id: "sqs-qq-020",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "You need to send an order event so that three microservices (inventory, billing, shipping) each receive and independently process their own copy. The order service should not need to know about future consumers. Which architecture is correct?",
    options: [
      "One SQS Standard queue with three consumer threads polling simultaneously",
      "Three SQS queues with the order service calling SendMessage on each queue",
      "One SNS topic with three SQS queues as subscribers (SNS-to-SQS fan-out)",
      "One FIFO queue with three different MessageGroupIds — one per microservice",
    ],
    correctIndices: [2],
    explanation:
      "The SNS-to-SQS fan-out pattern: publish once to SNS, each of the three subscribed SQS queues gets its own independent copy. Adding a 4th consumer later only requires subscribing a new SQS queue to the SNS topic — zero changes to the order service. A single SQS queue delivers each message to only ONE consumer (first to receive it). The order service sending to three queues creates coupling. FIFO MessageGroupIds control ordering, not message fan-out.",
    optionExplanations: [
      "Incorrect. With a single SQS queue, each message is retrieved by exactly one consumer. Three threads compete — only one gets each message.",
      "Incorrect. The order service must know about all three queues and must be modified when a 4th consumer is added.",
      "Correct. SNS fan-out delivers one copy to each subscribed SQS queue. New consumers subscribe without changing the order service.",
      "Incorrect. FIFO MessageGroupIds determine ordering within a queue — they don't create separate message copies for different consumers.",
    ],
    tags: ["sqs", "sns", "fan-out", "architecture", "microservices"],
  },
  {
    id: "sqs-qq-021",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "hard",
    type: "single",
    question:
      "A team uses the SQS Extended Client Library to send 3 MB payloads to SQS via S3. After months of production use, the S3 bucket used by the library has accumulated thousands of objects. Why, and how should this be addressed?",
    options: [
      "The Extended Client Library has a bug — contact AWS Support",
      "The Extended Client Library does not delete S3 objects when SQS messages are deleted; configure an S3 lifecycle policy to expire old objects",
      "The consumers are not using the Extended Client Library to receive messages; they must use the same library to trigger S3 cleanup",
      "The SQS queue retention is set too high; reducing it will automatically clean up S3 objects",
    ],
    correctIndices: [1],
    explanation:
      "The SQS Extended Client Library stores message payloads in S3 but does NOT automatically delete the S3 objects when the corresponding SQS messages are deleted. This is by design — the library only manages the S3 reference in the SQS message. Teams must explicitly manage S3 object lifecycle, either by calling s3:DeleteObject after processing or by configuring an S3 lifecycle policy to expire objects after a suitable retention period.",
    optionExplanations: [
      "Incorrect. This is not a bug — it is documented behavior. S3 lifecycle management is the consumer's responsibility.",
      "Correct. The Extended Client Library does not auto-delete S3 objects. Configure an S3 lifecycle expiration rule or explicitly delete objects after processing.",
      "Incorrect. Consumers using the Extended Client Library will receive the correct message body regardless. S3 cleanup is independent of message receipt.",
      "Incorrect. SQS message retention has no effect on S3 objects. The two lifecycles are completely independent.",
    ],
    tags: ["sqs", "extended-client", "s3", "lifecycle", "storage"],
  },
  {
    id: "sqs-qq-022",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    type: "multi",
    question:
      "Your SQS-based order processing pipeline is experiencing high latency — orders are sitting in the queue for 10 minutes before being processed. Which TWO actions could reduce queue latency?",
    options: [
      "Enable long polling (WaitTimeSeconds=20) on consumer ReceiveMessage calls",
      "Add more consumer instances to increase the message drain rate",
      "Increase the SQS message retention period to 14 days",
      "Reduce the visibility timeout to 10 seconds",
      "Switch from SendMessage to SendMessageBatch on the producer side",
    ],
    correctIndices: [1, 4],
    explanation:
      "Latency = queue depth / drain rate. To reduce latency: (1) add consumers to drain faster, or (2) reduce production-to-queue latency by batching sends. SendMessageBatch doesn't directly reduce consumer latency but reduces producer overhead. Reducing visibility timeout would increase duplicate processing risk. Long polling reduces empty responses but doesn't increase drain rate. Increasing retention keeps old messages around longer.",
    optionExplanations: [
      "Long polling reduces wasted API calls but doesn't increase the number of messages processed per second — it doesn't reduce latency caused by insufficient consumer capacity.",
      "Correct. Adding more consumer instances increases the drain rate, directly reducing the time messages spend waiting in the queue.",
      "Incorrect. Increasing retention keeps messages longer — it has no effect on processing latency.",
      "Incorrect. Reducing visibility timeout to 10 seconds risks messages being redelivered before processing completes, causing duplicates without improving throughput.",
      "Correct. Batching sends (SendMessageBatch) reduces producer API overhead and allows more messages to enter the queue per second, but more importantly — if the bottleneck is producer throughput, batching increases the rate at which properly batched consumers can be kept busy.",
    ],
    tags: ["sqs", "performance", "latency", "scaling", "throughput"],
  },
];
