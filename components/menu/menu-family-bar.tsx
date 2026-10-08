"use client";

import {
  CakeSlice,
  Coffee,
  LayoutGrid,
  Pizza,
  Utensils,
  UtensilsCrossed,
  Wine,
} from "lucide-react";

import {
  tFamily,
  tUi,
  translateCategoryChip,
  type MenuLocale,
} from "@/components/menu/i18n";
import {
  MENU_FAMILIES,
  familyForCategoryName,
  type MenuFamily,
  type MenuFamilyId,
} from "@/components/menu/menu-groups";
import type { MenuCategoryDto } from "@/components/menu/menu-types";
import { HScrollRow } from "@/components/menu/h-scroll-row";

const FAMILY_ICONS: Record<MenuFamily["id"], typeof Wine> = {
  aperitivo: Wine,
  antipasti: Utensils,
  piatti: UtensilsCrossed,
  pizzeria: Pizza,
  dolci: CakeSlice,
  dopo: Coffee,
};

type MenuFamilyBarProps = {
  familyId: MenuFamilyId;
  onFamilyChange: (id: MenuFamilyId) => void;
  subCategoryName: string | null;
  onSubCategoryChange: (name: string | null) => void;
  /** Noms de catégories présents dans le menu, pour n’afficher que l’existant */
  categoryNames: string[];
  /** En édition : pas de sous-onglet « Tout », une catégorie toujours choisie */
  showSubAllTab?: boolean;
  fadeFromClass?: string;
  locale?: MenuLocale;
  /** Admin : icônes. Public (défaut) : comme la vitrine, texte seul. */
  showIcons?: boolean;
};

export function categoriesForFamily(
  familyId: MenuFamilyId,
  categories: MenuCategoryDto[],
): MenuCategoryDto[] {
  const byName = new Map(categories.map((category) => [category.name, category]));
  const named = MENU_FAMILIES.flatMap((family) => family.categoryNames);

  if (familyId === "all") {
    const ordered = named
      .map((name) => byName.get(name))
      .filter((category): category is MenuCategoryDto => Boolean(category));
    const leftovers = categories.filter((category) => !named.includes(category.name));
    return [...ordered, ...leftovers];
  }

  const family = MENU_FAMILIES.find((item) => item.id === familyId);
  if (!family) return [];
  return family.categoryNames
    .map((name) => byName.get(name))
    .filter((category): category is MenuCategoryDto => Boolean(category));
}

export function familyIdForCategoryName(name: string): MenuFamilyId {
  return familyForCategoryName(name)?.id ?? "all";
}

export function MenuFamilyBar({
  familyId,
  onFamilyChange,
  subCategoryName,
  onSubCategoryChange,
  categoryNames,
  showSubAllTab = true,
  fadeFromClass = "from-[#F4F1EA]",
  locale = "fr",
  showIcons = false,
}: MenuFamilyBarProps) {
  const ui = tUi(locale);
  const activeFamily =
    familyId === "all"
      ? null
      : (MENU_FAMILIES.find((family) => family.id === familyId) ?? null);

  const subNames = activeFamily
    ? activeFamily.categoryNames.filter((name) => categoryNames.includes(name))
    : showSubAllTab
      ? []
      : categoryNames;

  const showSubRow = subNames.length > 0;

  const familyChips = (
    <>
      <FamilyChip
        active={familyId === "all"}
        icon={showIcons ? LayoutGrid : undefined}
        label={ui.filterAll}
        onClick={() => onFamilyChange("all")}
      />
      {MENU_FAMILIES.map((family) => {
        const labels = tFamily(locale, family.id);
        return (
          <FamilyChip
            key={family.id}
            active={familyId === family.id}
            icon={showIcons ? FAMILY_ICONS[family.id] : undefined}
            label={labels.navLabel ?? labels.label}
            title={labels.label}
            onClick={() => onFamilyChange(family.id)}
          />
        );
      })}
    </>
  );

  const subTabs = showSubRow ? (
    <>
      {showSubAllTab ? (
        <SubTab
          label={ui.filterAll}
          selected={subCategoryName === null}
          onClick={() => onSubCategoryChange(null)}
        />
      ) : null}
      {subNames.map((name) => (
        <SubTab
          key={name}
          label={translateCategoryChip(name, locale)}
          selected={subCategoryName === name}
          onClick={() => onSubCategoryChange(name)}
        />
      ))}
    </>
  ) : null;

  return (
    <div className="min-w-0">
      <HScrollRow wrapAt="never" className="gap-2 pr-10" fadeFromClass={fadeFromClass}>
        {familyChips}
      </HScrollRow>
      {showSubRow ? (
        <div className="mt-2 border-t border-[#e4dfd4] pt-1.5">
          <HScrollRow wrapAt="never" className="gap-x-1.5 pr-10" fadeFromClass={fadeFromClass}>
            {subTabs}
          </HScrollRow>
        </div>
      ) : null}
    </div>
  );
}

function FamilyChip({
  active,
  icon: Icon,
  label,
  title,
  onClick,
}: {
  active: boolean;
  icon?: typeof Wine;
  label: string;
  title?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? "border-[#1E3A2F] bg-[#1E3A2F] text-[#FBF8F1]"
          : "border-[#e4dfd4] bg-[#fbf8f1] text-[#3d3a32] hover:border-[#1E3A2F]/25"
      }`}
    >
      {Icon ? <Icon className="size-4" /> : null}
      {label}
    </button>
  );
}

function SubTab({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 border-b-2 px-3 py-1.5 text-[15px] transition ${
        selected
          ? "border-[#1E3A2F] font-semibold text-[#1E3A2F]"
          : "border-transparent text-[#6b675c] hover:text-[#1B1E19]"
      }`}
    >
      {label}
    </button>
  );
}
