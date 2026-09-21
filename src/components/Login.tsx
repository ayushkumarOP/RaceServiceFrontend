import { useState, type FormEvent } from "react";
import { CheckerFlag } from "./Navbar";
import { register, signIn, type AuthSession } from "../services/auth";

type LoginProps = { onAuthenticated: (session: AuthSession) => void; onSkip: () => void };
type Mode = "login" | "register";

export default function Login({ onAuthenticated, onSkip }: LoginProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegistering = mode === "register";

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError("");
    setNotice("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (isRegistering) {
      if (!email.trim() || !username.trim() || !password || !confirmPassword) return setError("Complete every field to create your account.");
      if (password !== confirmPassword) return setError("Your passwords do not match.");
    } else if (!emailOrUsername.trim() || !password) {
      return setError("Enter your email or username and password to continue.");
    }

    setIsSubmitting(true);
    try {
      if (isRegistering) {
        await register(email.trim(), username.trim(), password, confirmPassword);
        setEmailOrUsername(email.trim());
        setPassword("");
        setConfirmPassword("");
        setMode("login");
        setNotice("Account created. Sign in to continue.");
      } else {
        onAuthenticated(await signIn(emailOrUsername.trim(), password));
      }
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
        <a href="/" className="inline-flex items-center gap-2" aria-label="F1 Hub login"><CheckerFlag className="h-8 w-8 text-race-accent" /><span className="text-2xl font-extrabold tracking-tight">F1 <span className="text-race-accent">HUB</span></span></a>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-race-accent">{isRegistering ? "Join the grid" : "Welcome back"}</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{isRegistering ? "Create your account" : "Ready for lights out?"}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{isRegistering ? "Choose your racer name and get involved." : "Sign in to pick up your Formula 1 experience."}</p>

        <div className="mt-7 grid grid-cols-2 rounded-xl border border-white/10 bg-black/20 p-1">
          <button type="button" onClick={() => switchMode("login")} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${!isRegistering ? "bg-white text-[#0c0c14]" : "text-white/60 hover:text-white"}`}>Sign in</button>
          <button type="button" onClick={() => switchMode("register")} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${isRegistering ? "bg-white text-[#0c0c14]" : "text-white/60 hover:text-white"}`}>Create account</button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
          {isRegistering ? <>
            <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" disabled={isSubmitting} />
            <Field label="Username" value={username} onChange={setUsername} autoComplete="username" placeholder="e.g. emilys" disabled={isSubmitting} />
          </> : <Field label="Email or username" value={emailOrUsername} onChange={setEmailOrUsername} autoComplete="username" placeholder="e.g. emilys" disabled={isSubmitting} />}
          <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete={isRegistering ? "new-password" : "current-password"} placeholder="Enter your password" disabled={isSubmitting} />
          {isRegistering && <Field label="Confirm password" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" placeholder="Repeat your password" disabled={isSubmitting} />}
          {error && <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200" role="alert">{error}</p>}
          {notice && <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100" role="status">{notice}</p>}
          <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 font-bold text-[#0c0c14] transition hover:bg-white/90 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? (isRegistering ? "Creating account…" : "Signing in…") : (isRegistering ? "Create account" : "Sign in to F1 Hub")}</button>
        </form>
        <button type="button" onClick={onSkip} className="mt-7 w-full text-sm font-semibold text-white/65 transition hover:text-white">Skip for now <span aria-hidden="true">→</span></button>
      </section>
    </main>
  );
}

function Field({ label, onChange, ...props }: { label: string; value: string; onChange: (value: string) => void; type?: string; autoComplete: string; placeholder: string; disabled: boolean }) {
  return <label className="block text-sm font-semibold text-white/85">{label}<input {...props} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-race-accent" /></label>;
}
