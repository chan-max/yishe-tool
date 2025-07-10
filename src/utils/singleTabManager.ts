/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-07-10 08:17:03
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-10 08:27:56
 * @FilePath: /design-server/Users/jackie/workspace/1s/src/utils/singleTabManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Description: 单标签页管理器 - 确保同时只有一个浏览器标签页打开系统
 */

// 单标签页管理功能
export function setupSingleTabManager() {
  const TAB_KEY = 'design_system_active_tab';
  const currentTabId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  
  // 检查是否已有其他标签页打开
  const existingTabId = localStorage.getItem(TAB_KEY);
  const currentTime = Date.now();
  
  if (existingTabId && existingTabId !== currentTabId) {
    // 检查现有标签页是否还在活跃（5秒内更新过）
    const lastUpdateTime = localStorage.getItem(`${TAB_KEY}_time`);
    if (lastUpdateTime && (currentTime - parseInt(lastUpdateTime)) < 5000) {
      // 有其他活跃标签页，关闭当前页面
      console.log('检测到其他活跃标签页，关闭当前页面');
      
      // 延迟1秒后尝试关闭窗口
      setTimeout(() => {
        window.close();
      }, 1000);
      return false;
    }
  }
  
  // 设置当前标签页为活跃标签页
  localStorage.setItem(TAB_KEY, currentTabId);
  localStorage.setItem(`${TAB_KEY}_time`, currentTime.toString());
  
  // 定期更新活跃状态（每2秒）
  let updateInterval = setInterval(() => {
    localStorage.setItem(`${TAB_KEY}_time`, Date.now().toString());
  }, 2000);
  
  // 监听storage事件，检测其他标签页的更新
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === `${TAB_KEY}_time` && e.newValue) {
      const newTime = parseInt(e.newValue);
      const currentTime = Date.now();
      
      // 如果其他标签页更新了时间戳，且比当前标签页更新，则关闭当前页面
      if (newTime > currentTime - 3000) { // 3秒内的更新认为是活跃的
        console.log('检测到其他标签页更新，关闭当前页面');
        clearInterval(updateInterval);
        window.removeEventListener('storage', handleStorageChange);
        window.close();
      }
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    clearInterval(updateInterval);
    window.removeEventListener('storage', handleStorageChange);
    // 如果当前标签页是活跃标签页，清除标记
    if (localStorage.getItem(TAB_KEY) === currentTabId) {
      localStorage.removeItem(TAB_KEY);
      localStorage.removeItem(`${TAB_KEY}_time`);
    }
  });
  
  // 页面隐藏时暂停更新，显示时恢复更新
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // 页面隐藏，暂停更新
      clearInterval(updateInterval);
    } else {
      // 页面显示，恢复更新
      updateInterval = setInterval(() => {
        localStorage.setItem(`${TAB_KEY}_time`, Date.now().toString());
      }, 2000);
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  console.log('单标签页管理器已启动');
  return true;
} 