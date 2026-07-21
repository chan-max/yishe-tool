import { apiInstance } from "@/api/apiInstance";
import { useLoginStatusStore } from "@/store/stores/login";

interface SkillMatchResponse {
  prompt?: string;
}

export async function buildMatchedSkillPrompt(
  query: string,
  target: "design-agent" | "admin-agent" = "design-agent",
): Promise<string> {
  const normalizedQuery = String(query || "").trim();
  const loginStore = useLoginStatusStore();
  if (!normalizedQuery || !loginStore.token) return "";

  const response = await apiInstance.post(
    "/api/ai-skill/match",
    {
      query: normalizedQuery,
      target,
      limit: 3,
    },
    { timeout: 5000 },
  );
  const payload: SkillMatchResponse =
    response?.data?.data || response?.data || response || {};
  return typeof payload.prompt === "string" ? payload.prompt : "";
}
