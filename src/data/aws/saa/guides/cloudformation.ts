import { ServiceGuide } from "../../../../types/guide";

export const cloudformationGuide: ServiceGuide = {
  id: "saa-cloudformation",
  service: "AWS CloudFormation",
  domain: "deployment",
  tagline:
    "Infrastructure as Code — model and provision AWS resources with templates",
  intro:
    "CloudFormation lets you define AWS infrastructure in JSON or YAML templates. It provisions and manages resources as a stack, enabling repeatable, version-controlled infrastructure deployments across accounts and regions.",

  sections: [
    {
      heading: "Template Structure",
      body: `A CloudFormation template has several sections. **AWSTemplateFormatVersion** declares the template version (always 2010-09-09). **Description** is a human-readable string. **Parameters** accept input values at stack creation — enabling reusable templates across environments (dev, staging, prod). **Mappings** are static key-value lookup tables (e.g., AMI IDs per region). **Conditions** allow conditional resource creation based on parameter values or environment (e.g., create a backup bucket only in production). **Resources** is the only required section — it defines every AWS resource to create. **Outputs** export values that other stacks can import.

The \`!Ref\` intrinsic function references a parameter, resource logical ID, or pseudo-parameter. \`!Sub\` substitutes variables in strings. \`!GetAtt\` retrieves an attribute from a resource (e.g., \`!GetAtt MyBucket.Arn\`). \`!ImportValue\` retrieves an exported output from another stack.`,
      quiz: [
        {
          question:
            "A CloudFormation template needs to create an S3 bucket only when deploying to the production environment. Which template section enables this?",
          options: ["Conditions", "Mappings", "Parameters", "Outputs"],
          correctIndex: 0,
          explanation:
            "Conditions define logical conditions (e.g., IsProduction) based on parameter values. Resources and outputs can then reference conditions to be created or exported only when the condition is true. Mappings are static lookup tables. Parameters accept input but don't control resource creation on their own.",
        },
      ],
    },
    {
      heading: "Stacks, Change Sets, and Drift Detection",
      body: `A **stack** is a collection of AWS resources managed as a single unit. Creating a stack provisions all resources; deleting a stack destroys them all (unless DeletionPolicy is set to Retain or Snapshot). **Change sets** let you preview the changes CloudFormation will make before executing — critical for production changes. CloudFormation shows which resources will be added, modified, or replaced and whether a replacement will cause downtime.

**Stack drift detection** identifies resources whose actual configuration has diverged from the template definition due to manual changes outside CloudFormation. Drift detection is not real-time — you run it on demand. Resources with drift show as \`DRIFTED\` and specify what changed. Regularly running drift detection helps maintain IaC discipline and detect unauthorized configuration changes.`,
      quiz: [
        {
          question:
            "A team wants to update a production CloudFormation stack but needs to see exactly what will change before executing. What should they use?",
          options: [
            "Create a Change Set to preview the changes before executing",
            "Use the CloudFormation drift detection feature",
            "Deploy to staging first and compare the outputs",
            "Use AWS Config to predict configuration changes",
          ],
          correctIndex: 0,
          explanation:
            "Change Sets preview exactly which resources will be created, modified, or replaced by an update, and whether changes require resource replacement (downtime) or can be done in-place. This prevents unintended production changes. Drift detection identifies past manual changes, not future update impacts.",
        },
      ],
    },
    {
      heading: "Nested Stacks and StackSets",
      body: `**Nested stacks** allow one CloudFormation stack to reference another as a resource (using AWS::CloudFormation::Stack). This enables modular IaC — you define reusable components (VPC, IAM roles, security groups) as child stacks and compose them into a parent stack. Child stack outputs are passed to the parent and between siblings. Nested stacks are best for decomposing large monolithic templates into maintainable modules.

**StackSets** deploy stacks to multiple accounts and regions from a single management account (or delegated admin). StackSets are used for org-wide deployments: enabling Config rules across all accounts, deploying baseline IAM roles, or establishing VPC configurations in every region. StackSets use service-managed permissions (AWS Organizations integration) or self-managed permissions (CloudFormation execution roles in each target account).`,
      quiz: [
        {
          question:
            "A company wants to deploy an AWS Config rule to all 50 accounts in their AWS Organization simultaneously. What is the MOST efficient approach?",
          options: [
            "CloudFormation StackSets with AWS Organizations integration",
            "50 individual CloudFormation stacks deployed to each account",
            "AWS Control Tower to deploy baseline configurations",
            "Nested stacks with cross-account references",
          ],
          correctIndex: 0,
          explanation:
            "StackSets deploy a single stack template to multiple accounts and regions simultaneously. With AWS Organizations integration, new accounts added to the OU automatically receive the stack. This is the purpose-built solution for org-wide deployments. Individual stacks per account don't scale, and nested stacks are within a single account.",
        },
      ],
    },
    {
      heading: "CloudFormation Helper Scripts and cfn-init",
      body: `**cfn-init** is a helper script that reads metadata from the CloudFormation template to configure EC2 instances during bootstrapping. The \`AWS::CloudFormation::Init\` metadata defines packages to install, files to create, services to enable, and commands to run. Unlike user data (which is a shell script), cfn-init is declarative and idempotent — re-running it applies only the differences.

**cfn-signal** sends a success or failure signal back to CloudFormation after an EC2 instance is configured. CloudFormation waits for the signal (up to the configured timeout) before marking the resource as CREATE_COMPLETE. Without cfn-signal, CloudFormation marks the resource complete as soon as the instance starts, not when the application is ready. Use **CreationPolicy** with a cfn-signal call to ensure the instance is fully configured before stack creation succeeds.`,
      quiz: [
        {
          question:
            "A CloudFormation template provisions an EC2 instance and installs a web application. The stack marks CREATE_COMPLETE before the application finishes installing. How should the template be fixed?",
          options: [
            "Add a CreationPolicy with a timeout and call cfn-signal in the user data after installation completes",
            "Increase the stack creation timeout in the CloudFormation console",
            "Use cfn-init instead of user data to install the application",
            "Add a DependsOn attribute to the instance resource",
          ],
          correctIndex: 0,
          explanation:
            "CreationPolicy + cfn-signal tells CloudFormation to wait for an explicit success signal from the instance before marking it complete. Without this, CloudFormation considers the EC2 resource done when the API call to create it succeeds — not when the instance is configured. DependsOn controls resource creation order but not readiness.",
        },
      ],
    },
  ],

  keyFacts: [
    "Resources is the only required section in a CloudFormation template",
    "Change Sets preview updates before execution — always use for production stacks",
    "Drift detection: identifies manual changes outside CloudFormation — run on demand, not real-time",
    "DeletionPolicy: Retain keeps the resource when the stack is deleted; Snapshot takes a final backup",
    "Nested stacks: reusable child stacks composed into parent stacks for modular IaC",
    "StackSets: deploy stacks to multiple accounts/regions from one management account",
    "cfn-init: declarative, idempotent instance configuration via template metadata",
    "cfn-signal + CreationPolicy: waits for instance to signal readiness before stack creation completes",
    "!Ref: references a parameter or resource. !GetAtt: gets a resource attribute. !Sub: string substitution",
    "Outputs + !ImportValue: share values between independent stacks (cross-stack references)",
    "Stack rollback: if any resource fails to create, CloudFormation rolls back all resources by default",
    "AWS SAM (Serverless Application Model): CloudFormation extension with simplified serverless syntax — SAM templates transform into full CloudFormation at deployment",
    "CloudFormation Custom Resources: invoke Lambda during stack create/update/delete for resources CloudFormation does not natively support",
  ],

  relatedServices: [
    "AWS CDK",
    "AWS Systems Manager Parameter Store",
    "AWS Secrets Manager",
    "AWS Config",
    "AWS Organizations",
    "AWS Control Tower",
  ],

  examTips: [
    "For multi-account/multi-region deployments: StackSets — not individual stacks",
    "Always use Change Sets before updating production stacks to preview resource replacement",
    "DeletionPolicy: Snapshot is useful for RDS — takes a final snapshot before the stack deletes the DB",
    "cfn-signal is required if you need CloudFormation to wait for EC2 software to be ready",
    "Cross-stack references: Output with Export in stack A, !ImportValue in stack B — stacks are coupled by this dependency",
    "Nested stacks vs. cross-stack references: nested stacks are managed together; cross-stack references are independently managed",
    "CloudFormation rollback triggers: define CloudWatch alarms that trigger automatic rollback if metrics spike after update",
    "Stack policies prevent specific resources from being updated or replaced — distinct from IAM policies",
    "CloudFormation does not support circular dependencies between resources",
    "AWS SAM is CloudFormation for serverless — when you see AWS::Serverless::Function in a template, that is SAM syntax that transforms to CloudFormation",
  ],
};
