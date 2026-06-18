'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Save } from 'lucide-react'
import { productAPI } from '@/lib/api'
import { toast } from 'sonner'
import { type Product } from '@/types'

interface ProductFormProps {
  product?: Product;
}

interface FormValues {
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  unit: string;
  tags?: string;
  isActive: boolean;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: product ? {
      name: product.name,
      sku: product.sku || '',
      description: product.description || '',
      price: product.price,
      costPrice: product.costPrice || 0,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      unit: product.unit,
      tags: product.tags?.join(', ') || '',
      isActive: product.isActive ?? true,
    } : { unit: 'pcs', lowStockThreshold: 10, isActive: true } as any
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (files) => setNewFiles((prev) => [...prev, ...files]),
  })

  const removeNewFile = (i: number) => setNewFiles((prev) => prev.filter((_, idx) => idx !== i))

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== '') {
          formData.append(k, String(v))
        }
      })
      newFiles.forEach((f) => formData.append('images', f))

      if (product) {
        await productAPI.update(product._id, formData)
        toast.success('Product updated')
      } else {
        await productAPI.create(formData)
        toast.success('Product created')
      }
      router.push('/admin/products')
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="font-semibold text-gray-900 mb-4">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  {...register('name', { required: 'Required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                <input
                  {...register('sku', { required: 'Required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 uppercase"
                />
                {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  {...register('tags')}
                  placeholder="cotton, fabric, summer"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="font-semibold text-gray-900 mb-4">Pricing & Stock</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { required: 'Required', min: 0 })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                  {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('costPrice', { required: 'Required', min: 0 })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    {...register('stock', { required: 'Required', min: 0 })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
                  <input
                    type="number"
                    {...register('lowStockThreshold')}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <select
                  {...register('unit')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                >
                  {['pcs', 'kg', 'g', 'litre', 'ml', 'meter', 'yard', 'box', 'dozen'].map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="rounded accent-primary-600 h-4 w-4"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active (visible to customers)
                </label>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="font-semibold text-gray-900 mb-4">Images</h2>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Drop here...' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
            </div>
            {newFiles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {newFiles.map((f, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(f)}
                      alt=""
                      className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewFile(i)}
                      className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-600 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
