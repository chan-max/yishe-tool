import { apiInstance } from "@/api/apiInstance";
import { Url } from "@/api/url";
import type {
  DesignPromptItem,
  CreateDesignPromptParams,
  UpdateDesignPromptParams,
  QueryDesignPromptParams,
  DesignPromptPageResponse,
} from "./types";

/** 创建 */
export async function createDesignPrompt(
  params: CreateDesignPromptParams
): Promise<DesignPromptItem> {
  const res = await apiInstance.post(Url.DESIGN_PROMPT_CREATE, params);
  return res.data.data || res.data;
}

/** 更新 */
export async function updateDesignPrompt(
  params: UpdateDesignPromptParams
): Promise<DesignPromptItem> {
  const res = await apiInstance.post(Url.DESIGN_PROMPT_UPDATE, params);
  return res.data.data || res.data;
}

/** 删除 */
export async function deleteDesignPrompt(
  ids: string | string[]
): Promise<void> {
  const idArray = Array.isArray(ids) ? ids : [ids];
  await apiInstance.post(Url.DESIGN_PROMPT_DELETE, { ids: idArray });
}

/** 分页查询 */
export async function queryDesignPromptPage(
  params: QueryDesignPromptParams = {}
): Promise<DesignPromptPageResponse> {
  const res = await apiInstance.post(Url.DESIGN_PROMPT_PAGE, params);
  return res.data.data || res.data;
}

/** 收藏 */
export async function favoriteDesignPrompt(id: string): Promise<void> {
  await apiInstance.post(Url.DESIGN_PROMPT_FAVORITE, { id });
}

/** 取消收藏 */
export async function unfavoriteDesignPrompt(id: string): Promise<void> {
  await apiInstance.post(Url.DESIGN_PROMPT_UNFAVORITE, { id });
}
