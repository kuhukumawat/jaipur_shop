'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { orderAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore()
  const { user } = useAuthStore()
  const router = useRouter()
  const [placing, setPlacing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')

  const itemCount = items.reduce((s, i) => s + i.quantity, 0)
  const tax = total * 0.18
  const grandTotal = total + tax

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    if (items.length === 0) return
    setPlacing(true)
    try {
      const res = await orderAPI.create({
        items: items.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
        paymentMethod,
        shippingAddress: (user as any).address || {},
      })
      clearCart()
      toast.success('Order placed successfully!')
      router.push(`/orders/${res.data.data._id}`)
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Add some products to your cart</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/products" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Cart ({itemCount} items)</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.product._id} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-card">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {item.product.images?.[0] ? (
                  <Image src={`http://localhost:5000${item.product.images[0].url}`} alt={item.product.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{formatCurrency(item.product.price)} each</p>
                  </div>
                  <button onClick={() => removeItem(item.product._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="font-bold text-gray-900">{formatCurrency(item.product.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card h-fit space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(total)}</span></div>
            <div className="flex justify-between text-gray-600"><span>GST (18%)</span><span>{formatCurrency(tax)}</span></div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span><span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
            {['cod', 'upi', 'online'].map((pm) => (
              <label key={pm} className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value={pm}
                  checked={paymentMethod === pm}
                  onChange={() => setPaymentMethod(pm)}
                  className="accent-primary-600"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {pm === 'cod' ? 'Cash on Delivery' : pm.toUpperCase()}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            disabled={placing}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}
