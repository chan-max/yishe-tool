/**
 * AI Agent 自动化测试脚本
 *
 * 用法:
 *   cd tools
 *   node run-test.mjs
 *   node agent-test.mjs --health
 *   node agent-test.mjs --suite smoke
 *
 * 环境变量:
 *   AGENT_TEST_URL      服务端地址 (默认 http://localhost:1520)
 *   AGENT_TEST_TOKEN    认证 Token (必填)
 *   AGENT_TEST_PROMPTS  自定义测试提示 (JSON 数组, 可选)
 */

import { io } from "socket.io-client";
import { writeFileSync } from "fs";

// ── 参数解析 ──
const args = process.argv.slice(2);
function getArg(name, fallback) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
}

if (args.includes("--help") || args.includes("-h")) {
  console.log(`AI Agent test runner

Usage:
  node tools/run-test.mjs [options]
  node tools/agent-test.mjs --token <token> [options]

Options:
  --health              Check online tool status and minimal AI path
  --suite smoke         Run minimal AI reply case only
  --suite basic         Run basic text/background cases
  --suite default       Run default agent behavior cases
  --url <url>           Server URL, default http://localhost:1520
  --token <token>       Auth token, or AGENT_TEST_TOKEN
  --tool-id <id>        Preferred design tool connection id
  --fail-on-env         Treat AI key/quota/account issues as failures
`);
  process.exit(0);
}

const SERVER_URL = getArg(
  "url",
  process.env.AGENT_TEST_URL || "http://localhost:1520",
).replace(/\/$/, "");

const INPUT_TOKEN = getArg("token", process.env.AGENT_TEST_TOKEN || "");
if (!INPUT_TOKEN) {
  console.error("❌ 缺少 Token");
  console.error("   用法: 在 .test-token 文件中写入 token，然后 node run-test.mjs");
  process.exit(1);
}
const PREFERRED_TOOL_ID = getArg("tool-id", process.env.AGENT_TEST_TOOL_ID || "");
const MODE = args.includes("--health")
  ? "health"
  : getArg("suite", process.env.AGENT_TEST_SUITE || "default");
const FAIL_ON_ENV = args.includes("--fail-on-env");

const ENV_ERROR_PATTERNS = [
  /Arrearage|overdue-payment|欠费/i,
  /Access denied/i,
  /invalid api key|incorrect api key|unauthorized/i,
  /quota|insufficient_quota|rate limit/i,
  /API Key 为空|未返回可用的 API Key|获取配置失败/i,
];

function classifyIssue(text) {
  const value = String(text || "");
  if (ENV_ERROR_PATTERNS.some((pattern) => pattern.test(value))) {
    return "environment";
  }
  if (/timeout|超时/i.test(value)) return "timeout";
  return "agent";
}

// ── 测试用例 ──
const DEFAULT_PROMPTS = [
  {
    category: "基础文字",
    prompt: "清空画布，添加一个写着 HELLO 的红色大字，居中显示",
    expect: { toolCalls: ["canvas.clear", "canvas.addChild"], minElements: 1 },
  },
  {
    category: "背景渐变",
    prompt: "清空画布，设置深蓝到紫色的渐变背景，然后添加白色标题文字 DESIGN",
    expect: {
      toolCalls: ["canvas.clear", "canvas.setBackgroundColor", "canvas.addChild"],
      minElements: 1,
    },
  },
  {
    category: "多图拼贴",
    prompt: "清空画布，搜索猫咪图片，然后用 HTML Grid 做一个 2x2 的拼图",
    expect: {
      toolCalls: ["canvas.clear", "resource.searchImage", "canvas.addChild"],
      minElements: 1,
    },
  },
  {
    category: "CSS特效",
    prompt: "清空画布，深色背景，添加一个有霓虹发光效果的紫色文字 NEON",
    expect: { toolCalls: ["canvas.clear", "canvas.addChild"], minElements: 1 },
  },
  {
    category: "形状组合",
    prompt: "清空画布，添加一个蓝色圆形和一个橙色矩形，矩形放在圆形右边",
    expect: { toolCalls: ["canvas.clear", "canvas.addChild"], minElements: 2 },
  },
];

