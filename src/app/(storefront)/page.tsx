import Image from "next/image";
import Link from "next/link";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { ProductCard } from "@/components/ui/ProductCard";
import { createClient } from '@/lib/supabase/server';
import { Package, MessageCircle, Truck, ShieldCheck } from "lucide-react";

export default async function HomePage() {
  const supabase = createClient();
  const { data: rawProducts } = await supabase
    .from('products')
    .select(`
      id, name, slug, price, sale_price, category, in_stock,
      product_images(image_url),
      product_sizes(size, in_stock)
    `)
    .limit(8)
    .order('created_at', { ascending: false });

  const featuredProducts = rawProducts?.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    sale_price: p.sale_price,
    category: p.category,
    in_stock: p.in_stock,
    images: p.product_images?.map((img: any) => img.image_url) || [],
    sizes: p.product_sizes || []
  })) || [];

  return (
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen bg-ink-black flex items-center justify-center text-white overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
            alt="New Arrivals"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="relative z-10 text-center flex flex-col items-center p-4">
            <hr className="w-24 border-t-2 border-brand-gold mb-4" />
            <span className="text-sm font-sans uppercase tracking-widest text-brand-gold mb-2">New Arrivals</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-4">
              Dress Them in the Best.
            </h1>
            <p className="text-lg md:text-xl font-sans max-w-2xl mb-8">
              Discover our curated collection of premium fashion for kids and adults,
              imported directly from the UK & US.
            </p>
            <Link href="/shop">
              <button className="bg-white text-ink-black px-8 py-4 uppercase text-sm font-semibold tracking-widest hover:bg-brand-gold hover:text-white transition-colors">
                Shop Now
              </button>
            </Link>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="bg-off-white py-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <TrustItem icon={Package} title="UK & US Imports" description="Premium quality apparel" />
            <TrustItem icon={MessageCircle} title="DM to Order" description="Personalized shopping experience" />
            <TrustItem icon={Truck} title="Fast Delivery" description="Nationwide shipping available" />
            <TrustItem icon={ShieldCheck} title="100% Authentic" description="Guaranteed genuine products" />
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-sans uppercase tracking-widest text-brand-gold mb-2 block">Featured</span>
              <h2 className="text-4xl font-serif font-bold text-ink-black">New In</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={{ ...product, image: product.images[0] }} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/shop">
                <button className="border border-ink-black text-ink-black px-8 py-4 uppercase text-sm font-semibold tracking-widest hover:bg-pale-grey transition-colors">
                  View All Products
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Category Highlights */}
        <section className="py-16 bg-off-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-ink-black">Shop by Category</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <CategoryTile title="Kids" imageUrl="https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=80&w=800&auto=format&fit=crop" link="/shop?category=kids" />
              <CategoryTile title="Men" imageUrl="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop" link="/shop?category=men" />
              <CategoryTile title="Women" imageUrl="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop" link="/shop?category=women" />
            </div>
          </div>
        </section>
      </div>

  );
}

interface TrustItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function TrustItem({ icon: Icon, title, description }: TrustItemProps) {
  return (
    <div className="flex flex-col items-center p-4">
      <Icon className="h-8 w-8 text-brand-gold mb-3" />
      <h3 className="text-lg font-sans font-semibold text-ink-black mb-1">{title}</h3>
      <p className="text-sm text-mid-grey">{description}</p>
    </div>
  );
}

interface CategoryTileProps {
  title: string;
  imageUrl: string;
  link: string;
}

function CategoryTile({ title, imageUrl, link }: CategoryTileProps) {
  return (
    <Link href={link} className="relative block h-72 overflow-hidden group">
      <Image
        src={imageUrl}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors duration-300 group-hover:bg-black/20">
        <h3 className="text-3xl font-serif font-bold text-white group-hover:text-brand-gold transition-colors duration-300">
          {title}
        </h3>
      </div>
    </Link>
  );
}
