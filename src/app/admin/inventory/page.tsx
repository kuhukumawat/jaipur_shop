'use client'
import React, { useState, useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { inventoryAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { toast } from 'sonner'
import { type Product } from '@/types'

interface AdjustModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

function AdjustModal({ product, onClose, onSuccess }: AdjustModalProps) {
  const [type, setType] = useState('stock_in')
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await inventoryAPI.adjustStock({ productId: product._id, quantity: qty, type, notes })
      toast.success('Stock adjusted successfully')
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Adjust Stock</h2>
        <p className="text-sm text-gray-500 mb-4">{product.name} • Current stock: <strong>{product.stock} {product.unit}</strong></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[['stock_in', 'Stock In', 'bg-green-50 border-green-500 text-green-700'], ['stock_out', 'Stock Out', 'bg-red-50 border-red-500 text-red-700']].map(([v, label, cls]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setType(v)}
                  className={`py-2.5 rounded-lg border-2 text-sm font-semibold transition-colors ${type === v ? cls : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-primary-600 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Product | null>(null)

  const fetchInventory = () => {
    setLoading(true)
    inventoryAPI.getOverview()
      .then((res) => setInventory(res.data.data || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const lowStockCount = inventory.filter((p) => p.isLowStock).length

  if (loading) return <LoadingSpinner fullPage />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">{inventory.length} products tracked</p>
        </div>
        <button onClick={fetchInventory} className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
          <p className="text-sm text-yellow-800"><strong>{lowStockCount} products</strong> are low on stock and need restocking.</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Products', value: inventory.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Low Stock', value: lowStockCount, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Out of Stock', value: inventory.filter((p) => p.stock === 0).length, color: 'bg-red-50 text-red-700' },
          { label: 'Stock Value', value: formatCurrency(inventory.reduce((s, p) => s + p.stockValue, 0)), color: 'bg-green-50 text-green-700' },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-card text-center">
            <p className={`text-2xl font-bold ${card.color.split(' ')[1]}`}>{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Value</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.map((p) => {
              const pct = Math.min(100, (p.stock / (p.lowStockThreshold * 3)) * 100)
              return (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.sku}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className={`font-semibold ${p.stock === 0 ? 'text-red-600' : p.isLowStock ? 'text-yellow-600' : 'text-gray-900'}`}>
                        {p.stock} {p.unit}
                      </p>
                      <div className="mt-1 h-1.5 w-24 rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${p.stock === 0 ? 'bg-red-500' : p.isLowStock ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 hidden md:table-cell">{formatCurrency(p.stockValue)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.stock === 0 ? 'bg-red-100 text-red-700' : p.isLowStock ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {p.stock === 0 ? 'Out of Stock' : p.isLowStock ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setSelected(p)}
                        className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Adjust
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <AdjustModal product={selected} onClose={() => setSelected(null)} onSuccess={fetchInventory} />
      )}
    </div>
  )
}
