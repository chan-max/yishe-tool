import { apiInstance } from "./apiInstance";

export interface ImageGroupMemberInput {
  stickerId: string;
  sortOrder?: number;
}

export interface CreateImageGroupInput {
  name: string;
  description?: string;
  folderId?: string | null;
  meta?: Record<string, any>;
  stickers: ImageGroupMemberInput[];
}

export interface ImageGroupResult {
  id: string;
  name: string;
  description?: string | null;
  folderId?: string | null;
  stickersCount: number;
  stickers: Array<{
    id: string;
    url?: string | null;
    name?: string | null;
    sortOrder?: number | null;
  }>;
}

export async function createImageGroup(
  data: CreateImageGroupInput,
): Promise<ImageGroupResult> {
  const response = await apiInstance.post("/api/image-group", data);
  return response.data.data;
}
