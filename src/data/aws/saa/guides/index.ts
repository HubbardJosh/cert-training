import { ServiceGuide } from "../../../../types/guide";
import { iamGuide } from "./iam";
import { vpcGuide } from "./vpc";
import { ec2Guide } from "./ec2";
import { s3Guide } from "./s3";
import { rdsGuide } from "./rds";
import { elbGuide } from "./elb";
import { cloudfrontGuide } from "./cloudfront";
import { route53Guide } from "./route53";
import { sqsSnsGuide } from "./sqs-sns";
import { lambdaGuide } from "./lambda";
import { cloudformationGuide } from "./cloudformation";
import { storageGuide } from "./storage";
import { dynamodbGuide } from "./dynamodb";
import { monitoringGuide } from "./monitoring";
import { securityGuide } from "./security";
import { drGuide } from "./dr";
import { costGuide } from "./cost";
import { kinesisGuide } from "./kinesis";

export const allGuides: ServiceGuide[] = [
  // Identity & networking foundation
  iamGuide,
  vpcGuide,
  // Security deep-dive (concepts appear throughout all following guides)
  securityGuide,
  // Core compute & storage
  ec2Guide,
  s3Guide,
  rdsGuide,
  storageGuide,
  // High availability & delivery
  elbGuide,
  cloudfrontGuide,
  route53Guide,
  // Databases
  dynamodbGuide,
  // App decoupling & serverless
  sqsSnsGuide,
  lambdaGuide,
  kinesisGuide,
  // Infrastructure as code
  cloudformationGuide,
  // Operations
  monitoringGuide,
  drGuide,
  costGuide,
];

export const guidesByDomain = allGuides.reduce<Record<string, ServiceGuide[]>>(
  (acc, guide) => {
    if (!acc[guide.domain]) acc[guide.domain] = [];
    acc[guide.domain].push(guide);
    return acc;
  },
  {},
);
