import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink-black text-white py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-full md:col-span-1">
          <Link href="/" className="text-2xl font-serif font-bold text-brand-gold uppercase">
            FNF CLOTHING
          </Link>
          <p className="text-sm text-mid-grey mt-4">
            Curating premium fashion for kids and adults. Imported from the UK & US.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-sans font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-mid-grey">
            <li><Link href="/shop?category=kids" className="hover:text-brand-gold">Kids</Link></li>
            <li><Link href="/shop?category=men" className="hover:text-brand-gold">Men</Link></li>
            <li><Link href="/shop?category=women" className="hover:text-brand-gold">Women</Link></li>
            <li><Link href="/shop?category=sale" className="hover:text-brand-gold">Sale</Link></li>
            <li><Link href="/shop" className="hover:text-brand-gold">All Products</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-sans font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-mid-grey">
            <li><Link href="/terms" className="hover:text-brand-gold">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-brand-gold">Privacy Policy</Link></li>
            <li><Link href="/returns" className="hover:text-brand-gold">Returns & Refunds</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-sans font-semibold mb-4">Connect</h3>
          <ul className="space-y-2 text-mid-grey">
            <li><a href="#" className="hover:text-brand-gold">Contact Us</a></li>
            <li><a href="https://instagram.com/fnf_kiddies_and_accessories" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold">Instagram</a></li>
            <li><a href="#" className="hover:text-brand-gold">WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-stone-600 text-sm mt-12">
        &copy; {new Date().getFullYear()} FNF Clothing. All rights reserved.
      </div>
    </footer>
  );
}
