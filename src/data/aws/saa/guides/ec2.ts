import { ServiceGuide } from "../../../../types/guide";

export const ec2Guide: ServiceGuide = {
  id: "saa-ec2",
  service: "Amazon EC2",
  domain: "fundamentals",
  tagline: "Resizable virtual servers — the backbone of AWS compute",
  intro:
    "EC2 provides on-demand virtual machines with full OS control. You choose the instance type, AMI, storage, networking, and pricing model. EC2 is foundational to nearly every SAA-C03 architecture scenario.",

  sections: [
    {
      heading: "Instance Types and Families",
      body: `EC2 instance types follow a naming pattern: family + generation + size (e.g., m6i.xlarge). The **family** indicates the workload purpose: M (general purpose), C (compute optimized), R/X (memory optimized), I/D (storage optimized), P/G/Inf (accelerated computing). The **generation** number indicates the hardware iteration — higher is newer and more efficient. The **size** (nano, micro, small, medium, large, xlarge, 2xlarge, etc.) controls vCPUs, memory, and network bandwidth.

For the exam: **C-family** for CPU-intensive workloads (encoding, ML inference, gaming). **R-family** for in-memory databases, caching layers, real-time big data. **I-family** for high IOPS NVMe SSDs (databases needing sequential read/write throughput). **G/P-family** for ML training and GPU workloads. General purpose M-family is the default starting point when no specific bottleneck is identified.`,
      quiz: [
        {
          question:
            "A company is deploying an in-memory database that requires 512 GB of RAM. Which EC2 instance family should they choose?",
          options: [
            "R-family (memory optimized)",
            "C-family (compute optimized)",
            "M-family (general purpose)",
            "I-family (storage optimized)",
          ],
          correctIndex: 0,
          explanation:
            "R-family instances are memory-optimized, designed for in-memory databases (like Redis on EC2, SAP HANA), real-time analytics, and other RAM-heavy workloads. C-family is for CPU-intensive tasks; I-family for high-throughput local NVMe storage.",
        },
      ],
    },
    {
      heading: "AMI: Amazon Machine Images",
      body: `An AMI is a template for launching EC2 instances that includes the OS, initial configuration, and optionally pre-installed software. AMIs are region-specific — to use an AMI in another region you must copy it. You can create a custom AMI from a running instance (capturing its current state) to use as a golden image for consistent deployments.

AMIs can be backed by EBS (most common — instance stops, EBS snapshot is taken, instance can be started from snapshot) or instance store (faster launch, ephemeral, cannot be stopped). Shared AMIs: public AMIs from the community, private AMIs within your account, or shared with specific accounts. AWS Marketplace offers commercial AMIs from third-party vendors with software pre-installed.`,
      quiz: [
        {
          question:
            "A team needs to launch EC2 instances in a new region with the same software configuration as instances currently running in us-east-1. What is the FASTEST way to accomplish this?",
          options: [
            "Copy the existing AMI to the new region and launch from it",
            "Create a new AMI from scratch using the same user data script",
            "Use AWS Systems Manager to replicate the instance configuration",
            "Export the instance to S3 and import it in the new region",
          ],
          correctIndex: 0,
          explanation:
            "AMIs are region-specific, but AWS provides a built-in Copy AMI feature to copy an AMI (and its underlying EBS snapshot) to any region. Launching from the copied AMI is the fastest and most reliable way to replicate an exact configuration.",
        },
      ],
    },
    {
      heading: "EC2 Purchasing Options",
      body: `**On-Demand** instances have no upfront cost or commitment — you pay by the second (Linux) or hour. Use for unpredictable workloads and dev/test environments. **Reserved Instances (RI)** offer up to 72% savings over On-Demand in exchange for a 1- or 3-year commitment. Standard RIs lock in instance family, OS, and region; Convertible RIs allow changing attributes. **Savings Plans** offer similar discounts with more flexibility — Compute Savings Plans apply across any instance family, region, and OS.

**Spot Instances** offer up to 90% savings over On-Demand but can be interrupted with 2 minutes' notice when AWS needs the capacity back. Use Spot for fault-tolerant, flexible workloads: batch processing, big data, rendering, stateless web services. **Dedicated Hosts** provide a physical server dedicated to your use — required for per-socket/per-core licensing (Windows Server, SQL Server, Oracle) and compliance requirements. **Dedicated Instances** run on hardware dedicated to your account but may share the physical server across your instances.`,
      quiz: [
        {
          question:
            "A company runs a batch image processing job every night. The job takes 4 hours and can be restarted if interrupted. Which EC2 purchasing option minimizes cost?",
          options: [
            "Spot Instances",
            "On-Demand Instances",
            "Reserved Instances",
            "Dedicated Hosts",
          ],
          correctIndex: 0,
          explanation:
            "Spot Instances offer up to 90% savings and are ideal for fault-tolerant, restartable batch workloads. The nightly job can checkpoint progress and restart from the last checkpoint if the Spot instance is interrupted. On-Demand and Reserved cost more; Dedicated Hosts are for licensing compliance, not cost optimization.",
        },
      ],
    },
    {
      heading: "EC2 Storage: EBS, Instance Store, and EFS",
      body: `**EBS** is network-attached block storage that persists beyond the instance lifecycle and can be detached and re-attached. EBS volume types: gp3 (general purpose SSD, baseline 3000 IOPS, up to 16,000 IOPS), io2 Block Express (high-performance SSD, up to 256,000 IOPS — for databases), st1 (throughput HDD, up to 500 MB/s — for sequential reads like logs or Kafka), sc1 (cold HDD, lowest cost — archival data).

**Instance Store** (ephemeral storage) is physically attached NVMe storage that provides very high IOPS but loses all data if the instance stops, hibernates, or terminates. Use instance store for temporary data (buffers, caches, swap). **EFS** is a managed NFS file system that mounts to multiple EC2 instances simultaneously (even across AZs), scales automatically, and charges for storage used — unlike EBS which must be pre-provisioned.`,
      quiz: [
        {
          question:
            "A high-performance database requires consistent 50,000 IOPS with sub-millisecond latency. Which storage option should be used?",
          options: [
            "io2 Block Express EBS volume",
            "gp3 EBS volume",
            "Instance Store",
            "st1 EBS volume",
          ],
          correctIndex: 0,
          explanation:
            "io2 Block Express is the highest-performance EBS option, supporting up to 256,000 IOPS with consistent sub-millisecond latency and 99.999% durability. gp3 maxes at 16,000 IOPS. Instance Store has no durability. st1 is HDD optimized for throughput, not IOPS.",
        },
      ],
    },
    {
      heading: "Auto Scaling Groups",
      body: `An **ASG** automatically adjusts the number of EC2 instances based on demand. You define a launch template (or launch configuration), minimum/maximum/desired capacity, and scaling policies. **Dynamic scaling** reacts to CloudWatch alarms (e.g., add 2 instances when CPU > 70%). **Predictive scaling** uses ML to forecast load and scales ahead of time. **Scheduled scaling** fires at a set time (e.g., scale up every Monday morning).

The **target tracking** policy is the simplest and most commonly tested: you specify a target metric value (e.g., keep average CPU at 50%) and the ASG adjusts capacity automatically. **Step scaling** defines fixed adjustments for ranges of metric values. **Simple scaling** has a cooldown period and only one scaling activity at a time. The ASG replaces unhealthy instances automatically by terminating them and launching new ones from the launch template.`,
      quiz: [
        {
          question:
            "An ASG should maintain average CPU utilization at 60% and respond quickly to demand changes. Which scaling policy type should be configured?",
          options: [
            "Target tracking scaling",
            "Step scaling",
            "Simple scaling",
            "Scheduled scaling",
          ],
          correctIndex: 0,
          explanation:
            "Target tracking scaling is designed for this use case — you set the target metric value (60% CPU) and the ASG adds or removes instances to keep the metric near that target. It responds faster than step scaling because it calculates the required change and doesn't wait for a cooldown before starting another scaling action.",
        },
      ],
    },
    {
      heading: "EC2 Placement Groups",
      body: `**Placement groups** influence how EC2 instances are placed on underlying hardware. **Cluster** placement groups co-locate instances on the same rack within a single AZ for ultra-low latency and high network throughput (10 Gbps+) — ideal for HPC and tightly coupled distributed systems. The tradeoff is reduced availability: a hardware failure affects all instances in the cluster.

**Spread** placement groups place each instance on distinct underlying hardware (separate racks), maximizing availability — up to 7 instances per AZ per group. Use for small numbers of critical instances that must not fail together. **Partition** placement groups divide instances into logical partitions, each on separate racks. Up to 7 partitions per AZ, with many instances per partition — used for large distributed databases like Cassandra, HBase, and HDFS where failure isolation at the rack level is important.`,
      quiz: [
        {
          question:
            "A company is deploying a large Hadoop cluster that requires rack-level failure isolation for its data nodes. Which placement group type should be used?",
          options: [
            "Partition placement group",
            "Cluster placement group",
            "Spread placement group",
            "No placement group required",
          ],
          correctIndex: 0,
          explanation:
            "Partition placement groups split instances into partitions, each on separate physical racks. If one rack fails, only one partition is affected. This is the purpose-built solution for distributed databases like Hadoop, Cassandra, and HBase that need to isolate failures at the partition/rack level. Cluster groups maximize throughput but concentrate risk on one rack.",
        },
      ],
    },
    {
      heading: "User Data and Instance Metadata",
      body: `**User data** is a script that runs once when an EC2 instance first starts. It's used for bootstrapping — installing packages, downloading config files, running application setup. User data runs as root and is available via a URL at 169.254.169.254/latest/user-data. It is not re-run on instance restarts unless you explicitly configure it to do so.

**Instance metadata** is information about the running instance available at http://169.254.169.254/latest/meta-data/. Key fields include instance-id, AMI ID, local IPv4 address, public IPv4 address, IAM role credentials (rotated automatically), and more. IMDSv2 (Instance Metadata Service v2) requires session-oriented requests with a PUT token — it is more secure than IMDSv1 (simple GET). AWS recommends requiring IMDSv2 for all instances via instance metadata service settings.`,
      quiz: [
        {
          question:
            "An EC2 instance needs to retrieve its IAM role credentials without using hardcoded access keys. Where are the temporary credentials available?",
          options: [
            "The EC2 instance metadata service at 169.254.169.254",
            "AWS Secrets Manager",
            "AWS Systems Manager Parameter Store",
            "An S3 bucket configured in the launch template",
          ],
          correctIndex: 0,
          explanation:
            "The instance metadata service at 169.254.169.254/latest/meta-data/iam/security-credentials/<role-name> vends temporary credentials for the attached IAM role. These credentials rotate automatically before expiry. This is how AWS SDKs running on EC2 get credentials without hardcoded keys.",
        },
      ],
    },
  ],

  keyFacts: [
    "Instance families: M=general, C=compute, R=memory, I=storage, G/P=GPU",
    "On-Demand: highest cost, no commitment. Reserved: up to 72% savings with 1-3 year commitment",
    "Spot Instances: up to 90% savings, 2-minute interruption notice — for fault-tolerant workloads",
    "Dedicated Hosts: physical server for you — required for bring-your-own-license (BYOL) scenarios",
    "EBS volumes persist; instance store is ephemeral (lost on stop/terminate)",
    "gp3: up to 16,000 IOPS. io2 Block Express: up to 256,000 IOPS",
    "st1 HDD: high throughput sequential reads (logs, streaming). sc1: lowest cost cold storage",
    "ASG replaces unhealthy instances automatically; use target tracking for dynamic workloads",
    "Cluster placement: lowest latency, one AZ, single point of failure",
    "Spread placement: max 7 instances per AZ, each on distinct hardware — max HA",
    "Partition placement: rack-level isolation for large distributed databases",
    "User data runs once at first boot; instance metadata at 169.254.169.254",
    "IMDSv2 is more secure than IMDSv1 — requires session token PUT request",
    "EC2 Hibernate: saves RAM contents to EBS root volume on stop, retains instance ID and private IP, faster startup",
  ],

  relatedServices: [
    "Amazon EBS",
    "Amazon EFS",
    "Elastic Load Balancing",
    "AWS Auto Scaling",
    "Amazon CloudWatch",
    "AWS Systems Manager",
    "AWS Batch",
  ],

  examTips: [
    "If the question mentions 'license compliance' or 'per-socket licensing', the answer is Dedicated Hosts",
    "Spot instances are always the cheapest option for interruptible batch workloads",
    "Reserved Instances save most (72%) but lock in attributes — Convertible RIs trade flexibility for fewer savings",
    "Savings Plans apply more broadly (across families/regions) than Standard RIs",
    "For concurrent access by multiple EC2 instances to shared storage, use EFS (NFS) not EBS",
    "EBS can only attach to ONE instance at a time (except io1/io2 Multi-Attach for same-AZ cluster)",
    "ASG default termination policy: terminate instance in AZ with most instances, then oldest launch config",
    "Scale-in protection prevents specific instances (like task coordinators) from being terminated during scale-in",
    "Target tracking scaling is recommended over step or simple scaling for most use cases",
    "User data is base64-encoded when passed via API; the console encodes it automatically",
    "Use AWS Systems Manager Session Manager to connect to EC2 instances without SSH keys or open port 22 — no bastion host required",
  ],
};
