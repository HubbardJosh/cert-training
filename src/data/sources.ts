import { CertificationId } from "../context/CertContext";

export interface Source {
  title: string;
  url: string;
  topics: string[];
}

export interface CertSources {
  certId: CertificationId;
  sources: Source[];
}

export const SOURCES: CertSources[] = [
  {
    certId: "saa-c03",
    sources: [
      {
        title:
          "AWS Certified Solutions Architect – Associate Exam Guide (SAA-C03)",
        url: "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html",
        topics: [
          "Exam domains and weightings",
          "Domain 1: Design Secure Architectures (30%)",
          "Domain 2: Design Resilient Architectures (26%)",
          "Domain 3: Design High-Performing Architectures (24%)",
          "Domain 4: Design Cost-Optimized Architectures (20%)",
          "65 questions, 130 minutes, passing score 720/1000",
        ],
      },
      {
        title: "AWS IAM – User Guide",
        url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html",
        topics: [
          "Users, groups, roles, and policies",
          "Policy evaluation logic and explicit Deny",
          "Permissions boundaries and SCPs",
          "STS AssumeRole and federation",
          "Resource-based policies and cross-account access",
        ],
      },
      {
        title: "Amazon VPC – User Guide",
        url: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html",
        topics: [
          "Subnets, route tables, and internet gateways",
          "Security groups vs. NACLs (stateful vs. stateless)",
          "NAT Gateway for private subnet internet access",
          "VPC peering, Transit Gateway, and PrivateLink",
          "VPN and Direct Connect connectivity",
          "VPC Flow Logs and network monitoring",
        ],
      },
      {
        title: "Amazon EC2 – User Guide",
        url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html",
        topics: [
          "Instance types, families, and purchasing options",
          "On-Demand, Reserved, Savings Plans, Spot, Dedicated",
          "EBS volume types and performance characteristics",
          "Auto Scaling Groups and scaling policies",
          "Placement groups (Cluster, Spread, Partition)",
          "Instance metadata and user data",
        ],
      },
      {
        title: "Amazon S3 – User Guide",
        url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
        topics: [
          "Storage classes and minimum storage durations",
          "Bucket policies, Block Public Access, and ACLs",
          "Versioning, CRR, SRR, and Batch Replication",
          "Lifecycle policies and transitions",
          "SSE-S3, SSE-KMS, and SSE-C encryption",
          "Transfer Acceleration and multipart upload",
          "S3 Object Lock and WORM compliance",
        ],
      },
      {
        title: "Amazon RDS – User Guide",
        url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html",
        topics: [
          "Multi-AZ vs. Read Replicas",
          "Automated backups and PITR",
          "RDS Proxy for connection pooling",
          "Aurora storage architecture and Global Database",
          "Aurora Serverless v2",
          "ElastiCache Redis vs. Memcached",
        ],
      },
      {
        title: "Elastic Load Balancing – User Guide",
        url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html",
        topics: [
          "ALB: Layer 7, path/host routing, WAF, SNI",
          "NLB: Layer 4, static IPs, source IP preservation",
          "GLB: Layer 3, inline appliance routing",
          "Target groups, health checks, and connection draining",
        ],
      },
      {
        title: "Amazon CloudFront – Developer Guide",
        url: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
        topics: [
          "Origins, distributions, and cache behaviors",
          "Origin Access Control (OAC) for S3",
          "Cache invalidation and cache busting",
          "Signed URLs and signed cookies",
          "Lambda@Edge vs. CloudFront Functions",
          "WAF and geo-restriction",
        ],
      },
      {
        title: "Amazon Route 53 – Developer Guide",
        url: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html",
        topics: [
          "DNS record types: A, CNAME, Alias",
          "Routing policies: Simple, Weighted, Latency, Geolocation, Failover",
          "Health checks and DNS failover",
          "Private hosted zones and Resolver endpoints",
        ],
      },
      {
        title: "Amazon SQS – Developer Guide",
        url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html",
        topics: [
          "Standard vs. FIFO queues",
          "Visibility timeout and duplicate processing",
          "Dead Letter Queues and DLQ redrive",
          "Long polling and message retention",
        ],
      },
      {
        title: "Amazon SNS – Developer Guide",
        url: "https://docs.aws.amazon.com/sns/latest/dg/welcome.html",
        topics: [
          "Fan-out pattern: SNS → multiple SQS queues",
          "Subscription filter policies",
          "SNS FIFO topics for ordered fan-out",
        ],
      },
      {
        title: "AWS Lambda – Developer Guide",
        url: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
        topics: [
          "Invocation models: synchronous, asynchronous, poll-based",
          "Reserved and Provisioned Concurrency",
          "VPC connectivity and cold starts",
          "Event source mappings and bisect-on-error",
          "Lambda Layers and container images",
        ],
      },
      {
        title: "AWS CloudFormation – User Guide",
        url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html",
        topics: [
          "Template sections: Parameters, Conditions, Resources, Outputs",
          "Change Sets for previewing updates",
          "Drift detection and stack policies",
          "Nested stacks and StackSets",
          "cfn-init and cfn-signal for instance readiness",
        ],
      },
      {
        title: "Amazon DynamoDB – Developer Guide",
        url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html",
        topics: [
          "Partition key design and hot partition avoidance",
          "GSI vs. LSI — creation time, throughput, consistency",
          "Provisioned vs. On-Demand capacity modes",
          "DynamoDB Streams, DAX, Global Tables",
          "TTL for automatic item expiry",
        ],
      },
      {
        title: "Amazon CloudWatch – User Guide",
        url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
        topics: [
          "EC2 metrics vs. custom metrics (CloudWatch Agent)",
          "Metric Filters on CloudWatch Logs",
          "Composite alarms",
          "CloudTrail vs. CloudWatch vs. Config",
        ],
      },
      {
        title: "AWS Security Services Overview",
        url: "https://aws.amazon.com/products/security/",
        topics: [
          "KMS: customer managed keys and envelope encryption",
          "Secrets Manager vs. SSM Parameter Store",
          "GuardDuty: threat detection without agents",
          "WAF, Shield Standard, Shield Advanced",
          "Inspector (CVE scanning) and Macie (PII discovery)",
          "CloudHSM: FIPS 140-2 Level 3",
        ],
      },
      {
        title: "Amazon Kinesis – Developer Guide",
        url: "https://docs.aws.amazon.com/streams/latest/dev/introduction.html",
        topics: [
          "KDS: real-time, shards, retention, Enhanced Fan-Out",
          "KDF: near-real-time delivery to S3/Redshift/OpenSearch",
          "KDS vs. KDF vs. SQS selection criteria",
        ],
      },
      {
        title: "AWS Storage Services Overview",
        url: "https://docs.aws.amazon.com/whitepapers/latest/aws-storage-services-overview/aws-storage-services-overview.html",
        topics: [
          "EFS: shared NFS, multi-AZ, auto-scaling",
          "FSx for Windows, Lustre, NetApp ONTAP",
          "Storage Gateway: File, Tape, Volume",
          "DataSync and Snow Family for migration",
        ],
      },
    ],
  },
  {
    certId: "clf-c02",
    sources: [
      {
        title: "AWS Certified Cloud Practitioner – Exam Guide (CLF-C02)",
        url: "https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf",
        topics: [
          "Exam domains and weightings",
          "Scope of services tested",
          "Passing score and format",
        ],
      },
      {
        title: "AWS Support Plans",
        url: "https://aws.amazon.com/premiumsupport/plans/",
        topics: [
          "Basic, Developer, Business, Enterprise On-Ramp, Enterprise tiers",
          "Response time SLAs per severity",
          "Trusted Advisor access by plan",
          "TAM availability",
        ],
      },
      {
        title: "AWS Pricing – How AWS Pricing Works",
        url: "https://docs.aws.amazon.com/whitepapers/latest/how-aws-pricing-works/how-aws-pricing-works.pdf",
        topics: [
          "Pay-as-you-go, Save when you commit, Pay less by using more",
          "EC2 pricing models (On-Demand, Reserved, Spot, Savings Plans)",
          "S3 storage class pricing",
          "Data transfer costs",
        ],
      },
      {
        title: "AWS Global Infrastructure",
        url: "https://aws.amazon.com/about-aws/global-infrastructure/",
        topics: [
          "Regions, Availability Zones, Local Zones",
          "Edge locations and CloudFront POPs",
          "AWS Wavelength and Outposts",
        ],
      },
      {
        title: "Amazon EC2 – User Guide",
        url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html",
        topics: [
          "Instance types and families",
          "On-Demand, Reserved, Spot, Dedicated pricing models",
          "EC2 Auto Scaling",
          "Elastic Load Balancing",
        ],
      },
      {
        title: "AWS IAM – User Guide",
        url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html",
        topics: [
          "Users, groups, roles, policies",
          "Policy evaluation logic",
          "MFA and least-privilege",
          "IAM Identity Center (SSO)",
        ],
      },
      {
        title: "Amazon S3 – User Guide",
        url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
        topics: [
          "Storage classes (Standard, IA, Glacier tiers, Intelligent-Tiering)",
          "Versioning and lifecycle policies",
          "S3 Transfer Acceleration",
          "Cross-region replication",
        ],
      },
      {
        title: "Amazon VPC – User Guide",
        url: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html",
        topics: [
          "Subnets, route tables, internet gateways",
          "Security groups vs. NACLs",
          "VPC Peering and Transit Gateway",
          "VPN and Direct Connect",
        ],
      },
      {
        title: "Amazon RDS – User Guide",
        url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html",
        topics: [
          "Supported database engines",
          "Multi-AZ vs. Read Replicas",
          "Automated backups and snapshots",
          "Amazon Aurora",
        ],
      },
      {
        title: "Amazon DynamoDB – Developer Guide",
        url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html",
        topics: [
          "Partition keys and sort keys",
          "On-demand vs. provisioned capacity",
          "DynamoDB Streams and global tables",
          "DAX caching",
        ],
      },
      {
        title: "AWS Lambda – Developer Guide",
        url: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
        topics: [
          "Serverless execution model",
          "Triggers and event sources",
          "Concurrency and cold starts",
          "Pricing (requests + duration)",
        ],
      },
      {
        title: "Amazon CloudWatch – User Guide",
        url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
        topics: [
          "Metrics, alarms, and dashboards",
          "CloudWatch Logs",
          "CloudWatch Events / EventBridge",
          "Container Insights",
        ],
      },
      {
        title: "AWS CloudFormation – User Guide",
        url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html",
        topics: [
          "Infrastructure as Code concepts",
          "Templates, stacks, and change sets",
          "Rollback behavior",
          "StackSets for multi-account deployments",
        ],
      },
      {
        title: "Amazon CloudFront – Developer Guide",
        url: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
        topics: [
          "CDN and edge caching",
          "Origins and distributions",
          "Cache behaviors and TTLs",
          "OAC / OAI for S3 origin security",
        ],
      },
      {
        title: "Amazon Route 53 – Developer Guide",
        url: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html",
        topics: [
          "DNS routing policies (Simple, Weighted, Latency, Failover, Geolocation)",
          "Health checks",
          "Domain registration",
          "Private hosted zones",
        ],
      },
      {
        title: "Amazon SNS – Developer Guide",
        url: "https://docs.aws.amazon.com/sns/latest/dg/welcome.html",
        topics: [
          "Pub/sub messaging",
          "Topics and subscriptions",
          "Fan-out pattern",
          "Mobile push notifications",
        ],
      },
      {
        title: "Amazon SQS – Developer Guide",
        url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html",
        topics: [
          "Standard vs. FIFO queues",
          "Visibility timeout and dead-letter queues",
          "Long polling",
          "Message retention and size limits",
        ],
      },
      {
        title: "Amazon ECS – Developer Guide",
        url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html",
        topics: [
          "Tasks, services, and clusters",
          "EC2 launch type vs. Fargate",
          "Task definitions and IAM task roles",
          "Service Auto Scaling",
        ],
      },
      {
        title: "AWS Elastic Beanstalk – Developer Guide",
        url: "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html",
        topics: [
          "PaaS managed deployment",
          "Supported platforms",
          "Deployment policies (Rolling, Blue/Green)",
          "Environment tiers (Web vs. Worker)",
        ],
      },
      {
        title: "AWS Well-Architected Framework",
        url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
        topics: [
          "Six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability",
          "Design principles per pillar",
          "Well-Architected Tool",
        ],
      },
      {
        title: "AWS Shared Responsibility Model",
        url: "https://aws.amazon.com/compliance/shared-responsibility-model/",
        topics: [
          "Security OF the cloud (AWS responsibility)",
          "Security IN the cloud (customer responsibility)",
          "Variation by service type (IaaS, PaaS, SaaS)",
        ],
      },
    ],
  },
  {
    certId: "dva-c02",
    sources: [
      {
        title: "AWS Certified Developer – Associate Exam Guide (DVA-C02)",
        url: "https://d1.awsstatic.com/training-and-certification/docs-dev-associate/AWS-Certified-Developer-Associate_Exam-Guide.pdf",
        topics: [
          "Exam domains and weightings",
          "Scope of services tested",
          "Passing score and format",
        ],
      },
      {
        title: "AWS Lambda – Developer Guide",
        url: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
        topics: [
          "Handler, context, and event objects",
          "Concurrency, reserved concurrency, provisioned concurrency",
          "Layers and extensions",
          "Lambda@Edge",
        ],
      },
      {
        title: "Amazon DynamoDB – Developer Guide",
        url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html",
        topics: [
          "Partition key design and hot partitions",
          "GSIs and LSIs",
          "Conditional writes and transactions",
          "DynamoDB Streams",
        ],
      },
      {
        title: "Amazon API Gateway – Developer Guide",
        url: "https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html",
        topics: [
          "REST vs. HTTP vs. WebSocket APIs",
          "Authorizers (Lambda, Cognito)",
          "Caching and throttling",
          "Deployment stages and canary releases",
        ],
      },
      {
        title: "AWS CodeDeploy – User Guide",
        url: "https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html",
        topics: [
          "In-place, Blue/Green, Canary, Linear deployment strategies",
          "AppSpec file",
          "Deployment groups and hooks",
        ],
      },
      {
        title: "AWS CodeBuild – User Guide",
        url: "https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html",
        topics: [
          "Build environments and buildspec.yml",
          "Artifacts and caching",
          "Integration with CodePipeline",
        ],
      },
      {
        title: "AWS CodePipeline – User Guide",
        url: "https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html",
        topics: [
          "Pipeline stages: Source, Build, Test, Deploy",
          "Action types and providers",
          "Manual approval actions",
        ],
      },
      {
        title: "Amazon Cognito – Developer Guide",
        url: "https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html",
        topics: [
          "User Pools vs. Identity Pools",
          "JWT tokens (ID, Access, Refresh)",
          "Hosted UI and OAuth 2.0 flows",
          "Federation with external IdPs",
        ],
      },
      {
        title: "AWS X-Ray – Developer Guide",
        url: "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html",
        topics: [
          "Traces, segments, and subsegments",
          "Service map",
          "Sampling rules",
          "Integration with Lambda, API Gateway, ECS",
        ],
      },
      {
        title: "AWS KMS – Developer Guide",
        url: "https://docs.aws.amazon.com/kms/latest/developerguide/overview.html",
        topics: [
          "CMKs, data keys, and envelope encryption",
          "Key policies and grants",
          "Automatic key rotation",
          "KMS with S3, DynamoDB, and Secrets Manager",
        ],
      },
      {
        title: "AWS Secrets Manager – User Guide",
        url: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html",
        topics: [
          "Secret storage and retrieval",
          "Automatic rotation with Lambda",
          "Integration with RDS, Redshift, DocumentDB",
        ],
      },
      {
        title: "Amazon SQS – Developer Guide",
        url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html",
        topics: [
          "Standard vs. FIFO queues",
          "Visibility timeout and DLQs",
          "Long polling and batch operations",
          "SQS as Lambda trigger",
        ],
      },
      {
        title: "Amazon SNS – Developer Guide",
        url: "https://docs.aws.amazon.com/sns/latest/dg/welcome.html",
        topics: [
          "Fan-out architecture",
          "Message filtering",
          "SNS to SQS integration",
        ],
      },
      {
        title: "Amazon Kinesis – Developer Guide",
        url: "https://docs.aws.amazon.com/streams/latest/dev/introduction.html",
        topics: [
          "Kinesis Data Streams shards and partition keys",
          "Kinesis Data Firehose delivery streams",
          "Kinesis Data Analytics",
          "Enhanced fan-out",
        ],
      },
      {
        title: "AWS SAM – Developer Guide",
        url: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html",
        topics: [
          "SAM template syntax",
          "sam build, sam deploy, sam local",
          "AWS::Serverless resource types",
        ],
      },
      {
        title: "AWS CloudFormation – User Guide",
        url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html",
        topics: [
          "Intrinsic functions and pseudo-parameters",
          "Nested stacks and cross-stack references",
          "Custom resources",
          "Change sets and drift detection",
        ],
      },
      {
        title: "Amazon ElastiCache – User Guide",
        url: "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html",
        topics: [
          "Redis vs. Memcached",
          "Caching strategies (Lazy Loading, Write-Through)",
          "Cluster mode and replication groups",
          "Session state caching",
        ],
      },
      {
        title: "AWS Step Functions – Developer Guide",
        url: "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html",
        topics: [
          "Standard vs. Express workflows",
          "State types: Task, Choice, Wait, Parallel, Map",
          "Error handling and retries",
          "SDK integrations",
        ],
      },
      {
        title: "Amazon EventBridge – User Guide",
        url: "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html",
        topics: [
          "Event buses (default, custom, partner)",
          "Rules and targets",
          "Event patterns and content filtering",
          "Scheduler",
        ],
      },
      {
        title: "AWS IAM – User Guide",
        url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html",
        topics: [
          "IAM roles for services and cross-account access",
          "Resource-based policies",
          "Permission boundaries",
          "STS and AssumeRole",
        ],
      },
      {
        title: "Amazon CloudWatch – User Guide",
        url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
        topics: [
          "Custom metrics and EMF",
          "Metric filters on log groups",
          "Composite alarms",
          "CloudWatch Synthetics",
        ],
      },
    ],
  },
  {
    certId: "aif-c01",
    sources: [
      {
        title: "AWS Certified AI Practitioner – Exam Guide (AIF-C01)",
        url: "https://d1.awsstatic.com/training-and-certification/docs-ai-practitioner/AWS-Certified-AI-Practitioner_Exam-Guide.pdf",
        topics: [
          "Exam domains and weightings",
          "Scope of AI/ML services tested",
          "Passing score and format",
        ],
      },
      {
        title: "Amazon Bedrock – User Guide",
        url: "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html",
        topics: [
          "Foundation models and model providers",
          "Agents for Bedrock",
          "Knowledge Bases (RAG)",
          "Guardrails and responsible AI",
        ],
      },
      {
        title: "Amazon SageMaker – Developer Guide",
        url: "https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html",
        topics: [
          "Training jobs and hyperparameter tuning",
          "Model deployment and endpoints",
          "SageMaker Studio and Notebooks",
          "Built-in algorithms",
        ],
      },
      {
        title: "Amazon Q – User Guide",
        url: "https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/what-is.html",
        topics: [
          "Amazon Q Business vs. Amazon Q Developer",
          "Connecting data sources",
          "Access controls and relevance filtering",
        ],
      },
      {
        title: "AWS Responsible AI – Overview",
        url: "https://aws.amazon.com/machine-learning/responsible-ai/",
        topics: [
          "Fairness, explainability, privacy, robustness",
          "SageMaker Clarify for bias detection",
          "Model cards",
        ],
      },
      {
        title: "Amazon Rekognition – Developer Guide",
        url: "https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html",
        topics: [
          "Image and video analysis",
          "Face detection and comparison",
          "Content moderation",
          "Custom labels",
        ],
      },
      {
        title: "Amazon Comprehend – Developer Guide",
        url: "https://docs.aws.amazon.com/comprehend/latest/dg/what-is.html",
        topics: [
          "Entity recognition and sentiment analysis",
          "Custom classifiers and entity recognizers",
          "PII detection and redaction",
        ],
      },
      {
        title: "Amazon Transcribe – Developer Guide",
        url: "https://docs.aws.amazon.com/transcribe/latest/dg/what-is.html",
        topics: [
          "Automatic speech recognition (ASR)",
          "Custom vocabularies and language models",
          "Medical transcription",
        ],
      },
      {
        title: "Amazon Polly – Developer Guide",
        url: "https://docs.aws.amazon.com/polly/latest/dg/what-is.html",
        topics: [
          "Text-to-speech synthesis",
          "Standard vs. Neural voices",
          "SSML support",
        ],
      },
      {
        title: "Amazon Lex – Developer Guide",
        url: "https://docs.aws.amazon.com/lexv2/latest/dg/what-is.html",
        topics: [
          "Intents, slots, and utterances",
          "Bot building and deployment",
          "Integration with Lambda for fulfillment",
        ],
      },
      {
        title: "Amazon Kendra – Developer Guide",
        url: "https://docs.aws.amazon.com/kendra/latest/dg/what-is-kendra.html",
        topics: [
          "Intelligent enterprise search",
          "Data source connectors",
          "Relevance tuning",
        ],
      },
      {
        title: "Amazon Personalize – Developer Guide",
        url: "https://docs.aws.amazon.com/personalize/latest/dg/what-is-personalize.html",
        topics: [
          "Recipes and recommendation algorithms",
          "Interaction data and cold-start handling",
          "Real-time and batch recommendations",
        ],
      },
      {
        title: "Amazon Translate – Developer Guide",
        url: "https://docs.aws.amazon.com/translate/latest/dg/what-is.html",
        topics: [
          "Neural machine translation (NMT)",
          "Custom Terminology for brand names",
          "Real-time vs. batch translation",
        ],
      },
      {
        title: "Amazon Textract – Developer Guide",
        url: "https://docs.aws.amazon.com/textract/latest/dg/what-is.html",
        topics: [
          "Form and table extraction",
          "Queries API for targeted field extraction",
          "Async jobs with S3 and SNS",
        ],
      },
      {
        title: "Amazon Forecast – Developer Guide",
        url: "https://docs.aws.amazon.com/forecast/latest/dg/what-is-forecast.html",
        topics: [
          "Time-series forecasting and DeepAR+ algorithm",
          "Related time series and item metadata",
          "AWS Weather Index integration",
        ],
      },
      {
        title: "AWS Panorama – Developer Guide",
        url: "https://docs.aws.amazon.com/panorama/latest/dev/panorama-welcome.html",
        topics: [
          "Edge computer vision on existing camera networks",
          "Panorama appliance and SDK",
          "Deploying models from SageMaker to the edge",
        ],
      },
      {
        title: "AWS Trainium and Inferentia – Overview",
        url: "https://aws.amazon.com/machine-learning/trainium/",
        topics: [
          "Custom ML chips for training (Trainium) and inference (Inferentia)",
          "Cost and performance advantages",
          "Neuron SDK",
        ],
      },
      {
        title: "ML Fundamentals – AWS Machine Learning Blog",
        url: "https://aws.amazon.com/blogs/machine-learning/",
        topics: [
          "Supervised, unsupervised, and reinforcement learning concepts",
          "Model evaluation metrics",
          "Overfitting, underfitting, and regularization",
        ],
      },
    ],
  },
  {
    certId: "mls-c01",
    sources: [
      {
        title:
          "AWS Certified Machine Learning – Specialty Exam Guide (MLS-C01)",
        url: "https://d1.awsstatic.com/training-and-certification/docs-ml/AWS-Certified-Machine-Learning-Specialty_Exam-Guide.pdf",
        topics: [
          "Exam domains and weightings",
          "Scope of ML services tested",
          "Passing score and format",
        ],
      },
      {
        title: "Amazon SageMaker – Developer Guide",
        url: "https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html",
        topics: [
          "Training jobs, built-in algorithms, Script Mode, BYOC",
          "Hyperparameter tuning (Bayesian optimization)",
          "Real-time, Serverless, Async, and Batch Transform inference",
          "Model Monitor, Clarify, Debugger, Feature Store",
          "SageMaker Pipelines and Model Registry",
          "Spot Training and checkpointing",
          "Distributed training (data parallelism, model parallelism)",
        ],
      },
      {
        title: "Amazon S3 – User Guide",
        url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
        topics: [
          "Storage classes (Standard, IA, Glacier, Intelligent-Tiering)",
          "Versioning and lifecycle policies",
          "Server-side encryption (SSE-S3, SSE-KMS, SSE-C)",
          "S3 as the primary ML data lake storage layer",
          "File Mode and Pipe Mode for SageMaker training data",
        ],
      },
      {
        title: "AWS Glue – Developer Guide",
        url: "https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html",
        topics: [
          "Glue Data Catalog: metadata for S3, RDS, and other sources",
          "Glue Crawlers: automatic schema discovery",
          "Glue ETL Jobs: PySpark/Scala transformations",
          "Glue DataBrew: visual no-code data preparation",
          "DynamicFrames vs. Spark DataFrames",
          "Job Bookmarks for incremental ETL",
          "DPUs (Data Processing Units) for scaling",
        ],
      },
      {
        title: "Amazon Kinesis – Developer Guide",
        url: "https://docs.aws.amazon.com/streams/latest/dev/introduction.html",
        topics: [
          "Kinesis Data Streams: shards, partition keys, retention (24h default, up to 365 days)",
          "Kinesis Data Firehose: managed delivery to S3, Redshift, OpenSearch",
          "Kinesis Data Analytics: SQL and Apache Flink on streams",
          "Kinesis Video Streams: video ingestion for ML/CV",
          "On-Demand mode for automatic shard scaling",
        ],
      },
      {
        title: "Amazon EMR – Management Guide",
        url: "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-what-is-emr.html",
        topics: [
          "Apache Spark, Hive, Hadoop, and Presto on managed clusters",
          "EMRFS: S3 as persistent storage replacing HDFS",
          "Master, Core, and Task node roles",
          "Spot Instances for task nodes (cost optimization)",
          "EMR Serverless: no cluster management",
          "EMR on EKS: Spark on Kubernetes",
          "Spark MLlib for distributed ML training",
        ],
      },
      {
        title: "Amazon Rekognition – Developer Guide",
        url: "https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html",
        topics: [
          "Image and video analysis APIs",
          "Face Collections and SearchFacesByImage",
          "DetectModerationLabels for content safety",
          "DetectProtectiveEquipment (PPE detection)",
          "Rekognition Custom Labels",
          "Amazon A2I integration for human review",
        ],
      },
      {
        title: "Amazon Comprehend – Developer Guide",
        url: "https://docs.aws.amazon.com/comprehend/latest/dg/what-is.html",
        topics: [
          "Entity recognition, sentiment analysis, key phrase extraction",
          "DetectSentiment: Positive, Negative, Mixed, Neutral",
          "PII detection and targeted sentiment",
          "Custom Classification and Custom Entity Recognition",
          "Comprehend Medical for clinical text and PHI",
          "Topic modeling with LDA",
        ],
      },
      {
        title: "Amazon Translate – Developer Guide",
        url: "https://docs.aws.amazon.com/translate/latest/dg/what-is.html",
        topics: [
          "Neural machine translation across 75+ languages",
          "Custom Terminology for brand and domain-specific terms",
          "Parallel Data and Active Custom Translation",
          "Batch translation jobs (S3 input/output)",
        ],
      },
      {
        title: "Amazon Polly – Developer Guide",
        url: "https://docs.aws.amazon.com/polly/latest/dg/what-is.html",
        topics: [
          "Standard vs. Neural TTS (NTTS) voices",
          "SSML for pronunciation, rate, pitch, and pause control",
          "Lexicons (PLS format) for custom pronunciation rules",
          "Long-form engine for lengthy content narration",
        ],
      },
      {
        title: "Amazon Transcribe – Developer Guide",
        url: "https://docs.aws.amazon.com/transcribe/latest/dg/what-is.html",
        topics: [
          "Automatic speech recognition (ASR) — real-time and batch",
          "Speaker diarization",
          "Custom vocabulary and Custom Language Models",
          "Transcribe Medical",
          "Call Analytics: sentiment per speaker, interruptions, talk speed",
        ],
      },
      {
        title: "Amazon Forecast – Developer Guide",
        url: "https://docs.aws.amazon.com/forecast/latest/dg/what-is-forecast.html",
        topics: [
          "Time-series forecasting with AutoPredictor",
          "DeepAR+: LSTM-based global model for many related series",
          "Target time series, related time series, item metadata datasets",
          "Quantile forecasts (P10, P50, P90)",
          "Minimum 300 data points per time series",
          "Weighted Quantile Loss (WQL) evaluation metric",
        ],
      },
      {
        title: "Amazon Personalize – Developer Guide",
        url: "https://docs.aws.amazon.com/personalize/latest/dg/what-is-personalize.html",
        topics: [
          "Interactions, Items, and Users datasets",
          "Recipes: USER_PERSONALIZATION, RELATED_ITEMS, PERSONALIZED_RANKING",
          "Campaigns for real-time recommendations",
          "PutEvents API for real-time session personalization",
          "Batch Inference Jobs for offline recommendation generation",
          "Cold-start handling via popularity fallback and metadata",
        ],
      },
      {
        title: "AWS Lake Formation – Developer Guide",
        url: "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html",
        topics: [
          "Centralized access control on the Glue Data Catalog",
          "Column-level security and row-level security (Data Filters)",
          "Tag-based access control (LF-TBAC)",
          "Blueprints for automated data lake ingestion",
          "Cross-account data sharing",
        ],
      },
      {
        title: "Amazon Athena – User Guide",
        url: "https://docs.aws.amazon.com/athena/latest/ug/what-is.html",
        topics: [
          "Serverless SQL on S3 — $5/TB scanned",
          "Parquet and ORC columnar formats for cost reduction",
          "Partition pruning for query performance",
          "Athena Federated Query: Lambda connectors to RDS, DynamoDB, etc.",
          "CTAS (CREATE TABLE AS SELECT) for format conversion",
          "Query Result Reuse: cache up to 7 days",
          "Athena ML: invoke SageMaker endpoints from SQL",
        ],
      },
      {
        title: "Amazon Redshift – Database Developer Guide",
        url: "https://docs.aws.amazon.com/redshift/latest/dg/welcome.html",
        topics: [
          "Columnar MPP data warehouse for OLAP workloads",
          "Redshift Spectrum: query S3 data from Redshift SQL",
          "Redshift ML: CREATE MODEL using SageMaker Autopilot",
          "Distribution styles: EVEN, KEY, ALL",
          "COPY command for bulk data loading from S3",
          "Redshift Serverless: RPU-based auto-scaling",
        ],
      },
      {
        title: "AWS Key Management Service (KMS) – Developer Guide",
        url: "https://docs.aws.amazon.com/kms/latest/developerguide/overview.html",
        topics: [
          "SSE-KMS for S3 encryption at rest",
          "KMS key usage in SageMaker for EBS volumes and model artifacts",
          "Key rotation and CloudTrail audit logging",
        ],
      },
      {
        title: "AWS CloudTrail – User Guide",
        url: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html",
        topics: [
          "API call logging for SageMaker, S3, and all AWS services",
          "Security audit trails for ML workflows",
          "Integration with CloudWatch for alerting on suspicious activity",
        ],
      },
      {
        title: "Amazon VPC – SageMaker Network Isolation",
        url: "https://docs.aws.amazon.com/sagemaker/latest/dg/train-vpc.html",
        topics: [
          "Running SageMaker training jobs inside a VPC",
          "S3 Gateway VPC Endpoint for private S3 access",
          "Interface VPC Endpoints (PrivateLink) for SageMaker APIs",
          "VPC-only mode for SageMaker Studio",
        ],
      },
      {
        title: "Amazon EventBridge – User Guide",
        url: "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html",
        topics: [
          "Triggering SageMaker Pipeline executions on schedule or events",
          "Event-driven MLOps: Model Monitor alarm → retraining pipeline",
          "EventBridge Scheduler for cron-based retraining",
        ],
      },
      {
        title: "AWS Well-Architected – Machine Learning Lens",
        url: "https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/machine-learning-lens.html",
        topics: [
          "ML lifecycle phases: business goal, data, feature engineering, training, evaluation, deployment",
          "Data quality and labeling best practices",
          "Training-serving skew prevention",
          "Cost optimization patterns for ML workloads",
        ],
      },
    ],
  },
  {
    certId: "ccao-f",
    sources: [
      {
        title: "Claude Certified Associate – Foundations Exam Guide (CCAO-F)",
        url: "https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F6nizmqk8tpzpfjvt6qmmav7rh%2Fpublic%2F1783542847%2FClaude+Certified+Associate+%E2%80%93+Foundations+Exam+Guide.pdf",
        topics: [
          "Exam domains and weightings",
          "Scope of Claude concepts tested",
          "Passing score and format",
        ],
      },
      {
        title: "Anthropic API Documentation",
        url: "https://docs.anthropic.com/en/api/getting-started",
        topics: [
          "Messages API request and response structure",
          "Required fields: model, max_tokens, messages",
          "Authentication and API key management",
          "Rate limits and error codes",
        ],
      },
      {
        title: "Anthropic Model Overview",
        url: "https://docs.anthropic.com/en/docs/about-claude/models",
        topics: [
          "Claude model family: Opus, Sonnet, Haiku",
          "Versioned model IDs and deprecation policy",
          "Context window sizes by model",
          "Vision capability by model",
        ],
      },
      {
        title: "Prompt Engineering Guide",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
        topics: [
          "Core prompting principles: clear, specific, complete",
          "System prompt design and XML tag structuring",
          "Few-shot examples and chain-of-thought prompting",
          "Output format control and JSON extraction",
          "Prompt injection risks and mitigations",
        ],
      },
      {
        title: "Tool Use (Function Calling)",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use",
        topics: [
          "Tool definition: name, description, input_schema",
          "Tool use lifecycle: tool_use block → application executes → tool_result",
          "Parallel and sequential tool calls",
          "tool_choice parameter: auto, any, specific tool",
          "stop_reason: tool_use vs. end_turn",
        ],
      },
      {
        title: "Anthropic Usage Policy",
        url: "https://www.anthropic.com/legal/aup",
        topics: [
          "Prohibited use cases (hardcoded refusals)",
          "Operator responsibilities and acceptable use",
          "Content categories and policy enforcement",
        ],
      },
      {
        title: "Safety and Responsible AI – Anthropic",
        url: "https://www.anthropic.com/safety",
        topics: [
          "Constitutional AI (CAI) training approach",
          "Helpful, Harmless, Honest design principles",
          "Hardcoded vs. softcoded behaviors",
          "Trust hierarchy: Anthropic > Operator > User",
          "Honesty constraints: Claude will not claim to be human",
        ],
      },
      {
        title: "Streaming with the Messages API",
        url: "https://docs.anthropic.com/en/api/messages-streaming",
        topics: [
          "Server-sent events (SSE) event types",
          "message_start, content_block_delta, message_delta, message_stop",
          "Streaming vs. non-streaming billing (identical)",
          "Assembling the full response from deltas",
        ],
      },
      {
        title: "Prompt Caching",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching",
        topics: [
          "cache_control block and ephemeral type",
          "Cache TTL: 5 minutes, resets on each cache hit",
          "Cache read price: ~10% of normal input token cost",
          "Cacheable content must precede non-cacheable content",
        ],
      },
      {
        title: "Batch API",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/message-batches",
        topics: [
          "50% cost reduction for offline async workloads",
          "Up to 100,000 requests per batch",
          "Processing within 24 hours",
          "JSONL submission and result download format",
        ],
      },
      {
        title: "Anthropic Console",
        url: "https://console.anthropic.com",
        topics: [
          "API key creation and management",
          "Usage metrics and token consumption by model",
          "Spending limits and billing",
          "Workbench for interactive prompt testing",
        ],
      },
      {
        title: "Evaluating Claude Outputs",
        url: "https://docs.anthropic.com/en/docs/test-and-evaluate/eval-overview",
        topics: [
          "Building evaluation datasets from real user traffic",
          "LLM-as-judge for subjective quality evaluation",
          "Red teaming and adversarial testing",
          "Prompt iteration methodology: one change at a time",
        ],
      },
      {
        title: "Agentic and Multi-Turn Applications",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/agentic-and-multi-turn",
        topics: [
          "Agentic loop: repeat tool calls until stop_reason end_turn",
          "Minimal footprint principle: least permissions, prefer reversible",
          "Human-in-the-loop checkpoints for irreversible actions",
          "Maximum iteration limits to prevent infinite loops",
        ],
      },
    ],
  },
];
