// HTML 模板库 - 供 AI 参考

export const HTML_TEMPLATES = {
  // ============ 文字元素 ============
  
  // 标题文字
  title: (text: string, options: {
    fontSize?: number;
    color?: string;
    background?: string;
    fontWeight?: number;
  } = {}) => {
    const {
      fontSize = 280,
      color = "#ffffff",
      background = "transparent",
      fontWeight = 900,
    } = options;
    
    return `<div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; background:${background};">
  <span style="font-size:${fontSize}px; font-weight:${fontWeight}; color:${color}; line-height:1;">${text}</span>
</div>`;
  },

  // 副标题
  subtitle: (text: string, options: {
    fontSize?: number;
    color?: string;
  } = {}) => {
    const { fontSize = 160, color = "#92A8D1" } = options;
    
    return `<div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;">
  <span style="font-size:${fontSize}px; font-weight:400; color:${color};">${text}</span>
</div>`;
  },

  // ============ 按钮 ============
  
  // 主按钮
  primaryButton: (text: string, options: {
    background?: string;
    color?: string;
    borderRadius?: number;
    fontSize?: number;
  } = {}) => {
    const {
      background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color = "#ffffff",
      borderRadius = 60,
      fontSize = 160,
    } = options;
    
    return `<div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; background:${background}; border-radius:${borderRadius}px; cursor:pointer;">
  <span style="font-size:${fontSize}px; font-weight:700; color:${color};">${text}</span>
</div>`;
  },

  // 次按钮
  secondaryButton: (text: string, options: {
    borderColor?: string;
    color?: string;
    borderRadius?: number;
    fontSize?: number;
  } = {}) => {
    const {
      borderColor = "#667eea",
      color = "#667eea",
      borderRadius = 60,
      fontSize = 160,
    } = options;
    
    return `<div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; background:transparent; border:4px solid ${borderColor}; border-radius:${borderRadius}px; cursor:pointer;">
  <span style="font-size:${fontSize}px; font-weight:700; color:${color};">${text}</span>
</div>`;
  },

  // ============ 卡片 ============
  
  // 基础卡片
  card: (title: string, content: string, options: {
    background?: string;
    titleColor?: string;
    contentColor?: string;
    borderRadius?: number;
    shadow?: boolean;
  } = {}) => {
    const {
      background = "#ffffff",
      titleColor = "#2C3E50",
      contentColor = "#7F8C8D",
      borderRadius = 20,
      shadow = true,
    } = options;
    
    const shadowStyle = shadow ? "box-shadow:0 20px 60px rgba(0,0,0,0.15);" : "";
    
    return `<div style="width:100%; height:100%; background:${background}; border-radius:${borderRadius}px; ${shadowStyle} padding:40px; box-sizing:border-box;">
  <div style="font-size:180px; font-weight:700; color:${titleColor}; margin-bottom:20px;">${title}</div>
  <div style="font-size:100px; color:${contentColor}; line-height:1.5;">${content}</div>
</div>`;
  },

  // 统计卡片
  statCard: (label: string, value: string, options: {
    background?: string;
    valueColor?: string;
    labelColor?: number;
  } = {}) => {
    const {
      background = "#ffffff",
      valueColor = "#4A90D9",
      labelColor = "#7F8C8D",
    } = options;
    
    return `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; background:${background}; border-radius:20px; padding:30px; box-sizing:border-box;">
  <div style="font-size:240px; font-weight:900; color:${valueColor}; line-height:1;">${value}</div>
  <div style="font-size:100px; color:${labelColor}; margin-top:10px;">${label}</div>
</div>`;
  },

  // ============ 布局 ============
  
  // 图标 + 文字
  iconText: (icon: string, title: string, description: string, options: {
    background?: string;
    iconBackground?: string;
    iconColor?: string;
    titleColor?: string;
    descColor?: string;
  } = {}) => {
    const {
      background = "#f8f9fa",
      iconBackground = "#4A90D9",
      iconColor = "#ffffff",
      titleColor = "#2C3E50",
      descColor = "#7F8C8D",
    } = options;
    
    return `<div style="display:flex; align-items:center; gap:20px; width:100%; height:100%; background:${background}; border-radius:12px; padding:30px; box-sizing:border-box;">
  <div style="width:120px; height:120px; background:${iconBackground}; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
    <span style="font-size:60px; color:${iconColor};">${icon}</span>
  </div>
  <div style="min-width:0;">
    <div style="font-size:140px; font-weight:700; color:${titleColor}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${title}</div>
    <div style="font-size:80px; color:${descColor}; margin-top:5px;">${description}</div>
  </div>
</div>`;
  },

  // 列表项
  listItem: (text: string, options: {
    background?: string;
    textColor?: string;
    bulletColor?: string;
    fontSize?: number;
  } = {}) => {
    const {
      background = "transparent",
      textColor = "#2C3E50",
      bulletColor = "#4A90D9",
      fontSize = 120,
    } = options;
    
    return `<div style="display:flex; align-items:center; gap:15px; width:100%; height:100%; background:${background}; padding:20px; box-sizing:border-box;">
  <div style="width:20px; height:20px; background:${bulletColor}; border-radius:50%; flex-shrink:0;"></div>
  <span style="font-size:${fontSize}px; color:${textColor};">${text}</span>
</div>`;
  },

  // ============ 装饰 ============
  
  // 渐变背景
  gradientBackground: (color1: string, color2: string, direction: string = "135deg") => {
    return `<div style="width:100%; height:100%; background:linear-gradient(${direction}, ${color1} 0%, ${color2} 100%);"></div>`;
  },

  // 带图案的背景
  patternBackground: (baseColor: string, patternColor: string) => {
    return `<div style="width:100%; height:100%; background:${baseColor}; background-image: radial-gradient(${patternColor} 1px, transparent 1px); background-size:20px 20px;"></div>`;
  },

  // ============ 复杂组件 ============
  
  // 进度条
  progressBar: (progress: number, options: {
    height?: number;
    backgroundColor?: string;
    progressColor?: string;
    borderRadius?: number;
  } = {}) => {
    const {
      height = 40,
      backgroundColor = "#e9ecef",
      progressColor = "#4A90D9",
      borderRadius = 20,
    } = options;
    
    return `<div style="display:flex; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
  <div style="width:100%; height:${height}px; background:${backgroundColor}; border-radius:${borderRadius}px; overflow:hidden;">
    <div style="width:${progress}%; height:100%; background:${progressColor}; border-radius:${borderRadius}px; transition:width 0.3s;"></div>
  </div>
</div>`;
  },

  // 标签
  tag: (text: string, options: {
    background?: string;
    color?: string;
    borderRadius?: number;
    fontSize?: number;
  } = {}) => {
    const {
      background = "#E8F4FD",
      color = "#4A90D9",
      borderRadius = 30,
      fontSize = 80,
    } = options;
    
    return `<div style="display:inline-flex; align-items:center; justify-content:center; height:100%; background:${background}; border-radius:${borderRadius}px; padding:0 20px; box-sizing:border-box;">
  <span style="font-size:${fontSize}px; font-weight:600; color:${color};">${text}</span>
</div>`;
  },

  // 头像
  avatar: (initials: string, options: {
    background?: string;
    color?: string;
    size?: number;
  } = {}) => {
    const {
      background = "#4A90D9",
      color = "#ffffff",
      size = 100,
    } = options;
    
    return `<div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;">
  <div style="width:${size}px; height:${size}px; background:${background}; border-radius:50%; display:flex; align-items:center; justify-content:center;">
    <span style="font-size:${size * 0.4}px; font-weight:700; color:${color};">${initials}</span>
  </div>
</div>`;
  },
};

