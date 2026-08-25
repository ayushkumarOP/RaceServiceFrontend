import type { ReactNode } from "react";

/* ================================================================== */
/* Row visuals for each F1 feature (pure CSS/inline SVG building       */
/* blocks — no external image dependencies).                           */
/* ================================================================== */

/* --- Section A: Live Race Rankings & Standings -------------------- */
function StandingsVisual() {
  const rows = [
    { name: "Red Bull Racing", laps: 1, w: 78, a: "#d2232a" },
    { name: "McLaren", laps: 2, w: 74, a: "#ff8000" },
    { name: "Ferrari", laps: 3, w: 71, a: "#dc0000" },
    { name: "Mercedes", laps: 4, w: 64, a: "#00d2be" },
    { name: "Aston Martin", laps: 5, w: 47, a: "#229971" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">Constructors</h3>
        <span className="text-xs font-semibold text-race-accent">
          Round 12 · updated live
        </span>
      </div>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.name}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-white/90">{r.name}</span>
              <span className="font-mono text-white/60">{r.laps}th</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full origin-left--anim transition-all animate-grow-x"
                style={{
                  width: `${r.w}%`,
                  background: `linear-gradient(90deg, ${r.a}, ${r.a}cc)`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] text-white/45">
        Championship points update the moment the race ends — no refresh needed.
      </p>
    </div>
  );
}

/* --- Section B: Race Calendar & Schedules -------------------------- */
function CalendarVisual() {
  const races = [
    { gp: "Austrian GP", loc: "Red Bull Ring", flag: "🇦🇹", d: "R12" },
    { gp: "British GP", loc: "Silverstone", flag: "🇬🇧", d: "R13" },
    { gp: "Belgian GP", loc: "Spa-Francorchamps", flag: "🇧🇪", d: "R14" },
  ];
  return (
    <div className="flex flex-col gap-3">
      {races.map((r, i) => (
        <div
          key={r.gp}
          className={`flex items-center gap-4 rounded-xl bg-white/[0.03] border p-3.5 ${
            i === 1 ? "border-race-accent/50 ring-1 ring-race-accent/30" : "border-white/10"
          }`}
        >
          <span className="text-2xl" aria-hidden>
            {r.flag}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white truncate">{r.gp}</p>
              {i === 1 && (
                <span className="rounded-full bg-race-accent/20 text-race-accent text-[10px] font-bold px-2 py-0.5">
                  NEXT
                </span>
              )}
            </div>
            <p className="text-xs text-white/50 truncate">{r.loc}</p>
          </div>
          <div className="ml-auto text-right shrink-0">
            <p className="text-xs font-mono font-bold text-white">{r.d}</p>
            <p className="text-[10px] text-white/40">{i === 1 ? "in 2 days" : i === 0 ? "done" : "upcoming"}</p>
          </div>
        </div>
      ))}
      <p className="text-[11px] text-white/45">
        Practice, qualifying &amp; the race — every session on one calendar.
      </p>
    </div>
  );
}

/* --- Section C: Live Telemetry / Speed & Data ---------------------- */
function TelemetryVisual() {
  const bars = [42, 60, 38, 82, 55, 70, 48, 90, 63, 78, 52, 85];
  return (
    <div>
      <div className="flex items-end justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-white">Lap 42 · Sector Telemetry</h3>
          <p className="text-xs text-white/50">Straight: start to Turn 1</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/50">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-race-accent" /> speed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-indigo-400" /> throttle
          </span>
        </div>
      </div>
      <div className="flex items-end gap-1.5 h-28">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t origin-bottom--anim transition-all animate-grow-y ${
              i % 2 === 0 ? "bg-race-accent/80" : "bg-indigo-400/70"
            }`}
            style={{ height: `${h}%`, animationDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-race-accent to-amber-400" />
      </div>
      <p className="mt-3 text-[11px] text-white/45">
        Live speed traps, lap deltas and sector times as they happen.
      </p>
    </div>
  );
}

/* --- Section D: Team & Driver News/Feed ---------------------------- */
function NewsVisual() {
  const posts = [
    { tag: "TRANSFER", title: "Verstappen extends with Red Bull", time: "2h", c: "#d2232a" },
    { tag: "RACE", title: "Norris snatches pole at Silverstone", time: "4h", c: "#ff8000" },
    { tag: "TEAM", title: "Ferrari unveils upgrade package", time: "6h", c: "#dc0000" },
  ];
  return (
    <ul className="space-y-3">
      {posts.map((p) => (
        <li
          key={p.title}
          className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/10 p-3"
        >
          <span
            className="w-1.5 h-8 rounded-full shrink-0"
            style={{ backgroundColor: p.c }}
          />
          <div className="min-w-0">
            <span className="text-[10px] font-bold tracking-wide" style={{ color: p.c }}>
              {p.tag}
            </span>
            <p className="text-sm font-semibold text-white truncate">{p.title}</p>
          </div>
          <span className="ml-auto text-[11px] text-white/40 shrink-0">{p.time}</span>
        </li>
      ))}
      <p className="text-[11px] text-white/45">
        A live feed of team, driver and paddock news — filtered to what matters.
      </p>
    </ul>
  );
}

/* --- Section E: Community / Multiplayer Champions ------------------ */
function CommunityVisual() {
  const teams = [
    { name: "Apex Racers", members: "1.2k", color: "from-race-accent to-orange-500" },
    { name: "The Pit Wall", members: "860", color: "from-indigo-500 to-blue-500" },
    { name: "Midfield Masters", members: "540", color: "from-emerald-500 to-teal-500" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">Featured Communities</h3>
        <button
          type="button"
          className="text-xs font-semibold text-race-accent hover:underline"
        >
          Join a league →
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {teams.map((t) => (
          <div
            key={t.name}
            className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5 text-center"
          >
            <div
              className={`mx-auto w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center shadow-lg mb-2`}
            >
              <span className="w-4 h-4 rounded-full bg-black/25" />
            </div>
            <p className="text-xs font-semibold text-white">{t.name}</p>
            <p className="text-[11px] text-white/45">{t.members} members</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-white/45">
        Pick a room, race your friends, and battle for the weekly podium.
      </p>
    </div>
  );
}

/* ================================================================== */
/* Feature definitions                                                 */
/* ================================================================== */

export type Feature = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  visual: ReactNode;
};

export const FEATURES: Feature[] = [
  {
    id: "standings",
    eyebrow: "Live Rankings & Standings",
    title: "Catch every chequered flag.",
    description:
      "Drivers' and constructors' championships update the second the results land. Watch positions tumble through the order in real time as the grid settles.",
    visual: <StandingsVisual />,
  },
  {
    id: "schedule",
    eyebrow: "Race Calendar & Schedules",
    title: "Know the track before lights out.",
    description:
      "Every GP, every practice, qualifier and race — on one calendar with local times, countdowns and track info so you never miss a session.",
    visual: <CalendarVisual />,
  },
  {
    id: "telemetry",
    eyebrow: "Live Telemetry & Data",
    title: "Every corner, every tenth.",
    description:
      "Keep an eye on live speed traps, sector deltas and lap evolution. Deep, instant data for hardcore fans and newcomers alike.",
    visual: <TelemetryVisual />,
  },
  {
    id: "news",
    eyebrow: "Team & Driver News",
    title: "From the pits to your feed.",
    description:
      "A curated real-time feed of team, driver and paddock news. Follow your favourites and never let a storyline pass you by.",
    visual: <NewsVisual />,
  },
  {
    id: "community",
    eyebrow: "Community & Leagues",
    title: "From rookies to race winners.",
    description:
      "Drop into rooms full of people who love the sport as much as you do. Race friends, join leagues, and climb the weekly leaderboard together.",
    visual: <CommunityVisual />,
  },
];