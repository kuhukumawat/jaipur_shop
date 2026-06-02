import React from 'react'
import { ProductForm } from '@/components/products/ProductForm'

export default function NewProductPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details to create a new product</p>
      </div>
      <ProductForm />
    </div>
  )
}
