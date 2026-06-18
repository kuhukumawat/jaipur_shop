'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, LogOut, LayoutDashboard, Package, ChevronDown, Flame } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

export function ShopHeader() {
  const { user, logout } = useAuthStore()
  const { itemCount, openCart } = useCartStore()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 glass border-b border-forest-700/60">
      {/* Accent stripe */}
      <div className="h-[2px] bg-gradient-to-r from-primary-700 via-primary-500 to-accent-500" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 glow-primary group-hover:scale-105 transition-transform duration-200">
            <Flame className="h-5 w-5 text-gold-400" />
          </div>
          <div>
            <p className="font-display text-[17px] font-bold leading-tight tracking-tight text-white group-hover:text-gold-400 transition-colors duration-200">
              CARN-X
            </p>
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">Premium Cuts</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: '/', label: 'Shop' },
            { href: '/products', label: 'All Products' },
            ...(user ? [{ href: '/orders', label: 'My Orders' }] : []),
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200 group"
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-gold-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <button
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-forest-700/60 bg-forest-800 hover:border-forest-600 hover:bg-forest-700 transition-all duration-200"
          >
            <ShoppingCart className="h-5 w-5 text-zinc-300" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-zinc-900 shadow-glow-gold animate-badge-pop">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {/* User menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-xl border border-forest-700/60 bg-forest-800 px-2.5 py-1.5 hover:border-forest-600 hover:bg-forest-700 transition-all duration-200"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 text-sm font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-zinc-200">{user.name?.split(' ')[0]}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-12 z-20 w-52 rounded-2xl border border-forest-700/60 bg-forest-800 shadow-elevated py-1 overflow-hidden animate-scale-in">
                    <div className="px-4 py-3 border-b border-forest-700/60">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
                    </div>
                    <Link href="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                      <Package className="h-4 w-4 text-zinc-500" /> My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                        <LayoutDashboard className="h-4 w-4 text-zinc-500" /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-forest-700/60 mt-1" />
                    <button
                      onClick={() => { setMenuOpen(false); logout() }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-primary-400 hover:bg-primary-950/30 hover:text-primary-300 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all duration-200">
                Login
              </Link>
              <Link href="/register" className="rounded-xl bg-gradient-to-b from-primary-400 to-primary-600 px-4 py-2 text-sm font-semibold text-stone-950 hover:from-primary-300 hover:to-primary-500 transition-all duration-200 glow-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
