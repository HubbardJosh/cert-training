import { ServiceGuide } from "../../../../types/guide";
import { overviewGuide } from "./overview";
import { runtimeGuide } from "./runtime";
import { gatewayGuide } from "./gateway";
import { memoryGuide } from "./memory";
import { identityGuide } from "./identity";
import { codeInterpreterBrowserGuide } from "./codeInterpreterBrowser";

export const allGuides: ServiceGuide[] = [
  // Platform overview
  overviewGuide,
  // Execution environment
  runtimeGuide,
  // Identity & trust model
  identityGuide,
  // Tool connectivity
  gatewayGuide,
  // State across sessions
  memoryGuide,
  // Built-in action tools
  codeInterpreterBrowserGuide,
];

export { ServiceGuide };
