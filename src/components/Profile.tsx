import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { getMyProfile, updateMyProfile, type UserProfile } from "../services/auth";

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { getMyProfile().then((nextProfile) => { setProfile(nextProfile); setDisplayName(nextProfile.displayName); setAvatarUrl(nextProfile.avatarUrl); setBio(nextProfile.bio); setState("ready"); }).catch((reason: unknown) => { setError(reason instanceof Error ? reason.message : "Unable to load your profile."); setState("error"); }); }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    if (!displayName.trim()) { setError("Display name is required."); return; }
    setSaving(true);
    try { const nextProfile = await updateMyProfile({ displayName: displayName.trim(), avatarUrl: avatarUrl.trim(), bio: bio.trim() }); setProfile(nextProfile); setDisplayName(nextProfile.displayName); setAvatarUrl(nextProfile.avatarUrl); setBio(nextProfile.bio); setNotice("Profile saved."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to save your profile."); }
    finally { setSaving(false); }
  }

  if (state === "loading") return <Page><p className="text-white/60">Loading your profile…</p></Page>;
  if (state === "error") return <Page><p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</p></Page>;
  return <Page><div className="mx-auto max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.25em] text-race-accent">Account</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight">Your profile</h1><p className="mt-3 text-white/60">Manage the details visible to the F1 Hub community.</p><form className="mt-9 space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7" onSubmit={save}><div className="flex items-center gap-4">{avatarUrl ? <img src={avatarUrl} alt="" className="h-14 w-14 rounded-full object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-xl font-bold">{profile?.displayName.slice(0, 1).toUpperCase()}</span>}<div><p className="font-bold">{profile?.username}</p><p className="text-sm text-white/55">{profile?.email}</p></div></div><Field label="Display name" value={displayName} onChange={setDisplayName} /><Field label="Avatar URL" value={avatarUrl} onChange={setAvatarUrl} type="url" placeholder="https://…" /><label className="block text-sm font-semibold text-white/85">Bio<textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none focus:border-race-accent" placeholder="Tell the community about yourself" /></label>{profile?.status && <p className="text-sm text-white/55">Account status: <span className="font-semibold text-white/80">{profile.status}</span></p>}{error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}{notice && <p role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">{notice}</p>}<button type="submit" disabled={saving} className="rounded-xl bg-white px-5 py-3 font-bold text-[#0c0c14] transition hover:bg-white/90 disabled:opacity-60">{saving ? "Saving…" : "Save profile"}</button></form></div></Page>;
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) { return <label className="block text-sm font-semibold text-white/85">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-race-accent" /></label>; }
function Page({ children }: { children: ReactNode }) { return <main className="min-h-screen bg-[#0c0c14] px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8">{children}</main>; }
