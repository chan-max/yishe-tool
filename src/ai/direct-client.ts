import CryptoJS from "crypto-js";
import { getUserApiKey } from "./api";

// 加密密钥（需要与服务端 AI_API_KEY_RESPONSE_ENCRYPT_SECRET 一致）
const ENCRYPT_SECRET =
  String(import.meta.env.VITE_AI_API_KEY_RESPONSE_ENCRYPT_SECRET || "").trim() ||
  "1s-design-encrypt-key";

// 功能标识
const FEATURE_AI_CHAT = "ai_chat";

// 缓存解密后的配置
let cachedConfig: {
  apiKey: string;
  model: string;
  baseURL: string;
  name: string;
} | null = null;

// 初始化状态
let initialized = false;
let initPromise: Promise<void> | null = null;

/**
 * 解密 API Key
 */
function decryptKey(encryptedKey: string): string {
  const value = String(encryptedKey || "").trim();
  if (!value) {
    throw new Error("API Key 为空");
  }

  // 目前服务端返回的是可直接使用的 key。只有 CryptoJS passphrase
  // 加密后的 OpenSSL 格式才会以 U2FsdGVkX1 开头，避免把明文 key 误送去解密。
  if (!value.startsWith("U2FsdGVkX1")) {
    return value;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(value, ENCRYPT_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error("解密失败");
    }
    return decrypted;
  } catch (error) {
    console.error("[AI Client] 解密 Key 失败:", error);
    throw new Error("API Key 解密失败");
  }
}

/**
 * 初始化 AI 配置（进入项目时调用）
 */
export async function initAIConfig(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await getAIConfig();
      initialized = true;
      console.log("[AI Client] 初始化成功");
    } catch (error) {
      console.warn(
        "[AI Client] 初始化失败（API Key 未配置或接口不可用）:",
        error,
      );
      // 不抛出错误，允许用户继续使用
    }
  })();

  return initPromise;
}

/**
 * AI 是否已初始化
 */
export function isAIInitialized(): boolean {
  return initialized && cachedConfig !== null;
}

/**
 * 获取 AI 配置（带缓存）
 */
export async function getAIConfig(keyId?: number | null): Promise<{
  apiKey: string;
  model: string;
  baseURL: string;
  name: string;
}> {
  // 如果有缓存且没有指定 keyId，直接返回
  if (cachedConfig && keyId == null) {
    return cachedConfig;
  }

  try {
    // 从服务端获取加密的 key
    const result = await getUserApiKey(FEATURE_AI_CHAT, keyId);
    if (!result?.encryptedKey) {
      throw new Error("接口未返回可用的 API Key");
    }

    // 解密 key
    const apiKey = decryptKey(result.encryptedKey);

    // 缓存配置
    cachedConfig = {
      apiKey,
      model: result.config?.model || "gpt-4o",
      baseURL: result.config?.baseURL || "https://api.openai.com/v1",
      name: result.name,
    };

    return cachedConfig;
  } catch (error) {
    console.error("[AI Client] 获取配置失败:", error);
    throw error;
  }
}

/**
 * 清除缓存（切换 key 时使用）
 */
export function clearAIConfigCache(): void {
  cachedConfig = null;
}

/**
 * 前端直接调用 OpenAI Chat API
 */
export async function directChat(options: {
  messages: Array<{ role: string; content: string | any[] }>;
  tools?: any[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  keyId?: number | null;
}): Promise<any> {
  const { messages, tools, model, temperature, maxTokens, keyId } = options;

  // 获取配置
  const config = await getAIConfig(keyId);

  // 构建请求体
  const body: any = {
    model: model || config.model,
    messages,
    temperature: temperature ?? 0.7,
  };

  if (maxTokens) body.max_tokens = maxTokens;
  if (tools && tools.length > 0) body.tools = tools;

  // 直接调用 OpenAI API
  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI 请求失败: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * 前端直接调用 OpenAI Chat API（流式）
 */
export async function* directChatStream(options: {
  messages: Array<{ role: string; content: string | any[] }>;
  tools?: any[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  keyId?: number | null;
}): AsyncGenerator<any, void, unknown> {
  const { messages, tools, model, temperature, maxTokens, keyId } = options;

  // 获取配置
  const config = await getAIConfig(keyId);

  // 构建请求体
  const body: any = {
    model: model || config.model,
    messages,
    temperature: temperature ?? 0.7,
    stream: true,
  };

  if (maxTokens) body.max_tokens = maxTokens;
  if (tools && tools.length > 0) body.tools = tools;

  // 直接调用 OpenAI API
  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI 请求失败: ${response.status} - ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("无法读取响应流");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        try {
          yield JSON.parse(data);
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
  }
}
