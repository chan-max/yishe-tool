import { createDesignOperationContext, executeOperation } from "@/operations";
import { resourceService } from "@/ai/services/resource";
import { resolveAIToolName } from "./tools";

const RESOURCE_TOOL_NAMES = new Set([
  "resource.searchFont",
  "resource.searchSticker",
  "resource.searchSentence",
  "resource.searchTextDocument",
  "resource.searchCustomSticker",
]);

export function isResourceToolName(toolName: string): boolean {
  return RESOURCE_TOOL_NAMES.has(resolveAIToolName(toolName));
}

export async function executeAITool(
  toolName: string,
  args: Record<string, any>,
  ctx = createDesignOperationContext(),
) {
  const resolvedName = resolveAIToolName(toolName);
  if (RESOURCE_TOOL_NAMES.has(resolvedName)) {
    return resourceService.executeTool(resolvedName, args);
  }
  return executeOperation(resolvedName, args, ctx);
}
