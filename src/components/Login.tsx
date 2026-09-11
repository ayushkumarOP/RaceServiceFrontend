import { useState, type FormEvent } from "react";
import { CheckerFlag } from "./Navbar";
import { signIn, type AuthSession } from "../services/auth";

type LoginProps = {
  onAuthenticated: (session: AuthSession) => void;
  onSkip: () => void;
};

function GoogleIcon() {
  return <span className="text-base font-bold text-[#4285f4]" aria-hidden="true">G</span>;
}

function AppleIcon() {
  return <span className="text-lg leading-none" aria-hidden="true">●</span>;
}

export default function Login({ onAuthenticated, onSkip }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Enter your email or username and password to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await signIn(username.trim(), password);
      onAuthenticated(session);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0c0c14] px-4 py-10 text-white sm:flex sm:items-center sm:justify-center">
      <div aria-hidden className="absolute inset-0 bg-[url('/images/background_image.jpg')] bg-cover bg-center opacity-20" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#0c0c14]/75 via-[#0c0c14]/90 to-[#0c0c14]" />
      <section className="relative mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-[#16161f]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur sm:p-8">
        <a href="/" className="inline-flex items-center gap-2" aria-label="F1 Hub login">
          <CheckerFlag className="h-8 w-8 text-race-accent" />
          <span className="text-2xl font-extrabold tracking-tight">F1 <span className="text-race-accent">HUB</span></span>
        </a>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-race-accent">Welcome back</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Ready for lights out?</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">Sign in to pick up your Formula 1 experience.</p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit} noValidate>
          <label className="block text-sm font-semibold text-white/85">
            Email or username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-race-accent"
              placeholder="e.g. emilys"
              disabled={isSubmitting}
            />
          </label>
          <label className="block text-sm font-semibold text-white/85">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-race-accent"
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
          </label>
          {error && <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-bold text-[#0c0c14] transition hover:bg-white/90 disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? "Signing in…" : "Sign in to F1 Hub"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-white/35"><span className="h-px flex-1 bg-white/10" />or continue with<span className="h-px flex-1 bg-white/10" /></div>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" disabled className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-white/45" title="Coming soon"><GoogleIcon />Google</button>
          <button type="button" disabled className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-white/45" title="Coming soon"><AppleIcon />Apple</button>
        </div>
        <p className="mt-2 text-center text-xs text-white/35">Social sign-in is coming soon.</p>

        <button type="button" onClick={onSkip} className="mt-7 w-full text-sm font-semibold text-white/65 transition hover:text-white">Skip for now <span aria-hidden="true">→</span></button>
        <p className="mt-4 text-center text-xs text-white/35">Demo account: <span className="font-semibold text-white/55">emilys / emilyspass</span></p>
      </section>
    </main>
  );
}
