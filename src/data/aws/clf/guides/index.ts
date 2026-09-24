import { ServiceGuide } from "../../../../types/guide";
import { ec2Guide } from "./ec2";
import { s3Guide } from "./s3";
import { vpcGuide } from "./vpc";
import { rdsGuide } from "./rds";
import { iamGuide } from "./iam";
import { cloudfrontGuide } from "./cloudfront";
import { lambdaGuide } from "./lambda";
import { dynamodbGuide } from "./dynamodb";
import { snsGuide } from "./sns";
import { sqsGuide } from "./sqs";
import { cloudwatchGuide } from "./cloudwatch";
import { cloudformationGuide } from "./cloudformation";
import { ecsGuide } from "./ecs";
import { elasticBeanstalkGuide } from "./elasticbeanstalk";
import { pricingGuide } from "./pricing";
import { supportPlansGuide } from "./supportPlans";
import { sharedResponsibilityGuide } from "./sharedResponsibility";
import { wellArchitectedGuide } from "./wellArchitected";
import { globalInfrastructureGuide } from "./globalInfrastructure";
import { route53Guide } from "./route53";

export const allGuides: ServiceGuide[] = [
  // Cloud fundamentals
  globalInfrastructureGuide,
  sharedResponsibilityGuide,
  // Identity & access
  iamGuide,
  // Core compute & storage
  ec2Guide,
  vpcGuide,
  s3Guide,
  rdsGuide,
  // Serverless & managed
  lambdaGuide,
  dynamodbGuide,
  // Messaging
  sqsGuide,
  snsGuide,
  // Networking & CDN
  route53Guide,
  cloudfrontGuide,
  // Containers & deployment
  ecsGuide,
  elasticBeanstalkGuide,
  cloudformationGuide,
  // Observability
  cloudwatchGuide,
  // Business & governance
  pricingGuide,
  supportPlansGuide,
  wellArchitectedGuide,
];

export const guidesByDomain = {
  development: allGuides.filter((g) => g.domain === "development"),
  security: allGuides.filter((g) => g.domain === "security"),
  deployment: allGuides.filter((g) => g.domain === "deployment"),
  troubleshooting: allGuides.filter((g) => g.domain === "troubleshooting"),
};

export { ServiceGuide };
