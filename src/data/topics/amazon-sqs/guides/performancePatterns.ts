import { ServiceGuide } from "../../../../types/guide";

// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-throughput-horizontal-scaling-and-batching.html
// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-s3-messages.html
// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-client-side-buffering-request-batching.html
export const performancePatternsGuide: ServiceGuide = {
  id: "amazon-sqs-performance",
  service: "SQS Performance Patterns",
  domain: "development",
  tagline:
    "Batching, horizontal scaling, extended client, and high-throughput architecture patterns",
  intro:
    "Getting high throughput and low cost from SQS requires understanding how to use batching APIs, horizontal scaling, the extended client for large messages, and architectural patterns like fan-out. These aren't just optimizations — at scale, they determine whether your system can handle peak load within budget.",

  sections: [
    {
      heading:
        "Batch APIs: SendMessageBatch, ReceiveMessage, DeleteMessageBatch",
      body: `SQS provides batch versions of the three most critical operations. **SendMessageBatch** sends up to 10 messages in a single API call, each message up to 1 MiB, total request size up to 256 KB. Batching sends reduces API call volume by up to 10x and proportionally reduces costs. **ReceiveMessage** returns up to 10 messages per call (controlled by \`MaxNumberOfMessages\`). **DeleteMessageBatch** deletes up to 10 messages with a single call using their receipt handles.

The economics are direct: SQS charges per API call, not per message. Batching 10 messages into one API call costs the same as a single-message call. For a system processing 1,000 messages per second, batching could reduce API call costs from $4.32/day to $0.43/day (10x reduction). At scale, this is significant.

Each message in a \`SendMessageBatch\` request must have a unique \`Id\` (up to 80 characters, alphanumeric + hyphens + underscores) so you can correlate individual message results. The batch API can partially succeed — some messages may succeed while others fail; check the \`Successful\` and \`Failed\` arrays in the response.`,
      quiz: [
        {
          question:
            "A system processes 500 messages per second. Without batching, each SendMessage call handles 1 message. With SendMessageBatch (10 messages per call), how many API calls per second are needed?",
          options: [
            "500 calls per second — batch size doesn't affect API call frequency",
            "50 calls per second — 500 messages ÷ 10 messages per batch",
            "5 calls per second — SQS automatically groups 100 messages per batch",
            "5,000 calls per second — batching increases overhead",
          ],
          correctIndex: 1,
          explanation:
            "SendMessageBatch sends 10 messages per API call. To send 500 messages per second, you need 500 ÷ 10 = 50 API calls per second instead of 500. This is a 10x reduction in API calls and a corresponding 10x reduction in API call costs. SQS pricing is per API call, so batching directly reduces cost.",
        },
      ],
    },
    {
      heading: "Horizontal Scaling with Multiple Producers and Consumers",
      body: `SQS is inherently designed for horizontal scaling. Multiple producers can simultaneously write to the same queue at full rate — there are no write locks, and Standard queues scale to virtually unlimited throughput. Multiple consumers can simultaneously poll the same queue; each \`ReceiveMessage\` call returns different messages (SQS uses server-side routing to avoid returning the same message to two consumers simultaneously during the visibility timeout window).

For consumers, the key scaling metric is **queue depth** (ApproximateNumberOfMessagesVisible). If queue depth is growing, add more consumer instances. If it's shrinking, reduce instances. Amazon EC2 Auto Scaling groups can scale based on a custom CloudWatch metric derived from SQS queue depth, enabling automatic consumer scaling. AWS Application Auto Scaling similarly adjusts ECS service task counts based on queue depth.

The scaling formula is: \`required_consumers = (messages_per_second × average_processing_time) ÷ messages_per_consumer_per_second\`. For example: 1,000 msg/sec × 0.1 sec processing time = 100 concurrent processing slots needed. If each consumer handles 1 message at a time, you need 100 consumer instances.`,
      quiz: [
        {
          question:
            "A Standard SQS queue has ApproximateNumberOfMessagesVisible growing by 10,000 messages per minute. Processing one message takes 30 seconds. Each consumer instance handles one message at a time. How many consumer instances are needed to stop queue growth?",
          options: [
            "10,000 instances",
            "5,000 instances",
            "300 instances",
            "167 instances",
          ],
          correctIndex: 1,
          explanation:
            "10,000 messages per minute = ~167 messages per second. Each consumer processes 1 message per 30 seconds = 2 messages per minute per instance. To process 10,000 msg/min: 10,000 ÷ 2 = 5,000 instances. With 5,000 instances, the queue drains at the same rate it fills. More instances are needed to actually reduce the backlog.",
        },
      ],
    },
    {
      heading: "SQS Extended Client Library for Large Messages",
      body: `The maximum SQS message size is 1 MiB. For larger payloads (up to 2 GB), the **SQS Extended Client Library** provides a transparent wrapper that stores the message body in S3 and puts a reference pointer in the SQS message. Available for Java and Python, the library handles S3 upload on send and S3 download on receive automatically.

The SQS message contains a small metadata payload pointing to the S3 object: the bucket name, key, and a flag indicating extended payload. The consumer uses the same Extended Client Library, which transparently fetches the S3 object and returns the full payload to application code — from the application's perspective, it receives the full message body as if it were always in SQS.

The S3 bucket is shared between producers and consumers. Both need appropriate S3 permissions (\`s3:PutObject\` for producers, \`s3:GetObject\` for consumers). The S3 object is not automatically deleted when the SQS message is deleted — you must configure S3 lifecycle policies or explicitly delete the S3 object after processing. Note: the Extended Client Library only works with synchronous SQS clients (not async).`,
      quiz: [
        {
          question:
            "A team is using the SQS Extended Client Library to send 5 MB payloads. A consumer successfully processes and deletes the SQS message. What additional action is required to prevent S3 storage costs from accumulating?",
          options: [
            "No additional action — the Extended Client Library deletes the S3 object automatically when the SQS message is deleted",
            "Delete the S3 object explicitly or configure an S3 lifecycle policy to expire old objects",
            "Set the SQS message retention period to match the S3 lifecycle policy",
            "Call s3:DeleteObject in the same transaction as sqs:DeleteMessage",
          ],
          correctIndex: 1,
          explanation:
            "The SQS Extended Client Library does NOT automatically delete the S3 object when the SQS message is deleted. You must either explicitly call s3:DeleteObject after processing or configure an S3 lifecycle policy to expire objects after a suitable retention window. Without cleanup, S3 storage costs accumulate indefinitely for every large message sent.",
        },
      ],
    },
    {
      heading: "SNS-to-SQS Fan-Out Pattern",
      body: `The SNS-to-SQS fan-out pattern is one of the most widely used messaging architectures in AWS. A single event published to an SNS topic is simultaneously delivered to multiple SQS queues — each queue represents a different downstream consumer. This achieves true independence: each downstream service processes its own copy of the message at its own pace, with its own DLQ, its own retry logic, and its own processing rate.

Without fan-out, you'd need the event producer to call \`SendMessage\` on each SQS queue individually. This creates coupling: the producer must know about every downstream consumer, and adding a new consumer requires modifying the producer. With fan-out, you simply subscribe a new SQS queue to the SNS topic — the producer never changes.

For cross-account fan-out (SNS in Account A, SQS in Account B): the SQS queue in Account B needs a queue policy granting the SNS topic ARN \`sqs:SendMessage\`. The SNS subscription is then created with the SQS queue's ARN. SQS queues subscribed to SNS must be configured to accept the SNS message format — enable "Raw Message Delivery" on the SNS subscription if you want the SQS consumer to receive the original message body without SNS envelope metadata.`,
      quiz: [
        {
          question:
            "You have 4 services that all need to process every order event. You want to add a 5th service without modifying the order service. Which architecture achieves this?",
          options: [
            "One SQS queue with 5 consumer instances — each instance processes different messages",
            "The order service sends to 5 separate SQS queues — one per downstream service",
            "One SNS topic with 5 SQS queue subscriptions — each queue feeds one downstream service",
            "One SQS FIFO queue with 5 MessageGroupIds — one per downstream service",
          ],
          correctIndex: 2,
          explanation:
            "The SNS-to-SQS fan-out pattern delivers one event to multiple independent SQS queues via a single SNS publish. Adding the 5th service only requires subscribing a new SQS queue to the existing SNS topic — zero changes to the order service. A single SQS queue means only one consumer per message. The order service sending to 5 queues creates tight coupling. FIFO MessageGroupIds control ordering within a queue, not fan-out delivery.",
        },
      ],
    },
  ],

  keyFacts: [
    "SendMessageBatch: up to 10 messages per call; total request size 256 KB",
    "ReceiveMessage: up to 10 messages per call (MaxNumberOfMessages parameter)",
    "DeleteMessageBatch: up to 10 messages per call",
    "Batching reduces API costs by up to 10x — SQS charges per API call, not per message",
    "Extended Client Library: supports Java and Python; max payload 2 GB via S3",
    "Extended Client Library does NOT delete S3 objects when SQS messages are deleted",
    "Extended Client Library works only with synchronous SQS clients",
    "Scale consumers based on ApproximateNumberOfMessagesVisible (queue depth)",
    "SNS-to-SQS fan-out: publish once to SNS, each subscriber SQS queue gets a copy",
    "Raw Message Delivery on SNS subscription: consumer gets original message body, not SNS envelope",
    "Cross-account SNS-to-SQS: SQS queue policy must grant sqs:SendMessage to SNS topic ARN",
  ],

  relatedServices: [
    "Amazon SNS",
    "Amazon S3",
    "Amazon EC2 Auto Scaling",
    "AWS Application Auto Scaling",
    "Amazon CloudWatch",
    "Amazon ECS",
    "AWS Lambda",
  ],

  examTips: [
    "Batch APIs reduce cost 10x — always batch when throughput allows",
    "Extended Client Library: producer needs s3:PutObject, consumer needs s3:GetObject",
    "S3 objects from Extended Client Library must be explicitly deleted — they don't auto-clean",
    "Scale consumers based on queue depth (ApproximateNumberOfMessagesVisible), not CPU",
    "SNS fan-out = each subscriber gets its own copy; SQS queue = only one consumer gets each message",
    "For SNS-to-SQS cross-account: queue policy is the key — no changes needed in the SNS account",
  ],
};
