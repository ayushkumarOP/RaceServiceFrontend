import { useCallback, useEffect, useState, type ReactNode } from "react";
import { getForums, type Forum } from "../services/forums";

type ForumLoadState = "loading" | "ready" | "empty" | "error";

function useForums() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [state, setState] = useState<ForumLoadState>("loading");
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getForums(controller.signal).then((nextForums) => {
      if (controller.signal.aborted) return;
      setForums(nextForums);
      setState(nextForums.length ? "ready" : "empty");
    }).catch((reason: unknown) => {
      if (controller.signal.aborted) return;
      setError(reason instanceof Error ? reason.message : "Unable to load forums right now.");
      setState("error");
    });
    return () => controller.abort();
  }, [reloadKey]);

  const retry = useCallback(() => {
    setState("loading");
    setError("");
    setReloadKey((key) => key + 1);
  }, []);

  return { forums, state, error, retry };
}

function PageShell({ children }: { children: ReactNode }) {
  return <main className="min-h-screen px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8">{children}</main>;
}

function StatusPanel({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return <section className="mx-auto flex min-h-[45vh] max-w-xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] px-6 text-center"><h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1><p className="mt-3 max-w-md leading-relaxed text-white/65">{message}</p>{action && <div className="mt-7">{action}</div>}</section>;
}

function ForumCount({ value, label }: { value: number; label: string }) {
  return <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/70">{value.toLocaleString()} {label}</span>;
}

function formatLastActivity(lastActivityAt: string) {
  const date = new Date(lastActivityAt);
  if (Number.isNaN(date.getTime())) return "Activity date unavailable";
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

export function ForumList({ onOpenForum }: { onOpenForum: (forumId: string) => void }) {
  const { forums, state, error, retry } = useForums();
  if (state === "loading") return <PageShell><StatusPanel title="Loading forums" message="Fetching the latest conversations from the paddock…" /></PageShell>;
  if (state === "error") return <PageShell><StatusPanel title="Forums are unavailable" message={error} action={<button type="button" onClick={retry} className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0c0c14] transition hover:bg-white/90">Try again</button>} /></PageShell>;
  if (state === "empty") return <PageShell><StatusPanel title="No forums yet" message="There are no community spaces available right now. Check back soon." /></PageShell>;

  const sortedForums = [...forums].sort((left, right) => new Date(right.lastActivityAt).getTime() - new Date(left.lastActivityAt).getTime());
  return <PageShell><section className="mx-auto max-w-5xl"><p className="text-xs font-bold uppercase tracking-[0.25em] text-race-accent">Community</p><div className="mt-3 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Forums</h1><p className="mt-3 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">Join the conversation across the F1 Hub community.</p></div><p className="text-sm font-semibold text-white/45">{forums.length} {forums.length === 1 ? "forum" : "forums"}</p></div><div className="mt-9 grid gap-4">{sortedForums.map((forum) => <button key={forum.id} type="button" onClick={() => onOpenForum(forum.id)} className="group w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-race-accent/60 hover:bg-white/[0.06] focus:outline-none sm:p-6"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><h2 className="text-xl font-extrabold transition-colors group-hover:text-race-accent">{forum.name}</h2><p className="mt-2 max-w-2xl leading-relaxed text-white/65">{forum.description}</p><div className="mt-4 flex flex-wrap gap-2"><ForumCount value={forum.threadCount} label="threads" /><ForumCount value={forum.postCount} label="posts" /></div></div><div className="shrink-0 border-l-0 border-white/10 pt-1 text-left sm:border-l sm:pl-6 sm:text-right"><p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Last activity</p><p className="mt-1.5 text-sm font-semibold text-white/75">{formatLastActivity(forum.lastActivityAt)}</p><span className="mt-4 inline-flex text-sm font-bold text-race-accent">View forum <span aria-hidden="true" className="ml-1 transition-transform group-hover:translate-x-1">→</span></span></div></div></button>)}</div></section></PageShell>;
}

export function ForumPlaceholder({ forumId, onBack }: { forumId: string; onBack: () => void }) {
  const { forums, state, error, retry } = useForums();
  if (state === "loading") return <PageShell><StatusPanel title="Loading forum" message="Finding this community space…" /></PageShell>;
  if (state === "error") return <PageShell><StatusPanel title="Forum is unavailable" message={error} action={<button type="button" onClick={retry} className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0c0c14] transition hover:bg-white/90">Try again</button>} /></PageShell>;
  const forum = forums.find((item) => item.id === forumId);
  if (!forum) return <PageShell><StatusPanel title="This forum does not exist" message="The forum may have been removed, or the address may be incorrect." action={<button type="button" onClick={onBack} className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0c0c14] transition hover:bg-white/90">Return to forums</button>} /></PageShell>;
  return <PageShell><section className="mx-auto flex min-h-[55vh] max-w-2xl flex-col justify-center"><p className="text-xs font-bold uppercase tracking-[0.25em] text-race-accent">Forum</p><h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">{forum.name}</h1><p className="mt-4 text-lg leading-relaxed text-white/65">{forum.description}</p><div className="mt-8 rounded-3xl border border-race-accent/25 bg-race-accent/10 p-6 sm:p-8"><p className="text-sm font-bold uppercase tracking-[0.16em] text-race-accent">Coming soon</p><h2 className="mt-3 text-2xl font-extrabold">Threads are entering the garage.</h2><p className="mt-3 leading-relaxed text-white/70">This forum is ready. Its thread list and conversations will arrive in a future update.</p><button type="button" onClick={onBack} className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0c0c14] transition hover:bg-white/90">Return to all forums</button></div></section></PageShell>;
}
