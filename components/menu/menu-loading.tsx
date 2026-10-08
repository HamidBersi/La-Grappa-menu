export function MenuLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-dvh flex-col items-center justify-center px-6"
    >
      <span className="sr-only">Chargement de la carte</span>

      <div className="relative size-11">
        <span className="absolute inset-0 rounded-full border border-[#D9CFB8]" />
        <span className="absolute inset-[3px] animate-spin rounded-full border-2 border-transparent border-t-[#B68A3D]" />
      </div>

      <p className="mt-7 font-[family-name:var(--font-cormorant)] text-[32px] leading-none font-semibold italic text-[#1E3A2F]">
        La carte
      </p>
      <p className="mt-3 text-[11px] font-medium tracking-[0.28em] text-[#8a8578] uppercase">
        se prépare
      </p>

      <div className="mt-12 w-full max-w-[280px] space-y-5" aria-hidden>
        {[0.95, 0.72, 0.84].map((width, index) => (
          <div
            key={index}
            className="flex items-center gap-3"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <span
              className="h-[7px] animate-pulse rounded-full bg-[#e4dfd4]"
              style={{ width: `${width * 100}%` }}
            />
            <span className="h-px min-w-8 flex-1 border-b border-dotted border-[#d9cfb8]" />
            <span className="h-[7px] w-8 animate-pulse rounded-full bg-[#e4dfd4]" />
          </div>
        ))}
      </div>
    </div>
  );
}
