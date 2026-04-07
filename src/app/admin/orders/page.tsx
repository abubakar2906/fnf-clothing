import { Search, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
    // Order captures will be stored in Supabase in a future phase.
    const orders: any[] = [];

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-ink-black">Order Captures</h1>
                <p className="text-sm font-sans text-mid-grey mt-1">Logs of customers who generated order messages before redirecting to Instagram.</p>
            </header>

            <div className="bg-white border border-light-grey shadow-sm">
                {/* Toolbar */}
                <div className="p-4 border-b border-light-grey flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative max-w-sm w-full font-sans">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mid-grey" />
                        <input
                            type="text"
                            placeholder="Search by customer name or phone..."
                            className="w-full pl-10 pr-4 py-2 border border-light-grey text-sm focus:border-ink-black outline-none placeholder:text-light-grey"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-sm whitespace-nowrap">
                        <thead className="bg-off-white text-xs text-mid-grey uppercase tracking-widest border-b border-light-grey">
                            <tr>
                                <th className="px-6 py-4 font-normal">Order ID</th>
                                <th className="px-6 py-4 font-normal">Customer</th>
                                <th className="px-6 py-4 font-normal">Delivery</th>
                                <th className="px-6 py-4 font-normal">Items</th>
                                <th className="px-6 py-4 font-normal">Total</th>
                                <th className="px-6 py-4 font-normal">Date (Pre-DM)</th>
                                <th className="px-6 py-4 font-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-grey">
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-mid-grey">
                                    No order captures found.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Mock) */}
                <div className="p-4 border-t border-light-grey flex items-center justify-between text-xs font-sans text-mid-grey">
                    <span>Showing 1 to {orders.length} of {orders.length} captures</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-light-grey hover:bg-off-white disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-light-grey hover:bg-off-white disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
