'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import clsx from "clsx";

const CATEGORIES = ["Kids", "Men", "Women"];
const SUBCATEGORIES = ["Shirts", "Trousers", "Shoes", "Pajamas", "Accessories", "Underwear", "Sets & Packs"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y", "7-8Y", "8-9Y", "9-10Y", "10-11Y", "11-12Y", "13Y", "14Y", "15Y", "16Y", "17Y", "18Y"];

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [selected, setSelected] = useState({
    category: searchParams.get("category") || "",
    subcategory: searchParams.get("subcategory") || "",
    sizes: [] as string[],
    hideSoldOut: searchParams.get("hideSoldOut") === "true",
    showSaleOnly: searchParams.get("showSaleOnly") === "true",
  });


  useEffect(() => {
    setSelected(prev => ({
      ...prev,
      category: searchParams.get("category") || "",
      subcategory: searchParams.get("subcategory") || "",
      hideSoldOut: searchParams.get("hideSoldOut") === "true",
      showSaleOnly: searchParams.get("showSaleOnly") === "true",
      // Reset sizes if we're clearing filters completely
      sizes: searchParams.toString() === "" ? [] : prev.sizes
    }));
  }, [searchParams]);

  const apply = (overrides?: Partial<typeof selected>) => {
    const next = { ...selected, ...overrides };
    setSelected(next);
    const params = new URLSearchParams();
    if (next.category) params.set("category", next.category);
    if (next.subcategory) params.set("subcategory", next.subcategory);
    if (next.hideSoldOut) params.set("hideSoldOut", "true");
    if (next.showSaleOnly) params.set("showSaleOnly", "true");
    router.push(`/shop?${params.toString()}`);
    setMobileOpen(false);
  };

  const reset = () => {
    setSelected({ category: "", subcategory: "", sizes: [], hideSoldOut: false, showSaleOnly: false });
    router.push("/shop");
    setMobileOpen(false);
  };

  const Content = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-sans font-semibold uppercase tracking-widest text-ink-black">Filters</h2>
        <button onClick={reset} className="text-xs font-sans text-mid-grey underline underline-offset-2 hover:text-ink-black transition-colors">
          Reset all
        </button>
      </div>

      <FilterSection title="Category">
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button key={cat}
              onClick={() => apply({ category: selected.category === cat.toLowerCase() ? "" : cat.toLowerCase() })}
              className={clsx(
                "w-full text-left px-3 py-2 text-sm font-sans transition-colors",
                selected.category === cat.toLowerCase()
                  ? "bg-ink-black text-white"
                  : "text-ink-black hover:bg-pale-grey"
              )}>
              {cat}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Subcategory">
        <div className="space-y-1">
          {SUBCATEGORIES.map((sub) => (
            <button key={sub}
              onClick={() => apply({ subcategory: selected.subcategory === sub.toLowerCase() ? "" : sub.toLowerCase() })}
              className={clsx(
                "w-full text-left px-3 py-2 text-sm font-sans transition-colors",
                selected.subcategory === sub.toLowerCase()
                  ? "bg-ink-black text-white"
                  : "text-ink-black hover:bg-pale-grey"
              )}>
              {sub}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button key={size}
              onClick={() => setSelected((prev) => ({
                ...prev,
                sizes: prev.sizes.includes(size)
                  ? prev.sizes.filter(s => s !== size)
                  : [...prev.sizes, size]
              }))}
              className={clsx(
                "min-w-[44px] h-10 px-3 border text-sm font-sans transition-colors",
                selected.sizes.includes(size)
                  ? "bg-ink-black text-white border-ink-black"
                  : "bg-white text-ink-black border-light-grey hover:border-ink-black"
              )}>
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <div className="space-y-3">
          {[
            { key: "hideSoldOut" as const, label: "Hide Sold Out" },
            { key: "showSaleOnly" as const, label: "Sale Items Only" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => apply({ [key]: !selected[key] })}
                className={clsx(
                  "w-10 h-5 relative flex-shrink-0 transition-colors cursor-pointer",
                  selected[key] ? "bg-ink-black" : "bg-light-grey"
                )}>
                <span className={clsx(
                  "absolute top-0.5 w-4 h-4 bg-white transition-transform",
                  selected[key] ? "translate-x-5" : "translate-x-0.5"
                )} />
              </div>
              <span className="text-sm font-sans text-ink-black">{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <button
        onClick={() => apply()}
        className="mt-6 w-full bg-ink-black text-white py-3 text-xs font-sans font-semibold uppercase tracking-widest hover:bg-charcoal transition-colors">
        Apply Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-ink-black text-white px-5 py-3 flex items-center gap-2 text-sm font-sans font-semibold uppercase tracking-widest shadow-lg">
        <SlidersHorizontal className="h-4 w-4" />
        Filter
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 w-[280px] bg-white z-50 p-6 overflow-y-auto transition-transform duration-300 ease-in-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-sans font-semibold uppercase tracking-widest">Filters</span>
          <button onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5 text-ink-black" />
          </button>
        </div>
        <Content />
      </aside>

      {/* Desktop inline */}
      <div className="hidden md:block w-full h-full bg-off-white border-r border-light-grey p-6">
        <Content />
      </div>
    </>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="mb-5 pb-5 border-b border-light-grey last:border-b-0">
      <button
        className="flex justify-between items-center w-full mb-3"
        onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-xs font-sans font-semibold uppercase tracking-widest text-ink-black">{title}</h3>
        <ChevronDown className={clsx(
          "h-4 w-4 text-mid-grey transition-transform duration-200",
          isOpen ? "rotate-0" : "-rotate-90"
        )} />
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}