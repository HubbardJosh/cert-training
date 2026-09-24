import { ServiceGuide } from "../../../../types/guide";

// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html
// Source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html
export const visibilityAndPollingGuide: ServiceGuide = {
  id: "amazon-sqs-visibility-polling",
  service: "Visibility Timeout & Polling",
  domain: "development",
  tagline:
    "Controlling message redelivery windows and eliminating wasted polling requests",
  intro:
    "Visibility timeout and polling strategy are two of the most operationally important SQS settings. Misconfiguring the visibility timeout causes either premature redelivery (timeout too short) or long delays on failure retry (timeout too long). Using short polling wastes money and adds latency. Understanding these mechanics at the API level is essential for building reliable, cost-efficient SQS consumers.",

  sections: [
    {
      heading: "Visibility Timeout: The Pessimistic Lock",
      body: `When \`ReceiveMessage\` returns a message to your consumer, SQS immediately starts a countdown — the **visibility timeout**. For the duration of this countdown, the message is invisible to every other \`ReceiveMessage\` call. This acts as a pessimistic lock: SQS assumes processing might fail, so it keeps the message available for retry while giving your consumer time to work.

The default visibility timeout is **30 seconds**. The minimum is 0 seconds (immediately visible again — useful for debugging). The maximum is **12 hours**. You can set the timeout at the queue level via \`SetQueueAttributes\`, or override it per message in the \`ReceiveMessage\` call using the \`VisibilityTimeout\` parameter.

The visibility timeout begins the moment the message is returned to your consumer, not when you start processing it. If your consumer spends 5 seconds deserializing the message before starting real work, those 5 seconds count against the timeout. Set the visibility timeout to match the **worst-case** (not average) processing time for messages in that queue.`,
      quiz: [
        {
          question:
            "A queue's visibility timeout is 60 seconds. A consumer receives a message at 12:00:00 but doesn't start processing until 12:00:45 and finishes at 12:01:20. What happens to the message?",
          options: [
            "The message is successfully deleted because processing completed within the total time",
            "The message becomes visible again at 12:01:00 before processing finishes, risking redelivery",
            "SQS detects the consumer is still active and extends the timeout automatically",
            "The message is moved to the DLQ because processing took longer than the timeout",
          ],
          correctIndex: 1,
          explanation:
            "The visibility timeout starts when the message is received (12:00:00), not when processing begins. With a 60-second timeout, the message becomes visible again at 12:01:00. Processing doesn't finish until 12:01:20 — so the message is exposed to redelivery 20 seconds before the consumer calls DeleteMessage. SQS does not automatically extend timeouts; you must call ChangeMessageVisibility. Messages are not moved to a DLQ by visibility timeout expiry alone — only by exceeding maxReceiveCount.",
        },
      ],
    },
    {
      heading: "Extending Timeouts with ChangeMessageVisibility",
      body: `If your consumer needs more time than the initial visibility timeout, call \`ChangeMessageVisibility\` with a new \`VisibilityTimeout\` value. This resets the countdown from the current moment — you get a fresh window of up to 12 hours. This is the basis for a **heartbeat pattern**: a background thread periodically extends the visibility timeout while the main thread processes the message, ensuring the message never becomes visible until processing is confirmed complete or the process crashes.

The 12-hour maximum is from the **initial receive time**, not from each extension call. If you receive a message and then call \`ChangeMessageVisibility\` multiple times, the cumulative visibility window still cannot exceed 12 hours from when you first received the message. If your processing genuinely needs more than 12 hours, break the task into smaller steps using AWS Step Functions or a separate coordination mechanism.

To immediately release a message back to the queue (for example, your consumer determines it cannot process the message right now), call \`ChangeMessageVisibility\` with \`VisibilityTimeout=0\`. This makes the message instantly available for another consumer to receive.`,
      quiz: [
        {
          question:
            "A consumer receives a message at 10:00 AM and the visibility timeout is 5 minutes. At 10:04 AM, the consumer calls ChangeMessageVisibility with VisibilityTimeout=600 (10 minutes). When does the message become visible again if not deleted?",
          options: [
            "10:14 AM (10 minutes from the ChangeMessageVisibility call)",
            "10:09 AM (5 minutes from the initial receive, ignoring the extension)",
            "10:10 AM (12 hours maximum minus the initial timeout)",
            "The message is immediately visible because the extension exceeds the original timeout",
          ],
          correctIndex: 0,
          explanation:
            "ChangeMessageVisibility resets the countdown from the current moment. At 10:04 AM, calling ChangeMessageVisibility with 600 seconds (10 minutes) makes the message visible again at 10:14 AM — 10 minutes from the call, not from the original receive time. The extension simply replaces the remaining visibility window with a new one.",
        },
      ],
    },
    {
      heading: "Short Polling vs Long Polling",
      body: `By default, \`ReceiveMessage\` uses **short polling**: SQS queries a random subset of its servers and returns immediately, even if no messages are found. This can return false empty responses — the queue has messages, but they happen to be on servers that weren't sampled. You pay for every API call whether or not messages are returned.

**Long polling** is enabled by setting \`WaitTimeSeconds\` to a value between 1 and 20. With long polling, \`ReceiveMessage\` queries all SQS servers (eliminating false empties) and holds the connection open until either a message arrives or \`WaitTimeSeconds\` elapses. The maximum is **20 seconds**. Long polling dramatically reduces both empty responses and cost: instead of calling \`ReceiveMessage\` hundreds of times on an idle queue, a single long-poll call waits up to 20 seconds, reducing API call volume by 10–20x on low-traffic queues.

You can configure long polling at two levels: set \`ReceiveMessageWaitTimeSeconds\` on the queue via \`SetQueueAttributes\` (applies to all consumers of that queue), or set \`WaitTimeSeconds\` on individual \`ReceiveMessage\` calls. The call-level setting overrides the queue-level setting. AWS recommends 20 seconds for most workloads. Lambda event source mappings for SQS automatically use long polling.`,
      quiz: [
        {
          question:
            "A low-traffic SQS queue receives about 10 messages per hour. A consumer is polling it with default ReceiveMessage calls (WaitTimeSeconds=0) every 1 second. What is the primary concern with this approach?",
          options: [
            "Messages will be delayed because short polling misses messages",
            "The consumer will receive duplicate messages more frequently",
            "The high volume of empty API responses increases costs unnecessarily",
            "Short polling is not supported for FIFO queues",
          ],
          correctIndex: 2,
          explanation:
            "With 10 messages per hour and a 1-second poll interval, there are approximately 3,600 ReceiveMessage calls per hour but only 10 return messages. The other ~3,590 calls return empty responses — all of which are billed. Switching to long polling with WaitTimeSeconds=20 would reduce API calls by ~95% and eliminate virtually all empty response costs. Short polling can miss messages on a single call but not persistently. FIFO queues support both polling modes.",
        },
      ],
    },
    {
      heading: "In-Flight Message Limits",
      body: `Messages that have been received by a consumer but not yet deleted are called **in-flight messages**. SQS enforces limits on in-flight messages because they consume visibility-timeout slots on SQS's servers. For **Standard queues**, the limit is approximately **120,000 in-flight messages**. If you reach this limit, subsequent \`ReceiveMessage\` calls return an \`OverLimit\` error (with short polling) or simply return no messages (with long polling).

In-flight message buildup typically indicates that consumers are receiving faster than they can process and delete. Remediation options include: delete messages faster after processing, add more consumer instances, or (if the root cause is slow processing) reduce the rate of \`ReceiveMessage\` calls.

For **FIFO queues**, in-flight limits depend on active message groups. Each active group can have one in-flight message at a time — if a message in a group is in-flight, all subsequent messages in that group are held back. This is how FIFO ordering is enforced per group.`,
      quiz: [
        {
          question:
            "A Standard SQS queue has 150,000 messages in-flight. What behavior should a consumer expect when calling ReceiveMessage with short polling?",
          options: [
            "ReceiveMessage returns up to 10 messages from the oldest in-flight batch",
            "ReceiveMessage returns an OverLimit error until in-flight count drops below the limit",
            "SQS automatically increases the in-flight limit to handle the load",
            "ReceiveMessage blocks until some in-flight messages are deleted",
          ],
          correctIndex: 1,
          explanation:
            "When a Standard queue's in-flight limit (~120,000 messages) is exceeded, ReceiveMessage with short polling returns an OverLimit error. No new messages can be received until existing in-flight messages are deleted. With long polling, SQS returns no messages rather than an error. SQS does not auto-scale the in-flight limit — you must process and delete messages faster.",
        },
      ],
    },
  ],

  keyFacts: [
    "Default visibility timeout: 30 seconds; min: 0 seconds; max: 12 hours",
    "Visibility timeout starts when the message is RETURNED to the consumer, not when processing starts",
    "ChangeMessageVisibility resets the countdown from the current moment",
    "12-hour maximum visibility is from initial receive time — cannot exceed 12 hours total",
    "Set VisibilityTimeout=0 to immediately release a message back to the queue",
    "Short polling (default): queries a subset of servers, returns immediately, can miss messages",
    "Long polling: WaitTimeSeconds 1–20, queries ALL servers, waits for a message to arrive",
    "Long polling max wait: 20 seconds",
    "Standard queue in-flight limit: ~120,000 messages",
    "In-flight limit exceeded: OverLimit error (short polling) or no messages returned (long polling)",
    "Lambda SQS event source mappings use long polling automatically",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon CloudWatch",
    "AWS Step Functions",
    "Amazon EC2 Auto Scaling",
  ],

  examTips: [
    "Always use long polling (WaitTimeSeconds=20) unless you have a specific reason not to",
    "Set visibility timeout to worst-case processing time, not average",
    "Use ChangeMessageVisibility heartbeat pattern for long-running consumers",
    "In-flight limit exceeded = consumers are receiving faster than they can process",
    "VisibilityTimeout=0 is the 'release back to queue' trick for poison message handling",
    "Queue-level ReceiveMessageWaitTimeSeconds applies to all consumers; call-level overrides it",
    "False empty responses from short polling can be misleading — a non-empty queue looks empty",
  ],
};
