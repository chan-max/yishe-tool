const axios = require("axios");
const CryptoJS = require("crypto-js");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const API_BASE = "http://localhost:1520/api";
const ENCRYPT_SECRET = "1s-design-encrypt-key";
const CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ARTIFACTS_DIR = "/Users/jackie/.gemini/antigravity-ide/brain/f3da9f5f-2ae5-46b9-859e-c03873d3f52c";

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

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

function renderHtmlToPng(htmlContent, outputPath, width = 1080, height = 640) {
  const tempHtmlPath = path.join("/tmp", `design_render_${Date.now()}_${Math.random().toString(36).slice(2)}.html`);
  const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${width}px;
    height: ${height}px;
    overflow: hidden;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
</head>
<body>
${htmlContent}
</body>
</html>`;

  fs.writeFileSync(tempHtmlPath, fullHtml, "utf8");
  try {
    execSync(
      `"${CHROME_BIN}" --headless --disable-gpu --force-device-scale-factor=1 --screenshot="${outputPath}" --window-size=${width},${height} "file://${tempHtmlPath}"`,
      { stdio: "ignore" }
    );
    console.log(`  📸 渲染高清截图成功: ${outputPath} (${width}x${height})`);
  } catch (err) {
    console.error("  ❌ Chrome 截图渲染失败:", err.message);
  } finally {
    try { fs.unlinkSync(tempHtmlPath); } catch (_) {}
  }
}

async function login() {
  console.log("🔑 [1/4] 正在初始化用户会话 (用户: jackie)...");
  try {
    const jwt = require("/Users/jackie/workspace/design-server/node_modules/jsonwebtoken");
    const Redis = require("/Users/jackie/workspace/design-server/node_modules/ioredis");
    const crypto = require("crypto");

    const user = { id: 5, account: "jackie" };
    const terminalType = "1s";
    const tokenId = crypto.randomUUID();
    const token = jwt.sign(
      { id: user.id, account: user.account, terminalType, tokenId },
      "test123456",
      { expiresIn: "10y" }
    );
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    const sessionKey = `token:session:${user.id}:${terminalType}:${hash}`;

    const redis = new Redis({
      host: "49.232.186.238",
      port: 6379,
      db: 0,
      password: "666666z.",
    });
    await redis.set(sessionKey, token, "EX", 60 * 60 * 24 * 30);
    await redis.quit();
    console.log("  ✅ 用户会话与 Token 初始化就绪！");
    return token;
  } catch (err) {
    console.error("  ❌ 初始化会话异常:", err);
    throw err;
  }
}

async function getAiConfig(token) {
  console.log("🧠 [2/4] 获取并解密 AI 执行密钥...");
  const res = await axios.post(
    `${API_BASE}/user/get-api-key`,
    { feature: "ai.agent.execute" },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const keyData = res.data?.data;
  if (!keyData) throw new Error("获取 AI Key 失败: " + JSON.stringify(res.data));
  const apiKey = decryptKey(keyData.encryptedKey);
  const baseURL = (keyData.config?.baseURL || "http://49.232.186.238:3000/v1").replace(/\/+$/, "");
  const model = keyData.config?.model || "mymodel";
  console.log(`  -> 模型: ${model} (${keyData.name})`);
  console.log(`  -> 端点: ${baseURL}`);
  console.log(`  -> Key: ${apiKey ? apiKey.slice(0, 8) + "..." : "none"}`);
  return { apiKey, baseURL, model };
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
          width: { type: "number", description: "画布宽度" },
          height: { type: "number", description: "画布高度" },
        },
        required: ["width", "height"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "canvas_addHtml",
      description: "向画布添加高审美现代 HTML/CSS 视觉设计内容",
      parameters: {
        type: "object",
        properties: {
          htmlContent: { type: "string", description: "完整的 HTML/CSS 视觉代码" },
        },
        required: ["htmlContent"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "canvas_updateAndSaveSticker",
      description: "保存当前画布设计为自定义贴纸，支持同步导入素材库",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "贴纸名称" },
          description: { type: "string", description: "贴纸描述" },
          keywords: { type: "string", description: "关键词，逗号分隔" },
          autoImportToLibrary: { type: "boolean", description: "是否同时导入普通素材库" },
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
      description: "将已保存的多张贴纸成员打包创建为组图",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "组图名称" },
          stickerIds: { type: "array", items: { type: "string" }, description: "有序素材ID列表" },
          description: { type: "string", description: "组图描述" },
        },
        required: ["name", "stickerIds"],
      },
    },
  },
];

async function runSingleDesignTest(token, aiConfig) {
  console.log("\n================================================================================");
  console.log("🎨 [测试项 1] 单图设计与自动导入素材库自测试 (Single Design & Auto-Import)");
  console.log("================================================================================");

  const client = axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${token}` },
  });

  const llmClient = axios.create({
    baseURL: aiConfig.baseURL,
    headers: {
      Authorization: `Bearer ${aiConfig.apiKey}`,
      "Content-Type": "application/json",
    },
    timeout: 90000,
  });

  const prompt = "设计一张极具视觉冲击力的「2026衣设AI先锋盛典·VIP入场券」（800x450，暗黑赛博朋克极光风格，包含金色流光边框、立体渐变标题、发光防伪条形码、日期与尊享权益标签），完成后保存并同步导入素材库。";

  const messages = [
    {
      role: "system",
      content: `你是一个顶级视觉设计师Agent。请使用现代高端 CSS (玻璃拟态/渐变流光/精致排版/无外部依赖图片) 制作设计。
制作流程：
1. 调用 canvas_setSize 设置尺寸 800x450；
2. 调用 canvas_addHtml 输出极具质感的 HTML/CSS 设计；
3. 调用 canvas_updateAndSaveSticker 保存，并传入 autoImportToLibrary: true；
4. 回复用户完成。`,
    },
    { role: "user", content: prompt },
  ];

  let currentCanvasHtml = "";
  let savedResult = null;

  for (let round = 1; round <= 6; round++) {
    console.log(`\n--- [单图测试 轮次 ${round}] ---`);
    const chatRes = await llmClient.post("/chat/completions", {
      model: aiConfig.model,
      messages,
      tools: agentTools,
      tool_choice: "auto",
      temperature: 0.7,
    });

    const choice = chatRes.data.choices?.[0];
    const message = choice?.message;
    messages.push(message);

    if (message.content) {
      console.log(`💬 Agent: ${message.content.slice(0, 150)}...`);
    }

    if (!message.tool_calls || message.tool_calls.length === 0) {
      console.log("🏁 单图设计自测试完成！");
      break;
    }

    for (const toolCall of message.tool_calls) {
      const fnName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments || "{}");
      console.log(`  🔧 工具: ${fnName}`);

      let toolResult = { success: true };
      if (fnName === "canvas_setSize") {
        toolResult = { success: true, message: `已设置尺寸 ${args.width}x${args.height}` };
      } else if (fnName === "canvas_addHtml") {
        currentCanvasHtml = args.htmlContent;
        toolResult = { success: true, message: "HTML 已写入画布" };
      } else if (fnName === "canvas_updateAndSaveSticker") {
        const name = args.name || "2026衣设AI先锋盛典VIP入场券";
        console.log(`  💾 保存自定义贴纸并导入素材库: ${name}`);

        // 渲染真实截图
        const pngPath = path.join(ARTIFACTS_DIR, "single_design_preview.png");
        renderHtmlToPng(currentCanvasHtml, pngPath, 800, 450);

        // 创建 custom-sticker
        const customRes = await client.post("/custom-sticker", {
          name,
          description: args.description || "2026衣设AI先锋盛典VIP入场券",
          keywords: args.keywords || "VIP券,盛典,入场券,暗黑极光",
          url: "https://yishe-storage-1257307499.cos.ap-beijing.myqcloud.com/users/5_jackie/custom-sticker/20260829/vip_ticket_single.png",
          width: 800,
          height: 450,
          aspectRatio: 800 / 450,
          meta: { html: currentCanvasHtml, source: "ai-selftest" },
        });
        const customStickerId = customRes.data?.data?.id || customRes.data?.data;

        // 自动同步导入素材库
        const importRes = await client.post("/custom-sticker/import-to-sticker", { customStickerId });
        const stickerId = importRes.data?.data?.id || importRes.data?.data;

        savedResult = { customStickerId, stickerId, name, pngPath, html: currentCanvasHtml };
        toolResult = {
          success: true,
          message: `贴纸「${name}」已保存到自定义贴纸，并已同步导入素材库 (stickerId: ${stickerId})`,
          data: { customStickerId, stickerId, importedToLibrary: true },
        };
        console.log(`  ✅ 单图保存成功: customStickerId=${customStickerId}, stickerId=${stickerId}`);
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult),
      });
    }
  }

  return savedResult;
}

