# Puppeteer 集成使用指南

## 概述

本项目已经集成了 Puppeteer 通信桥接对象，通过 `window.puppeteerBridge` 可以访问所有自动化操作方法。

## 可用的方法

### 页面导航
```javascript
// 导航到指定页面
await window.puppeteerBridge.navigateTo('/design');
await window.puppeteerBridge.navigateTo('/market', { timeout: 10000 });
```

### 元素操作
```javascript
// 点击元素
await window.puppeteerBridge.clickElement({ selector: '.btn-primary' });
await window.puppeteerBridge.clickElement({ 
  selector: '#submit-btn', 
  timeout: 5000 
});

// 输入文本
await window.puppeteerBridge.typeText('#username', 'testuser');
await window.puppeteerBridge.typeText('#password', 'password123', { clear: true });

// 等待元素出现
await window.puppeteerBridge.waitForElement('.loading-spinner', 10000);

// 检查元素是否存在
const exists = await window.puppeteerBridge.elementExists('.modal');
```

### API 调用
```javascript
// 调用 API
const result = await window.puppeteerBridge.callApi({
  url: '/api/user/profile',
  method: 'GET',
  headers: { 'Authorization': 'Bearer token' }
});

// POST 请求
const response = await window.puppeteerBridge.callApi({
  url: '/api/login',
  method: 'POST',
  data: { username: 'user', password: 'pass' }
});
```

### 页面信息获取
```javascript
// 获取页面信息
const pageInfo = await window.puppeteerBridge.getPageInfo();
console.log(pageInfo.url, pageInfo.title);

// 获取元素信息
const elementInfo = await window.puppeteerBridge.getElementInfo('.product-card');
console.log(elementInfo.text, elementInfo.boundingBox);

// 获取所有匹配元素
const elements = await window.puppeteerBridge.getElements('.product-item');
```

### 截图功能
```javascript
// 页面截图
const screenshot = await window.puppeteerBridge.takeScreenshot();
const fullPageScreenshot = await window.puppeteerBridge.takeScreenshot({ 
  fullPage: true, 
  quality: 90 
});
```

### 事件监听
```javascript
// 监听自定义事件
window.puppeteerBridge.on('user-login', (data) => {
  console.log('用户登录:', data);
});

// 触发事件
await window.puppeteerBridge.triggerEvent('test-event', { message: 'hello' });

// 移除监听
window.puppeteerBridge.off('user-login');
```

### 页面交互
```javascript
// 滚动页面
await window.puppeteerBridge.scrollTo({ y: 500 });
await window.puppeteerBridge.scrollTo({ selector: '.footer' });

// 模拟键盘按键
await window.puppeteerBridge.pressKey('Enter');
await window.puppeteerBridge.pressKey('Escape');

// 模拟鼠标移动
await window.puppeteerBridge.moveMouse(100, 200);
```

### Vue 相关操作
```javascript
// 等待 Vue 应用加载完成
await window.puppeteerBridge.waitForVueReady();

// 获取 Vue 应用实例
const app = window.puppeteerBridge.getVueApp();

// 获取路由实例
const router = window.puppeteerBridge.getRouter();

// 获取 Pinia Store
const userStore = window.puppeteerBridge.getStore('user');
```

### 调试和日志
```javascript
// 获取控制台日志
const logs = await window.puppeteerBridge.getConsoleLogs();
console.log(logs);

// 清除控制台日志
await window.puppeteerBridge.clearConsoleLogs();

// 获取桥接状态
const status = window.puppeteerBridge.getStatus();
console.log(status);
```

### 执行自定义脚本
```javascript
// 执行 JavaScript 代码
const result = await window.puppeteerBridge.evaluateScript(`
  return document.querySelector('.price').textContent;
`);

// 执行复杂操作
await window.puppeteerBridge.evaluateScript(`
  localStorage.setItem('test', 'value');
  sessionStorage.setItem('session', 'data');
`);
```

## Puppeteer 脚本示例

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // 导航到你的应用
  await page.goto('http://localhost:3000');
  
  // 等待桥接对象加载
  await page.waitForFunction(() => window.puppeteerBridge);
  
  // 使用桥接对象进行操作
  await page.evaluate(async () => {
    const bridge = window.puppeteerBridge;
    
    // 导航到设计页面
    await bridge.navigateTo('/design');
    
    // 等待页面加载
    await bridge.waitForVueReady();
    
    // 点击按钮
    await bridge.clickElement({ selector: '.create-design-btn' });
    
    // 输入文本
    await bridge.typeText('#design-name', '测试设计');
    
    // 调用 API
    const result = await bridge.callApi({
      url: '/api/designs',
      method: 'POST',
      data: { name: '测试设计', type: 'shirt' }
    });
    
    // 截图
    const screenshot = await bridge.takeScreenshot();
    
    console.log('操作完成:', result);
  });
  
  await browser.close();
})();
```

## 注意事项

1. **异步操作**: 所有方法都是异步的，需要使用 `await` 或 `.then()`
2. **错误处理**: 建议使用 try-catch 包装所有操作
3. **超时设置**: 某些操作可以设置超时时间，避免无限等待
4. **Vue 应用**: 在操作 Vue 组件前，建议先调用 `waitForVueReady()`
5. **元素选择器**: 使用可靠的选择器，避免使用可能变化的类名

## 调试技巧

1. 使用 `getConsoleLogs()` 查看操作日志
2. 使用 `getStatus()` 检查桥接状态
3. 在浏览器控制台直接调用方法进行测试
4. 使用 `elementExists()` 验证元素是否存在
5. 使用 `getElementInfo()` 获取元素详细信息 