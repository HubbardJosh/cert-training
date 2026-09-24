import { ServiceGuide } from "../../../../types/guide";
import { lambdaGuide } from "./lambda";
import { apiGatewayGuide } from "./apiGateway";
import { dynamodbGuide } from "./dynamodb";
import { s3Guide } from "./s3";
import { sqsGuide } from "./sqs";
import { snsGuide } from "./sns";
import { kinesisGuide } from "./kinesis";
import { eventbridgeGuide } from "./eventbridge";
import { stepFunctionsGuide } from "./stepFunctions";
import { iamGuide } from "./iam";
import { cognitoGuide } from "./cognito";
import { kmsGuide } from "./kms";
import { secretsManagerGuide } from "./secretsManager";
import { cloudwatchGuide } from "./cloudwatch";
import { xrayGuide } from "./xray";
import { elasticacheGuide } from "./elasticache";
import { vpcGuide } from "./vpc";
import { cloudfrontGuide } from "./cloudfront";
import { ecsGuide } from "./ecs";
import { rdsGuide } from "./rds";
import { codepipelineGuide } from "./codepipeline";
import { codebuildGuide } from "./codebuild";
import { codedeployGuide } from "./codedeploy";
import { samGuide } from "./sam";
import { cloudformationGuide } from "./cloudformation";
import { cdkGuide } from "./cdk";
import { elasticBeanstalkGuide } from "./elasticbeanstalk";
import { amplifyGuide } from "./amplify";
import { appsyncGuide } from "./appsync";
import { systemsManagerGuide } from "./systemsManager";

export const allGuides: ServiceGuide[] = [
  // Identity & access
  iamGuide,
  // Serverless core
  lambdaGuide,
  apiGatewayGuide,
  // Databases & caching
  dynamodbGuide,
  rdsGuide,
  elasticacheGuide,
  // Storage
  s3Guide,
  // Messaging & events
  sqsGuide,
  snsGuide,
  eventbridgeGuide,
  kinesisGuide,
  stepFunctionsGuide,
  // Observability
  cloudwatchGuide,
  xrayGuide,
  // Networking & delivery
  vpcGuide,
  cloudfrontGuide,
  appsyncGuide,
  // Auth & secrets
  cognitoGuide,
  kmsGuide,
  secretsManagerGuide,
  // Containers
  ecsGuide,
  // CI/CD pipeline
  codepipelineGuide,
  codebuildGuide,
  codedeployGuide,
  // Infrastructure as code
  samGuide,
  cloudformationGuide,
  cdkGuide,
  // Platform deployment
  elasticBeanstalkGuide,
  amplifyGuide,
  systemsManagerGuide,
];

export const guidesByDomain = {
  development: allGuides.filter((g) => g.domain === "development"),
  security: allGuides.filter((g) => g.domain === "security"),
  deployment: allGuides.filter((g) => g.domain === "deployment"),
  troubleshooting: allGuides.filter((g) => g.domain === "troubleshooting"),
};

export { ServiceGuide };
