'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UploadCloud, X, ArrowLeft, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);
    
    // Form State
    const [name, setName] = useState('');
    const [category, setCategory] = useState<'KIDS' | 'WOMEN' | 'MEN'>('KIDS');
    const [subcategory, setSubcategory] = useState('Shirts');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [isSale, setIsSale] = useState(false);
    const [salePrice, setSalePrice] = useState('');
    const [inStock, setInStock] = useState(true);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    
    // Image Upload State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Size arrays from PRD
    const kidsSizes = ["0-3M", "3-6M", "6-9M", "9-12M", "12-18M", "18-24M", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y", "7-8Y", "8-9Y", "9-10Y", "10-11Y", "11-12Y", "13Y", "14Y", "15Y", "16Y", "17Y", "18Y"];
    const womensSizes = ["UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "UK 18", "UK 20"];
    const mensSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

    const toggleSize = (size: string) => {
        setSelectedSizes(prev => 
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handlePublish = async () => {
        if (!name || !price || !imageFile || selectedSizes.length === 0) {
            alert('Please fill out all required fields: Name, Price, Image, and at least one Size.');
            return;
        }

        setIsLoading(true);
        try {
            // 1. Upload Image to Supabase Storage
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, imageFile);

            if (uploadError) throw new Error('Image upload failed: ' + uploadError.message);

            const { data: publicUrlData } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);

            const imageUrl = publicUrlData.publicUrl;

            // 2. Insert Product
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
            const { data: productData, error: productError } = await supabase
                .from('products')
                .insert({
                    name,
                    slug,
                    description: description || 'No description provided.',
                    category,
                    subcategory,
                    price: parseFloat(price),
                    sale_price: isSale && salePrice ? parseFloat(salePrice) : null,
                    in_stock: inStock
                })
                .select()
                .single();

            if (productError) throw new Error('Failed to create product: ' + productError.message);
            const productId = productData.id;

            // 3. Insert Image Record
            const { error: imageRecordError } = await supabase
                .from('product_images')
                .insert({
                    product_id: productId,
                    image_url: imageUrl,
                    display_order: 0
                });
            if (imageRecordError) console.error("Image record insert error:", imageRecordError);

            // 4. Insert Sizes
            const sizeInserts = selectedSizes.map(size => ({
                product_id: productId,
                size: size,
                in_stock: true
            }));
            const { error: sizesError } = await supabase
                .from('product_sizes')
                .insert(sizeInserts);
                
            if (sizesError) throw new Error('Failed to insert sizes: ' + sizesError.message);

            alert('Product published successfully!');
            router.push('/admin/products');

        } catch (error: any) {
            console.error('Publish error:', error);
            alert(error.message || 'An error occurred during publishing.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 pb-32">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-2 border border-light-grey hover:bg-white bg-[#F5F5F5] transition-colors rounded-sm">
                    <ArrowLeft className="h-4 w-4 text-ink-black" />
                </Link>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-ink-black">Add New Product</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Fields */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white p-6 border border-light-grey shadow-sm">
                        <h2 className="text-xs font-sans uppercase tracking-widest text-ink-black font-semibold mb-6">Basic Information</h2>
                        <div className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-sans uppercase tracking-widest text-mid-grey">Product Name *</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Linen Blend Set" className="w-full border-b border-light-grey focus:border-ink-black py-2 outline-none font-sans text-sm transition-colors" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-sans uppercase tracking-widest text-mid-grey">Category *</label>
                                    <select 
                                        className="w-full border-b border-light-grey focus:border-ink-black py-2 outline-none font-sans text-sm transition-colors bg-white"
                                        value={category}
                                        onChange={(e) => {
                                            setCategory(e.target.value as 'KIDS' | 'WOMEN' | 'MEN');
                                            setSelectedSizes([]); // Reset sizes on category change
                                        }}
                                    >
                                        <option value="KIDS">Kids</option>
                                        <option value="WOMEN">Women</option>
                                        <option value="MEN">Men</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-sans uppercase tracking-widest text-mid-grey">Subcategory *</label>
                                    <select value={subcategory} onChange={e => setSubcategory(e.target.value)} className="w-full border-b border-light-grey focus:border-ink-black py-2 outline-none font-sans text-sm transition-colors bg-white">
                                        <option value="Shirts">Shirts</option>
                                        <option value="Trousers">Trousers</option>
                                        <option value="Shoes">Shoes</option>
                                        <option value="Sets & Packs">Sets & Packs</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-sans uppercase tracking-widest text-mid-grey">Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Add product details, fabric info..." className="w-full border border-light-grey focus:border-ink-black p-3 outline-none font-sans text-sm transition-colors resize-none mt-1"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-white p-6 border border-light-grey shadow-sm">
                        <h2 className="text-xs font-sans uppercase tracking-widest text-ink-black font-semibold mb-6">Media *</h2>
                        
                        <label className="border-2 border-dashed border-light-grey bg-off-white hover:border-brand-gold transition-colors p-10 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden">
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            {imagePreview ? (
                                <div className="absolute inset-0">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <span className="text-white font-sans text-sm font-semibold uppercase tracking-widest">Change Image</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud className="h-8 w-8 text-mid-grey mb-3" />
                                    <p className="text-sm font-sans text-ink-black font-medium mb-1">Click to upload image</p>
                                    <p className="text-[10px] font-sans uppercase tracking-widest text-mid-grey">JPG, PNG, WEBP up to 5MB</p>
                                </>
                            )}
                        </label>
                    </div>
                </div>

                {/* Sidebar Config */}
                <div className="space-y-8">
                    {/* Pricing */}
                    <div className="bg-white p-6 border border-light-grey shadow-sm">
                        <h2 className="text-xs font-sans uppercase tracking-widest text-ink-black font-semibold mb-6">Pricing</h2>
                        <div className="space-y-5">
                            <div className="space-y-1 relative">
                                <label className="text-[10px] font-sans uppercase tracking-widest text-mid-grey">Regular Price *</label>
                                <span className="absolute left-0 bottom-[9px] text-sm font-mono text-mid-grey">₦</span>
                                <input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="w-full pl-6 border-b border-light-grey focus:border-ink-black py-2 outline-none font-mono text-sm transition-colors mt-1" />
                            </div>
                            
                            <div className="pt-4 border-t border-light-grey">
                                <label className="flex items-center gap-3 cursor-pointer mb-4">
                                    <input type="checkbox" checked={isSale} onChange={e => setIsSale(e.target.checked)} className="accent-ink-black w-4 h-4" />
                                    <span className="text-xs font-sans uppercase tracking-widest text-ink-black font-semibold">Item is on sale</span>
                                </label>
                                {isSale && (
                                    <div className="space-y-1 relative">
                                        <label className="text-[10px] font-sans uppercase tracking-widest text-mid-grey">Sale Price</label>
                                        <span className="absolute left-0 bottom-[9px] text-sm font-mono text-mid-grey">₦</span>
                                        <input type="number" min="0" value={salePrice} onChange={e => setSalePrice(e.target.value)} placeholder="0.00" className="w-full pl-6 border-b border-light-grey focus:border-ink-black py-2 outline-none font-mono text-sm transition-colors mt-1" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stock & Sizes */}
                    <div className="bg-white p-6 border border-light-grey shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xs font-sans uppercase tracking-widest text-ink-black font-semibold">Inventory & Sizes</h2>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} className="sr-only peer" />
                                <div className="w-9 h-5 bg-light-grey peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ink-black"></div>
                                <span className="ml-2 text-xs font-sans uppercase tracking-widest text-ink-black">In Stock</span>
                            </label>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-sans uppercase tracking-widest text-mid-grey block">Available Sizes *</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(category === 'KIDS' ? kidsSizes : category === 'WOMEN' ? womensSizes : mensSizes).map(size => {
                                    const isSelected = selectedSizes.includes(size);
                                    return (
                                        <button 
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`border py-2 text-[10px] font-sans transition-colors ${
                                                isSelected 
                                                ? 'border-ink-black bg-ink-black text-white' 
                                                : 'border-light-grey text-ink-black hover:border-ink-black'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedSizes.length === 0 && (
                                <p className="text-[10px] text-red-500 mt-2">Select at least one size.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-light-grey p-4 px-8 flex justify-end gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
                <button 
                    onClick={() => router.push('/admin/products')}
                    className="border border-ink-black text-ink-black px-8 py-3 text-xs font-sans font-semibold uppercase tracking-widest hover:bg-off-white transition-colors disabled:opacity-50"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button 
                    onClick={handlePublish}
                    disabled={isLoading}
                    className="bg-ink-black text-white px-8 py-3 text-xs font-sans font-semibold uppercase tracking-widest hover:bg-charcoal transition-colors flex items-center justify-center min-w-[180px] disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Publish Product'}
                </button>
            </div>
        </div>
    );
}
