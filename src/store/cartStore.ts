'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Product, type CartItem } from '@/types'

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
      get total() {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      },
      addItem: (product, quantity = 1) => {
        const items = get().items
        const idx = items.findIndex((i) => i.product._id === product._id)
        if (idx > -1) {
          const updated = [...items]
          updated[idx].quantity += quantity
          set({ items: updated })
        } else {
          set({ items: [...items, { product, quantity }] })
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.product._id !== productId) }),
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId)
          return
        }
        set({ items: get().items.map((i) => i.product._id === productId ? { ...i, quantity } : i) })
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'cart-storage',
      partialize: (s) => ({ items: s.items }),
    }
  )
)
