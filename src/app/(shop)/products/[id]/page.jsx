'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, ShoppingCart, Package, Plus, Minus } from 'lucide-react'
import { productAPI } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { toast } from 'sonner'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const { addItem, openCart } = useCartStore()

  useEffect(() => {
    productAPI.getById(id)
      .then((res) => setProduct(res.data.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner fullPage />
  if (!product) return <div className="text-center py-20">Product not found</div>

  const stockStatus = product.stock === 0 ? 'Out of Stock' : product.stock <= product.lowStockThreshold ? 'Low Stock' : 'In Stock'
  const stockColor = product.stock === 0 ? 'text-red-600' : product.stock <= product.lowStockThreshold ? 'text-yellow-600' : 'text-green-600'

  const handleAddToCart = () => {
    if (product.stock === 0) return
    addItem(product, qty)
    openCart()
    toast.success(`${product.name} added to cart`)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
            {product.images?.[activeImg] ? (
              <Image
                src={`http://localhost:5000${product.images[activeImg].url}`}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-20 w-20 text-gray-300" />
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 ${activeImg === i ? 'border-primary-600' : 'border-transparent'}`}
                >
                  <Image src={`http://localhost:5000${img.url}`} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {product.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">{product.category.name}</span>
          )}
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className={`mt-2 text-sm font-medium ${stockColor}`}>{stockStatus} • {product.stock} {product.unit} available</p>
          {product.sku && <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>}

          <div className="mt-4">
            <span className="text-4xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
            <span className="text-sm text-gray-500 ml-2">per {product.unit}</span>
          </div>

          {product.description && (
            <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>
          )}

          {product.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{tag}</span>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold text-gray-900">{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                disabled={qty >= product.stock}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-5 w-5" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
