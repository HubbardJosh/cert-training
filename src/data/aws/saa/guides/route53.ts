import { ServiceGuide } from "../../../../types/guide";

export const route53Guide: ServiceGuide = {
  id: "saa-route53",
  service: "Amazon Route 53",
  domain: "fundamentals",
  tagline: "Scalable DNS, domain registration, and health-check-based routing",
  intro:
    "Route 53 is AWS's authoritative DNS service. Beyond resolving domain names, it provides health checking and multiple routing policies that enable sophisticated traffic management across regions and endpoints.",

  sections: [
    {
      heading: "DNS Record Types",
      body: `Route 53 supports standard DNS record types. **A records** map a hostname to an IPv4 address. **AAAA records** map to IPv6 addresses. **CNAME records** map a hostname to another hostname — CNAMEs cannot be used at the zone apex (the root domain like example.com). **Alias records** are Route 53-specific — they map a hostname to an AWS resource (ALB, CloudFront, S3 website, another Route 53 record) and can be used at the zone apex. Alias records are free for queries and automatically update when the underlying AWS resource's IP changes.

**NS records** identify the name servers for a hosted zone. **SOA records** contain administrative information about the zone. **MX records** route email to mail servers. **TXT records** store text information (often used for domain verification and SPF/DKIM for email). For the exam: always use Alias records (not CNAMEs) to point to AWS resources — they work at the apex and have no TTL or extra DNS lookup cost.`,
      quiz: [
        {
          question:
            "A company wants to point their root domain (example.com) to an Application Load Balancer. Which record type should they use?",
          options: [
            "Alias record pointing to the ALB",
            "CNAME record pointing to the ALB DNS name",
            "A record with the ALB's IP address",
            "NS record pointing to the ALB",
          ],
          correctIndex: 0,
          explanation:
            "CNAME records cannot be used at the zone apex (the root domain). Alias records are Route 53's solution — they can be used at the apex, are free to query, and automatically track the ALB's IP changes. A records require a static IP which ALBs don't provide.",
        },
      ],
    },
    {
      heading: "Routing Policies",
      body: `Route 53 offers several routing policies. **Simple routing** returns one or more values with no health checking — for a single resource. **Weighted routing** distributes traffic by percentage (e.g., 80% to v1, 20% to v2) — useful for blue/green deployments and A/B testing. **Latency-based routing** routes users to the region with the lowest network latency — determined by Route 53's latency database, not geolocation. **Geolocation routing** routes based on the user's geographic location (continent, country, or US state) — always configure a default policy for locations without a specific match.

**Geoproximity routing** (requires Route 53 Traffic Flow) routes based on geographic distance and allows you to shift traffic by adjusting bias values. **Failover routing** routes to a primary resource and fails over to a secondary if the primary fails health checks. **Multi-value answer routing** returns up to 8 healthy records — similar to simple routing but with health checking. It is not a replacement for a load balancer but improves availability.`,
      quiz: [
        {
          question:
            "A global application needs to route users to the AWS region that provides the fastest response time. Which Route 53 routing policy should be used?",
          options: [
            "Latency-based routing",
            "Geolocation routing",
            "Geoproximity routing",
            "Weighted routing",
          ],
          correctIndex: 0,
          explanation:
            "Latency-based routing directs users to the region with the lowest measured network latency, which correlates with fastest response time. Geolocation routes by geographic location, which doesn't always correlate with lowest latency. Geoproximity routes by physical distance. Weighted routing distributes by percentage.",
        },
      ],
    },
    {
      heading: "Health Checks and DNS Failover",
      body: `Route 53 health checkers are located in multiple AWS regions worldwide and continuously monitor the health of your endpoints. They can check HTTP, HTTPS, and TCP. For HTTP/HTTPS, they can verify a response code (2xx/3xx) and optionally check that the response body contains a specific string. Health check status affects DNS — unhealthy endpoints are removed from DNS responses until they recover.

**Calculated health checks** aggregate multiple child health checks (AND/OR logic) — useful when an endpoint is considered healthy only if all components (web server + database + cache) are healthy. **CloudWatch alarm-based health checks** mark a resource unhealthy when a CloudWatch alarm fires — useful for resources that don't have an HTTP endpoint (e.g., a database or internal service). For **private resources** in a VPC, use CloudWatch metric + alarm health checks since Route 53 health checkers can't reach private IPs.`,
      quiz: [
        {
          question:
            "A company has a primary ALB in us-east-1 and a standby ALB in us-west-2. Route 53 should automatically route traffic to us-west-2 if the us-east-1 ALB becomes unhealthy. Which routing policy achieves this?",
          options: [
            "Failover routing with health checks on both records",
            "Weighted routing with 100/0 weight split",
            "Latency-based routing between both regions",
            "Multi-value answer routing with health checking",
          ],
          correctIndex: 0,
          explanation:
            "Failover routing is specifically designed for active-passive DR. The primary record serves all traffic when healthy; Route 53 automatically switches to the secondary record when health checks detect the primary is unhealthy. Latency routing could achieve geographic routing but doesn't implement an explicit primary/secondary failover pattern.",
        },
      ],
    },
    {
      heading: "Private Hosted Zones and Resolver",
      body: `**Private hosted zones** are DNS zones that only resolve within one or more VPCs. They allow you to use custom internal domain names (e.g., database.internal.example.com) that are not publicly resolvable. Private zones require DNS resolution and DNS hostnames to be enabled in the associated VPCs. You can associate a private zone with VPCs across accounts using the CLI (not the console).

**Route 53 Resolver** is the built-in DNS resolver for VPCs. It handles queries for public domains and associated private zones. **Resolver Inbound Endpoints** allow on-premises DNS servers to forward queries to Route 53 Resolver, enabling on-premises servers to resolve AWS internal names. **Resolver Outbound Endpoints** allow VPCs to forward queries for specific domains to on-premises DNS servers — enabling EC2 instances to resolve on-premises hostnames.`,
      quiz: [
        {
          question:
            "An on-premises server needs to resolve DNS names in a Route 53 private hosted zone. What is required?",
          options: [
            "Route 53 Resolver Inbound Endpoint — forwards on-premises DNS queries to Route 53",
            "Route 53 Resolver Outbound Endpoint",
            "Direct Connect with DNS forwarding enabled",
            "A public hosted zone mirroring the private zone",
          ],
          correctIndex: 0,
          explanation:
            "Route 53 Resolver Inbound Endpoints create ENIs in a VPC that on-premises DNS servers can forward queries to. On-premises servers forward queries for the private domain to the Inbound Endpoint's IP, which then resolves using the private hosted zone. Outbound Endpoints go the other direction: VPC → on-premises.",
        },
      ],
    },
  ],

  keyFacts: [
    "Alias records can be used at the zone apex; CNAME records cannot",
    "Alias records to AWS resources: no TTL, no extra DNS lookup charge, auto-tracks IP changes",
    "Simple: one resource, no health check. Weighted: % split. Latency: lowest latency region",
    "Geolocation: by country/continent. Failover: primary/secondary with health checks",
    "Multi-value answer: up to 8 healthy records returned — not a load balancer replacement",
    "Health checkers are global — they can't reach private VPC resources (use CloudWatch alarm health checks instead)",
    "Calculated health checks: aggregate multiple child checks with AND/OR logic",
    "Private hosted zones: DNS only resolves within associated VPCs",
    "Resolver Inbound: on-premises → Route 53. Resolver Outbound: VPC → on-premises DNS",
    "Route 53 is global — 100% SLA on the DNS service",
    "Route 53 Resolver DNS Firewall: block DNS queries to known malicious domains from within a VPC",
  ],

  relatedServices: [
    "Elastic Load Balancing",
    "Amazon CloudFront",
    "AWS Global Accelerator",
    "Amazon VPC",
    "AWS Direct Connect",
    "AWS Health",
  ],

  examTips: [
    "CNAME cannot be used at the root domain apex — always use Alias for example.com pointing to AWS resources",
    "Latency routing ≠ geolocation routing — latency is based on network performance, not physical location",
    "For active-passive DR between regions: Failover routing policy with health checks",
    "For zero-downtime blue/green deployments: Weighted routing (shift traffic gradually)",
    "Health checks can't reach private VPCs — use CloudWatch alarm-based health checks for private resources",
    "TTL: shorter TTL = faster propagation during failover but more DNS queries (higher cost). Longer TTL = cheaper, slower failover",
    "Route 53 Resolver Endpoints require Direct Connect or VPN to the on-premises network",
    "Geoproximity bias values: positive bias attracts more traffic, negative repels — requires Traffic Flow feature",
    "For SOA-mandated 'route by country for compliance': Geolocation routing with a default catch-all",
    "For planned failovers, lower the TTL of the DNS record days in advance to speed up propagation when you switch endpoints",
    "Weighted routing with weight=0 stops all traffic to that endpoint without removing the record — useful for maintenance windows",
  ],
};
