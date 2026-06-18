import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { categoryAPI } from '@/lib/api';
import { type Category } from '@/types';

interface CategoryPillsProps {
  categories?: Category[];
  active: string;
  onSelect: (key: string) => void;
  showAll?: boolean;
}

export function CategoryPills({
  categories: externalCategories,
  active,
  onSelect,
  showAll = true,
}: CategoryPillsProps) {
  const [categories, setCategories] = useState<Category[]>(externalCategories ?? []);
  const [loading, setLoading] = useState(!externalCategories?.length);

  // Fetch categories if not provided via props
  useEffect(() => {
    if (externalCategories?.length) return;
    setLoading(true);
    categoryAPI
      .getAll()
      .then((res) => setCategories(res.data.data ?? []))
      .catch((err) => console.error('Failed to load categories', err))
      .finally(() => setLoading(false));
  }, [externalCategories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-3">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!categories.length) return null;

  const pillClass = (selected: boolean) =>
    `flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
      selected
        ? 'bg-gradient-to-b from-primary-400 to-primary-600 text-stone-950 shadow-glow-primary'
        : 'border border-forest-700 bg-forest-800 text-forest-300 hover:border-primary-500/50 hover:text-white'
    }`;

  return (
    <div className="sticky top-16 z-30 border-b border-forest-700/50 bg-forest-900/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3">
          {showAll && (
            <button
              onClick={() => onSelect('')}
              aria-pressed={active === ''}
              className={pillClass(active === '')}
            >
              All
            </button>
          )}
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onSelect(cat.title)}
              aria-pressed={active === cat.title}
              className={pillClass(active === cat.title)}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
