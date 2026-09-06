import { ServiceGuide } from "../../../types/guide";

export const cloudfrontGuide: ServiceGuide = {
  id: "saa-cloudfront",
  service: "Amazon CloudFront",
  domain: "fundamentals",
  tagline:
    "Global CDN that serves content from 450+ edge locations with low latency",
  intro:
    "CloudFront is AWS's CDN. It caches content at edge locations around the world, reducing latency for end users and offloading origin servers. CloudFront integrates natively with S3, ALB, EC2, Lambda@Edge, and custom HTTP origins.",

  sections: [
    {
      heading: "Origins, Distributions, and Behaviors",
      body: `A CloudFront **distribution** is the configuration for how content is served. Each distribution has one or more **origins** — the source of content. Supported origins: S3 buckets, ALBs, EC2 instances, API Gateway, and any custom HTTP server. **Cache behaviors** define rules for how CloudFront handles requests to specific URL path patterns. You can forward headers, cookies, and query strings to the origin, and cache responses based on those values.

The **default cache behavior** matches all paths. Additional behaviors with specific path patterns (e.g., /api/*) take precedence over the default. Use behaviors to serve static files from S3 (cached) and dynamic API calls from ALB (not cached) from the same domain. This enables a single HTTPS domain to serve both static assets and a dynamic backend without CORS complexity.`,
      quiz: [
        {
          question:
            "A CloudFront distribution serves both static files from S3 (cached) and dynamic API calls from an ALB (not cached). How should this be configured?",
          options: [
            "Two cache behaviors: /api/* forwarding to ALB with caching disabled, /* to S3",
            "Two separate CloudFront distributions",
            "One behavior forwarding all traffic to ALB which proxies to S3",
            "Route 53 weighted routing between S3 and ALB",
          ],
          correctIndex: 0,
          explanation:
            "Multiple cache behaviors on a single distribution handle this elegantly. The /api/* behavior routes to ALB with TTL=0 (no caching). The default /* behavior routes to S3 with appropriate caching. Both serve from the same CloudFront domain, eliminating CORS and simplifying TLS management.",
        },
      ],
    },
    {
      heading: "Caching and Cache Invalidation",
      body: `CloudFront caches content at edge locations based on the **TTL** configured in cache behaviors or the origin's Cache-Control headers. The default TTL is 24 hours. **Minimum TTL** and **maximum TTL** bound the range. Setting TTL to 0 disables caching for that behavior (still sends requests to origin but can cache 304 Not Modified responses). Use **Cache-Control: max-age** headers from the origin to control caching at the edge.

**Cache invalidation** removes cached objects before the TTL expires. You can invalidate specific paths (e.g., /images/logo.png) or wildcard patterns (e.g., /images/*). Invalidations have an associated cost (first 1,000 paths/month free, then charged per path). A better strategy is **cache busting**: embed a version identifier in the file name or query string (e.g., app.js?v=2 or app-v2.js) so the old cached version and the new version coexist without invalidation.`,
      quiz: [
        {
          question:
            "A team frequently deploys updates to JavaScript files behind CloudFront. They want to avoid the cost and delay of cache invalidation. What is the BEST strategy?",
          options: [
            "Use versioned file names (e.g., app-v2.js) so new deployments are new cache entries",
            "Set the CloudFront TTL to 0 for all JavaScript files",
            "Run a cache invalidation after every deployment",
            "Disable CloudFront caching for the JavaScript files behavior",
          ],
          correctIndex: 0,
          explanation:
            "Cache busting with versioned file names is the recommended approach. When you deploy app-v2.js, it's a new cache key — CloudFront fetches it fresh while app-v1.js (if still referenced) remains cached. This eliminates invalidation costs and race conditions. Setting TTL to 0 defeats the purpose of a CDN.",
        },
      ],
    },
    {
      heading: "CloudFront and S3 Origin Access Control",
      body: `To serve S3 content exclusively through CloudFront (keeping the bucket private), use **Origin Access Control (OAC)**, the modern replacement for the legacy Origin Access Identity (OAI). With OAC, CloudFront signs requests to S3 using SigV4. The S3 bucket policy grants access only to the CloudFront distribution's OAC — users cannot access S3 directly via the bucket URL.

OAC supports all S3 API operations including SSE-KMS encrypted objects (OAI could not access KMS-encrypted objects). When users request HTTPS content, CloudFront uses its own certificate (from ACM in us-east-1) for the TLS connection to the user. The S3 origin uses a separate internal connection. Always use OAC for S3-backed CloudFront distributions to enforce access through CloudFront only.`,
      quiz: [
        {
          question:
            "A company hosts a private S3 website behind CloudFront. Users should only access content through CloudFront, never directly from S3. How is this enforced?",
          options: [
            "Configure Origin Access Control (OAC) and update the S3 bucket policy to allow only CloudFront",
            "Enable S3 Block Public Access and create a bucket policy allowing public access to /public/*",
            "Configure the CloudFront distribution to require HTTPS from users",
            "Enable S3 versioning and restrict access using S3 Object Lock",
          ],
          correctIndex: 0,
          explanation:
            "OAC restricts S3 bucket access exclusively to the CloudFront distribution. The S3 bucket policy allows only the OAC principal, and Block Public Access prevents direct bucket access. Users who try to access S3 directly receive an Access Denied response — all traffic must go through CloudFront.",
        },
      ],
    },
    {
      heading: "CloudFront Security: WAF, Geo-Restriction, and Signed URLs",
      body: `**WAF** can be attached to a CloudFront distribution to filter HTTP requests before they reach the origin. WAF rules can block SQL injection, XSS, bad bots, and specific IP ranges at the edge — requests are dropped at the nearest PoP rather than reaching the origin or backend. **Geo-restriction** allows or blocks viewers from specific countries based on the client's IP geolocation — simpler than WAF, no per-request charge.

**Signed URLs** grant temporary, pre-authenticated access to a single specific object (file). Use signed URLs when you need to share private S3 content securely (video streaming, downloadable files). **Signed cookies** grant temporary access to multiple objects and work better when you don't want to change URLs. Both use either CloudFront key pairs (legacy) or CloudFront key groups (recommended). The URL includes an expiration time and a signature — tampered or expired URLs are rejected at the edge.`,
      quiz: [
        {
          question:
            "A video streaming service wants to allow paying subscribers to access videos through CloudFront for 24 hours after purchase. Non-subscribers should be blocked. What is the BEST approach?",
          options: [
            "CloudFront signed cookies granting access to /videos/* for 24 hours",
            "CloudFront signed URLs for each individual video file",
            "S3 pre-signed URLs shared directly with subscribers",
            "An ALB with Cognito authentication in front of S3",
          ],
          correctIndex: 0,
          explanation:
            "Signed cookies grant time-limited access to multiple resources (all videos in /videos/*) without changing any URLs. Signed URLs work per-file — awkward for a streaming service with many segments and quality levels. S3 pre-signed URLs bypass CloudFront caching and expose S3 directly.",
        },
      ],
    },
    {
      heading: "Lambda@Edge and CloudFront Functions",
      body: `**Lambda@Edge** runs Lambda functions at CloudFront edge locations in response to viewer requests and responses. It can inspect and modify HTTP headers, redirect requests, authenticate users, and route traffic — all at the edge before reaching the origin. Lambda@Edge supports viewer request, viewer response, origin request, and origin response events. It requires functions to be deployed in us-east-1 and replicated to edge locations automatically.

**CloudFront Functions** are lightweight JavaScript functions that run at all 450+ edge locations with sub-millisecond execution. They handle viewer request and viewer response events only. Use CloudFront Functions for simple header manipulation, URL rewrites, and query string normalization. Use Lambda@Edge for complex logic, larger packages, longer execution time, or access to AWS services. CloudFront Functions cost significantly less than Lambda@Edge.`,
      quiz: [
        {
          question:
            "A developer needs to inspect the Authorization header at the edge and return a 403 if the token is invalid, without the request ever reaching the origin. The logic is simple JWT validation taking under 1ms. Which is the MOST cost-effective solution?",
          options: [
            "CloudFront Functions",
            "Lambda@Edge",
            "A Lambda function behind an API Gateway",
            "An ALB with Cognito authentication",
          ],
          correctIndex: 0,
          explanation:
            "CloudFront Functions are purpose-built for lightweight edge logic like header inspection and simple token validation. They execute at all edge locations, cost much less than Lambda@Edge, and have sub-millisecond execution. Lambda@Edge supports more complex use cases but at higher cost and with higher overhead.",
        },
      ],
    },
  ],

  keyFacts: [
    "CloudFront has 450+ edge locations globally — content served from the closest PoP",
    "Default TTL: 24 hours. TTL=0 disables edge caching but still sends to origin",
    "OAC (Origin Access Control) is the modern way to restrict S3 access to CloudFront only",
    "Cache invalidation: first 1,000 paths/month free, then per-path charge",
    "Cache busting (versioned file names) is cheaper and faster than cache invalidation",
    "Signed URLs: single object, time-limited access. Signed cookies: multiple objects",
    "WAF attached to CloudFront blocks bad traffic at the edge — before it reaches the origin",
    "Geo-restriction: allow/block by country — no per-request charge, simpler than WAF rules",
    "Lambda@Edge: 4 event types (viewer req/res, origin req/res). CloudFront Functions: viewer req/res only",
    "CloudFront Functions: sub-ms, simple JS logic, much cheaper. Lambda@Edge: complex logic, longer runtime",
    "ACM certificates for CloudFront must be in us-east-1 (global service requirement)",
    "HTTPS between viewers and CloudFront uses ACM certificate; HTTP or HTTPS to origin is configurable",
  ],

  relatedServices: [
    "Amazon S3",
    "AWS WAF",
    "AWS Lambda",
    "ACM",
    "Amazon Route 53",
    "AWS Global Accelerator",
    "API Gateway",
  ],

  examTips: [
    "CloudFront improves latency; Global Accelerator improves latency for non-HTTP and dynamic content with static IPs",
    "For private S3 content through CloudFront: OAC (not OAI — OAI is legacy)",
    "CloudFront Functions for URL rewrites and simple header manipulation; Lambda@Edge for complex business logic",
    "ACM cert for CloudFront must be in us-east-1 regardless of where the origin is",
    "CloudFront geo-restriction is country-level only — WAF for more granular IP/request-level blocking",
    "Signed cookies > signed URLs when you need to grant access to multiple files (e.g., video HLS segments)",
    "CloudFront can front a non-AWS origin (custom HTTP server) — CloudFront manages TLS and global edge caching",
    "Price classes let you restrict which edge locations are used to reduce cost",
    "CloudFront access logs can be sent to S3 for analysis — useful for security and usage reporting",
  ],
};
