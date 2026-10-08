"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DISH_EMOJI_OPTIONS } from "@/lib/dish-emoji";
import { DishMark } from "@/components/menu/dish-title";

type DishEmojiSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DishEmojiSelect({ value, onChange }: DishEmojiSelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function openPanel() {
    const button = rootRef.current?.querySelector("button");
    if (button) {
      const box = button.getBoundingClientRect();
      setPanelPos({
        top: box.bottom + 6,
        right: window.innerWidth - box.right,
      });
    }
    setOpen((current) => !current);
  }

  function pick(next: string) {
    onChange(next);
    setOpen(false);
  }

  return (
    <>
      <div ref={rootRef} className="ml-auto shrink-0">
        <button
          type="button"
          aria-label="Picto du plat"
          aria-expanded={open}
          onClick={openPanel}
          className="flex size-9 items-center justify-center rounded-md text-[#1B1E19] hover:bg-black/5"
        >
          <svg viewBox="0 0 16 16" className="size-3.5 text-[#8a8578]" aria-hidden>
            <path
              fill="currentColor"
              d="M4.2 6.2 8 10l3.8-3.8.9.8L8 11.8 3.3 7z"
            />
          </svg>
        </button>
      </div>
      {mounted && open
        ? createPortal(
            <div
              ref={panelRef}
              className="fixed z-[80] flex gap-1 rounded-xl border border-[#D9CFB8] bg-white p-1.5 shadow-md"
              style={{ top: panelPos.top, right: panelPos.right }}
            >
              <button
                type="button"
                title="Aucun"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => pick("")}
                className={`flex size-12 items-center justify-center rounded-lg text-[15px] text-[#8a8578] ${
                  !value ? "bg-[#1E3A2F]/10" : "hover:bg-black/5"
                }`}
              >
                —
              </button>
              {DISH_EMOJI_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  title={option.label}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => pick(option.id)}
                  className={`flex min-w-12 flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1.5 ${
                    value === option.id ? "bg-[#1E3A2F]/10" : "hover:bg-black/5"
                  }`}
                >
                  <DishMark emoji={option.id} className="!size-8" />
                  <span className="text-[10px] font-medium text-[#6b6a5f]">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
