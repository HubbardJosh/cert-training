import { ServiceGuide } from "../../../../types/guide";

export const costGuide: ServiceGuide = {
  id: "saa-cost",
  service: "Cost Optimization",
  domain: "deployment",
  tagline: "Design cost-efficient architectures — Domain 4 (20% of the exam)",
  intro:
    "Cost optimization is one of five pillars of the AWS Well-Architected Framework and 20% of the SAA-C03 exam. You must know EC2 pricing models, storage cost levers, right-sizing, and cost management tools.",

  sections: [
    {
      heading: "EC2 Cost Optimization",
      body: `EC2 pricing options from most to least expensive per hour: On-Demand > Dedicated Host > Reserved Instance > Savings Plan > Spot. **On-Demand** is the baseline — pay by the second, no commitment. **Reserved Instances (RI)** save up to 72% with a 1- or 3-year commitment. Standard RIs lock in instance family, OS, and region. **Convertible RIs** save less (~54%) but allow changing instance type, OS, and region — useful when future requirements are uncertain.

**Savings Plans** work like RIs but are more flexible. **Compute Savings Plans** apply to any EC2, Fargate, and Lambda usage regardless of family, region, or OS — up to 66% savings. **EC2 Instance Savings Plans** are tied to a specific family and region but offer up to 72% savings. **Spot Instances** save up to 90% for interruptible workloads. **AWS Compute Optimizer** analyzes CloudWatch metrics and recommends right-sized instance types for EC2, Lambda, and ECS — often finding over-provisioned resources.`,
      quiz: [
        {
          question:
            "A company has committed to running a web tier on EC2 for 3 years but is unsure which instance types will be needed as the application evolves. Which purchase option provides the most flexibility at significant savings?",
          options: [
            "Compute Savings Plan",
            "Standard Reserved Instance",
            "Convertible Reserved Instance",
            "On-Demand with auto scaling",
          ],
          correctIndex: 0,
          explanation:
            "Compute Savings Plans apply to any EC2 instance family, region, and OS — maximum flexibility. Standard RIs lock in family and region. Convertible RIs allow changes but only within EC2. Compute Savings Plans also cover Fargate and Lambda, offering the broadest coverage if the company ever shifts to containers or serverless.",
        },
      ],
    },
    {
      heading: "S3 Cost Optimization",
      body: `S3 storage costs vary dramatically by storage class. The cheapest long-term storage is Glacier Deep Archive (~$0.00099/GB/month). Standard is most expensive but has no retrieval fee. Standard-IA, One Zone-IA, and Glacier classes charge per-GB retrieval fees — factor these into TCO for frequently accessed data. **S3 Intelligent-Tiering** automatically moves data and adds a per-object monitoring fee ($0.0025 per 1,000 objects) — cost-effective when access patterns are unknown.

**S3 Lifecycle Policies** are the primary cost lever — define rules to transition objects to cheaper classes after set time periods and expire (delete) objects that are no longer needed. Always configure lifecycle rules for data with known retention requirements. **S3 Storage Lens** provides account-wide and org-wide storage analytics — identifying unused buckets, large objects, non-current versions accumulating cost, and buckets without lifecycle policies.`,
      quiz: [
        {
          question:
            "A company stores log files that are analyzed frequently in the first 30 days and then rarely accessed. After 1 year, logs must be deleted. Which lifecycle policy minimizes cost?",
          options: [
            "Keep in Standard for 30 days, transition to Standard-IA after 30 days, delete after 365 days",
            "Keep in Standard for 365 days then delete",
            "Store in Glacier Deep Archive from day 1 then delete after 365 days",
            "Use Intelligent-Tiering for the full retention period",
          ],
          correctIndex: 0,
          explanation:
            "Transitioning to Standard-IA after 30 days saves ~60% on storage cost while keeping retrieval latency acceptable for infrequent access. Keeping in Standard for the full year pays the premium rate unnecessarily. Glacier Deep Archive from day 1 has high retrieval fees for the first 30 days of frequent access. Intelligent-Tiering adds per-object monitoring fees.",
        },
      ],
    },
    {
      heading: "Database Cost Optimization",
      body: `For RDS, right-sizing the instance class is the biggest lever — use CloudWatch metrics to identify underutilized databases and downsize. **Aurora Serverless v2** eliminates over-provisioning for variable workloads — you pay for actual capacity used. For read-heavy workloads, **read replicas** are cheaper than scaling up the primary instance. **DynamoDB On-Demand** is cost-effective for unpredictable traffic; Provisioned with Auto Scaling is cheaper at steady loads.

**Reserved DB instances** (RDS, ElastiCache, OpenSearch) offer similar savings to EC2 RIs — 1- or 3-year terms save up to 69%. For analytics, **Amazon Athena** queries S3 data directly at $5/TB scanned — much cheaper than maintaining a Redshift cluster for occasional queries. Use **S3 Select** or **Glacier Select** to reduce the data scanned by Athena by filtering at the object level.`,
      quiz: [
        {
          question:
            "A company runs monthly analytical queries against 10 TB of log data in S3. Which solution minimizes cost for this infrequent use case?",
          options: [
            "Amazon Athena — pay per TB scanned, no infrastructure needed",
            "Amazon Redshift cluster running 24/7",
            "EMR cluster launched monthly for the queries",
            "RDS with the data imported from S3 monthly",
          ],
          correctIndex: 0,
          explanation:
            "Athena charges ~$5/TB scanned with no infrastructure to manage — perfect for monthly analytical queries. A Redshift cluster running 24/7 costs hundreds per month regardless of query frequency. EMR has startup overhead and cluster management. RDS is OLTP, not analytical, and importing 10 TB monthly is impractical.",
        },
      ],
    },
    {
      heading: "Cost Management Tools",
      body: `**AWS Cost Explorer** provides visualization of AWS spending over time, forecasting, and RI/Savings Plan utilization reports. Use it to identify spending trends, find top cost drivers, and evaluate Reserved Instance coverage. **AWS Budgets** sends alerts when actual or forecasted costs exceed thresholds — critical for proactive cost control. Budget alerts can trigger SNS notifications or even Lambda-based remediation actions.

**AWS Cost and Usage Report (CUR)** is the most detailed billing data AWS provides — hourly resource-level usage in CSV format delivered to S3. CUR integrates with Athena for SQL-based cost analysis. **AWS Trusted Advisor** checks for cost optimization opportunities: idle EC2 instances, underutilized RDS, low-utilization EBS volumes, unassociated Elastic IPs, and RI purchase recommendations. Trusted Advisor's full cost checks require Business or Enterprise support plan.`,
      quiz: [
        {
          question:
            "A company wants to receive an alert when their projected monthly AWS bill will exceed $10,000. Which tool should be configured?",
          options: [
            "AWS Budgets with a forecasted cost alert",
            "AWS Cost Explorer with a billing alarm",
            "CloudWatch billing alarm",
            "AWS Trusted Advisor cost check",
          ],
          correctIndex: 0,
          explanation:
            "AWS Budgets supports both actual and forecasted cost alerts — you can alert when AWS's forecast predicts you'll exceed $10,000 this month, before you actually reach it. CloudWatch billing alarms only trigger on actual (not forecasted) spend. Cost Explorer provides visualization but not alerting. Trusted Advisor identifies waste but doesn't alert on projected cost.",
        },
      ],
    },
    {
      heading: "Architectural Cost Levers",
      body: `**Right-sizing** is choosing the smallest resource that meets performance requirements. Tools: Compute Optimizer for EC2/Lambda, RDS recommendations for databases. **Serverless** architectures eliminate idle resource costs — Lambda charges only for execution time; DynamoDB On-Demand charges only for requests. **Managed services** (RDS vs. EC2 with database, EKS vs. self-managed Kubernetes) reduce operational overhead but may cost more per resource.

**Data transfer** costs are a significant and often overlooked cost driver. Data transfer **out** to the internet is charged; data transfer **in** is free. Data transfer between AZs within a region is charged (~$0.01/GB each direction). Use **VPC endpoints** to eliminate data transfer costs for S3 and DynamoDB traffic from within VPCs. Use **CloudFront** to cache content at edge locations, reducing origin data transfer costs. Placing resources in the same AZ eliminates AZ data transfer costs but reduces HA.`,
      quiz: [
        {
          question:
            "An application in a private VPC subnet makes frequent calls to S3 that are routed through a NAT Gateway, incurring high data transfer costs. What is the MOST cost-effective fix?",
          options: [
            "Create a Gateway VPC Endpoint for S3 — eliminates NAT Gateway data transfer charges",
            "Move the EC2 instances to a public subnet with direct internet access",
            "Create an S3 bucket in the same AZ as the EC2 instances",
            "Switch to EFS instead of S3 to avoid data transfer charges",
          ],
          correctIndex: 0,
          explanation:
            "Gateway VPC Endpoints for S3 route traffic through the AWS backbone at no charge, bypassing the NAT Gateway entirely. NAT Gateway charges $0.045/GB for data processing. The Gateway Endpoint has no per-GB charge and no hourly fee. Public subnet adds security risk. S3 is regional, not AZ-specific.",
        },
      ],
    },
  ],

  keyFacts: [
    "Spot Instances: up to 90% savings, interruptible with 2-min notice",
    "Standard RI: up to 72% savings, locked instance family/region",
    "Compute Savings Plans: up to 66%, apply across EC2/Fargate/Lambda, most flexible",
    "S3 Glacier Deep Archive: lowest storage cost, 12-48 hour retrieval",
    "Lifecycle policies: primary S3 cost lever — transition and expire objects automatically",
    "Athena: $5/TB scanned — cost-effective for infrequent analytical queries on S3",
    "AWS Budgets: alert on actual OR forecasted cost exceeding threshold",
    "Trusted Advisor cost checks: require Business or Enterprise support plan for full access",
    "NAT Gateway data processing: $0.045/GB — replace with VPC Gateway Endpoint for S3/DynamoDB",
    "Data transfer out to internet: charged. Data transfer in: free. AZ-to-AZ: ~$0.01/GB",
    "CUR: most detailed billing data, hourly resource-level, delivered to S3",
  ],

  relatedServices: [
    "AWS Compute Optimizer",
    "AWS Cost Explorer",
    "AWS Budgets",
    "AWS Trusted Advisor",
    "Amazon S3 Intelligent-Tiering",
    "AWS Savings Plans",
    "Amazon Athena",
  ],

  examTips: [
    "For long-running predictable EC2: RIs or Savings Plans. For spiky/interruptible: Spot",
    "Compute Savings Plans > EC2 Instance Savings Plans in flexibility (covers Fargate and Lambda too)",
    "For ad-hoc analytics on S3 data: Athena beats Redshift for infrequent use cases",
    "Gateway VPC Endpoints (S3, DynamoDB) eliminate NAT Gateway data processing costs",
    "AWS Budgets for proactive cost control (forecasted alerts). Cost Explorer for historical analysis",
    "CloudFront reduces origin data transfer costs — cache aggressively for static content",
    "Reserved DB instances for stable production databases — same savings logic as EC2 RIs",
    "Trusted Advisor identifies idle/underutilized resources — run before RI purchases to right-size first",
    "S3 Intelligent-Tiering adds monitoring cost per object — not cost-effective for very small objects (< 128 KB)",
    "Use S3 Select to filter data before Athena queries it — reduces TB scanned and Athena cost",
  ],
};
