import { useCallback, useEffect, useState, type ReactNode } from "react";
import { getForums, getForumThreads, type Forum, type ForumThread, type Pagination } from "../services/forums";

type LoadState = "loading" | "ready" | "empty" | "error";

function useForums() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    getForums(controller.signal).then((items) => { if (!controller.signal.aborted) { setForums(items); setState(items.length ? "ready" : "empty"); } }).catch((reason: unknown) => { if (!controller.signal.aborted) { setError(reason instanceof Error ? reason.message : "Unable to load forums right now."); setState("error"); } });
    return () => controller.abort();
  }, [reloadKey]);
  const retry = useCallback(() => { setState("loading"); setError(""); setReloadKey((key) => key + 1); }, []);
  return { forums, state, error, retry };
}

function useForumThreads(forumId: string) {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    getForumThreads(forumId, undefined, controller.signal).then((response) => { if (!controller.signal.aborted) { setThreads(response.data); setPagination(response.pagination); setState(response.data.length ? "ready" : "empty"); } }).catch((reason: unknown) => { if (!controller.signal.aborted) { setError(reason instanceof Error ? reason.message : "Unable to load threads right now."); setState("error"); } });
    return () => controller.abort();
  }, [forumId, reloadKey]);
  const retry = useCallback(() => { setState("loading"); setError(""); setLoadMoreError(""); setReloadKey((key) => key + 1); }, []);
  const loadMore = useCallback(async () => {
    if (!pagination?.hasMore || !pagination.nextCursor || loadingMore) return;
    setLoadingMore(true); setLoadMoreError("");
    try {
      const response = await getForumThreads(forumId, pagination.nextCursor);
      setThreads((current) => { const ids = new Set(current.map((thread) => thread.id)); return [...current, ...response.data.filter((thread) => !ids.has(thread.id))]; });
      setPagination(response.pagination);
    } catch (reason) { setLoadMoreError(reason instanceof Error ? reason.message : "Unable to load more threads right now."); } finally { setLoadingMore(false); }
  }, [forumId, loadingMore, pagination]);
  return { threads, pagination, state, error, retry, loadingMore, loadMoreError, loadMore };
}

function PageShell({ children }: { children: ReactNode }) { return <main className="min-h-screen px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8">{children}</main>; }
function StatusPanel({ title, message, action }: { title: string; message: string; action?: ReactNode }) { return <section className="mx-auto flex min-h-[38vh] max-w-xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] px-6 text-center"><h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1><p className="mt-3 max-w-md leading-relaxed text-white/65">{message}</p>{action && <div className="mt-7">{action}</div>}</section>; }
function ForumCount({ value, label }: { value: number; label: string }) { return <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/70">{value.toLocaleString()} {label}</span>; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date); }
function compact(value: number) { return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(value); }
function RetryButton({ onClick }: { onClick: () => void }) { return <button type="button" onClick={onClick} className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0c0c14] transition hover:bg-white/90">Try again</button>; }

function ThreadCard({ thread }: { thread: ForumThread }) {
  const author = thread.author.displayName || thread.author.username;
  return <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"><div className="flex gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-sm font-extrabold text-white/75">{thread.author.avatarUrl ? <img src={thread.author.avatarUrl} alt="" className="h-full w-full object-cover" /> : author.slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-extrabold leading-snug">{thread.title}</h2>{thread.isPinned && <span className="rounded-full bg-race-accent/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-race-accent">Pinned</span>}{thread.isLocked && <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-200">Locked</span>}</div><p className="mt-2 text-sm text-white/55">Started by <span className="font-semibold text-white/80">{author}</span> · {formatDate(thread.createdAt)}</p><div className="mt-4 flex flex-wrap gap-2">{thread.tags.map((tag) => <span key={tag.id} className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs font-semibold text-white/65">{tag.name}</span>)}</div><div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-sm text-white/60"><span><strong className="text-white">{compact(thread.score)}</strong> score</span><span><strong className="text-white">{compact(thread.commentCount)}</strong> comments</span><span><strong className="text-white">{compact(thread.viewCount)}</strong> views</span><span className="sm:ml-auto">Last activity <strong className="font-semibold text-white/80">{formatDate(thread.lastActivityAt)}</strong></span></div></div></div></article>;
}

