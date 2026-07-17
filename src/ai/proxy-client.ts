import axios, { AxiosHeaders } from "axios";
import { normalizeTokenValue, useLoginStatusStore } from "@/store/stores/login";
import { DESIGN_TOOL_FEATURE_CODES } from "./feature-codes";
import { AI_TIMEOUTS } from "./shared/timeout";

const baseURL = String(import.meta.env.VITE_API || "").trim() || "";

const aiProxyInstance = axios.create({
  baseURL,
  timeout: AI_TIMEOUTS.chat,
  validateStatus(status) {
    return status >= 200 && status < 300;
  },
});

aiProxyInstance.interceptors.request.use((request) => {
  const loginStore = useLoginStatusStore();
  const token = normalizeTokenValue(loginStore.token);
  loginStore.token = token;
  request.headers = AxiosHeaders.from(request.headers || {});
  if (token) {
    request.headers.set("authorization", `Bearer ${token}`);
  }
  return request;
});

export function unwrapAiProxyResponse<T = any>(response: any): T {
  return (response?.data?.data ?? response?.data ?? response) as T;
}

export async function postAgentProxy(
  body: Record<string, any>,
  options?: { timeoutMs?: number },
) {
  const response = await aiProxyInstance.post(
    "/api/ai/agent-proxy",
    {
      featureCode: DESIGN_TOOL_FEATURE_CODES.chat,
      ...body,
    },
    {
      timeout: options?.timeoutMs ?? AI_TIMEOUTS.chat,
    },
  );
  return unwrapAiProxyResponse(response);
}