const SMOKE_PROMPTS = [
  {
    category: "最小AI链路",
    prompt: "请回复一句：设计工具 agent 自测成功。不要修改画布。",
    expect: { allowNoToolCalls: true },
  },
];

const BASIC_PROMPTS = DEFAULT_PROMPTS.slice(0, 2);

const CUSTOM_PROMPTS_JSON = process.env.AGENT_TEST_PROMPTS;
const TEST_PROMPTS = CUSTOM_PROMPTS_JSON
  ? JSON.parse(CUSTOM_PROMPTS_JSON)
  : MODE === "smoke" || MODE === "health"
    ? SMOKE_PROMPTS
    : MODE === "basic"
      ? BASIC_PROMPTS
      : DEFAULT_PROMPTS;

// ── HTTP 请求工具 ──
let authToken = "";

async function api(path, body) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  const res = await fetch(`${SERVER_URL}/api${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} 失败 (${res.status}): ${text}`);
  }
  const json = await res.json();
  return json.data ?? json;
}

// ── 查找设计工具 ──
async function findDesignTools() {
  console.log("\n🔍 查找在线设计工具...");
  const connections = await api(
    "/websocket/my-online-runtime-connection-views",
    { summary: true, compact: true },
  );
  const tools = (Array.isArray(connections) ? connections : []).filter((c) => {
    const src = c.clientSource || c.query?.clientSource || "";
    const srcStr = Array.isArray(src) ? src[0] : src;
    return (
      ["设计工具", "设计端"].includes(srcStr) ||
      c.clientInfo?.app?.name === "yishe-tool" ||
      c.id?.startsWith("designtool-")
    );
  });
  if (tools.length === 0) {
    throw new Error("未找到在线设计工具，请确认设计工具已打开并连接");
  }
  console.log(`✅ 找到 ${tools.length} 台设计工具:`);
  tools.forEach((t) => {
    const agent = t.clientInfo?.agent;
    const state = agent?.agentState || "unknown";
    console.log(`   - ${t.id} (${state}) ${agent?.step || ""}`);
  });
  return tools;
}

function selectDesignTool(tools) {
  if (PREFERRED_TOOL_ID) {
    const matched = tools.find((tool) => tool.id === PREFERRED_TOOL_ID);
    if (!matched) {
      throw new Error(`未找到指定设计工具: ${PREFERRED_TOOL_ID}`);
    }
    return matched;
  }

  return (
    tools.find((tool) => tool.ip === "127.0.0.1" || tool.ip === "::1") ||
    tools.find((tool) => String(tool.clientInfo?.machine?.platform || "").includes("Win")) ||
    tools[0]
  );
}

// ── WebSocket 连接 ──
function connectWebSocket() {
  return new Promise((resolve, reject) => {
    const wsUrl = SERVER_URL.replace(/^http/, "ws");
    console.log(`\n📡 连接 WebSocket: ${wsUrl}/ws ...`);
    const socket = io(`${wsUrl}/ws`, {
      transports: ["websocket"],
      auth: { token: authToken },
      query: { clientSource: "admin", clientId: `agent-test-${Date.now()}` },
      reconnection: false,
      timeout: 10000,
    });
    socket.on("connect", () => {
      console.log("✅ WebSocket 已连接");
      resolve(socket);
    });
    socket.on("connect_error", (err) => {
      reject(new Error(`WebSocket 连接失败: ${err.message}`));
    });
  });
}

// ── 等待远程结果 ──
function waitForResult(socket, requestId, timeoutMs = 120000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off("remote-result", handler);
      reject(new Error(`等待结果超时 (${timeoutMs / 1000}s): ${requestId}`));
    }, timeoutMs);
    function handler(data) {
      if (data?.requestId === requestId) {
        clearTimeout(timer);
        socket.off("remote-result", handler);
        resolve(data);
      }
    }
    socket.on("remote-result", handler);
  });
}

async function sendRemoteCommand(socket, toolId, command, timeoutMs = 30000) {
  const requestId = command.requestId || `${command.type}-${Date.now()}`;
  const resultPromise = waitForResult(socket, requestId, timeoutMs);
  await api("/websocket/remote-command", {
    connectionId: toolId,
    command: { ...command, requestId },
  });
  return resultPromise;
}

