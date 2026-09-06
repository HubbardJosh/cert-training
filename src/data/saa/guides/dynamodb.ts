import { ServiceGuide } from "../../../types/guide";

export const dynamodbGuide: ServiceGuide = {
  id: "saa-dynamodb",
  service: "Amazon DynamoDB",
  domain: "fundamentals",
  tagline:
    "Serverless NoSQL database with single-digit millisecond performance at any scale",
  intro:
    "DynamoDB is a fully managed key-value and document database. It delivers consistent single-digit millisecond latency at any scale, with built-in replication across 3 AZs and automatic scaling. The SAA exam tests table design, capacity modes, and caching.",

  sections: [
    {
      heading: "Data Model: Tables, Items, and Primary Keys",
      body: `DynamoDB stores data as **items** in **tables**. Items are collections of attributes with flexible schema — different items in the same table can have different attributes. Every item must have a **primary key**. A **simple primary key** uses only a partition key (each item has a unique partition key value). A **composite primary key** uses a partition key + sort key — multiple items can share the same partition key as long as their sort keys differ within that partition.

DynamoDB distributes data across partitions using the partition key hash. Hot partitions (too many requests to a small number of partition key values) cause throttling. Design for **high cardinality** partition keys — user IDs, order IDs, device IDs. Avoid status fields or boolean flags as partition keys. Maximum item size is 400 KB. Attribute types: String (S), Number (N), Binary (B), Boolean (BOOL), Null, List (L), Map (M), Sets.`,
      quiz: [
        {
          question:
            "A DynamoDB table uses 'status' (active/inactive) as the partition key. What problem will occur at scale?",
          options: [
            "Hot partition throttling — only 2 partitions receive all traffic",
            "DynamoDB will reject the table design at creation",
            "Sort keys will be required to query the table",
            "Cross-AZ replication will be disabled for low-cardinality keys",
          ],
          correctIndex: 0,
          explanation:
            "Low-cardinality partition keys (like a boolean or status field with only 2-3 values) concentrate all writes and reads into 2-3 partitions. Each partition has a throughput limit (3,000 RCU, 1,000 WCU). As the table scales, these partitions become hot and throttle. High-cardinality keys (UUIDs, user IDs) distribute traffic evenly.",
        },
      ],
    },
    {
      heading: "Capacity Modes: Provisioned vs. On-Demand",
      body: `DynamoDB offers two capacity modes. **Provisioned mode** requires you to specify RCU and WCU for the table. You pay for the provisioned capacity regardless of actual usage. Use **Auto Scaling** to adjust capacity based on CloudWatch metrics — set target utilization (e.g., 70% of provisioned capacity). Provisioned mode is cost-effective for predictable, steady traffic.

**On-Demand mode** automatically scales to handle any traffic level with no capacity planning. You pay per read and write request rather than for provisioned capacity. Ideal for unpredictable workloads, new applications without known traffic patterns, or tables with large traffic spikes. On-Demand costs more per request than Provisioned at steady loads but eliminates under/over-provisioning risk. You can switch between modes up to twice per day.`,
      quiz: [
        {
          question:
            "A new application launches tomorrow with completely unknown traffic patterns. Which DynamoDB capacity mode minimizes operational risk?",
          options: [
            "On-Demand mode — scales automatically, no capacity planning needed",
            "Provisioned mode with a very high WCU to handle any traffic",
            "Provisioned mode with Auto Scaling enabled",
            "Provisioned mode with a DLQ to handle throttled requests",
          ],
          correctIndex: 0,
          explanation:
            "On-Demand mode is ideal when traffic patterns are unknown. It handles any request volume automatically with no throttling due to under-provisioned capacity. Provisioned mode requires knowing expected traffic; over-provisioning wastes money. Auto Scaling takes time to scale out and may not react fast enough to sudden spikes.",
        },
      ],
    },
    {
      heading: "DynamoDB Indexes: GSI and LSI",
      body: `**Local Secondary Index (LSI)** uses the same partition key as the base table but a different sort key. LSIs must be created at table creation time and cannot be added later. They share the read/write capacity of the base table. LSIs support **strongly consistent reads** (same as the base table). Maximum 5 LSIs per table.

**Global Secondary Index (GSI)** can have a completely different partition key and sort key from the base table. GSIs can be created or deleted at any time (after table creation). GSIs have their own provisioned or on-demand throughput separate from the base table. GSIs only support **eventually consistent reads**. Maximum 20 GSIs per table. GSIs are used to support additional query patterns — for example, querying by email address when the table's partition key is user ID.`,
      quiz: [
        {
          question:
            "A DynamoDB table uses userId as the partition key and orderId as the sort key. The application also needs to query all orders for a specific product. Which DynamoDB feature enables this query pattern?",
          options: [
            "Global Secondary Index with productId as the partition key",
            "Local Secondary Index with productId as the sort key",
            "DynamoDB Scan filtering on productId",
            "A second DynamoDB table with productId as the partition key",
          ],
          correctIndex: 0,
          explanation:
            "A GSI with productId as the partition key supports efficient queries like 'all orders for product X'. An LSI must share the base table's partition key (userId) so it cannot support productId-based queries. Scan operations read the entire table and filter in-memory — expensive and slow. A second table adds duplication and consistency complexity.",
        },
      ],
    },
    {
      heading: "DynamoDB Streams and DAX",
      body: `**DynamoDB Streams** capture a time-ordered sequence of item-level modifications (insert, update, delete) in a table. Stream records are available for 24 hours. Lambda functions can be triggered by stream records for real-time processing — building change data capture (CDC) pipelines, maintaining aggregations, or replicating data to another table (DynamoDB Global Tables use streams internally for cross-region replication).

**DAX** (DynamoDB Accelerator) is a fully managed in-memory cache for DynamoDB. DAX is API-compatible with DynamoDB — you point your application at the DAX cluster endpoint instead of the DynamoDB endpoint, with no code changes. DAX delivers microsecond read latency for cached items. DAX is ideal for read-heavy workloads with many repeated reads of the same items (leaderboards, catalog pages, session state). DAX does not help with strongly consistent reads or write-heavy workloads.`,
      quiz: [
        {
          question:
            "A gaming application's leaderboard table is read thousands of times per second for the same top-10 records. DynamoDB costs are high due to RCU consumption. What is the MOST cost-effective solution?",
          options: [
            "Add a DAX cluster in front of DynamoDB",
            "Increase DynamoDB provisioned RCUs",
            "Move the leaderboard to ElastiCache Redis",
            "Add a GSI for the leaderboard query pattern",
          ],
          correctIndex: 0,
          explanation:
            "DAX caches repeated DynamoDB reads in memory with microsecond latency and dramatically reduces RCU consumption on the base table. Since the same top-10 records are read thousands of times per second, DAX's caching will absorb almost all traffic. DAX is API-compatible, requiring minimal code changes compared to Redis.",
        },
      ],
    },
    {
      heading: "DynamoDB Global Tables and TTL",
      body: `**Global Tables** is DynamoDB's multi-region, multi-active replication feature. All replica tables are writable — writes in any region replicate to all others within seconds. This enables low-latency read and write access for globally distributed applications and provides multi-region disaster recovery. Global Tables require DynamoDB Streams to be enabled and use On-Demand mode or Provisioned mode with Auto Scaling.

**TTL** (Time to Live) automatically deletes items from a DynamoDB table when a specified timestamp attribute value passes. TTL deletions are free (no WCU consumed), processed within 48 hours of the expiry time. Use TTL for session tokens, temporary data, event logs older than a retention period, and any time-bounded data. Expired items are visible in queries until they are physically deleted — filter them out using a condition expression or FilterExpression if needed.`,
      quiz: [
        {
          question:
            "A session management table stores user sessions that should automatically expire after 24 hours. What is the MOST cost-effective way to remove expired sessions?",
          options: [
            "Enable TTL with a timestamp attribute set to now + 24 hours",
            "Schedule a Lambda function to scan and delete expired sessions every hour",
            "Use DynamoDB Streams to trigger deletion of expired items",
            "Set provisioned WCUs high enough to delete expired items in real-time",
          ],
          correctIndex: 0,
          explanation:
            "DynamoDB TTL is free — it doesn't consume WCUs for deletions. Setting a TTL attribute (Unix epoch timestamp) on each session item causes DynamoDB to automatically delete items after expiry. Scheduled Lambda + Scan is costly (RCU usage for scan, Lambda compute) and doesn't scale. TTL is the purpose-built, zero-cost solution.",
        },
      ],
    },
  ],

  keyFacts: [
    "DynamoDB maximum item size: 400 KB",
    "Partition key design must have high cardinality — avoid hot partitions",
    "Provisioned mode: pay for capacity. On-Demand: pay per request",
    "LSI: same partition key, different sort key — must be created at table creation, max 5",
    "GSI: any partition/sort key, created anytime, own throughput, eventually consistent only",
    "DynamoDB Streams: 24-hour retention of item change records — Lambda CDC trigger",
    "DAX: microsecond latency cache, API-compatible, reduces RCU consumption",
    "Global Tables: multi-region, multi-active writes with seconds replication latency",
    "TTL: free automatic item deletion based on timestamp attribute, within 48 hours",
    "Strongly consistent reads: 1 RCU per 4 KB. Eventually consistent reads: 0.5 RCU per 4 KB",
    "Transactions (TransactWriteItems): atomic all-or-nothing writes across items/tables — 2× WCU cost",
  ],

  relatedServices: [
    "AWS DAX",
    "Amazon ElastiCache",
    "AWS Lambda",
    "Amazon Kinesis",
    "Amazon S3",
    "AWS AppSync",
  ],

  examTips: [
    "When the exam says 'serverless NoSQL', 'single-digit millisecond', or 'key-value at scale', the answer is DynamoDB",
    "DAX for DynamoDB read acceleration (microseconds). ElastiCache Redis for RDS read acceleration",
    "LSI must be created at table creation; GSI can be added later — choose LSI only when you know the access patterns upfront",
    "TTL is free and purpose-built for session expiry and time-bounded data — not Lambda scan",
    "Global Tables for multi-region active-active; cross-region read replicas for read-only geographic distribution",
    "On-Demand mode is more expensive per request but has no throttling — use for unpredictable traffic",
    "DynamoDB transactions cost 2× the normal read/write units — avoid for high-frequency simple operations",
    "FilterExpression in Scan/Query filters AFTER reading — you still pay RCU for all read items",
    "PartiQL (SQL-compatible) can query DynamoDB but is still limited by DynamoDB's data model",
  ],
};
