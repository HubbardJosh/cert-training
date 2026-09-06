import { ServiceGuide } from "../../../../types/guide";

export const monitoringGuide: ServiceGuide = {
  id: "saa-monitoring",
  service: "CloudWatch, CloudTrail & Config",
  domain: "deployment",
  tagline: "Monitor, audit, and govern your AWS infrastructure",
  intro:
    "CloudWatch provides metrics, logs, and alarms for operational visibility. CloudTrail records every API call for auditing. AWS Config tracks resource configuration changes and evaluates compliance. Together they are the governance triad on SAA-C03.",

  sections: [
    {
      heading: "Amazon CloudWatch Metrics and Alarms",
      body: `CloudWatch collects metrics from AWS services automatically. EC2 provides basic metrics every 5 minutes (CPU, network, disk I/O) — enable **detailed monitoring** for 1-minute granularity at an additional cost. **Custom metrics** let you publish application-level data (memory usage, queue depth, error rates) using the PutMetricData API. Standard resolution is 1 minute; **high-resolution custom metrics** can be published at 1-second granularity.

**CloudWatch Alarms** trigger actions when a metric crosses a threshold for a specified number of evaluation periods. Alarm states: OK, ALARM, INSUFFICIENT_DATA. Actions include: SNS notification, EC2 Auto Scaling, EC2 action (reboot/stop/terminate), or Systems Manager OpsCenter item. **Composite alarms** combine multiple alarms with AND/OR logic to reduce alarm noise — a composite alarm fires only when all component alarms are in ALARM state.`,
      quiz: [
        {
          question:
            "An EC2 instance memory utilization metric is not available in CloudWatch by default. How can this be resolved?",
          options: [
            "Install the CloudWatch Agent on the instance to publish memory as a custom metric",
            "Enable detailed monitoring for the EC2 instance",
            "Use CloudTrail to capture memory usage events",
            "Query the EC2 metadata service for memory statistics",
          ],
          correctIndex: 0,
          explanation:
            "EC2 basic and detailed monitoring provide hypervisor-level metrics only — memory, disk space, and process metrics require access inside the OS. The CloudWatch Agent runs on the instance and publishes these OS-level metrics as custom metrics to CloudWatch. Detailed monitoring only increases the frequency of existing metrics, not the types.",
        },
      ],
    },
    {
      heading: "CloudWatch Logs and Log Insights",
      body: `**CloudWatch Logs** collects and stores log files from EC2 instances (via CloudWatch Agent), Lambda functions (automatically), API Gateway, RDS, VPC Flow Logs, CloudTrail, and custom applications. Logs are organized into **log groups** (per application/resource) and **log streams** (per instance/invocation). Log retention is configurable from 1 day to never-expire (default is never expire — configure retention to control cost).

**CloudWatch Logs Insights** enables SQL-like queries over log data for ad-hoc analysis. Queries can scan terabytes of logs in seconds. **Metric filters** extract numeric values from log events and publish them as CloudWatch metrics — for example, counting ERROR occurrences in application logs and alarming when the count exceeds a threshold. **CloudWatch Logs Subscription Filters** stream log data to Kinesis, Lambda, or OpenSearch in near real-time for processing.`,
      quiz: [
        {
          question:
            "A team wants to trigger a CloudWatch Alarm when the application log contains more than 10 ERROR messages per minute. What is the required setup?",
          options: [
            "Create a Metric Filter to count ERROR occurrences and set an alarm on the resulting metric",
            "Use CloudWatch Logs Insights to query for errors and trigger an alarm",
            "Configure CloudTrail to capture application errors and create an alarm",
            "Use the default Lambda error metric in CloudWatch",
          ],
          correctIndex: 0,
          explanation:
            "Metric Filters extract patterns from log events and publish them as custom CloudWatch metrics. You define a filter pattern (e.g., 'ERROR') and a metric name. CloudWatch records the count of matches per minute, and you create an alarm on this metric. Logs Insights is for interactive queries, not real-time alarming.",
        },
      ],
    },
    {
      heading: "AWS CloudTrail",
      body: `CloudTrail records every API call made in your AWS account — who made the call, from which IP, at what time, which resource was affected, and whether it succeeded. Trails can log to S3 (for long-term retention and analysis) and CloudWatch Logs (for near-real-time alerting). By default, CloudTrail records **management events** (control plane operations like CreateBucket, TerminateInstances) in the last 90 days at no charge.

**Data events** (S3 GetObject/PutObject, Lambda invocations, DynamoDB item-level operations) are not logged by default and incur additional cost — enable them when you need to audit who accessed which data. **Insights events** detect unusual API activity patterns (e.g., a sudden spike in TerminateInstances calls) and alert you. CloudTrail logs are stored in S3 — enable integrity validation to detect if logs have been tampered with. For organization-wide logging, create an **organizational trail** in the management account.`,
      quiz: [
        {
          question:
            "A security team needs to determine which IAM user deleted an S3 bucket yesterday. Which AWS service provides this information?",
          options: [
            "AWS CloudTrail",
            "Amazon CloudWatch",
            "AWS Config",
            "VPC Flow Logs",
          ],
          correctIndex: 0,
          explanation:
            "CloudTrail records all API calls including DeleteBucket, including the caller's identity (user or role ARN), time, and source IP. CloudWatch monitors metrics and logs from applications. AWS Config tracks resource configuration changes but not who made API calls. VPC Flow Logs capture network traffic, not API calls.",
        },
      ],
    },
    {
      heading: "AWS Config",
      body: `AWS Config continuously records the configuration of your AWS resources and evaluates them against desired configuration rules. When a resource's configuration changes, Config records the change with a timestamp and the previous configuration. This creates a configuration history you can query (e.g., what did this security group look like 30 days ago?).

**Config Rules** evaluate resources for compliance — either AWS-managed rules (e.g., s3-bucket-public-read-prohibited, ec2-instance-no-public-ip) or custom Lambda-based rules for specific business requirements. Non-compliant resources are flagged in the Config dashboard. Config can also trigger **Auto-Remediation** via Systems Manager Automation documents — automatically remediating non-compliant resources (e.g., disabling public access on an S3 bucket). Config is a per-region service — enable it in all regions for comprehensive coverage.`,
      quiz: [
        {
          question:
            "A compliance requirement mandates that all EC2 security groups must not allow unrestricted inbound access (0.0.0.0/0) on port 22. How can this be continuously monitored?",
          options: [
            "AWS Config rule (restricted-ssh) that flags non-compliant security groups",
            "A CloudWatch alarm on security group changes",
            "CloudTrail monitoring for AuthorizeSecurityGroupIngress API calls",
            "A Lambda function that scans security groups nightly",
          ],
          correctIndex: 0,
          explanation:
            "AWS Config's managed rule 'restricted-ssh' continuously evaluates all security groups and flags any that allow unrestricted SSH access (0.0.0.0/0:22). Config evaluates on every configuration change in real-time, not on a schedule. CloudTrail records when the change was made but doesn't evaluate compliance. A Lambda function is a manual approach.",
        },
      ],
    },
  ],

  keyFacts: [
    "EC2 basic monitoring: 5-minute intervals. Detailed monitoring: 1-minute intervals (extra cost)",
    "Memory, disk space, process metrics require CloudWatch Agent — not available by default",
    "CloudWatch Alarms: OK, ALARM, INSUFFICIENT_DATA — trigger SNS, ASG, or EC2 actions",
    "Composite alarms combine multiple alarms with AND/OR logic to reduce noise",
    "CloudWatch Logs retention default: never expire — always configure retention to control costs",
    "Metric Filters extract patterns from logs and create CloudWatch metrics for alarming",
    "CloudTrail management events: free 90-day retention. Data events: opt-in, additional cost",
    "CloudTrail logs to S3; enable integrity validation to detect tampering",
    "Organizational trail: single CloudTrail covering all accounts in an AWS Organization",
    "AWS Config: resource configuration history and compliance evaluation",
    "Config auto-remediation: SSM Automation documents fix non-compliant resources automatically",
    "CloudTrail Insights: detects unusual API call patterns",
    "AWS X-Ray: distributed tracing for serverless and microservice applications — traces requests end-to-end across Lambda, API Gateway, EC2, and more",
    "CloudWatch Synthetics: Canary scripts that test application endpoints from the outside and monitor availability and latency",
  ],

  relatedServices: [
    "AWS Systems Manager",
    "Amazon SNS",
    "Amazon EventBridge",
    "Amazon Kinesis",
    "Amazon OpenSearch Service",
    "AWS Security Hub",
  ],

  examTips: [
    "CloudWatch = operational monitoring (metrics, logs, alarms). CloudTrail = API audit trail. Config = compliance and configuration history",
    "If the question asks 'who did what and when' → CloudTrail",
    "If the question asks 'is this resource compliant' or 'what was the config before' → AWS Config",
    "If the question asks 'alert when CPU is high' or 'monitor error rates' → CloudWatch",
    "EC2 memory and disk usage ALWAYS require the CloudWatch Agent — these are not automatically reported",
    "CloudTrail records the last 90 days of management events free — for longer retention, create a trail to S3",
    "Config Rules evaluate on resource change events (near real-time) or periodically — not continuously in real-time",
    "CloudWatch Logs Subscription Filters stream to Kinesis for real-time processing — useful for security event pipelines",
    "For org-wide unified logging: organizational CloudTrail + Config aggregator account",
    "For distributed tracing of requests across Lambda and API Gateway: use AWS X-Ray, not CloudWatch",
  ],
};
