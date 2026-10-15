import type { MenuCategoryDto, MenuItemDto } from "@/components/menu/menu-types";
import { isListedOnMenu } from "@/components/menu/menu-types";
import { isPrintFooterDish } from "@/components/menu/print-notes";

export type PrintPageSection = {
  categoryId: string;
  categoryName: string;
  continuation: boolean;
  items: MenuItemDto[];
  height?: number;
};

export type PrintPageSlice = {
  page: number;
  isCover: boolean;
  sections: PrintPageSection[];
  tight?: boolean;
};

type PageDraft = PrintPageSlice & { used: number };

function mergeSections(target: PrintPageSection[], extra: PrintPageSection[]) {
  for (const section of extra) {
    const last = target[target.length - 1];
    if (last && last.categoryId === section.categoryId) {
      last.items.push(...section.items);
    } else {
      target.push(section);
    }
  }
}

/** Recolle une dernière page trop vide, seulement si elle tient vraiment. */
function absorbSparseTail(pages: PageDraft[], pageHeightPx: number) {
  const minFill = pageHeightPx * 0.42;

  while (pages.length >= 2) {
    const last = pages[pages.length - 1];
    const prev = pages[pages.length - 2];
    if (last.isCover || prev.isCover) break;
    if (last.used >= minFill) break;
    if (prev.used + last.used > pageHeightPx) break;
    mergeSections(prev.sections, last.sections);
    prev.used += last.used;
    pages.pop();
  }

  pages.forEach((page, index) => {
    page.page = index + 1;
  });
}

function renumberPages(pages: PageDraft[]) {
  pages.forEach((page, index) => {
    page.page = index + 1;
  });
}

function normalizeCategoryName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

function matchesCategory(name: string, expected: string): boolean {
  return normalizeCategoryName(name) === normalizeCategoryName(expected);
}

function takeNamedSection(
  page: PageDraft,
  name: string,
): PrintPageSection | null {
  const index = page.sections.findIndex((section) =>
    matchesCategory(section.categoryName, name),
  );
  if (index < 0) return null;
  const [section] = page.sections.splice(index, 1);
  return section ?? null;
}

const KEEP_TOGETHER_PAIRS: [string, string][] = [
  ["Apéritifs", "Sans alcool"],
  ["Nos Entrées", "Nos Viandes"],
  ["Nos Pâtes", "Pâtes fraîches"],
  ["Sélection cave", "Spumante"],
];

function partnerOf(name: string): string | null {
  for (const [left, right] of KEEP_TOGETHER_PAIRS) {
    if (matchesCategory(name, left)) return right;
    if (matchesCategory(name, right)) return left;
  }
  return null;
}

function keepPairsTogether(pages: PageDraft[]) {
  for (const [firstName, secondName] of KEEP_TOGETHER_PAIRS) {
    let firstPage = -1;
    let secondPage = -1;
    for (let index = 0; index < pages.length; index += 1) {
      const names = pages[index]?.sections.map((section) => section.categoryName) ?? [];
      if (firstPage < 0 && names.some((name) => matchesCategory(name, firstName))) {
        firstPage = index;
      }
      if (secondPage < 0 && names.some((name) => matchesCategory(name, secondName))) {
        secondPage = index;
      }
    }
    if (firstPage < 0 || secondPage < 0 || firstPage === secondPage) continue;
    const section = takeNamedSection(pages[secondPage]!, secondName);
    if (!section) continue;
    pages[firstPage]?.sections.push(section);
    if (pages[secondPage]?.sections.length === 0) {
      pages.splice(secondPage, 1);
    }
  }
}

const WINE_CATEGORY_NAMES = new Set([
  "Vins blancs",
  "Vins rosés",
  "Vins rouges",
  "Sélection cave",
]);

const DOPO_CATEGORY_NAMES = new Set(["Cafés, Infusions", "Digestifs"]);

function lastPageWith(pages: PageDraft[], names: Set<string>): number {
  for (let index = pages.length - 1; index >= 0; index -= 1) {
    if (
      pages[index]?.sections.some((section) =>
        [...names].some((name) => matchesCategory(section.categoryName, name)),
      )
    ) {
      return index;
    }
  }
  return -1;
}

