import { Source } from "../../sources";

// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html
export const sources: Source[] = [
  {
    title: "Amazon SQS – Developer Guide",
    url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html",
    topics: [
      "What is Amazon SQS — Standard vs. FIFO queues",
      "Message lifecycle: send, receive, delete",
      "Visibility timeout and in-flight message limits",
      "Dead-letter queues and redrive policies",
      "Long polling vs. short polling",
      "Delay queues and message timers",
      "Message retention (1 minute – 14 days, default 4 days)",
      "Maximum message size: 1 MiB (1,048,576 bytes)",
    ],
  },
  {
    title: "Amazon SQS FIFO Queues",
    url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html",
    topics: [
      "Exactly-once processing and deduplication IDs",
      "Message group IDs for ordered processing within groups",
      "Throughput: 300 msg/s (3,000 with batching) in standard mode",
      "High throughput mode: up to 70,000 msg/s",
      "FIFO queue naming requirement (.fifo suffix)",
      "Content-based deduplication",
    ],
  },
  {
    title: "Amazon SQS Dead-Letter Queues",
    url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html",
    topics: [
      "maxReceiveCount threshold for redrive",
      "DLQ must be same type as source queue (Standard or FIFO)",
      "DLQ redrive: replaying messages back to source queue",
      "Retention period considerations for DLQ",
    ],
  },
  {
    title: "Amazon SQS Security Best Practices",
    url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-security-best-practices.html",
    topics: [
      "IAM policies vs. SQS queue policies",
      "SSE-SQS (AWS managed) vs. SSE-KMS (customer managed)",
      "Enforcing HTTPS with aws:SecureTransport condition",
      "VPC interface endpoints (PrivateLink) for private access",
      "Least-privilege access patterns",
    ],
  },
  {
    title: "Using Lambda with Amazon SQS",
    url: "https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html",
    topics: [
      "Event source mapping configuration",
      "Batch size (1–10,000) and batch window (0–300 seconds)",
      "ReportBatchItemFailures for partial batch success",
      "Concurrency scaling: 5 initial pollers, +60/min up to 1,000",
      "Visibility timeout must be ≥ 6× function timeout",
      "Error handling and DLQ integration with Lambda ESM",
    ],
  },
  {
    title: "Amazon SQS Batch API",
    url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-batch-api-actions.html",
    topics: [
      "SendMessageBatch: up to 10 messages per request",
      "DeleteMessageBatch: up to 10 messages per request",
      "ChangeMessageVisibilityBatch: bulk visibility extension",
      "Individual message failures within a batch response",
    ],
  },
  {
    title: "Amazon SQS Extended Client Library for Java",
    url: "https://github.com/awslabs/amazon-sqs-java-extended-client-lib",
    topics: [
      "Storing message payloads exceeding 1 MiB (up to 2 GB) in Amazon S3",
      "S3 objects are NOT automatically deleted when message is deleted",
      "Must delete S3 objects separately or use S3 lifecycle policies",
      "Available for Java; community ports exist for Python and Go",
    ],
  },
  {
    title: "Amazon SNS Fan-Out Pattern",
    url: "https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html",
    topics: [
      "SNS topic → multiple SQS queue subscriptions",
      "Decouples producers from multiple consumers",
      "Filter policies for selective delivery per queue",
      "SNS FIFO → SQS FIFO for ordered fan-out",
    ],
  },
];
