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
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()

  const isOutOfStock = product.stock === 0
  const isLowStock   = !isOutOfStock && product.stock <= (product.lowStockThreshold ?? 5)

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (isOutOfStock) return
    addItem(product)
    openCart()
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="card overflow-hidden hover:-translate-y-1.5 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
          {product.images?.[0] ? (
            <Image
              src={`${product.images[0].url}`}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
              <Package className="h-12 w-12 text-zinc-600" />
            </div>
          )}
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Stock badge */}
          {isOutOfStock ? (
            <span className="absolute top-2.5 right-2.5 badge-amber">Out of Stock</span>
          ) : isLowStock ? (
            <span className="absolute top-2.5 right-2.5 badge-gold">Only {product.stock} left</span>
          ) : (
            <span className="absolute top-2.5 right-2.5 badge-green">In Stock</span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-zinc-100 line-clamp-1 group-hover:text-white transition-colors text-base">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">{product.description}</p>
          )}

          <div className="mt-4 flex items-end justify-between gap-2">
            <div>
              <p className="text-xl font-bold text-gold-400">{formatCurrency(product.price)}</p>
              <p className="text-[11px] text-zinc-600">per {product.unit}</p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-primary-400 to-primary-600 px-3.5 py-2 text-xs font-semibold text-stone-950
                         hover:from-primary-300 hover:to-primary-500 active:scale-95 transition-all duration-150
                         disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed
                         shadow-glow-primary disabled:shadow-none"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {isOutOfStock ? 'Sold Out' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
