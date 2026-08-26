import { CheckerFlag } from "./Navbar";

export default function CtaBand() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#181826] via-[#1b1b2c] to-[#0d0d14] p-8 sm:p-14 text-center shadow-2xl shadow-black/50">
        {/* ambient glow */}
        <div
          aria-hidden
          className="absolute -top-24 -left-16 w-80 h-80 rounded-full bg-race-accent/20 blur-[100px] animate-blob"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-indigo-600/20 blur-[100px] animate-blob"
          style={{ animationDelay: "-6s" }}
        />

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-race-accent">
            Reliability you can trust
          </p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            FAST, RELIABLE, PRESENT.
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-white/65">
            Live data delivered with rock-solid uptime, wherever — and whenever —
            you open your F1 Hub. Built for race day, every day.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#schedule"
              className="inline-flex items-center justify-center rounded-full bg-race-accent text-white px-8 py-3.5 text-base font-semibold transition-all hover:bg-red-500 hover:shadow-xl hover:shadow-race-accent/30 active:scale-95"
            >
              View Race Calendar
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 text-white px-8 py-3.5 text-base font-semibold transition-all hover:bg-white/10 active:scale-95"
            >
              <CheckerFlag className="w-5 h-5 text-race-accent" />
              Get Started — it's free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}