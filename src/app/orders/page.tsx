'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, Eye } from 'lucide-react'
import { orderAPI } from '@/lib/api'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderAPI.getMyOrders({ limit: 50 })
      .then((res) => setOrders(res.data.data?.orders || []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner fullPage />

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Place your first order"
          action={{ label: 'Shop Now', onClick: () => { window.location.href = '/products' } }}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{order.invoiceNumber}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)} • {order.items.length} item(s)</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="font-bold text-gray-900">{formatCurrency(order.total)}</span>
                  <Link
                    href={`/orders/${order._id}`}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