// ============ 使用示例 ============

export const HTML_EXAMPLES = {
  // 示例1：标题页
  titlePage: `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; background:linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding:40px; box-sizing:border-box;">
  <div style="font-size:320px; font-weight:900; color:#ffffff; text-align:center; line-height:1.1;">创意设计</div>
  <div style="font-size:140px; color:#92A8D1; margin-top:30px; text-align:center;">让想法变成现实</div>
  <div style="margin-top:60px; padding:20px 60px; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius:60px;">
    <span style="font-size:120px; font-weight:700; color:#ffffff;">开始创作</span>
  </div>
</div>`,

  // 示例2：功能卡片
  featureCard: `<div style="width:100%; height:100%; background:#ffffff; border-radius:24px; box-shadow:0 20px 60px rgba(0,0,0,0.1); padding:40px; box-sizing:border-box;">
  <div style="width:80px; height:80px; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius:20px; display:flex; align-items:center; justify-content:center; margin-bottom:30px;">
    <span style="font-size:40px; color:#ffffff;">⚡</span>
  </div>
  <div style="font-size:160px; font-weight:700; color:#2C3E50; margin-bottom:15px;">快速高效</div>
  <div style="font-size:90px; color:#7F8C8D; line-height:1.5;">采用先进技术，确保设计过程流畅无阻</div>
</div>`,

  // 示例3：数据展示
  dataDisplay: `<div style="display:flex; gap:20px; width:100%; height:100%; padding:20px; box-sizing:border-box;">
  <div style="flex:1; background:#ffffff; border-radius:16px; padding:30px; box-sizing:border-box; text-align:center;">
    <div style="font-size:200px; font-weight:900; color:#4A90D9;">1,234</div>
    <div style="font-size:80px; color:#7F8C8D; margin-top:10px;">用户总数</div>
  </div>
  <div style="flex:1; background:#ffffff; border-radius:16px; padding:30px; box-sizing:border-box; text-align:center;">
    <div style="font-size:200px; font-weight:900; color:#2ECC71;">98%</div>
    <div style="font-size:80px; color:#7F8C8D; margin-top:10px;">满意度</div>
  </div>
</div>`,
};

export default HTML_TEMPLATES;
