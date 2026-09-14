export type Forum = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  threadCount: number;
  postCount: number;
  lastActivityAt: string;
};

type ForumListResponse = {
  data: Forum[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
  };
};

const DEFAULT_FORUM_API_URL = "https://forumservice-942724250878.asia-south1.run.app";
const FORUM_API_URL = (import.meta.env.VITE_FORUM_API_URL || DEFAULT_FORUM_API_URL).replace(/\/$/, "");

export async function getForums(signal?: AbortSignal): Promise<Forum[]> {
  const response = await fetch(`${FORUM_API_URL}/api/v1/forums`, { signal });
  const payload = (await response.json()) as ForumListResponse & { message?: string };

  if (!response.ok) throw new Error(payload.message || "Unable to load forums right now.");
  if (!Array.isArray(payload.data)) throw new Error("The forum service returned an unexpected response.");

  return payload.data;
}
