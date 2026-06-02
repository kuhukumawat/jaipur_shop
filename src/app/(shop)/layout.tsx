import React from 'react'
import { ShopHeader } from '@/components/layout/ShopHeader'
import { CartDrawerWrapper } from '@/components/cart/CartDrawerWrapper'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ShopHeader />
      <CartDrawerWrapper />
      <main>{children}</main>
      <footer className="mt-16 border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
          © 2024 Jaipur Shop. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
