"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Eye,
  GripVertical,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Printer,
  QrCode,
  Trash2,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";

import {
  isWineCategoryName,
  normalizeStoredPrice,
  sanitizePriceInput,
} from "@/lib/menu-price";
import { DishMark, DishTitle } from "@/components/menu/dish-title";
import { DishEmojiSelect } from "@/components/menu/dish-emoji-select";
import {
  DishDeletedSearch,
  type DeletedDishHit,
} from "@/components/menu/dish-deleted-search";
import { DigitalMenu } from "@/components/menu/digital-menu";
import {
  MenuFamilyBar,
  categoriesForFamily,
  familyIdForCategoryName,
} from "@/components/menu/menu-family-bar";
import { MenuSheet } from "@/components/menu/menu-sheet";
import type { MenuCategoryDto, MenuItemDto } from "@/components/menu/menu-types";
import type { MenuFamilyId } from "@/components/menu/menu-groups";
import {
  loadLastPrintHashes,
  modifiedPrintPages,
  pagePreviewLabel,
  rememberPrintedPages,
  appendMissingPrintItems,
  slicePrintPagesFromDom,
  type PrintPageSlice,
} from "@/components/menu/print-pagination";
import { useOwnerLogout } from "@/components/menu/owner-gate";

type DishFormState = {
  name: string;
  description: string;
  price: string;
  priceVerre: string;
  priceQuart: string;
  priceDemi: string;
  priceBouteille: string;
  emoji: string;
};

type AdminView = "edit" | "preview";

const emptyForm: DishFormState = {
  name: "",
  description: "",
  price: "",
  priceVerre: "",
  priceQuart: "",
  priceDemi: "",
  priceBouteille: "",
  emoji: "",
};

const fieldClass =
  "h-10 w-full rounded-lg border border-[#D9CFB8] bg-[#FBF8F1] px-2.5 text-base outline-none focus:border-leaf/40";

