import { ServiceGuide } from "../../../../types/guide";

export const drGuide: ServiceGuide = {
  id: "saa-dr",
  service: "High Availability & Disaster Recovery",
  domain: "deployment",
  tagline:
    "Design for resilience with the right HA and DR strategy for your RTO and RPO",
  intro:
    "SAA-C03 Domain 2 (26%) tests HA and DR architecture. You must know the four DR strategies, when to apply each, and which AWS services enable fault tolerance at the AZ and region level.",

  sections: [
    {
      heading: "HA vs. DR: Understanding the Difference",
      body: `**High Availability (HA)** means minimizing downtime through redundancy and automatic failover — the system keeps running even when components fail. HA is typically achieved within a region using multiple AZs. An ALB distributing traffic across EC2 instances in multiple AZs is an HA design — if one AZ fails, traffic shifts to instances in other AZs automatically.

**Disaster Recovery (DR)** prepares for catastrophic failures where an entire region becomes unavailable. DR involves maintaining infrastructure in a secondary region and a plan for failing over. The key metrics are **RPO** (Recovery Point Objective — how much data loss is acceptable) and **RTO** (Recovery Time Objective — how long the system can be down). DR strategy choice is driven by RPO/RTO requirements balanced against cost — lower RPO/RTO = higher cost.`,
      quiz: [
        {
          question:
            "A company's RPO is 1 hour and RTO is 4 hours. Which statement correctly interprets these requirements?",
          options: [
            "The company can lose up to 1 hour of data and can be down for up to 4 hours",
            "The company must recover within 1 hour and can lose up to 4 hours of data",
            "The company must recover in 1 hour with no data loss",
            "The company can be down for 1 hour only if data is recovered within 4 hours",
          ],
          correctIndex: 0,
          explanation:
            "RPO = maximum acceptable data loss (measured in time before failure). RTO = maximum acceptable downtime. RPO of 1 hour means the last backup/snapshot can be up to 1 hour old. RTO of 4 hours means the system must be restored and operational within 4 hours of the failure.",
        },
      ],
    },
    {
      heading: "DR Strategies: Backup & Restore and Pilot Light",
      body: `**Backup & Restore** is the lowest-cost DR strategy. Data is backed up (S3 snapshots, RDS automated backups) and restored to a new environment in the DR region only when a disaster occurs. This has the highest RPO and RTO (hours to days) because infrastructure must be provisioned from scratch during recovery. Suitable for non-critical workloads where extended downtime is acceptable.

**Pilot Light** keeps a minimal version of the critical core infrastructure running in the DR region at all times — typically just the database replicated to the DR region. Compute resources are not running but AMIs and templates are ready. When a disaster occurs, you scale up the pilot light by launching EC2 instances from the pre-built AMIs and pointing them at the replicated database. RTO is reduced to minutes/hours because only compute needs to be launched. RPO depends on database replication lag.`,
      quiz: [
        {
          question:
            "A company uses an RDS database replicated cross-region and pre-built AMIs stored in a DR region. No compute runs in the DR region normally. What DR strategy is this?",
          options: [
            "Pilot Light",
            "Backup and Restore",
            "Warm Standby",
            "Active-Active (Multi-Site)",
          ],
          correctIndex: 0,
          explanation:
            "Pilot Light keeps the core data layer (database replication) running in the DR region while compute is kept off. During failover, you launch EC2 instances from pre-built AMIs and point them at the replicated DB. Backup & Restore has no running infrastructure. Warm Standby runs a scaled-down full environment. Active-Active runs full capacity in both regions.",
        },
      ],
    },
    {
      heading: "DR Strategies: Warm Standby and Active-Active",
      body: `**Warm Standby** runs a scaled-down but fully functional version of the production environment in the DR region. All components are running (web servers, app servers, database replicas) but at reduced capacity. During failover, you scale up the warm standby to full capacity and redirect DNS. RTO is minutes. This is more expensive than pilot light but provides faster recovery.

**Active-Active (Multi-Site)** runs the full production workload in two or more regions simultaneously. Route 53 routes traffic to both regions (latency-based or weighted routing). RPO and RTO approach zero because there is no failover — traffic simply shifts away from the affected region. This is the most expensive DR strategy and requires the application to handle multi-region state consistency. Cost is approximately 2× single-region deployment.`,
      quiz: [
        {
          question:
            "A financial trading platform requires near-zero RPO and near-zero RTO. Cost is not the primary concern. Which DR strategy should be implemented?",
          options: [
            "Active-Active (Multi-Site) across two regions",
            "Warm Standby in a secondary region",
            "Pilot Light with database replication",
            "Backup and Restore with hourly S3 snapshots",
          ],
          correctIndex: 0,
          explanation:
            "Active-Active is the only strategy with near-zero RPO and RTO because traffic runs in both regions simultaneously — there is no failover delay. When one region has issues, Route 53 health checks redirect all traffic to the healthy region in seconds. All other strategies have meaningful RTO (minutes to hours) because they require failover steps.",
        },
      ],
    },
    {
      heading: "Multi-AZ Resilience Patterns",
      body: `Within a region, Multi-AZ design is the foundation of HA. **ALB + ASG across multiple AZs** ensures that if one AZ fails, the load balancer stops sending traffic to instances in that AZ and the ASG maintains the desired capacity in remaining AZs. **RDS Multi-AZ** provides synchronous replication to a standby in another AZ — automatic failover in 1-2 minutes. **ElastiCache Redis with Multi-AZ** provides replication groups with automatic failover.

For stateful applications, use **sticky sessions sparingly** — they create AZ affinity that reduces HA during AZ failure. Prefer stateless application design where session state is stored in DynamoDB, ElastiCache, or S3 rather than in-memory on the EC2 instance. **EFS and S3** are inherently Multi-AZ by design — they replicate data across AZs automatically. DynamoDB is also Multi-AZ by default.`,
      quiz: [
        {
          question:
            "An application stores session state in memory on EC2 instances behind an ALB with sticky sessions. One AZ fails. What happens to users whose sessions were on instances in the failed AZ?",
          options: [
            "Their sessions are lost — they must log in again",
            "ALB automatically migrates sessions to instances in healthy AZs",
            "The ASG replaces instances in the failed AZ within 30 seconds",
            "Sticky sessions prevent this scenario by keeping users on healthy instances",
          ],
          correctIndex: 0,
          explanation:
            "In-memory session state is lost when instances terminate. Sticky sessions route users back to the same instance, but when that AZ fails, those instances are gone and so is the session data. The correct architecture is to store sessions externally (DynamoDB, ElastiCache) so any instance can serve any user after re-login or session restoration.",
        },
      ],
    },
    {
      heading: "AWS Services for DR and HA",
      body: `Several AWS services are specifically designed for resilience. **AWS Elastic Disaster Recovery (DRS)** replicates on-premises or AWS workloads to AWS continuously — enabling failover to AWS within minutes with minimal data loss (sub-second RPO). **Aurora Global Database** provides cross-region replication with sub-second lag — the secondary region can be promoted to primary in under 1 minute.

**Route 53 health checks with failover routing** automatically remove unhealthy endpoints from DNS responses, directing traffic to the healthy region. **AWS Backup** provides centralized, policy-driven backup across EC2, RDS, EFS, DynamoDB, and FSx — enabling consistent backup strategies across all workloads. For RTO optimization, use **CloudFormation StackSets** to pre-deploy infrastructure templates in the DR region — instantiation takes minutes rather than hours of manual setup.`,
      quiz: [
        {
          question:
            "A company needs to migrate on-premises servers to AWS for disaster recovery with sub-second RPO. Which service provides continuous replication for this purpose?",
          options: [
            "AWS Elastic Disaster Recovery (DRS)",
            "AWS DataSync",
            "AWS Storage Gateway Volume Gateway",
            "AWS Database Migration Service",
          ],
          correctIndex: 0,
          explanation:
            "AWS DRS (formerly CloudEndure Disaster Recovery) provides continuous block-level replication of on-premises servers to AWS, enabling sub-second RPO and minute-level RTO. DataSync is for file data migration, not server replication. DMS is for database migration. Storage Gateway Stored Volumes provides backup, not continuous server replication.",
        },
      ],
    },
  ],

  keyFacts: [
    "RPO: how much data loss is acceptable (time since last backup). RTO: how long downtime is acceptable",
    "Backup & Restore: lowest cost, highest RPO/RTO (hours to days)",
    "Pilot Light: minimal core running in DR (usually just DB replication), scale up on disaster",
    "Warm Standby: scaled-down full environment running in DR, scale up on disaster",
    "Active-Active: full capacity in multiple regions, near-zero RPO/RTO, highest cost",
    "Multi-AZ within a region is HA; cross-region is DR",
    "Stateless app design: store sessions in DynamoDB/ElastiCache for true Multi-AZ HA",
    "Aurora Global Database: cross-region replication, sub-second lag, < 1 minute failover",
    "Route 53 failover routing: health check → automatic DNS failover to secondary region",
    "AWS DRS: continuous block-level replication, sub-second RPO for on-premises → AWS DR",
    "DR strategy RTO approximations: Backup/Restore = hours to days; Pilot Light = minutes to hours; Warm Standby = minutes; Active/Active = near-zero",
  ],

  relatedServices: [
    "Amazon Route 53",
    "Amazon RDS (Multi-AZ)",
    "Amazon Aurora Global Database",
    "AWS Backup",
    "Elastic Load Balancing",
    "Amazon S3 (CRR)",
    "AWS CloudFormation",
  ],

  examTips: [
    "DR strategy selection is always RPO/RTO vs. cost — lower RPO/RTO requires more always-on infrastructure",
    "Pilot Light ≠ Warm Standby: Pilot Light is data only (no compute running); Warm Standby has scaled-down compute",
    "Active-Active is the only strategy where RPO and RTO approach zero",
    "For on-premises to AWS DR with sub-second RPO: AWS Elastic Disaster Recovery (DRS)",
    "Aurora Global Database for cross-region with < 1 minute RTO — better than standard RDS cross-region replicas",
    "Stateless design is a prerequisite for true Multi-AZ HA — always offload session state to external storage",
    "Route 53 health check TTL affects DNS failover speed — lower TTL means faster failover but more DNS queries",
    "ASGs do not immediately replace instances in a failed AZ — health checks take time (configure short intervals for faster recovery)",
    "EFS and S3 are natively Multi-AZ — no cross-AZ replication setup needed",
    "For near-zero RTO within a region: Multi-AZ RDS + Multi-AZ ASG + ALB health checks",
    "S3, DynamoDB, SQS, and Lambda are inherently multi-AZ — no additional HA configuration required for these managed services",
    "CloudFront origin failover: configure a secondary origin in another region — if the primary returns 5xx errors, CloudFront automatically retries the secondary",
  ],
};
