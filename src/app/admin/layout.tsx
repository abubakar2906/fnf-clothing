'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    // Login page doesn't need sidebar
    if (pathname === '/admin') {
        return <>{children}</>;
    }

    const navItems = [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/products', icon: Package, label: 'Inventory' },
        { href: '/admin/orders', icon: ShoppingBag, label: 'Order Captures' },
        { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex">
            {/* Mobile header and hamburger */}
            <div className="md:hidden sticky top-0 bg-charcoal text-white p-4 flex items-center justify-between z-20 w-full">
                <h1 className="text-xl font-serif font-bold tracking-wider">FNF CLOTHING</h1>
                <button onClick={() => setMobileMenuOpen(true)} className="p-2">
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile menu drawer */}
            <div className={clsx(
                "fixed inset-y-0 left-0 w-64 bg-charcoal text-white z-30 transition-transform duration-300 ease-in-out md:hidden",
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 flex items-center justify-between">
                    <h1 className="text-xl font-serif font-bold tracking-wider">FNF CLOTHING</h1>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <nav className="flex-1 mt-8 space-y-2 px-3">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)} // Close menu on navigation
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-sans transition-colors rounded-sm ${isActive
                                        ? 'bg-ink-black text-brand-gold border-l-2 border-brand-gold'
                                        : 'text-white/70 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-6 border-t border-white/10">
                    <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-sm font-sans text-white/50 hover:text-white transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                    </Link>
                </div>
            </div>

            {/* Mobile backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar (Desktop) */}
            <aside className="w-64 bg-charcoal text-white flex flex-col hidden md:flex min-h-screen sticky top-0 z-10">
                <div className="p-6">
                    <h1 className="text-xl font-serif font-bold tracking-wider text-white">FNF CLOTHING</h1>
                    <p className="text-[10px] font-mono text-mid-grey uppercase tracking-widest mt-1">Editorial Control</p>
                </div>

                <nav className="flex-1 mt-8 space-y-2 px-3">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-sans transition-colors rounded-sm ${isActive
                                        ? 'bg-ink-black text-brand-gold border-l-2 border-brand-gold'
                                        : 'text-white/70 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/10">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 text-sm font-sans text-white/50 hover:text-white transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden relative md:ml-0">
                {children}
            </main>
        </div>
    );
}
