"use client";

import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import {
  LOCALE_LABELS,
  MENU_LOCALES,
  tUi,
  type MenuLocale,
} from "@/components/menu/i18n";

function Flag({ locale }: { locale: MenuLocale }) {
  if (locale === "fr") {
    return (
      <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden className="rounded-sm shadow-sm">
        <rect width="6.67" height="14" fill="#002395" />
        <rect x="6.67" width="6.67" height="14" fill="#FFFFFF" />
        <rect x="13.33" width="6.67" height="14" fill="#ED2939" />
      </svg>
    );
  }
  if (locale === "en") {
    return (
      <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden className="rounded-sm shadow-sm">
        <rect width="20" height="14" fill="#012169" />
        <path d="M0 0L20 14M20 0L0 14" stroke="#FFFFFF" strokeWidth="2.5" />
        <path d="M0 0L20 14M20 0L0 14" stroke="#C8102E" strokeWidth="1.2" />
        <path d="M10 0V14M0 7H20" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M10 0V14M0 7H20" stroke="#C8102E" strokeWidth="2" />
      </svg>
    );
  }
  if (locale === "de") {
    return (
      <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden className="rounded-sm shadow-sm">
        <rect width="20" height="4.67" fill="#000000" />
        <rect y="4.67" width="20" height="4.67" fill="#DD0000" />
        <rect y="9.33" width="20" height="4.67" fill="#FFCE00" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden className="rounded-sm shadow-sm">
      <rect width="6.67" height="14" fill="#009246" />
      <rect x="6.67" width="6.67" height="14" fill="#FFFFFF" />
      <rect x="13.33" width="6.67" height="14" fill="#CE2B37" />
    </svg>
  );
}

function goBack() {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  window.location.href = "/";
}

type MenuTopNavProps = {
  locale: MenuLocale;
  onLocaleChange: (locale: MenuLocale) => void;
};

export function MenuTopNav({ locale, onLocaleChange }: MenuTopNavProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const ui = tUi(locale);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="relative z-[110] flex items-center justify-between gap-3 border-b border-[#e4dfd4] bg-[#F4F1EA]/95 px-4 py-3 backdrop-blur-sm sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          aria-label={ui.backLabel}
          className="shrink-0 rounded-full transition active:scale-95 hover:opacity-90"
        >
          <BrandLogo size={52} className="size-[52px]" />
        </button>
        <div className="min-w-0">
          <p className="truncate font-[family-name:var(--font-cormorant)] text-[22px] leading-none font-semibold tracking-wide text-[#1E3A2F]">
            La Grappa
          </p>
          <p className="mt-1 truncate text-[10px] font-medium tracking-[0.18em] text-[#8a8578] uppercase">
            {ui.tagline}
          </p>
        </div>
      </div>

      <div ref={ref} className="relative shrink-0">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={ui.selectLanguage}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex h-10 items-center gap-1.5 rounded-full border border-[#e4dfd4] bg-white px-2.5 shadow-sm transition hover:border-[#D8B871]"
        >
          <Flag locale={locale} />
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
            className={`text-[#8a8578] transition ${open ? "rotate-180" : ""}`}
          >
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open ? (
          <ul
            role="listbox"
            className="absolute right-0 z-[120] mt-2 min-w-[168px] overflow-hidden rounded-xl border border-[#e4dfd4] bg-white py-1 shadow-lg"
          >
            {MENU_LOCALES.map((code) => {
              const active = code === locale;
              return (
                <li key={code} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onLocaleChange(code);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition ${
                      active
                        ? "bg-[#F4F1EA] font-medium text-[#1E3A2F]"
                        : "text-[#1B1E19] hover:bg-[#FBF8F1]"
                    }`}
                  >
                    <Flag locale={code} />
                    {LOCALE_LABELS[code]}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </header>
  );
}

export type { MenuLocale } from "@/components/menu/i18n";
export { readStoredMenuLocale, storeMenuLocale } from "@/components/menu/i18n";
