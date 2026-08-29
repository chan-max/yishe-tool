const axios = require("axios");

const API_BASE = "http://localhost:1520/api";
const SUPER_TOKEN = "1sdesign";

async function main() {
  console.log("================================================================================");
  console.log("🚀 [yishe-admin 远程接口调用自测试] 操控设计工具端自动化制图");
  console.log("================================================================================");

  const client = axios.create({
    baseURL: API_BASE,
    headers: {
      Authorization: `Bearer ${SUPER_TOKEN}`,
      "x-data-scope-mode": "all",
      "Content-Type": "application/json",
    },
  });

  // 1. 查询当前在线的所有设计端 WebSocket 连接
  console.log("\n[步骤 1] 正在查询当前在线的设计工具实例...");
  const connRes = await client.post("/websocket/connections", {});
  const connections = connRes.data?.data || connRes.data || [];

  const designTools = connections.filter(
    (c) =>
      c.clientSource === "设计端" ||
      c.clientSource === "设计工具" ||
      c.clientInfo?.app?.name === "yishe-tool" ||
      String(c.id || "").startsWith("designtool-")
  );

  if (designTools.length === 0) {
    console.log("❌ 未发现已连接的设计工具端实例。请确保浏览器已打开 http://localhost:1522 页面。");
    process.exit(1);
  }

  console.log(`✅ 找到 ${designTools.length} 个在线设计端实例:`);
  designTools.forEach((tool, idx) => {
    console.log(`   [${idx + 1}] ConnectionId: ${tool.id} (${tool.clientInfo?.app?.name || tool.clientSource})`);
  });

  const targetTool = designTools[0];
  console.log(`\n🎯 选定目标设计端: ${targetTool.id}`);

  // 2. 发送远程 chat 制图命令
  const testPrompt = "制作一套黑金奢华商务名片正反面组图（900x540）：第1张正面为「Jackie / 首席设计架构师」，第2张背面为「衣设科技 · 智构无界」，制作完成后自动保存并打包为组图。";
  const requestId = `admin-cmd-${Date.now()}`;

  console.log(`\n[步骤 2] 正在向设计端发送远程 Agent 设计指令...`);
  console.log(`   指令内容: "${testPrompt}"`);

  const dispatchRes = await client.post("/websocket/remote-command", {
    connectionId: targetTool.id,
    command: {
      type: "chat",
      payload: {
        message: testPrompt,
      },
      requestId,
    },
  });

  console.log("\n[步骤 3] 接口响应结果:");
  console.log(JSON.stringify(dispatchRes.data, null, 2));

  console.log("\n================================================================================");
  console.log("🎉 远程设计指令已成功推送到您的设计端 (http://localhost:1522)！");
  console.log("👉 请切回浏览器查看：AI面板已自动展开，正在实时规划、绘制卡片、保存并打包组图！");
  console.log("================================================================================");
}

main().catch((err) => {
  console.error("❌ 远程调用失败:", err.response?.data || err.message);
  process.exit(1);
});
