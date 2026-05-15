import { registerOperation } from "../registry";

registerOperation({
  id: "canvas.addChild",
  name: "添加元素",
  description:
    "向画布添加一个新元素，支持文字、背景、图片、矩形、椭圆、二维码、条形码、图表 (ECharts)、3D模型 (Three.js)、数学公式 (KaTeX)、流程图 (Mermaid)、代码块 (Shiki) 等类型",
  group: "画布",
  params: [
    {
      name: "type",
      label: "元素类型",
      type: "select",
      required: true,
      options: [
        { label: "文字", value: "text" },
        { label: "背景", value: "background" },
        { label: "图片", value: "image" },
        { label: "矩形", value: "rect" },
        { label: "椭圆", value: "ellipse" },
        { label: "二维码", value: "qrcode" },
        { label: "条形码", value: "barcode" },
        { label: "图表 (ECharts)", value: "echart" },
        { label: "3D模型 (Three.js)", value: "threeScene" },
        { label: "数学公式 (KaTeX)", value: "math" },
        { label: "流程图 (Mermaid)", value: "mermaid" },
        { label: "代码块 (Shiki)", value: "codeBlock" },
        { label: "分子结构 (RDKit.js)", value: "molecule" },
        { label: "3D分子 (3Dmol.js)", value: "threeMol" },
      ],
      description: "要添加的元素类型",
    },
    {
      name: "textContent",
      label: "文字内容",
      type: "string",
      placeholder: "输入文字内容",
      description: "仅文字类型有效",
    },
    {
      name: "fontColor",
      label: "文字颜色",
      type: "color",
      default: "#ffffff",
      description: "仅文字类型有效",
    },
    {
      name: "fontSize",
      label: "字号",
      type: "number",
      default: 160,
      min: 1,
      max: 2000,
      description: "仅文字类型有效",
    },
    {
      name: "backgroundColor",
      label: "背景颜色",
      type: "color",
      default: "#000000",
      description: "仅背景类型有效",
    },
    {
      name: "formula",
      label: "公式内容",
      type: "string",
      placeholder: String.raw`\frac{a}{b}=c 或 \ce{2H2 + O2 -> 2H2O}`,
      description:
        "仅数学公式类型有效，LaTeX/mhchem 公式字符串，化学式和反应式可用 \\ce{...}",
    },
    {
      name: "displayMode",
      label: "块级显示",
      type: "boolean",
      default: true,
      description: "仅数学公式类型有效",
    },
    {
      name: "throwOnError",
      label: "严格报错",
      type: "boolean",
      default: false,
      description: "仅数学公式类型有效",
    },
    {
      name: "mathFontColor",
      label: "公式颜色",
      type: "color",
      default: "#111111",
      description: "仅数学公式类型有效",
    },
    {
      name: "mathFontSize",
      label: "公式大小",
      type: "number",
      default: 180,
      min: 1,
      max: 10000,
      description: "仅数学公式类型有效，单位 px",
    },
    {
      name: "mermaidSource",
      label: "Mermaid 源码",
      type: "string",
      placeholder: "flowchart TD\\n  A[开始] --> B[完成]",
      description: "仅 Mermaid 类型有效，Mermaid DSL 源码",
    },
    {
      name: "mermaidTheme",
      label: "Mermaid 主题",
      type: "select",
      default: "default",
      options: [
        { label: "Default", value: "default" },
        { label: "Base", value: "base" },
        { label: "Dark", value: "dark" },
        { label: "Forest", value: "forest" },
        { label: "Neutral", value: "neutral" },
      ],
      description: "仅 Mermaid 类型有效",
    },
    {
      name: "codeBlockSource",
      label: "代码内容",
      type: "string",
      placeholder: "const message = 'Hello Shiki'",
      description: "仅代码块类型有效",
    },
    {
      name: "codeBlockLanguage",
      label: "代码语言",
      type: "string",
      default: "ts",
      description: "仅代码块类型有效，例如 ts、js、vue、python、go、rust",
    },
    {
      name: "codeBlockTheme",
      label: "代码主题",
      type: "string",
      default: "github-dark",
      description:
        "仅代码块类型有效，例如 github-dark、github-light、vitesse-dark、nord、dracula",
    },
    {
      name: "moleculeSource",
      label: "分子源码",
      type: "string",
      placeholder: "c1ccccc1",
      description: "仅分子结构类型有效，SMILES 或 MolBlock 字符串",
    },
    {
      name: "moleculeInputType",
      label: "输入类型",
      type: "select",
      default: "smiles",
      options: [
        { label: "SMILES", value: "smiles" },
        { label: "MolBlock", value: "molblock" },
      ],
      description: "仅分子结构类型有效",
    },
    {
      name: "threeMolData",
      label: "3D分子数据",
      type: "string",
      placeholder: "PDB/SDF/XYZ 数据",
      description: "仅3D分子类型有效",
    },
    {
      name: "threeMolFormat",
      label: "数据格式",
      type: "select",
      default: "pdb",
      options: [
        { label: "PDB", value: "pdb" },
        { label: "SDF", value: "sdf" },
        { label: "XYZ", value: "xyz" },
        { label: "MOL2", value: "mol2" },
      ],
      description: "仅3D分子类型有效",
    },
    {
      name: "threeMolPdbId",
      label: "PDB ID",
      type: "string",
      placeholder: "例如 1BNA",
      description: "仅3D分子类型有效，设置后自动下载",
    },
    {
      name: "threeMolStyle",
      label: "渲染样式",
      type: "select",
      default: "stick",
      options: [
        { label: "棍棒", value: "stick" },
        { label: "球体", value: "sphere" },
        { label: "卡通", value: "cartoon" },
        { label: "线条", value: "line" },
        { label: "十字", value: "cross" },
      ],
      description: "仅3D分子类型有效",
    },
    {
      name: "threeMolAiPrompt",
      label: "AI 生成描述",
      type: "string",
      placeholder: "描述分子，例如：血红蛋白、DNA 双螺旋",
      description: "仅3D分子类型有效，通过 AI 自动生成 PDB 数据",
    },
    {
      name: "abcSource",
      label: "ABC 记谱法",
      type: "string",
      placeholder: "X:1\nT:小星星\nM:4/4\nK:C\nC C G G | A A G2",
      description: "仅 ABC 乐谱类型有效",
    },
    {
      name: "vexFlowNotes",
      label: "音符",
      type: "string",
      placeholder: '[{"keys":["c/4"],"duration":"q"},{"keys":["d/4"],"duration":"q"}]',
      description: "仅 VexFlow 五线谱类型有效，JSON 格式的音符数组",
    },
    {
      name: "vexFlowClef",
      label: "谱号",
      type: "select",
      default: "treble",
      options: [
        { label: "高音谱号", value: "treble" },
        { label: "低音谱号", value: "bass" },
        { label: "中音谱号", value: "alto" },
        { label: "次中音谱号", value: "tenor" },
      ],
      description: "仅 VexFlow 五线谱类型有效",
    },
    {
      name: "vexFlowTimeSignature",
      label: "拍号",
      type: "string",
      default: "4/4",
      placeholder: "4/4",
      description: "仅 VexFlow 五线谱类型有效",
    },
    {
      name: "width",
      label: "宽度",
      type: "number",
      min: 1,
      max: 10000,
      description: "元素宽度（px）",
    },
    {
      name: "height",
      label: "高度",
      type: "number",
      min: 1,
      max: 10000,
      description: "元素高度（px）",
    },
  ],
  execute(params, ctx) {
    const {
      type,
      textContent,
      fontColor,
      fontSize,
      backgroundColor,
      formula,
      displayMode,
      throwOnError,
      mathFontColor,
      mathFontSize,
      mermaidSource,
      mermaidTheme,
      codeBlockSource,
      codeBlockLanguage,
      codeBlockTheme,
      moleculeSource,
      moleculeInputType,
      threeMolData,
      threeMolFormat,
      threeMolPdbId,
      threeMolStyle,
      threeMolAiPrompt,
      abcSource,
      vexFlowNotes,
      vexFlowClef,
      vexFlowTimeSignature,
      width,
      height,
    } = params;

    const extraOptions: Record<string, any> = {};

    if (type === "text") {
      if (textContent !== undefined) extraOptions.textContent = textContent;
      if (fontColor !== undefined) extraOptions.fontColor = fontColor;
      if (fontSize !== undefined) extraOptions.fontSize = fontSize;
    }

    if (type === "background" && backgroundColor !== undefined) {
      extraOptions.backgroundColor = backgroundColor;
    }

    if (type === "math") {
      if (formula !== undefined) extraOptions.formula = formula;
      if (displayMode !== undefined) extraOptions.displayMode = displayMode;
      if (throwOnError !== undefined) extraOptions.throwOnError = throwOnError;
      if (mathFontColor !== undefined)
        extraOptions.fontColor = { color: mathFontColor, type: "pure" };
      if (mathFontSize !== undefined)
        extraOptions.fontSize = { value: mathFontSize, unit: "px" };
      if (width !== undefined)
        extraOptions.width = { value: width, unit: "px" };
      if (height !== undefined)
        extraOptions.height = { value: height, unit: "px" };
    }

    if (type === "mermaid") {
      if (mermaidSource !== undefined) extraOptions.source = mermaidSource;
      if (mermaidTheme !== undefined) {
        extraOptions.config = {
          theme: mermaidTheme,
          securityLevel: "strict",
          flowchart: {
            htmlLabels: true,
            curve: "basis",
          },
        };
      }
      if (width !== undefined)
        extraOptions.width = { value: width, unit: "px" };
      if (height !== undefined)
        extraOptions.height = { value: height, unit: "px" };
    }

    if (type === "codeBlock") {
      if (codeBlockSource !== undefined) extraOptions.source = codeBlockSource;
      if (codeBlockLanguage !== undefined)
        extraOptions.language = codeBlockLanguage;
      if (codeBlockTheme !== undefined) extraOptions.theme = codeBlockTheme;
      if (width !== undefined)
        extraOptions.width = { value: width, unit: "px" };
      if (height !== undefined)
        extraOptions.height = { value: height, unit: "px" };
    }

    if (type === "molecule") {
      if (moleculeSource !== undefined) extraOptions.source = moleculeSource;
      if (moleculeInputType !== undefined)
        extraOptions.inputType = moleculeInputType;
      if (width !== undefined)
        extraOptions.width = { value: width, unit: "px" };
      if (height !== undefined)
        extraOptions.height = { value: height, unit: "px" };
    }

    if (type === "threeMol") {
      if (threeMolData !== undefined) extraOptions.data = threeMolData;
      if (threeMolFormat !== undefined) extraOptions.format = threeMolFormat;
      if (threeMolPdbId !== undefined) extraOptions.pdbId = threeMolPdbId;
      if (threeMolStyle !== undefined) extraOptions.style = threeMolStyle;
      if (threeMolAiPrompt !== undefined) extraOptions.aiPrompt = threeMolAiPrompt;
      if (width !== undefined)
        extraOptions.width = { value: width, unit: "px" };
      if (height !== undefined)
        extraOptions.height = { value: height, unit: "px" };
    }

    if (type === "abcNotation") {
      if (abcSource !== undefined) extraOptions.source = abcSource;
      if (width !== undefined)
        extraOptions.width = { value: width, unit: "px" };
      if (height !== undefined)
        extraOptions.height = { value: height, unit: "px" };
    }

    if (type === "vexFlow") {
      if (vexFlowNotes !== undefined) {
        try {
          extraOptions.notes = JSON.parse(vexFlowNotes);
        } catch {
          return { success: false, message: "音符 JSON 格式错误" };
        }
      }
      if (vexFlowClef !== undefined) extraOptions.clef = vexFlowClef;
      if (vexFlowTimeSignature !== undefined) extraOptions.timeSignature = vexFlowTimeSignature;
      if (width !== undefined)
        extraOptions.width = { value: width, unit: "px" };
      if (height !== undefined)
        extraOptions.height = { value: height, unit: "px" };
    }

    if (type === "rect" || type === "ellipse") {
      if (width !== undefined)
        extraOptions.width = { value: width, unit: "px" };
      if (height !== undefined)
        extraOptions.height = { value: height, unit: "px" };
    }

    if (type === "qrcode" || type === "barcode") {
      if (width !== undefined) extraOptions.width = width;
      if (height !== undefined) extraOptions.height = height;
    }

    const id = ctx.addCanvasChild(type, extraOptions);
    return { success: true, message: `已添加${type}元素`, data: { id } };
  },
});
