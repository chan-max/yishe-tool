import type { HtmlTemplateDefinition } from "../types";
import { cloneTemplateList } from "./shared";
import { productTemplates } from "./productTemplates";

export const builtInHtmlTemplates: HtmlTemplateDefinition[] = [
  ...productTemplates,
].sort((left, right) => {
  const leftOrder = left.sortOrder ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.sortOrder ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return left.name.localeCompare(right.name, "zh-Hans-CN");
});

export function getBuiltInHtmlTemplates() {
  return cloneTemplateList(builtInHtmlTemplates);
}
