import { Annotation, StateGraph, END, START, messagesStateReducer } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { reactive, computed } from "vue";
import { directChat } from "@/ai/direct-client";
import {
  executeOperation,
  createDesignOperationContext,
} from "@/operations";
import { canvasStickerOptions } from "@/components/design/layout/canvas";
import { buildAITools, INTERACTION_TOOL_NAMES, resolveAIToolName } from "@/ai/shared/tools";
import { parseChatResponse } from "@/ai/shared/response-parser";

// ============ 状态定义 ============

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  toolCalls: Annotation<any[]>({
    reducer: (prev, next) => next,
    default: () => [],
  }),
  pendingInteraction: Annotation<{
    type: string;
    question: string;
    options?: string[];
  } | null>({
    reducer: (prev, next) => next,
    default: () => null,
  }),
  userResponse: Annotation<string | null>({
    reducer: (prev, next) => next,
    default: () => null,
  }),
  status: Annotation<string>({
    reducer: (prev, next) => next,
    default: () => "idle",
  }),
  error: Annotation<string | null>({
    reducer: (prev, next) => next,
    default: () => null,
  }),
  iteration: Annotation<number>({
    reducer: (prev, next) => next,
    default: () => 0,
  }),
});

type State = typeof StateAnnotation.State;

// ============ 工具定义 ============

function getCanvasSummary() {
  const children = canvasStickerOptions.value.children;
  const mainCanvas = children[0];
  return {
    width: mainCanvas?.width || 500,
    height: mainCanvas?.height || 500,
    elementCount: children.length - 1,
    elements: children.slice(1).map((c: any) => ({
      id: c.id,
      type: c.type,
      content: c.content || c.text || "",
    })),
  };
}

