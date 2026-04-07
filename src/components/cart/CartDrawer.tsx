'use client';

import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import { X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
                    onClick={closeCart}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-white z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-light-grey">
                    <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-ink-black">
                        Your Cart ({itemCount})
                    </h2>
                    <button
                        onClick={closeCart}
                        className="hover:rotate-90 transition-transform duration-300"
                    >
                        <X className="h-5 w-5 text-ink-black" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-mid-grey">
                            <p className="font-sans text-sm">Your cart is empty.</p>
                            <button
                                onClick={closeCart}
                                className="mt-4 text-sm underline underline-offset-2 hover:text-ink-black transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <ul className="divide-y divide-light-grey">
                            {items.map((item) => (
                                <li key={`${item.product_id}-${item.size}`} className="flex gap-4 py-5">
                                    {/* Thumbnail */}
                                    <div className="relative w-[60px] h-[75px] flex-shrink-0 bg-pale-grey">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link
                                                    href={`/shop/${item.slug}`}
                                                    onClick={closeCart}
                                                    className="font-serif text-sm font-semibold text-ink-black hover:text-brand-gold transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="text-xs text-mid-grey font-sans mt-0.5">Size: {item.size}</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.product_id, item.size)}
                                                className="text-light-grey hover:text-alert-red transition-colors ml-2"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            {/* Quantity Stepper */}
                                            <div className="flex items-center border border-light-grey">
                                                <button
                                                    onClick={() => updateQuantity(item.product_id, item.size, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-ink-black hover:bg-pale-grey transition-colors font-sans"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 h-8 flex items-center justify-center font-mono text-sm text-ink-black border-x border-light-grey">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.product_id, item.size, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-ink-black hover:bg-pale-grey transition-colors font-sans"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="font-mono text-sm text-ink-black">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="px-6 py-5 border-t border-light-grey">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-sans text-sm uppercase tracking-widest text-ink-black">Total</span>
                            <span className="font-mono text-lg font-semibold text-ink-black">{formatPrice(subtotal)}</span>
                        </div>
                        <p className="text-xs text-mid-grey font-sans italic mb-4">
                            Delivery fees calculated at checkout.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link href="/cart" onClick={closeCart}>
                                <button className="w-full border border-ink-black text-ink-black py-4 text-sm font-sans font-semibold uppercase tracking-widest hover:bg-pale-grey transition-colors">
                                    View Full Cart
                                </button>
                            </Link>
                            <Link href="/checkout" onClick={closeCart}>
                                <button className="w-full bg-ink-black text-white py-4 text-sm font-sans font-semibold uppercase tracking-widest hover:bg-charcoal transition-colors">
                                    Proceed to Checkout
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}