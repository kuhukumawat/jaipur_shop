'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, Flame, Star, Truck, Award, Package, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { productAPI, categoryAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { type Product, type Category } from '@/types'
import { CartDrawerWrapper } from '@/components/cart/CartDrawerWrapper'
import { CategoryPills } from '@/components/layout/CategoryPills'

/* ─── Mini Product Card ───────────────────────── */
function MiniProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore()

  const isOutOfStock = product.stock === 0
  const isLowStock = !isOutOfStock && product.stock <= (product.lowStockThreshold ?? 5)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isOutOfStock) return
    addItem(product)
    openCart()
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="card overflow-hidden hover:-translate-y-1 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
          {product.images?.[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-12 w-12 text-zinc-600" />
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Stock badge */}
          {isOutOfStock ? (
            <span className="absolute top-2.5 right-2.5 badge-amber">Out of Stock</span>
          ) : isLowStock ? (
            <span className="absolute top-2.5 right-2.5 badge-gold">Only {product.stock} left</span>
          ) : null}
        </div>

        {/* Info */}
        <div className="p-4">
          {product.category && (
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-primary-500">
              {product.category}
            </p>
          )}
          <h3 className="font-display font-semibold text-zinc-100 line-clamp-1 text-base group-hover:text-white transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">{product.description}</p>
          )}

          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              <p className="text-xl font-bold text-gold-400">{formatCurrency(product.price)}</p>
              <p className="text-[11px] text-zinc-600">per {product.unit}</p>
            </div>

            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-primary-400 to-primary-600 px-3 py-2 text-xs font-semibold text-stone-950
                         hover:from-primary-300 hover:to-primary-500 active:scale-95 transition-all duration-150
                         disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed shadow-glow-primary disabled:shadow-none"
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

/* ─── Header ──────────────────────────────────── */
function Header() {
  const { user, logout } = useAuthStore()
  const { itemCount, openCart } = useCartStore()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 glass border-b border-forest-700/60">
      {/* Accent stripe */}
      <div className="h-[2px] bg-gradient-to-r from-primary-700 via-primary-500 to-gold-500" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 glow-primary">
            <Flame className="h-5 w-5 text-gold-400" />
          </div>
          <div>
            <p className="font-display text-[17px] font-bold leading-tight tracking-tight text-white">CARN-X</p>
            <p className="text-[9px] uppercase tracking-[0.18em] text-forest-400">Premium Cuts</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-forest-700/60 bg-forest-800 hover:border-forest-600 hover:bg-forest-700 transition-all"
          >
            <ShoppingCart className="h-5 w-5 text-zinc-300" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-[10px] font-bold text-stone-900 animate-badge-pop">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-xl border border-forest-700/60 bg-forest-800 px-2.5 py-1.5 hover:border-forest-600 hover:bg-forest-700 transition-all"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 text-sm font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-zinc-200">{user.name?.split(' ')[0]}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-12 z-20 w-52 rounded-2xl border border-forest-700/60 bg-forest-800 shadow-elevated py-1 overflow-hidden animate-scale-in">
                    <div className="px-4 py-3 border-b border-forest-700/60">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
                    </div>
                    <Link href="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                      <Package className="h-4 w-4 text-zinc-500" /> My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                        <LayoutDashboard className="h-4 w-4 text-zinc-500" /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-forest-700/60 mt-1" />
                    <button onClick={() => { setMenuOpen(false); logout() }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-primary-400 hover:bg-primary-950/30 transition-colors">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all">Login</Link>
              <Link href="/register" className="rounded-xl bg-gradient-to-b from-primary-400 to-primary-600 px-4 py-2 text-sm font-semibold text-stone-950 hover:from-primary-300 hover:to-primary-500 transition-all glow-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

/* ─── Main Home Page ──────────────────────────── */
export default function HomePage() {
  const { user } = useAuthStore()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')



  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => {
      productAPI.getAll({ search, limit: 60 })
        .then(res => setProducts(res.data.data?.products || []))
        .finally(() => setLoading(false))
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  // Fetch categories once on mount
  useEffect(() => {
    categoryAPI
      .getAll()
      .then(res => setCategories(res.data.data?.categories ?? []))
      .catch(err => console.error('Failed to load categories', err))
  }, [])

  const displayed = activeCategory
    ? products.filter(p =>
      p?.category?.toLowerCase() === activeCategory.toLowerCase() ||
      p?.name?.toLowerCase().includes(activeCategory.toLowerCase())
    )
    : products

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawerWrapper />

      {/* ══════════ HERO ══════════ */}
      <section className="relative overflow-hidden noise">
        {/* Blobs */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary-700/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-gold-500/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-primary-600/8 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-900/60 bg-primary-950/60 px-4 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-400">
                Farm Fresh · Delivered Daily
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl font-bold leading-[1.08] text-white sm:text-6xl lg:text-7xl">
              Premium Cuts,<br />
              <span className="text-gradient">Always Fresh.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Handpicked from trusted farms. Expertly butchered, packed fresh, and delivered straight to your door.
            </p>

            {/* Features row */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-zinc-400">
              {[
                { icon: Truck, text: 'Free delivery over ₹500' },
                { icon: Award, text: '100% Halal Certified' },
                { icon: Star, text: 'Premium Quality Guaranteed' },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-gold-400" /> {text}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-xs mx-auto sm:max-w-sm">
              {[
                { value: '500+', label: 'Customers' },
                { value: '50+', label: 'Fresh Cuts' },
                { value: '2hr', label: 'Delivery' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl border border-forest-700/60 bg-forest-800/60 py-4 px-2 backdrop-blur-sm">
                  <p className="font-display text-2xl font-bold text-gradient-gold">{s.value}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CategoryPills categories={categories} active={activeCategory} onSelect={setActiveCategory} />
      {/* ══════════ SEARCH BAR ══════════ */}
      <div className="border-b border-forest-700/50 bg-forest-900/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-3 py-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                id="home-search"
                type="text"
                value={searchInput}
                onChange={e => { setSearchInput(e.target.value); setSearch(e.target.value) }}
                placeholder="Search meats, cuts..."
                className="input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ PRODUCTS GRID ══════════ */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Count row */}
        {!loading && (
          <div className="mb-5">
            <p className="text-sm text-zinc-500">
              Showing <span className="font-semibold text-zinc-200">{displayed.length}</span> fresh products
            </p>
          </div>
        )}

        {loading ? (
          /* Skeleton grid */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-[4/3] shimmer-bg" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-20 rounded shimmer-bg" />
                  <div className="h-4 w-full rounded shimmer-bg" />
                  <div className="h-3 w-3/4 rounded shimmer-bg" />
                  <div className="mt-3 flex justify-between">
                    <div className="h-6 w-20 rounded shimmer-bg" />
                    <div className="h-8 w-16 rounded-xl shimmer-bg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-forest-800 border border-forest-700/60">
              <Package className="h-10 w-10 text-zinc-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-zinc-300">No products found</h3>
            <p className="mt-2 text-sm text-zinc-500">Try a different search term</p>
            <button onClick={() => { setSearch(''); setSearchInput('') }} className="btn-outline mt-4">
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-up">
            {displayed.map(product => (
              <MiniProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="mt-16 border-t border-forest-700/40 bg-forest-800/40 backdrop-blur-sm py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800">
              <Flame className="h-4 w-4 text-gold-400" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white">CARN-X</span>
          </div>
          <p className="text-xs text-zinc-600">Premium Quality Meats · Farm to Table · Fresh Daily</p>
          <p className="mt-2 text-xs text-zinc-700">© 2024 CARN-X. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
