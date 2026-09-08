export default function EmptyState() {
  return (
    <main className="min-h-screen bg-[#0c0c14] px-4 py-24 text-white">
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-race-accent">
          Nothing here yet
        </p>
        <h1 className="mt-4 text-4xl font-extrabold">No results to show.</h1>
        <p className="mt-4 text-lg leading-relaxed text-white/65">
          This view will populate when there is fresh race information to share.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0c0c14] transition hover:bg-white/90"
        >
          Return to F1 Hub
        </a>
      </section>
    </main>
  );
}
