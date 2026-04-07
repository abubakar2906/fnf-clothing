import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    sale_price?: number;
    image: string;
    in_stock: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const isSoldOut = !product.in_stock;
  const isOnSale = product.sale_price && product.sale_price < product.price;

  return (
    <Link href={`/shop/${product.slug}`} className="group relative block">
      <div className="relative overflow-hidden aspect-[4/5] bg-pale-grey">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className={`object-cover transition-transform duration-700 ease-in-out ${isSoldOut ? 'grayscale' : 'group-hover:scale-105'}`}
        />
        {isOnSale && (
          <span className="absolute top-4 left-4 bg-brand-gold text-white text-xs font-bold px-3 py-1 uppercase z-10">
            Sale
          </span>
        )}
        {isSoldOut && (
          <span className="absolute top-4 left-4 bg-light-grey text-white text-xs font-bold px-3 py-1 uppercase z-10">
            Sold Out
          </span>
        )}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="text-white text-lg font-bold uppercase tracking-wider">Sold Out</span>
          </div>
        )}
      </div>
      <div className="pt-3 flex flex-col items-start">
        <p className={`font-serif text-lg ${isSoldOut ? 'text-mid-grey line-through' : 'text-ink-black'}`}>
          {product.name}
        </p>
        <p className="font-sans text-xs uppercase text-mid-grey mt-1">
          {product.category}
        </p>
        <div className="mt-2 font-mono text-sm">
          {isOnSale && (
            <span className={`text-brand-gold mr-2 ${isSoldOut ? 'line-through' : ''}`}>
              ₦{product.sale_price?.toLocaleString()}
            </span>
          )}
          <span className={`${isOnSale ? 'text-mid-grey line-through' : 'text-ink-black'}`}>
            ₦{product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
