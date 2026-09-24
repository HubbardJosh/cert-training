import { ServiceGuide } from "../../../../types/guide";
import { promptingAndTaskExecutionGuide } from "./promptingAndTaskExecution";
import { outputEvaluationAndValidationGuide } from "./outputEvaluationAndValidation";
import { productAndModelSelectionGuide } from "./productAndModelSelection";
import { capabilitiesAndLimitationsGuide } from "./capabilitiesAndLimitations";
import { claudeModelsGuide } from "./claudeModels";
import { promptEngineeringGuide } from "./promptEngineering";
import { messagesApiGuide } from "./messagesApi";
import { toolUseGuide } from "./toolUse";
import { safetyResponsibleAiGuide } from "./safetyResponsibleAi";
import { governanceRiskAndResponsibleUseGuide } from "./governanceRiskAndResponsibleUse";
import { anthropicProductsGuide } from "./anthropicProducts";
import { configurationAndKnowledgeManagementGuide } from "./configurationAndKnowledgeManagement";
import { workflowIntegrationAndSolutionDesignGuide } from "./workflowIntegrationAndSolutionDesign";
import { agenticWorkflowsGuide } from "./agenticWorkflows";
import { productionDeploymentGuide } from "./productionDeployment";
import { evaluationsAndTestingGuide } from "./evaluationsAndTesting";
import { troubleshootingAndOptimizationGuide } from "./troubleshootingAndOptimization";

export const allGuides: ServiceGuide[] = [
  // What Claude is
  claudeModelsGuide,
  capabilitiesAndLimitationsGuide,
  anthropicProductsGuide,
  // Using Claude
  promptingAndTaskExecutionGuide,
  promptEngineeringGuide,
  messagesApiGuide,
  // Extending Claude
  toolUseGuide,
  configurationAndKnowledgeManagementGuide,
  // Responsible use
  safetyResponsibleAiGuide,
  governanceRiskAndResponsibleUseGuide,
  // Choosing the right model
  productAndModelSelectionGuide,
  // Building systems
  workflowIntegrationAndSolutionDesignGuide,
  agenticWorkflowsGuide,
  // Shipping to production
  productionDeploymentGuide,
  evaluationsAndTestingGuide,
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
