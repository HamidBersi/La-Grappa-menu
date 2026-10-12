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
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  function updatePanelPos() {
    const box = wrapRef.current?.getBoundingClientRect();
    if (!box) return;
    setPanelPos({
      top: box.bottom + 6,
      left: box.left,
      width: Math.max(box.width, 260),
    });
  }

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
    function onReposition() {
      updatePanelPos();
    }
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!enabled || !categoryId || query.trim().length < SEARCH_MIN_QUERY_LENGTH) {
      abortRef.current?.abort();
      setHits([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      updatePanelPos();
      setLoading(true);
      setOpen(true);

      void fetch(
        `/api/menu/items/search?q=${encodeURIComponent(query.trim())}&categoryId=${encodeURIComponent(categoryId)}`,
        { signal: controller.signal, credentials: "include" },
      )
        .then(async (response) => {
          if (!response.ok) {
            setHits([]);
            setOpen(false);
            return;
          }
          const data = (await response.json()) as DeletedDishHit[];
          setHits(data);
          setOpen(true);
        })
        .catch((error: unknown) => {
          if (error instanceof Error && error.name === "AbortError") return;
          setHits([]);
          setOpen(false);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 180);
  }, [query, categoryId, enabled]);

  function handleSelect(hit: DeletedDishHit) {
    setHits([]);
    setOpen(false);
    onSelect(hit);
  }

  const showPanel = mounted && open && enabled;

  return (
    <>
      <div ref={wrapRef} className="relative">
        {children}
      </div>
      {showPanel
        ? createPortal(
            <div
              ref={panelRef}
              className="fixed z-[120] max-h-64 overflow-auto rounded-xl border border-[#D9CFB8] bg-white py-1 shadow-[0_12px_32px_rgba(27,30,25,0.18)]"
              style={{
                top: panelPos.top,
                left: panelPos.left,
                width: panelPos.width,
              }}
            >
              <p className="px-3 pb-1 pt-1.5 text-[10px] font-semibold tracking-[0.14em] text-[#8a8578] uppercase">
                Plats déjà retirés
              </p>
              {loading && hits.length === 0 ? (
                <p className="px-3 py-2 text-sm text-[#6b6a5f]">Recherche…</p>
              ) : hits.length === 0 ? (
                <p className="px-3 py-2 text-sm text-[#6b6a5f]">
                  Aucun plat retiré pour « {query.trim()} »
                </p>
              ) : (
                <ul>
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
                </ul>
              )}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