function buildSystemPrompt(): string {
  const canvasState = getCanvasSummary();

  return `你是一个专业的设计协作助手，运行在一个设计工具内部。你可以帮用户创建和修改贴纸设计。

## 当前画布状态
${JSON.stringify(canvasState, null, 2)}

## 你的工作方式

1. **先观察**：了解当前画布有什么元素
2. **再决策**：根据用户需求决定做什么
3. **分步执行**：一次只调用一个工具
4. **及时反馈**：告诉用户你做了什么
5. **主动询问**：有疑问时用 ask_choice 问用户

## 交互工具

当需要用户做选择时，使用 ask_choice 工具：
- 问颜色选择
- 问布局偏好
- 问风格方向

当需要用户反馈时，使用 request_feedback 工具：
- 展示当前效果，询问是否满意

## 专业设计原则（必须遵守）

### 配色方案
**永远不要使用纯黑 #000000 或纯白 #ffffff 作为主色调！** 使用精心搭配的配色方案：

**经典配色组合：**
- 莫兰迪色系：#B8A9C9, #F7CAC9, #92A8D1, #F5E6CC
- 马卡龙色系：#FFB3BA, #BAFFC9, #BAE1FF, #FFFFBA
- 高级灰：#2C3E50, #34495E, #7F8C8D, #95A5A6
- 暖色调：#E74C3C, #E67E22, #F1C40F, #E91E63
- 冷色调：#3498DB, #2ECC71, #1ABC9C, #9B59B6

**背景与文字对比规则：**
- 深色背景（#1a1a2e, #16213e）配浅色文字（#ffffff, #f5f5f5）
- 浅色背景（#f8f9fa, #e9ecef）配深色文字（#212529, #343a40）

### 字号与层级
**字号规范：**
- 主标题：280-400px（醒目、大气）
- 副标题：160-220px
- 正文/说明：100-140px
- 小字/注释：60-80px

**层级关系：**
- 背景层：zIndex = 0
- 装饰元素：zIndex = 1-5
- 主文字：zIndex = 10-20
- 副文字：zIndex = 15-25

### 构图法则
**三分法构图：**
- 将画布分为 3x3 网格
- 主要元素放在交叉点（约 33% 或 66% 位置）
- 不要总是居中，适当偏移更有设计感

**留白原则：**
- 元素之间保持足够间距（至少 20px）
- 边缘留白：元素不要贴边，至少留 5% 边距

## 可用工具

### 画布操作
- canvas.getState - 获取画布状态
- canvas.setSize - 设置画布尺寸
- canvas.setSizeByPreset - 使用预设尺寸
- canvas.smartSize - 智能尺寸（根据产品描述）
- canvas.addChild - 添加元素（支持 30+ 种类型）
- canvas.removeChild - 删除元素
- canvas.setBackgroundColor - 设置背景色
- canvas.clear - 清空画布
- canvas.exportPng - 导出 PNG
- canvas.analyze - AI 视觉分析

### 元素样式
- element.setStyle - 设置位置、大小、旋转、透明度、层级
- element.setBackgroundColor - 设置元素背景色
- element.setBorder - 设置边框
- element.removeBorder - 移除边框
- element.setBorderRadius - 设置圆角
- element.setBorderRadiusEach - 分别设置四个角圆角
- element.setShadow - 设置阴影
- element.removeShadow - 移除阴影

### 文字操作
- element.setTextContent - 设置文字内容
- element.setTextColor - 设置文字颜色
- element.setTextFontSize - 设置字号
- element.setTextFontWeight - 设置字重（normal/bold/100-900）
- element.setTextAlign - 设置对齐（left/center/right/justify）
- element.setLineHeight - 设置行高
- element.setLetterSpacing - 设置字间距

### 图层管理
- element.bringToFront - 移到最前
- element.sendToBack - 移到最后
- element.bringForward - 上移一层
- element.sendBackward - 下移一层

### 元素操作
- element.duplicate - 复制元素
- element.flipHorizontal - 水平翻转
- element.flipVertical - 垂直翻转
- element.setLocked - 锁定/解锁元素
- element.setVisible - 显示/隐藏元素

### AI 工具
- canvas.analyze - AI 视觉分析设计效果
- canvas.createAndAnalyze - 创建设计并自动分析迭代
- canvas.quickTest - 快速测试设计

## 设计执行流程

1. **设置画布尺寸** — 优先用 canvas.smartSize 或 canvas.setSizeByPreset
2. **添加背景** — 使用专业配色方案中的颜色
3. **添加装饰元素** — 几何形状、线条等
4. **添加主要文字** — 大字号、粗体
5. **添加副文字** — 小字号、常规字重
6. **调整布局** — 使用三分法构图
7. **用户要求保存时** — 使用 canvas.updateAndSaveSticker 或 canvas.exportPng

## 视觉分析

当用户问"现在图是什么"、"分析一下设计"、"看看效果"时，使用 canvas.analyze 工具。
这个工具会截取当前画布并用 AI 视觉分析设计内容。

## 自测试与迭代

当你需要验证设计效果或进行迭代优化时，可以使用以下工具：

1. **canvas.quickTest** - 快速创建测试设计并截图，用于验证工具链是否正常
2. **canvas.createAndAnalyze** - 创建设计并自动分析效果，支持多轮迭代
   - description: 设计描述
   - style: 设计风格（auto/minimal/cartoon/vintage/trendy/elegant）
   - iterations: 迭代次数（1-5）

### 自测试流程

当用户要求"测试一下"、"看看效果"、"迭代优化"时：
1. 使用 canvas.createAndAnalyze 创建并分析设计
2. 查看分析结果中的评分和建议
3. 根据建议使用相应工具进行优化
4. 可以多次调用以达到最佳效果

### 迭代优化策略

- 评分低于 7 分时，建议进行优化
- 根据分析建议调整：颜色、字号、间距、构图
- 每次迭代后重新分析，对比改进效果
`;
}

// ============ 节点实现 ============

