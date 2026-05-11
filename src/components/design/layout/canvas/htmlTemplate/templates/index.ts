import type { HtmlTemplateDefinition } from "../types";
import { cloneTemplateList } from "./shared";
import { productTemplates } from "./productTemplates";
import { podPrintTemplates } from "./podPrintTemplates";

export const builtInHtmlTemplates: HtmlTemplateDefinition[] = [
  ...productTemplates,
  ...podPrintTemplates,
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
