'use client';

import Link from "next/link";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useState, useEffect } from "react";

export function Navbar() {
  const { items, openCart } = useCartStore();
  const itemCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Prevent hydration mismatch on badge counter
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/90 backdrop-blur-md shadow-[0px_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between px-4 md:px-8">
        <Link href="/" className="text-xl font-serif font-bold text-ink-black uppercase">
          FNF CLOTHING
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8">
          {[['KIDS','kids'],['MEN','men'],['WOMEN','women'],['SALE','sale']].map(([label, cat]) => (
            <Link key={cat} href={`/shop?category=${cat}`}
              className="text-sm font-sans font-semibold text-ink-black uppercase tracking-widest hover:text-brand-gold transition-colors">
              {label}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-2">
          <button aria-label="Cart" onClick={openCart} className="p-2 relative block">
            <ShoppingCart className="h-5 w-5 text-ink-black transition-transform hover:scale-110" />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 bg-brand-gold text-white text-[10px] font-bold">
                {itemCount}
              </span>
            )}
          </button>
          <button aria-label="Menu" onClick={() => setMobileOpen(true)} className="p-2 md:hidden">
            <Menu className="h-5 w-5 text-ink-black" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 h-20 border-b border-light-grey">
            <Link href="/" onClick={() => setMobileOpen(false)}
              className="text-xl font-serif font-bold text-ink-black uppercase">
              FNF CLOTHING
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-2">
              <X className="h-5 w-5 text-ink-black" />
            </button>
          </div>
          <div className="flex flex-col px-6 py-8 space-y-6">
            {[['KIDS','kids'],['MEN','men'],['WOMEN','women'],['SALE','sale']].map(([label, cat]) => (
              <Link key={cat} href={`/shop?category=${cat}`}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-serif font-bold text-ink-black hover:text-brand-gold transition-colors">
                {label}
              </Link>
            ))}
            <Link href="/" onClick={() => setMobileOpen(false)}
              className="text-sm font-sans text-mid-grey uppercase tracking-widest hover:text-ink-black transition-colors mt-4">
              ? Home
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
