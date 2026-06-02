'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react'
import { productAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { toast } from 'sonner'
import { type Product } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProducts = (q = '') => {
    setLoading(true)
    productAPI.getAll({ search: q, limit: 100, isAdmin: true })
      .then((res) => setProducts(res.data.data?.products || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    setDeleting(id)
    try {
      await productAPI.delete(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
      toast.success('Product deleted')
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm bg-white"
        />
      </div>

      {loading ? (
        <LoadingSpinner fullPage />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No products found</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {p.images?.[0] ? (
                            <Image src={`http://localhost:5000${p.images[0].url}`} alt={p.name} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package className="h-5 w-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.category?.name || '—'}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${p.stock === 0 ? 'text-red-600' : p.stock <= p.lowStockThreshold ? 'text-yellow-600' : 'text-gray-900'}`}>
                        {p.stock} {p.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${p._id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100">
                          <Pencil className="h-4 w-4 text-gray-600" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          disabled={deleting === p._id}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
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
