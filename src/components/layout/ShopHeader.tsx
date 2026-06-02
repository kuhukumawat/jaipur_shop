'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, LogOut, LayoutDashboard, Package, Store, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

export function ShopHeader() {
  const { user, logout } = useAuthStore()
  const { itemCount, openCart } = useCartStore()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/products" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Store className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">Jaipur Shop</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900">Products</Link>
          {user && <Link href="/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900">My Orders</Link>}
        </nav>

        <div className="flex items-center gap-2">
          {/* Cart */}
          <button onClick={openCart} className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-gray-200 bg-white shadow-lg py-1">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link href="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Package className="h-4 w-4" /> My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <LayoutDashboard className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        logout()
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Login</Link>
              <Link href="/register" className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
