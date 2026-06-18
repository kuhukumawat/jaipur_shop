// src/app/products/[id]/ProductDetailClient.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Plus,
  Minus,
  Share2,
} from 'lucide-react';
import { cartAPI, productAPI } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { toast } from 'sonner';
import { type Product } from '@/types';
import { useAuthStore } from '@/store/authStore';

interface Props {
  productId: string;
}

export default function ProductDetailClient({ productId }: Props) {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const { token } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  // Load product data
  useEffect(() => {
    productAPI
      .getById(productId)
      .then((res) => setProduct(res.data.data))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = async () => {
    if (!token) {
      toast.error('Please sign in to add items to cart');
      router.push('/login');
      return;
    }
    if (!product) return;
    if (product.stock === 0) return;
    try {
      await cartAPI.addItem(product._id, qty);
      addItem(product, qty);
      openCart();
      toast.success(`${product.name} added to cart`);
    } catch (e) {
      toast.error('Failed to add to cart');
    }
  };

  // Share button – Web Share API with clipboard fallback
  const handleShare = async () => {
    if (!product) return;
    const shareData = {
      title: product.name,
      text: product.description?.slice(0, 120) || product.name,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${productId}`,
    };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  const stockStatus =
    product.stock === 0
      ? 'Out of Stock'
      : product.stock <= product.lowStockThreshold
        ? 'Low Stock'
        : 'In Stock';
  const stockColor =
    product.stock === 0
      ? 'text-red-600'
      : product.stock <= product.lowStockThreshold
        ? 'text-yellow-600'
        : 'text-green-600';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-primary-600 px-2 py-1 rounded-lg"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
            {product.images?.[activeImg] ? (
              <Image
                src={product.images[activeImg].url}
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
          {product.images && product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 ${activeImg === i ? 'border-primary-600' : 'border-transparent'
                    }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-forest-100">{product.name}</h1>
          <p className={`mt-2 text-sm font-medium ${stockColor} text-forest-200`}>"{stockStatus}" • {product.stock} {product.unit} available</p>
          {product.sku && <p className="text-xs text-forest-300 mt-1">SKU: {product.sku}</p>}

          <div className="mt-4">
            <span className="text-4xl font-bold text-forest-100">{formatCurrency(product.price)}</span>
            <span className="text-sm text-forest-200 ml-2">per {product.unit}</span>
          </div>

          {product.description && (
            <p className="mt-4 text-forest-200 leading-relaxed">{product.description}</p>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-forest-800 px-3 py-1 text-xs text-forest-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <p className="text-sm font-medium text-white mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-forest-600 hover:bg-forest-700"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold text-white">{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                disabled={qty >= product.stock}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-forest-600 hover:bg-forest-700 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart + Share */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-5 w-5" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3.5 text-white hover:bg-primary-700 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
