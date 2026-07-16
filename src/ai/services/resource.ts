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

export interface SentenceResource {
  id: number;
  content: string;
  description: string;
  keywords?: string;
}

export interface TextDocumentResource {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  category: string | null;
  tags: string | null;
}

export interface FontSearchParams {
  query?: string;           // 搜索关键词
  limit?: number;           // 返回数量
  page?: number;            // 页码
  category?: string;        // 字体分类过滤，如 "标题字"、"正文字"
  searchMode?: "text" | "vector";  // 搜索模式：text=关键词搜索，vector=向量语义搜索
}

export interface ImageSearchParams {
  query?: string;           // 搜索关键词
  limit?: number;           // 返回数量
  page?: number;            // 页码
  isCustom?: boolean;       // 是否为系统自定义（可二次开发）
  isCutout?: boolean;       // 是否为抠图（无背景）
  searchMode?: "text" | "vector";  // 搜索模式：text=关键词搜索，vector=向量语义搜索
  aspectRatio?: string;     // 宽高比，如 "1:1", "16:9"
  aspectRatioTolerance?: number; // 宽高比容差
  minWidth?: number;        // 最小宽度
  maxWidth?: number;        // 最大宽度
  minHeight?: number;       // 最小高度
  maxHeight?: number;       // 最大高度
}

export interface SentenceSearchParams {
  query?: string;
  limit?: number;
  page?: number;
  searchMode?: "text" | "vector";  // 搜索模式：text=关键词搜索，vector=向量语义搜索
}

export interface TextDocumentSearchParams {
  query?: string;
  limit?: number;
  page?: number;
  category?: string;
  searchMode?: "text" | "vector";  // 搜索模式：text=关键词搜索，vector=向量语义搜索
}

export interface ResourceSearchResult {
  items: FontResource[] | ImageResource[] | SentenceResource[] | TextDocumentResource[];
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
      searchMode: params.searchMode || "vector", // 默认启用混合向量检索
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
    const limit = params.limit || 10;
    // 向量或复杂查询时多查一些，方便在前端做宽高、宽高比过滤
    const needsFiltering = Boolean(
      params.aspectRatio ||
      params.minWidth !== undefined ||
      params.maxWidth !== undefined ||
      params.minHeight !== undefined ||
      params.maxHeight !== undefined
    );
    const pageSize = needsFiltering ? Math.max(limit * 3, 50) : limit;

    const apiParams: Record<string, any> = {
      searchText: params.query || '',
      currentPage: params.page || 1,
      pageSize: pageSize,
      searchMode: params.searchMode || "vector", // 默认启用混合向量检索
    };

    if (params.isCustom !== undefined) apiParams.isCustom = params.isCustom;
    if (params.isCutout !== undefined) apiParams.isCutout = params.isCutout;

    const result = await fetchApi("/api/sticker/page", apiParams);
    let list = result.list || [];

    // 本地过滤：宽高范围
    if (params.minWidth !== undefined) {
      list = list.filter((item: any) => (item.width || 0) >= params.minWidth!);
    }
    if (params.maxWidth !== undefined) {
      list = list.filter((item: any) => (item.width || 0) <= params.maxWidth!);
    }
    if (params.minHeight !== undefined) {
      list = list.filter((item: any) => (item.height || 0) >= params.minHeight!);
    }
    if (params.maxHeight !== undefined) {
      list = list.filter((item: any) => (item.height || 0) <= params.maxHeight!);
    }

    // 本地过滤：宽高比
    if (params.aspectRatio && params.aspectRatio !== 'any') {
      const [rw, rh] = params.aspectRatio.split(':').map(Number);
      const targetRatio = rw / rh;
      const tolerance = params.aspectRatioTolerance !== undefined ? params.aspectRatioTolerance : 0.15;
      list = list.filter((item: any) => {
        if (!item.width || !item.height) return false;
        const itemRatio = item.width / item.height;
        return Math.abs(itemRatio - targetRatio) / targetRatio <= tolerance;
      });
    }

    // 截取到 limit
    list = list.slice(0, limit);

