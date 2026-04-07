import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/lib/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  itemCount: number;
  subtotal: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      addItem: (newItem) => set((state) => {
        const existing = state.items.find(
          (i) => i.product_id === newItem.product_id && i.size === newItem.size
        );
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.product_id === newItem.product_id && i.size === newItem.size
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i
            ),
          };
        }
        return { items: [...state.items, newItem] };
      }),

      removeItem: (productId, size) => set((state) => ({
        items: state.items.filter(
          (i) => !(i.product_id === productId && i.size === size)
        ),
      })),

      updateQuantity: (productId, size, quantity) => set((state) => ({
        items: quantity <= 0
          ? state.items.filter((i) => !(i.product_id === productId && i.size === size))
          : state.items.map((i) =>
              i.product_id === productId && i.size === size ? { ...i, quantity } : i
            ),
      })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    { name: 'fnf-cart' }
  )
);