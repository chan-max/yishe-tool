export interface ParsedResponse {
  content: string;
  tool_calls?: any[];
}

export function parseChatResponse(response: any): ParsedResponse | null {
  const res = response as any;

  if (res?.choices?.[0]?.message) {
    return {
      content: res.choices[0].message.content ?? "",
      tool_calls: res.choices[0].message.tool_calls,
    };
  }

  if (res?.data?.choices?.[0]?.message) {
    return {
      content: res.data.choices[0].message.content ?? "",
      tool_calls: res.data.choices[0].message.tool_calls,
    };
  }

  if (typeof res?.data === "string") {
    return { content: res.data };
  }

  if (res?.content || res?.tool_calls) {
    return {
      content: res.content ?? "",
      tool_calls: res.tool_calls,
    };
  }

  return null;
}

export function extractContent(response: any): string {
  const parsed = parseChatResponse(response);
  return parsed?.content ?? "";
}

export function extractJSON(text: string): any {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  }
  return null;
}
