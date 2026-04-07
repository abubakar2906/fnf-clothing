import { FilterSidebar } from "@/components/ui/FilterSidebar";
import { ProductCard } from "@/components/ui/ProductCard";
import { SortSelector } from "@/components/ui/SortSelector";
import { getProducts } from "@/lib/mock-data";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from '@/lib/supabase/server';

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    sort?: string;
    hideSoldOut?: string;
    showSaleOnly?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const filters = {
    category: params.category,
    subcategory: params.subcategory,
    sort: params.sort,
    hideSoldOut: params.hideSoldOut === "true",
    showSaleOnly: params.showSaleOnly === "true",
  };

  const supabase = createClient();

  let query = supabase
    .from('products')
    .select(`
      id, name, slug, price, sale_price, category, subcategory, in_stock,
      product_images(image_url),
      product_sizes(size, in_stock)
    `);

  if (filters.category) query = query.ilike('category', filters.category);
  if (filters.subcategory) query = query.ilike('subcategory', filters.subcategory);
  if (filters.hideSoldOut) query = query.eq('in_stock', true);
  if (filters.showSaleOnly) query = query.not('sale_price', 'is', null);

  if (filters.sort === 'price-asc') query = query.order('price', { ascending: true });
  else if (filters.sort === 'price-desc') query = query.order('price', { ascending: false });
  else query = query.order('created_at', { ascending: false }); // new-in default

  const { data: rawProducts } = await query;

  const products = rawProducts?.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    sale_price: p.sale_price,
    category: p.category,
    in_stock: p.in_stock,
    images: p.product_images?.map((img: any) => img.image_url) || [],
    sizes: p.product_sizes || []
  })) || [];

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-[240px] flex-shrink-0">
        <div className="sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          <FilterSidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8">
        <nav className="text-sm text-mid-grey mb-4">
          <ol className="list-none p-0 inline-flex items-center flex-wrap gap-y-1">
            <li className="flex items-center">
              <Link href="/" className="hover:text-ink-black transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 mx-2" />
            </li>
            <li className="flex items-center">
              <Link href="/shop" className="hover:text-ink-black transition-colors">Shop</Link>
              {filters.category && <ChevronRight className="h-3 w-3 mx-2" />}
            </li>
            {filters.category && (
              <li className="text-ink-black font-medium capitalize">{filters.category}</li>
            )}
          </ol>
        </nav>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-serif font-bold text-ink-black capitalize">
            {filters.category || "All Products"} ({products.length})
          </h1>
          <SortSelector current={filters.sort} />
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24 text-mid-grey">
            <p className="font-sans text-sm">No products found matching your criteria.</p>
            <Link href="/shop" className="text-xs underline underline-offset-2 mt-4 inline-block hover:text-ink-black transition-colors">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={{ ...product, image: product.images[0] }} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter */}
      <div className="md:hidden">
        <FilterSidebar />
      </div>
    </div>
  );
}