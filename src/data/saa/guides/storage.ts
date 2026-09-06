import { ServiceGuide } from "../../../types/guide";

export const storageGuide: ServiceGuide = {
  id: "saa-storage",
  service: "Storage: EFS, FSx & Storage Gateway",
  domain: "fundamentals",
  tagline: "Shared file storage and hybrid cloud storage solutions",
  intro:
    "Beyond S3 and EBS, AWS offers managed shared file systems (EFS, FSx) and hybrid storage (Storage Gateway). The SAA-C03 exam tests choosing the right storage type for each workload scenario.",

  sections: [
    {
      heading: "Amazon EFS: Elastic File System",
      body: `EFS is a serverless NFS (Network File System) that scales automatically and can be mounted by thousands of EC2 instances simultaneously — even across AZs within a region. Unlike EBS (which attaches to one instance), EFS is shared network storage. EFS stores data redundantly across multiple AZs by default (EFS Standard) for high durability and availability.

EFS has two performance modes: **General Purpose** (low latency, suitable for web servers and content management) and **Max I/O** (higher aggregate throughput for big data and parallel workloads — slightly higher latency). Throughput modes: **Bursting** (scales with storage amount) and **Provisioned** (specify throughput independently of storage size). EFS storage classes: Standard and Standard-IA (Infrequent Access) — lifecycle policies move files to EFS-IA automatically. EFS One Zone stores data in a single AZ at lower cost (~47% cheaper than Standard).`,
      quiz: [
        {
          question:
            "A web application runs on 10 EC2 instances across 3 AZs and needs a shared file system for uploaded user content. Which storage service should be used?",
          options: [
            "Amazon EFS",
            "Amazon EBS with Multi-Attach",
            "Amazon S3",
            "Instance Store",
          ],
          correctIndex: 0,
          explanation:
            "EFS is a managed NFS file system that mounts to multiple EC2 instances simultaneously across AZs. EBS Multi-Attach (io1/io2 only) is limited to instances in the same AZ. S3 is object storage (not mountable as a file system without extra tooling). Instance Store is ephemeral and per-instance.",
        },
      ],
    },
    {
      heading: "Amazon FSx: Managed Third-Party File Systems",
      body: `FSx provides managed versions of popular file systems for workloads that require specific protocol compatibility. **FSx for Windows File Server** provides a fully managed Windows-native file system with SMB protocol, NTFS, Active Directory integration, and DFS Namespaces. Use it for Windows-based applications migrating from on-premises Windows file servers.

**FSx for Lustre** is a high-performance parallel file system for HPC, ML training, and financial modeling — sub-millisecond latency and hundreds of GB/s throughput. Lustre can be linked to S3 so data is lazily loaded from S3 on first access and results can be written back. **FSx for NetApp ONTAP** provides ONTAP's multi-protocol support (NFS, SMB, iSCSI) with storage efficiency features (deduplication, compression, tiering). **FSx for OpenZFS** provides OpenZFS-compatible file system with point-in-time snapshots and cloning.`,
      quiz: [
        {
          question:
            "A company is migrating Windows file servers to AWS. The application requires SMB protocol and Active Directory integration. Which service should be used?",
          options: [
            "Amazon FSx for Windows File Server",
            "Amazon EFS",
            "Amazon S3 with S3FS",
            "Amazon FSx for Lustre",
          ],
          correctIndex: 0,
          explanation:
            "FSx for Windows File Server is purpose-built for Windows workloads requiring SMB, NTFS, and Active Directory integration. EFS uses NFS protocol — not compatible with Windows SMB applications. Lustre is for HPC. S3FS is a workaround, not a managed service with AD integration.",
        },
      ],
    },
    {
      heading: "AWS Storage Gateway",
      body: `**Storage Gateway** is a hybrid cloud storage service that bridges on-premises environments with AWS storage. It comes in three types. **S3 File Gateway** presents S3 as an NFS or SMB file share — files written to the share are stored as S3 objects. Use for on-premises applications to seamlessly offload data to S3 while accessing it like a local file system.

**Tape Gateway** emulates a physical tape library over iSCSI — backup applications (Veeam, Veritas) write to virtual tapes that are transparently stored in S3 and S3 Glacier. This is the migration path for replacing physical tape infrastructure. **Volume Gateway** presents iSCSI block storage: in **Stored mode**, primary data is on-premises with async backups to S3 as EBS snapshots; in **Cached mode**, primary data is in S3 with a local cache of frequently accessed data.`,
      quiz: [
        {
          question:
            "A company's backup software uses iSCSI tape libraries. They want to replace physical tapes with cloud storage while keeping the same backup software. Which Storage Gateway type should be used?",
          options: [
            "Tape Gateway",
            "S3 File Gateway",
            "Volume Gateway in Stored mode",
            "Volume Gateway in Cached mode",
          ],
          correctIndex: 0,
          explanation:
            "Tape Gateway presents a virtual tape library (VTL) over iSCSI that existing backup software can use without modification. Virtual tapes are stored in S3 and automatically archived to S3 Glacier. This is the purpose-built migration path for physical tape replacement.",
        },
      ],
    },
    {
      heading: "AWS DataSync and Snow Family",
      body: `**DataSync** is an online data transfer service for moving large volumes of data between on-premises storage (NFS, SMB, HDFS, object storage) and AWS (S3, EFS, FSx). DataSync automates scheduling, transfer acceleration, integrity verification, and encryption. It can transfer up to 10 Gbps per agent and is much faster than using standard copy tools over the internet.

The **Snow Family** handles physical data migration when network transfer is impractical. **Snowball Edge Storage Optimized** (80 TB usable storage) is for large-scale data migration and edge storage. **Snowball Edge Compute Optimized** adds powerful compute (52 vCPUs, GPU option) for edge processing before data is shipped. **Snowmobile** is a 100 PB capacity shipping container on a truck for exabyte-scale migrations. Rule of thumb: if migration over your network would take more than a week, evaluate the Snow family.`,
      quiz: [
        {
          question:
            "A company needs to migrate 5 PB of on-premises data to S3. Their internet connection is 1 Gbps. Which migration approach is MOST practical?",
          options: [
            "AWS Snowmobile for exabyte-scale or multiple Snowball Edge devices",
            "AWS DataSync over the internet",
            "AWS Direct Connect with DataSync",
            "S3 Transfer Acceleration",
          ],
          correctIndex: 0,
          explanation:
            "At 1 Gbps, transferring 5 PB would take approximately 463 days — completely impractical. Multiple Snowball Edge devices (each 80 TB) allow parallel physical shipment of 5 PB, taking days instead of years. DataSync and Transfer Acceleration are bound by the same 1 Gbps link. Snowmobile handles up to 100 PB in a single shipment.",
        },
      ],
    },
  ],

  keyFacts: [
    "EFS: managed NFS, mounts to many EC2 instances across AZs simultaneously, auto-scales",
    "EFS Standard: multi-AZ redundancy. EFS One Zone: single AZ, ~47% cheaper",
    "EFS performance modes: General Purpose (low latency) vs Max I/O (high parallel throughput)",
    "FSx for Windows: SMB, NTFS, Active Directory — for Windows workloads",
    "FSx for Lustre: HPC/ML high-performance parallel file system, can be linked to S3",
    "FSx for NetApp ONTAP: multi-protocol (NFS, SMB, iSCSI), dedup, compression",
    "Storage Gateway S3 File Gateway: on-premises NFS/SMB → S3 objects",
    "Storage Gateway Tape Gateway: iSCSI VTL → S3/Glacier (replace physical tapes)",
    "Volume Gateway Stored: local primary, async S3 backup. Cached: S3 primary, local cache",
    "DataSync: online migration between on-premises and AWS, up to 10 Gbps per agent",
    "Snowball Edge: 80 TB usable. Snowmobile: 100 PB — for when network transfer takes weeks+",
  ],

  relatedServices: [
    "Amazon S3",
    "Amazon EBS",
    "Amazon EC2",
    "AWS DataSync",
    "AWS Direct Connect",
    "AWS Backup",
  ],

  examTips: [
    "EFS for shared access by multiple Linux EC2 instances. EBS for single-instance block storage",
    "For Windows SMB shares in AWS: FSx for Windows File Server — not EFS (NFS only)",
    "For HPC and ML training with S3-linked data: FSx for Lustre",
    "Storage Gateway S3 File Gateway: extends on-premises applications to use S3 transparently",
    "Tape Gateway is the answer when the question mentions backup software and iSCSI tape libraries",
    "If network migration would take > 1 week: Snow Family. If feasible over network: DataSync",
    "DataSync preserves metadata (timestamps, permissions) — important for file migration fidelity",
    "EFS lifecycle policy moves files to EFS-IA automatically — reduce cost for infrequently accessed files",
    "AWS Backup provides centralized backup across EFS, EBS, RDS, DynamoDB, FSx, and Storage Gateway",
  ],
};
