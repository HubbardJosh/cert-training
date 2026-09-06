import { ServiceGuide } from "../../../../types/guide";

export const vpcGuide: ServiceGuide = {
  id: "saa-vpc",
  service: "Amazon VPC",
  domain: "security",
  tagline:
    "Isolated virtual network — your own private section of the AWS cloud",
  intro:
    "A VPC is a logically isolated network you define in AWS. You control IP addressing, subnets, route tables, gateways, and security layers. Every resource in AWS runs inside a VPC.",

  sections: [
    {
      heading: "VPC Fundamentals: CIDR, Subnets, and AZs",
      body: `A VPC spans all AZs in a region and is defined by a CIDR block (e.g., 10.0.0.0/16). Within the VPC you create **subnets** — each subnet lives in exactly one AZ. A **public subnet** has a route to an IGW; a **private subnet** does not. Instances in private subnets can still reach the internet outbound via a NAT gateway (IPv4) or egress-only IGW (IPv6).

AWS reserves 5 IP addresses per subnet: the network address, VPC router, DNS server, future use, and broadcast address. A /28 subnet (16 addresses minus 5 reserved = 11 usable) is the smallest allowed. Subnets in the same VPC can communicate by default because the local route in every route table allows traffic within the VPC CIDR.`,
      quiz: [
        {
          question:
            "How many IP addresses are usable in a /28 subnet in a VPC?",
          options: ["11", "14", "16", "13"],
          correctIndex: 0,
          explanation:
            "A /28 has 16 total addresses. AWS reserves 5 per subnet (network, router, DNS, future use, broadcast), leaving 11 usable. This is a common exam gotcha — always subtract 5 from the subnet size.",
        },
      ],
    },
    {
      heading: "Internet Gateway and NAT Gateway",
      body: `An **IGW** is a horizontally-scaled, redundant VPC component that provides internet connectivity for public subnets. For an instance to be reachable from the internet it needs: an IGW attached to the VPC, a route to the IGW in its subnet's route table, and a public IP or Elastic IP. An IGW also performs NAT for instances with public IPs.

A **NAT Gateway** is a managed, highly available service that lets private subnet instances initiate outbound internet connections while blocking unsolicited inbound traffic. NAT Gateways are created in a public subnet and are AZ-specific — for high availability you should deploy one per AZ. NAT Instances (legacy, EC2-based) require you to disable source/destination checks and manage them yourself; they do not scale automatically and are not recommended for new architectures.`,
      quiz: [
        {
          question:
            "A private subnet EC2 instance needs to download software updates from the internet. What is required?",
          options: [
            "A NAT Gateway in a public subnet with a route from the private subnet to the NAT Gateway",
            "An Internet Gateway attached directly to the private subnet",
            "A public IP address assigned to the private subnet instance",
            "A VPC endpoint for the software repository",
          ],
          correctIndex: 0,
          explanation:
            "Private subnet instances route outbound internet traffic through a NAT Gateway (placed in a public subnet). The private subnet's route table sends 0.0.0.0/0 to the NAT Gateway, which then forwards traffic to the IGW. The private instance never gets a public IP.",
        },
      ],
    },
    {
      heading: "Security Groups vs. Network ACLs",
      body: `**Security Groups** are stateful, instance-level firewalls. Stateful means if outbound traffic is allowed, the return traffic is automatically allowed — you only write rules for the direction you initiate. Security groups have only Allow rules; you cannot write an explicit Deny. All outbound traffic is allowed by default; all inbound traffic is denied by default.

**NACLs** are stateless, subnet-level firewalls. Stateless means you must write explicit rules for both directions (inbound and outbound). NACLs support both Allow and Deny rules and evaluate rules in numbered order (lowest number first), stopping at the first match. The default NACL allows all traffic; a custom NACL denies all traffic by default. Use NACLs to block specific IP addresses — something security groups cannot do.`,
      quiz: [
        {
          question:
            "A security team needs to block a specific IP address from reaching any resource in a subnet. Which service should they use?",
          options: [
            "Network ACL with a Deny rule for that IP address",
            "Security Group with a Deny rule for that IP address",
            "Route table with a blackhole route for that IP",
            "AWS WAF with an IP match rule",
          ],
          correctIndex: 0,
          explanation:
            "Security groups only support Allow rules — you cannot explicitly deny an IP with a security group. NACLs support Deny rules and apply at the subnet level, making them the right tool to block a specific IP address for all resources in that subnet.",
        },
      ],
    },
    {
      heading: "VPC Peering",
      body: `**VPC Peering** creates a direct, private network connection between two VPCs (same or different accounts, same or different regions). Traffic stays on the AWS backbone and never traverses the public internet. Peering connections are non-transitive — if VPC A peers with VPC B and VPC B peers with VPC C, VPC A cannot reach VPC C through VPC B. You must create a direct peering connection for each pair.

For peering to work, both VPCs must have non-overlapping CIDR blocks, both route tables must have routes pointing to the peering connection, and security groups must allow the traffic. Cross-region peering has additional considerations around data transfer costs.`,
      quiz: [
        {
          question:
            "VPC A peers with VPC B, and VPC B peers with VPC C. Can VPC A communicate with VPC C?",
          options: [
            "No — VPC peering is non-transitive",
            "Yes — traffic routes through VPC B automatically",
            "Yes — if VPC B has the correct route tables",
            "No — cross-VPC routing requires Transit Gateway",
          ],
          correctIndex: 0,
          explanation:
            "VPC peering is non-transitive. Even if VPC B is peered with both A and C, A cannot reach C through B. Each pair of VPCs that needs to communicate requires its own peering connection, or you should use Transit Gateway for hub-and-spoke connectivity.",
        },
      ],
    },
    {
      heading: "Transit Gateway",
      body: `**TGW** is a regional, highly available network hub that connects VPCs and on-premises networks in a hub-and-spoke model. Instead of a full mesh of peering connections (which doesn't scale), each VPC attaches to the TGW once, and the TGW routes traffic between them. TGW supports transitive routing, making it the solution whenever you need many VPCs to communicate or need to connect VPCs to a central on-premises network.

TGW supports multiple **route tables** so you can segment traffic — for example, keeping production VPCs isolated from dev VPCs by placing them in different TGW route tables with no routes between them. TGW can also be shared across accounts using AWS Resource Access Manager (RAM).`,
      quiz: [
        {
          question:
            "A company has 20 VPCs that all need to communicate with each other and with an on-premises network over Direct Connect. What is the MOST scalable architecture?",
          options: [
            "Transit Gateway attached to all VPCs and the Direct Connect gateway",
            "Full-mesh VPC peering between all 20 VPCs",
            "A centralized VPC with peering connections to all other VPCs",
            "VPN connections from each VPC to the on-premises network",
          ],
          correctIndex: 0,
          explanation:
            "Transit Gateway is the scalable hub-and-spoke solution. Full-mesh peering would require 190 peering connections (n*(n-1)/2) and is non-transitive, making it unmanageable. TGW supports transitive routing and connects to Direct Connect gateways for on-premises access.",
        },
      ],
    },
    {
      heading: "VPC Endpoints",
      body: `**VPC Endpoints** allow instances in a private subnet to access AWS services without routing traffic through the internet, NAT Gateway, or Direct Connect. There are two types. **Interface endpoints** (powered by PrivateLink) create an ENI in your subnet with a private IP that proxies traffic to the service — they support most AWS services and many third-party services. **Gateway endpoints** modify route tables to redirect traffic for S3 and DynamoDB to the AWS backbone — they are free and do not use an ENI.

Use gateway endpoints for S3 and DynamoDB (free, route-table based). Use interface endpoints for all other services (KMS, SSM, Secrets Manager, SQS, etc.) when you need private connectivity without a NAT Gateway.`,
      quiz: [
        {
          question:
            "A private EC2 instance needs to access S3 without going through a NAT Gateway. What is the MOST cost-effective solution?",
          options: [
            "Create a Gateway VPC Endpoint for S3",
            "Create an Interface VPC Endpoint for S3",
            "Assign a public IP to the EC2 instance",
            "Deploy a NAT Gateway in the same subnet",
          ],
          correctIndex: 0,
          explanation:
            "Gateway VPC Endpoints for S3 and DynamoDB are free and route traffic to AWS services via the AWS backbone by adding a route to the subnet route table. Interface endpoints use an ENI and incur hourly charges — gateway endpoints are the cost-effective choice for S3.",
        },
      ],
    },
    {
      heading: "VPN and Direct Connect",
      body: `**AWS Site-to-Site VPN** connects an on-premises network to a VPC over the internet using IPSec. It's quick to set up (minutes), encrypted, and suitable for lower-bandwidth or backup connectivity. Each VPN connection has two tunnels for redundancy. VPN terminates on a VGW or TGW in the AWS side and a customer gateway device on-premises.

**AWS Direct Connect** is a dedicated, private network connection from your data center to an AWS Direct Connect location. It provides consistent latency, higher bandwidth (1 Gbps to 100 Gbps), and lower data transfer costs than internet-based connectivity. Direct Connect is not encrypted by default — you can run a VPN over Direct Connect for encryption. Direct Connect setup takes weeks, so VPN is often used as a backup.`,
      quiz: [
        {
          question:
            "A company needs a consistent, low-latency connection between its data center and AWS for a latency-sensitive financial application. Which connectivity option should they choose?",
          options: [
            "AWS Direct Connect",
            "Site-to-Site VPN over the internet",
            "Client VPN",
            "VPC Peering",
          ],
          correctIndex: 0,
          explanation:
            "Direct Connect provides a dedicated private connection with consistent latency because traffic does not traverse the public internet. Site-to-Site VPN uses the internet, which introduces variable latency. VPC Peering connects VPCs to each other, not on-premises. Client VPN is for individual user access.",
        },
      ],
    },
    {
      heading: "Flow Logs and Network Monitoring",
      body: `**VPC Flow Logs** capture metadata about IP traffic flowing through VPC network interfaces, subnets, or the entire VPC. Logs record source IP, destination IP, port, protocol, bytes, packets, and whether the traffic was accepted or rejected. Flow logs are stored in CloudWatch Logs or S3 and are used for security analysis, troubleshooting, and compliance.

Flow logs do NOT capture traffic to the EC2 metadata service (169.254.169.254), traffic for Amazon DNS (if you use the VPC resolver), DHCP traffic, or traffic for the Windows license activation server. Flow log records show the disposition (ACCEPT or REJECT) based on security group and NACL decisions, helping you diagnose connectivity issues.`,
      quiz: [
        {
          question:
            "A security team wants to investigate why traffic from a specific IP address was blocked. Which AWS feature provides the traffic accept/reject decision at the network level?",
          options: [
            "VPC Flow Logs",
            "CloudTrail",
            "AWS Config",
            "Amazon GuardDuty",
          ],
          correctIndex: 0,
          explanation:
            "VPC Flow Logs capture IP traffic metadata including whether each flow was ACCEPT or REJECT based on security group and NACL rules. CloudTrail records API calls. AWS Config tracks resource configuration. GuardDuty analyzes flow logs for threats but doesn't let you inspect individual connection decisions.",
        },
      ],
    },
  ],

  keyFacts: [
    "AWS reserves 5 IP addresses per subnet — always subtract 5 when calculating usable IPs",
    "Public subnet = subnet with a route to an IGW; private subnet has no such route",
    "NAT Gateways are AZ-specific — deploy one per AZ for high availability",
    "Security groups are stateful (return traffic auto-allowed); NACLs are stateless",
    "Security groups support Allow only; NACLs support Allow and Deny",
    "NACLs evaluate rules in ascending number order and stop at first match",
    "VPC peering is non-transitive — use Transit Gateway for hub-and-spoke",
    "Gateway endpoints (S3, DynamoDB) are free and route-table based",
    "Interface endpoints use ENIs and incur hourly costs — use for most other AWS services",
    "Direct Connect is dedicated and private but not encrypted by default",
    "Site-to-Site VPN uses IPSec encryption over the internet — quick to set up",
    "VPC Flow Logs capture accept/reject decisions — stored in CloudWatch or S3",
    "The default VPC has a public subnet in every AZ with internet connectivity pre-configured",
    "VPC sharing via AWS RAM: share subnets across accounts in the same AWS Organization — avoids VPC peering for multi-account architectures",
  ],

  relatedServices: [
    "AWS Transit Gateway",
    "AWS Direct Connect",
    "AWS PrivateLink",
    "Amazon Route 53",
    "Elastic Load Balancing",
    "AWS WAF",
    "Amazon CloudFront",
  ],

  examTips: [
    "When the question mentions 'non-transitive routing' or many VPCs communicating, the answer is Transit Gateway",
    "NACLs are the only way to explicitly DENY traffic from a specific IP — security groups cannot deny",
    "For private instances accessing S3/DynamoDB: Gateway Endpoint (free). For other services: Interface Endpoint",
    "NAT Gateway is managed and HA within an AZ; NAT Instance requires disabling source/destination checks",
    "VPN + Direct Connect: VPN is backup (faster setup, internet-based); Direct Connect is primary (dedicated, consistent latency)",
    "Direct Connect requires additional VPN overlay if encryption in transit is required",
    "Egress-only IGW is IPv6-only — for IPv4 outbound from private subnets, use NAT Gateway",
    "Security groups reference other security groups by ID — this is cleaner than IP-based rules for EC2-to-EC2 within a VPC",
    "A VPC can have up to 5 CIDR blocks associated with it",
    "Overlapping CIDRs prevent VPC peering — this is a frequent trap in exam scenarios",
    "PrivateLink service provider pattern: expose your service via an NLB to other VPCs/accounts — consumers access it via Interface Endpoints without VPC peering",
    "Moving an ENI (with Elastic IP) to a replacement instance is a failover pattern for HA without DNS TTL delays",
  ],
};
