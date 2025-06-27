import { isAutomationRunning, automationDescription } from '@/store/stores/app';

/**
 * 开始自动化操作
 * @param description 操作描述
 */
export function startAutomation(description: string = '') {
  isAutomationRunning.value = true;
  automationDescription.value = description;
}

/**
 * 结束自动化操作
 */
export function stopAutomation() {
  isAutomationRunning.value = false;
  automationDescription.value = '';
}

/**
 * 更新自动化操作描述
 * @param description 新的操作描述
 */
export function updateAutomationDescription(description: string) {
  automationDescription.value = description;
}

/**
 * 自动化操作包装器
 * @param operation 要执行的操作函数
 * @param description 操作描述
 * @returns Promise
 */
export async function withAutomation<T>(
  operation: () => Promise<T>,
  description: string = '正在处理...'
): Promise<T> {
  try {
    startAutomation(description);
    const result = await operation();
    return result;
  } finally {
    stopAutomation();
  }
} 