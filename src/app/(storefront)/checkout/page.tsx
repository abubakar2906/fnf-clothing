'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import { Copy, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type DeliveryMethod = 'home_delivery' | 'store_pickup';
type Step = 'details' | 'preview';

export default function CheckoutPage() {
    const { items, clearCart } = useCartStore();
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    const [step, setStep] = useState<Step>('details');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('home_delivery');
    const [address, setAddress] = useState('');
    const [copied, setCopied] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const INSTAGRAM_HANDLE = 'fnf_kiddies_and_accessories';
    const STORE_ADDRESS = '123 FNF Street, Lagos, Nigeria'; // placeholder

    const orderMessage = `
Hello FNF Clothing! I'd like to place an order.

*Customer Details*
Name: ${fullName}
Phone: ${phone}
Delivery: ${deliveryMethod === 'home_delivery' ? `Home Delivery\nAddress: ${address}` : `Store Pickup\n${STORE_ADDRESS}`}

*Order Items*
${items.map((i) => `• ${i.name} (Size: ${i.size}) x${i.quantity} — ${formatPrice(i.price * i.quantity)}`).join('\n')}

*Total: ${formatPrice(subtotal)}*

Please confirm availability and payment details. Thank you!
  `.trim();

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!phone.trim()) newErrors.phone = 'Phone number is required';
        if (deliveryMethod === 'home_delivery' && !address.trim()) {
            newErrors.address = 'Delivery address is required';
        }
        if (items.length === 0) newErrors.items = 'Your cart is empty';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGenerate = () => {
        if (!validate()) return;
        setStep('preview');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(orderMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendOnInstagram = () => {
        navigator.clipboard.writeText(orderMessage);
        window.open(`https://ig.me/m/${INSTAGRAM_HANDLE}`, '_blank');
    };

    if (items.length === 0 && step === 'details') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-3xl font-serif font-bold text-ink-black mb-4">Your cart is empty</h2>
                <p className="text-mid-grey font-sans mb-8">Add some items before checking out.</p>
                <Link href="/shop">
                    <button className="bg-ink-black text-white px-8 py-4 text-sm font-sans uppercase tracking-widest hover:bg-charcoal transition-colors">
                        Browse Shop
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-serif font-bold text-ink-black">Complete Your Order</h1>
                <p className="text-mid-grey font-sans text-sm mt-2">
                    Fill in your details and we'll generate your order message for Instagram.
                </p>
            </div>

            {step === 'details' && (
                <div className="flex flex-col gap-6">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-sans uppercase tracking-widest text-ink-black">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Amara Okafor"
                            className="border-b border-light-grey focus:border-ink-black outline-none py-3 bg-transparent font-sans text-ink-black placeholder:text-light-grey transition-colors"
                        />
                        {errors.fullName && <p className="text-alert-red text-xs font-sans">{errors.fullName}</p>}
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-sans uppercase tracking-widest text-ink-black">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. 08012345678"
                            className="border-b border-light-grey focus:border-ink-black outline-none py-3 bg-transparent font-sans text-ink-black placeholder:text-light-grey transition-colors"
                        />
                        {errors.phone && <p className="text-alert-red text-xs font-sans">{errors.phone}</p>}
                    </div>

                    {/* Delivery Method */}
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-sans uppercase tracking-widest text-ink-black">Delivery Method</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Home Delivery */}
                            <button
                                onClick={() => setDeliveryMethod('home_delivery')}
                                className={`text-left p-4 border-2 transition-colors ${deliveryMethod === 'home_delivery'
                                        ? 'border-ink-black border-l-[4px] border-l-brand-gold'
                                        : 'border-light-grey hover:border-ink-black'
                                    }`}
                            >
                                <p className="text-sm font-sans font-semibold uppercase tracking-widest text-ink-black">
                                    Home Delivery
                                </p>
                                <p className="text-xs text-mid-grey font-sans mt-1">We deliver to your address</p>
                            </button>

                            {/* Store Pickup */}
                            <button
                                onClick={() => setDeliveryMethod('store_pickup')}
                                className={`text-left p-4 border-2 transition-colors ${deliveryMethod === 'store_pickup'
                                        ? 'border-ink-black border-l-[4px] border-l-brand-gold'
                                        : 'border-light-grey hover:border-ink-black'
                                    }`}
                            >
                                <p className="text-sm font-sans font-semibold uppercase tracking-widest text-ink-black">
                                    Store Pickup
                                </p>
                                <p className="text-xs text-mid-grey font-sans mt-1">{STORE_ADDRESS}</p>
                            </button>
                        </div>
                    </div>

                    {/* Address (conditional) */}
                    {deliveryMethod === 'home_delivery' && (
                        <div className="flex flex-col gap-1 transition-all duration-200">
                            <label className="text-xs font-sans uppercase tracking-widest text-ink-black">Delivery Address</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your full delivery address"
                                rows={3}
                                className="border-b border-light-grey focus:border-ink-black outline-none py-3 bg-transparent font-sans text-ink-black placeholder:text-light-grey transition-colors resize-none"
                            />
                            {errors.address && <p className="text-alert-red text-xs font-sans">{errors.address}</p>}
                        </div>
                    )}

                    {errors.items && (
                        <p className="text-alert-red text-xs font-sans">{errors.items}</p>
                    )}

                    <button
                        onClick={handleGenerate}
                        className="w-full bg-ink-black text-white py-4 text-sm font-sans font-semibold uppercase tracking-widest hover:bg-charcoal transition-colors mt-4"
                    >
                        Generate My Order Message
                    </button>
                </div>
            )}

            {step === 'preview' && (
                <div className="flex flex-col gap-6">
                    {/* Order Summary */}
                    <div className="bg-off-white border border-light-grey p-6">
                        <h2 className="text-sm font-sans font-semibold uppercase tracking-widest text-ink-black mb-4">
                            Order Summary
                        </h2>
                        <ul className="divide-y divide-light-grey">
                            {items.map((item) => (
                                <li key={`${item.product_id}-${item.size}`} className="flex justify-between py-3 text-sm font-sans">
                                    <span className="text-ink-black">
                                        {item.name} <span className="text-mid-grey">(Size: {item.size}) x{item.quantity}</span>
                                    </span>
                                    <span className="font-mono text-ink-black">{formatPrice(item.price * item.quantity)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between pt-4 border-t border-light-grey mt-2">
                            <span className="text-sm font-sans font-semibold uppercase tracking-widest text-ink-black">Total</span>
                            <span className="font-mono font-semibold text-ink-black">{formatPrice(subtotal)}</span>
                        </div>
                    </div>

                    {/* Generated Message */}
                    <div>
                        <p className="text-xs font-sans uppercase tracking-widest text-ink-black mb-2">Your Order Message</p>
                        <div className="bg-off-white border-l-2 border-l-brand-gold p-4">
                            <pre className="font-mono text-xs text-ink-black whitespace-pre-wrap leading-relaxed">
                                {orderMessage}
                            </pre>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleCopy}
                            className="w-full border border-ink-black text-ink-black py-4 text-sm font-sans font-semibold uppercase tracking-widest hover:bg-pale-grey transition-colors flex items-center justify-center gap-2"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? 'Copied!' : 'Copy Message'}
                        </button>

                        <button
                            onClick={handleSendOnInstagram}
                            className="w-full bg-brand-gold text-ink-black py-[18px] text-sm font-sans font-semibold uppercase tracking-widest hover:bg-deep-gold transition-colors flex items-center justify-center gap-2"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Send Order on Instagram
                        </button>
                    </div>

                    <p className="text-center text-xs font-serif italic text-mid-grey">
                        Your message has been copied. Paste it in the Instagram DM to complete your order.
                    </p>

                    <button
                        onClick={() => setStep('details')}
                        className="text-center text-xs font-sans underline underline-offset-2 text-mid-grey hover:text-ink-black transition-colors"
                    >
                        ← Edit Details
                    </button>
                </div>
            )}
        </div>
    );
}