// 思考节点：调用 LLM 获取响应
async function thinkNode(state: State): Promise<Partial<State>> {
  console.log("[LangGraph] Think node", { iteration: state.iteration });

  const allTools = buildAITools();

  const messagesForLLM = [
    { role: "system" as const, content: buildSystemPrompt() },
    ...state.messages.map((m) => ({
      role: (m._getType() === "human" ? "user" :
            m._getType() === "ai" ? "assistant" : "user") as "user" | "assistant",
      content: m.content as string,
      ...((m as any).tool_calls ? { tool_calls: (m as any).tool_calls } : {}),
    })),
  ];

  try {
    const response = await directChat({
      messages: messagesForLLM,
      tools: allTools,
    });

    const message = parseChatResponse(response);

    if (!message) {
      return {
        error: "无法解析 LLM 响应",
        status: "done",
      };
    }

    const aiMessage = new AIMessage({
      content: message.content || "",
      tool_calls: message.tool_calls || [],
    });

    return {
      messages: [aiMessage],
      toolCalls: message.tool_calls || [],
      status: "thinking",
    };
  } catch (error: any) {
    return {
      error: error.message || "LLM 调用失败",
      status: "done",
    };
  }
}

// 执行工具节点
async function executeToolsNode(state: State): Promise<Partial<State>> {
  console.log("[LangGraph] Execute tools node", { toolCalls: state.toolCalls });

  const ctx = createDesignOperationContext();
  const newMessages: BaseMessage[] = [];

  for (const call of state.toolCalls) {
    const args = typeof call.function.arguments === "string"
      ? JSON.parse(call.function.arguments)
      : call.function.arguments;
    const toolName = resolveAIToolName(call.function.name);

    // 检查是否是交互工具
    if (INTERACTION_TOOL_NAMES.includes(call.function.name)) {
      return {
        pendingInteraction: {
          type: call.function.name,
          question: args.question,
          options: args.options,
        },
        status: "waiting_user",
      };
    }

    // 执行工具
    const result = await executeOperation(toolName, args, ctx);

    const toolMessage = new ToolMessage({
      content: JSON.stringify(result),
      tool_call_id: call.id,
      name: call.function.name,
    });
    newMessages.push(toolMessage);
  }

  return {
    messages: newMessages,
    toolCalls: [],
    iteration: state.iteration + 1,
    status: "thinking",
  };
}

// 等待用户输入节点
async function waitForUserNode(state: State): Promise<Partial<State>> {
  console.log("[LangGraph] Wait for user node");
  return {
    status: "waiting_user",
  };
}

// 处理用户响应节点
async function processUserResponseNode(state: State): Promise<Partial<State>> {
  console.log("[LangGraph] Process user response", { userResponse: state.userResponse });

  if (!state.userResponse) {
    return { error: "未收到用户响应" };
  }

  const userMessage = new HumanMessage({ content: state.userResponse });
  const interactionMessage = new AIMessage({
    content: `[用户选择] ${state.userResponse}`,
  });

  return {
    messages: [interactionMessage, userMessage],
    pendingInteraction: null,
    userResponse: null,
    status: "thinking",
  };
}

// ============ 条件路由 ============

function shouldContinue(state: State): string {
  // 如果有错误，结束
  if (state.error) {
    return "end";
  }

  // 如果等待用户输入，路由到等待节点
  if (state.status === "waiting_user") {
    return "wait_for_user";
  }

  // 如果有工具调用，路由到执行节点
  if (state.toolCalls.length > 0) {
    return "execute_tools";
  }

  // 如果没有工具调用，检查是否需要继续
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage && lastMessage._getType() === "ai") {
    const aiMsg = lastMessage as AIMessage;
    // 如果 AI 消息没有工具调用，结束
    if (!(aiMsg as any).tool_calls || (aiMsg as any).tool_calls.length === 0) {
      return "end";
    }
  }

  // 继续思考
  return "think";
}

function afterUserResponse(state: State): string {
  return "think";
}

// ============ 构建状态图 ============

