import Link from "next/link";
import type { ReactNode } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { ItaliaBar } from "@/components/italia-bar";

export type PortalCardProps = {
  href: string;
  emoji: string;
  title: string;
  description: string;
  className?: string;
};

export function PortalCard({
  href,
  emoji,
  title,
  description,
  className = "",
}: PortalCardProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-5 rounded-2xl border border-[#D7E6DB] bg-white p-5 shadow-[0_8px_28px_rgba(0,146,70,0.07)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-leaf/35 hover:shadow-[0_16px_40px_rgba(0,146,70,0.12)] ${className}`}
    >
      <span
        className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#009246] to-[#1B7A4A] text-2xl shadow-[0_6px_16px_rgba(0,146,70,0.28)] transition-transform duration-300 group-hover:scale-105"
        aria-hidden
      >
        {emoji}
      </span>

      <div className="min-w-0 flex-1 text-left">
        <p className="text-lg font-semibold tracking-tight text-[#163D2E] transition-colors duration-300 group-hover:text-leaf">
          {title}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[#6F6A5C]">{description}</p>
      </div>

      <span
        className="shrink-0 text-xl text-wine/80 transition-all duration-300 group-hover:translate-x-1 group-hover:text-wine"
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}

type PortalShellProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function PortalShell({
  eyebrow,
  title,
  subtitle,
  children,
  backHref,
  backLabel = "Retour",
}: PortalShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F0E4] text-ink">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(0,146,70,0.22), transparent 55%), radial-gradient(ellipse 55% 40% at 100% 100%, rgba(206,43,55,0.1), transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
        <div className="flex flex-1 flex-col items-center justify-center">
          <header className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both text-center duration-700">
            <div className="mb-6 flex justify-center">
              <BrandLogo size={120} className="size-[120px] ring-leaf/15" />
            </div>
            <p className="font-[family-name:var(--font-cormorant)] text-[clamp(2.75rem,9vw,4.25rem)] font-light leading-none tracking-[0.16em] text-leaf">
              {eyebrow}
            </p>
            <ItaliaBar className="mx-auto mt-4 h-[2px] w-28" />
            <p className="mt-5 font-[family-name:var(--font-cormorant)] text-xl font-semibold tracking-[0.22em] text-wine uppercase">
              {title}
            </p>
            {subtitle ? (
              <p className="mt-3 text-sm tracking-wide text-[#6F6A5C]">{subtitle}</p>
            ) : null}
          </header>

          {children}
        </div>

        <footer className="animate-in fade-in fill-mode-both pt-8 text-center delay-500 duration-1000">
          {backHref ? (
            <Link
              href={backHref}
              className="text-xs tracking-[0.2em] text-[#6F6A5C] uppercase transition hover:text-wine"
            >
              {backLabel}
            </Link>
          ) : (
            <p className="text-xs tracking-[0.2em] text-[#6F6A5C] uppercase">La Grappa</p>
          )}
        </footer>
      </div>
    </main>
  );
}
