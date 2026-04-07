'use client';

import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
    const { items, removeItem, updateQuantity } = useCartStore();
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 min-h-screen">
            <h1 className="text-4xl font-serif font-bold text-ink-black mb-8">Your Cart</h1>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-mid-grey">
                    <p className="font-sans text-lg mb-4">Your cart is empty.</p>
                    <Link href="/shop">
                        <button className="bg-ink-black text-white px-8 py-4 uppercase text-sm font-semibold tracking-widest hover:bg-charcoal transition-colors">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items List */}
                    <div className="flex-1">
                        <ul className="divide-y divide-light-grey border-t border-light-grey">
                            {items.map((item) => (
                                <li key={`${item.product_id}-${item.size}`} className="flex gap-6 py-8">
                                    <div className="relative w-24 h-32 flex-shrink-0 bg-pale-grey">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between">
                                            <div>
                                                <Link href={`/shop/${item.slug}`} className="font-serif text-lg font-semibold text-ink-black hover:text-brand-gold transition-colors">
                                                    {item.name}
                                                </Link>
                                                <p className="text-sm text-mid-grey font-sans mt-1">Size: {item.size}</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.product_id, item.size)}
                                                className="text-mid-grey hover:text-alert-red transition-colors p-2"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border border-light-grey">
                                                <button
                                                    onClick={() => updateQuantity(item.product_id, item.size, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-ink-black hover:bg-pale-grey transition-colors font-sans text-lg"
                                                >
                                                    −
                                                </button>
                                                <span className="w-10 h-10 flex items-center justify-center font-mono text-sm text-ink-black border-x border-light-grey">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.product_id, item.size, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-ink-black hover:bg-pale-grey transition-colors font-sans text-lg"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="font-mono text-lg font-semibold text-ink-black">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-96">
                        <div className="bg-off-white p-8">
                            <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-ink-black mb-6">Order Summary</h2>
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-sans text-sm text-mid-grey">Subtotal ({itemCount} items)</span>
                                <span className="font-mono text-base text-ink-black">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-6 pb-6 border-b border-light-grey">
                                <span className="font-sans text-sm text-mid-grey">Delivery</span>
                                <span className="font-sans text-sm text-ink-black italic">Calculated at next step</span>
                            </div>
                            <div className="flex justify-between items-center mb-8">
                                <span className="font-sans text-base font-semibold uppercase tracking-widest text-ink-black">Total</span>
                                <span className="font-mono text-2xl font-bold text-ink-black">{formatPrice(subtotal)}</span>
                            </div>
                            <Link href="/checkout" className="block w-full">
                                <button className="w-full bg-ink-black text-white py-4 text-sm font-sans font-semibold uppercase tracking-widest hover:bg-charcoal transition-colors">
                                    Proceed to Checkout
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
