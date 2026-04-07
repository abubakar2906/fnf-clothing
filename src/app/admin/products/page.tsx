import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Search, Edit2 } from 'lucide-react';

export default async function AdminProductsPage() {
    const supabase = createClient();
    
    // Fetch products
    const { data: productsData } = await supabase
        .from('products')
        .select(`
            id, name, in_stock, sale_price, price, category,
            product_images(image_url),
            product_sizes(size)
        `)
        .order('created_at', { ascending: false });

    const products = productsData?.map((p: any) => ({
        ...p,
        images: p.product_images?.map((img: any) => img.image_url) || [],
        sizes: p.product_sizes || []
    })) || [];

    return (
        <div className="p-8">
            <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-ink-black">Inventory</h1>
                    <p className="text-sm font-sans text-mid-grey mt-1">Manage your storefront products.</p>
                </div>
                <Link href="/admin/products/new">
                    <button className="bg-brand-gold text-ink-black px-6 py-3 text-xs font-sans font-semibold uppercase tracking-[0.2em] hover:bg-deep-gold transition-colors flex items-center gap-2 shadow-sm">
                        <Plus className="h-4 w-4" /> Add Product
                    </button>
                </Link>
            </header>

            <div className="bg-white border border-light-grey shadow-sm">
                {/* Toolbar */}
                <div className="p-4 border-b border-light-grey flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative max-w-sm w-full font-sans">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mid-grey" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border border-light-grey text-sm focus:border-ink-black outline-none placeholder:text-light-grey"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-sm whitespace-nowrap">
                        <thead className="bg-off-white text-xs text-mid-grey uppercase tracking-widest border-b border-light-grey">
                            <tr>
                                <th className="px-6 py-4 font-normal">Product</th>
                                <th className="px-6 py-4 font-normal w-32">Status</th>
                                <th className="px-6 py-4 font-normal w-32">Price</th>
                                <th className="px-6 py-4 font-normal w-24">Category</th>
                                <th className="px-6 py-4 font-normal w-12 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-grey">
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-mid-grey font-sans">
                                        No products found in the database.
                                    </td>
                                </tr>
                            )}
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-off-white/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-16 bg-pale-grey border border-light-grey/50">
                                                {product.images[0] && (
                                                    <img src={product.images[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-ink-black">{product.name}</p>
                                                <p className="text-xs text-mid-grey mt-0.5">{product.sizes.length} sizes</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.in_stock ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-sans uppercase tracking-widest bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-sans uppercase tracking-widest bg-off-white text-mid-grey border border-light-grey">
                                                Sold Out
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-ink-black font-semibold">
                                                {formatPrice(product.sale_price || product.price)}
                                            </span>
                                            {product.sale_price && (
                                                <span className="font-mono text-[10px] text-mid-grey line-through mt-0.5">
                                                    {formatPrice(product.price)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-mid-grey uppercase tracking-widest">{product.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-mid-grey hover:text-ink-black hover:bg-pale-grey transition-colors rounded-sm">
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
