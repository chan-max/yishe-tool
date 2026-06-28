import { ref } from "vue";

// 展示自动生成弹层
export const showAutocreateModal = ref(false);

// 重新导出 batchProgress 供其他组件使用
export { batchProgress } from "@/ai/agent/batch";