export function MenuAdminApp() {
  const logout = useOwnerLogout();
  const [view, setView] = useState<AdminView>("edit");
  const [categories, setCategories] = useState<MenuCategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [familyId, setFamilyId] = useState<MenuFamilyId>("all");
  const [printOpen, setPrintOpen] = useState(false);
  const [printSelection, setPrintSelection] = useState<number[]>([]);
  const [printSlices, setPrintSlices] = useState<PrintPageSlice[] | null>(null);
  const [estimatedPages, setEstimatedPages] = useState<PrintPageSlice[]>([]);
  const [modifiedPages, setModifiedPages] = useState<number[]>([]);
  const measureRef = useRef<HTMLDivElement>(null);
  const pageHeightRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItemDto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<DishFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [menuPublicUrl, setMenuPublicUrl] = useState("/menu");
  const [pendingDelete, setPendingDelete] = useState<MenuItemDto | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const loadMenu = useCallback(async () => {
    try {
      const response = await fetch("/api/owner/menu", {
        cache: "no-store",
        credentials: "include",
      });
      if (!response.ok) {
        toast.error("Impossible de charger le menu.");
        return;
      }
      const data = (await response.json()) as MenuCategoryDto[];
      setCategories(data);
      setSelectedCategoryId((current) => {
        if (current && data.some((category) => category.id === current)) {
          return current;
        }
        return data[0]?.id ?? null;
      });
    } catch {
      toast.error("Impossible de charger le menu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMenu();
  }, [loadMenu]);

  useEffect(() => {
    setMenuPublicUrl(`${window.location.origin}/menu`);
  }, []);

  useEffect(() => {
    if (!pendingDelete) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !deleting) setPendingDelete(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingDelete, deleting]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );
  const familyReadyRef = useRef(false);

  useEffect(() => {
    if (familyReadyRef.current || !selectedCategory) return;
    familyReadyRef.current = true;
    setFamilyId(familyIdForCategoryName(selectedCategory.name));
  }, [selectedCategory]);

  const isWineForm = Boolean(
    selectedCategory && isWineCategoryName(selectedCategory.name),
  );

  function selectFamily(next: MenuFamilyId) {
    setFamilyId(next);
    const inFamily = categoriesForFamily(next, categories);
    const keep = inFamily.find((category) => category.id === selectedCategoryId);
    setSelectedCategoryId((keep ?? inFamily[0])?.id ?? null);
  }

  function selectSubCategory(name: string | null) {
    if (!name) return;
    const found = categories.find((category) => category.name === name);
    if (found) setSelectedCategoryId(found.id);
  }

  async function handleItemsDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !selectedCategory || reordering) return;

    const items = selectedCategory.items;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const previous = categories;
    const reordered = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
      ...item,
      position: index,
    }));

    setCategories((current) =>
      current.map((category) =>
        category.id === selectedCategory.id
          ? { ...category, items: reordered }
          : category,
      ),
    );

    setReordering(true);
    try {
      const response = await fetch("/api/menu/items/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          categoryId: selectedCategory.id,
          orderedIds: reordered.map((item) => item.id),
        }),
      });
      if (!response.ok) {
        setCategories(previous);
        toast.error("Impossible d’enregistrer l’ordre.");
      }
    } catch {
      setCategories(previous);
      toast.error("Impossible d’enregistrer l’ordre.");
    } finally {
      setReordering(false);
    }
  }

  function openCreate() {
    if (!selectedCategoryId) {
      toast.error("Choisissez une catégorie.");
      return;
    }
    setEditingItem(null);
    setRestoringId(null);
    setIsCreating(true);
    setForm(emptyForm);
  }

  function openEdit(item: MenuItemDto) {
    setIsCreating(false);
    setRestoringId(null);
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description ?? "",
      price: normalizeStoredPrice(item.price) ?? item.price,
      priceVerre: normalizeStoredPrice(item.priceVerre ?? "") ?? "",
      priceQuart: normalizeStoredPrice(item.priceQuart ?? "") ?? "",
      priceDemi: normalizeStoredPrice(item.priceDemi ?? "") ?? "",
      priceBouteille: normalizeStoredPrice(item.priceBouteille ?? "") ?? "",
      emoji: item.emoji ?? "",
    });
  }

  function closeForm() {
    setIsCreating(false);
    setEditingItem(null);
    setRestoringId(null);
    setForm(emptyForm);
  }

  function applyDeletedHit(hit: DeletedDishHit) {
    setRestoringId(hit.id);
    setForm({
      name: hit.name,
      description: hit.description ?? "",
      price: normalizeStoredPrice(hit.price) ?? hit.price,
      priceVerre: normalizeStoredPrice(hit.priceVerre ?? "") ?? "",
      priceQuart: normalizeStoredPrice(hit.priceQuart ?? "") ?? "",
      priceDemi: normalizeStoredPrice(hit.priceDemi ?? "") ?? "",
      priceBouteille: normalizeStoredPrice(hit.priceBouteille ?? "") ?? "",
      emoji: hit.emoji ?? "",
    });
  }

  async function saveDish() {
    const name = form.name.trim();
    const wineTiers = {
      priceVerre: normalizeStoredPrice(form.priceVerre) ?? "",
      priceQuart: normalizeStoredPrice(form.priceQuart) ?? "",
      priceDemi: normalizeStoredPrice(form.priceDemi) ?? "",
      priceBouteille: normalizeStoredPrice(form.priceBouteille) ?? "",
    };
    const price = isWineForm
      ? wineTiers.priceVerre ||
        wineTiers.priceBouteille ||
        wineTiers.priceQuart ||
        wineTiers.priceDemi
      : (normalizeStoredPrice(form.price) ?? "");

    if (!isWineForm && form.price.trim() && !normalizeStoredPrice(form.price)) {
      toast.error("Le prix doit être un nombre, ex. 9,90.");
      return;
    }

    if (!name || !price) {
      toast.error(
        isWineForm
          ? "Le nom et au moins un tarif (verre ou bouteille) sont obligatoires."
          : "Le nom et le prix sont obligatoires.",
      );
      return;
    }

    setSaving(true);
    try {
      const payload = isWineForm
        ? {
            name,
            description: form.description,
            price,
            ...wineTiers,
            emoji: form.emoji,
          }
        : {
            name,
            description: form.description,
            price,
            emoji: form.emoji,
          };
      if (editingItem) {
        const response = await fetch(`/api/menu/items/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          toast.error(data?.error ?? "Modification impossible.");
          return;
        }
        toast.success("Plat mis à jour");
      } else if (restoringId) {
        const response = await fetch(`/api/menu/items/${restoringId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...payload,
            categoryId: selectedCategoryId,
            isAvailable: true,
          }),
        });
        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          toast.error(data?.error ?? "Impossible de rétablir ce plat.");
          return;
        }
        toast.success("Plat rétabli");
      } else {
        const response = await fetch("/api/menu/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            categoryId: selectedCategoryId,
            ...payload,
          }),
        });
        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          toast.error(data?.error ?? "Création impossible.");
          return;
        }
        toast.success("Plat ajouté");
      }

      closeForm();
      await loadMenu();
    } catch {
      toast.error("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/menu/items/${pendingDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        toast.error("Suppression impossible.");
        return;
      }
      toast.success("Plat supprimé");
      setPendingDelete(null);
      await loadMenu();
    } catch {
      toast.error("Erreur réseau.");
    } finally {
      setDeleting(false);
    }
  }

  function openPrintModal() {
    setEstimatedPages([]);
    setPrintSelection([]);
    setModifiedPages([]);
    setPrintOpen(true);
  }

  useEffect(() => {
    if (!printOpen) return;

    let cancelled = false;

    async function measurePages() {
      await document.fonts.ready;
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
      if (cancelled) return;
      const root = measureRef.current;
      const probe = pageHeightRef.current;
      if (!root || !probe) return;
      const slices = slicePrintPagesFromDom(
        root,
        Math.max(probe.offsetHeight, 1),
        categories,
      );
      const modified = modifiedPrintPages(slices, loadLastPrintHashes());
      setEstimatedPages(slices);
      setModifiedPages(modified);
      setPrintSelection(slices.map((slice) => slice.page));
    }

    void measurePages();
    return () => {
      cancelled = true;
    };
  }, [printOpen, categories]);

  useEffect(() => {
    if (!navOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setNavOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setNavOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [navOpen]);

  function togglePrintPage(page: number) {
    setPrintSelection((current) =>
      current.includes(page)
        ? current.filter((value) => value !== page)
        : [...current, page].sort((a, b) => a - b),
    );
  }

  function selectAllPrintPages() {
    setPrintSelection(estimatedPages.map((slice) => slice.page));
  }

  function selectModifiedPrintPages() {
    setPrintSelection(modifiedPages);
  }

  function handlePrintSelection() {
    if (printSelection.length === 0) {
      toast.error("Sélectionnez au moins une page.");
      return;
    }

    const selected = estimatedPages.filter((slice) =>
      printSelection.includes(slice.page),
    );
    setPrintSlices(appendMissingPrintItems(selected, categories));
    setView("preview");
    setPrintOpen(false);

    window.setTimeout(() => {
      window.print();
    }, 200);
  }

  useEffect(() => {
    function onAfterPrint() {
      if (printSlices !== null && estimatedPages.length > 0) {
        rememberPrintedPages(
          estimatedPages,
          printSlices.map((slice) => slice.page),
        );
      }
      setPrintSlices(null);
    }
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, [printSlices, estimatedPages]);

  const formOpen = isCreating || editingItem !== null;
  const qrSrc = `/api/menu/qr?url=${encodeURIComponent(menuPublicUrl)}`;
  const allPagesSelected =
    estimatedPages.length > 0 &&
    printSelection.length === estimatedPages.length;
  const modifiedPagesSelected =
    modifiedPages.length > 0 &&
    printSelection.length === modifiedPages.length &&
    modifiedPages.every((page) => printSelection.includes(page));

  return (
    <div className="menu-admin-root flex min-h-dvh flex-1 flex-col bg-paper text-ink">
      <header className="menu-admin-chrome shrink-0 bg-leaf text-white">
        <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandLogo size={40} className="size-10" alt="" />
            <div className="min-w-0 leading-tight">
              <p className="truncate font-[family-name:var(--font-cormorant)] text-[22px] tracking-wide">
                La Grappa
              </p>
              <p className="text-[11px] font-medium tracking-wide text-white/70">
                espace admin
              </p>
            </div>
          </div>

          <div className="ml-auto hidden items-center gap-1.5 md:flex">
            <div className="flex rounded-full bg-black/20 p-0.5">
              <button
                type="button"
                onClick={() => setView("edit")}
                className={`rounded-full px-3 py-1 text-[13px] font-medium transition ${
                  view === "edit"
                    ? "bg-white text-leaf shadow-sm"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                Éditer
              </button>
              <button
                type="button"
                onClick={() => setView("preview")}
                className={`rounded-full px-3 py-1 text-[13px] font-medium transition ${
                  view === "preview"
                    ? "bg-white text-leaf shadow-sm"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                Aperçu
              </button>
            </div>

            <span className="mx-0.5 h-4 w-px bg-white/20" aria-hidden />

            <button
              type="button"
              title="Imprimer"
              aria-label="Imprimer"
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-white/90 transition hover:bg-white/15 hover:text-white"
              onClick={openPrintModal}
            >
              <Printer className="size-3.5" />
              <span className="text-[12px] font-medium">Imprimer</span>
            </button>
            <button
              type="button"
              title="QR code"
              aria-label="QR code"
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-2.5 text-leaf transition hover:bg-white/90"
              onClick={() => setQrOpen(true)}
            >
              <QrCode className="size-3.5" />
              <span className="text-[12px] font-semibold">QR</span>
            </button>
            <button
              type="button"
              title="Quitter"
              aria-label="Quitter"
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-white/90 transition hover:bg-white/15 hover:text-white"
              onClick={logout}
            >
              <LogOut className="size-3.5" />
              <span className="text-[12px] font-medium">Quitter</span>
            </button>
          </div>

          <div ref={navRef} className="relative ml-auto md:hidden">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full hover:bg-white/15"
              aria-label={navOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={navOpen}
              onClick={() => setNavOpen((open) => !open)}
            >
              {navOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            {navOpen ? (
              <div className="absolute top-full right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl bg-white py-1 text-ink shadow-[0_12px_32px_rgba(31,26,23,0.18)] ring-1 ring-ink/8">
                <button
                  type="button"
                  onClick={() => {
                    setView("edit");
                    setNavOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition ${
                    view === "edit"
                      ? "bg-paper font-medium text-leaf"
                      : "hover:bg-paper/80"
                  }`}
                >
                  <Pencil className="size-3.5" />
                  Éditer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView("preview");
                    setNavOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition ${
                    view === "preview"
                      ? "bg-paper font-medium text-leaf"
                      : "hover:bg-paper/80"
                  }`}
                >
                  <Eye className="size-3.5" />
                  Aperçu
                </button>
                <div className="my-1 h-px bg-ink/8" />
                <button
                  type="button"
                  onClick={() => {
                    setNavOpen(false);
                    openPrintModal();
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] hover:bg-paper/80"
                >
                  <Printer className="size-3.5" />
                  Imprimer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNavOpen(false);
                    setQrOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] hover:bg-paper/80"
                >
                  <QrCode className="size-3.5" />
                  QR code
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-wine hover:bg-paper/80"
                >
                  <LogOut className="size-3.5" />
                  Quitter
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {view === "edit" ? (
        <div className="flex min-h-0 flex-1 flex-col bg-paper">
          <div className="menu-admin-chrome sticky top-0 z-20 shrink-0 border-b border-ink/8 bg-paper/95 px-4 py-3 backdrop-blur-sm sm:px-6">
            <div className="mx-auto min-w-0 max-w-2xl">
              <MenuFamilyBar
                familyId={familyId}
                onFamilyChange={selectFamily}
                subCategoryName={selectedCategory?.name ?? null}
                onSubCategoryChange={selectSubCategory}
                categoryNames={categoriesForFamily("all", categories).map(
                  (category) => category.name,
                )}
                showSubAllTab={false}
                fadeFromClass="from-paper"
              />
            </div>
          </div>

          <section className="overflow-y-auto px-3 py-3 sm:px-6 sm:py-5">
            {loading ? (
              <p className="text-sm text-[#6b6a5f]">Chargement…</p>
            ) : (
              <div className="mx-auto w-full min-w-0 max-w-2xl">
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 sm:mb-3">
                  <h2 className="font-[family-name:var(--font-cormorant)] text-[22px] font-semibold text-leaf sm:text-[24px]">
                    {selectedCategory?.name ?? "Aucune catégorie"}
                  </h2>
                  <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center gap-1.5 rounded-md bg-leaf px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-[#007a3b]"
                  >
                    <Plus className="size-3.5" />
                    Ajouter un plat
                  </button>
                </div>

                {!selectedCategory || selectedCategory.items.length === 0 ? (
                  <div className="rounded-[10px] border border-dashed border-[#D9CFB8] px-8 py-10 text-center text-[#6b6a5f]">
                    Aucun plat dans cette catégorie pour l&apos;instant.
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleItemsDragEnd}
                  >
                    <SortableContext
                      items={selectedCategory.items.map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-1.5 sm:space-y-2">
                        {selectedCategory.items.map((item) => (
                          <SortableMenuItem
                            key={item.id}
                            item={item}
                            disabled={reordering}
                            onEdit={() => openEdit(item)}
                            onDelete={() => setPendingDelete(item)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col bg-paper">
          <div
            className={`flex-1 overflow-y-auto print:hidden ${printSlices !== null ? "hidden" : ""}`}
          >
            <DigitalMenu categories={categories} embedded />
          </div>
          <div
            className={
              printSlices !== null ? "block bg-white" : "hidden bg-white print:block"
            }
          >
            <MenuSheet
              categories={categories}
              printSlices={
                printSlices && printSlices.length > 0 ? printSlices : null
              }
            />
          </div>
        </div>
      )}

      {formOpen ? (
        <div className="menu-admin-chrome fixed inset-0 z-50 flex items-center justify-center bg-[#1B1E19]/55 p-5">
          <div className="max-h-[90vh] w-full max-w-[460px] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 font-[family-name:var(--font-cormorant)] text-[23px]">
              {editingItem ? "Modifier le plat" : "Ajouter un plat"}
            </h3>

            <div className="space-y-3.5">
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-[#6b6a5f]">
                  {isWineForm ? "Nom du vin" : "Nom du plat"}
                </span>
                <DishDeletedSearch
                  query={form.name}
                  categoryId={selectedCategoryId}
                  enabled={isCreating}
                  onSelect={applyDeletedHit}
                >
                  <div className="flex h-10 w-full items-center rounded-lg border border-[#D9CFB8] bg-[#FBF8F1] pl-2.5 pr-1 focus-within:border-leaf/40">
                    <input
                      value={form.name}
                      onChange={(event) => {
                        setRestoringId(null);
                        setForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }));
                      }}
                      placeholder="Ex. Filet de bœuf"
                      autoComplete="off"
                      className={`bg-transparent text-base outline-none ${
                        form.name
                          ? "field-sizing-content w-auto min-w-[1ch] max-w-[calc(100%-4.25rem)]"
                          : "min-w-0 flex-1"
                      }`}
                    />
                    {form.emoji ? (
                      <span className="ml-1 inline-flex shrink-0 items-center" aria-hidden>
                        <DishMark emoji={form.emoji} />
                      </span>
                    ) : null}
                    <DishEmojiSelect
                      value={form.emoji}
                      onChange={(emoji) =>
                        setForm((current) => ({ ...current, emoji }))
                      }
                    />
                  </div>
                </DishDeletedSearch>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-[#6b6a5f]">
                  Ingrédients / description
                </span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Ex. Sauce Gorgonzola…"
                  className="min-h-[60px] w-full rounded-lg border border-[#D9CFB8] bg-[#FBF8F1] px-2.5 py-2 text-base outline-none focus:border-leaf/40"
                />
              </label>

              {isWineForm ? (
                <div>
                  <p className="mb-1.5 text-[12.5px] font-semibold text-[#6b6a5f]">
                    Tarifs (€) — laisse vide un format non proposé
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(
                      [
                        ["priceVerre", "Verre"],
                        ["priceQuart", "Quart"],
                        ["priceDemi", "Demi"],
                        ["priceBouteille", "Bouteille"],
                      ] as const
                    ).map(([key, label]) => (
                      <label key={key} className="block">
                        <span className="mb-1 block text-[11px] text-[#8a8578]">
                          {label}
                        </span>
                        <input
                          value={form[key]}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              [key]: sanitizePriceInput(event.target.value),
                            }))
                          }
                          onBlur={() =>
                            setForm((current) => {
                              const next = normalizeStoredPrice(current[key]);
                              return {
                                ...current,
                                [key]: next ?? (current[key].trim() ? current[key] : ""),
                              };
                            })
                          }
                          placeholder="—"
                          inputMode="decimal"
                          className={fieldClass}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-[#6b6a5f]">
                    Prix (€)
                  </span>
                  <input
                    value={form.price}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        price: sanitizePriceInput(event.target.value),
                      }))
                    }
                    onBlur={() =>
                      setForm((current) => ({
                        ...current,
                        price: normalizeStoredPrice(current.price) ?? current.price,
                      }))
                    }
                    placeholder="Ex. 9,90"
                    inputMode="decimal"
                    className={fieldClass}
                  />
                </label>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-md border border-[#D9CFB8] px-4 py-2 text-[13.5px]"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveDish()}
                className="rounded-md bg-leaf px-4 py-2 text-[13.5px] font-semibold text-white hover:bg-[#007a3b] disabled:opacity-60"
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {printOpen ? (
        <div className="menu-admin-chrome fixed inset-0 z-50 flex items-center justify-center bg-[#1B1E19]/55 p-5">
          <div className="pointer-events-none fixed top-0 -left-[240vw] -z-10">
            <div ref={pageHeightRef} className="h-[269mm] w-[182mm]" />
            <div ref={measureRef} className="w-[182mm]">
              <MenuSheet categories={categories} measure />
            </div>
          </div>

          <div className="w-full max-w-[420px] rounded-xl bg-white p-6 shadow-xl">
            <h3 className="font-[family-name:var(--font-cormorant)] text-[23px]">
              Imprimer le menu
            </h3>

            <div className="mt-4 space-y-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#D9CFB8] bg-[#FBF8F1] px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={allPagesSelected}
                  onChange={() => {
                    if (allPagesSelected) {
                      setPrintSelection([]);
                    } else {
                      selectAllPrintPages();
                    }
                  }}
                  className="size-4 accent-leaf"
                />
                <span className="text-sm font-medium">Tout</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#D9CFB8] bg-[#FBF8F1] px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={modifiedPagesSelected}
                  disabled={modifiedPages.length === 0}
                  onChange={() => {
                    if (modifiedPagesSelected) {
                      setPrintSelection([]);
                    } else {
                      selectModifiedPrintPages();
                    }
                  }}
                  className="size-4 accent-leaf"
                />
                <span className="text-sm font-medium">
                  Imprimer les pages modifiées
                </span>
                <span className="ml-auto text-xs text-[#6b6a5f]">
                  {modifiedPages.length}
                </span>
              </label>
            </div>

            <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto">
              {estimatedPages.length === 0 ? (
                <li className="px-1 py-6 text-center text-sm text-[#6b6a5f]">
                  Calcul des pages…
                </li>
              ) : (
                estimatedPages.map((slice) => {
                  const checked = printSelection.includes(slice.page);
                  const changed = modifiedPages.includes(slice.page);
                  return (
                    <li key={slice.page}>
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#D9CFB8] bg-[#FBF8F1] px-3 py-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePrintPage(slice.page)}
                          className="size-4 accent-leaf"
                        />
                        <span className="flex-1 text-sm font-medium">
                          Page {slice.page}
                        </span>
                        <span className="max-w-[58%] truncate text-right text-xs text-[#6b6a5f]">
                          {changed ? "modifiée · " : ""}
                          {pagePreviewLabel(slice)}
                        </span>
                      </label>
                    </li>
                  );
                })
              )}
            </ul>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPrintOpen(false)}
                className="rounded-md border border-[#D9CFB8] px-4 py-2 text-[13.5px]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handlePrintSelection}
                className="rounded-md bg-leaf px-4 py-2 text-[13.5px] font-semibold text-white"
              >
                Imprimer
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {qrOpen ? (
        <div className="menu-admin-chrome fixed inset-0 z-50 flex items-center justify-center bg-[#1B1E19]/55 p-5">
          <div className="w-full max-w-[360px] rounded-xl bg-white p-6 text-center shadow-xl">
            <h3 className="font-[family-name:var(--font-cormorant)] text-[23px]">
              QR code du menu
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrSrc}
              alt="QR code menu"
              className="mx-auto mt-4 h-[220px] w-[220px] rounded-lg border border-[#D9CFB8]"
            />
            <p className="mt-3 break-all text-xs text-[#6b6a5f]">{menuPublicUrl}</p>
            <p className="mt-2 text-xs text-[#6b6a5f]">
              Ce lien reste fixe. Modifier les plats ne change pas le QR.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <a
                href={qrSrc}
                download="la-grappa-menu-qr.png"
                className="rounded-md border border-[#D9CFB8] px-4 py-2 text-[13.5px]"
              >
                Télécharger
              </a>
              <button
                type="button"
                onClick={() => setQrOpen(false)}
                className="rounded-md bg-leaf px-4 py-2 text-[13.5px] font-semibold text-white"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {pendingDelete ? (
        <div
          className="menu-admin-chrome fixed inset-0 z-[60] flex items-center justify-center bg-[#1B1E19]/60 p-5 backdrop-blur-[2px]"
          onClick={() => {
            if (!deleting) setPendingDelete(null);
          }}
        >
          <div
            role="alertdialog"
            aria-labelledby="delete-dish-title"
            aria-describedby="delete-dish-copy"
            className="w-full max-w-[400px] rounded-2xl border border-[#E8D5D0] bg-[#FBF8F1] p-6 shadow-[0_24px_60px_rgba(27,30,25,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-[#6E2A2A]/10 text-[#6E2A2A]">
              <Trash2 className="size-5" strokeWidth={2.25} />
            </div>
            <h3
              id="delete-dish-title"
              className="mt-4 font-[family-name:var(--font-cormorant)] text-[26px] leading-tight font-semibold text-[#1B1E19]"
            >
              Supprimer ce plat ?
            </h3>
            <p className="mt-2 font-[family-name:var(--font-cormorant)] text-[20px] leading-snug text-leaf">
              {pendingDelete.name}
            </p>
            <p
              id="delete-dish-copy"
              className="mt-3 text-[13.5px] leading-relaxed text-[#6b6a5f]"
            >
              Il disparaîtra de la carte. Tu pourras le retrouver en tapant son
              nom lors de l’ajout d’un plat.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setPendingDelete(null)}
                className="rounded-md border border-[#D9CFB8] bg-white px-4 py-2.5 text-[13.5px] font-medium text-[#1B1E19] hover:bg-[#F4F1EA] disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void confirmDelete()}
                className="rounded-md bg-[#6E2A2A] px-4 py-2.5 text-[13.5px] font-semibold text-[#FBF8F1] hover:bg-[#5A2222] disabled:opacity-60"
              >
                {deleting ? "Suppression…" : "Oui, supprimer"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Toaster richColors position="top-center" />
    </div>
  );
}

function SortableMenuItem({
  item,
  disabled,
  onEdit,
  onDelete,
}: {
  item: MenuItemDto;
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="flex min-w-0 items-start gap-1.5 rounded-lg border border-[#D9CFB8] bg-white px-2 py-1.5 sm:gap-2 sm:px-2.5 sm:py-2"
    >
      <button
        type="button"
        className="mt-0.5 flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md border border-[#D9CFB8] bg-white text-[#8a8578] hover:border-leaf/30 hover:text-leaf active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50 sm:size-auto sm:p-1"
        aria-label="Déplacer le plat"
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-3.5" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start gap-1.5">
          <h3 className="min-w-0 flex-1 break-words font-[family-name:var(--font-cormorant)] text-[16px] font-semibold leading-snug sm:text-[17px]">
            <DishTitle name={item.name} emoji={item.emoji} />
          </h3>
          <span className="shrink-0 pt-0.5 text-[13px] font-semibold text-leaf sm:text-[13.5px]">
            {item.price} €
          </span>
          <div className="flex shrink-0 items-center gap-0.5 sm:hidden">
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-md text-leaf hover:bg-[#FBF8F1]"
              onClick={onEdit}
              aria-label="Modifier"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-md text-[#6E2A2A] hover:bg-[#F8EEEE]"
              onClick={onDelete}
              aria-label="Supprimer"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
        {item.priceVerre ||
        item.priceQuart ||
        item.priceDemi ||
        item.priceBouteille ? (
          <p className="mt-0.5 text-[11px] text-[#6b6a5f] sm:text-[11.5px]">
            {[
              item.priceQuart ? `Quart ${item.priceQuart} €` : null,
              item.priceDemi ? `Demi ${item.priceDemi} €` : null,
              item.priceBouteille ? `Btl ${item.priceBouteille} €` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}
        {item.description?.trim() ? (
          <p className="mt-0.5 line-clamp-1 w-full break-words text-[12px] leading-snug text-[#6b6a5f] sm:line-clamp-2 sm:text-[12.5px]">
            {item.description}
          </p>
        ) : null}
        <div className="mt-1.5 hidden justify-end gap-1.5 sm:flex">
          <button
            type="button"
            className="rounded-md border border-[#D9CFB8] bg-[#FBF8F1] px-2 py-1 text-[12px] font-semibold text-leaf transition hover:border-leaf/35 hover:bg-white"
            onClick={onEdit}
          >
            Modifier
          </button>
          <button
            type="button"
            className="rounded-md border border-[#E0B4B0] bg-[#F8EEEE] px-2 py-1 text-[12px] font-semibold text-[#6E2A2A] transition hover:bg-[#F3E0DE]"
            onClick={onDelete}
          >
            Supprimer
          </button>
        </div>
      </div>
    </article>
  );
}