/** Never leave a tiny category (Spumante, 2 lines) alone on a full page. */
function glueOntoPreviousIfAlone(pages: PageDraft[], categoryName: string) {
  for (let index = pages.length - 1; index >= 1; index -= 1) {
    const page = pages[index];
    if (!page?.sections.length) continue;
    const lonely = page.sections.every((section) =>
      matchesCategory(section.categoryName, categoryName),
    );
    if (!lonely) continue;
    pages[index - 1]!.sections.push(...page.sections);
    pages.splice(index, 1);
  }
}

function moveSectionToPage(
  pages: PageDraft[],
  name: string,
  targetIndex: number,
) {
  const sourceIndex = pages.findIndex((page) =>
    page.sections.some((section) => section.categoryName === name),
  );
  if (sourceIndex < 0 || sourceIndex === targetIndex || targetIndex < 0) return;
  const section = takeNamedSection(pages[sourceIndex]!, name);
  if (!section) return;
  pages[targetIndex]?.sections.push(section);
  if (pages[sourceIndex]?.sections.length === 0) {
    pages.splice(sourceIndex, 1);
  }
}

function pullOntoPreviousPage(pages: PageDraft[], name: string) {
  const index = pages.findIndex((page) =>
    page.sections.some((section) => section.categoryName === name),
  );
  if (index <= 0) return;
  moveSectionToPage(pages, name, index - 1);
}

/** Soft drinks with aperitifs, meats with starters; Spumante stays with the wines. */
function applyPrintPreferences(pages: PageDraft[], pageHeightPx: number) {
  keepPairsTogether(pages);

  const winePage = lastPageWith(pages, WINE_CATEGORY_NAMES);
  const spumantePage = pages.findIndex((page) =>
    page.sections.some((section) =>
      matchesCategory(section.categoryName, "Spumante"),
    ),
  );
  if (spumantePage >= 0) {
    const target =
      winePage >= 0 && winePage !== spumantePage ? winePage : spumantePage - 1;
    if (target >= 0) moveSectionToPage(pages, "Spumante", target);
  }
  glueOntoPreviousIfAlone(pages, "Spumante");

  const cafePage = lastPageWith(pages, new Set(["Cafés, Infusions"]));
  const digestifPage = pages.findIndex((page) =>
    page.sections.some((section) => section.categoryName === "Digestifs"),
  );
  if (cafePage >= 0 && digestifPage > cafePage) {
    moveSectionToPage(pages, "Digestifs", cafePage);
  } else if (digestifPage > 0 && cafePage < 0) {
    pullOntoPreviousPage(pages, "Digestifs");
  }

  const last = pages[pages.length - 1];
  if (
    pages.length >= 2 &&
    last &&
    last.sections.length > 0 &&
    last.sections.every((section) => DOPO_CATEGORY_NAMES.has(section.categoryName))
  ) {
    const prev = pages[pages.length - 2]!;
    prev.sections.push(...last.sections);
    pages.pop();
  }

  for (const page of pages) {
    page.used = page.sections.reduce(
      (sum, section) => sum + (section.height ?? 0),
      0,
    );
    page.tight = page.used > pageHeightPx;
  }

  renumberPages(pages);
}

const HASH_STORAGE_KEY = "grappa-menu-print-page-hashes";

export function hashPrintSlice(slice: PrintPageSlice): string {
  if (slice.isCover) return "cover:v6-logo";
  return slice.sections
    .map((section) =>
      [
        section.categoryId,
        section.continuation ? "cont" : "start",
        ...section.items.map((item) =>
          [
            item.id,
            item.name,
            item.price,
            item.priceVerre ?? "",
            item.priceQuart ?? "",
            item.priceDemi ?? "",
            item.priceBouteille ?? "",
            item.emoji ?? "",
            item.description ?? "",
            item.isAvailable ? "1" : "0",
          ].join(":"),
        ),
      ].join("|"),
    )
    .join("/");
}

