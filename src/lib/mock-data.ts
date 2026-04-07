import { Product } from "@/lib/types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod1",
    name: "Classic White Tee",
    slug: "classic-white-tee",
    category: "Men",
    subcategory: "Shirts",
    price: 7500,
    images: ["/products/men-white-tee-1.jpg", "/products/men-white-tee-2.jpg"],
    sizes: [{ size: "M", inStock: true }, { size: "L", inStock: true }, { size: "XL", inStock: false }],
    description: "A timeless classic, perfect for any occasion. Made with 100% organic cotton.",
    in_stock: true,
    is_published: true,
    featured: true,
  },
  {
    id: "prod2",
    name: "Kids Denim Jacket",
    slug: "kids-denim-jacket",
    category: "Kids",
    subcategory: "Jackets",
    price: 12000,
    sale_price: 9999,
    images: ["/products/kids-denim-jacket-1.jpg", "/products/kids-denim-jacket-2.jpg"],
    sizes: [{ size: "4Y", inStock: true }, { size: "6Y", inStock: true }, { size: "8Y", inStock: true }],
    description: "Durable and stylish denim jacket for your little one. A must-have for their wardrobe.",
    in_stock: true,
    is_published: true,
    featured: true,
  },
  {
    id: "prod3",
    name: "Women's Summer Dress",
    slug: "womens-summer-dress",
    category: "Women",
    subcategory: "Dresses",
    price: 15000,
    images: ["/products/women-summer-dress-1.jpg", "/products/women-summer-dress-2.jpg"],
    sizes: [{ size: "S", inStock: true }, { size: "M", inStock: true }, { size: "L", inStock: false }],
    description: "Light and airy summer dress, perfect for a sunny day out. Elegant and comfortable.",
    in_stock: false,
    is_published: true,
    featured: true,
  },
  {
    id: "prod4",
    name: "Men's Chinos",
    slug: "mens-chinos",
    category: "Men",
    subcategory: "Trousers",
    price: 9000,
    images: ["/products/men-chinos-1.jpg", "/products/men-chinos-2.jpg"],
    sizes: [{ size: "30", inStock: true }, { size: "32", inStock: true }, { size: "34", inStock: true }],
    description: "Comfortable and versatile chinos for men. Can be dressed up or down.",
    in_stock: true,
    is_published: true,
    featured: false,
  },
  {
    id: "prod5",
    name: "Kids Graphic Tee",
    slug: "kids-graphic-tee",
    category: "Kids",
    subcategory: "Shirts",
    price: 5000,
    sale_price: 3500,
    images: ["/products/kids-graphic-tee-1.jpg", "/products/kids-graphic-tee-2.jpg"],
    sizes: [{ size: "2Y", inStock: true }, { size: "4Y", inStock: true }, { size: "6Y", inStock: false }],
    description: "Fun and vibrant graphic tee for kids. Made with soft, breathable fabric.",
    in_stock: true,
    is_published: true,
    featured: true,
  },
  {
    id: "prod6",
    name: "Women's High-Waist Jeans",
    slug: "womens-high-waist-jeans",
    category: "Women",
    subcategory: "Trousers",
    price: 18000,
    images: ["/products/women-jeans-1.jpg", "/products/women-jeans-2.jpg"],
    sizes: [{ size: "26", inStock: true }, { size: "28", inStock: true }, { size: "30", inStock: true }],
    description: "Stylish high-waist jeans for women. Flattering fit and comfortable for all-day wear.",
    in_stock: true,
    is_published: true,
    featured: false,
  },
  {
    id: "prod7",
    name: "Men's Hoodie",
    slug: "mens-hoodie",
    category: "Men",
    subcategory: "Sweatshirts",
    price: 10000,
    images: ["/products/men-hoodie-1.jpg", "/products/men-hoodie-2.jpg"],
    sizes: [{ size: "M", inStock: true }, { size: "L", inStock: true }, { size: "XL", inStock: true }],
    description: "Cozy and warm hoodie for men. Perfect for chilly evenings.",
    in_stock: true,
    is_published: true,
    featured: true,
  },
  {
    id: "prod8",
    name: "Kids Winter Coat",
    slug: "kids-winter-coat",
    category: "Kids",
    subcategory: "Jackets",
    price: 25000,
    sale_price: 19999,
    images: ["/products/kids-winter-coat-1.jpg", "/products/kids-winter-coat-2.jpg"],
    sizes: [{ size: "4Y", inStock: true }, { size: "6Y", inStock: true }, { size: "8Y", inStock: false }],
    description: "Durable and stylish winter coat for your little one. Keep them warm and cozy.",
    in_stock: true,
    is_published: true,
    featured: true,
  },
];

export function getFeaturedProducts(): Product[] {
  return MOCK_PRODUCTS.filter((product) => product.featured && product.is_published);
}

export function getProducts(filters?: {
  category?: string;
  subcategory?: string;
  sort?: string;
  hideSoldOut?: boolean;
  showSaleOnly?: boolean;
}): Product[] {
  let products = MOCK_PRODUCTS.filter((p) => p.is_published);

  if (filters?.category) {
    products = products.filter(
      (p) => p.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  if (filters?.subcategory) {
    products = products.filter(
      (p) => p.subcategory.toLowerCase() === filters.subcategory!.toLowerCase()
    );
  }

  if (filters?.hideSoldOut) {
    products = products.filter((p) => p.in_stock);
  }

  if (filters?.showSaleOnly) {
    products = products.filter((p) => p.sale_price && p.sale_price < p.price);
  }

  if (filters?.sort === "price_asc") {
    products = products.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
  }
  if (filters?.sort === "price_desc") {
    products = products.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
  }
  // Default sort (e.g., by ID or creation date if available) can be added here

  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((product) => product.slug === slug);
}
