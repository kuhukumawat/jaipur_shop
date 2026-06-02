'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Printer, ExternalLink } from 'lucide-react'
import { orderAPI, invoiceAPI } from '@/lib/api'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderAPI.getById(id)
      .then((res) => setOrder(res.data.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner fullPage />
  if (!order) return <div className="text-center py-20">Order not found</div>

  const handlePrint = () => {
    const url = invoiceAPI.previewUrl(order._id)
    window.open(url, '_blank')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/orders" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> My Orders
        </Link>
        <button onClick={handlePrint} className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
          <Printer className="h-4 w-4" /> Print Invoice
        </button>
      </div>

      {/* Order Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{order.invoiceNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card mb-4">
        <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{formatCurrency(item.price)} × {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">{formatCurrency(item.subtotal)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
          <div className="flex justify-between text-gray-600"><span>GST (18%)</span><span>{formatCurrency(order.tax)}</span></div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-200">
            <span>Total</span><span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
        <h2 className="font-semibold text-gray-900 mb-2">Payment</h2>
        <p className="text-sm text-gray-600 capitalize">Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}</p>
      </div>
    </div>
  )
}
