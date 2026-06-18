'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, Banknote, Smartphone } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { orderAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const PAYMENT_OPTS = [
  { value: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when your order arrives' },
  { value: 'upi', label: 'UPI', icon: Smartphone, desc: 'Pay via any UPI app' },
  { value: 'online', label: 'Online / Card', icon: CreditCard, desc: 'Debit, Credit, Net Banking' },
]

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
    if (!user) { router.push('/login'); return }
    if (items.length === 0) return
    setPlacing(true)
    try {
      const res = await orderAPI.create({
        items: items.map(i => ({ productId: i.product._id, quantity: i.quantity })),
        paymentMethod,
        shippingAddress: (user as any).address || {},
      })
      clearCart()
      toast.success('Order placed successfully! 🎉')
      router.push(`/orders/${res.data.data._id}`)
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-md px-4 py-32 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-forest-700/60 bg-forest-800">
            <ShoppingBag className="h-12 w-12 text-forest-400" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-text">Your cart is empty</h2>
          <p className="mt-2 text-sm text-forest-400">Add some fresh cuts to get started</p>
          <Link href="/" className="btn-primary mt-6 mx-auto w-fit">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header row */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-forest-400 hover:text-gold-300 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
          <div className="h-4 w-px bg-forest-700" />
          <h1 className="font-display text-2xl font-bold text-text">
            Cart <span className="text-forest-400 text-lg font-normal">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ── Cart items ── */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.product._id} className="card p-4 flex gap-4 group/item">
                {/* Thumbnail */}
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-forest-700">
                  {item.product.images?.[0] ? (
                    <Image src={`${item.product.images[0].url}`} alt={item.product.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-forest-400" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-text truncate">{item.product.name}</h3>
                      <p className="text-xs text-forest-400 mt-0.5">{formatCurrency(item.product.price)} per {item.product.unit}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="flex-shrink-0 rounded-lg p-1.5 text-forest-400 hover:text-primary-400 hover:bg-primary-950/30 transition-all duration-150"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Qty stepper */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-forest-600 bg-forest-800 text-forest-300 hover:border-primary-400/50 hover:text-gold-300 transition-all"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-text">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-forest-600 bg-forest-800 text-forest-300 hover:border-primary-400/50 hover:text-gold-300 transition-all"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="font-bold text-gold-400">{formatCurrency(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order Summary ── */}
          <div className="h-fit space-y-4">
            <div className="card p-6 space-y-5">
              <h2 className="font-display text-lg font-semibold text-text">Order Summary</h2>

              {/* Amounts */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-forest-400">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="text-text">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-forest-400">
                  <span>GST (18%)</span>
                  <span className="text-text">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-forest-400">
                  <span>Delivery</span>
                  <span className={total >= 500 ? 'text-accent-400 font-medium' : 'text-text'}>
                    {total >= 500 ? 'FREE' : formatCurrency(49)}
                  </span>
                </div>
                <div className="border-t border-forest-700 pt-2.5 flex justify-between font-bold text-base">
                  <span className="text-text">Total</span>
                  <span className="text-gold-400">{formatCurrency(grandTotal + (total >= 500 ? 0 : 49))}</span>
                </div>
              </div>

              {total < 500 && (
                <p className="rounded-xl border border-forest-700/60 bg-forest-800/60 px-3 py-2 text-xs text-forest-400">
                  Add <span className="text-gold-400 font-semibold">{formatCurrency(500 - total)}</span> more for free delivery!
                </p>
              )}

              {/* Payment */}
              <div>
                <p className="mb-3 text-sm font-medium text-forest-300">Payment Method</p>
                <div className="space-y-2">
                  {PAYMENT_OPTS.map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-all duration-150 ${paymentMethod === opt.value
                        ? 'border-primary-500/60 bg-primary-950/20'
                        : 'border-forest-700 bg-forest-800/40 hover:border-forest-500'
                        }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={() => setPaymentMethod(opt.value)}
                        className="accent-primary-500"
                      />
                      <opt.icon className={`h-4 w-4 flex-shrink-0 ${paymentMethod === opt.value ? 'text-primary-400' : 'text-forest-400'}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text">{opt.label}</p>
                        <p className="text-[11px] text-forest-500">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={placing}
                className="btn-primary w-full py-3 text-base"
              >
                {placing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-stone-950/30 border-t-stone-950 animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
