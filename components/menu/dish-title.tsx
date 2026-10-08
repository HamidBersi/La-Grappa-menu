"use client";

import { useId } from "react";
import { normalizeDishEmoji } from "@/lib/dish-emoji";

const box =
  "dish-mark inline-block size-[1.2em] shrink-0 overflow-visible align-[-0.22em] [print-color-adjust:exact] [-webkit-print-color-adjust:exact]";

function markClass(className?: string) {
  return className ? `${box} ${className}` : box;
}

function uid(id: string) {
  return id.replace(/:/g, "");
}

function ChiliMark({ className }: { className?: string }) {
  const g = uid(useId());
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={markClass(className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${g}-body`} x1="2" y1="6" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF7043" />
          <stop offset="50%" stopColor="#E53935" />
          <stop offset="100%" stopColor="#B71C1C" />
        </linearGradient>
      </defs>
      <path
        d="M13 11c0 2.21-2.239 4-5 4s-5-1.79-5-4a8 8 0 1 0 16 0a3 3 0 0 0-6 0"
        fill={`url(#${g}-body)`}
        stroke="#9B1B1B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 8c0-2 2-4 4-4"
        stroke="#2E7D32"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BioMark({ className }: { className?: string }) {
  const g = uid(useId());
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={markClass(className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${g}-leaf`} x1="4" y1="4" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#AED581" />
          <stop offset="45%" stopColor="#43A047" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
      </defs>
      <path
        d="M11 20a10 10 0 0010-10 25.9 25.9 0 00-1.04-7.281 1 1 0 00-1.755-.325C15.833 5.5 13 5.5 9.8 6.1A7 7 0 0011 20"
        fill={`url(#${g}-leaf)`}
        stroke="#1B5E20"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 21a5 5 0 012.911-4.544C7.613 15.212 8.351 15.24 11 13"
        stroke="#1B5E20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VegMark({ className }: { className?: string }) {
  const g = uid(useId());
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={markClass(className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${g}-root`} x1="3" y1="8" x2="16" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFCC80" />
          <stop offset="50%" stopColor="#FB8C00" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>
        <linearGradient id={`${g}-top`} x1="14" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9CCC65" />
          <stop offset="100%" stopColor="#33691E" />
        </linearGradient>
      </defs>
      <path
        d="M15 16a1 1 0 0 0-7-7q-4 4-5.987 12.385a.5.5 0 0 0 .602.602Q11 20 15 16"
        fill={`url(#${g}-root)`}
        stroke="#E65100"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 9q4 4 7 0-3-4-7 0 4-4 0-7-4 3 0 7"
        fill={`url(#${g}-top)`}
        stroke="#33691E"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m8 15-2.58-2.58"
        stroke="#E65100"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VeganMark({ className }: { className?: string }) {
  const g = uid(useId());
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={markClass(className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${g}-leaf`} x1="4" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
      </defs>
      <path
        d="M17.41 3.59a10 10 0 1 0 3 3"
        stroke="#2E7D32"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 2a26.6 26.6 0 0 1 10 20c.9-6.82 1.5-9.5 4-14"
        fill={`url(#${g}-leaf)`}
        stroke="#1B5E20"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 8q6 0 6-6-6 0-6 6"
        fill="#7CB342"
        stroke="#33691E"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DishMark({
  emoji,
  className,
}: {
  emoji?: string | null;
  className?: string;
}) {
  const id = normalizeDishEmoji(emoji);
  if (id === "chili") return <ChiliMark className={className} />;
  if (id === "bio") return <BioMark className={className} />;
  if (id === "veg") return <VegMark className={className} />;
  if (id === "vegan") return <VeganMark className={className} />;
  return null;
}

export function DishTitle({
  name,
  emoji,
}: {
  name: string;
  emoji?: string | null;
}) {
  const id = normalizeDishEmoji(emoji);
  if (!id) return name;
  return (
    <>
      {name}{" "}
      <DishMark emoji={id} />
    </>
  );
}
