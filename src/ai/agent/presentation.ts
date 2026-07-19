import type { DesignPlan } from "./planning";

function getPendingAction(plan: DesignPlan | null | undefined): string {
  return plan?.steps?.find((step) => step.status === "pending")?.action || "";
}

export function getAgentPhaseLabel(
  status: string,
  plan?: DesignPlan | null,
): string {
  if (status === "idle" || status === "done") return "空闲";
  if (status === "waiting_user") return "等待反馈";
  if (status === "error") return "出现异常";

  const action = getPendingAction(plan);
  if (!action) return status === "thinking" ? "理解需求" : "处理中";
  if (action.startsWith("resource.search")) return "寻找素材";
  if (
    action === "canvas.clear" ||
    action === "canvas.setSize" ||
    action === "canvas.smartSize" ||
    action === "canvas.setSizeByPreset" ||
    action === "canvas.setBaseFontSize"
  ) {
    return "准备画布";
  }
  if (
    action === "canvas.addHtml" ||
    action === "canvas.addChild:html" ||
    action === "canvas.addDiagram" ||
    action === "canvas.addChart"
  ) {
    return "制作画面";
  }
  if (
    action === "canvas.analyze" ||
    action === "canvas.evaluateDesign" ||
    action === "canvas.createAndAnalyze"
  ) {
    return "检查设计";
  }
  if (action === "canvas.updateAndSaveSticker") return "上传图库";
  if (action === "canvas.exportPng") return "导出文件";
  return status === "thinking" ? "规划下一步" : "执行设计";
}
