'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'
import { orderAPI, invoiceAPI } from '@/lib/api'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { toast } from 'sonner'

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    orderAPI.getById(id).then((res) => setOrder(res.data.data)).finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    try {
      const res = await orderAPI.updateStatus(order._id, newStatus)
      setOrder((prev) => ({ ...prev, status: res.data.data.status }))
      toast.success('Status updated')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUpdating(false)
    }
  }

  const handlePaymentChange = async (paymentStatus) => {
    setUpdating(true)
    try {
      const res = await orderAPI.updatePayment(order._id, paymentStatus)
      setOrder((prev) => ({ ...prev, paymentStatus: res.data.data.paymentStatus }))
      toast.success('Payment status updated')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <LoadingSpinner fullPage />
  if (!order) return <div className="text-center py-20">Order not found</div>

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/orders" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
        <button
          onClick={() => window.open(invoiceAPI.previewUrl(order._id), '_blank')}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <Printer className="h-4 w-4" /> Print Invoice
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{order.invoiceNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <select value={order.status} onChange={(e) => handleStatusChange(e.target.value)} disabled={updating}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white">
              {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <select value={order.paymentStatus} onChange={(e) => handlePaymentChange(e.target.value)} disabled={updating}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white">
              {['pending', 'paid', 'failed'].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-3">Customer</h2>
          <p className="font-medium text-gray-900">{order.user?.name}</p>
          <p className="text-sm text-gray-500">{order.user?.email}</p>
          {order.user?.phone && <p className="text-sm text-gray-500">{order.user.phone}</p>}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-3">Shipping Address</h2>
          {order.shippingAddress ? (
            <p className="text-sm text-gray-600">
              {[order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.pincode].filter(Boolean).join(', ') || 'No address provided'}
            </p>
          ) : <p className="text-sm text-gray-400">No address</p>}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
        <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-xs text-gray-500 uppercase font-semibold">Product</th>
              <th className="text-center py-2 text-xs text-gray-500 uppercase font-semibold">Qty</th>
              <th className="text-right py-2 text-xs text-gray-500 uppercase font-semibold">Price</th>
              <th className="text-right py-2 text-xs text-gray-500 uppercase font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map((item, i) => (
              <tr key={i}>
                <td className="py-3 font-medium text-gray-900">{item.name}<br/><span className="text-xs text-gray-400">{item.sku}</span></td>
                <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                <td className="py-3 text-right text-gray-600">{formatCurrency(item.price)}</td>
                <td className="py-3 text-right font-semibold text-gray-900">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
          <div className="flex justify-between text-gray-600"><span>GST (18%)</span><span>{formatCurrency(order.tax)}</span></div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
            <span>Total</span><span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
