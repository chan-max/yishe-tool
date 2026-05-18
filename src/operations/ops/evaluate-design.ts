import { registerOperation } from "../registry";
import { captureCanvasForAI, getCanvasStateSummary } from "@/ai/capture";
import { directChat } from "@/ai/direct-client";

registerOperation({
  id: "canvas.evaluateDesign",
  name: "评估设计质量",
  description:
    "截取画布截图，用 AI 视觉评估设计质量并给出评分（1-10）和改进建议。用于自测和迭代优化。",
  group: "AI",
  params: [
    {
      name: "criteria",
      label: "评估标准",
      type: "string",
      default: "配色、排版、构图、视觉平衡、整体美感",
      placeholder: "评估维度",
      description: "评估维度，逗号分隔",
    },
  ],
  async execute(params, ctx) {
    const criteria = params.criteria || "配色、排版、构图、视觉平衡、整体美感";

    try {
      const imageBase64 = await captureCanvasForAI();
      const stateSummary = getCanvasStateSummary();

      const response = await directChat({
        messages: [
          {
            role: "system",
            content: `你是一个专业的设计评审专家。评估设计作品的质量，给出分数和建议。
只输出 JSON，不要其他内容。`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `评估这个设计的质量。

画布状态：
${stateSummary}

评估维度：${criteria}

严格按 JSON 格式输出：
{
  "score": 综合分数(1-10整数),
  "scores": {
    "配色": 分数,
    "排版": 分数,
    "构图": 分数,
    "视觉平衡": 分数,
    "整体美感": 分数
  },
  "strengths": ["优点1", "优点2"],
  "weaknesses": ["不足1", "不足2"],
  "suggestions": ["具体改进建议1", "具体改进建议2"],
  "shouldIterate": true/false
}`,
              },
              {
                type: "image_url",
                image_url: { url: imageBase64, detail: "high" },
              },
            ],
          },
        ],
        temperature: 0.3,
      });

      let resultText = "";
      const res = response as any;
      if (res?.choices?.[0]?.message?.content) {
        resultText = res.choices[0].message.content;
      } else if (typeof res?.data === "string") {
        resultText = res.data;
      } else if (typeof res?.content === "string") {
        resultText = res.content;
      }

      let evaluation: any;
      try {
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          evaluation = JSON.parse(jsonMatch[0]);
        }
      } catch {
        evaluation = { raw: resultText };
      }

      if (!evaluation) {
        return { success: false, message: "无法解析评估结果" };
      }

      const score = evaluation.score || 5;
      const shouldIterate = evaluation.shouldIterate !== false && score < 8;

      return {
        success: true,
        message: `设计评分: ${score}/10\n${evaluation.suggestions?.join("\n") || ""}`,
        data: {
          score,
          scores: evaluation.scores || {},
          strengths: evaluation.strengths || [],
          weaknesses: evaluation.weaknesses || [],
          suggestions: evaluation.suggestions || [],
          shouldIterate,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: `评估失败: ${error?.message || String(error)}`,
      };
    }
  },
});
