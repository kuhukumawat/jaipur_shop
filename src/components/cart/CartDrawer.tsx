'use client'
import React from 'react'
import { ShoppingCart, X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export function CartDrawer() {
  const { items, closeCart, removeItem, updateQuantity } = useCartStore()
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={closeCart} />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Cart</h2>
            {itemCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="rounded-lg p-1.5 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-900">Your cart is empty</p>
              <p className="mt-1 text-sm text-gray-500">Add some products to get started</p>
              <button onClick={closeCart} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.product.images?.[0] ? (
                      <Image src={`http://localhost:5000${item.product.images[0].url}`} alt={item.product.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                    <p className="text-sm font-semibold text-indigo-600">{formatCurrency(item.product.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 hover:bg-gray-100">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 hover:bg-gray-100">
                        <Plus className="h-3 w-3" />
                      </button>
                      <button onClick={() => removeItem(item.product._id)} className="ml-auto text-red-400 hover:text-red-600 p-1">
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
          <div className="border-t border-gray-200 px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(total)}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeCart}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
