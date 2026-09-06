import { ServiceGuide } from "../../../types/guide";
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
  // Security
  iamGuide,
  vpcGuide,
  securityGuide,
  // Fundamentals
  ec2Guide,
  s3Guide,
  rdsGuide,
  elbGuide,
  cloudfrontGuide,
  route53Guide,
  storageGuide,
  dynamodbGuide,
  // Deployment
  cloudformationGuide,
  monitoringGuide,
  drGuide,
  costGuide,
  // Applications
  sqsSnsGuide,
  lambdaGuide,
  kinesisGuide,
];

export const guidesByDomain = allGuides.reduce<Record<string, ServiceGuide[]>>(
  (acc, guide) => {
    if (!acc[guide.domain]) acc[guide.domain] = [];
    acc[guide.domain].push(guide);
    return acc;
  },
  {},
);
