'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function SortSelector({ current }: { current?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort" className="text-sm text-mid-grey">Sort by:</label>
      <select
        id="sort"
        className="border border-light-grey bg-white text-ink-black text-sm p-2"
        value={current || ''}
        onChange={handleChange}
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}
