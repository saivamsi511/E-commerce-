import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Products } from '@/entities/products';

export interface CartItem extends Products {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Products, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Products, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item._id === product._id);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          } else {
            return {
              items: [...state.items, { ...product, quantity }]
            };
          }
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item._id !== productId)
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map(item =>
            item._id === productId
              ? { ...item, quantity }
              : item
          )
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'cart-storage',
    }
  )
);