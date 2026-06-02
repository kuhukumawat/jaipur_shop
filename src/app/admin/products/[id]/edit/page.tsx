'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { productAPI } from '@/lib/api'
import { ProductForm } from '@/components/products/ProductForm'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { type Product } from '@/types'

export default function EditProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      productAPI.getById(id as string)
        .then((res) => setProduct(res.data.data))
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) return <LoadingSpinner fullPage />

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-sm text-gray-500 mt-1">{product?.name}</p>
      </div>
      {product && <ProductForm product={product} />}
    </div>
  )
}
