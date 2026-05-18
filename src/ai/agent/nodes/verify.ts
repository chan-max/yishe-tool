import type { AgentState, VerifyResult } from "../state";

// ============ 验证节点 ============

export async function verifyNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("[Agent] Verify node", { toolResults: state.toolResults });

  const checks: VerifyResult["checks"] = [];

  // 检查每个工具执行结果
  for (const [toolName, result] of Object.entries(state.toolResults)) {
    const res = result as any;

    // 检查是否成功
    if (res.success === false) {
      checks.push({
        name: `${toolName}_success`,
        passed: false,
        message: res.error || "工具执行失败",
      });
    } else {
      checks.push({
        name: `${toolName}_success`,
        passed: true,
        message: "工具执行成功",
      });
    }

    // 检查返回数据
    if (res.data && typeof res.data === "object") {
      checks.push({
        name: `${toolName}_data`,
        passed: true,
        message: "返回数据有效",
      });
    }
  }

  // 检查计划执行情况
  if (state.plan) {
    const completedSteps = state.plan.steps.filter((s) => s.status === "completed");
    const failedSteps = state.plan.steps.filter((s) => s.status === "failed");

    checks.push({
      name: "plan_progress",
      passed: failedSteps.length === 0,
      message: `完成 ${completedSteps.length}/${state.plan.steps.length} 步骤`,
    });

    if (failedSteps.length > 0) {
      checks.push({
        name: "plan_failures",
        passed: false,
        message: `${failedSteps.length} 个步骤失败`,
      });
    }
  }

  const passed = checks.every((c) => c.passed);
  const summary = passed
    ? "所有验证通过"
    : `${checks.filter((c) => !c.passed).length} 项验证失败`;

  const verifyResult: VerifyResult = {
    passed,
    checks,
    summary,
  };

  console.log("[Agent] Verify result:", verifyResult);

  return {
    verifyResult,
    status: "evaluating",
    currentNode: "evaluate",
  };
}
