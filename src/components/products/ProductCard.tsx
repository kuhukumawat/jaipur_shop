'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'
import { type Product } from '@/types'

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()

  const stockStatus = product.stock === 0
    ? { label: 'Out of Stock', cls: 'bg-red-100 text-red-700' }
    : product.stock <= product.lowStockThreshold
    ? { label: 'Low Stock', cls: 'bg-yellow-100 text-yellow-700' }
    : { label: 'In Stock', cls: 'bg-green-100 text-green-700' }

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (product.stock === 0) return
    addItem(product)
    openCart()
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="rounded-xl border border-gray-200 bg-white shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          {product.images?.[0] ? (
            <Image
              src={`http://localhost:5000${product.images[0].url}`}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-12 w-12 text-gray-300" />
            </div>
          )}
          {product.category && (
            <div className="absolute top-3 left-3">
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
                {product.category.name}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</p>
              <p className="text-xs text-gray-400">per {product.unit}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stockStatus.cls}`}>
              {stockStatus.label}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  )
}
