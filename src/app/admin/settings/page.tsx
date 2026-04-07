import { Save } from 'lucide-react';
import Image from 'next/image';

export default function AdminSettingsPage() {
    return (
        <div className="p-8 pb-32">
            <header className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-ink-black">Settings</h1>
                <p className="text-sm font-sans text-mid-grey mt-1">Configure homepage content and storefront preferences.</p>
            </header>

            <div className="max-w-4xl space-y-8">
                {/* Hero Section Config */}
                <div className="bg-white p-6 border border-light-grey shadow-sm">
                    <h2 className="text-xs font-sans uppercase tracking-widest text-ink-black font-semibold mb-6">Hero Banner</h2>
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-sans uppercase tracking-widest text-mid-grey">Main Heading</label>
                            <input 
                                type="text" 
                                defaultValue="Dress Them in the Best." 
                                className="w-full border-b border-light-grey focus:border-ink-black py-2 outline-none font-sans text-sm transition-colors" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-sans uppercase tracking-widest text-mid-grey">Subheading</label>
                            <input 
                                type="text" 
                                defaultValue="Premium fashion for kids and adults, imported directly from the UK & US." 
                                className="w-full border-b border-light-grey focus:border-ink-black py-2 outline-none font-sans text-sm transition-colors" 
                            />
                        </div>
                    </div>
                </div>

                {/* Featured Products Config */}
                <div className="bg-white p-6 border border-light-grey shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xs font-sans uppercase tracking-widest text-ink-black font-semibold">Featured Products (Max 8)</h2>
                        <span className="text-xs font-sans text-mid-grey">4 of 8 selected</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {/* Mock selected featured products */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="relative group border border-light-grey rounded-sm overflow-hidden">
                                <div className="aspect-[4/5] bg-pale-grey"></div>
                                <div className="p-2 border-t border-light-grey bg-white flex justify-between items-center">
                                    <span className="text-[10px] font-sans truncate pr-2">Product {i}</span>
                                    <button className="text-[10px] text-alert-red font-sans uppercase tracking-widest hover:underline">Remove</button>
                                </div>
                            </div>
                        ))}
                        {/* Add Slot */}
                        <div className="aspect-[4/5] border border-dashed border-light-grey bg-off-white hover:border-brand-gold transition-colors flex items-center justify-center cursor-pointer rounded-sm">
                            <span className="text-[10px] font-sans uppercase tracking-widest text-mid-grey">+ Select Product</span>
                        </div>
                    </div>
                </div>

                {/* Contact Links */}
                <div className="bg-white p-6 border border-light-grey shadow-sm">
                    <h2 className="text-xs font-sans uppercase tracking-widest text-ink-black font-semibold mb-6">Store Information</h2>
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-sans uppercase tracking-widest text-mid-grey">Store Pickup Address</label>
                            <textarea 
                                rows={2} 
                                defaultValue="123 FNF Street, Lagos, Nigeria" 
                                className="w-full border border-light-grey focus:border-ink-black p-3 outline-none font-sans text-sm transition-colors mt-1 resize-none" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-light-grey p-4 px-8 flex justify-end gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button className="bg-ink-black text-white px-8 py-3 text-xs font-sans font-semibold uppercase tracking-widest hover:bg-charcoal transition-colors flex items-center gap-2">
                    <Save className="h-4 w-4" /> Save Changes
                </button>
            </div>
        </div>
    );
}
