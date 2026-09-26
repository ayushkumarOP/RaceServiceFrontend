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
  userVote: VoteValue | null;
};

export type VoteValue = "up" | "down";

import { authenticatedFetch } from "./auth";

export type ForumComment = {
  id: string;
  threadId: string;
  parentCommentId: string | null;
  author: ThreadAuthor;
  content: { text: string | null };
  score: number;
  upvoteCount: number;
  downvoteCount: number;
  replyCount: number;
  depth: number;
  createdAt: string;
  updatedAt: string | null;
  isEdited: boolean;
  isDeleted: boolean;
  userVote: VoteValue | null;
};

type ForumListResponse = PaginatedResponse<Forum>;
type ThreadListResponse = PaginatedResponse<ForumThread>;
type CommentListResponse = PaginatedResponse<ForumComment>;

type ErrorResponse = {
  message?: string;
  error?: {
    message?: string;
  };
};

function getErrorMessage(payload: ErrorResponse, fallback: string) {
  return payload.message || payload.error?.message || fallback;
}

const FORUM_API_URL = import.meta.env.VITE_GATEWAY_URL?.replace(/\/$/, "");

if (!FORUM_API_URL) {
  throw new Error("VITE_GATEWAY_URL must be set to the public gateway URL.");
}

export async function getForums(signal?: AbortSignal): Promise<Forum[]> {
  const response = await authenticatedFetch(`${FORUM_API_URL}/api/v1/forums`, { signal });
  const payload = (await response.json()) as ForumListResponse & ErrorResponse;

  if (!response.ok) throw new Error(getErrorMessage(payload, "Unable to load forums right now."));
  if (!Array.isArray(payload.data)) throw new Error("The forum service returned an unexpected response.");

  return payload.data;
}

export async function getForumThreads(forumId: string, cursor?: string | null, signal?: AbortSignal): Promise<ThreadListResponse> {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  const query = params.size ? `?${params.toString()}` : "";
  const response = await authenticatedFetch(`${FORUM_API_URL}/api/v1/forums/${encodeURIComponent(forumId)}/threads${query}`, { signal });
  const payload = (await response.json()) as ThreadListResponse & ErrorResponse;

  if (!response.ok) throw new Error(getErrorMessage(payload, "Unable to load threads right now."));
  if (!Array.isArray(payload.data) || !payload.pagination) throw new Error("The forum service returned an unexpected response.");

  return payload;
}

export async function getThreadComments(threadId: string, cursor?: string | null, pageSize?: number, signal?: AbortSignal): Promise<CommentListResponse> {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  if (pageSize) params.set("pageSize", String(pageSize));
  const query = params.size ? `?${params.toString()}` : "";
  const response = await authenticatedFetch(`${FORUM_API_URL}/api/v1/threads/${encodeURIComponent(threadId)}/comments${query}`, { signal });
  const payload = (await response.json()) as CommentListResponse & ErrorResponse;

  if (!response.ok) throw new Error(getErrorMessage(payload, "Unable to load comments right now."));
  if (!Array.isArray(payload.data) || !payload.pagination) throw new Error("The forum service returned an unexpected response.");

  return payload;
}

async function voteRequest(path: string, options: RequestInit) {
  const response = await authenticatedFetch(`${FORUM_API_URL}${path}`, options);
  if (response.ok) return;

  const payload = await response.json().catch(() => ({})) as ErrorResponse;
  throw new Error(getErrorMessage(payload, "Unable to update your vote right now."));
}

export function setThreadVote(threadId: string, vote: VoteValue) {
  return voteRequest(`/api/v1/threads/${encodeURIComponent(threadId)}/vote`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vote }),
  });
}

export function removeThreadVote(threadId: string) {
  return voteRequest(`/api/v1/threads/${encodeURIComponent(threadId)}/vote`, { method: "DELETE" });
}

export function setCommentVote(commentId: string, vote: VoteValue) {
  return voteRequest(`/api/v1/comments/${encodeURIComponent(commentId)}/vote`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vote }),
  });
}

export function removeCommentVote(commentId: string) {
  return voteRequest(`/api/v1/comments/${encodeURIComponent(commentId)}/vote`, { method: "DELETE" });
}
