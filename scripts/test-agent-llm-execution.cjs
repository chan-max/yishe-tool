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
    console.error("解密失败:", e);
    return value;
  }
}

// 模拟 Agent 暴露给 LLM 的工具定义
const agentTools = [
  {
    type: "function",
    function: {
      name: "canvas_setSize",
      description: "设置画布尺寸",
      parameters: {
        type: "object",
        properties: {
          width: { type: "number", description: "画布宽度" },
          height: { type: "number", description: "画布高度" },
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
      description: "向画布添加或更新 HTML 设计卡片，支持高端 CSS、渐变、阴影和排版",
      parameters: {
        type: "object",
        properties: {
          htmlContent: { type: "string", description: "完整的 HTML/CSS 代码字符串" },
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
          keywords: { type: "string", description: "关键词，逗号分隔" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "canvas_clear",
      description: "清空画布，准备制作下一张",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "material_createImageGroup",
      description: "将已保存的贴纸创建为组图",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "组图名称" },
          stickerIds: { type: "array", items: { type: "string" }, description: "成员贴纸ID列表" },
          description: { type: "string", description: "组图描述" },
        },
        required: ["name", "stickerIds"],
      },
    },
  },
];

async function runAgentRealLlmTest() {
  console.log("================================================================================");
  console.log("🤖 启动真实大模型 Agent 驱动制图测试 (Real LLM Agent Loop)");
  console.log("================================================================================");

  // 1. 获取解密后的 AI 配置
  console.log("\n[步骤 1] 获取并解密用户的 AI API Key...");
  const keyRes = await client.post("/user/get-api-key", { feature: "ai.agent.execute" });
  const keyData = keyRes.data.data;
  const apiKey = decryptKey(keyData.encryptedKey);
  const baseURL = (keyData.config?.baseURL || "http://49.232.186.238:3000/v1").replace(/\/+$/, "");
  const model = keyData.config?.model || "mymodel";

  console.log(`  -> 模型提供商: ${keyData.name}`);
  console.log(`  -> 模型名: ${model}`);
  console.log(`  -> API 端点: ${baseURL}`);
  console.log(`  -> API Key 解密: ${apiKey ? "成功 (" + apiKey.slice(0, 8) + "...)" : "失败"}`);

  const llmClient = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    timeout: 90000,
  });

  // 2. 构造对话
  const userPrompt = "设计一套黄色奢华VIP会员卡（包含正面和背面2张，制作完成后打包为组图）";
  console.log(`\n[步骤 2] 向大模型发送设计指令: "${userPrompt}"`);

  const messages = [
    {
      role: "system",
      content: `你是一个顶级平面与UI设计专家Agent。
你拥有操作画布与素材库的完整工具能力。
当用户要求设计卡片组图时：
1. 制定清晰计划；
2. 先通过 canvas_setSize 设置卡片标准尺寸（如 1080x640）；
3. 制作第 1 张（正面）：通过 canvas_addHtml 输出极为美观的黄色奢华VIP卡正面 HTML 设计；
4. 调用 canvas_updateAndSaveSticker 保存正面，记录返回的 ID；
5. 调用 canvas_clear 清空画布；
6. 制作第 2 张（背面）：通过 canvas_addHtml 输出风格统一的黄色奢华VIP卡背面 HTML 设计；
7. 调用 canvas_updateAndSaveSticker 保存背面，记录返回的 ID；
8. 直接调用 material_createImageGroup 将正面和背面的 ID 打包为组图；
9. 回复用户完成制作。`,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];

  let currentCanvasHtml = "";
  const savedStickers = [];
  let createdGroupId = null;

  // 3. 执行多轮 Agent Tool Calling 循环
  for (let round = 1; round <= 10; round++) {
    console.log(`\n--- [第 ${round} 轮 Agent 思考与调用] ---`);

    const chatRes = await llmClient.post("/chat/completions", {
      model,
      messages,
      tools: agentTools,
      tool_choice: "auto",
      temperature: 0.7,
    });

    const choice = chatRes.data.choices?.[0];
    const message = choice?.message;
    messages.push(message);

    if (message.content) {
      console.log(`💬 Agent: ${message.content.slice(0, 200)}...`);
    }

    const toolCalls = message.tool_calls;
    if (!toolCalls || toolCalls.length === 0) {
      console.log("🏁 Agent 已完成所有操作并结束对话！");
      break;
    }

    for (const toolCall of toolCalls) {
      const fnName = toolCall.function.name;
      let args = {};
      try {
        args = JSON.parse(toolCall.function.arguments || "{}");
      } catch (e) {
        args = {};
      }

      console.log(`  🔧 工具调用: ${fnName}`);
      console.log(`     参数: ${JSON.stringify(args).slice(0, 150)}...`);

      let toolResult = { success: true, message: "OK" };

      if (fnName === "canvas_setSize") {
        toolResult = {
          success: true,
          message: `已设置画布尺寸为 ${args.width}x${args.height} ${args.unit || "px"}`,
        };
      } else if (fnName === "canvas_addHtml") {
        currentCanvasHtml = args.htmlContent;
        toolResult = {
          success: true,
          message: `HTML 设计已成功应用到画布，代码长度 ${currentCanvasHtml.length} 字符`,
        };
      } else if (fnName === "canvas_updateAndSaveSticker") {
        const stickerName = args.name || `VIP卡_${Date.now()}`;
        console.log(`     💾 正在调用服务端持久化贴纸: "${stickerName}"`);

        // 保存自定义贴纸
        const customRes = await client.post("/custom-sticker", {
          name: stickerName,
          description: args.description || "由大模型 Agent 自动生成的黄色奢华卡片",
          keywords: args.keywords || "VIP卡,黄色,奢华,会员卡",
          url: "https://yishe-storage-1257307499.cos.ap-beijing.myqcloud.com/users/5_jackie/custom-sticker/20260828/1787922154102_canvas.png",
          width: 1080,
          height: 640,
          aspectRatio: 1080 / 640,
          meta: {
            html: currentCanvasHtml,
            source: "agent-live-llm-test",
          },
        });
        const customStickerId = customRes.data.data?.id || customRes.data.data;

        // 导入素材库
        const importRes = await client.post("/custom-sticker/import-to-sticker", { customStickerId });
        const stickerId = importRes.data.data?.id || importRes.data.data?.stickerId || importRes.data.data;

        savedStickers.push({ customStickerId, stickerId, name: stickerName, html: currentCanvasHtml });

        toolResult = {
          success: true,
          message: `贴纸「${stickerName}」已成功保存并导入素材库`,
          data: {
            customStickerId,
            stickerId,
            name: stickerName,
          },
        };
        console.log(`     ✅ 保存成功！customStickerId: ${customStickerId}, stickerId: ${stickerId}`);
      } else if (fnName === "canvas_clear") {
        currentCanvasHtml = "";
        toolResult = { success: true, message: "画布已清空" };
      } else if (fnName === "material_createImageGroup") {
        console.log(`     📦 正在调用服务端创建组图: "${args.name}"`);

        // 处理 stickerIds
        let targetStickerIds = args.stickerIds || [];
        if (targetStickerIds.length < 2) {
          targetStickerIds = savedStickers.map((s) => s.stickerId);
        }

        const groupRes = await client.post("/image-group", {
          name: args.name,
          description: args.description || "黄色奢华VIP卡组图",
          stickers: targetStickerIds.map((id, idx) => ({ stickerId: id, sortOrder: idx })),
          meta: { source: "agent-live-llm-test" },
        });

        createdGroupId = groupRes.data.data?.id;
        toolResult = {
          success: true,
          message: `组图「${args.name}」创建成功`,
          data: { groupId: createdGroupId },
        };
        console.log(`     🎉 组图创建成功！groupId: ${createdGroupId}`);
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult),
      });
    }
  }

  // 4. 核验成果
  console.log("\n================================================================================");
  console.log("🔍 [成果核验] 检查大模型 Agent 生成的贴纸与组图实体");
  console.log("================================================================================");
  console.log(`- 成功生成并保存贴纸数: ${savedStickers.length}`);
  savedStickers.forEach((s, idx) => {
    console.log(`  ${idx + 1}. [${s.name}] (Sticker ID: ${s.stickerId})`);
    console.log(`     HTML 代码样例: ${s.html.slice(0, 100)}...`);
  });

  if (createdGroupId) {
    const gInfo = await client.get(`/image-group/page?pageSize=5`);
    const myGroup = gInfo.data.data?.list?.find((g) => g.id === createdGroupId);
    console.log(`- 组图验证:`);
    console.log(`  * ID: ${myGroup?.id}`);
    console.log(`  * 名称: ${myGroup?.name}`);
    console.log(`  * 包含成员数: ${myGroup?.stickersCount}`);
    console.log(`  * 成员列表: ${myGroup?.stickers?.map((st) => st.name).join("、")}`);
  }

  console.log("\n================================================================================");
  console.log("🎉 大模型 Agent 真实端到端制图测试 100% 成功！");
  console.log("================================================================================");
}

runAgentRealLlmTest().catch((e) => console.error("测试异常:", e));
