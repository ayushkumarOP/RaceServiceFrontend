import type { Feature } from "./features";

/* ================================================================== */
/* Feature section layout (mirrors Discord's alternating image+text)   */
/* ================================================================== */

export default function FeatureSection({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const flipped = index % 2 === 1;

  return (
    <section
      id={feature.id}
      className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto grid items-center gap-12 lg:grid-cols-2">
        {/* Text */}
        <div
          className={`order-1 ${
            flipped ? "lg:order-2 lg:pl-16" : "lg:order-1 lg:pr-16"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-race-accent">
            {feature.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-white leading-tight">
            {feature.title}
          </h2>
          <p className="mt-5 text-lg text-white/65 leading-relaxed max-w-xl">
            {feature.description}
          </p>
        </div>

        {/* Visual */}
        <div className={`order-2 ${flipped ? "lg:order-1" : "lg:order-2"}`}>
          <div
            aria-hidden
            className="absolute -inset-5 rounded-3xl blur-2xl opacity-70 animate-blob"
            style={{
              background: `radial-gradient(closest-side at 50% 50%, ${
                flipped ? "#dc000022" : "#2563eb1c"
              }, transparent)`,
            }}
          />
          <div className="relative rounded-2xl bg-[#12121b] border border-white/10 p-5 sm:p-6 shadow-2xl shadow-black/50">
            {feature.visual}
          </div>
        </div>
      </div>
    </section>
  );
}