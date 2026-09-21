import { CheckerFlag } from "./Navbar";
import { followInternalLink } from "../navigation";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  { title: "Explore", links: [{ label: "Live Standings", href: "#standings" }, { label: "Race Calendar", href: "#schedule" }, { label: "Telemetry", href: "#telemetry" }, { label: "News Feed", href: "#news" }] },
  { title: "Community", links: [{ label: "Featured Leagues", href: "#community" }, { label: "Join a league", href: "#community" }] },
  { title: "Support", links: [{ label: "Report an issue", href: "#support" }, { label: "Contact us", href: "#support" }] },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08080d] px-4 sm:px-6 lg:px-8 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Brand */}
          <div>
            <a href="/home" onClick={(event) => followInternalLink(event, "/home")} className="flex items-center gap-2 group">
              <CheckerFlag className="w-7 h-7 text-race-accent" />
              <span className="font-extrabold text-xl text-white">
                F1{" "}
                <span className="bg-gradient-to-r from-race-accent to-amber-400 bg-clip-text text-transparent">
                  HUB
                </span>
              </span>
            </a>
            <p className="mt-4 text-sm text-white/55 max-w-xs leading-relaxed">
              The fastest home for Formula 1 information — live standings,
              schedules, telemetry and a community that lives for the sport.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/55 hover:text-white hover:underline underline-offset-4 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} F1 Hub. For information &amp; fan community use only.
            F1 is a trademark of its respective owners.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/60">
            <span className="flex items-center gap-2 border border-white/10 px-3.5 py-1.5">
              <span aria-hidden>🇺🇸</span> English (US)
            </span>
            <span className="flex items-center gap-2 border border-white/10 px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              All systems normal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
