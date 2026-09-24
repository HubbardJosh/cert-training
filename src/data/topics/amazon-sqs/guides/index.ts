import { ServiceGuide } from "../../../../types/guide";
import { overviewGuide } from "./overview";
import { queueTypesGuide } from "./queueTypes";
import { visibilityAndPollingGuide } from "./visibilityAndPolling";
import { deadLetterQueuesGuide } from "./deadLetterQueues";
import { delayAndMessageTimersGuide } from "./delayAndMessageTimers";
import { securityAndEncryptionGuide } from "./securityAndEncryption";
import { lambdaIntegrationGuide } from "./lambdaIntegration";
import { performancePatternsGuide } from "./performancePatterns";

export const allGuides: ServiceGuide[] = [
  // Foundational: what SQS is, message lifecycle, key limits
  overviewGuide,
  // Core concept: Standard vs FIFO — ordering, throughput, deduplication
  queueTypesGuide,
  // Mechanics: visibility timeout, polling strategies, in-flight limits
  visibilityAndPollingGuide,
  // Resilience: dead-letter queues, redrive policy, retention
  deadLetterQueuesGuide,
  // Scheduling: delay queues, message timers, EventBridge for longer delays
  delayAndMessageTimersGuide,
  // Security: IAM, queue policies, SSE-SQS/KMS, VPC endpoints
  securityAndEncryptionGuide,
  // Integration: Lambda ESM, batching windows, partial batch failure
  lambdaIntegrationGuide,
  // Scale: batch APIs, horizontal scaling, extended client, SNS fan-out
  performancePatternsGuide,
];

export { ServiceGuide };
