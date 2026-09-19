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

export type Pagination = {
  nextCursor: string | null;
  hasMore: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
};

export type ThreadAuthor = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

export type ThreadTag = {
  id: string;
  name: string;
  slug: string;
};

export type ForumThread = {
  id: string;
  forumId: string;
  author: ThreadAuthor;
  title: string;
  slug: string;
  score: number;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  lastActivityAt: string;
  isPinned: boolean;
  isLocked: boolean;
  tags: ThreadTag[];
  raceId: string | null;
  userVote: "up" | "down" | null;
};

type ForumListResponse = PaginatedResponse<Forum>;
type ThreadListResponse = PaginatedResponse<ForumThread>;

type ErrorResponse = {
  message?: string;
};

const DEFAULT_FORUM_API_URL = "https://forumservice-942724250878.asia-south1.run.app";
const FORUM_API_URL = (import.meta.env.VITE_FORUM_API_URL || DEFAULT_FORUM_API_URL).replace(/\/$/, "");

export async function getForums(signal?: AbortSignal): Promise<Forum[]> {
  const response = await fetch(`${FORUM_API_URL}/api/v1/forums`, { signal });
  const payload = (await response.json()) as ForumListResponse & ErrorResponse;

  if (!response.ok) throw new Error(payload.message || "Unable to load forums right now.");
  if (!Array.isArray(payload.data)) throw new Error("The forum service returned an unexpected response.");

  return payload.data;
}

export async function getForumThreads(forumId: string, cursor?: string | null, signal?: AbortSignal): Promise<ThreadListResponse> {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  const query = params.size ? `?${params.toString()}` : "";
  const response = await fetch(`${FORUM_API_URL}/api/v1/forums/${encodeURIComponent(forumId)}/threads${query}`, { signal });
  const payload = (await response.json()) as ThreadListResponse & ErrorResponse;

  if (!response.ok) throw new Error(payload.message || "Unable to load threads right now.");
  if (!Array.isArray(payload.data) || !payload.pagination) throw new Error("The forum service returned an unexpected response.");

  return payload;
}
