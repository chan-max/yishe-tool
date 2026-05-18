import { directChat } from "@/ai/direct-client";
import { apiInstance } from "@/api/apiInstance";

// ============ 搜索缓存 ============

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 分钟过期
const searchCache = new Map<string, CacheEntry<any>>();

function getCacheKey(tool: string, params: Record<string, any>): string {
  const sorted = Object.keys(params)
    .sort()
    .filter((k) => params[k] !== undefined)
    .map((k) => `${k}:${JSON.stringify(params[k])}`)
    .join("|");
  return `${tool}:${sorted}`;
}

function getFromCache<T>(key: string): T | null {
  const entry = searchCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    searchCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  searchCache.set(key, { data, timestamp: Date.now() });
}

// ============ 资源类型定义 ============

export interface FontResource {
  id: string;
  name: string;
  description: string;
  url: string;
  thumbnail: string;
}

export interface ImageResource {
  id: string;
  name: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string;
  keywords: string;
  width: number;
  height: number;
  isCustom: boolean;        // 是否为系统自定义（可二次开发）
  isCutout: boolean;        // 是否为抠图（无背景）
}

export interface FontSearchParams {
  query?: string;           // 搜索关键词
  limit?: number;           // 返回数量
  page?: number;            // 页码
}

export interface ImageSearchParams {
  query?: string;           // 搜索关键词
  limit?: number;           // 返回数量
  page?: number;            // 页码
  isCustom?: boolean;       // 是否为系统自定义（可二次开发）
  isCutout?: boolean;       // 是否为抠图（无背景）
}

export interface ResourceSearchResult {
  items: FontResource[] | ImageResource[];
  total: number;
  query: string;
}

// ============ API 调用 ============

async function fetchApi(endpoint: string, params: Record<string, any> = {}) {
  const response = await apiInstance.post(endpoint, params);
  return response.data?.data || response.data;
}

// ============ 字体资源服务 ============

export async function searchFontResources(
  params: FontSearchParams
): Promise<ResourceSearchResult> {
  const cacheKey = getCacheKey("font", params);
  const cached = getFromCache<ResourceSearchResult>(cacheKey);
  if (cached) {
    console.log("[ResourceService] 字体缓存命中:", params.query);
    return cached;
  }

  try {
    const result = await fetchApi("/api/font-template/page", {
      searchKeyword: params.query,
      currentPage: params.page || 1,
      pageSize: params.limit || 10,
    });

    const searchResult: ResourceSearchResult = {
      items: (result.list || []).map((item: any) => ({
        id: item.id,
        name: item.name || "未命名字体",
        description: item.description || "",
        url: item.url || "",
        thumbnail: item.thumbnail || "",
      })),
      total: result.total || 0,
      query: params.query || "",
    };

    if (searchResult.items.length > 0) {
      setCache(cacheKey, searchResult);
    }

    return searchResult;
  } catch (error) {
    console.error("[ResourceService] 搜索字体失败:", error);
    return { items: [], total: 0, query: params.query || "" };
  }
}

// ============ 图片资源服务 ============

export async function searchImageResources(
  params: ImageSearchParams
): Promise<ResourceSearchResult> {
  const cacheKey = getCacheKey("image", params);
  const cached = getFromCache<ResourceSearchResult>(cacheKey);
  if (cached) {
    console.log("[ResourceService] 图片缓存命中:", params.query);
    return cached;
  }

  try {
    const apiParams: Record<string, any> = {
      search: params.query,
      currentPage: params.page || 1,
      pageSize: params.limit || 10,
    };
    if (params.isCustom !== undefined) apiParams.isCustom = params.isCustom;
    if (params.isCutout !== undefined) apiParams.isCutout = params.isCutout;

    const result = await fetchApi("/api/sticker/page", apiParams);

    const searchResult: ResourceSearchResult = {
      items: (result.list || []).map((item: any) => ({
        id: item.id,
        name: item.name || "未命名图片",
        description: item.description || "",
        url: item.url || "",
        thumbnail: item.thumbnail || item.url || "",
        category: item.category || "",
        keywords: item.keywords || "",
        width: item.width || 0,
        height: item.height || 0,
        isCustom: Boolean(item.isCustom),
        isCutout: Boolean(item.isCutout),
      })),
      total: result.total || 0,
      query: params.query || "",
    };

    if (searchResult.items.length > 0) {
      setCache(cacheKey, searchResult);
    }

    return searchResult;
  } catch (error) {
    console.error("[ResourceService] 搜索图片失败:", error);
    return { items: [], total: 0, query: params.query || "" };
  }
}

// ============ 单个资源获取 ============

export async function getFontResource(id: string): Promise<FontResource | null> {
  try {
    const result = await fetchApi(`/api/font-template/${id}`);
    if (!result) return null;
    return {
      id: result.id,
      name: result.name || "未命名字体",
      description: result.description || "",
      url: result.url || "",
      thumbnail: result.thumbnail || "",
    };
  } catch (error) {
    console.error("[ResourceService] 获取字体失败:", error);
    return null;
  }
}

