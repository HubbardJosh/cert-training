import { ServiceGuide } from "../../../types/guide";

export const elbGuide: ServiceGuide = {
  id: "saa-elb",
  service: "Elastic Load Balancing",
  domain: "fundamentals",
  tagline:
    "Distribute traffic across targets for high availability and scalability",
  intro:
    "ELB automatically distributes incoming traffic across multiple targets (EC2 instances, containers, Lambda, IP addresses). AWS offers four load balancer types: ALB (Layer 7), NLB (Layer 4), GLB (Layer 3), and the legacy Classic LB.",

  sections: [
    {
      heading: "ALB: Application Load Balancer",
      body: `ALB operates at Layer 7 (HTTP/HTTPS/WebSocket) and provides intelligent routing based on request content. **Path-based routing** sends /api/* to one target group and /images/* to another. **Host-based routing** routes based on the Host header (e.g., api.example.com vs app.example.com). **Header and query string routing** enables blue/green deployments and A/B testing. ALB supports **sticky sessions** using application-based or duration-based cookies to route returning users to the same target.

ALB natively integrates with AWS WAF for Layer 7 protection, AWS Cognito for authentication, and ACM for TLS termination. ALB can route to EC2 instances, ECS containers (using dynamic port mapping), Lambda functions, and IP addresses. For containers, ECS registers targets with the ALB automatically using task metadata.`,
      quiz: [
        {
          question:
            "A web application has separate backend services for /api/* and /static/* paths. How should traffic routing be configured?",
          options: [
            "ALB with path-based routing rules to two target groups",
            "NLB with path-based routing rules",
            "Two separate ALBs — one per path prefix",
            "Route 53 weighted routing with two ALBs",
          ],
          correctIndex: 0,
          explanation:
            "ALB supports path-based routing — you define listener rules that match URL paths and forward to different target groups. NLB is Layer 4 only and cannot inspect HTTP paths. A single ALB with multiple target groups is the most cost-effective and correct solution.",
        },
      ],
    },
    {
      heading: "NLB: Network Load Balancer",
      body: `NLB operates at Layer 4 (TCP/UDP/TLS) and is designed for extreme performance: it handles millions of requests per second with ultra-low latency (~100ms vs ALB's ~400ms). NLB preserves the client's source IP address (ALB replaces it with its own IP). NLB assigns static IP addresses per AZ (or Elastic IPs), making it suitable for applications that whitelist specific IP addresses.

NLB supports TLS termination and can use ACM certificates. NLB targets can be EC2 instances, IP addresses (including on-premises servers), or ALBs (NLB in front of ALB pattern). Use NLB for: non-HTTP protocols (TCP, UDP), applications requiring source IP preservation, extreme throughput requirements, or when you need static IPs. NLB does not support HTTP/HTTPS-based health checks natively — it uses TCP/HTTP/HTTPS health checks.`,
      quiz: [
        {
          question:
            "A financial trading application requires the lowest possible latency and processes non-HTTP TCP traffic. The client's source IP must be visible to the backend. Which load balancer should be used?",
          options: [
            "Network Load Balancer",
            "Application Load Balancer",
            "Gateway Load Balancer",
            "Classic Load Balancer",
          ],
          correctIndex: 0,
          explanation:
            "NLB is the correct choice for non-HTTP TCP traffic requiring ultra-low latency. NLB also preserves the client source IP, making it visible to backend instances. ALB is HTTP/HTTPS only and replaces the source IP with its own. NLB's connection-based latency (~100ms) is significantly lower than ALB's (~400ms).",
        },
      ],
    },
    {
      heading: "GLB: Gateway Load Balancer",
      body: `**GLB** operates at Layer 3 (network layer) and is designed to deploy, scale, and manage fleets of inline network appliances — firewalls, intrusion detection systems, deep packet inspection tools, and other third-party security appliances. GLB uses the GENEVE protocol to encapsulate traffic and send it to appliances while maintaining the original packet headers.

GLB acts as a single entry/exit point for all traffic. It distributes traffic to your appliances, which inspect/process it, and then returns traffic to the GLB for forwarding. GLB is invisible to the application — it doesn't change the source/destination IP. Use GLB when you need to run all traffic through security appliances (NGFW, IDS/IPS) before reaching your application.`,
      quiz: [
        {
          question:
            "A company needs to inspect all inbound and outbound VPC traffic through a third-party firewall appliance fleet that scales based on load. Which load balancer type enables this?",
          options: [
            "Gateway Load Balancer",
            "Network Load Balancer with firewall instances as targets",
            "Application Load Balancer with WAF enabled",
            "AWS Network Firewall",
          ],
          correctIndex: 0,
          explanation:
            "GLB is purpose-built for inline network appliance fleets. It transparently routes all traffic through registered appliances (firewall VMs, IDS, etc.) using GENEVE encapsulation, without the application knowing traffic was inspected. NLB can't do inline transparent inspection. WAF is application-layer only.",
        },
      ],
    },
    {
      heading: "Target Groups and Health Checks",
      body: `Each load balancer routes traffic to one or more **target groups**. A target group contains registered targets (instances, IP addresses, or Lambda functions) and defines the health check configuration. Health checks run at configurable intervals and thresholds. An unhealthy target is removed from rotation until it passes the configured number of consecutive successful health checks.

Health check settings: **interval** (how often to check), **timeout** (response wait time), **healthy threshold** (consecutive successes to mark healthy), **unhealthy threshold** (consecutive failures to mark unhealthy). ALB health checks can use HTTP/HTTPS and check a specific path (e.g., /health). Targets must return a 200-299 HTTP status to be considered healthy. Use connection draining (deregistration delay) to allow in-flight requests to complete before a target is removed from rotation.`,
      quiz: [
        {
          question:
            "An ALB is routing traffic to an unhealthy EC2 instance. The health check path is /health and the instance is returning 500 errors. After fixing the application, how does the instance return to rotation?",
          options: [
            "After passing the configured number of consecutive healthy health checks",
            "Immediately after the health check returns 200 once",
            "Only after manually re-registering the instance in the target group",
            "After the ASG replaces the unhealthy instance with a new one",
          ],
          correctIndex: 0,
          explanation:
            "ALB marks an instance healthy again only after it passes the configured number of consecutive successful health checks (healthy threshold, default 5). A single successful check doesn't immediately restore traffic — this prevents flapping when an instance is intermittently healthy.",
        },
      ],
    },
    {
      heading: "SSL/TLS Termination and SNI",
      body: `Load balancers can terminate TLS, decrypting HTTPS traffic before forwarding to targets as HTTP. This offloads CPU-intensive decryption from backend instances and centralizes certificate management. ACM provides free, auto-renewing certificates for use with ALB and NLB. **Server Name Indication (SNI)** allows a single ALB listener to host multiple TLS certificates — the ALB selects the appropriate certificate based on the hostname in the TLS handshake. This enables hosting multiple HTTPS domains on a single ALB.

For end-to-end encryption (not just termination), configure the target group to use HTTPS and ensure instances have their own certificates. For pass-through encryption where the load balancer does not decrypt, use NLB with TCP listeners — the TLS is terminated at the instance level, and the load balancer cannot inspect the payload.`,
      quiz: [
        {
          question:
            "An ALB needs to host 10 different HTTPS domains on a single listener. How can this be achieved?",
          options: [
            "Add multiple TLS certificates to the ALB listener — SNI selects the correct certificate",
            "Create a separate ALB per domain",
            "Use wildcard certificates for all 10 domains",
            "Configure NLB with TLS pass-through to backend instances",
          ],
          correctIndex: 0,
          explanation:
            "ALB supports SNI, allowing multiple TLS certificates to be attached to a single listener. When a client connects, ALB reads the hostname in the TLS handshake and selects the matching certificate. This is far more cost-effective than one ALB per domain.",
        },
      ],
    },
  ],

  keyFacts: [
    "ALB: Layer 7 — HTTP/HTTPS, path/host/header routing, WAF integration, Cognito auth",
    "NLB: Layer 4 — TCP/UDP, ultra-low latency, static IPs, source IP preservation",
    "GLB: Layer 3 — transparent inline appliance routing via GENEVE protocol",
    "ALB supports Lambda as a target; NLB and GLB do not",
    "Connection draining (deregistration delay): allows in-flight requests to complete before removing a target",
    "ALB sticky sessions: application-based (AWSALBAPP cookie) or duration-based (AWSALB cookie)",
    "SNI: multiple TLS certificates on one ALB listener — selected based on hostname",
    "NLB provides static Elastic IPs per AZ — useful for IP whitelisting",
    "Health check: unhealthy threshold consecutive failures → remove from rotation",
    "ALB X-Forwarded-For header contains the original client IP (since ALB replaces source IP)",
  ],

  relatedServices: [
    "Amazon EC2 Auto Scaling",
    "AWS WAF",
    "AWS ACM",
    "Amazon ECS",
    "Amazon Route 53",
    "AWS Global Accelerator",
  ],

  examTips: [
    "ALB = HTTP/HTTPS, content-based routing. NLB = TCP/UDP, extreme performance, static IPs",
    "NLB preserves client source IP; ALB uses X-Forwarded-For header instead",
    "For firewall appliances inline: Gateway Load Balancer — not NLB or WAF",
    "For WebSocket or HTTP/2: use ALB (NLB supports TCP but not HTTP-aware routing)",
    "Sticky sessions cause uneven load distribution — enable only when session affinity is required",
    "NLB health checks include HTTP support but lack ALB's flexible path-based HTTP health checks",
    "ALB can authenticate users with Cognito or OIDC before forwarding to targets",
    "Cross-zone load balancing: ALB has it enabled by default (no charge); NLB disabled by default (data transfer charge if enabled)",
    "Access logs for ALB store detailed request information in S3 — useful for compliance and debugging",
  ],
};
