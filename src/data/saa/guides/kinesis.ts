import { ServiceGuide } from "../../../types/guide";

export const kinesisGuide: ServiceGuide = {
  id: "saa-kinesis",
  service: "Amazon Kinesis & Analytics",
  domain: "applications",
  tagline: "Real-time streaming data ingestion, processing, and analytics",
  intro:
    "Kinesis is the AWS family of services for real-time data streaming. SAA-C03 tests when to choose Kinesis Data Streams vs. Kinesis Data Firehose vs. SQS, and how to architect streaming analytics pipelines.",

  sections: [
    {
      heading: "Kinesis Data Streams (KDS)",
      body: `KDS is a real-time data streaming service with a retention period of 24 hours (default) to 365 days. Data is organized into **shards** — each shard provides 1 MB/s ingest and 2 MB/s read throughput. Consumers read records in order within a shard using sequence numbers. Multiple consumers can read from the same shard simultaneously using **Enhanced Fan-Out** (dedicated 2 MB/s per consumer per shard) or **standard consumers** that share the 2 MB/s read limit.

Records are immutable — they cannot be deleted before the retention period expires. This is unlike SQS where messages are deleted after consumption. This makes KDS suitable for replaying data and supporting multiple independent consumers reading the same stream at different positions. The ordering guarantee is per-shard — records with the same partition key always go to the same shard and are ordered within it.`,
      quiz: [
        {
          question:
            "A streaming pipeline has 5 independent consumer applications that all need to process the same real-time click events. Which feature ensures each consumer gets its own dedicated throughput?",
          options: [
            "Kinesis Enhanced Fan-Out — 2 MB/s dedicated per consumer per shard",
            "Kinesis standard consumers sharing the 2 MB/s read limit",
            "Five separate Kinesis Data Streams — one per consumer",
            "Amazon SQS with five consumer groups",
          ],
          correctIndex: 0,
          explanation:
            "Enhanced Fan-Out provides each registered consumer with a dedicated 2 MB/s throughput per shard via HTTP/2 push delivery. Without it, all consumers share the shard's 2 MB/s read limit. Multiple streams add cost and operational complexity. SQS doesn't support multiple consumers reading the same message (without SNS fan-out).",
        },
      ],
    },
    {
      heading: "Kinesis Data Firehose (KDF)",
      body: `KDF is a fully managed service that loads streaming data directly into AWS destinations: S3, Redshift, OpenSearch Service, and third-party partners (Splunk, Datadog, New Relic, MongoDB). Unlike KDS, Firehose requires no consumer code — you configure the destination and Firehose delivers data automatically. Firehose buffers records (by size up to 128 MB or time up to 900 seconds) before writing to the destination, introducing a delivery latency of seconds to minutes.

KDF can transform data before delivery using a Lambda function — for example, converting JSON to Parquet, compressing with gzip, or filtering fields. Firehose automatically scales to match throughput — no shard management required. For S3 delivery, Firehose can partition data by date/time, enabling efficient Athena queries. Use KDF when you need **near-real-time** delivery to a destination without writing consumer code; use KDS when you need **real-time** processing with custom consumers.`,
      quiz: [
        {
          question:
            "A company needs to stream IoT sensor data to S3 for later analysis with Athena. The data should be converted to Parquet format before storage. No custom consumer code should be needed. Which service should be used?",
          options: [
            "Kinesis Data Firehose with a Lambda transformation function",
            "Kinesis Data Streams with a Lambda consumer",
            "Amazon SQS with a Lambda consumer writing to S3",
            "Amazon MSK with a consumer writing to S3",
          ],
          correctIndex: 0,
          explanation:
            "KDF is designed for exactly this pattern — it ingests streaming data, optionally transforms it via Lambda (JSON → Parquet), and delivers to S3 without custom consumer code. KDS requires you to write and manage consumer applications. SQS + Lambda works but adds consumer management. MSK is for Kafka-compatible applications.",
        },
      ],
    },
    {
      heading: "KDS vs. KDF vs. SQS: When to Use Which",
      body: `The choice between KDS, KDF, and SQS depends on the use case. **Use KDS** when you need real-time processing (milliseconds), multiple independent consumers reading the same data, data replay capability, or ordering guarantees within a partition key. **Use KDF** when you need near-real-time delivery (seconds to minutes) to S3, Redshift, or OpenSearch with no consumer code, or when you need format conversion.

**Use SQS** when you need reliable decoupling of producers and consumers with at-least-once delivery, fan-out (via SNS), dead-letter queues, or when records should be deleted after consumption. SQS is better for task queues where each message should be processed by exactly one consumer. KDS is better when multiple consumers need to read the same records independently. A common exam pattern: IoT device → KDS → Lambda (real-time alert) + KDF (S3 archive).`,
      quiz: [
        {
          question:
            "An application must process streaming stock ticker data in real-time (under 1 second) and also archive the raw data to S3 for daily batch analysis. Which architecture is correct?",
          options: [
            "Kinesis Data Streams → Lambda (real-time processing) + Kinesis Data Firehose (S3 archival)",
            "SQS → Lambda (real-time) + S3 event notification (archival)",
            "Kinesis Data Firehose → Lambda (real-time) + S3 (archival)",
            "Two SQS queues — one for real-time processing, one for S3 archival",
          ],
          correctIndex: 0,
          explanation:
            "KDS supports multiple consumers: a Lambda consumer for real-time processing and KDF (reading from KDS) for near-real-time S3 archival. KDF alone can't do sub-second processing — it has seconds of buffering latency. SQS deletes messages after consumption so a second consumer wouldn't see them. This dual-consumer KDS pattern is a classic SAA-C03 architecture.",
        },
      ],
    },
  ],

  keyFacts: [
    "KDS: 1 MB/s ingest per shard, 2 MB/s read per shard, 24-hour to 365-day retention",
    "KDS records are immutable — not deleted after consumption, can be replayed",
    "Enhanced Fan-Out: dedicated 2 MB/s per consumer per shard via HTTP/2 push",
    "KDF: fully managed, buffers up to 128 MB or 900 seconds, delivers to S3/Redshift/OpenSearch",
    "KDF latency: seconds to minutes (not real-time). KDS latency: milliseconds (real-time)",
    "KDF Lambda transformation: convert JSON to Parquet, compress, filter before S3 delivery",
    "SQS: at-least-once delivery, messages deleted after consumption, no replay",
    "KDS ordering: per-shard (records with same partition key go to same shard in order)",
    "Kinesis capacity: add shards to scale throughput (resharding)",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon S3",
    "Amazon Redshift",
    "Amazon OpenSearch Service",
    "Amazon EMR",
    "Amazon SQS",
    "Amazon MSK",
  ],

  examTips: [
    "KDS for real-time (ms) with multiple consumers and replay. KDF for near-real-time delivery to destinations with no consumer code",
    "SQS deletes after consumption — use KDS when multiple independent consumers need to read the same records",
    "KDF Lambda transformation: JSON → Parquet conversion is a very common exam scenario for cost-efficient Athena queries",
    "A single KDS stream can feed both a Lambda consumer (real-time alerts) and KDF (S3 archival) simultaneously",
    "Kinesis shard is the unit of throughput — more shards = more capacity but higher cost",
    "KDS Enhanced Fan-Out is for high-fan-out scenarios (many consumers); standard polling is cheaper for fewer consumers",
    "MSK (Managed Kafka) is for migrating existing Kafka workloads — not a greenfield choice over KDS",
  ],
};
