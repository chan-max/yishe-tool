const axios = require("axios");

const API_BASE = "http://localhost:1520/api";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiYWNjb3VudCI6ImphY2tpZSIsInRlcm1pbmFsVHlwZSI6ImFkbWluIiwidG9rZW5JZCI6IjJmY2UyZjI0LTg4NGItNDM4YS1iNGEwLTcyODc0ZDk2NjA1NiIsImlhdCI6MTc4Nzg4MzMzMCwiZXhwIjoyMTAzNDU5MzMwfQ.CYF9KdKm57O2qUv4onE4z2TzixS9NOpC_LfyWnnkyhg";

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

const results = {
  passed: 0,
  failed: 0,
  details: [],
};

function recordResult(name, success, info = "") {
  if (success) {
    results.passed++;
    console.log(`  ✅ [PASS] ${name} ${info}`);
    results.details.push({ name, status: "PASS", info });
  } else {
    results.failed++;
    console.error(`  ❌ [FAIL] ${name} ${info}`);
    results.details.push({ name, status: "FAIL", info });
  }
}

async function runAllTests() {
  console.log("================================================================================");
  console.log("🧪 启动全链路全面自动化测试套件：单图 / 组图 / 批量多套 / 图库与组图核查");
  console.log("================================================================================");

  const timestamp = Date.now();

  // ==========================================
  // 测试 1: 单图制作与图库检查
  // ==========================================
  console.log("\n--------------------------------------------------------------------------------");
  console.log("【测试 1】单图制作 (Single Sticker Creation & Library Check)");
  console.log("--------------------------------------------------------------------------------");
  try {
    const singleName = `自动化单图测试_${timestamp}`;
    const createRes = await client.post("/custom-sticker", {
      name: singleName,
      description: "纯色极简单图设计测试",
      keywords: "单图,测试,极简",
      url: "https://yishe-storage-1257307499.cos.ap-beijing.myqcloud.com/users/5_jackie/custom-sticker/20260828/1787922154102_canvas.png",
      width: 800,
      height: 800,
      aspectRatio: 1,
      meta: { testType: "single-test", timestamp },
    });
    const customStickerId = createRes.data.data?.id || createRes.data.data;
    recordResult("1.1 创建自定义贴纸", !!customStickerId, `ID: ${customStickerId}`);

    const importRes = await client.post("/custom-sticker/import-to-sticker", { customStickerId });
    const stickerId = importRes.data.data?.id || importRes.data.data?.stickerId || importRes.data.data;
    recordResult("1.2 导入贴纸到素材库", !!stickerId, `StickerID: ${stickerId}`);

    // 去图库检查
    const listRes = await client.get(`/custom-sticker?searchText=${encodeURIComponent(singleName)}`);
    const customItems = listRes.data.data?.items || listRes.data.data?.list || [];
    const foundCustom = customItems.find((item) => item.id === customStickerId);
    recordResult(
      "1.3 自定义贴纸库查询核验",
      !!foundCustom && foundCustom.imported === true,
      `找到贴纸，imported 标志为 ${foundCustom?.imported}, importedStickerId: ${foundCustom?.importedStickerId}`
    );
  } catch (err) {
    recordResult("1. 单图制作流程", false, err.response?.data?.message || err.message);
  }

  // ==========================================
  // 测试 2: 标准双图组图 (2 张 1 套)
  // ==========================================
  console.log("\n--------------------------------------------------------------------------------");
  console.log("【测试 2】标准组图制作 (Single Set Image Group - 2 Members)");
  console.log("--------------------------------------------------------------------------------");
  try {
    const groupName = `自动化双图组图_${timestamp}`;
    const groupMemberIds = [];

    for (let i = 1; i <= 2; i++) {
      const memberName = `${groupName}_成员${i}`;
      const cRes = await client.post("/custom-sticker", {
        name: memberName,
        description: `双图组图测试第 ${i} 张`,
        keywords: "组图,测试,双图",
        url: "https://yishe-storage-1257307499.cos.ap-beijing.myqcloud.com/users/5_jackie/custom-sticker/20260828/1787922154102_canvas.png",
        width: 1080,
        height: 1080,
        aspectRatio: 1,
      });
      const cId = cRes.data.data?.id || cRes.data.data;
      const iRes = await client.post("/custom-sticker/import-to-sticker", { customStickerId: cId });
      const sId = iRes.data.data?.id || iRes.data.data?.stickerId || iRes.data.data;
      groupMemberIds.push(sId);
    }
    recordResult("2.1 准备 2 个组图成员素材", groupMemberIds.length === 2, `成员IDs: ${groupMemberIds.join(", ")}`);

    const gRes = await client.post("/image-group", {
      name: groupName,
      description: "自动化测试创建的标准双图组图",
      stickers: groupMemberIds.map((id, idx) => ({ stickerId: id, sortOrder: idx })),
    });
    const createdGroup = gRes.data.data;
    recordResult("2.2 创建组图实体", !!createdGroup?.id, `GroupID: ${createdGroup?.id}`);

    // 去组图库检查
    const gListRes = await client.get("/image-group/page?pageSize=10");
    const foundGroup = gListRes.data.data?.list?.find((g) => g.id === createdGroup.id);
    const hasCorrectCount = foundGroup?.stickersCount === 2;
    recordResult(
      "2.3 组图库列表核查与关联关系",
      !!foundGroup && hasCorrectCount,
      `组图名: ${foundGroup?.name}, 包含贴纸数: ${foundGroup?.stickersCount}`
    );
  } catch (err) {
    recordResult("2. 标准组图制作流程", false, err.response?.data?.message || err.message);
  }

  // ==========================================
  // 测试 3: 批量制作多套组图 (3 套 × 每套 2 张 = 6 张贴纸)
  // ==========================================
  console.log("\n--------------------------------------------------------------------------------");
  console.log("【测试 3】批量多套组图制作 (Multi-Set Batch: 3 Sets × 2 Members = 6 Stickers)");
  console.log("--------------------------------------------------------------------------------");
  try {
    const totalSets = 3;
    const membersPerSet = 2;
    const createdGroups = [];

    for (let setIdx = 1; setIdx <= totalSets; setIdx++) {
      const setGroupName = `批量多套测试_第${setIdx}套_${timestamp}`;
      const setMemberIds = [];

      for (let mIdx = 1; mIdx <= membersPerSet; mIdx++) {
        const itemRes = await client.post("/custom-sticker", {
          name: `${setGroupName}_卡片${mIdx}`,
          description: `第 ${setIdx} 套卡片第 ${mIdx} 张`,
          keywords: "批量,多套,测试",
          url: "https://yishe-storage-1257307499.cos.ap-beijing.myqcloud.com/users/5_jackie/custom-sticker/20260828/1787922154102_canvas.png",
          width: 1080,
          height: 1080,
          aspectRatio: 1,
        });
        const cId = itemRes.data.data?.id || itemRes.data.data;
        const iRes = await client.post("/custom-sticker/import-to-sticker", { customStickerId: cId });
        const sId = iRes.data.data?.id || iRes.data.data?.stickerId || iRes.data.data;
        setMemberIds.push(sId);
      }

      const gRes = await client.post("/image-group", {
        name: setGroupName,
        description: `批量多套测试第${setIdx}套组图`,
        stickers: setMemberIds.map((id, idx) => ({ stickerId: id, sortOrder: idx })),
      });
      createdGroups.push(gRes.data.data);
      recordResult(
        `3.1 [第${setIdx}套] 制作2张贴纸并打包组图`,
        !!gRes.data.data?.id,
        `GroupID: ${gRes.data.data?.id}`
      );
    }

    recordResult("3.2 批量制作 3 套组图全部完成", createdGroups.length === 3, `已创建 ${createdGroups.length} 个独立套组`);

    // 检查组图库
    const gListRes = await client.get("/image-group/page?pageSize=20");
    const allFound = createdGroups.every((cg) => {
      const match = gListRes.data.data?.list?.find((g) => g.id === cg.id);
      return match && match.stickersCount === 2;
    });
    recordResult("3.3 组图库多套持久化核验", allFound, "所有 3 套组图均独立存在且贴纸数量完全匹配");
  } catch (err) {
    recordResult("3. 批量多套组图流程", false, err.response?.data?.message || err.message);
  }

  // ==========================================
  // 测试 4: 批量独立单图制作 (4 张独立单图)
  // ==========================================
  console.log("\n--------------------------------------------------------------------------------");
  console.log("【测试 4】批量独立单图制作 (Batch Independent Singles - 4 Stickers)");
  console.log("--------------------------------------------------------------------------------");
  try {
    const singleIds = [];
    for (let i = 1; i <= 4; i++) {
      const sName = `批量单图_${i}_${timestamp}`;
      const cRes = await client.post("/custom-sticker", {
        name: sName,
        description: `独立单图批量测试第 ${i} 张`,
        keywords: "独立,单图,批量",
        url: "https://yishe-storage-1257307499.cos.ap-beijing.myqcloud.com/users/5_jackie/custom-sticker/20260828/1787922154102_canvas.png",
        width: 1080,
        height: 1080,
        aspectRatio: 1,
      });
      const cId = cRes.data.data?.id || cRes.data.data;
      const iRes = await client.post("/custom-sticker/import-to-sticker", { customStickerId: cId });
      const sId = iRes.data.data?.id || iRes.data.data?.stickerId || iRes.data.data;
      singleIds.push(sId);
    }
    recordResult("4.1 批量生成 4 张独立贴纸并导入素材库", singleIds.length === 4, `共创建 ${singleIds.length} 张`);

    // 检查图库列表
    const customList = await client.get("/custom-sticker?pageSize=20");
    const list = customList.data.data?.items || customList.data.data?.list || [];
    const hasSingles = singleIds.every((id) => list.some((c) => c.importedStickerId === id));
    recordResult("4.2 自定义图库批量同步核查", hasSingles, "4 张贴纸在图库中均已建立正确索引");
  } catch (err) {
    recordResult("4. 批量独立单图流程", false, err.response?.data?.message || err.message);
  }

  // ==========================================
  // 总结报告
  // ==========================================
  console.log("\n================================================================================");
  console.log("📊 自动化测试套件执行总结报告");
  console.log("================================================================================");
  console.log(`总测试项: ${results.passed + results.failed}`);
  console.log(`通过项 (PASS): ${results.passed}`);
  console.log(`失败项 (FAIL): ${results.failed}`);
  console.log(`通过率: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  console.log("================================================================================\n");
}

runAllTests();
