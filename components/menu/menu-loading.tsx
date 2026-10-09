export function MenuLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-dvh flex-col items-center justify-center px-6"
    >
      <span className="sr-only">Chargement de la carte</span>

      <div className="relative size-11">
        <span className="absolute inset-0 rounded-full border border-leaf/20" />
        <span className="absolute inset-[3px] animate-spin rounded-full border-2 border-transparent border-t-leaf" />
      </div>

      <p className="mt-7 font-[family-name:var(--font-cormorant)] text-[32px] leading-none font-semibold text-leaf">
        La carte
      </p>
      <p className="mt-3 text-[11px] font-medium tracking-[0.28em] text-wine/70 uppercase">
        se prépare
      </p>

      <div className="mt-12 w-full max-w-sm space-y-3" aria-hidden>
        {[0.9, 0.7, 0.82].map((width, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-6 rounded-xl bg-white/70 px-4 py-3 ring-1 ring-ink/6"
          >
            <span
              className="h-2 animate-pulse rounded-full bg-ink/10"
              style={{ width: `${width * 58}%`, animationDelay: `${index * 120}ms` }}
            />
            <span className="h-2 w-10 animate-pulse rounded-full bg-wine/15" />
          </div>
        ))}
      </div>
    </div>
  );
}
