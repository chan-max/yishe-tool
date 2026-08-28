const axios = require("axios");
const CryptoJS = require("crypto-js");

const API_BASE = "http://localhost:1520/api";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiYWNjb3VudCI6ImphY2tpZSIsInRlcm1pbmFsVHlwZSI6ImFkbWluIiwidG9rZW5JZCI6IjJmY2UyZjI0LTg4NGItNDM4YS1iNGEwLTcyODc0ZDk2NjA1NiIsImlhdCI6MTc4Nzg4MzMzMCwiZXhwIjoyMTAzNDU5MzMwfQ.CYF9KdKm57O2qUv4onE4z2TzixS9NOpC_LfyWnnkyhg";
const ENCRYPT_SECRET = "1s-design-encrypt-key";

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

function decryptKey(value) {
  if (!value || !value.startsWith("U2FsdGVkX1")) return value;
  try {
    const bytes = CryptoJS.AES.decrypt(value, ENCRYPT_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return value;
  }
}

const agentTools = [
  {
    type: "function",
    function: {
      name: "canvas_setSize",
      description: "设置画布尺寸",
      parameters: {
        type: "object",
        properties: {
          width: { type: "number", description: "宽度" },
          height: { type: "number", description: "高度" },
          unit: { type: "string", enum: ["px", "mm", "cm", "in"] },
        },
        required: ["width", "height"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "canvas_addHtml",
      description: "向画布添加 HTML 设计",
      parameters: {
        type: "object",
        properties: {
          htmlContent: { type: "string", description: "HTML/CSS代码" },
        },
        required: ["htmlContent"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "canvas_updateAndSaveSticker",
      description: "保存当前画布设计为自定义贴纸",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "贴纸名称" },
          description: { type: "string", description: "贴纸描述" },
          keywords: { type: "string", description: "关键词" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "canvas_clear",
      description: "清空画布",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "material_createImageGroup",
      description: "将贴纸创建为组图",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "组图名称" },
          stickerIds: { type: "array", items: { type: "string" }, description: "成员ID列表" },
          description: { type: "string", description: "组图描述" },
        },
        required: ["name", "stickerIds"],
      },
    },
  },
];

async function runScenario(scenarioName, userPrompt, expectedGroupsCount, expectedStickersCount, llmClient, model) {
  console.log(`\n================================================================================`);
  console.log(`🚀 [测试场景] ${scenarioName}`);
  console.log(`   指令: "${userPrompt}"`);
  console.log(`================================================================================`);

  const messages = [
    {
      role: "system",
      content: `你是一个顶级设计 Agent。支持完整工具链路：
1. 设置画布尺寸 canvas_setSize
2. 绘制设计 canvas_addHtml
3. 保存贴纸 canvas_updateAndSaveSticker
4. 清空画布 canvas_clear
5. 打包组图 material_createImageGroup
请严格按照用户需求执行，需要组图时必须在每套完成后调用 material_createImageGroup。`,
    },
    { role: "user", content: userPrompt },
  ];

  let currentCanvasHtml = "";
  const savedStickers = [];
  const createdGroupIds = [];

  for (let round = 1; round <= 16; round++) {
    const chatRes = await llmClient.post("/chat/completions", {
      model,
      messages,
      tools: agentTools,
      tool_choice: "auto",
      temperature: 0.6,
    });

    const message = chatRes.data.choices?.[0]?.message;
    messages.push(message);

    const toolCalls = message?.tool_calls;
    if (!toolCalls || toolCalls.length === 0) {
      console.log(`  🏁 [第 ${round} 轮] Agent 宣布任务执行完成。`);
      break;
    }

    for (const tc of toolCalls) {
      const fnName = tc.function.name;
      let args = {};
      try {
        args = JSON.parse(tc.function.arguments || "{}");
      } catch (e) {
        args = {};
      }

      console.log(`  🔧 [第 ${round} 轮] 调用工具: ${fnName}`);
      let toolResult = { success: true };

      if (fnName === "canvas_setSize") {
        toolResult = { success: true, message: `已设置尺寸 ${args.width}x${args.height}` };
      } else if (fnName === "canvas_addHtml") {
        currentCanvasHtml = args.htmlContent;
        toolResult = { success: true, message: "HTML已渲染" };
      } else if (fnName === "canvas_updateAndSaveSticker") {
        const sName = args.name || `设计_${Date.now()}`;
        const cRes = await client.post("/custom-sticker", {
          name: sName,
          description: args.description || "Agent 自动生成贴纸",
          keywords: args.keywords || "Agent,测试",
          url: "https://yishe-storage-1257307499.cos.ap-beijing.myqcloud.com/users/5_jackie/custom-sticker/20260828/1787922154102_canvas.png",
          width: 1080,
          height: 1080,
          aspectRatio: 1,
          meta: { html: currentCanvasHtml, source: "autonomous-test" },
        });
        const customStickerId = cRes.data.data?.id || cRes.data.data;
        const iRes = await client.post("/custom-sticker/import-to-sticker", { customStickerId });
        const stickerId = iRes.data.data?.id || iRes.data.data?.stickerId || iRes.data.data;

        savedStickers.push({ customStickerId, stickerId, name: sName });
        toolResult = {
          success: true,
          message: `贴纸「${sName}」已保存`,
          data: { customStickerId, stickerId, name: sName },
        };
        console.log(`     💾 保存贴纸: ${sName} (ID: ${customStickerId})`);
      } else if (fnName === "canvas_clear") {
        currentCanvasHtml = "";
        toolResult = { success: true, message: "画布已清空" };
      } else if (fnName === "material_createImageGroup") {
        let stickerIds = args.stickerIds || [];
        if (stickerIds.length === 0) {
          stickerIds = savedStickers.map((s) => s.customStickerId);
        }

        const gRes = await client.post("/image-group", {
          name: args.name,
          description: args.description || "Agent 打包组图",
          stickers: stickerIds.map((id, idx) => ({ stickerId: id, sortOrder: idx })),
        });
        const gId = gRes.data.data?.id;
        createdGroupIds.push(gId);
        toolResult = { success: true, message: `组图已创建`, data: { groupId: gId } };
        console.log(`     🎉 创建组图: ${args.name} (GroupID: ${gId})`);
      }

      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: JSON.stringify(toolResult),
      });
    }
  }

  // 断言与核查
  console.log(`\n  📊 [结果核验]`);
  console.log(`     - 目标贴纸数: ${expectedStickersCount}，实际生成数: ${savedStickers.length}`);
  console.log(`     - 目标组图数: ${expectedGroupsCount}，实际生成数: ${createdGroupIds.length}`);

  const stickerPass = savedStickers.length >= expectedStickersCount;
  const groupPass = createdGroupIds.length >= expectedGroupsCount;

  if (stickerPass && groupPass) {
    console.log(`  ✅ [PASS] 场景 "${scenarioName}" 100% 达成！`);
    return true;
  } else {
    console.error(`  ❌ [FAIL] 场景 "${scenarioName}" 未达预期！`);
    return false;
  }
}

