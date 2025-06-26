// 测试 window 挂载
console.log('开始测试 window 挂载...');

// 检查是否在浏览器环境
if (typeof window !== 'undefined') {
  console.log('✅ 在浏览器环境中');
  
  // 检查 puppeteerBridge 是否存在
  if (window.puppeteerBridge) {
    console.log('✅ window.puppeteerBridge 已存在');
    console.log('对象内容:', window.puppeteerBridge);
    
    // 测试方法是否存在
    if (typeof window.puppeteerBridge.navigateTo === 'function') {
      console.log('✅ navigateTo 方法存在');
    } else {
      console.log('❌ navigateTo 方法不存在');
    }
    
    if (typeof window.puppeteerBridge.clickElement === 'function') {
      console.log('✅ clickElement 方法存在');
    } else {
      console.log('❌ clickElement 方法不存在');
    }
    
    if (typeof window.puppeteerBridge.callApi === 'function') {
      console.log('✅ callApi 方法存在');
    } else {
      console.log('❌ callApi 方法不存在');
    }
    
  } else {
    console.log('❌ window.puppeteerBridge 不存在');
  }
  
  // 检查检查函数是否存在
  if (typeof window.checkPuppeteerBridge === 'function') {
    console.log('✅ checkPuppeteerBridge 函数存在');
    console.log('检查结果:', window.checkPuppeteerBridge());
  } else {
    console.log('❌ checkPuppeteerBridge 函数不存在');
  }
  
} else {
  console.log('❌ 不在浏览器环境中');
}

// 等待一段时间后再次检查
setTimeout(() => {
  console.log('\n延迟检查...');
  if (typeof window !== 'undefined' && window.puppeteerBridge) {
    console.log('✅ 延迟检查：window.puppeteerBridge 仍然存在');
  } else {
    console.log('❌ 延迟检查：window.puppeteerBridge 不存在');
  }
}, 1000); 