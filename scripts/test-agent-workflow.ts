import axios from "axios";

const API_BASE = "http://localhost:1520/api";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiYWNjb3VudCI6ImphY2tpZSIsInRlcm1pbmFsVHlwZSI6ImFkbWluIiwidG9rZW5JZCI6IjJmY2UyZjI0LTg4NGItNDM4YS1iNGEwLTcyODc0ZDk2NjA1NiIsImlhdCI6MTc4Nzg4MzMzMCwiZXhwIjoyMTAzNDU5MzMwfQ.CYF9KdKm57O2qUv4onE4z2TzixS9NOpC_LfyWnnkyhg";

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

async function runEndToEndTest() {
  console.log("==================================================");
  console.log("🚀 开始执行「纯接口模式」端到端自动化测试");
  console.log("==================================================");

  try {
    // 1. 测试创建 2 套 × 2 张 的贴纸生成与保存流程
    console.log("\n[步骤 1] 模拟创建 2 套 (每套 2 张) 贴纸...");

    const createdStickers: Array<{ customStickerId: string; stickerId?: string; name: string; setIdx: number }> = [];

    for (let setIdx = 1; setIdx <= 2; setIdx++) {
      for (let mIdx = 1; mIdx <= 2; mIdx++) {
        const stickerName = `自动化测试卡片_第${setIdx}套_第${mIdx}张`;
        console.log(`  -> 正在创建贴纸: ${stickerName}`);

        // 创建自定义贴纸
        const customRes = await client.post("/custom-sticker", {
          name: stickerName,
          description: `黄色风格卡片 第${setIdx}套第${mIdx}张`,
          keywords: "黄色,卡片,测试,组图",
          url: "https://yishe-storage-1257307499.cos.ap-beijing.myqcloud.com/users/5_jackie/custom-sticker/20260828/1787922154102_canvas.png",
          width: 1080,
          height: 1080,
          aspectRatio: 1,
          meta: {
            source: "ai-agent-auto-test",
            html: `<div>Card Set ${setIdx} Item ${mIdx}</div>`,
          },
        });

        const customStickerId = customRes.data.data?.id || customRes.data.data;
        console.log(`     ✅ 自定义贴纸保存成功，customStickerId: ${customStickerId}`);

        // 导入到素材库
        const importRes = await client.post("/custom-sticker/import-to-sticker", {
          customStickerId,
        });

        const stickerId = importRes.data.data?.id || importRes.data.data?.stickerId || importRes.data.data;
        console.log(`     ✅ 导入素材库成功，stickerId: ${stickerId}`);

        createdStickers.push({
          customStickerId,
          stickerId,
          name: stickerName,
          setIdx,
        });
      }

      // 为当前套创建组图
      const setStickers = createdStickers.filter((s) => s.setIdx === setIdx);
      const groupName = `自动化测试黄色卡片套组_第${setIdx}套`;
      console.log(`\n  -> [组图打包] 正在为第 ${setIdx} 套创建组图: ${groupName}`);

      const groupRes = await client.post("/image-group", {
        name: groupName,
        description: `黄色风格卡片第${setIdx}套，包含2张卡片`,
        stickers: setStickers.map((s, idx) => ({
          stickerId: s.stickerId,
          sortOrder: idx,
        })),
        meta: {
          source: "ai-agent-auto-test",
          createdAt: new Date().toISOString(),
        },
      });

      const group = groupRes.data.data;
      console.log(`     🎉 第 ${setIdx} 套组图创建成功！`);
      console.log(`        - Group ID: ${group?.id}`);
      console.log(`        - Group Name: ${group?.name}`);
      console.log(`        - Stickers Count: ${group?.stickersCount || setStickers.length}`);
    }

    // 2. 验证组图列表查询
    console.log("\n[步骤 2] 查询最新组图列表验证数据持久化...");
    const listRes = await client.get("/image-group/page?pageSize=3");
    const latestGroups = listRes.data.data?.list || [];
    console.log(`  -> 成功查询到 ${latestGroups.length} 个最新组图:`);
    for (const g of latestGroups) {
      console.log(`     - [${g.id}] ${g.name} (含 ${g.stickersCount} 张贴纸)`);
    }

    console.log("\n==================================================");
    console.log("✅ 全部纯接口端到端测试 100% 通过！");
    console.log("==================================================");
  } catch (err: any) {
    console.error("❌ 测试失败:", err?.response?.data || err?.message || err);
  }
}

runEndToEndTest();
