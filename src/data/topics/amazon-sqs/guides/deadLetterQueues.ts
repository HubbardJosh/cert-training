import { ServiceGuide } from "../../../../types/guide";

// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html
export const deadLetterQueuesGuide: ServiceGuide = {
  id: "amazon-sqs-dlq",
  service: "Dead-Letter Queues",
  domain: "troubleshooting",
  tagline:
    "Capturing poison messages and building resilient retry-with-isolation patterns",
  intro:
    "Dead-letter queues (DLQs) are the safety valve of any SQS-based system. When a message cannot be processed successfully after a configurable number of attempts, SQS automatically moves it to the DLQ rather than letting it cycle indefinitely in the source queue. DLQs prevent a single problematic message from blocking all consumers and give you a place to inspect, debug, and optionally replay failed messages.",

  sections: [
    {
      heading: "How Dead-Letter Queues Work",
      body: `A DLQ is itself an ordinary SQS queue — the only thing that makes it a dead-letter queue is being named as the target in another queue's **redrive policy**. You create a regular queue (Standard or FIFO, matching the source queue's type), then configure the source queue's redrive policy with two settings: the DLQ's ARN and a \`maxReceiveCount\`.

Every time a consumer receives a message from the source queue, SQS increments the message's \`ApproximateReceiveCount\` attribute. When this count exceeds \`maxReceiveCount\`, SQS automatically moves the message to the DLQ instead of returning it to the source queue. The original enqueue timestamp is preserved for Standard queues — the message continues aging against the source queue's original enqueue time even after moving to the DLQ. For FIFO queues, the enqueue timestamp **resets** when the message moves to the DLQ.

This means the DLQ retention period must be longer than the source queue's retention period. If the source queue has a 4-day retention and the DLQ has a 4-day retention, a message that spent 3 days in the source queue before being dead-lettered will only have 1 day remaining in the DLQ before SQS deletes it.`,
      quiz: [
        {
          question:
            "A Standard SQS queue has a 4-day retention period. The configured DLQ also has a 4-day retention period. A message spends 3 days in the source queue before being moved to the DLQ. How long does the message remain in the DLQ?",
          options: [
            "4 days — the DLQ retention resets when the message arrives",
            "1 day — the message continues aging from its original enqueue time",
            "3 days — the DLQ retention period minus the time already spent",
            "0 days — the message is immediately deleted because it already aged past the DLQ limit",
          ],
          correctIndex: 1,
          explanation:
            "For Standard queues, the original enqueue timestamp is preserved when a message moves to the DLQ. The message continues aging from its original send time. With a 4-day source queue retention and 3 days already elapsed, the message has only 1 day remaining against the DLQ's 4-day retention period. This is why the DLQ retention period must always be set LONGER than the source queue's retention period.",
        },
      ],
    },
    {
      heading: "Configuring the Redrive Policy",
      body: `The redrive policy is a JSON object attached to the source queue with two keys: \`deadLetterTargetArn\` (the ARN of the DLQ) and \`maxReceiveCount\` (the number of delivery attempts before a message is dead-lettered). The DLQ must be in the same AWS account and region as the source queue.

Setting \`maxReceiveCount\` too low (e.g., 1) means a single transient error — a network blip, a briefly unavailable downstream service — immediately dead-letters the message with no retry opportunity. Setting it too high delays detection of genuinely unprocessable messages. A value of 3–5 is common for most workloads; safety-critical systems sometimes go higher.

The **redrive allow policy** is a separate setting on the DLQ that controls which source queues can target it. By default, all queues in the account/region can use the DLQ. You can restrict it to specific source queue ARNs (up to 10) using the \`byQueue\` option, or deny all sources using \`denyAll\` to prevent the queue from being used as a DLQ.`,
      quiz: [
        {
          question:
            "A queue's redrive policy has maxReceiveCount=3. A message has been received twice unsuccessfully. A consumer receives it a third time and crashes before calling DeleteMessage. What happens to the message?",
          options: [
            "The message is moved to the DLQ because it has reached maxReceiveCount",
            "The message becomes visible again after the visibility timeout and will be moved to the DLQ on the fourth receive",
            "The message is deleted by SQS because it has failed too many times",
            "The message is moved to the DLQ immediately upon the consumer crash",
          ],
          correctIndex: 1,
          explanation:
            "maxReceiveCount specifies how many times a message can be received BEFORE being dead-lettered. With maxReceiveCount=3, the message must be received 3 times without deletion before being moved to the DLQ. If the consumer crashes on the third receive, the visibility timeout expires and the message becomes visible again. On the fourth receive, ApproximateReceiveCount (4) exceeds maxReceiveCount (3), so SQS moves it to the DLQ. SQS does not detect crashes directly — it relies on the visibility timeout expiring.",
        },
      ],
    },
    {
      heading: "DLQ Redrive: Replaying Dead-Lettered Messages",
      body: `Once messages accumulate in the DLQ, you have two options: analyze them in place (inspect the message body/attributes, check CloudWatch Logs, check X-Ray traces for the consumer) or replay them back to the source queue after fixing the underlying bug.

SQS supports **DLQ redrive** natively via the console, CLI, and API (\`StartMessageMoveTask\`). You can replay all messages or a filtered subset back to the source queue. During replay, SQS preserves the original message attributes and body. The replay rate is configurable — limiting the rate lets you test a fix without flooding the queue.

Before redriving, always confirm that the consumer bug causing dead-lettering is actually fixed. Replaying messages without fixing the root cause simply re-dead-letters them. Also verify there is no downstream state corruption from the partial processing that may have occurred during the failed attempts.`,
      quiz: [
        {
          question:
            "After deploying a bug fix to an SQS consumer, you want to reprocess the 1,200 messages in the DLQ. What is the safest approach?",
          options: [
            "Delete the DLQ and let the source queue redeliver the messages automatically",
            "Use DLQ redrive with a limited rate to replay messages back to the source queue",
            "Manually read each message from the DLQ and re-send it to the source queue",
            "Increase maxReceiveCount on the source queue so messages stay there longer next time",
          ],
          correctIndex: 1,
          explanation:
            "SQS DLQ redrive (StartMessageMoveTask) is the correct mechanism: it replays messages from the DLQ back to the source queue (or another destination) at a configurable rate. Limiting the rate lets you validate the fix before unleashing all 1,200 messages. Deleting the DLQ loses the messages. Manual re-sending works but doesn't scale. Increasing maxReceiveCount doesn't replay already dead-lettered messages.",
        },
      ],
    },
    {
      heading: "DLQ Best Practices and Operational Patterns",
      body: `Every production SQS queue should have a DLQ configured — without one, an unprocessable message will cycle in the source queue forever, consuming visibility-timeout slots and hiding behind a constant churn of receive/fail/redeliver attempts. Configure a CloudWatch alarm on the \`ApproximateNumberOfMessagesVisible\` metric for your DLQ to alert when messages arrive.

Set the DLQ's retention period significantly longer than the source queue's — a common pattern is 14 days (maximum) for the DLQ and 4 days for the source queue. This gives you time to detect the problem, diagnose it, deploy a fix, and replay the messages before they expire.

Do not use a DLQ with a FIFO queue when strict order matters end-to-end — moving a message to the DLQ breaks the sequence for that \`MessageGroupId\`. Subsequent messages in the group continue processing, but the dead-lettered message is absent from the sequence. If this is a problem, consider using Step Functions for error handling instead of a DLQ.`,
      quiz: [
        {
          question:
            "Which CloudWatch metric should you alarm on to detect when messages start appearing in your DLQ?",
          options: [
            "NumberOfMessagesSent",
            "ApproximateNumberOfMessagesVisible",
            "NumberOfMessagesDeleted",
            "ApproximateAgeOfOldestMessage",
          ],
          correctIndex: 1,
          explanation:
            "ApproximateNumberOfMessagesVisible tells you how many messages are currently available for consumption in the queue. On a DLQ, any non-zero value is an alert condition — it means one or more messages have exceeded maxReceiveCount. ApproximateAgeOfOldestMessage is also useful for DLQ monitoring (tells you how long messages have been waiting) but requires knowing a baseline age. NumberOfMessagesSent and NumberOfMessagesDeleted measure throughput, not DLQ depth.",
        },
      ],
    },
  ],

  keyFacts: [
    "DLQ must be in the same AWS account AND region as the source queue",
    "DLQ must match the source queue type: Standard→Standard DLQ, FIFO→FIFO DLQ",
    "maxReceiveCount: number of times message is received before being dead-lettered",
    "For Standard queues: original enqueue timestamp is preserved when moved to DLQ",
    "For FIFO queues: enqueue timestamp RESETS when moved to DLQ",
    "DLQ retention period must be LONGER than source queue retention period",
    "Redrive allow policy: controls which source queues can use the DLQ (default: all)",
    "DLQ redrive (StartMessageMoveTask) replays messages back to source queue at configurable rate",
    "Without a DLQ, unprocessable messages cycle in the source queue indefinitely",
    "ApproximateReceiveCount attribute tracks how many times a message has been received",
  ],

  relatedServices: [
    "Amazon CloudWatch",
    "AWS Lambda",
    "AWS Step Functions",
    "AWS X-Ray",
  ],

  examTips: [
    "ALWAYS set DLQ retention period longer than source queue retention period",
    "Alert on DLQ ApproximateNumberOfMessagesVisible > 0 in CloudWatch",
    "Don't use DLQ with FIFO queues when order must be maintained end-to-end",
    "maxReceiveCount=1 is too aggressive — transient errors become DLQ messages",
    "Fix the root cause before redriving DLQ messages — otherwise they'll just fail again",
    "DLQ redrive rate limiting helps validate bug fixes before full replay",
    "Every production queue needs a DLQ — no exceptions",
  ],
};
