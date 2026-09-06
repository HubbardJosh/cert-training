export const SAA_ABBREVIATIONS: Record<string, string> = {
  // AWS Certifications
  SAA: "Solutions Architect – Associate — AWS certification validating ability to design secure, resilient, high-performing, and cost-optimized architectures",
  CLF: "Cloud Practitioner — AWS foundational certification covering cloud concepts and core services",
  SAP: "Solutions Architect – Professional — advanced AWS certification for complex architectural designs",

  // Compute
  EC2: "Elastic Compute Cloud — virtual server instances in the AWS cloud",
  AMI: "Amazon Machine Image — template for launching EC2 instances (OS, config, software)",
  ASG: "Auto Scaling Group — automatically adjusts EC2 fleet size based on demand",
  EBS: "Elastic Block Store — persistent block storage volumes attached to EC2 instances",
  IOPS: "Input/Output Operations Per Second — measure of storage performance",
  EFA: "Elastic Fabric Adapter — high-performance network interface for HPC workloads",
  HPC: "High Performance Computing — tightly coupled compute workloads requiring fast networking",
  EMR: "Elastic MapReduce — managed big data platform using Hadoop, Spark, and Hive",

  // Load Balancing & Networking
  ELB: "Elastic Load Balancing — distributes incoming traffic across multiple targets",
  ALB: "Application Load Balancer — Layer 7 load balancer for HTTP/HTTPS and WebSocket traffic",
  NLB: "Network Load Balancer — Layer 4 TCP/UDP load balancer with ultra-low latency",
  GLB: "Gateway Load Balancer — Layer 3 load balancer for inline network appliances",
  VPC: "Virtual Private Cloud — isolated logical network within AWS",
  NACL: "Network Access Control List — stateless subnet-level firewall in a VPC",
  NAT: "Network Address Translation — allows private subnet instances to reach the internet",
  IGW: "Internet Gateway — VPC component enabling internet access for public subnets",
  VGW: "Virtual Private Gateway — VPC endpoint for VPN and Direct Connect connections",
  TGW: "Transit Gateway — hub that connects VPCs and on-premises networks",
  ENI: "Elastic Network Interface — virtual network card attachable to EC2 instances",
  CIDR: "Classless Inter-Domain Routing — IP address range notation (e.g., 10.0.0.0/16)",
  BGP: "Border Gateway Protocol — routing protocol used by Direct Connect and VPNs",
  DNS: "Domain Name System — translates domain names to IP addresses",
  TTL: "Time To Live — DNS record cache duration or DynamoDB item expiry time",

  // Storage
  S3: "Simple Storage Service — object storage with 11 nines of durability",
  EFS: "Elastic File System — scalable NFS shared file storage for multiple EC2 instances",
  FSx: "Amazon FSx — managed file systems: Windows File Server, Lustre, NetApp ONTAP, OpenZFS",
  RCU: "Read Capacity Unit — DynamoDB throughput unit; 1 strongly consistent 4KB read per second",
  WCU: "Write Capacity Unit — DynamoDB throughput unit; 1 write of up to 1KB per second",

  // Databases
  RDS: "Relational Database Service — managed SQL databases (MySQL, PostgreSQL, Oracle, SQL Server)",
  Aurora:
    "Amazon Aurora — AWS-built MySQL/PostgreSQL-compatible relational database with up to 5× MySQL performance",
  DynamoDB:
    "Amazon DynamoDB — fully managed serverless NoSQL key-value and document database",
  DAX: "DynamoDB Accelerator — in-memory cache for DynamoDB delivering microsecond read latency",
  GSI: "Global Secondary Index — DynamoDB index with a different partition/sort key than the base table",
  LSI: "Local Secondary Index — DynamoDB index sharing the table partition key but with a different sort key",
  ElastiCache:
    "ElastiCache — managed Redis or Memcached in-memory caching layer",
  RPO: "Recovery Point Objective — maximum acceptable data loss measured in time",
  RTO: "Recovery Time Objective — maximum acceptable downtime after a failure",
  PITR: "Point-in-Time Recovery — restores a database to any second within a retention window",
  MSSQL: "Microsoft SQL Server — relational database engine supported by RDS",

  // Serverless & Messaging
  Lambda:
    "AWS Lambda — serverless compute that runs code in response to events with no server management",
  SQS: "Simple Queue Service — managed message queue for decoupling distributed components",
  SNS: "Simple Notification Service — pub/sub messaging and mobile push notification service",
  EventBridge:
    "Amazon EventBridge — serverless event bus for routing events between AWS services and SaaS apps",
  MQ: "Amazon MQ — managed message broker service for ActiveMQ and RabbitMQ",
  MSK: "Managed Streaming for Apache Kafka — fully managed Kafka service",
  SFN: "AWS Step Functions — serverless workflow orchestration using state machines",
  FIFO: "First In, First Out — SQS/SNS queue type guaranteeing order and exactly-once processing",
  DLQ: "Dead Letter Queue — SQS queue for messages that fail processing after max retries",

  // Security & Identity
  IAM: "Identity and Access Management — controls who can access which AWS resources and how",
  SCP: "Service Control Policy — AWS Organizations policy that sets permission guardrails for accounts",
  MFA: "Multi-Factor Authentication — requires a second form of verification in addition to a password",
  KMS: "Key Management Service — managed service for creating and controlling encryption keys",
  SSE: "Server-Side Encryption — encrypting data at rest on the server before writing to storage",
  ACM: "AWS Certificate Manager — provisions and manages TLS/SSL certificates",
  WAF: "Web Application Firewall — filters HTTP/HTTPS traffic based on rules to block attacks",
  STS: "Security Token Service — generates temporary, limited-privilege credentials",
  HSM: "Hardware Security Module — dedicated hardware for key generation and cryptographic operations",
  PII: "Personally Identifiable Information — data that can be used to identify an individual",
  GuardDuty:
    "Amazon GuardDuty — threat detection service analyzing CloudTrail, VPC Flow Logs, and DNS logs",
  Macie:
    "Amazon Macie — uses ML to discover and protect sensitive data (PII) in S3",
  Cognito:
    "Amazon Cognito — user authentication and authorization for web and mobile apps",

  // Content Delivery & Edge
  CDN: "Content Delivery Network — geographically distributed servers that cache and serve content closer to users",
  CloudFront:
    "Amazon CloudFront — AWS CDN with global edge locations and integration with S3, ALB, and custom origins",
  PoP: "Point of Presence — CloudFront edge location or regional edge cache",

  // Monitoring & Management
  CloudWatch:
    "Amazon CloudWatch — monitoring, logging, and alerting for AWS resources and applications",
  CloudTrail:
    "AWS CloudTrail — records all API calls made in an AWS account for auditing",
  Config:
    "AWS Config — tracks configuration changes and evaluates against compliance rules",
  SSM: "AWS Systems Manager — operational management including Patch Manager, Parameter Store, and Session Manager",
  CFN: "CloudFormation — infrastructure-as-code service for provisioning AWS resources via templates",
  CDK: "Cloud Development Kit — framework for defining AWS infrastructure using familiar programming languages",
  Organizations:
    "AWS Organizations — centrally manages multiple AWS accounts with consolidated billing and SCPs",
  ControlTower:
    "AWS Control Tower — sets up and governs a multi-account AWS environment with best practices",
  TrustedAdvisor:
    "AWS Trusted Advisor — inspects your environment and recommends cost, performance, security, and fault-tolerance improvements",

  // Migration & Transfer
  DMS: "Database Migration Service — migrates databases to AWS with minimal downtime",
  DataSync:
    "AWS DataSync — automated online data transfer between on-premises storage and AWS",
  StorageGateway:
    "AWS Storage Gateway — hybrid cloud storage connecting on-premises environments to AWS",
  Snowball:
    "AWS Snowball — physical device for transferring large data sets (up to 80TB) into AWS",
  SnowEdge:
    "AWS Snowball Edge — Snowball with compute capability for edge processing",
  Snowmobile:
    "AWS Snowmobile — 100 PB capacity shipping container for exabyte-scale data migration",

  // Analytics & Data
  Kinesis:
    "Amazon Kinesis — real-time streaming data ingestion, processing, and analytics",
  KDS: "Kinesis Data Streams — real-time data streaming service with custom consumers",
  KDF: "Kinesis Data Firehose — fully managed service that loads streaming data into AWS destinations",
  Glue: "AWS Glue — serverless ETL service for data cataloging and transformation",
  Athena:
    "Amazon Athena — serverless interactive query service for S3 data using SQL",
  Redshift:
    "Amazon Redshift — petabyte-scale cloud data warehouse for analytics",
  LakeFormation:
    "AWS Lake Formation — service that helps set up, secure, and manage data lakes",
  OpenSearch:
    "Amazon OpenSearch Service — managed Elasticsearch/OpenSearch for log analytics and search",
  ETL: "Extract, Transform, Load — process for moving and reshaping data between systems",
  OLAP: "Online Analytical Processing — database queries analyzing large volumes of historical data",
  OLTP: "Online Transaction Processing — database queries handling frequent read/write transactions",

  // Cost & Billing
  CUR: "Cost and Usage Report — detailed billing data for AWS services",
  RI: "Reserved Instance — commitment-based EC2 purchase offering up to 72% savings vs On-Demand",
  SP: "Savings Plan — flexible commitment-based pricing for compute usage",

  // Networking (Advanced)
  PrivateLink:
    "AWS PrivateLink — exposes services over private VPC endpoints without internet exposure",
  DirectConnect:
    "AWS Direct Connect — dedicated private network connection from on-premises to AWS",
  GlobalAccelerator:
    "AWS Global Accelerator — routes traffic via AWS backbone to improve global app performance",
  Route53:
    "Amazon Route 53 — scalable DNS and domain registration service with health checking",
  Outposts:
    "AWS Outposts — AWS infrastructure delivered on-premises for hybrid workloads",

  // Container Services
  ECS: "Elastic Container Service — managed Docker container orchestration on AWS",
  EKS: "Elastic Kubernetes Service — managed Kubernetes service on AWS",
  ECR: "Elastic Container Registry — Docker image storage and management",
  Fargate:
    "AWS Fargate — serverless compute engine for containers (no EC2 management)",

  // Well-Architected
  AZ: "Availability Zone — isolated data center location within an AWS Region",
  HA: "High Availability — system design ensuring minimal downtime through redundancy",
  DR: "Disaster Recovery — strategies and processes to recover from catastrophic failures",
  IaC: "Infrastructure as Code — managing and provisioning infrastructure through machine-readable files",
};