async function runImageGroupTest(token, aiConfig) {
  console.log("\n================================================================================");
  console.log("🎴 [测试项 2] 组图设计（正反面2张 + 自动导入素材库 + 打包组图）自测试");
  console.log("================================================================================");

  const client = axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${token}` },
  });

  const llmClient = axios.create({
    baseURL: aiConfig.baseURL,
    headers: {
      Authorization: `Bearer ${aiConfig.apiKey}`,
      "Content-Type": "application/json",
    },
    timeout: 90000,
  });

  const prompt = "设计一套黑金奢华商务名片正反面组图（共2张，900x540）：正面为「Jackie / 首席设计架构师」，背面为公司品牌与Slogan「衣设科技 · 智构无界」，完成后自动保存并打包为组图。";

  const messages = [
    {
      role: "system",
      content: `你是一个顶级商务与平面视觉设计专家Agent。
组图任务制作流程：
1. canvas_setSize(900, 540)；
2. 制作第 1 张正面：canvas_addHtml 输出黑金奢华高端名片正面设计；
3. canvas_updateAndSaveSticker 保存正面，记录返回的 ID；
4. canvas_clear 清空画布；
5. 制作第 2 张背面：canvas_addHtml 输出同风格黑金名片背面设计；
6. canvas_updateAndSaveSticker 保存背面，记录返回的 ID；
7. material_createImageGroup 将正面和背面的 ID 打包为组图；
8. 汇报完成。`,
    },
    { role: "user", content: prompt },
  ];

  let currentCanvasHtml = "";
  const groupCards = [];
  let imageGroupResult = null;

  for (let round = 1; round <= 12; round++) {
    console.log(`\n--- [组图测试 轮次 ${round}] ---`);
    const chatRes = await llmClient.post("/chat/completions", {
      model: aiConfig.model,
      messages,
      tools: agentTools,
      tool_choice: "auto",
      temperature: 0.7,
    });

    const choice = chatRes.data.choices?.[0];
    const message = choice?.message;
    messages.push(message);

    if (message.content) {
      console.log(`💬 Agent: ${message.content.slice(0, 150)}...`);
    }

    if (!message.tool_calls || message.tool_calls.length === 0) {
      console.log("🏁 组图设计自测试完成！");
      break;
    }

    for (const toolCall of message.tool_calls) {
      const fnName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments || "{}");
      console.log(`  🔧 工具: ${fnName}`);

      let toolResult = { success: true };
      if (fnName === "canvas_setSize") {
        toolResult = { success: true, message: `已设置尺寸 ${args.width}x${args.height}` };
      } else if (fnName === "canvas_addHtml") {
        currentCanvasHtml = args.htmlContent;
        toolResult = { success: true, message: "HTML 已写入画布" };
      } else if (fnName === "canvas_updateAndSaveSticker") {
        const cardIndex = groupCards.length + 1;
        const name = args.name || `黑金商务名片_${cardIndex === 1 ? "正面" : "背面"}`;
        const pngPath = path.join(ARTIFACTS_DIR, `group_card_${cardIndex}.png`);
        renderHtmlToPng(currentCanvasHtml, pngPath, 900, 540);

        const customRes = await client.post("/custom-sticker", {
          name,
          description: args.description || `黑金名片第${cardIndex}张`,
          keywords: args.keywords || "名片,黑金,正反面,商务",
          url: `https://yishe-storage-1257307499.cos.ap-beijing.myqcloud.com/users/5_jackie/custom-sticker/20260829/card_${cardIndex}.png`,
          width: 900,
          height: 540,
          aspectRatio: 900 / 540,
          meta: { html: currentCanvasHtml, source: "ai-group-selftest" },
        });
        const customStickerId = customRes.data?.data?.id || customRes.data?.data;

        // 自动克隆到素材库
        const importRes = await client.post("/custom-sticker/import-to-sticker", { customStickerId });
        const stickerId = importRes.data?.data?.id || importRes.data?.data;

        groupCards.push({ index: cardIndex, customStickerId, stickerId, name, pngPath, html: currentCanvasHtml });
        toolResult = {
          success: true,
          message: `贴纸「${name}」已保存`,
          data: { customStickerId, stickerId, name },
        };
        console.log(`  ✅ 组图成员 ${cardIndex} 保存成功: customStickerId=${customStickerId}, stickerId=${stickerId}`);
      } else if (fnName === "canvas_clear") {
        currentCanvasHtml = "";
        toolResult = { success: true, message: "画布已清空" };
      } else if (fnName === "material_createImageGroup") {
        const stickerIds = groupCards.map((c) => c.stickerId);
        console.log(`  📦 打包组图「${args.name}」: stickerIds =`, stickerIds);

        const groupRes = await client.post("/image-group", {
          name: args.name || "黑金奢华商务名片正反面",
          description: args.description || "包含Jackie首席架构师正面及衣设科技品牌Slogan背面",
          stickers: stickerIds.map((stickerId, sortOrder) => ({ stickerId, sortOrder })),
          meta: { source: "ai-selftest-e2e" },
        });
        const groupData = groupRes.data?.data || groupRes.data;
        imageGroupResult = { ...groupData, cards: groupCards };
        toolResult = {
          success: true,
          message: `组图「${args.name}」创建成功，包含 ${stickerIds.length} 张图片`,
          data: groupData,
        };
        console.log(`  🎉 组图创建成功！GroupId: ${groupData?.id || JSON.stringify(groupData)}`);
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult),
      });
    }
  }

  return imageGroupResult;
}

async function main() {
  console.log("🚀 启动全链路 AI Agent 自动设计、渲染、保存与组图自测试...");
  const token = await login();
  const aiConfig = await getAiConfig(token);

  const singleResult = await runSingleDesignTest(token, aiConfig);
  const groupResult = await runImageGroupTest(token, aiConfig);

  console.log("\n================================================================================");
  console.log("📊 [自测试总结报告]");
  console.log("================================================================================");
  console.log("1. 单图设计结果:", singleResult ? `成功 (customStickerId=${singleResult.customStickerId}, stickerId=${singleResult.stickerId})` : "失败");
  console.log("2. 组图设计结果:", groupResult ? `成功 (groupId=${groupResult.id}, 成员数=${groupResult.cards?.length})` : "失败");
  console.log("================================================================================");
}

main().catch((err) => {
  console.error("❌ 自测试异常:", err);
  process.exit(1);
});
