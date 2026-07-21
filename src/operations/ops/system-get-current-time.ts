import { registerOperation } from "../registry";

registerOperation({
  id: "system.getCurrentTime",
  name: "system.getCurrentTime",
  description:
    "获取系统当前的精确时间、时区、ISO 时间戳以及今天、本周的起始与结束时间区间。在回答关于系统当前时间或计算相对时间段时调用。",
  group: "system",
  params: [],
  execute: async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const formattedLocal = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const timestamp = now.getTime();
    const iso = now.toISOString();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    return {
      success: true,
      message: `当前系统精确时间：${formattedLocal}`,
      data: {
        now: formattedLocal,
        timestamp,
        iso,
        timezone: "Asia/Shanghai (GMT+8)",
        today: {
          date: `${year}-${month}-${day}`,
          start: startOfToday.toISOString(),
          end: endOfToday.toISOString(),
        },
      },
    };
  },
});
