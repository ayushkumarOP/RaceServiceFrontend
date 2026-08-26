import { CheckerFlag } from "./Navbar";

const COLUMNS: { title: string; links: string[] }[] = [
  { title: "Product", links: ["Live Standings", "Race Calendar", "Telemetry", "News Feed", "Download App"] },
  { title: "Resources", links: ["Help Center", "Race Guides", "Feature Blog", "Developer API", "Brand Kit"] },
  { title: "Support", links: ["Report an Issue", "Contact Us", "Community Guidelines", "Accessibility", "Status"] },
  { title: "Company", links: ["About", "Careers", "Media", "Partners", "Privacy", "Terms"] },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08080d] px-4 sm:px-6 lg:px-8 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand */}
          <div>
            <a href="#" className="flex items-center gap-2 group">
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
            <div className="mt-4 flex gap-3">
              {["X", "YT", "IG", "DC"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/55 hover:text-white hover:underline underline-offset-4 transition-colors"
                    >
                      {link}
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
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 hover:bg-white/5 transition-colors"
            >
              <span aria-hidden>🇺🇸</span> English (US)
              <span aria-hidden className="text-white/40">▾</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 hover:bg-white/5 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              All systems normal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}