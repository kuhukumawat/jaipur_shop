'use client'
import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { productAPI, categoryAPI } from '@/lib/api'
import { ProductCard } from '@/components/products/ProductCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { type Category, type Product } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    categoryAPI.getAll().then((res) => setCategories(res.data.data || []))
  }, [])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      productAPI.getAll({ search, category, limit: 50 })
        .then((res) => setProducts(res.data.data?.products || []))
        .finally(() => setLoading(false))
    }, 400)
    return () => clearTimeout(timer)
  }, [search, category])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    setSearch(e.target.value)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        <p className="mt-2 text-gray-500">Discover our wide range of quality products</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-white"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm bg-white min-w-[160px]"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner fullPage />
      ) : products.length === 0 ? (
        <EmptyState title="No products found" description="Try a different search or category" />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
