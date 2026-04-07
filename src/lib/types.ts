export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  price: number;
  sale_price?: number;
  images: string[];
  sizes: { size: string; inStock: boolean }[];
  description: string;
  in_stock: boolean;
  is_published: boolean;
  featured: boolean;
}

export interface CartItem {
  product_id: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

export interface OrderCapture {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_method: 'home_delivery' | 'store_pickup';
  delivery_address?: string;
  items: CartItem[];
  total_amount: number;
  created_at: string;
}
