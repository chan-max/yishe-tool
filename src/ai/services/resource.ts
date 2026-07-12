import { directChat } from "@/ai/direct-client";
import { apiInstance } from "@/api/apiInstance";

// ============ 最近搜索结果 URL 记录（供 add-html 校验） ============

const recentImageUrls = new Set<string>();
const RECENT_URL_MAX_AGE = 10 * 60 * 1000; // 10 分钟
const recentImageUrlsTimestamps = new Map<string, number>();

export function addRecentImageUrls(urls: string[]): void {
  const now = Date.now();
  for (const url of urls) {
    recentImageUrls.add(url);
    recentImageUrlsTimestamps.set(url, now);
  }
  // 清理过期
  for (const [url, ts] of recentImageUrlsTimestamps) {
    if (now - ts > RECENT_URL_MAX_AGE) {
      recentImageUrls.delete(url);
      recentImageUrlsTimestamps.delete(url);
    }
  }
}

export function isRecentImageUrl(url: string): boolean {
  return recentImageUrls.has(url);
}

export function getRecentImageUrls(): string[] {
  return Array.from(recentImageUrls);
}

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
  category: string;       // 字体分类，如 "标题字"、"正文字"、"手写体"
  keywords: string;       // 搜索关键词
  languages: string[];    // 支持的语言，如 ['zh-CN', 'en']
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
  colorPalette: string;     // 主色调，逗号分隔的 hex，如 "#ff0000,#00ff00"
}

export interface FontSearchParams {
  query?: string;           // 搜索关键词
  limit?: number;           // 返回数量
  page?: number;            // 页码
  category?: string;        // 字体分类过滤，如 "标题字"、"正文字"
}

export interface ImageSearchParams {
  query?: string;           // 搜索关键词
  limit?: number;           // 返回数量
  page?: number;            // 页码
  isCustom?: boolean;       // 是否为系统自定义（可二次开发）
  isCutout?: boolean;       // 是否为抠图（无背景）
  searchMode?: "text" | "vector";  // 搜索模式：text=关键词搜索，vector=向量语义搜索
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
    const apiParams: Record<string, any> = {
      searchKeyword: params.query,
      currentPage: params.page || 1,
      pageSize: params.limit || 10,
    };
    if (params.category) apiParams.category = params.category;

    const result = await fetchApi("/api/font-template/page", apiParams);

    const searchResult: ResourceSearchResult = {
      items: (result.list || []).map((item: any) => ({
        id: item.id,
        name: item.name || "未命名字体",
        description: item.description || "",
        url: item.url || "",
        thumbnail: item.thumbnail || "",
        category: item.category || "",
        keywords: item.keywords || "",
        languages: item.languages || [],
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
    let result: any;

    // 向量语义搜索模式
    if (params.searchMode === "vector") {
      const response = await apiInstance.post("/api/vector-search/search", {
        collection: "stickers",
        query: params.query || "",
        limit: params.limit || 10,
      });
      const data = response.data?.data || response.data;

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Vector search failed: ${response.statusText}`);
      }

      result = {
        list: (data.items || []).map((item: any) => ({
          id: item.sourceId,
          ...item.payload,
        })),
        total: data.total || 0,
      };
    } else {
      // 默认关键词搜索
      const apiParams: Record<string, any> = {
        searchText: params.query || '',
        currentPage: params.page || 1,
        pageSize: params.limit || 10,
      };
      if (params.isCustom !== undefined) apiParams.isCustom = params.isCustom;
      if (params.isCutout !== undefined) apiParams.isCutout = params.isCutout;

      result = await fetchApi("/api/sticker/page", apiParams);
    }

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
        colorPalette: item.colorPalette || "",
      })),
      total: result.total || 0,
      query: params.query || "",
    };

    if (searchResult.items.length > 0) {
      setCache(cacheKey, searchResult);
      // 记录最近搜索到的图片 URL，供 add-html 校验
      addRecentImageUrls(searchResult.items.map((item) => item.url).filter(Boolean));
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
      category: result.category || "",
      keywords: result.keywords || "",
      languages: result.languages || [],
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
      colorPalette: result.colorPalette || "",
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
      description: `搜索字体库。返回字体列表，每项包含 id/name/url/category/keywords。

**搜索到字体后，必须在 canvas.addHtml 的 htmlBindings 中绑定，HTML 中用 {{font.xxx.family}} 引用。**

示例流程：
1. resource.searchFont({ query: "艺术" })
2. canvas.addHtml({ htmlContent: "<div style='font-family:{{font.brand.family}};...'>文字</div>", htmlBindings: { font: { brand: { id:"搜到的id", url:"搜到的url", name:"搜到的name" } } } })`,
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "搜索关键词。推荐：标题字、手写体、艺术、简约、可爱、复古、科技、书法、衬线",
          },
          limit: {
            type: "number",
            description: "返回数量，默认 5，最大 20",
          },
          category: {
            type: "string",
            description: "字体分类过滤，如：标题字、正文字、手写体。不填则搜索全部分类。",
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
      description: `搜索图库/贴纸库。返回图片列表，每项包含 id/name/url/keywords/colorPalette/width/height/isCutout。

**【必须遵守 - 违反视为失败】**
1. 搜索到多张图片后，必须在 HTML 中使用**每张不同的图片**，每张图片绑定为独立的 key
2. 禁止用同一张图片的 background-position 裁切来冒充多张不同图片！
3. 禁止用纯色块/渐变代替图片！
4. 如果需要 N 张图，就搜 N 张，绑定 N 个不同的 key，HTML 中引用 N 个不同的 URL

**正确示例（照片墙 - 4张不同图片）：**
1. resource.searchImage({ query: "风景", limit: 4 })
   → 返回 img1(id:a, url:url_a), img2(id:b, url:url_b), img3(id:c, url:url_c), img4(id:d, url:url_d)
2. canvas.addHtml({
     htmlContent: "<div style='...'>
       <div style='background-image:url({{image.img1.url}});...'></div>
       <div style='background-image:url({{image.img2.url}});...'></div>
       <div style='background-image:url({{image.img3.url}});...'></div>
       <div style='background-image:url({{image.img4.url}});...'></div>
     </div>",
     htmlBindings: {
       image: {
         img1: { id: "a的id", url: "url_a", name: "a的name" },
         img2: { id: "b的id", url: "url_b", name: "b的name" },
         img3: { id: "c的id", url: "url_c", name: "c的name" },
         img4: { id: "d的id", url: "url_d", name: "d的name" }
       }
     }
   })

**错误示例（同一张图裁切 - 禁止！）：**
<div style='background-image:url({{image.bg.url}});background-position:center;'></div>
<div style='background-image:url({{image.bg.url}});background-position:20% 30%;'></div>
← 这是同一张图，不是多张图！

筛选说明：
- isCustom: true 仅返回系统自定义贴纸（可二次开发）
- isCutout: true 仅返回抠图素材（无背景，适合叠加使用）`,
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "搜索关键词，简短精准效果更好。如：猫咪、风景、科技、纹理、渐变、星空、花朵",
          },
          limit: {
            type: "number",
            description: "返回数量，默认 5，最大 20",
          },
          isCustom: {
            type: "boolean",
            description: "仅返回系统自定义贴纸（可基于其二次开发）",
          },
          isCutout: {
            type: "boolean",
            description: "仅返回抠图素材（无背景，适合叠加使用）",
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
        category: args.category,
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
          category: item.category,
          keywords: item.keywords,
          languages: item.languages,
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
          width: item.width,
          height: item.height,
          colorPalette: item.colorPalette,
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