export async function getImageResource(id: string): Promise<ImageResource | null> {
  try {
    const result = await fetchApi(`/api/sticker/${id}`);
    if (!result) return null;
    return {
      id: result.id,
      name: result.name || "未命名图片",
      description: result.description || "",
      url: result.url || "",
      thumbnail: result.thumbnail || result.url || "",
      category: result.category || "",
      keywords: result.keywords || "",
      width: result.width || 0,
      height: result.height || 0,
      isCustom: Boolean(result.isCustom),
      isCutout: Boolean(result.isCutout),
    };
  } catch (error) {
    console.error("[ResourceService] 获取图片失败:", error);
    return null;
  }
}

// ============ AI 工具定义 ============

export const resourceTools = [
  {
    type: "function" as const,
    function: {
      name: "resource.searchFont",
      description: `搜索字体资源。当用户需要字体、字型、文字样式时使用。

返回字体列表，包含预览图、下载地址等完整信息。
返回的 url 字段用于 @font-face 加载字体。

**重要：搜索到字体后，必须用 @font-face 加载才能在 font-family 中使用！**`,
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "搜索关键词，如：简约、现代、复古、可爱、艺术、手写、科技",
          },
          limit: {
            type: "number",
            description: "返回数量，默认 5，最大 20",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "resource.searchImage",
      description: `搜索图片资源。当用户需要图片、插图、图标、背景图时使用。

返回图片列表，包含预览图、URL 地址等完整信息。
返回的 url 字段可直接用于 HTML 的 <img> 标签或 background-image。

筛选说明：
- isCustom: true 仅返回系统自定义贴纸（可二次开发）
- isCutout: true 仅返回抠图素材（无背景，适合叠加使用）`,
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "搜索关键词，如：猫咪、风景、科技、纹理、渐变",
          },
          limit: {
            type: "number",
            description: "返回数量，默认 5，最大 20",
          },
          isCustom: {
            type: "boolean",
            description: "是否仅返回系统自定义贴纸（可基于其二次开发）",
          },
          isCutout: {
            type: "boolean",
            description: "是否仅返回抠图素材（无背景，适合叠加使用）",
          },
        },
        required: ["query"],
      },
    },
  },
];

// ============ AI 工具执行 ============

export async function executeResourceTool(
  toolName: string,
  args: Record<string, any>
): Promise<any> {
  switch (toolName) {
    case "resource.searchFont": {
      const result = await searchFontResources({
        query: args.query,
        limit: args.limit || 5,
      });
      if (result.items.length === 0) {
        return {
          success: true,
          data: [],
          total: 0,
          query: result.query,
          message: `未找到与"${result.query}"相关的字体，建议：\n1. 尝试更简洁的关键词（如：手写、艺术、可爱、简约）\n2. 直接使用系统默认字体`,
        };
      }
      return {
        success: true,
        data: result.items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          thumbnail: item.thumbnail,
          url: item.url,
        })),
        total: result.total,
        query: result.query,
      };
    }

    case "resource.searchImage": {
      const result = await searchImageResources({
        query: args.query,
        limit: args.limit || 5,
        isCustom: args.isCustom,
        isCutout: args.isCutout,
      });
      if (result.items.length === 0) {
        return {
          success: true,
          data: [],
          total: 0,
          query: result.query,
          message: `未找到与"${result.query}"相关的图片，建议：\n1. 尝试更简洁的关键词\n2. 移除筛选条件（isCustom/isCutout）重新搜索\n3. 使用其他素材方式（如添加形状、文字）`,
        };
      }
      return {
        success: true,
        data: result.items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          thumbnail: item.thumbnail,
          url: item.url,
          keywords: item.keywords,
          category: item.category,
          isCustom: item.isCustom,
          isCutout: item.isCutout,
        })),
        total: result.total,
        query: result.query,
      };
    }

    default:
      return { success: false, error: `未知工具: ${toolName}` };
  }
}

// ============ 搜索历史导出 ============

export interface SearchHistoryEntry {
  tool: string;
  query: string;
  resultCount: number;
  timestamp: number;
}

export function getSearchHistory(): SearchHistoryEntry[] {
  const history: SearchHistoryEntry[] = [];
  for (const [key, entry] of searchCache.entries()) {
    const data = entry.data as ResourceSearchResult;
    const tool = key.startsWith("font:") ? "resource.searchFont" : "resource.searchImage";
    history.push({
      tool,
      query: data.query,
      resultCount: data.items.length,
      timestamp: entry.timestamp,
    });
  }
  return history.sort((a, b) => b.timestamp - a.timestamp);
}

export function getCachedResultsSummary(): string {
  const history = getSearchHistory();
  if (history.length === 0) return "";

  const lines = history.map(
    (h) => `- ${h.tool}("${h.query}") → ${h.resultCount} 个结果`
  );
  return `已缓存的搜索结果（无需重复搜索）:\n${lines.join("\n")}`;
}

export function clearSearchCache(): void {
  searchCache.clear();
}

// ============ 资源服务导出 ============

export const resourceService = {
  searchFont: searchFontResources,
  searchImage: searchImageResources,
  getFont: getFontResource,
  getImage: getImageResource,
  executeTool: executeResourceTool,
  tools: resourceTools,
  getSearchHistory,
  getCachedResultsSummary,
  clearSearchCache,
};
