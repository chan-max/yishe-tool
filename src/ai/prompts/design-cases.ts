// ============ 设计案例库 ============
// 在这里定义设计案例，AI 会参考这些案例的风格来创建设计
// 案例应该是简短的关键词式描述，不是完整 HTML

export interface DesignCase {
  name: string;
  palette: string;
  layout: string;
  typography: string;
  description: string;
}

function loadCases(): DesignCase[] {
  try {
    const stored = localStorage.getItem("design_cases");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}

  return getDefaultCases();
}

// ============ 默认案例（引导示例） ============

function getDefaultCases(): DesignCase[] {
  return [
    {
      name: "促销标签",
      palette: "深红渐变(#E63946→#C1121F)、白色文字、金色点缀(#F4A261)",
      layout: "主标题居中全宽、副标题下方居中、装饰角标左上",
      typography: "主标题粗体 320px、副标题常规 140px、角标 60px",
      description: "电商促销标签，视觉冲击力强，适合折扣、限时活动",
    },
    {
      name: "极简名片",
      palette: "白色背景、深灰(#2C3E50)文字、蓝色(#457B9D)装饰线",
      layout: "姓名左对齐上半区、职位/联系信息右下、装饰线左侧垂直线",
      typography: "姓名粗体 180px、职位 100px、联系信息 70px",
      description: "简洁商务风格，信息层级清晰，留白充分",
    },
    {
      name: "潮流海报",
      palette: "渐变紫蓝(#7B2D8E→#2D6A8E)、霓虹绿点缀(#00F5D4)、深色背景(#0D0221)",
      layout: "主视觉居中偏上、大字叠加、底部小字信息栏",
      typography: "大字粗体 380px 叠加效果、副标题 160px、底部 80px",
      description: "年轻潮流风格，适合音乐节、活动宣传、社交分享",
    },
  ];
}

// ============ Prompt 生成 ============

export function buildDesignCases(): string {
  const cases = loadCases();

  if (cases.length === 0) {
    return `## 设计案例
暂无案例，将根据用户描述自由设计。`;
  }

  const caseLines = cases.map((c, i) => {
    return `案例${i + 1} - ${c.name}：
  配色：${c.palette}
  布局：${c.layout}
  文字：${c.typography}
  说明：${c.description}`;
  });

  return `## 设计参考案例

当用户描述与以下案例风格接近时，参考对应案例的配色和布局：

${caseLines.join("\n\n")}
`;
}

// ============ 案例管理（运行时接口） ============

export function setDesignCases(cases: DesignCase[]): void {
  localStorage.setItem("design_cases", JSON.stringify(cases));
}

export function getDesignCases(): DesignCase[] {
  return loadCases();
}

export function addDesignCase(c: DesignCase): void {
  const cases = loadCases();
  cases.push(c);
  setDesignCases(cases);
}

export function resetDesignCases(): void {
  localStorage.removeItem("design_cases");
}
