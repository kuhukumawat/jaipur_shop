'use client'
import React, { useState, useEffect } from 'react'
import { IndianRupee, ShoppingCart, Users, TrendingUp, AlertTriangle } from 'lucide-react'
import { orderAPI, userAPI, inventoryAPI } from '@/lib/api'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, XAxis, YAxis } from 'recharts'

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: number;
  iconBg: string;
  iconColor: string;
}

function StatCard({ title, value, icon: Icon, change, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        {change !== undefined && (
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{title}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState(0)
  const [lowStock, setLowStock] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      orderAPI.getStats(),
      userAPI.getAll({ limit: 1 }),
      inventoryAPI.getLowStock(),
      orderAPI.getAllOrders({ limit: 5 }),
    ]).then(([statsRes, usersRes, lowStockRes, ordersRes]) => {
      setStats(statsRes.data.data)
      setUsers(usersRes.data.data?.total || 0)
      setLowStock(lowStockRes.data.data || [])
      setRecentOrders(ordersRes.data.data?.orders || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner fullPage />

  const monthChange = stats?.lastMonthRevenue > 0
    ? ((stats.thisMonthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100
    : 0

  const chartData = (stats?.revenueByDay || []).map((d: any) => ({
    date: d._id?.slice(5), // MM-DD
    revenue: d.revenue,
    orders: d.orders,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
          <p className="text-sm text-yellow-800">
            <strong>{lowStock.length} products</strong> are running low on stock.{' '}
            <a href="/admin/inventory" className="underline font-medium">View inventory</a>
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={formatCurrency(stats?.totalRevenue || 0)} icon={IndianRupee} iconBg="bg-green-50" iconColor="text-green-600" />
        <StatCard title="This Month" value={formatCurrency(stats?.thisMonthRevenue || 0)} icon={TrendingUp} change={monthChange} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingCart} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard title="Total Users" value={users} icon={Users} iconBg="bg-orange-50" iconColor="text-orange-600" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Revenue (Last 30 Days)</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => formatCurrency(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[220px] items-center justify-center text-gray-400 text-sm">No revenue data yet</div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-primary-600 hover:underline">View all</a>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
            ) : (
              recentOrders.map((o) => (
                <div key={o._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{o.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">{o.user?.name} • {formatDate(o.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(o.status)}`}>
                      {o.status}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(o.total)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
