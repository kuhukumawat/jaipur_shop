'use client'
import React from 'react'
import { useCartStore } from '@/store/cartStore'
import { CartDrawer } from './CartDrawer'

export function CartDrawerWrapper() {
  const { isOpen } = useCartStore()
  return isOpen ? <CartDrawer /> : null
}