async function runAutonomousSuite() {
  console.log("================================================================================");
  console.log("⚡ 启动无人值守全自动 Agent 测试与评估系统");
  console.log("================================================================================");

  // 获取 AI 配置
  const keyRes = await client.post("/user/get-api-key", { feature: "ai.agent.execute" });
  const keyData = keyRes.data.data;
  const apiKey = decryptKey(keyData.encryptedKey);
  const baseURL = (keyData.config?.baseURL || "http://49.232.186.238:3000/v1").replace(/\/+$/, "");
  const model = keyData.config?.model || "mymodel";

  const llmClient = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    timeout: 120000,
  });

  const scenarioResults = [];

  // 场景 1: 单图设计
  const r1 = await runScenario(
    "单图海报设计",
    "设计一张简约黄色科技发布会海报（单张设计，完成后保存贴纸）",
    0,
    1,
    llmClient,
    model
  );
  scenarioResults.push({ name: "单图海报设计", pass: r1 });

  // 场景 2: 双图组图（对联/名片正反面）
  const r2 = await runScenario(
    "春节对联组图（上联+下联）",
    "设计一套喜庆金色新春对联（包含上联和下联2张，每张完成后分别保存，最后打包为组图）",
    1,
    2,
    llmClient,
    model
  );
  scenarioResults.push({ name: "春节对联双图组图", pass: r2 });

  // 场景 3: 批量制作 2 套组图 (共 4 张)
  const r3 = await runScenario(
    "批量制作 2 套黄色卡片组图",
    "制作 2 套黄色主题卡片组图，每套包含 2 张卡片，共 4 张。每套制作完成后分别为其创建独立的组图。",
    2,
    4,
    llmClient,
    model
  );
  scenarioResults.push({ name: "批量2套卡片组图", pass: r3 });

  console.log("\n================================================================================");
  console.log("🏁 全自动 Agent 场景测试全部完成");
  console.log("================================================================================");
  scenarioResults.forEach((sr, idx) => {
    console.log(`  ${idx + 1}. [${sr.pass ? "PASS" : "FAIL"}] ${sr.name}`);
  });

  const allPassed = scenarioResults.every((s) => s.pass);
  console.log(`\n最终状态: ${allPassed ? "🎉 全部场景 100% 成功通过！" : "⚠️ 存在未通过项，需针对性优化"}`);
  console.log("================================================================================\n");
}

runAutonomousSuite().catch((e) => console.error("评估系统异常:", e));
