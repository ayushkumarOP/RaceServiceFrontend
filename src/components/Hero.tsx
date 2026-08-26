import { CheckerFlag } from "./Navbar";

/* ------------------------------------------------------------------ */
/* Hero inner artwork — a Discord-style "lifted sheet" leaderboard     */
/* ------------------------------------------------------------------ */

const DRIVERS = [
  { pos: 1, name: "M. Verstappen", team: "Red Bull", pts: 277, accent: "#d2232a" },
  { pos: 2, name: "L. Norris", team: "McLaren", pts: 261, accent: "#ff8000" },
  { pos: 3, name: "C. Leclerc", team: "Ferrari", pts: 245, accent: "#dc0000" },
  { pos: 4, name: "O. Piastri", team: "McLaren", pts: 217, accent: "#ff8000" },
  { pos: 5, name: "C. Sainz", team: "Ferrari", pts: 196, accent: "#dc0000" },
  { pos: 6, name: "L. Hamilton", team: "Ferrari", pts: 152, accent: "#dc0000" },
];

function LeaderboardCard() {
  return (
    <div className="bg-[#15151f] rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden pointer-events-none select-none">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <span className="text-sm font-bold text-white">2025 Drivers' Championship</span>
        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          LIVE
        </span>
      </div>
      <ul className="divide-y divide-white/5">
        {DRIVERS.map((d) => (
          <li key={d.pos} className="flex items-center gap-3 px-5 py-2.5">
            <span
              className={`w-6 text-center text-sm font-mono font-bold ${
                d.pos <= 3 ? "text-amber-300" : "text-white/40"
              }`}
            >
              {d.pos}
            </span>
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: d.accent }}
            />
            <span className="text-sm font-semibold text-white">{d.name}</span>
            <span className="ml-auto text-xs font-medium text-white/50">{d.pts} pts</span>
          </li>
        ))}
      </ul>
      <div className="px-5 py-3 border-t border-white/10 text-xs text-white/50">
        Updated a moment ago
      </div>
    </div>
  );
}

function FloatingChip({
  className,
  delay,
  children,
}: {
  className?: string;
  delay: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute animate-float ${className ?? ""}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

function SpeedChip() {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-[#1a1a26]/90 backdrop-blur px-3 py-2 border border-white/10 shadow-xl">
      <span className="relative flex">
        <span className="w-2 h-2 rounded-full bg-race-accent shadow-[0_0_10px_2px] shadow-race-accent/70" />
      </span>
      <div>
        <div className="text-lg leading-none font-mono font-bold text-white">347.4</div>
        <div className="text-[10px] text-white/50 font-medium">km/h — top speed</div>
      </div>
    </div>
  );
}

function CalendarChip() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-[#1a1a26]/90 backdrop-blur px-3 py-2 border border-white/10 shadow-xl">
      <div className="w-9 h-9 rounded-lg bg-race-accent/20 flex flex-col items-center justify-center leading-none">
        <span className="text-xs font-bold text-race-accent">R12</span>
      </div>
      <div>
        <div className="text-xs font-semibold text-white">Silverstone</div>
        <div className="text-[10px] text-white/50">in 03:42:19</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Animated gradient blobs (Discord-style ambient backglow) */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[42rem] h-[42rem] rounded-full bg-race-accent/25 blur-[120px] animate-blob" />
        <div className="absolute top-1/3 -right-40 w-[36rem] h-[36rem] rounded-full bg-indigo-600/25 blur-[120px] animate-blob" style={{ animationDelay: "-6s" }} />
        <div className="absolute bottom-0 left-1/3 w-[30rem] h-[30rem] rounded-full bg-amber-500/15 blur-[110px] animate-blob" style={{ animationDelay: "-3s" }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70 mb-6">
          <CheckerFlag className="w-4 h-4 text-race-accent" />
          Your live home for Formula 1
        </p>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
          WHERE{" "}
          <span className="bg-gradient-to-r from-race-accent via-orange-400 to-amber-400 bg-clip-text text-transparent">
            VELOCITY
          </span>{" "}
          LIVES.
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white/70 leading-relaxed">
          Imagine a place where standings update in real time, the calendar never
          misses a session, and every corner fires telemetry into your hands.
          The fastest F1 information hub on the grid — free, and built for fans.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-white text-[#0c0c14] px-7 py-3.5 text-base font-semibold transition-all hover:bg-white/90 hover:shadow-xl hover:shadow-white/10 active:scale-95"
          >
            <CheckerFlag className="w-5 h-5 text-race-accent" />
            Get Started — it's free
          </a>
          <a
            href="#"
            className="inline-flex items-center rounded-full border border-white/25 text-white px-7 py-3.5 text-base font-semibold transition-all hover:bg-white/10 hover:border-white/40 active:scale-95"
          >
            Open F1 Hub in your Browser
          </a>
        </div>
        <p className="mt-3 text-xs text-white/40">
          No credit card required · Rock-solid uptime · Across web &amp; mobile
        </p>

        {/* Lifted artwork */}
        <div className="relative mt-16 mx-auto max-w-3xl">
          {/* Fold shadow */}
          <div aria-hidden className="absolute -inset-x-4 top-2 bottom-0 bg-black/40 blur-xl translate-y-3" />
          <FloatingChip className="hidden sm:block -left-8 top-6 md:-left-16 animate-delay-1" delay="0.2s">
            <SpeedChip />
          </FloatingChip>
          <FloatingChip className="hidden sm:block -right-6 bottom-16 md:-right-16 animate-delay-2" delay="0.9s">
            <CalendarChip />
          </FloatingChip>
          <div className="relative">
            <div className="rounded-2xl origin-bottom rotate-[0.6deg] scale-[1.015] bg-[#0e0e18] border border-white/5 absolute inset-0" />
            <div className="rounded-2xl origin-bottom -rotate-[0.5deg] scale-[1.01] bg-[#10101a] border border-white/5 absolute inset-0" />
            <LeaderboardCard />
          </div>
        </div>
      </div>
    </section>
  );
}