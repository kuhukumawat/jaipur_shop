'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Product, type CartItem } from '@/types'
import { cartAPI } from '@/lib/api'

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
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
      // Fetch cart from backend
      fetchCart: async () => {
        const res = await cartAPI.get()
        // Assuming response data structure: { data: { items: [...] } }
        set({ items: res.data?.data?.items || [] })
      },
      removeItem: async (productId) => {
        await cartAPI.removeItem(productId)
        const res = await cartAPI.get()
        set({ items: res.data?.data?.items || [] })
      },
      updateQuantity: async (productId, quantity) => {
        if (quantity < 1) {
          await cartAPI.removeItem(productId)
          const res = await cartAPI.get()
          set({ items: res.data?.data?.items || [] })
          return
        }
        await cartAPI.updateItem(productId, quantity)
        const res = await cartAPI.get()
        set({ items: res.data?.data?.items || [] })
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
