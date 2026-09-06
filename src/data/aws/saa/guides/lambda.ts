import { ServiceGuide } from "../../../../types/guide";

export const lambdaGuide: ServiceGuide = {
  id: "saa-lambda",
  service: "AWS Lambda",
  domain: "applications",
  tagline: "Serverless compute — run code without managing servers",
  intro:
    "Lambda executes code in response to events with no server management. It scales automatically, charges only for execution time, and integrates with virtually every AWS service. Lambda is central to serverless architectures on SAA-C03.",

  sections: [
    {
      heading: "Lambda Fundamentals and Invocation Models",
      body: `Lambda functions are invoked in three ways. **Synchronous invocation**: the caller waits for the response (API Gateway, ALB, Cognito triggers, CLI). Errors are returned to the caller immediately — retry logic is the caller's responsibility. **Asynchronous invocation**: Lambda queues the event and returns immediately (S3 event notifications, SNS, EventBridge). Lambda retries failed async invocations twice automatically, then sends the event to a DLQ or Lambda Destinations. **Poll-based / stream invocation**: Lambda polls a source on your behalf (SQS, Kinesis, DynamoDB Streams, MSK). Lambda manages the polling and batching.

Lambda functions have a maximum timeout of **15 minutes** (900 seconds). Memory ranges from 128 MB to 10,240 MB — CPU is allocated proportionally to memory. The /tmp directory provides 512 MB to 10,240 MB of ephemeral storage per execution environment. For persistent storage, use S3, EFS, or DynamoDB.`,
      quiz: [
        {
          question:
            "An S3 event triggers a Lambda function to resize uploaded images. The function occasionally fails. Where should failed events be sent for later reprocessing?",
          options: [
            "A DLQ or Lambda Destination configured on the function's async invocation",
            "A CloudWatch alarm that triggers a retry Lambda",
            "An SQS queue that S3 also writes to as a backup",
            "Retry logic in the function itself using try/catch",
          ],
          correctIndex: 0,
          explanation:
            "S3 event notifications use asynchronous invocation. Lambda automatically retries async failures twice. After all retries are exhausted, the event is sent to a configured DLQ (SQS or SNS) or Lambda Destination (SQS, SNS, EventBridge, or another Lambda). In-function retry logic cannot help after the function itself crashes.",
        },
      ],
    },
    {
      heading: "Lambda Concurrency and Scaling",
      body: `Lambda scales by launching new execution environments concurrently — one environment per in-flight request. **Reserved concurrency** sets the maximum concurrent executions for a specific function, preventing it from consuming the account-wide concurrency limit (1,000 per region by default) and guaranteeing capacity for that function. **Provisioned concurrency** pre-initializes execution environments, eliminating cold starts for latency-sensitive functions.

**Cold starts** occur when Lambda creates a new execution environment: downloads the code, initializes the runtime, and runs initialization code outside the handler. Cold starts add latency (milliseconds for Node.js/Python, seconds for Java). Mitigations: Provisioned Concurrency, keeping init code minimal, choosing faster runtimes, and reducing package size. Functions connected to a VPC have longer cold starts because an ENI must be created (improved significantly with Hyperplane ENI sharing).`,
      quiz: [
        {
          question:
            "A Lambda-based API must respond in under 100ms including Lambda execution. Cold starts are causing intermittent timeouts. What should be configured?",
          options: [
            "Provisioned Concurrency on the Lambda function",
            "Reserved Concurrency set to 100",
            "Schedule a CloudWatch event to ping the function every 5 minutes",
            "Increase the function's memory to reduce execution time",
          ],
          correctIndex: 0,
          explanation:
            "Provisioned Concurrency pre-warms the specified number of execution environments, completely eliminating cold starts. Scheduled pings are a hack that keeps one environment warm but doesn't scale. Reserved Concurrency limits max concurrency but doesn't warm environments. Increasing memory helps execution speed, not cold start latency.",
        },
      ],
    },
    {
      heading: "Lambda and VPC Connectivity",
      body: `By default, Lambda runs in an AWS-managed VPC with internet access but no access to resources in your VPC. To access RDS, ElastiCache, or other private VPC resources, configure Lambda with a VPC (specify VPC, subnets, and security group). When VPC-connected, Lambda creates an ENI in the specified subnets — this adds cold start latency.

VPC-connected Lambda functions **lose internet access** unless the VPC has a NAT Gateway in a public subnet that routes to an IGW. For Lambda to call public AWS APIs (e.g., S3, DynamoDB) from a VPC, you have two options: route through NAT Gateway (adds cost) or use VPC Interface Endpoints (PrivateLink) for those services. Lambda in a VPC cannot access the internet through an IGW alone — it must go through NAT.`,
      quiz: [
        {
          question:
            "A Lambda function in a VPC needs to access both an RDS database in a private subnet and an S3 bucket. What is the MOST cost-effective networking setup?",
          options: [
            "Configure Lambda with VPC access to the private subnet, and add a Gateway VPC Endpoint for S3",
            "Configure Lambda with VPC access and a NAT Gateway for all traffic",
            "Deploy Lambda without VPC access and access RDS via a public endpoint",
            "Use RDS Proxy outside the VPC to enable Lambda to reach RDS without VPC config",
          ],
          correctIndex: 0,
          explanation:
            "Gateway VPC Endpoints for S3 are free and route S3 traffic through the AWS backbone without a NAT Gateway. Lambda in the VPC accesses RDS directly via the private subnet. This avoids the per-GB NAT Gateway cost for S3 traffic while maintaining private connectivity to RDS. RDS public endpoints are a security risk.",
        },
      ],
    },
    {
      heading: "Lambda Layers and Container Images",
      body: `**Lambda Layers** are ZIP archives containing libraries, custom runtimes, or configuration data. A function can reference up to 5 layers, extracted to /opt at runtime. Layers are versioned — functions pin to a specific layer version. Layers reduce deployment package size and allow sharing common dependencies across functions without bundling them into each ZIP.

**Container image support** allows Lambda functions to be packaged as Docker images up to 10 GB. The image must use an AWS-provided base image or implement the Lambda Runtime Interface Client. Container images enable larger packages (ML models, complex dependencies), consistent local development using Docker, and use of existing container-based CI/CD pipelines. Container images are cached in ECR and pulled on first invocation — they have longer cold starts than ZIP deployments.`,
      quiz: [
        {
          question:
            "A machine learning Lambda function requires 4 GB of model weights and Python libraries. The standard 250 MB unzipped ZIP limit is insufficient. What is the solution?",
          options: [
            "Package the function as a container image (up to 10 GB)",
            "Use a Lambda Layer to store the model weights",
            "Increase the Lambda function's memory to accommodate larger packages",
            "Store the model in S3 and download it during each cold start",
          ],
          correctIndex: 0,
          explanation:
            "Container images support Lambda packages up to 10 GB, accommodating large ML models. Lambda Layers have a combined size limit of 250 MB (same as ZIP). Downloading from S3 on every cold start is slow and fragile. Memory allocation affects runtime compute, not package size limits.",
        },
      ],
    },
    {
      heading: "Lambda Event Source Mappings",
      body: `**Event source mappings** configure Lambda to poll a stream or queue and invoke functions with batches of records. Supported sources: SQS, Kinesis Data Streams, DynamoDB Streams, and MSK. For **SQS**: Lambda polls and delivers batches (default 10 messages per batch, configurable up to 10,000 with a batch window). If the function fails, the batch is retried based on SQS visibility timeout. Configure a DLQ on the SQS queue for messages that exhaust retry attempts.

For **Kinesis/DynamoDB Streams**: Lambda processes shards in parallel (one concurrent invocation per shard). Records within a shard are processed in order. **Bisect on error** splits the batch and retries the halves independently to isolate failing records. **Destination on failure** sends failed records to S3, SQS, SNS, or EventBridge. For **SQS with batch processing**, the function should delete successfully processed records and allow failed ones to remain for retry — use \`ReportBatchItemFailures\` to return partial failure results.`,
      quiz: [
        {
          question:
            "A Lambda function processes Kinesis stream records. One bad record in a batch causes the entire batch to fail and retry indefinitely, blocking all later records. How should this be resolved?",
          options: [
            "Enable bisect-on-error so Lambda splits the batch to isolate the bad record",
            "Decrease the batch size to 1 so each record is processed individually",
            "Add a DLQ to the Lambda function for async retries",
            "Increase the Kinesis shard count to distribute the load",
          ],
          correctIndex: 0,
          explanation:
            "Bisect-on-error splits a failing batch in half and retries each half separately. This recursively isolates the single bad record, which is then sent to a failure destination. Reducing batch size to 1 works but is inefficient and costly. DLQ is for async invocations, not stream event source mappings.",
        },
      ],
    },
  ],

  keyFacts: [
    "Lambda timeout: maximum 15 minutes (900 seconds)",
    "Lambda memory: 128 MB to 10,240 MB — CPU scales proportionally",
    "Synchronous invocation: caller waits and handles retries. Async: Lambda retries twice",
    "Reserved Concurrency: guarantees and caps function concurrency",
    "Provisioned Concurrency: pre-warms environments to eliminate cold starts",
    "VPC Lambda loses internet access — needs NAT Gateway or VPC endpoints for AWS APIs",
    "Lambda container images: up to 10 GB. ZIP packages: 250 MB unzipped",
    "Lambda Layers: up to 5 per function, extracted to /opt",
    "Event source mappings poll SQS/Kinesis/DynamoDB Streams/MSK on your behalf",
    "Bisect-on-error: isolates bad Kinesis/DynamoDB stream records from blocking a shard",
    "Default account concurrency limit: 1,000 per region (can be increased)",
    "/tmp ephemeral storage: 512 MB to 10,240 MB — not shared between invocations",
    "Lambda function URLs: direct HTTPS endpoint for invoking Lambda without API Gateway — useful for webhooks and simple integrations",
  ],

  relatedServices: [
    "Amazon API Gateway",
    "Amazon SQS",
    "Amazon SNS",
    "Amazon EventBridge",
    "Amazon Kinesis",
    "AWS Step Functions",
    "Amazon RDS Proxy",
  ],

  examTips: [
    "Lambda + RDS: always add RDS Proxy to avoid connection pool exhaustion at scale",
    "Lambda in VPC + S3: use Gateway Endpoint (free) instead of NAT Gateway",
    "For eliminating cold starts in latency-sensitive APIs: Provisioned Concurrency",
    "Reserved Concurrency of 0 effectively disables the function — useful for emergency throttling",
    "Lambda async DLQ is on the function; for SQS event source mapping, the DLQ is on the SQS queue",
    "Lambda execution environment reuse: put initialization code (DB connections, SDK clients) outside the handler",
    "For large workloads requiring > 15 min execution: use Step Functions, ECS Fargate, or AWS Batch instead",
    "Lambda SnapStart (Java): pre-initializes execution environment and creates a snapshot — reduces Java cold starts",
    "Billing: duration × memory in GB-seconds + number of requests (first 1M requests/month free)",
    "Lambda can be triggered by ALB directly — no API Gateway needed for simple HTTP use cases",
    "Lambda Destinations support both On Success and On Failure routing — not just failures like Dead Letter Queues (DLQ)",
    "Lambda function URLs provide a simple HTTPS endpoint without needing API Gateway",
  ],
};