    const searchResult: ResourceSearchResult = {
      items: list.map((item: any) => ({
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
      total: result.total || list.length,
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

// ============ 句子/文案资源服务 ============

export async function searchSentenceResources(
  params: SentenceSearchParams
): Promise<ResourceSearchResult> {
  const cacheKey = getCacheKey("sentence", params);
  const cached = getFromCache<ResourceSearchResult>(cacheKey);
  if (cached) {
    console.log("[ResourceService] 句子缓存命中:", params.query);
    return cached;
  }

  try {
    const apiParams: Record<string, any> = {
      search: params.query,
      currentPage: params.page || 1,
      pageSize: params.limit || 10,
      searchMode: params.searchMode || "vector", // 默认启用混合向量检索
    };

    const result = await fetchApi("/api/sentences/page", apiParams);

    const searchResult: ResourceSearchResult = {
      items: (result.list || []).map((item: any) => ({
        id: item.id,
        content: item.content || "",
        description: item.description || "",
        keywords: item.keywords || "",
      })),
      total: result.total || 0,
      query: params.query || "",
    };

    if (searchResult.items.length > 0) {
      setCache(cacheKey, searchResult);
    }

    return searchResult;
  } catch (error) {
    console.error("[ResourceService] 搜索句子失败:", error);
    return { items: [], total: 0, query: params.query || "" };
  }
}

// ============ 文档资源服务 ============

export async function searchTextDocumentResources(
  params: TextDocumentSearchParams
): Promise<ResourceSearchResult> {
  const cacheKey = getCacheKey("textDocument", params);
  const cached = getFromCache<ResourceSearchResult>(cacheKey);
  if (cached) {
    console.log("[ResourceService] 文档缓存命中:", params.query);
    return cached;
  }

  try {
    const apiParams: Record<string, any> = {
      keyword: params.query,
      page: params.page || 1,
      pageSize: params.limit || 10,
      searchMode: params.searchMode || "vector", // 默认启用混合向量检索
    };
    if (params.category) apiParams.category = params.category;

    const result = await fetchApi("/api/text-document/page", apiParams);

    const searchResult: ResourceSearchResult = {
      items: (result.list || []).map((item: any) => ({
        id: item.id,
        title: item.title || "",
        content: item.content || "",
        summary: item.summary || "",
        category: item.category || "",
        tags: item.tags || "",
      })),
      total: result.total || 0,
      query: params.query || "",
    };

    if (searchResult.items.length > 0) {
      setCache(cacheKey, searchResult);
    }

    return searchResult;
  } catch (error) {
    console.error("[ResourceService] 搜索文档失败:", error);
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
      description: `搜索字体库。支持后端向量混合语义搜索。返回字体列表，每项包含 id/name/url/category/keywords。

**搜索到字体后，必须在 canvas.addHtml 的 htmlBindings 中绑定，HTML 中用 {{font.xxx.family}} 引用。**

示例流程：
1. resource.searchFont({ query: "艺术" })
2. canvas.addHtml({ htmlContent: "<div style='font-family:{{font.brand.family}};...'>文字</div>", htmlBindings: { font: { brand: { id:"搜到的id", url:"搜到的url", name:"搜到的name" } } } })`,
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "搜索关键词或自然语言描述，语义匹配效果极好。推荐：标题字、手写体、艺术、简约、可爱、复古、科技、书法、衬线",
          },
          limit: {
            type: "number",
            description: "返回数量，默认 5，最大 20",
          },
          category: {
            type: "string",
            description: "字体分类过滤，如：标题字、正文字、手写体。不填则搜索全部分类。",
          },
          searchMode: {
            type: "string",
            enum: ["vector", "text"],
            description: "检索模式，vector=向量语义搜索（推荐，用于模糊匹配与自然语言意图），text=关键词精准文本搜索",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "resource.searchSticker",
      description: `从素材库/贴纸库搜索贴纸和插画素材。支持后端向量混合语义搜索，并能进行比例、尺寸过滤。
返回图片列表，每项包含 id/name/url/keywords/colorPalette/width/height/isCutout。

**【必须遵守 - 违反视为失败】**
1. 搜索到多张图片后，必须在 HTML 中使用**每张不同的图片**，每张图片绑定为独立的 key
2. 禁止用同一张图片的 background-position 裁切来冒充多张不同图片！
3. 禁止用纯色块/渐变代替图片！
4. 如果需要 N 张图，就搜 N 张，绑定 N 个不同的 key，HTML 中引用 N 个不同的 URL

**正确示例（照片墙 - 4张不同图片）：**
1. resource.searchSticker({ query: "风景", limit: 4 })
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
   })`,
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "搜索描述语或关键词，语义匹配效果极好。如：猫咪、极简风纹理、中国风底纹",
          },
          limit: {
            type: "number",
            description: "返回数量，默认 5，最大 20",
          },
          searchMode: {
            type: "string",
            enum: ["vector", "text"],
            description: "检索模式，vector=向量语义搜索（推荐，用于模糊匹配与自然语言意图），text=关键词精准文本搜索",
          },
          isCustom: {
            type: "boolean",
            description: "仅返回自定义模版贴纸（可基于其二次修改）",
          },
          isCutout: {
            type: "boolean",
            description: "仅返回已抠图素材（透明背景，适合图层重叠叠加）",
          },
          aspectRatio: {
            type: "string",
            description: "按宽高比筛选，格式如 '1:1', '16:9', '9:16', '3:4' 等，不传代表不限。可根据当前目标画布形状进行选择",
          },
          aspectRatioTolerance: {
            type: "number",
            description: "宽高比允许的偏差值，默认 0.15 表示允许偏差 ±15%",
          },
          minWidth: {
            type: "number",
            description: "筛选像素宽度 >= 这里的数值，避免素材过小模糊",
          },
          maxWidth: {
            type: "number",
            description: "筛选像素宽度 <= 这里的数值",
          },
          minHeight: {
            type: "number",
            description: "筛选像素高度 >= 这里的数值",
          },
          maxHeight: {
            type: "number",
            description: "筛选像素高度 <= 这里的数值",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "resource.searchSentence",
      description: `从文案库中搜索优美的句子、广告词、心情语录等文案素材。支持后端向量混合语义搜索。
返回文案列表，每项包含 id/content/description/keywords。你必须将搜到的句子直接用到设计文本元素中。`,
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "文案搜索关键词或自然语言描述，语义匹配效果极好，如：治愈、猫咪、七夕、中秋、促销、正能量",
          },
          limit: {
            type: "number",
            description: "返回数量，默认 5，最大 20",
          },
          searchMode: {
            type: "string",
            enum: ["vector", "text"],
            description: "检索模式，vector=向量语义搜索（推荐，用于模糊匹配与自然语言意图），text=关键词精准文本搜索",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "resource.searchTextDocument",
      description: `从文档库中搜索文本文档（如详细描述、背景文章、设计规范等）。支持后端向量混合语义搜索。
返回文档列表，每项包含 id/title/content/summary/category/tags。`,
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "文档搜索关键词或自然语言描述，语义匹配效果极好",
          },
          limit: {
            type: "number",
            description: "返回数量，默认 5，最大 20",
          },
          category: {
            type: "string",
            description: "分类过滤",
          },
          searchMode: {
            type: "string",
            enum: ["vector", "text"],
            description: "检索模式，vector=向量语义搜索（推荐，用于模糊匹配与自然语言意图），text=关键词精准文本搜索",
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
        searchMode: args.searchMode,
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

    case "resource.searchSticker": {
      const result = await searchImageResources({
        query: args.query,
        limit: args.limit || 5,
        searchMode: args.searchMode,
        isCustom: args.isCustom,
        isCutout: args.isCutout,
        aspectRatio: args.aspectRatio,
        aspectRatioTolerance: args.aspectRatioTolerance,
        minWidth: args.minWidth,
        maxWidth: args.maxWidth,
        minHeight: args.minHeight,
        maxHeight: args.maxHeight,
      });
      if (result.items.length === 0) {
        return {
          success: true,
          data: [],
          total: 0,
          query: result.query,
          message: `未找到与"${result.query}"相关的贴纸，建议：\n1. 尝试更简洁的关键词\n2. 移除或放宽筛选条件（isCustom/isCutout/宽高比等）重新搜索\n3. 使用其他素材方式（如添加形状、文字）`,
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

    case "resource.searchSentence": {
      const result = await searchSentenceResources({
        query: args.query,
        limit: args.limit || 5,
        searchMode: args.searchMode,
      });
      if (result.items.length === 0) {
        return {
          success: true,
          data: [],
          total: 0,
          query: result.query,
          message: `未找到与"${result.query}"相关的文案，建议：\n1. 尝试更通用的词语\n2. 直接使用默认文案`,
        };
      }
      return {
        success: true,
        data: result.items.map((item: any) => ({
          id: item.id,
          content: item.content,
          description: item.description,
          keywords: item.keywords,
        })),
        total: result.total,
        query: result.query,
      };
    }

    case "resource.searchTextDocument": {
      const result = await searchTextDocumentResources({
        query: args.query,
        limit: args.limit || 5,
        category: args.category,
        searchMode: args.searchMode,
      });
      if (result.items.length === 0) {
        return {
          success: true,
          data: [],
          total: 0,
          query: result.query,
          message: `未找到与"${result.query}"相关的文档，建议：\n1. 放宽或更换搜索词\n2. 检查分类参数`,
        };
      }
      return {
        success: true,
        data: result.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          summary: item.summary,
          category: item.category,
          tags: item.tags,
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
    let tool = "resource.searchSticker";
    if (key.startsWith("font:")) tool = "resource.searchFont";
    else if (key.startsWith("sentence:")) tool = "resource.searchSentence";
    else if (key.startsWith("textDocument:")) tool = "resource.searchTextDocument";
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
  searchSentence: searchSentenceResources,
  searchTextDocument: searchTextDocumentResources,
  getFont: getFontResource,
  getImage: getImageResource,
  executeTool: executeResourceTool,
  tools: resourceTools,
  getSearchHistory,
  getCachedResultsSummary,
  clearSearchCache,
};