function createDesignAgentGraph() {
  const workflow = new StateGraph(StateAnnotation)
    .addNode("think", thinkNode)
    .addNode("execute_tools", executeToolsNode)
    .addNode("wait_for_user", waitForUserNode)
    .addNode("process_user_response", processUserResponseNode)
    .addEdge(START, "think")
    .addConditionalEdges("think", shouldContinue, {
      execute_tools: "execute_tools",
      wait_for_user: "wait_for_user",
      end: END,
    })
    .addConditionalEdges("execute_tools", shouldContinue, {
      think: "think",
      wait_for_user: "wait_for_user",
      end: END,
    })
    .addEdge("wait_for_user", "process_user_response")
    .addConditionalEdges("process_user_response", afterUserResponse, {
      think: "think",
    });

  return workflow.compile();
}

// ============ Agent 包装 ============

// 全局状态（Vue 响应式）
const agentState = reactive({
  status: "idle" as "idle" | "thinking" | "executing" | "waiting_user" | "done",
  messages: [] as any[],
  pendingInteraction: null as any,
  error: null as string | null,
});

let graph: ReturnType<typeof createDesignAgentGraph> | null = null;
let waitForUserInputPromise: { resolve: (value: string) => void } | null = null;
const eventListeners: ((event: any) => void)[] = [];

function emit(event: any) {
  eventListeners.forEach((listener) => listener(event));
}

// 初始化图
function initGraph() {
  if (!graph) {
    graph = createDesignAgentGraph();
  }
  return graph;
}

// 运行图
async function runGraph(userMessage: string) {
  const g = initGraph();

  // 初始化状态
  const initialState: State = {
    messages: [new HumanMessage({ content: userMessage })],
    toolCalls: [],
    pendingInteraction: null,
    userResponse: null,
    status: "thinking",
    error: null,
    iteration: 0,
  };

  agentState.status = "thinking";
  agentState.error = null;

  try {
    // 运行图
    const result = await g.invoke(initialState);

    // 更新状态
    agentState.messages = result.messages.map((m: BaseMessage) => ({
      role: m._getType() === "human" ? "user" :
            m._getType() === "ai" ? "assistant" :
            m._getType() === "tool" ? "tool" : "system",
      content: m.content,
      tool_calls: (m as any).tool_calls,
      tool_call_id: (m as any).tool_call_id,
      name: (m as any).name,
    }));

    // 检查是否需要等待用户输入
    if (result.pendingInteraction) {
      agentState.pendingInteraction = result.pendingInteraction;
      agentState.status = "waiting_user";
      emit({ type: "interaction", data: result.pendingInteraction });

      // 等待用户输入
      const userResponse = await waitForUserInput();
      
      // 递归调用，继续处理
      await runGraph(userResponse);
    } else {
      agentState.status = "idle";
      emit({ type: "done", data: null });
    }
  } catch (error: any) {
    console.error("[LangGraph] Error:", error);
    agentState.error = error.message || "未知错误";
    agentState.status = "idle";
    emit({ type: "error", data: error.message });
  }
}

function waitForUserInput(): Promise<string> {
  return new Promise((resolve) => {
    waitForUserInputPromise = { resolve };
  });
}

// ============ 导出 ============

export const designAgent = {
  state: agentState,

  isProcessing: computed(
    () => agentState.status === "thinking" || agentState.status === "executing"
  ),

  isWaitingForUser: computed(() => agentState.status === "waiting_user"),

  onEvent(listener: (event: any) => void) {
    eventListeners.push(listener);
    return () => {
      const index = eventListeners.indexOf(listener);
      if (index > -1) eventListeners.splice(index, 1);
    };
  },

  async chat(userMessage: string): Promise<void> {
    if (agentState.status !== "idle") {
      console.warn("[LangGraph] Agent is busy");
      return;
    }

    await runGraph(userMessage);
  },

  submitUserResponse(response: string) {
    if (waitForUserInputPromise) {
      waitForUserInputPromise.resolve(response);
      waitForUserInputPromise = null;
    }
  },

  clearMessages() {
    agentState.messages.length = 0;
    agentState.error = null;
    agentState.pendingInteraction = null;
    agentState.status = "idle";
  },
};
