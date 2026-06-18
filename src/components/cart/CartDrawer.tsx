'use client'
import React, { useEffect } from 'react'
import { ShoppingCart, X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export function CartDrawer() {
  const { items, closeCart, removeItem, updateQuantity, fetchCart } = useCartStore()
  React.useEffect(() => { fetchCart() }, [])
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={closeCart} />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-forest-900 border-l border-forest-700/60 shadow-elevated">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-forest-700/60 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary-400" />
            <h2 className="font-display text-lg font-semibold text-text">Cart</h2>
            {itemCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-[10px] font-bold text-stone-900">
                {itemCount}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="rounded-lg p-1.5 text-forest-400 hover:bg-forest-800 hover:text-text transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-forest-700/60 bg-forest-800">
                <ShoppingCart className="h-8 w-8 text-forest-400" />
              </div>
              <p className="font-medium text-text">Your cart is empty</p>
              <p className="mt-1 text-sm text-forest-400">Add some products to get started</p>
              <button onClick={closeCart} className="btn-primary mt-4">
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-4 rounded-xl border border-forest-700/40 bg-forest-800/40 p-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-forest-700">
                    {item.product.images?.[0] ? (
                      <Image src={`${item.product.images[0].url}`} alt={item.product.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-forest-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col min-w-0">
                    <p className="text-sm font-medium text-text line-clamp-1">{item.product.name}</p>
                    <p className="text-sm font-semibold text-gold-400">{formatCurrency(item.product.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-forest-600 bg-forest-800 text-forest-300 hover:border-primary-400/50 hover:text-gold-300 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-text">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-forest-600 bg-forest-800 text-forest-300 hover:border-primary-400/50 hover:text-gold-300 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="ml-auto rounded p-1 text-forest-400 hover:text-primary-400 hover:bg-primary-950/20 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-forest-700/60 px-6 py-4 space-y-4 bg-forest-900">
            <div className="flex items-center justify-between">
              <span className="font-medium text-forest-300">Subtotal</span>
              <span className="text-lg font-bold text-gold-400">{formatCurrency(total)}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-primary flex w-full items-center justify-center gap-2 py-3"
            >
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
