import { ServiceGuide } from "../../../../types/guide";

export const sqsSnsGuide: ServiceGuide = {
  id: "saa-sqs-sns",
  service: "SQS & SNS",
  domain: "applications",
  tagline: "Decouple workloads with queues and fan-out pub/sub messaging",
  intro:
    "SQS provides reliable message queuing for decoupling distributed components. SNS provides pub/sub messaging for fan-out patterns. Together they form the backbone of loosely coupled, event-driven AWS architectures.",

  sections: [
    {
      heading: "SQS Fundamentals",
      body: `SQS is a fully managed message queue that decouples producers from consumers. Messages are stored in the queue until a consumer retrieves and deletes them. The default **visibility timeout** is 30 seconds — when a consumer receives a message, it becomes invisible to other consumers for that duration. If the consumer doesn't delete the message within the visibility timeout, it reappears in the queue and can be processed again (at-least-once delivery). Set the visibility timeout to at least 6× the consumer's processing time to avoid unintended reprocessing.

**Polling**: **short polling** returns immediately even if the queue is empty (wastes API calls). **Long polling** (up to 20 seconds) waits for messages to arrive before returning — reduces empty responses and lowers cost. Long polling is enabled by setting the ReceiveMessageWaitTimeSeconds to 1-20. **Message retention** is 4 days by default, configurable to 1 minute to 14 days. Maximum message size is 256 KB (use S3 + SQS Extended Client Library for larger payloads).`,
      quiz: [
        {
          question:
            "SQS consumers are receiving the same message multiple times. The consumer processes each message in 45 seconds. The visibility timeout is set to 30 seconds. What is the fix?",
          options: [
            "Increase the visibility timeout to at least 270 seconds (6× processing time)",
            "Enable SQS FIFO queue to prevent duplicates",
            "Decrease the consumer's processing time to under 30 seconds",
            "Switch to SNS which has no visibility timeout issue",
          ],
          correctIndex: 0,
          explanation:
            "When processing takes longer than the visibility timeout, the message reappears in the queue and another consumer picks it up — causing duplicates. The visibility timeout should be at least 6× the processing time (6 × 45s = 270s). FIFO queues prevent duplicates from the producer, not from timeout redelivery.",
        },
      ],
    },
    {
      heading: "SQS FIFO Queues",
      body: `**FIFO queues** guarantee that messages are processed in the exact order they are sent and that each message is processed exactly once (exactly-once processing within a 5-minute deduplication window). FIFO queues require a **Message Group ID** — messages with the same group ID are processed in order within that group. Different group IDs can be processed in parallel (parallel ordering within groups).

FIFO queues support up to 300 TPS without batching and 3,000 TPS with batching (10 messages per batch) in the default mode. With **High-Throughput FIFO mode** enabled, limits increase to 3,000 TPS without batching and 30,000 TPS with batching. This throughput limit is per queue and is lower than Standard queues (nearly unlimited TPS). FIFO queue names must end in \`.fifo\`. Deduplication is achieved via the **Message Deduplication ID** — if two messages with the same deduplication ID are sent within 5 minutes, only one is delivered.`,
      quiz: [
        {
          question:
            "An order processing system must process orders in the exact sequence they are placed and must never process an order more than once. Which SQS queue type is required?",
          options: [
            "FIFO queue",
            "Standard queue with a DLQ",
            "Standard queue with deduplication logic in the consumer",
            "SNS FIFO topic feeding a Standard SQS queue",
          ],
          correctIndex: 0,
          explanation:
            "FIFO queues provide exactly-once processing and strict message ordering — both requirements of this system. Standard queues offer at-least-once delivery (duplicates possible) and best-effort ordering. Application-level deduplication in consumers adds complexity and doesn't guarantee ordering.",
        },
      ],
    },
    {
      heading: "Dead Letter Queues",
      body: `A **DLQ** is a separate SQS queue that receives messages that fail to be processed after a configurable number of attempts (maxReceiveCount). When a message is received more times than the maxReceiveCount without being deleted, SQS moves it to the DLQ automatically. DLQs are used to isolate and investigate problematic messages without blocking the main queue.

Best practice: set a DLQ alarm in CloudWatch to alert when messages arrive — this indicates a processing failure that needs investigation. DLQ message retention should be set longer than the source queue's retention so you have time to investigate. DLQs work with both Standard and FIFO queues (FIFO DLQs for FIFO source queues). After fixing the underlying bug, use the **DLQ redrive** feature to send messages from the DLQ back to the source queue for reprocessing.`,
      quiz: [
        {
          question:
            "An SQS consumer fails to process certain messages due to a bug. What prevents these failed messages from blocking all other messages in the queue?",
          options: [
            "Dead Letter Queue — failed messages are moved to the DLQ after maxReceiveCount attempts",
            "FIFO queue — messages are processed in order so failures don't block later messages",
            "Long polling — consumers only receive messages they can process",
            "Visibility timeout — failed messages are eventually discarded",
          ],
          correctIndex: 0,
          explanation:
            "Without a DLQ, poison messages (messages that consistently fail) loop in the queue indefinitely, consuming processing attempts. A DLQ captures these messages after maxReceiveCount failures, removing them from the main queue so other messages can be processed normally. Failed messages in the DLQ can be investigated and redriven after fixing the bug.",
        },
      ],
    },
    {
      heading: "SNS: Simple Notification Service",
      body: `SNS is a pub/sub messaging service. **Publishers** send messages to **topics**. **Subscribers** receive all (or filtered) messages published to the topic. Subscriber types include: SQS queues, Lambda functions, HTTP/HTTPS endpoints, email, SMS, and mobile push notifications. A single SNS message is delivered to all subscribers simultaneously — this is the **fan-out** pattern.

The classic fan-out architecture: one SNS topic sends to multiple SQS queues, each of which has its own consumer. This decouples the publisher from consumers and allows each consumer to process at its own pace. SNS does not persist messages — if a subscriber is unavailable, the message is lost (unless the subscriber is SQS, which stores the message). For reliable fan-out, always put SQS queues between SNS and consumers.`,
      quiz: [
        {
          question:
            "An e-commerce platform publishes an 'order placed' event that must trigger an inventory service, an email service, and an analytics service independently. Each service processes at a different rate. What is the BEST architecture?",
          options: [
            "SNS topic fan-out to three separate SQS queues, each consumed by its respective service",
            "One SQS queue that all three services poll from",
            "EventBridge with three separate rules routing to each service's Lambda",
            "Three separate API calls from the order service to each downstream service",
          ],
          correctIndex: 0,
          explanation:
            "SNS → multiple SQS queues is the classic fan-out decoupling pattern. Each service has its own queue, processes at its own rate, and can retry failures independently. A shared SQS queue requires competing consumers with careful message filtering. Direct API calls create tight coupling. EventBridge also works but SNS+SQS is the canonical answer for this pattern.",
        },
      ],
    },
    {
      heading: "SNS Message Filtering",
      body: `**SNS message filtering** allows subscriptions to receive only messages matching specific attributes — eliminating the need for consumers to process and discard irrelevant messages. Each subscription can have a filter policy (JSON) that matches on message attributes. For example, an SQS queue for premium orders subscribes with a filter requiring \`orderTier: premium\`. Only matching messages are delivered.

SNS FIFO topics provide ordered, deduplicated delivery to SQS FIFO subscribers — enabling ordered fan-out. SNS supports up to 12.5 million subscriptions per topic and 100,000 topics per account. **Message attributes** (metadata sent with the message) are what filter policies match against. The message body itself cannot be used in standard filter policies (but can in enhanced filtering).`,
      quiz: [
        {
          question:
            "An SNS topic receives orders from all regions. A specific SQS queue should only receive orders from the EU region. What feature enables this without the consumer filtering out non-EU messages?",
          options: [
            "SNS subscription filter policy matching the region message attribute",
            "SQS message attribute filtering on the consumer side",
            "A separate SNS topic per region",
            "Lambda@Edge to route messages to region-specific queues",
          ],
          correctIndex: 0,
          explanation:
            "SNS subscription filter policies filter at the SNS level — only matching messages are delivered to the SQS subscriber. This eliminates unnecessary SQS receives and reduces cost. Consumer-side filtering still receives and processes all messages before discarding non-matches, wasting compute and API calls.",
        },
      ],
    },
    {
      heading: "Amazon EventBridge",
      body: `**EventBridge** (formerly CloudWatch Events) is a serverless event bus that routes events from AWS services, custom applications, and SaaS providers to targets. Events are JSON objects; rules define event patterns (match conditions) and targets (Lambda, SQS, SNS, Step Functions, API Gateway, etc.). A single event can match multiple rules and be sent to multiple targets simultaneously.

EventBridge is the most flexible event routing service in AWS. It supports **schema registry** (discovers event structure), **pipes** (point-to-point integrations with filtering and enrichment), and **global endpoints** for multi-region resilience. Unlike SQS, EventBridge does not persist events — delivery failures are handled by retry with exponential backoff and a DLQ on the rule target. Use EventBridge as the central event bus for complex event-driven architectures with many producers and consumers.`,
      quiz: [
        {
          question:
            "A company wants to trigger multiple downstream actions when an EC2 instance changes state to 'stopped'. Actions include Lambda (send notification), SQS (queue remediation), and a third-party webhook. Which service handles this most elegantly?",
          options: [
            "Amazon EventBridge rule matching EC2 state change events",
            "SNS topic subscribed to EC2 state change events",
            "CloudTrail with Lambda trigger on StopInstances API call",
            "CloudWatch alarm triggering an SNS topic",
          ],
          correctIndex: 0,
          explanation:
            "EventBridge natively captures EC2 state change events and supports multiple targets in a single rule (Lambda, SQS, HTTP endpoint for the webhook). SNS could fan out but requires EC2 to publish to the topic — EventBridge captures AWS service events automatically. CloudTrail monitors API calls (not instance states). CloudWatch alarms are metric-based.",
        },
      ],
    },
  ],

  keyFacts: [
    "SQS visibility timeout default: 30 seconds. Set to at least 6× processing time",
    "SQS message retention: 4 days default, 1 min to 14 days configurable",
    "SQS max message size: 256 KB (use Extended Client Library + S3 for larger)",
    "Standard SQS: at-least-once delivery, best-effort ordering, unlimited TPS",
    "FIFO SQS: exactly-once, strict ordering, 300 TPS (3,000 with batching); High-Throughput mode: 3,000 TPS (30,000 with batching)",
    "DLQ: receives messages after maxReceiveCount failures — use for poison message isolation",
    "SNS fan-out: one publish → all subscribers receive simultaneously",
    "SNS → SQS fan-out: each queue buffers independently — reliable fan-out",
    "SNS subscription filter policies: match on message attributes, reduce consumer load",
    "EventBridge: matches event patterns and routes to multiple targets from AWS services and SaaS",
    "SNS does not persist messages; SQS stores messages until consumed or expired",
    "Long polling (1-20s wait): reduces empty SQS responses and API costs",
    "SQS Delay Queues: postpone message delivery by 0–15 minutes — useful for delayed processing workflows",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon EventBridge",
    "AWS Step Functions",
    "Amazon Kinesis",
    "Amazon MQ",
    "AWS CloudFormation",
  ],

  examTips: [
    "For fan-out: SNS + multiple SQS queues — each consumer processes independently",
    "FIFO queues end in .fifo and have a 300 TPS limit — not suitable for high-throughput Standard queue replacements",
    "DLQ prevents poison messages from blocking queue processing — always configure one for production queues",
    "Visibility timeout must exceed processing time or messages will be processed multiple times",
    "Long polling is almost always better than short polling — reduces API calls and cost",
    "SNS filter policies eliminate the need for consumer-side filtering — reduces wasted compute",
    "EventBridge is the right answer for routing AWS service events (EC2, S3, RDS state changes) to multiple targets",
    "Amazon MQ is for migrating existing RabbitMQ/ActiveMQ applications — not a new greenfield choice",
    "SQS Extended Client Library stores message body in S3, puts reference in SQS — for messages > 256 KB",
    "For ordered fan-out: SNS FIFO topic → SQS FIFO queues",
    "FIFO queue with a single MessageGroupID processes messages serially — use multiple MessageGroupIDs to enable parallel processing while maintaining per-group ordering",
  ],
};
