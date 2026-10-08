import Link from "next/link";
import type { ReactNode } from "react";

import { BrandLogo } from "@/components/brand-logo";

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
      className={`group flex items-center gap-5 rounded-2xl border border-[#E8D9B0] bg-white p-5 shadow-[0_8px_28px_rgba(30,58,47,0.07)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#E0B84A] hover:shadow-[0_16px_40px_rgba(30,58,47,0.14)] ${className}`}
    >
      <span
        className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E5C45] to-[#2A7A58] text-2xl shadow-[0_6px_16px_rgba(30,92,69,0.28)] transition-transform duration-300 group-hover:scale-105"
        aria-hidden
      >
        {emoji}
      </span>

      <div className="min-w-0 flex-1 text-left">
        <p className="text-lg font-semibold tracking-tight text-[#163D2E] transition-colors duration-300 group-hover:text-[#0F4C3A]">
          {title}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[#6F6A5C] transition-colors duration-300 group-hover:text-[#555143]">
          {description}
        </p>
      </div>

      <span
        className="shrink-0 text-xl text-[#D4A017] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#E0B84A]"
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
    <main className="relative min-h-screen overflow-hidden bg-[#F7F0E4] text-[#1B1E19]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(224,184,74,0.38), transparent 55%), radial-gradient(ellipse 55% 40% at 100% 100%, rgba(30,92,69,0.14), transparent 50%), radial-gradient(ellipse 40% 30% at 0% 80%, rgba(229,106,69,0.1), transparent 45%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
        <div className="flex flex-1 flex-col items-center justify-center">
          <header className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both text-center duration-700">
            <div className="mb-5 flex justify-center">
              <BrandLogo size={96} className="size-24" />
            </div>
            <p className="font-[family-name:var(--font-cormorant)] text-[clamp(2.75rem,9vw,4.25rem)] font-light leading-none tracking-[0.16em] text-[#0F4C3A]">
              {eyebrow}
            </p>
            <div className="mx-auto mt-4 h-[2px] w-28 rounded-full bg-gradient-to-r from-[#E56A45] via-[#E0B84A] to-[#1E5C45]" />
            <p className="mt-5 font-[family-name:var(--font-cormorant)] text-xl font-semibold tracking-[0.22em] text-[#C4921A] uppercase">
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
              className="text-xs tracking-[0.2em] text-[#6F6A5C] uppercase transition hover:text-[#C4921A]"
            >
              {backLabel}
            </Link>
          ) : (
            <p className="text-xs tracking-[0.2em] text-[#6F6A5C] uppercase">
              La Grappa
            </p>
          )}
        </footer>
      </div>
    </main>
  );
}
