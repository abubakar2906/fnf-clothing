'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UploadCloud, X, ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';

interface ProductImage {
    id: string;
    image_url: string;
    display_order: number;
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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

    // Image Management
    const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
    const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

    // Size arrays
    const kidsSizes = ["0-3M", "3-6M", "6-9M", "9-12M", "12-18M", "18-24M", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y", "7-8Y", "8-9Y", "9-10Y", "10-11Y", "11-12Y", "13Y", "14Y", "15Y", "16Y", "17Y", "18Y"];
    const womensSizes = ["UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "UK 18", "UK 20"];
    const mensSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

    // Load product data
    useEffect(() => {
        const loadProduct = async () => {
            try {
                const { data: productData, error: productError } = await supabase
                    .from('products')
                    .select(`
                        id, name, in_stock, sale_price, price, category, subcategory, description,
                        product_images(id, image_url, display_order),
                        product_sizes(size)
                    `)
                    .eq('id', productId)
                    .single();

                if (productError) throw productError;

                setName(productData.name);
                setCategory(productData.category);
                setSubcategory(productData.subcategory || 'Shirts');
                setDescription(productData.description);
                setPrice(productData.price.toString());
                setInStock(productData.in_stock);
                
                if (productData.sale_price) {
                    setIsSale(true);
                    setSalePrice(productData.sale_price.toString());
                }

                const sortedImages = (productData.product_images || [])
                    .sort((a: ProductImage, b: ProductImage) => a.display_order - b.display_order);
                setExistingImages(sortedImages);

                const sizes = productData.product_sizes?.map((ps: any) => ps.size) || [];
                setSelectedSizes(sizes);
            } catch (error) {
                console.error('Error loading product:', error);
                alert('Failed to load product');
                router.push('/admin/products');
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) loadProduct();
    }, [productId]);

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach(file => {
                const preview = URL.createObjectURL(file);
                setNewImages(prev => [...prev, { file, preview }]);
            });
        }
    };

    const removeExistingImage = (imageId: string) => {
        setExistingImages(prev => prev.filter(img => img.id !== imageId));
        setImagesToDelete(prev => [...prev, imageId]);
    };

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!name || !price || (existingImages.length === 0 && newImages.length === 0) || selectedSizes.length === 0) {
            alert('Please fill out all required fields: Name, Price, Images, and at least one Size.');
            return;
        }

        setIsSaving(true);
        try {
            // 1. Update product basic info
            const { error: updateError } = await supabase
                .from('products')
                .update({
                    name,
                    description: description || 'No description provided.',
                    category,
                    subcategory,
                    price: parseFloat(price),
                    sale_price: isSale && salePrice ? parseFloat(salePrice) : null,
                    in_stock: inStock
                })
                .eq('id', productId);

            if (updateError) throw new Error('Failed to update product: ' + updateError.message);

            // 2. Delete removed images
            if (imagesToDelete.length > 0) {
                const { error: deleteError } = await supabase
                    .from('product_images')
                    .delete()
                    .in('id', imagesToDelete);

                if (deleteError) console.error('Error deleting images:', deleteError);
            }

            // 3. Upload new images
            for (let i = 0; i < newImages.length; i++) {
                const { file } = newImages[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, file);

                if (uploadError) throw new Error('Image upload failed: ' + uploadError.message);

                const { data: publicUrlData } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(fileName);

                const imageUrl = publicUrlData.publicUrl;
                const displayOrder = existingImages.length + i;

                const { error: imageRecordError } = await supabase
                    .from('product_images')
                    .insert({
                        product_id: productId,
                        image_url: imageUrl,
                        display_order: displayOrder
                    });

                if (imageRecordError) console.error('Error saving image record:', imageRecordError);
            }

            // 4. Update sizes - DELETE old, then INSERT new
            const { error: deleteSizesError } = await supabase
                .from('product_sizes')
                .delete()
                .eq('product_id', productId);

            if (deleteSizesError) throw new Error('Failed to delete old sizes: ' + deleteSizesError.message);

            const sizeInserts = selectedSizes.map(size => ({
                product_id: productId,
                size: size,
                in_stock: true
            }));

            const { error: insertSizesError } = await supabase
                .from('product_sizes')
                .insert(sizeInserts);

            if (insertSizesError) throw new Error('Failed to insert sizes: ' + insertSizesError.message);

            alert('Product updated successfully!');
            router.push('/admin/products');

        } catch (error: any) {
            console.error('Save error:', error);
            alert(error.message || 'An error occurred while saving.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-ink-black" />
            </div>
        );
    }

    return (
        <div className="p-8 pb-32">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-2 border border-light-grey hover:bg-white bg-[#F5F5F5] transition-colors rounded-sm">
                    <ArrowLeft className="h-4 w-4 text-ink-black" />
                </Link>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-ink-black">Edit Product</h1>
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
                                            setSelectedSizes([]);
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

                    {/* Images Management */}
                    <div className="bg-white p-6 border border-light-grey shadow-sm">
                        <h2 className="text-xs font-sans uppercase tracking-widest text-ink-black font-semibold mb-6">Images *</h2>
                        
                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="mb-6">
                                <p className="text-[10px] font-sans uppercase tracking-widest text-mid-grey mb-4">Current Images</p>
                                <div className="grid grid-cols-3 gap-4">
                                    {existingImages.map((image) => (
                                        <div key={image.id} className="relative group border border-light-grey bg-pale-grey aspect-square overflow-hidden">
                                            <img src={image.image_url} alt="Product" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(image.id)}
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                            >
                                                <Trash2 className="h-6 w-6 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload New Images */}
                        <label className="border-2 border-dashed border-light-grey bg-off-white hover:border-brand-gold transition-colors p-10 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden block mb-6">
                            <input type="file" accept="image/*" multiple onChange={handleNewImageChange} className="hidden" />
                            <UploadCloud className="h-8 w-8 text-mid-grey mb-3" />
                            <p className="text-sm font-sans text-ink-black font-medium mb-1">Click to add more images</p>
                            <p className="text-[10px] font-sans uppercase tracking-widest text-mid-grey">JPG, PNG, WEBP up to 5MB each</p>
                        </label>

                        {/* Preview New Images */}
                        {newImages.length > 0 && (
                            <div>
                                <p className="text-[10px] font-sans uppercase tracking-widest text-mid-grey mb-4">New Images to Upload</p>
                                <div className="grid grid-cols-3 gap-4">
                                    {newImages.map((image, index) => (
                                        <div key={index} className="relative group border border-light-grey bg-pale-grey aspect-square overflow-hidden">
                                            <img src={image.preview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                            >
                                                <Trash2 className="h-6 w-6 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
                                            type="button"
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
                    type="button"
                    onClick={() => router.push('/admin/products')}
                    className="border border-ink-black text-ink-black px-8 py-3 text-xs font-sans font-semibold uppercase tracking-widest hover:bg-off-white transition-colors disabled:opacity-50"
                    disabled={isSaving}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-ink-black text-white px-8 py-3 text-xs font-sans font-semibold uppercase tracking-widest hover:bg-charcoal transition-colors flex items-center justify-center min-w-[180px] disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}