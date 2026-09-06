import { ServiceGuide } from "../../../types/guide";

export const rdsGuide: ServiceGuide = {
  id: "saa-rds",
  service: "Amazon RDS & Aurora",
  domain: "fundamentals",
  tagline:
    "Managed relational databases with automated backups, failover, and scaling",
  intro:
    "RDS manages the undifferentiated heavy lifting of relational databases: provisioning, patching, backups, and failover. Aurora is AWS's purpose-built relational engine that offers higher performance and availability than standard RDS engines.",

  sections: [
    {
      heading: "RDS Engines and Multi-AZ",
      body: `RDS supports MySQL, PostgreSQL, MariaDB, Oracle, Microsoft SQL Server, and Amazon Aurora. **Multi-AZ** deployments automatically create a synchronous standby replica in a different AZ. Failover to the standby is automatic (60-120 seconds) and uses a DNS CNAME flip — applications must use the RDS endpoint (not a hardcoded IP) to benefit from automatic failover. Multi-AZ is for **high availability**, not for read scaling — the standby is not accessible for reads.

You should always enable Multi-AZ for production databases. During failover, the original primary becomes the new standby. Maintenance (OS/DB patches) and snapshots are taken from the standby when Multi-AZ is enabled, minimizing impact on the primary. Multi-AZ does not protect against data corruption or accidental deletion — both primary and standby reflect those changes.`,
      quiz: [
        {
          question:
            "An RDS Multi-AZ deployment fails over to the standby. What does the application need to do to reconnect?",
          options: [
            "Nothing — the RDS DNS endpoint automatically points to the new primary",
            "Update the connection string with the new primary IP address",
            "Restart the application with the standby endpoint URL",
            "Manually promote the standby to primary in the console",
          ],
          correctIndex: 0,
          explanation:
            "RDS Multi-AZ failover works by flipping the CNAME DNS record for the endpoint to the standby. Applications using the RDS endpoint DNS name reconnect automatically after the DNS TTL expires (typically 30-60 seconds). Applications using hardcoded IPs will not benefit from automatic failover.",
        },
      ],
    },
    {
      heading: "RDS Read Replicas",
      body: `**Read replicas** are asynchronous copies of the primary RDS instance that serve read traffic. You can create up to 5 read replicas per primary (15 for Aurora). Read replicas can be in the same AZ, different AZ, or different region (cross-region read replicas). Unlike Multi-AZ standbys, read replicas ARE accessible for read queries — use them to offload reporting, analytics, or read-heavy workloads.

Replication lag exists because it is asynchronous. Read replicas can be promoted to standalone databases (e.g., for disaster recovery) — promotion breaks replication and the replica becomes an independent instance. Cross-region read replicas serve as a DR strategy with low RPO but non-zero data loss potential. Read replicas for MySQL and MariaDB require automated backups to be enabled on the primary.`,
      quiz: [
        {
          question:
            "A reporting application runs complex queries against the production RDS database and is causing performance issues. What is the MOST cost-effective solution?",
          options: [
            "Create an RDS Read Replica and point the reporting application to it",
            "Upgrade the RDS instance to a larger instance type",
            "Enable Multi-AZ and route reporting queries to the standby",
            "Create a DynamoDB table and sync data from RDS",
          ],
          correctIndex: 0,
          explanation:
            "A read replica offloads read traffic from the primary at relatively low cost. The reporting app connects to the replica endpoint, removing load from production. Multi-AZ standbys are not accessible for reads. Upgrading instance type is more expensive and doesn't isolate reporting load.",
        },
      ],
    },
    {
      heading: "RDS Backups and Snapshots",
      body: `RDS provides two types of backups. **Automated backups** are enabled by default with a retention period of 1-35 days. They capture daily snapshots plus transaction logs, enabling PITR to any second within the retention window. Automated backups are deleted when the instance is deleted (unless you retain them explicitly). **Manual snapshots** persist until you delete them — always take a final snapshot before deleting an RDS instance.

Snapshots can be shared with other AWS accounts and copied to other regions. When restoring a snapshot, AWS creates a new RDS instance — the original instance is not overwritten. This means restore time depends on how quickly a new instance launches (minutes, not seconds). For faster recovery, consider RDS Proxy or a warm standby (Multi-AZ or read replica already running).`,
      quiz: [
        {
          question:
            "A developer accidentally deleted rows from a production RDS table at 2:15 PM. Automated backups are enabled with a 7-day retention period. How can the data be recovered?",
          options: [
            "Restore to a point-in-time before 2:15 PM — this creates a new RDS instance",
            "Restore the most recent daily snapshot — this overwrites the current instance",
            "Use RDS rollback to undo the DELETE statement",
            "Promote the Multi-AZ standby which has the deleted rows",
          ],
          correctIndex: 0,
          explanation:
            "RDS PITR restores the database to any second within the backup retention window by replaying transaction logs from the last snapshot. The result is a NEW RDS instance — the original is not modified. Multi-AZ standbys synchronously replicate all changes including the DELETE, so they don't help for logical data loss.",
        },
      ],
    },
    {
      heading: "Amazon Aurora Architecture",
      body: `Aurora is a MySQL- and PostgreSQL-compatible engine built by AWS with a shared storage architecture. The storage layer is a **distributed SSD volume** that spans 6 copies of your data across 3 AZs automatically. Aurora can tolerate losing up to 2 copies for writes and 3 copies for reads without losing availability. Storage auto-scales from 10 GB to 128 TB with no manual intervention.

Aurora has one primary instance (reads and writes) and up to 15 Aurora Replicas (reads only) with failover priority. Failover to an Aurora Replica is much faster than RDS Multi-AZ (~30 seconds vs 60-120 seconds) because there is no data copy involved — the replica already has the same shared storage. Aurora also supports **Global Database** for cross-region replication with sub-second lag, enabling fast failover across regions.`,
      quiz: [
        {
          question:
            "Which statement correctly describes Aurora's storage architecture?",
          options: [
            "Aurora maintains 6 copies of data across 3 AZs automatically",
            "Aurora stores data in a single AZ but replicates to 2 standbys",
            "Aurora uses instance-level EBS volumes like standard RDS",
            "Aurora storage is manually scaled up to a maximum of 64 TB",
          ],
          correctIndex: 0,
          explanation:
            "Aurora's distributed storage layer automatically maintains 6 copies of data across 3 AZs (2 copies per AZ). This is transparent to the user — no manual replication setup is required. Storage auto-scales to 128 TB. This architecture is fundamentally different from standard RDS, which uses EBS volumes.",
        },
      ],
    },
    {
      heading: "Aurora Serverless and Multi-Master",
      body: `**Aurora Serverless v2** automatically scales database capacity in fine-grained increments (in Aurora Capacity Units) based on application demand. It's ideal for variable, unpredictable workloads — dev/test databases, SaaS applications with unknown load, and event-driven applications. Unlike Aurora Serverless v1 (which scaled to zero), v2 scales down to a minimum capacity but not to zero; it scales up much faster than v1.

**Aurora Multi-Master** allows multiple write instances across AZs for continuous write availability. This is distinct from read replicas — all nodes can accept writes. Use Multi-Master when you need continuous write availability even during a failover event (zero write downtime). However, Multi-Master is only available for MySQL-compatible Aurora and requires application-level conflict detection.`,
      quiz: [
        {
          question:
            "A SaaS application has highly variable database load — nearly idle at night, heavily loaded during business hours, with occasional sudden traffic spikes. Which database option minimizes cost while handling spikes automatically?",
          options: [
            "Aurora Serverless v2",
            "RDS with Auto Scaling storage",
            "Aurora with read replicas",
            "RDS Multi-AZ with a larger instance type",
          ],
          correctIndex: 0,
          explanation:
            "Aurora Serverless v2 scales capacity automatically in response to load, charging only for the capacity used. This is cost-effective for variable workloads — you're not paying for peak capacity 24/7. RDS doesn't scale compute capacity automatically. Standard Aurora replicas add read capacity but not write capacity.",
        },
      ],
    },
    {
      heading: "RDS Proxy",
      body: `**RDS Proxy** is a fully managed database proxy that sits between your application and RDS/Aurora. It maintains a pool of connections to the database and multiplexes thousands of application connections into a smaller number of database connections. This dramatically reduces connection overhead for applications that open many short-lived connections (Lambda functions, container-based microservices).

RDS Proxy also improves failover times — during a Multi-AZ failover, Proxy routes connections to the new primary automatically and reduces failover impact by maintaining the connection pool. RDS Proxy integrates with IAM for authentication and stores database credentials in Secrets Manager, eliminating hardcoded passwords. Proxy is deployed in the same VPC as RDS and is not publicly accessible.`,
      quiz: [
        {
          question:
            "A Lambda function connects to an RDS database and is causing 'too many connections' errors during high traffic. What is the BEST solution?",
          options: [
            "Place an RDS Proxy in front of the database",
            "Increase the max_connections parameter in the RDS parameter group",
            "Migrate to DynamoDB which handles connection-less requests",
            "Enable Multi-AZ to distribute connection load",
          ],
          correctIndex: 0,
          explanation:
            "RDS Proxy is purpose-built for Lambda-to-RDS architectures. Lambda creates a new execution environment (and database connection) for each concurrent invocation, quickly exhausting connection limits. RDS Proxy pools and reuses connections, reducing the number of actual connections to the database regardless of Lambda concurrency.",
        },
      ],
    },
    {
      heading: "ElastiCache for Database Caching",
      body: `**ElastiCache** provides managed Redis or Memcached in-memory caching. The primary use case alongside RDS is the **lazy loading** (cache-aside) pattern: the application checks the cache first; on a cache miss, reads from RDS and writes to cache. This dramatically reduces RDS read load for repeated queries. **Write-through** caching updates the cache whenever the database is written to — ensures cache consistency at the cost of additional write latency.

**Redis vs. Memcached**: Redis supports persistence (RDB snapshots, AOF logging), replication, pub/sub, sorted sets, and geospatial indexing. Redis Cluster supports horizontal sharding across multiple shards. Memcached is simpler, multi-threaded, and supports no persistence — suitable for simple key-value caching where durability is not needed. For the exam: Redis is almost always the better choice for anything requiring persistence, replication, or complex data structures.`,
      quiz: [
        {
          question:
            "A read-heavy application queries the same RDS data repeatedly. A caching layer is being added. The cache must persist data through a restart and support replication for high availability. Which ElastiCache engine should be chosen?",
          options: [
            "Redis",
            "Memcached",
            "Either Redis or Memcached — they are equivalent",
            "DynamoDB DAX instead of ElastiCache",
          ],
          correctIndex: 0,
          explanation:
            "Redis supports persistence (snapshots and AOF) and replication, making it the correct choice when cache durability and HA are required. Memcached is in-memory only with no persistence or replication. DAX is specific to DynamoDB, not RDS.",
        },
      ],
    },
  ],

  keyFacts: [
    "RDS Multi-AZ: synchronous standby in different AZ — for HA, not read scaling",
    "Multi-AZ failover: 60-120 seconds; Aurora replica promotion: ~30 seconds",
    "Read replicas are asynchronous — slight replication lag possible",
    "Up to 5 read replicas for RDS; up to 15 Aurora Replicas",
    "PITR restores to any second within the retention window (1-35 days) — creates a NEW instance",
    "Aurora: 6 copies across 3 AZs, auto-scales storage to 128 TB",
    "Aurora Global Database: cross-region replication with sub-second lag",
    "Aurora Serverless v2: fine-grained auto-scaling for variable workloads",
    "RDS Proxy: connection pooling for Lambda/container-heavy workloads",
    "Redis: persistence + replication. Memcached: simple, multi-threaded, no persistence",
    "Manual snapshots persist until deleted; automated backups deleted when instance is deleted",
    "RDS Proxy stores credentials in Secrets Manager — no hardcoded passwords",
  ],

  relatedServices: [
    "Amazon ElastiCache",
    "AWS Secrets Manager",
    "Amazon DynamoDB",
    "AWS Database Migration Service",
    "Amazon S3 (snapshots exported to S3)",
    "AWS Lambda (via RDS Proxy)",
  ],

  examTips: [
    "Multi-AZ is HA; Read Replicas are performance — don't confuse them",
    "Multi-AZ standby is NOT accessible for reads — only for failover",
    "Applications must use the RDS DNS endpoint (not IP) to benefit from Multi-AZ failover",
    "PITR always creates a new instance — the original is preserved",
    "Aurora is significantly more expensive than standard RDS — position it for production HA workloads",
    "For Lambda connecting to RDS: always RDS Proxy (prevents connection pool exhaustion)",
    "Aurora Serverless v2 for unpredictable or spiky workloads; provisioned Aurora for steady consistent load",
    "Cross-region read replicas are a DR strategy with low (but non-zero) RPO",
    "Automated backups require enough I/O capacity — enable Multi-AZ to take backups from standby",
    "Redis is the answer whenever the question mentions persistence, pub/sub, sorted sets, or session storage",
  ],
};
