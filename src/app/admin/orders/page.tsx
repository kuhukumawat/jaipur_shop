'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Eye } from 'lucide-react'
import { orderAPI } from '@/lib/api'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { toast } from 'sonner'

const STATUSES = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchOrders = (s = '', q = '') => {
    setLoading(true)
    orderAPI.getAllOrders({ status: s, search: q, limit: 100 })
      .then((res) => setOrders(res.data.data?.orders || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    fetchOrders(status, search)
  }, [status, search])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      const res = await orderAPI.updateStatus(orderId, newStatus)
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: res.data.data.status } : o))
      toast.success('Status updated')
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} orders</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm bg-white"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm bg-white"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Status'}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner fullPage />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No orders found</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{o.invoiceNumber}</p>
                      <p className="text-xs text-gray-400">{o.items?.length} item(s)</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-gray-900">{o.user?.name}</p>
                      <p className="text-xs text-gray-400">{o.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(o.total)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        disabled={updating === o._id}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold border-0 cursor-pointer focus:ring-2 focus:ring-primary-600 ${getStatusColor(o.status)}`}
                      >
                        {STATUSES.slice(1).map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/orders/${o._id}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