export function loadLastPrintHashes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(HASH_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

export function rememberPrintedPages(
  allSlices: PrintPageSlice[],
  printedPages: number[],
) {
  const printAll = printedPages.length === allSlices.length;
  const next: Record<string, string> = printAll ? {} : { ...loadLastPrintHashes() };
  const source = printAll
    ? allSlices
    : allSlices.filter((slice) => printedPages.includes(slice.page));
  for (const slice of source) {
    next[String(slice.page)] = hashPrintSlice(slice);
  }
  localStorage.setItem(HASH_STORAGE_KEY, JSON.stringify(next));
}

export function modifiedPrintPages(
  slices: PrintPageSlice[],
  previous: Record<string, string>,
): number[] {
  const previousPages = Object.keys(previous);
  if (previousPages.length === 0) {
    return slices.map((slice) => slice.page);
  }

  return slices
    .filter((slice) => previous[String(slice.page)] !== hashPrintSlice(slice))
    .map((slice) => slice.page);
}

export function pagePreviewLabel(slice: PrintPageSlice): string {
  if (slice.isCover) return "Page d’entrée";
  const names = slice.sections.map((section) => section.categoryName);
  return names.join(" · ");
}

/** Si la mesure DOM a loupé un plat, on le recolle sur la dernière page. */
export function appendMissingPrintItems(
  slices: PrintPageSlice[],
  categories: MenuCategoryDto[],
): PrintPageSlice[] {
  const included = new Set(
    slices.flatMap((slice) =>
      slice.sections.flatMap((section) => section.items.map((item) => item.id)),
    ),
  );

  const missingByCategory = new Map<string, PrintPageSection>();
  for (const category of categories) {
    for (const item of category.items) {
      if (
        !isListedOnMenu(item) ||
        included.has(item.id) ||
        isPrintFooterDish(item.name)
      ) {
        continue;
      }
      const current = missingByCategory.get(category.id);
      if (current) {
        current.items.push(item);
      } else {
        missingByCategory.set(category.id, {
          categoryId: category.id,
          categoryName: category.name,
          continuation: slices.some((slice) =>
            slice.sections.some((section) => section.categoryId === category.id),
          ),
          items: [item],
        });
      }
    }
  }

  if (missingByCategory.size === 0) return slices;

  const extra = [...missingByCategory.values()];
  const lastContent = [...slices].reverse().find((slice) => !slice.isCover);
  if (lastContent) {
    return slices.map((slice) =>
      slice.page === lastContent.page
        ? { ...slice, sections: [...slice.sections, ...extra] }
        : slice,
    );
  }

  const page = slices.length + 1;
  return [
    ...slices,
    { page, isCover: false, sections: extra },
  ];
}

export function slicePrintPagesFromDom(
  root: HTMLElement,
  pageHeightPx: number,
  categories: MenuCategoryDto[],
): PrintPageSlice[] {
  const itemsById = new Map<string, MenuItemDto>();
  const namesById = new Map<string, string>();
  for (const category of categories) {
    namesById.set(category.id, category.name);
    for (const item of category.items) {
      itemsById.set(item.id, item);
    }
  }

  const pages: PageDraft[] = [];
  let pageNum = 1;
  let used = 0;
  let sections: PrintPageSection[] = [];

  function pageLimit(): number {
    return pageHeightPx;
  }

  function flush() {
    if (sections.length === 0) return;
    pages.push({
      page: pageNum,
      isCover: false,
      sections,
      used,
      tight: false,
    });
    pageNum += 1;
    sections = [];
    used = 0;
  }

  const categoryEls = root.querySelectorAll<HTMLElement>(".menu-cat");
  for (const categoryEl of categoryEls) {
    const categoryId = categoryEl.dataset.categoryId;
    if (!categoryId) continue;
    const categoryName =
      namesById.get(categoryId) ??
      categoryEl.querySelector(".menu-cat-title")?.textContent?.trim() ??
      "";
    const items = [...categoryEl.querySelectorAll<HTMLElement>("[data-item-id]")]
      .map((block) => itemsById.get(block.dataset.itemId ?? ""))
      .filter((item): item is MenuItemDto => Boolean(item));
    if (items.length === 0) continue;

    const marginBottom = Number.parseFloat(
      window.getComputedStyle(categoryEl).marginBottom,
    ) || 0;
    const height = categoryEl.offsetHeight + marginBottom;
    const lastName = sections[sections.length - 1]?.categoryName;
    const keepWithPrevious = Boolean(
      lastName &&
        (partnerOf(lastName) === categoryName ||
          matchesCategory(categoryName, "Spumante")),
    );
    if (used > 0 && used + height > pageLimit() && !keepWithPrevious) {
      flush();
    }

    sections.push({
      categoryId,
      categoryName,
      continuation: false,
      items,
      height,
    });
    used += height;

    if (used > pageLimit() && sections.length === 1) {
      flush();
    }
  }

  flush();
  absorbSparseTail(pages, pageHeightPx);
  applyPrintPreferences(pages, pageHeightPx);
  return pages.map(({ page, isCover, sections, tight }) => ({
    page,
    isCover,
    sections,
    tight,
  }));
}
