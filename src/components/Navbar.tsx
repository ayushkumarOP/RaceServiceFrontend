import { useEffect, useState } from "react";

const NAV_LINKS = [
  "Live Standings",
  "Schedule",
  "Telemetry",
  "News",
  "Community",
  "Support",
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

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 group" aria-label="F1 Hub home">
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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          <Logo />
          <ul className="hidden lg:flex items-center gap-7 text-sm font-medium text-white/75">
            {NAV_LINKS.map((label) => (
              <li key={label}>
                <a
                  href="#"
                  className="transition-colors hover:text-white"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white text-[#0c0c14] px-4 py-2 text-sm font-semibold transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 active:scale-95"
          >
            <CheckerFlag className="w-4 h-4 text-race-accent" />
            Open F1 Hub
          </a>
          <a
            href="#"
            className="hidden md:inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
          >
            Get Started
          </a>
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
            {NAV_LINKS.map((label) => (
              <li key={label}>
                <a href="#" className="block py-1 hover:text-white">
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#"
                className="block mt-3 rounded-full bg-white text-[#0c0c14] px-4 py-2 text-sm font-semibold text-center"
              >
                Open F1 Hub
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}