import { ServiceGuide } from "../../../../types/guide";

// Source: https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-lambda-function-trigger.html
export const lambdaIntegrationGuide: ServiceGuide = {
  id: "amazon-sqs-lambda",
  service: "SQS + Lambda Integration",
  domain: "development",
  tagline:
    "Event source mappings, batch windows, concurrency, and partial batch failure handling",
  intro:
    "Lambda's SQS event source mapping (ESM) is one of the most common SQS consumption patterns in serverless architectures. Lambda polls the queue on your behalf, batches messages, and invokes your function. Understanding how the ESM manages concurrency, handles failures, and reports partial batch failures is essential for building reliable Lambda-SQS pipelines.",

  sections: [
    {
      heading: "How SQS Event Source Mapping Works",
      body: `A Lambda **event source mapping** (ESM) is a Lambda-managed poller that continuously calls \`ReceiveMessage\` on your SQS queue and invokes your function with batches of messages. You don't write polling code — Lambda manages it. The ESM uses long polling (WaitTimeSeconds=20) automatically.

Lambda manages concurrency by starting multiple poller instances to keep up with queue depth. For Standard queues, Lambda can scale to up to 1,000 concurrent function instances (standard Lambda concurrency limits apply). For FIFO queues, Lambda processes messages in order per MessageGroupId — one concurrent execution per active MessageGroupId.

The ESM requires that your Lambda execution role has \`sqs:ReceiveMessage\`, \`sqs:DeleteMessage\`, and \`sqs:GetQueueAttributes\` permissions on the source queue. If the queue is encrypted with SSE-KMS, the execution role also needs \`kms:Decrypt\`. After a successful invocation, Lambda automatically calls \`DeleteMessage\` for every message in the batch. If the invocation fails (throws an exception), no messages are deleted — they become visible again after the visibility timeout.`,
      quiz: [
        {
          question:
            "A Lambda function is processing an SQS batch of 10 messages. Message 7 causes an exception. The function throws the error. What happens to all 10 messages?",
          options: [
            "Only message 7 is retried; messages 1–6 and 8–10 are deleted",
            "All 10 messages become visible again after the visibility timeout and are retried",
            "Lambda automatically moves message 7 to the DLQ and deletes the other 9",
            "Lambda invokes the function again with only message 7",
          ],
          correctIndex: 1,
          explanation:
            "By default, if a Lambda function throws any error, the entire batch is considered failed — Lambda does not delete any of the 10 messages. All 10 become visible again after the visibility timeout and will be redelivered. This is a major operational concern: one bad message can cause all healthy messages in the batch to be reprocessed repeatedly. The solution is partial batch failure reporting (ReportBatchItemFailures).",
        },
      ],
    },
    {
      heading: "Batch Size and Batch Window",
      body: `Two ESM parameters control how messages are grouped into batches. **BatchSize** (1–10,000) is the maximum number of messages per batch — Lambda invokes your function with at most this many messages. For SQS Standard queues the maximum is 10,000; for FIFO queues the maximum is 10. Setting a larger batch size improves throughput but increases the cost of a single function failure (more messages retried).

**MaximumBatchingWindowInSeconds** (0–300 seconds) tells Lambda to wait up to this duration before invoking the function, even if the batch isn't full. This allows Lambda to collect more messages and reduce function invocation frequency. A batching window of 30 seconds means Lambda accumulates messages for up to 30 seconds (or until BatchSize is reached) before firing the function. This is useful for workloads that benefit from micro-batching: database bulk inserts, Elasticsearch bulk indexing, or analytics aggregation.

Setting BatchSize=1 and MaximumBatchingWindowInSeconds=0 gives you the lowest latency — each message triggers an immediate invocation — at the cost of maximum invocation volume and Lambda overhead.`,
      quiz: [
        {
          question:
            "You set a Lambda ESM BatchSize=100 and MaximumBatchingWindowInSeconds=60. Messages arrive at a rate of 5 per second. How often will Lambda invoke your function in steady state?",
          options: [
            "Every second, with 5 messages per batch",
            "Every 60 seconds (the full batch window), with ~300 messages per batch — capped at 100",
            "Every 20 seconds, with 100 messages per batch",
            "Every 60 seconds, with 100 messages per batch (Lambda stops collecting at BatchSize)",
          ],
          correctIndex: 3,
          explanation:
            "With a batching window of 60 seconds and BatchSize=100, Lambda fires the function when EITHER the batch window expires OR the batch reaches 100 messages — whichever comes first. At 5 msg/sec, it takes 20 seconds to collect 100 messages. So Lambda fires every 20 seconds with a full batch of 100 (BatchSize reached before the 60-second window). Only if the rate drops below ~1.67 msg/sec would the 60-second window govern.",
        },
      ],
    },
    {
      heading: "Partial Batch Failure Reporting",
      body: `The default failure behavior — retry the entire batch if any message fails — is often undesirable. It causes healthy messages to be retried repeatedly because of a single bad message, eventually landing them all in the DLQ alongside the poison message. **Partial batch failure reporting** (ReportBatchItemFailures) solves this.

When you set the ESM's \`FunctionResponseType=ReportBatchItemFailures\`, your Lambda function can return a partial success response. Instead of throwing an exception, the function catches per-message errors and returns a response body listing the \`itemIdentifier\` (the messageId) of each failed message. Lambda then deletes all messages NOT in the failure list and leaves the failed messages in the queue for retry.

The response format is:
\`\`\`json
{
  "batchItemFailures": [
    { "itemIdentifier": "msgId-that-failed" }
  ]
}
\`\`\`
If the array is empty, all messages are deleted. If the function itself crashes (unhandled exception), all messages are retried as before. Partial batch failure reporting is strongly recommended for any Lambda function that processes SQS batches with heterogeneous messages.`,
      quiz: [
        {
          question:
            "A Lambda function processes an SQS batch of 5 messages. Messages 2 and 4 fail processing. You want messages 1, 3, and 5 to be deleted and only messages 2 and 4 to be retried. Which approach is correct?",
          options: [
            "Throw an exception from the function — Lambda retries only failed messages automatically",
            "Manually call sqs:DeleteMessage for messages 1, 3, and 5 within the function, then throw an exception",
            "Return a response with batchItemFailures listing the messageIds of messages 2 and 4",
            "Set the ESM BatchSize=1 so each message is processed individually",
          ],
          correctIndex: 2,
          explanation:
            "Partial batch failure reporting (ReportBatchItemFailures) lets your function return a batchItemFailures array containing the messageIds of failed messages. Lambda deletes the successful messages and retries only the failures. Throwing an exception retries the entire batch. Manually calling DeleteMessage then throwing an exception could work but risks deleting messages before reporting failure. BatchSize=1 avoids the problem but kills throughput.",
        },
      ],
    },
    {
      heading: "Concurrency and Scaling Behavior",
      body: `For **Standard queues**, the Lambda ESM scales aggressively. Lambda initially polls with 5 concurrent instances and adds 60 more instances per minute until queue depth is cleared or the function's reserved concurrency limit is reached. This means a large queue backlog can quickly scale Lambda to hundreds of concurrent executions — ensure your downstream resources (databases, APIs) can handle the sudden concurrency increase.

For **FIFO queues**, the ESM processes messages per MessageGroupId. One Lambda invocation handles all in-flight messages for one MessageGroupId at a time. Different MessageGroupIds can invoke concurrent Lambda instances in parallel, but within a group, order is preserved. The maximum concurrency for FIFO is bounded by the number of active MessageGroupIds.

To throttle Lambda's concurrency when processing SQS queues (e.g., to protect a downstream database), set a **reserved concurrency** limit on the Lambda function. Reserved concurrency caps concurrent executions, which effectively slows the SQS drain rate. Be aware: if messages are produced faster than Lambda can consume them with the reserved concurrency limit, the queue depth will grow.`,
      quiz: [
        {
          question:
            "A Lambda function with reserved concurrency=10 is processing a Standard SQS queue receiving 1,000 messages per second. The function takes 2 seconds per message. What is the maximum message processing rate?",
          options: [
            "1,000 messages per second — Lambda scales automatically to match input rate",
            "10 messages per second — 10 concurrent executions × 1 message per 2 seconds",
            "5 messages per second — the ESM starts with 5 concurrent poller instances",
            "300 messages per second — Standard queue throughput limits the rate",
          ],
          correctIndex: 1,
          explanation:
            "With reserved concurrency=10 and 2 seconds per message, the function can process 5 messages per second per concurrent execution (1 message / 2 seconds × 10 concurrent = 5 messages/second). At BatchSize=1, that's 5 msg/s. At BatchSize=10, that's up to 50 msg/s. Standard SQS queues have no practical throughput limit. Reserved concurrency is the bottleneck — the queue will grow because production (1,000/sec) vastly exceeds consumption.",
        },
      ],
    },
  ],

  keyFacts: [
    "Lambda ESM uses long polling (WaitTimeSeconds=20) automatically",
    "Standard queue ESM: BatchSize max 10,000; FIFO queue ESM: BatchSize max 10",
    "MaximumBatchingWindowInSeconds: 0–300 seconds (5 minutes)",
    "ESM required IAM: sqs:ReceiveMessage, sqs:DeleteMessage, sqs:GetQueueAttributes",
    "Successful batch: Lambda auto-deletes all messages; failed batch: all messages retried",
    "ReportBatchItemFailures: enables partial batch failure — delete successes, retry failures",
    "Standard queue ESM scaling: starts at 5 pollers, adds 60/minute until queue is drained",
    "FIFO queue ESM: one concurrent execution per active MessageGroupId",
    "Reserved concurrency limits Lambda's SQS drain rate — queue depth grows if production > consumption",
    "SSE-KMS queue + Lambda ESM requires kms:Decrypt on the execution role",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon SQS",
    "Amazon CloudWatch",
    "AWS KMS",
    "AWS IAM",
    "Amazon SNS",
  ],

  examTips: [
    "ReportBatchItemFailures is the answer to 'how do I retry only failed messages in a batch'",
    "One bad message in a batch retries ALL messages without ReportBatchItemFailures",
    "FIFO ESM preserves order within a MessageGroupId — different groups run in parallel",
    "Large BatchSize + large batching window = higher throughput, higher retry blast radius",
    "Reserved concurrency on Lambda is how you throttle SQS drain rate to protect downstream",
    "Lambda ESM deletes messages AFTER successful invocation — the queue policy is irrelevant for deletion",
  ],
};
