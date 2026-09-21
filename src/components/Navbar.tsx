import { useEffect, useRef, useState } from "react";
import type { AuthSession } from "../services/auth";

const NAV_LINKS = [
  { label: "Live Standings", href: "#standings" },
  { label: "Schedule", href: "#schedule" },
  { label: "Telemetry", href: "#telemetry" },
  { label: "News", href: "#news" },
  { label: "Community", href: "/forums" },
  { label: "Support", href: "#support" },
];

export function CheckerFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M4 3h13a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8l-4 4V3z"
        className="fill-current"
      />
      <g fill="var(--race-dark, #0c0c14)">
        <rect x="6" y="4" width="3" height="3" />
        <rect x="12" y="4" width="3" height="3" />
        <rect x="9" y="8" width="3" height="3" />
        <rect x="15" y="8" width="3" height="3" />
        <rect x="6" y="12" width="3" height="3" />
        <rect x="12" y="12" width="3" height="3" />
      </g>
    </svg>
  );
}

function Logo({ onHome }: { onHome: () => void }) {
  return (
    <a href="/home" onClick={(event) => { event.preventDefault(); onHome(); }} className="flex items-center gap-2 group" aria-label="F1 Hub home">
      <CheckerFlag className="w-7 h-7 text-race-accent group-hover:text-red-500 transition-colors" />
      <span className="font-extrabold tracking-tight text-xl text-white">
        F1{" "}
        <span className="bg-gradient-to-r from-race-accent to-amber-400 bg-clip-text text-transparent">
          HUB
        </span>
      </span>
    </a>
  );
}

type NavbarProps = {
  session: AuthSession | null;
  onSignIn: () => void;
  onProfile: () => void;
  onSignOut: () => void;
  onNavigate: (destination: string) => void;
};

export default function Navbar({ session, onSignIn, onProfile, onSignOut, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0c0c14]/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/30"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-10">
          <Logo onHome={() => onNavigate("/home")} />
          <ul className="hidden lg:flex items-center gap-7 text-sm font-medium text-white/75">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(event) => { if (link.href.startsWith("/")) { event.preventDefault(); onNavigate(link.href); } }}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="relative hidden sm:block" ref={profileRef}>
              <button type="button" onClick={() => setProfileOpen((value) => !value)} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-3 text-sm font-semibold transition hover:bg-white/10" aria-expanded={profileOpen} aria-haspopup="menu">
                {session.user.avatarUrl ? <img src={session.user.avatarUrl} alt="" className="h-7 w-7 rounded-full bg-white/10" /> : <span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs">{session.user.displayName.slice(0, 1).toUpperCase()}</span>}
                <span className="max-w-28 truncate">{session.user.displayName}</span>
              </button>
              {profileOpen && <div role="menu" className="absolute right-0 mt-3 w-64 rounded-2xl border border-white/10 bg-[#1a1a26] p-2 shadow-2xl shadow-black/50">
                <div className="border-b border-white/10 px-3 py-3"><p className="truncate font-semibold">{session.user.displayName}</p><p className="mt-1 truncate text-xs text-white/55">{session.user.email}</p></div>
                <button type="button" onClick={onProfile} className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition hover:bg-white/5" role="menuitem">Profile</button>
                <button type="button" onClick={onSignOut} className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-300 transition hover:bg-white/5" role="menuitem">Sign out</button>
              </div>}
            </div>
          ) : (
            <button type="button" onClick={onSignIn} className="hidden sm:inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0c0c14] transition hover:bg-white/90">Sign in</button>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-md text-white/80 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-current" />
              <span className="block w-6 h-0.5 bg-current" />
              <span className="block w-6 h-0.5 bg-current" />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#0c0c14]/95 backdrop-blur-md border-b border-white/10">
          <ul className="px-4 py-4 space-y-3 text-white/80 font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={(event) => { setMenuOpen(false); if (link.href.startsWith("/")) { event.preventDefault(); onNavigate(link.href); } }} className="block py-1 hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              {session ? <button type="button" onClick={onSignOut} className="mt-3 block w-full rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-[#0c0c14]">Sign out</button> : <button type="button" onClick={onSignIn} className="mt-3 block w-full rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-[#0c0c14]">Sign in</button>}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
