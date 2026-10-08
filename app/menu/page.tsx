"use client";

import { useEffect, useState } from "react";

import { DigitalMenu } from "@/components/menu/digital-menu";
import { MenuLoading } from "@/components/menu/menu-loading";
import type { MenuCategoryDto } from "@/components/menu/menu-types";

type LoadState = "loading" | "error" | "ready";

export default function PublicMenuPage() {
  const [categories, setCategories] = useState<MenuCategoryDto[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/menu", { cache: "no-store" });
        if (!response.ok) {
          setLoadState("error");
          return;
        }
        setCategories((await response.json()) as MenuCategoryDto[]);
        setLoadState("ready");
      } catch {
        setLoadState("error");
      }
    }
    void load();
  }, []);

  return (
    <main className="min-h-dvh min-w-0 flex-1 bg-[#F4F1EA] text-[#1B1E19]">
      {loadState === "loading" ? <MenuLoading /> : null}
      {loadState === "error" ? (
        <p className="p-8 text-center text-sm text-red-700">
          Impossible de charger le menu.
        </p>
      ) : null}
      {loadState === "ready" ? <DigitalMenu categories={categories} /> : null}
    </main>
  );
}