export function ForumList({ onOpenForum }: { onOpenForum: (forumId: string) => void }) {
  const { forums, state, error, retry } = useForums();
  if (state === "loading") return <PageShell><StatusPanel title="Loading forums" message="Fetching the latest conversations from the paddock…" /></PageShell>;
  if (state === "error") return <PageShell><StatusPanel title="Forums are unavailable" message={error} action={<RetryButton onClick={retry} />} /></PageShell>;
  if (state === "empty") return <PageShell><StatusPanel title="No forums yet" message="There are no community spaces available right now. Check back soon." /></PageShell>;
  const sorted = [...forums].sort((left, right) => new Date(right.lastActivityAt).getTime() - new Date(left.lastActivityAt).getTime());
  return <PageShell><section className="mx-auto max-w-5xl"><p className="text-xs font-bold uppercase tracking-[0.25em] text-race-accent">Community</p><div className="mt-3 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Forums</h1><p className="mt-3 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">Join the conversation across the F1 Hub community.</p></div><p className="text-sm font-semibold text-white/45">{forums.length} {forums.length === 1 ? "forum" : "forums"}</p></div><div className="mt-9 grid gap-4">{sorted.map((forum) => <button key={forum.id} type="button" onClick={() => onOpenForum(forum.id)} className="group w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-race-accent/60 hover:bg-white/[0.06] sm:p-6"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><h2 className="text-xl font-extrabold transition-colors group-hover:text-race-accent">{forum.name}</h2><p className="mt-2 max-w-2xl leading-relaxed text-white/65">{forum.description}</p><div className="mt-4 flex flex-wrap gap-2"><ForumCount value={forum.threadCount} label="threads" /><ForumCount value={forum.postCount} label="posts" /></div></div><div className="shrink-0 border-l-0 border-white/10 pt-1 text-left sm:border-l sm:pl-6 sm:text-right"><p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Last activity</p><p className="mt-1.5 text-sm font-semibold text-white/75">{formatDate(forum.lastActivityAt)}</p><span className="mt-4 inline-flex text-sm font-bold text-race-accent">View forum <span aria-hidden="true" className="ml-1">→</span></span></div></div></button>)}</div></section></PageShell>;
}

export function ForumPlaceholder({ forumId, onBack }: { forumId: string; onBack: () => void }) {
  const forumRequest = useForums();
  const threadRequest = useForumThreads(forumId);
  if (forumRequest.state === "loading") return <PageShell><StatusPanel title="Loading forum" message="Finding this community space…" /></PageShell>;
  if (forumRequest.state === "error") return <PageShell><StatusPanel title="Forum is unavailable" message={forumRequest.error} action={<RetryButton onClick={forumRequest.retry} />} /></PageShell>;
  const forum = forumRequest.forums.find((item) => item.id === forumId);
  if (!forum) return <PageShell><StatusPanel title="This forum does not exist" message="The forum may have been removed, or the address may be incorrect." action={<button type="button" onClick={onBack} className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0c0c14]">Return to forums</button>} /></PageShell>;
  const sorted = [...threadRequest.threads].sort((left, right) => Number(right.isPinned) - Number(left.isPinned) || new Date(right.lastActivityAt).getTime() - new Date(left.lastActivityAt).getTime());
  const content = threadRequest.state === "loading" ? <StatusPanel title="Loading threads" message="Bringing the latest discussion onto the grid…" /> : threadRequest.state === "error" ? <StatusPanel title="Threads are unavailable" message={threadRequest.error} action={<RetryButton onClick={threadRequest.retry} />} /> : threadRequest.state === "empty" ? <StatusPanel title="No threads yet" message="This forum has no conversations yet. Check back soon." /> : <div className="grid gap-4">{sorted.map((thread) => <ThreadCard key={thread.id} thread={thread} />)}</div>;
  return <PageShell><section className="mx-auto max-w-5xl"><button type="button" onClick={onBack} className="text-sm font-bold text-race-accent transition hover:text-red-300">← All forums</button><p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-race-accent">Forum</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{forum.name}</h1><p className="mt-3 max-w-3xl text-lg leading-relaxed text-white/65">{forum.description}</p><div className="mt-10">{content}</div>{threadRequest.state === "ready" && threadRequest.pagination?.hasMore && <div className="mt-8 text-center">{threadRequest.loadMoreError && <p role="alert" className="mb-3 text-sm text-red-200">{threadRequest.loadMoreError}</p>}<button type="button" onClick={threadRequest.loadMore} disabled={threadRequest.loadingMore} className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-wait disabled:opacity-60">{threadRequest.loadingMore ? "Loading threads…" : "Load more threads"}</button></div>}</section></PageShell>;
}