// ── 运行单个测试 ──
async function runTest(socket, tool, testCase, index, total) {
  const toolId = tool.id;
  console.log(`\n${"─".repeat(60)}`);
  console.log(`📋 [${index + 1}/${total}] ${testCase.category}`);
  console.log(`   提示: ${testCase.prompt}`);
  console.log(`${"─".repeat(60)}`);

  const startTime = Date.now();

  // 发送 chat 命令
  console.log("   ⏳ 发送 chat 命令...");
  const chatRequestId = `chat-${Date.now()}`;
  let chatResult = null;
  try {
    console.log("   ✅ 命令已发送, 等待 Agent 执行...");
    chatResult = await sendRemoteCommand(
      socket,
      toolId,
      {
        type: "chat",
        payload: { message: testCase.prompt },
        requestId: chatRequestId,
      },
      120000,
    );
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`   ✅ Agent 完成 (${elapsed}s): ${chatResult.message || ""}`);
    if (chatResult.agentResponse) {
      console.log(`   💬 回复: ${chatResult.agentResponse.slice(0, 200)}`);
    }
  } catch (err) {
    console.log(`   ❌ 执行失败: ${err.message}`);
    chatResult = { error: err.message };
  }

  // 获取对话日志
  console.log("   📊 获取对话日志...");
  const logRequestId = `log-${Date.now()}`;
  let conversation = null;
  let agentStatus = null;
  try {
    const logResult = await sendRemoteCommand(
      socket,
      toolId,
      { type: "getConversation", requestId: logRequestId },
      15000,
    );
    conversation = logResult.conversation || [];
    agentStatus = logResult.agentStatus;
    console.log(`   ✅ 获取到 ${conversation.length} 条消息`);
  } catch (err) {
    console.log(`   ⚠️  获取日志失败: ${err.message}`);
  }

  const elapsed = Date.now() - startTime;
  const analysis = analyzeResult(testCase, conversation, chatResult);

  return {
    category: testCase.category,
    prompt: testCase.prompt,
    success: analysis.passed,
    elapsed,
    messageCount: conversation?.length || 0,
    toolCallsUsed: analysis.toolCallsUsed,
    chatResult,
    agentStatus,
    conversation,
    analysis,
  };
}

// ── 分析单个测试结果 ──
function analyzeResult(testCase, conversation, chatResult) {
  const result = { passed: true, issues: [], toolCallsUsed: [], details: {} };

  if (!conversation || conversation.length === 0) {
    result.passed = false;
    result.issues.push("无对话数据");
    result.issueTypes = result.issues.map(classifyIssue);
    return result;
  }

  // 分析工具调用
  const toolCalls = [];
  for (const msg of conversation) {
    if (msg.tool_calls?.length) {
      for (const tc of msg.tool_calls) toolCalls.push(tc.name);
    }
    if (msg.role === "tool" && msg.tool_name) {
      if (!toolCalls.includes(msg.tool_name)) toolCalls.push(msg.tool_name);
    }
  }
  result.toolCallsUsed = [...new Set(toolCalls)];

  // 检查期望的工具调用
  if (testCase.expect?.toolCalls) {
    for (const expected of testCase.expect.toolCalls) {
      if (!result.toolCallsUsed.includes(expected)) {
        result.issues.push(`缺少期望的工具调用: ${expected}`);
        result.passed = false;
      }
    }
  }

  if (
    result.toolCallsUsed.length === 0 &&
    !testCase.expect?.allowNoToolCalls &&
    !chatResult?.error
  ) {
    result.issues.push("未发生工具调用");
    result.passed = false;
  }

  // 检查工具执行错误
  const toolErrors = conversation
    .filter((m) => m.role === "tool" && m.meta?.toolResult?.success === false)
    .map(
      (m) =>
        `${m.tool_name || "unknown"}: ${m.meta.toolResult.message || m.meta.toolResult.error || "未知错误"}`,
    );
  if (toolErrors.length > 0) {
    result.issues.push(`工具执行错误: ${toolErrors.join("; ")}`);
    result.passed = false;
  }
  result.details.toolErrors = toolErrors;

  if (chatResult?.error) {
    result.issues.push(`Agent 错误: ${chatResult.error}`);
    result.passed = false;
  }

  const assistantError = conversation
    .filter((m) => m.role === "assistant")
    .map((m) => String(m.content || ""))
    .find((content) =>
      /AI 请求失败|Access denied|Arrearage|出现了错误|error/i.test(content),
    );
  if (assistantError) {
    result.issues.push(`Agent 回复错误: ${assistantError.slice(0, 240)}`);
    result.passed = false;
  }

  result.issueTypes = [...new Set(result.issues.map(classifyIssue))];

  const userMsgs = conversation.filter((m) => m.role === "user").length;
  const assistantMsgs = conversation.filter((m) => m.role === "assistant").length;
  const toolMsgs = conversation.filter((m) => m.role === "tool").length;
  result.details.messageStats = { user: userMsgs, assistant: assistantMsgs, tool: toolMsgs };

  const durations = conversation
    .filter((m) => m.meta?.duration)
    .map((m) => ({ role: m.role, duration: m.meta.duration, name: m.tool_name || "" }));
  result.details.durations = durations;
  result.details.totalDurationMs = durations.reduce((sum, d) => sum + d.duration, 0);

  return result;
}

