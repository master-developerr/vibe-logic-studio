import { Search, SlidersHorizontal } from "lucide-react";

import { courseCategories } from "@/lib/course-data";

type MarketplaceFiltersProps = {
  category: string;
  query: string;
};

export function MarketplaceFilters({ category, query }: MarketplaceFiltersProps) {
  return (
    <div className="relative p-1.5 rounded-full ring-1 ring-border/50 bg-surface/40 shadow-sm backdrop-blur-xl mx-auto w-full max-w-4xl transition-shadow duration-500 hover:shadow-md">
      <form action="/marketplace" className="flex flex-col md:flex-row items-center gap-2 rounded-[calc(9999px-0.375rem)] bg-surface px-2 py-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full flex items-center h-12 rounded-full bg-background/50 px-4 focus-within:bg-background focus-within:ring-1 focus-within:ring-primary transition-all duration-300">
          <Search aria-hidden="true" className="size-4 text-text-muted shrink-0" strokeWidth={2} />
          <input 
            className="w-full bg-transparent px-3 text-sm font-medium text-text-primary outline-none placeholder:text-text-muted/70" 
            defaultValue={query} 
            name="q" 
            placeholder="Search for courses..." 
            type="search" 
          />
        </div>

        <div className="h-8 w-px bg-border/50 hidden md:block" />

        {/* Category Select */}
        <div className="relative w-full md:w-56 h-12 flex items-center rounded-full bg-background/50 focus-within:bg-background focus-within:ring-1 focus-within:ring-primary transition-all duration-300">
          <SlidersHorizontal aria-hidden="true" className="absolute left-4 size-4 text-text-muted pointer-events-none" strokeWidth={2} />
          <select 
            className="w-full h-full appearance-none bg-transparent pl-11 pr-10 text-sm font-medium text-text-primary outline-none cursor-pointer" 
            defaultValue={category} 
            name="category"
          >
            {courseCategories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4">
            <svg className="size-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          className="h-12 w-full md:w-auto rounded-full bg-ink px-8 text-sm font-semibold text-surface transition-transform duration-300 ease-[var(--ease-out)] active:scale-[0.97]" 
          type="submit"
        >
          Apply
        </button>
      </form>
    </div>
  );
}
