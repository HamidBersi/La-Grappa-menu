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
import { GripVertical, LogOut, Menu, Plus, Printer, QrCode, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";

import {
  isWineCategoryName,
  normalizeStoredPrice,
  sanitizePriceInput,
} from "@/lib/menu-price";
import { DishTitle } from "@/components/menu/dish-title";
import { DigitalMenu } from "@/components/menu/digital-menu";
import {
  MenuFamilyBar,
  categoriesForFamily,
  familyIdForCategoryName,
} from "@/components/menu/menu-family-bar";
import type { MenuCategoryDto, MenuItemDto } from "@/components/menu/menu-types";
import type { MenuFamilyId } from "@/components/menu/menu-groups";
import { useOwnerLogout } from "@/components/menu/owner-gate";

type DishFormState = {
  name: string;
  description: string;
  price: string;
  priceVerre: string;
  priceQuart: string;
  priceDemi: string;
  priceBouteille: string;
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
};

const fieldClass =
  "h-10 w-full rounded-lg border border-[#D9CFB8] bg-[#FBF8F1] px-2.5 text-base outline-none focus:border-[#1E3A2F]/40";

function comingSoon() {
  toast.message("Impression et QR code : prochaine étape.");
}

export function MenuAdminApp() {
  const logout = useOwnerLogout();
  const [view, setView] = useState<AdminView>("edit");
  const [categories, setCategories] = useState<MenuCategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [familyId, setFamilyId] = useState<MenuFamilyId>("all");
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItemDto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<DishFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<MenuItemDto | null>(null);
  const [deleting, setDeleting] = useState(false);
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
    setIsCreating(true);
    setForm(emptyForm);
  }

  function openEdit(item: MenuItemDto) {
    setIsCreating(false);
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description ?? "",
      price: normalizeStoredPrice(item.price) ?? item.price,
      priceVerre: normalizeStoredPrice(item.priceVerre ?? "") ?? "",
      priceQuart: normalizeStoredPrice(item.priceQuart ?? "") ?? "",
      priceDemi: normalizeStoredPrice(item.priceDemi ?? "") ?? "",
      priceBouteille: normalizeStoredPrice(item.priceBouteille ?? "") ?? "",
    });
  }

  function closeForm() {
    setIsCreating(false);
    setEditingItem(null);
    setForm(emptyForm);
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
          }
        : {
            name,
            description: form.description,
            price,
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

  const formOpen = isCreating || editingItem !== null;

  return (
    <div className="menu-admin-root flex min-h-dvh flex-1 flex-col bg-[#F7F2E7] text-[#1B1E19]">
      <header className="menu-admin-chrome shrink-0 bg-[#1E3A2F] text-[#FBF8F1]">
        <div className="flex items-center justify-between gap-3 px-5 py-3.5">
          <div className="flex min-w-0 items-baseline gap-2.5">
            <span className="font-[family-name:var(--font-cormorant)] text-[22px] tracking-wide">
              Le Menu
            </span>
            <span className="hidden text-xs tracking-wide text-[#D8B871] sm:inline">
              espace admin
            </span>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex rounded-lg bg-black/20 p-1">
              <button
                type="button"
                onClick={() => setView("edit")}
                className={`rounded-md px-3.5 py-2 text-sm transition ${
                  view === "edit"
                    ? "bg-[#B68A3D] font-semibold text-[#1E3A2F]"
                    : "text-[#FBF8F1] hover:bg-white/10"
                }`}
              >
                Éditer le menu
              </button>
              <button
                type="button"
                onClick={() => setView("preview")}
                className={`rounded-md px-3.5 py-2 text-sm transition ${
                  view === "preview"
                    ? "bg-[#B68A3D] font-semibold text-[#1E3A2F]"
                    : "text-[#FBF8F1] hover:bg-white/10"
                }`}
              >
                Aperçu / menu digital
              </button>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#D8B871]/70 px-3 py-2 text-[13px] text-[#FBF8F1] transition hover:bg-white/10"
              onClick={comingSoon}
            >
              <Printer className="size-3.5" />
              Imprimer
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#B68A3D] px-3 py-2 text-[13px] font-semibold text-[#1E3A2F] transition hover:bg-[#D8B871]"
              onClick={comingSoon}
            >
              <QrCode className="size-3.5" />
              QR code
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#D8B871]/50 bg-transparent px-3 py-2 text-[13px] text-[#FBF8F1] hover:bg-white/10"
              onClick={logout}
            >
              <LogOut className="size-4" />
              Quitter
            </button>
          </div>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-md hover:bg-white/10 lg:hidden"
            aria-label={navOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={navOpen}
            onClick={() => setNavOpen((open) => !open)}
          >
            {navOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {navOpen ? (
          <div className="space-y-3 border-t border-white/10 px-4 py-3 lg:hidden">
            <div className="flex rounded-lg bg-black/20 p-1">
              <button
                type="button"
                onClick={() => {
                  setView("edit");
                  setNavOpen(false);
                }}
                className={`flex-1 rounded-md px-3 py-2 text-sm transition ${
                  view === "edit"
                    ? "bg-[#B68A3D] font-semibold text-[#1E3A2F]"
                    : "text-[#FBF8F1]"
                }`}
              >
                Éditer
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("preview");
                  setNavOpen(false);
                }}
                className={`flex-1 rounded-md px-3 py-2 text-sm transition ${
                  view === "preview"
                    ? "bg-[#B68A3D] font-semibold text-[#1E3A2F]"
                    : "text-[#FBF8F1]"
                }`}
              >
                Aperçu
              </button>
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[#D8B871]/70 px-3 py-2.5 text-[13px]"
              onClick={() => {
                setNavOpen(false);
                comingSoon();
              }}
            >
              <Printer className="size-3.5" />
              Imprimer
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1.5 rounded-md bg-[#B68A3D] px-3 py-2.5 text-[13px] font-semibold text-[#1E3A2F]"
              onClick={() => {
                setNavOpen(false);
                comingSoon();
              }}
            >
              <QrCode className="size-3.5" />
              QR code
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[#D8B871]/50 px-3 py-2.5 text-[13px]"
              onClick={logout}
            >
              <LogOut className="size-4" />
              Quitter
            </button>
          </div>
        ) : null}
      </header>

      {view === "edit" ? (
        <div className="flex min-h-0 flex-1 flex-col bg-[#F4F1EA]">
          <div className="menu-admin-chrome sticky top-0 z-20 shrink-0 border-b border-[#e4dfd4] bg-[#F4F1EA]/95 px-4 py-3 backdrop-blur-sm sm:px-6">
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
                fadeFromClass="from-[#F4F1EA]"
              />
            </div>
          </div>

          <section className="overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
            {loading ? (
              <p className="text-sm text-[#6b6a5f]">Chargement…</p>
            ) : (
              <div className="mx-auto w-full min-w-0 max-w-2xl">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-[family-name:var(--font-cormorant)] text-[28px] font-bold italic text-[#8F6A24]">
                    {selectedCategory?.name ?? "Aucune catégorie"}
                  </h2>
                  <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#B68A3D] px-4 py-2.5 text-[13.5px] font-semibold text-[#1E3A2F] transition hover:bg-[#D8B871]"
                  >
                    <Plus className="size-4" />
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
                      <div className="space-y-3">
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
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#F4F1EA]">
          <DigitalMenu categories={categories} />
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
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Ex. Filet de bœuf"
                  className={fieldClass}
                />
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
                  className="min-h-[60px] w-full rounded-lg border border-[#D9CFB8] bg-[#FBF8F1] px-2.5 py-2 text-base outline-none focus:border-[#1E3A2F]/40"
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
                className="rounded-md bg-[#1E3A2F] px-4 py-2 text-[13.5px] font-semibold text-[#FBF8F1] hover:bg-[#2C5142] disabled:opacity-60"
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
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
            <p className="mt-2 font-[family-name:var(--font-cormorant)] text-[20px] leading-snug italic text-[#8F6A24]">
              {pendingDelete.name}
            </p>
            <p
              id="delete-dish-copy"
              className="mt-3 text-[13.5px] leading-relaxed text-[#6b6a5f]"
            >
              Cette action est définitive. Il disparaîtra de la carte digitale.
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
      className="flex min-w-0 flex-col gap-1.5 rounded-[10px] border border-[#D9CFB8] bg-white px-4 py-3.5"
    >
      <div className="flex min-w-0 items-start gap-2.5">
        <button
          type="button"
          className="mt-0.5 shrink-0 cursor-grab touch-none rounded-md border border-[#D9CFB8] bg-white p-1.5 text-[#8a8578] hover:border-[#1E3A2F]/30 hover:text-[#1E3A2F] active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Déplacer le plat"
          disabled={disabled}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 break-words font-[family-name:var(--font-cormorant)] text-[19px] font-semibold leading-snug">
            <DishTitle name={item.name} emoji={item.emoji} />
          </h3>
          <span className="shrink-0 font-semibold text-[#1E3A2F]">
            {item.price} €
          </span>
        </div>
      </div>
      {item.priceVerre ||
      item.priceQuart ||
      item.priceDemi ||
      item.priceBouteille ? (
        <p className="pl-[42px] text-[12px] text-[#6b6a5f]">
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
        <p className="w-full break-words pl-[42px] text-sm leading-snug text-[#6b6a5f]">
          {item.description}
        </p>
      ) : null}
      <div className="mt-2 flex justify-end gap-2 border-t border-[#EFE8DC] pt-2.5">
        <button
          type="button"
          className="rounded-md border border-[#D9CFB8] bg-[#FBF8F1] px-3 py-1.5 text-[13px] font-semibold text-[#1E3A2F] transition hover:border-[#1E3A2F]/35 hover:bg-white"
          onClick={onEdit}
        >
          Modifier
        </button>
        <button
          type="button"
          className="rounded-md border border-[#E0B4B0] bg-[#F8EEEE] px-3 py-1.5 text-[13px] font-semibold text-[#6E2A2A] transition hover:bg-[#F3E0DE]"
          onClick={onDelete}
        >
          Supprimer
        </button>
      </div>
    </article>
  );
}
