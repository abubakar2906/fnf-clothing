'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice, calculateSavings } from '@/lib/utils';
import { ProductCard } from '@/components/ui/ProductCard';
import { ChevronRight, Plus, Minus, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [openAccordion, setOpenAccordion] = useState<string | null>('description');
    const [addedToCart, setAddedToCart] = useState(false);

    const { addItem, openCart } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('products')
                .select(`
                    *,
                    product_images(image_url),
                    product_sizes(size, in_stock)
                `)
                .eq('slug', slug)
                .single();

            if (data) {
                const formatted = {
                    ...data,
                    images: data.product_images?.map((img: any) => img.image_url) || [],
                    sizes: data.product_sizes || []
                };
                setProduct(formatted);

                // Fetch related
                const { data: relatedData } = await supabase
                    .from('products')
                    .select(`
                        id, name, slug, price, sale_price, category, in_stock,
                        product_images(image_url),
                        product_sizes(size, in_stock)
                    `)
                    .eq('category', data.category)
                    .neq('slug', slug)
                    .limit(4);

                if (relatedData) {
                    setRelatedProducts(relatedData.map((p: any) => ({
                        ...p,
                        images: p.product_images?.map((img: any) => img.image_url) || [],
                        sizes: p.product_sizes || []
                    })));
                }
            } else {
                notFound();
            }
            setIsLoading(false);
        };
        fetchProduct();
    }, [slug]);

    if (isLoading) {
        return <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-ink-black" />
        </div>;
    }
    if (!product) return null;

    const hasSale = product.sale_price && product.sale_price < product.price;
    const displayPrice = hasSale ? product.sale_price! : product.price;

    const handleAddToCart = () => {
        if (!selectedSize) return;
        addItem({
            product_id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0],
            size: selectedSize,
            quantity,
            price: displayPrice,
        });
        setAddedToCart(true);
        openCart();
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const accordions = [
        { id: 'description', label: 'Description', content: product.description },
        { id: 'care', label: 'Material & Care', content: 'Dry clean or hand wash in cold water. Do not bleach. Iron on low heat.' },
        { id: 'shipping', label: 'Shipping & Returns', content: 'Nationwide delivery within 3–7 business days. DM us on Instagram to initiate a return within 7 days of delivery.' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="text-xs text-mid-grey mb-8 flex items-center gap-2 font-sans uppercase tracking-widest">
                <Link href="/" className="hover:text-ink-black transition-colors">Home</Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/shop" className="hover:text-ink-black transition-colors">Shop</Link>
                <ChevronRight className="h-3 w-3" />
                <Link href={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-ink-black transition-colors">
                    {product.category}
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-ink-black">{product.name}</span>
            </nav>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="flex flex-col gap-4">
                    <div className="relative aspect-[4/5] w-full bg-pale-grey overflow-hidden">
                        <Image
                            src={product.images[selectedImage]}
                            alt={product.name}
                            fill
                            priority
                            className="object-cover"
                        />
                        {hasSale && (
                            <span className="absolute top-3 left-3 bg-brand-gold text-white text-xs font-sans font-bold uppercase px-2 py-1">
                                Sale
                            </span>
                        )}
                        {!product.in_stock && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <span className="bg-light-grey text-white text-sm font-sans uppercase tracking-widest px-4 py-2">
                                    Sold Out
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                        <div className="flex gap-3">
                            {product.images.map((img: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`relative w-16 h-20 flex-shrink-0 bg-pale-grey overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-ink-black' : 'border-transparent'
                                        }`}
                                >
                                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="lg:sticky lg:top-24 flex flex-col gap-6 self-start">
                    <div>
                        <p className="text-xs font-sans uppercase tracking-widest text-mid-grey mb-1">
                            {product.category} / {product.subcategory}
                        </p>
                        <h1 className="text-4xl font-serif font-bold text-ink-black leading-tight">
                            {product.name}
                        </h1>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-2xl text-ink-black">{formatPrice(displayPrice)}</span>
                        {hasSale && (
                            <>
                                <span className="font-mono text-lg text-mid-grey line-through">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="bg-brand-gold text-white text-xs font-sans font-bold uppercase px-2 py-1">
                                    Save {calculateSavings(product.price, product.sale_price!)}%
                                </span>
                            </>
                        )}
                    </div>

                    {/* Size Selector */}
                    <div>
                        <p className="text-xs font-sans uppercase tracking-widest text-ink-black mb-3">
                            Select Size
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map(({ size, in_stock: inStock }: { size: string, in_stock: boolean }) => (
                                <button
                                    key={size}
                                    disabled={!inStock}
                                    onClick={() => setSelectedSize(size)}
                                    className={`relative min-w-[44px] h-11 px-3 border text-sm font-sans transition-colors
                    ${!inStock ? 'bg-pale-grey text-light-grey border-light-grey cursor-not-allowed' : ''}
                    ${inStock && selectedSize === size ? 'bg-ink-black text-white border-ink-black' : ''}
                    ${inStock && selectedSize !== size ? 'bg-white text-ink-black border-ink-black hover:bg-pale-grey' : ''}
                  `}
                                >
                                    {size}
                                    {!inStock && (
                                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="absolute w-full h-px bg-light-grey rotate-45" />
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        {!selectedSize && (
                            <p className="text-xs text-mid-grey font-sans mt-2">Please select a size</p>
                        )}
                    </div>

                    {/* Quantity */}
                    <div>
                        <p className="text-xs font-sans uppercase tracking-widest text-ink-black mb-3">Quantity</p>
                        <div className="flex items-center border border-light-grey w-fit">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="w-11 h-11 flex items-center justify-center hover:bg-pale-grey transition-colors"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-11 h-11 flex items-center justify-center font-mono text-sm border-x border-light-grey">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity((q) => q + 1)}
                                className="w-11 h-11 flex items-center justify-center hover:bg-pale-grey transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!product.in_stock || !selectedSize}
                        className={`w-full py-4 text-sm font-sans font-semibold uppercase tracking-widest transition-colors
              ${!product.in_stock
                                ? 'bg-light-grey text-white cursor-not-allowed'
                                : !selectedSize
                                    ? 'bg-charcoal text-white cursor-not-allowed opacity-60'
                                    : addedToCart
                                        ? 'bg-brand-gold text-white'
                                        : 'bg-ink-black text-white hover:bg-charcoal'
                            }`}
                    >
                        {!product.in_stock ? 'Sold Out' : addedToCart ? 'Added!' : 'Add to Cart'}
                    </button>

                    {/* Accordions */}
                    <div className="border-t border-light-grey">
                        {accordions.map(({ id, label, content }) => (
                            <div key={id} className="border-b border-light-grey">
                                <button
                                    onClick={() => setOpenAccordion(openAccordion === id ? null : id)}
                                    className="w-full flex justify-between items-center py-4 text-sm font-sans font-semibold uppercase tracking-widest text-ink-black"
                                >
                                    {label}
                                    <span className="text-lg">{openAccordion === id ? '−' : '+'}</span>
                                </button>
                                {openAccordion === id && (
                                    <p className="pb-4 text-sm font-sans text-mid-grey leading-relaxed">{content}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="mt-20">
                    <div className="text-center mb-10">
                        <span className="text-xs font-sans uppercase tracking-widest text-brand-gold block mb-2">More Like This</span>
                        <h2 className="text-3xl font-serif font-bold text-ink-black">You Might Also Like</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={{ ...p, image: p.images[0] }} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}