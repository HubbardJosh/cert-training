import { ServiceGuide } from "../../../types/guide";
import { promptingAndTaskExecutionGuide } from "./promptingAndTaskExecution";
import { outputEvaluationAndValidationGuide } from "./outputEvaluationAndValidation";
import { productAndModelSelectionGuide } from "./productAndModelSelection";
import { workflowIntegrationAndSolutionDesignGuide } from "./workflowIntegrationAndSolutionDesign";
import { configurationAndKnowledgeManagementGuide } from "./configurationAndKnowledgeManagement";
import { governanceRiskAndResponsibleUseGuide } from "./governanceRiskAndResponsibleUse";
import { troubleshootingAndOptimizationGuide } from "./troubleshootingAndOptimization";

export const allGuides: ServiceGuide[] = [
  promptingAndTaskExecutionGuide,
  outputEvaluationAndValidationGuide,
  productAndModelSelectionGuide,
  workflowIntegrationAndSolutionDesignGuide,
  configurationAndKnowledgeManagementGuide,
  governanceRiskAndResponsibleUseGuide,
  troubleshootingAndOptimizationGuide,
];

export const guidesByDomain = allGuides.reduce<Record<string, ServiceGuide[]>>(
  (acc, guide) => {
    if (!acc[guide.domain]) acc[guide.domain] = [];
    acc[guide.domain].push(guide);
    return acc;
  },
  {},
);
