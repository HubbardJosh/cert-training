import { ServiceGuide } from "../../../../types/guide";

// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-delay-queues.html
// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-message-timers.html
export const delayAndMessageTimersGuide: ServiceGuide = {
  id: "amazon-sqs-delay-timers",
  service: "Delay Queues & Message Timers",
  domain: "development",
  tagline:
    "Scheduling message delivery up to 15 minutes in the future at queue or message level",
  intro:
    "SQS provides two mechanisms for delaying when a message becomes visible to consumers: delay queues (a queue-level setting) and message timers (a per-message override). Both postpone message delivery by 0–15 minutes. For longer scheduling horizons, Amazon EventBridge Scheduler is the recommended solution.",

  sections: [
    {
      heading: "Delay Queues: Queue-Level Delivery Delay",
      body: `A **delay queue** is any SQS queue configured with a \`DelaySeconds\` value greater than 0. When a message is sent to a delay queue, it remains invisible to consumers for the configured delay period before becoming available. The default (minimum) delay is 0 seconds; the maximum is **900 seconds (15 minutes)**.

Delay queues are useful when consumers need a grace period before acting on a message. For example, an e-commerce system might delay a "send confirmation email" message by 30 seconds to allow a transaction to fully commit before triggering downstream actions. Another use case: adding a brief delay before retrying a message to avoid immediately hammering a downstream service that just returned an error.

For **Standard queues**, changing the \`DelaySeconds\` setting is **not retroactive** — messages already in the queue are unaffected and become visible based on the delay value in effect when they were sent. For **FIFO queues**, changing \`DelaySeconds\` IS retroactive — the new setting applies to messages already in the queue that haven't become visible yet.`,
      quiz: [
        {
          question:
            "A Standard SQS queue is configured with DelaySeconds=120. You change the delay to 300 seconds. What happens to messages already in the queue that were sent while the delay was 120 seconds?",
          options: [
            "They are now delayed for 300 seconds from their original send time",
            "They are unaffected and become visible 120 seconds after they were sent",
            "They are immediately visible because changing the delay is retroactive for Standard queues",
            "They are deleted and must be re-sent with the new delay value",
          ],
          correctIndex: 1,
          explanation:
            "For Standard queues, the per-queue delay setting is NOT retroactive. Messages already in the queue when you change DelaySeconds will become visible based on the delay value that was set when they were sent (120 seconds). Only newly sent messages will use the new 300-second delay. FIFO queues behave differently — their delay setting IS retroactive.",
        },
      ],
    },
    {
      heading: "Message Timers: Per-Message Delay Override",
      body: `While a delay queue applies a uniform delay to all messages, **message timers** let you specify a different \`DelaySeconds\` value for individual messages using the \`DelaySeconds\` parameter in the \`SendMessage\` API call. The message timer overrides the queue's delay setting for that specific message.

Message timers follow the same range as delay queues: 0 to 900 seconds (15 minutes). This is useful when different messages in the same queue require different delivery timing — for example, a retry with an exponential backoff delay, or a high-priority message that should skip the queue's default delay by sending with \`DelaySeconds=0\`.

Note that message timers are only applicable on **Standard queues**. FIFO queues do not support per-message delays (message timers).`,
      quiz: [
        {
          question:
            "A Standard SQS queue has a default DelaySeconds=60. You call SendMessage with DelaySeconds=0 for a high-priority message. When will the message become visible?",
          options: [
            "After 60 seconds — the queue default always applies",
            "Immediately — the message-level DelaySeconds=0 overrides the queue default",
            "After 30 seconds — SQS averages the queue and message-level delays",
            "FIFO queues do not support message timers",
          ],
          correctIndex: 1,
          explanation:
            "The message-level DelaySeconds parameter overrides the queue's default delay for that specific message. Sending with DelaySeconds=0 makes the message immediately visible, bypassing the queue's 60-second delay. This is the message timer feature of Standard queues. Note: the last option is technically a true statement but doesn't apply here since this is a Standard queue.",
        },
      ],
    },
    {
      heading: "Delay vs Visibility Timeout: Key Difference",
      body: `Delay queues and visibility timeouts both make messages invisible for a period, but they operate at different points in the message lifecycle. The **delay** hides a message when it is **first added to the queue** — the consumer has never seen it yet. The **visibility timeout** hides a message **after it is received** by a consumer — the message is being processed.

Think of it this way: a delay queue postpones when a message enters the "available for consumption" state. A visibility timeout prevents concurrent consumption of a message already being processed. Both use the same underlying mechanism (the message is invisible) but serve completely different purposes.

Another way to remember the distinction: if you want to schedule when a message becomes available for the first time, use a delay queue. If you want to prevent duplicate concurrent processing, that's the visibility timeout.`,
      quiz: [
        {
          question:
            "Which mechanism makes a message invisible BEFORE it is received by any consumer, and which makes it invisible AFTER it is received?",
          options: [
            "Visibility timeout hides it before; delay queue hides it after",
            "Delay queue hides it before; visibility timeout hides it after",
            "Both delay queue and visibility timeout hide messages before receipt",
            "Both mechanisms operate after receipt — only the duration differs",
          ],
          correctIndex: 1,
          explanation:
            "Delay queue (or message timer) hides the message when it is first sent to the queue — before any consumer has received it. Visibility timeout hides the message after a consumer receives it, preventing duplicate concurrent processing. These are complementary mechanisms at different stages of the message lifecycle.",
        },
      ],
    },
    {
      heading: "When 15 Minutes Isn't Enough: EventBridge Scheduler",
      body: `The maximum delay for both delay queues and message timers is 15 minutes. If your use case requires scheduling message delivery further into the future — hours, days, or at a specific absolute time — SQS alone cannot do it.

**Amazon EventBridge Scheduler** is the AWS-recommended solution for longer scheduling needs. It can schedule billions of one-time or recurring API actions with no time limitation. You can configure EventBridge Scheduler to call \`SendMessage\` on an SQS queue at any future time, effectively giving you arbitrary-length delayed message delivery.

A common pattern: your application logic determines that a message should be processed in 24 hours. Instead of storing this in a database and polling, you create an EventBridge Scheduler one-time schedule to call \`SendMessage\` on your SQS queue 24 hours from now. The scheduler fires once, the message lands in the queue, and your consumer processes it normally.`,
      quiz: [
        {
          question:
            "You need to send an SQS message that should be processed exactly 6 hours from now. SQS delay queues and message timers support a maximum of 15 minutes. What should you use?",
          options: [
            "A FIFO queue with MessageGroupId set to a future timestamp",
            "EventBridge Scheduler to call SendMessage on the SQS queue 6 hours from now",
            "An SQS queue with a 6-hour visibility timeout",
            "AWS Lambda to poll a DynamoDB table and send the message after 6 hours",
          ],
          correctIndex: 1,
          explanation:
            "EventBridge Scheduler is the AWS-recommended solution for scheduling beyond the 15-minute SQS delay limit. It can call SendMessage at any future time — you schedule a one-time event 6 hours from now targeting the SQS queue. Setting a 6-hour visibility timeout is incorrect (visibility timeout hides a message after receipt, not before). Lambda polling DynamoDB works but is an anti-pattern — that's exactly what EventBridge Scheduler replaces.",
        },
      ],
    },
  ],

  keyFacts: [
    "Delay queue: postpones message delivery at the queue level; range 0–900 seconds (15 minutes)",
    "Message timer: per-message DelaySeconds override in SendMessage; same range 0–900 seconds",
    "Message timers are only supported on Standard queues — NOT on FIFO queues",
    "Standard queue delay setting change is NOT retroactive (existing messages unaffected)",
    "FIFO queue delay setting change IS retroactive (applies to already-queued messages)",
    "Delay hides message BEFORE first receipt; visibility timeout hides AFTER receipt",
    "For delays > 15 minutes, use Amazon EventBridge Scheduler",
    "Message-level DelaySeconds overrides the queue-level DelaySeconds for that message",
  ],

  relatedServices: [
    "Amazon EventBridge Scheduler",
    "AWS Lambda",
    "Amazon DynamoDB",
    "AWS Step Functions",
  ],

  examTips: [
    "Delay queue = hide before first receipt; visibility timeout = hide after receipt",
    "Message timers only work on Standard queues — not FIFO",
    "Standard queue delay change is not retroactive; FIFO IS retroactive — classic exam trick",
    "For scheduling > 15 minutes, the answer is always EventBridge Scheduler",
    "DelaySeconds=0 on a message overrides a queue's non-zero delay for that specific message",
  ],
};
