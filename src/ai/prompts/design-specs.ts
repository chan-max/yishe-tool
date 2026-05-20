// ============ 自定义设计规范 ============
// 在这里定义你的品牌/项目专属设计规则，会在 AI 做设计时自动注入

export function buildCustomDesignSpecs(): string {
  const specs = loadSpecs();

  if (!specs || specs.length === 0) {
    return `## 项目设计规范
暂无自定义规范，使用通用设计规则。`;
  }

  const lines = specs.map((s) => `- ${s}`).join("\n");
  return `## 项目设计规范\n${lines}`;
}

// ============ 规范加载 ============

interface DesignSpec {
  specs: string[];
}

function loadSpecs(): string[] {
  try {
    const stored = localStorage.getItem("design_specs");
    if (stored) {
      const data: DesignSpec = JSON.parse(stored);
      return data.specs || [];
    }
  } catch {}

  // 默认示例规范（修改这里或通过运行时接口覆盖）
  return [];
}

// ============ 规范管理（运行时接口） ============

export function setDesignSpecs(specs: string[]): void {
  localStorage.setItem("design_specs", JSON.stringify({ specs }));
}

export function getDesignSpecs(): string[] {
  return loadSpecs();
}

export function addDesignSpec(spec: string): void {
  const specs = loadSpecs();
  specs.push(spec);
  setDesignSpecs(specs);
}

export function clearDesignSpecs(): void {
  localStorage.removeItem("design_specs");
}