// ── 生成报告 ──
function generateReport(results) {
  console.log(`\n${"═".repeat(60)}`);
  console.log("📊 测试报告");
  console.log("═".repeat(60));

  const passed = results.filter((r) => r.success).length;
  const failed = results.length - passed;
  const envBlocked = results.filter((r) =>
    r.analysis?.issueTypes?.includes("environment"),
  ).length;
  const totalElapsed = results.reduce((sum, r) => sum + r.elapsed, 0);

  console.log(`\n总计: ${results.length} 个用例`);
  console.log(`通过: ${passed} ✅  失败: ${failed} ${failed > 0 ? "❌" : ""}`);
  console.log(`通过率: ${Math.round((passed / results.length) * 100)}%`);
  if (envBlocked > 0) {
    console.log(`环境阻塞: ${envBlocked} 个（AI Key/额度/账号状态）`);
  }
  console.log(`总耗时: ${(totalElapsed / 1000).toFixed(1)}s`);

  console.log(`\n${"─".repeat(60)}`);
  console.log("详细结果:");
  console.log("─".repeat(60));

  for (const r of results) {
    const icon = r.success ? "✅" : "❌";
    const elapsed = (r.elapsed / 1000).toFixed(1);
    console.log(`\n${icon} ${r.category} (${elapsed}s, ${r.messageCount} 条消息)`);
    console.log(`   提示: ${r.prompt}`);
    console.log(`   工具调用: ${r.toolCallsUsed.join(", ") || "无"}`);
    if (r.analysis?.issues?.length) {
      console.log(`   问题:`);
      r.analysis.issues.forEach((issue) => console.log(`     ⚠️  ${issue}`));
    }
    if (r.analysis?.details?.toolErrors?.length) {
      console.log(`   工具错误:`);
      r.analysis.details.toolErrors.forEach((e) => console.log(`     ❌ ${e}`));
    }
  }

  // 汇总工具调用
  const allTools = {};
  for (const r of results) {
    for (const t of r.toolCallsUsed || []) allTools[t] = (allTools[t] || 0) + 1;
  }
  console.log(`\n${"─".repeat(60)}`);
  console.log("工具调用统计:");
  console.log("─".repeat(60));
  Object.entries(allTools)
    .sort((a, b) => b[1] - a[1])
    .forEach(([tool, count]) => console.log(`   ${tool}: ${count} 次`));

  // 汇总问题
  const allIssues = results.flatMap((r) =>
    (r.analysis?.issues || []).map((i) => ({ category: r.category, issue: i })),
  );
  if (allIssues.length > 0) {
    console.log(`\n${"─".repeat(60)}`);
    console.log("问题汇总 (需优化):");
    console.log("─".repeat(60));
    for (const { category, issue } of allIssues) {
      console.log(`   [${category}] ${issue}`);
    }
  }

  // 保存 JSON 报告
  const reportFile = `agent-test-report-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`;
  const reportData = {
    timestamp: new Date().toISOString(),
    server: SERVER_URL,
    token: authToken.slice(0, 20) + "...",
    summary: { total: results.length, passed, failed, totalElapsedMs: totalElapsed },
    results: results.map((r) => ({
      category: r.category,
      prompt: r.prompt,
      success: r.success,
      elapsedMs: r.elapsed,
      messageCount: r.messageCount,
      toolCallsUsed: r.toolCallsUsed,
      issues: r.analysis?.issues || [],
      issueTypes: r.analysis?.issueTypes || [],
      toolErrors: r.analysis?.details?.toolErrors || [],
      messageStats: r.analysis?.details?.messageStats,
      totalDurationMs: r.analysis?.details?.totalDurationMs,
      conversation: r.conversation,
      agentStatus: r.agentStatus,
    })),
  };
  writeFileSync(reportFile, JSON.stringify(reportData, null, 2), "utf-8");
  console.log(`\n📄 JSON 报告已保存: ${reportFile}`);

  return reportData;
}

