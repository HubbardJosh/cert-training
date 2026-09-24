import { ServiceGuide } from "../../../../types/guide";

// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html
export const overviewGuide: ServiceGuide = {
  id: "amazon-sqs-overview",
  service: "Amazon SQS Overview",
  domain: "development",
  tagline: "Fully managed message queuing for decoupled distributed systems",
  intro:
    "Amazon Simple Queue Service (SQS) is a fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications. SQS eliminates the complexity and overhead associated with managing and operating message-oriented middleware — you never have to worry about capacity planning, provisioning, or scaling the queuing infrastructure.",

  sections: [
    {
      heading: "What is Amazon SQS?",
      body: `Amazon SQS is a hosted message queue that lets producers send messages and consumers retrieve them independently, decoupling the two sides of your system. A producer sends a message to the queue; SQS stores it redundantly across multiple servers within the AWS region. One or more consumers poll the queue, receive the message, process it, and explicitly delete it when done. Because producers and consumers never talk directly to each other, either side can scale, fail, or restart independently without affecting the other.

SQS supports two queue types — Standard and FIFO — each with different ordering and throughput guarantees. Standard queues provide nearly unlimited throughput with best-effort ordering and at-least-once delivery. FIFO queues guarantee strict ordering and exactly-once processing at up to 300 TPS per API action (3,000 messages/second with batching) in standard mode, or much higher in high-throughput mode.

SQS is tightly integrated with the rest of AWS: Lambda can poll queues as an event source, SNS can fan messages into multiple queues (SNS-to-SQS fan-out), EventBridge can route events to queues, and IAM controls precisely who can send or receive. There are no brokers to manage, no clusters to provision, and no upfront costs — you pay per API request.`,
      quiz: [
        {
          question:
            "What is the fundamental architectural pattern that Amazon SQS enables?",
          options: [
            "Synchronous request-response between services",
            "Asynchronous decoupling between producers and consumers",
            "Real-time bidirectional streaming between components",
            "Direct peer-to-peer communication without a broker",
          ],
          correctIndex: 1,
          explanation:
            "SQS enables asynchronous decoupling: producers send messages to the queue without waiting for consumers, and consumers retrieve messages at their own pace. This means either side can scale, fail, or restart independently. SQS is not synchronous, does not support bidirectional streaming, and acts as a managed intermediary broker.",
        },
      ],
    },
    {
      heading: "Message Lifecycle: Send → Receive → Delete",
      body: `Every SQS message follows a three-phase lifecycle. In phase one, a producer calls \`SendMessage\` (or \`SendMessageBatch\`) and SQS stores the message redundantly across servers in the region. In phase two, a consumer calls \`ReceiveMessage\` and SQS returns up to 10 messages; the returned messages immediately enter a *visibility timeout* period during which they are hidden from other consumers. In phase three, after successfully processing the message, the consumer calls \`DeleteMessage\` using the message's receipt handle to permanently remove it.

If the consumer fails to call \`DeleteMessage\` before the visibility timeout expires, the message becomes visible again and will be redelivered — enabling automatic retry without any additional configuration. This "pessimistic locking" model ensures messages are never lost due to consumer failure. If a message is redelivered more times than the \`maxReceiveCount\` in the queue's redrive policy, SQS automatically moves it to the configured dead-letter queue (DLQ).

It is critical to understand that a receipt handle is unique to each \`ReceiveMessage\` call. If you receive the same message twice, you get two different receipt handles — you must use the most recent receipt handle to delete the message.`,
      quiz: [
        {
          question:
            "A consumer receives a message from an SQS queue but crashes before deleting it. The visibility timeout is 30 seconds. What happens?",
          options: [
            "The message is permanently lost",
            "The message remains invisible for 30 seconds, then becomes visible again and is redelivered",
            "SQS immediately redelivers the message to another consumer",
            "The message is moved to a dead-letter queue after the crash is detected",
          ],
          correctIndex: 1,
          explanation:
            "SQS uses a visibility timeout: after a message is received, it becomes hidden for the timeout duration. If the consumer does not call DeleteMessage before the timeout expires, the message becomes visible again and is available for redelivery. This is SQS's core retry mechanism. The message is only sent to a DLQ after exceeding the maxReceiveCount, not after a single failure.",
        },
      ],
    },
    {
      heading: "SQS vs SNS vs Amazon MQ",
      body: `SQS, SNS, and Amazon MQ are all AWS messaging services, but they serve different purposes. SQS is a queue — one consumer (or one consumer group) processes each message. It is designed for point-to-point asynchronous decoupling, workload buffering, and retry-with-DLQ patterns. Messages persist in the queue until consumed or expired.

SNS is a pub/sub fanout service — a single published message can be delivered simultaneously to multiple subscribers (SQS queues, Lambda functions, HTTP endpoints, email, SMS). SNS does not persist messages; if a subscriber is unavailable, the message is lost unless SNS is configured to deliver to an SQS queue. The canonical pattern combines both: SNS fans a message out to multiple SQS queues (SNS-to-SQS fan-out), giving you durability via SQS and fanout via SNS.

Amazon MQ is designed for enterprises migrating legacy message broker workloads. It supports industry-standard protocols (AMQP, MQTT, STOMP, OpenWire) and is compatible with ActiveMQ and RabbitMQ APIs. Choose Amazon MQ when you need protocol compatibility with existing on-premises broker clients. Choose SQS/SNS for new cloud-native applications — they scale nearly infinitely and cost less at high volume.`,
      quiz: [
        {
          question:
            "You need to publish an order event so that three independent services — inventory, shipping, and billing — each receive and process their own copy of the event. Which architecture is most appropriate?",
          options: [
            "One SQS standard queue with three consumer groups pulling from it",
            "Three separate SQS queues, with the producer sending the message to each queue",
            "One SNS topic with three SQS queue subscriptions (SNS-to-SQS fan-out)",
            "One Amazon MQ broker with three virtual queues",
          ],
          correctIndex: 2,
          explanation:
            "The SNS-to-SQS fan-out pattern is the canonical solution: the producer publishes once to an SNS topic, and SNS delivers a copy to each subscribed SQS queue. Each downstream service reads from its own queue independently. Sending to three queues from the producer creates coupling. A single SQS queue means whichever consumer receives the message processes it exclusively — the others never see it. Amazon MQ is for legacy protocol compatibility, not this use case.",
        },
      ],
    },
    {
      heading: "Key SQS Limits and Defaults",
      body: `Understanding SQS hard limits prevents surprises in production. The maximum message size is 1 MiB (1,048,576 bytes) — for larger payloads, use the SQS Extended Client Library to store the body in S3 and put a pointer in the message (supports up to 2 GB). A single \`SendMessageBatch\` or \`ReceiveMessage\` call can handle up to 10 messages at once.

Message retention defaults to 4 days with a configurable range of 60 seconds to 14 days. The default visibility timeout is 30 seconds (min 0, max 12 hours). Delay queues can postpone initial delivery by 0–15 minutes. Each message can carry up to 10 custom attributes. Standard queues can have up to approximately 120,000 in-flight messages before \`OverLimit\` errors occur.

For FIFO queues in standard mode, the limit is 300 TPS per API action (3,000 messages/second with batching). High-throughput FIFO mode raises this dramatically — up to 70,000 TPS in us-east-1/us-west-2/eu-west-1 (700,000 messages/second with batching). Standard queues have no practical throughput limit.`,
      quiz: [
        {
          question:
            "What is the maximum size of a single Amazon SQS message, and what should you use when your payload exceeds this limit?",
          options: [
            "256 KB; use S3 with the SQS Extended Client Library",
            "1 MiB; use S3 with the SQS Extended Client Library",
            "1 MiB; split the message into multiple smaller SQS messages",
            "10 MB; use Amazon EFS to store the overflow payload",
          ],
          correctIndex: 1,
          explanation:
            "The maximum SQS message size is 1 MiB (1,048,576 bytes). For larger payloads up to 2 GB, use the SQS Extended Client Library (available for Java and Python), which stores the message body in S3 and places a reference pointer in the SQS message. There is no 256 KB limit — that was a previous limit that no longer applies to current SQS.",
        },
      ],
    },
  ],

  keyFacts: [
    "Max message size: 1 MiB (1,048,576 bytes); use Extended Client Library + S3 for up to 2 GB",
    "Default message retention: 4 days; range: 60 seconds to 14 days",
    "Default visibility timeout: 30 seconds; range: 0 seconds to 12 hours",
    "Max messages per batch (send/receive/delete): 10",
    "Max message attributes per message: 10",
    "Standard queue in-flight message limit: ~120,000",
    "FIFO standard mode: 300 TPS per API action (3,000 msg/s with batching)",
    "FIFO high-throughput mode: up to 70,000 TPS in us-east-1 (700,000 msg/s with batching)",
    "Standard queues: at-least-once delivery, best-effort ordering",
    "FIFO queues: exactly-once processing, strict FIFO ordering within a message group",
    "Long polling max wait: 20 seconds (WaitTimeSeconds parameter)",
    "Delay queue max delay: 15 minutes",
  ],

  relatedServices: [
    "Amazon SNS",
    "AWS Lambda",
    "Amazon EventBridge",
    "Amazon MQ",
    "Amazon S3 (Extended Client Library)",
    "AWS KMS (SSE-KMS)",
    "Amazon CloudWatch",
    "AWS Step Functions",
  ],

  examTips: [
    "SQS decouples producers and consumers — neither needs to know about the other",
    "Always set DLQ retention period LONGER than the source queue retention period",
    "Use long polling (WaitTimeSeconds=20) by default to reduce empty responses and cut costs",
    "Receipt handles are unique per ReceiveMessage call — use the latest handle to delete",
    "Visibility timeout must cover your maximum processing time, not average",
    "SNS-to-SQS fan-out is the canonical pattern for delivering one event to multiple consumers",
    "Standard queues CAN deliver messages more than once — your consumers must be idempotent",
    "FIFO deduplication window is 5 minutes — the same MessageDeduplicationId within 5 min is rejected",
  ],
};
