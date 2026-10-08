"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { SEARCH_MIN_QUERY_LENGTH } from "@/lib/dish-search";

export type DeletedDishHit = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  priceVerre: string | null;
  priceQuart: string | null;
  priceDemi: string | null;
  priceBouteille: string | null;
  emoji: string | null;
  categoryName: string;
};

type DishDeletedSearchProps = {
  query: string;
  categoryId: string | null;
  enabled: boolean;
  onSelect: (hit: DeletedDishHit) => void;
  children: ReactNode;
};

export function DishDeletedSearch({
  query,
  categoryId,
  enabled,
  onSelect,
  children,
}: DishDeletedSearchProps) {
  const [hits, setHits] = useState<DeletedDishHit[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (wrapRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!enabled || !categoryId || query.trim().length < SEARCH_MIN_QUERY_LENGTH) {
      abortRef.current?.abort();
      setHits([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const box = wrapRef.current?.getBoundingClientRect();
      if (box) {
        setPanelPos({
          top: box.bottom + 6,
          left: box.left,
          width: box.width,
        });
      }

      void fetch(
        `/api/menu/items/search?q=${encodeURIComponent(query.trim())}&categoryId=${encodeURIComponent(categoryId)}`,
        { signal: controller.signal, credentials: "include" },
      )
        .then(async (response) => {
          if (!response.ok) return;
          const data = (await response.json()) as DeletedDishHit[];
          setHits(data);
          setOpen(data.length > 0);
        })
        .catch((error: unknown) => {
          if (error instanceof Error && error.name === "AbortError") return;
          setHits([]);
          setOpen(false);
        });
    }, 200);
  }, [query, categoryId, enabled]);

  function handleSelect(hit: DeletedDishHit) {
    setHits([]);
    setOpen(false);
    onSelect(hit);
  }

  return (
    <>
      <div ref={wrapRef} className="relative">
        {children}
      </div>
      {mounted && open && hits.length > 0
        ? createPortal(
            <ul
              ref={panelRef}
              className="fixed z-[80] max-h-60 overflow-auto rounded-xl border border-[#D9CFB8] bg-white py-1 shadow-lg"
              style={{
                top: panelPos.top,
                left: panelPos.left,
                width: panelPos.width,
              }}
            >
              {hits.map((hit) => (
                <li key={hit.id}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left hover:bg-[#1E3A2F]/5"
                    onPointerDown={(event) => event.stopPropagation()}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(hit)}
                  >
                    <span className="block font-medium text-[#1B1E19]">
                      {hit.name}
                    </span>
                    {hit.description ? (
                      <span className="mt-0.5 block truncate text-xs text-[#6b6a5f]">
                        {hit.description}
                      </span>
                    ) : null}
                    <span className="mt-0.5 block text-[10px] font-medium tracking-wide text-[#8a8578] uppercase">
                      {hit.categoryName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </>
  );
}