async function runHealthCheck(socket, tool) {
  console.log(`\n${"─".repeat(60)}`);
  console.log("🩺 Agent 健康检查");
  console.log(`${"─".repeat(60)}`);

  const ping = await sendRemoteCommand(
    socket,
    tool.id,
    { type: "getAgentStatus" },
    15000,
  );
  console.log(`✅ 设计工具响应: ${ping.message || "在线"}`);
  console.log(`   Agent 状态: ${ping.agentStatus?.status || "unknown"}`);
  console.log(`   消息数: ${ping.agentStatus?.messageCount ?? 0}`);

  const smoke = await runTest(socket, tool, SMOKE_PROMPTS[0], 0, 1);
  const issueTypes = smoke.analysis?.issueTypes || [];
  const envBlocked = issueTypes.includes("environment");

  if (smoke.success) {
    console.log("\n✅ 健康检查通过：WebSocket、远程命令、AI 最小链路正常");
    return { ok: true, envBlocked, smoke };
  }

  if (envBlocked) {
    console.log("\n⚠️  健康检查发现 AI 配置/账号问题，不属于 agent 逻辑失败");
    console.log("   请先更换可用 API Key 或处理供应商账号额度/欠费。");
    return { ok: false, envBlocked, smoke };
  }

  console.log("\n❌ 健康检查失败：需要查看 agent 或远程命令链路");
  return { ok: false, envBlocked, smoke };
}

// ── 主流程 ──
async function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   AI Agent 自动化测试                    ║");
  console.log("╚══════════════════════════════════════════╝");

  authToken = INPUT_TOKEN;
  console.log(`\n🔑 Token: ${authToken.slice(0, 20)}...`);
  console.log(`🌐 Server: ${SERVER_URL}`);

  const tools = await findDesignTools();
  const tool = selectDesignTool(tools);
  console.log(`\n🎯 使用设计工具: ${tool.id} (${tool.ip || "unknown ip"})`);

  const socket = await connectWebSocket();

  if (MODE === "health") {
    const health = await runHealthCheck(socket, tool);
    socket.disconnect();
    process.exit(health.ok || (health.envBlocked && !FAIL_ON_ENV) ? 0 : 1);
  }

  const results = [];
  for (let i = 0; i < TEST_PROMPTS.length; i++) {
    try {
      const result = await runTest(socket, tool, TEST_PROMPTS[i], i, TEST_PROMPTS.length);
      results.push(result);
    } catch (err) {
      console.log(`\n❌ 测试异常: ${err.message}`);
      results.push({
        category: TEST_PROMPTS[i].category,
        prompt: TEST_PROMPTS[i].prompt,
        success: false,
        error: err.message,
        elapsed: 0,
        messageCount: 0,
        toolCallsUsed: [],
        analysis: { passed: false, issues: [err.message] },
      });
    }
  }

  const report = generateReport(results);
  const hasFailed = report.summary.failed > 0;
  const envBlocked = results.some((r) =>
    r.analysis?.issueTypes?.includes("environment"),
  );

  socket.disconnect();
  console.log("\n🏁 测试完成");
  process.exit(hasFailed && (!envBlocked || FAIL_ON_ENV) ? 1 : 0);
}

main().catch((err) => {
  console.error("\n❌ 致命错误:", err.message);
  process.exit(1);
});
