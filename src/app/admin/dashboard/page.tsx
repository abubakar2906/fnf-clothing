import { Package, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
    const supabase = createClient();
    
    const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: activeProducts } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', true);
    const { count: outOfStockSizes } = await supabase.from('product_sizes').select('*', { count: 'exact', head: true }).eq('in_stock', false);

    const stats = [
        { label: 'Total Products', value: totalProducts?.toString() || '0', icon: Package },
        { label: 'Active in Store', value: activeProducts?.toString() || '0', icon: TrendingUp },
        { label: 'Low Stock Sizes', value: outOfStockSizes?.toString() || '0', icon: AlertTriangle, alert: Number(outOfStockSizes) > 0 },
        { label: 'Order Captures (30d)', value: '0', icon: Users },
    ];

    return (
        <div className="p-8">
            <header className="mb-10">
                <h1 className="text-3xl font-serif font-bold text-ink-black">Dashboard Overview</h1>
                <p className="text-sm font-sans text-mid-grey mt-1">Welcome back. Here's what's happening today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 border border-light-grey shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-sans uppercase tracking-widest text-mid-grey">{stat.label}</h3>
                            <stat.icon className={`h-5 w-5 ${stat.alert ? 'text-alert-red' : 'text-brand-gold'}`} />
                        </div>
                        <p className="text-4xl font-serif font-bold text-ink-black">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Box */}
                <div className="lg:col-span-2 bg-white border border-light-grey">
                    <div className="p-6 border-b border-light-grey flex justify-between items-center">
                        <h2 className="text-sm font-sans uppercase tracking-widest text-ink-black font-semibold">Recent Order Captures</h2>
                        <button className="text-xs font-sans text-mid-grey hover:text-ink-black underline">View All</button>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-left font-sans text-sm">
                            <thead className="bg-off-white text-xs text-mid-grey uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4 font-normal">Customer</th>
                                    <th className="px-6 py-4 font-normal">Message Sent</th>
                                    <th className="px-6 py-4 font-normal">Items</th>
                                    <th className="px-6 py-4 font-normal">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-light-grey">
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-mid-grey">
                                        No recent order captures found.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-light-grey">
                     <div className="p-6 border-b border-light-grey">
                        <h2 className="text-sm font-sans uppercase tracking-widest text-ink-black font-semibold">Quick Actions</h2>
                    </div>
                    <div className="p-6 flex flex-col gap-3">
                        <a href="/admin/products/new" className="block text-center bg-ink-black text-white py-3 text-xs font-sans uppercase tracking-widest hover:bg-charcoal transition-colors">
                            Add New Product
                        </a>
                        <button className="block text-center border border-ink-black text-ink-black py-3 text-xs font-sans uppercase tracking-widest hover:bg-off-white transition-colors">
                            Process Instagram Import
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
