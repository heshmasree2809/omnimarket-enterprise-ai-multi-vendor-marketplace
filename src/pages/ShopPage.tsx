import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types/marketplace';
import { performAISemanticSearch } from '../services/aiService';
import { SlidersHorizontal, Sparkles, RefreshCw, X, Search, Check } from 'lucide-react';

interface ShopPageProps {
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onSelectProduct }) => {
  const { products, categories, filters, setFilters, resetFilters } = useMarketplace();

  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [aiMatchingIds, setAiMatchingIds] = useState<string[] | null>(null);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Apply filters
  let filteredProducts = products.filter((p) => {
    if (aiMatchingIds) {
      return aiMatchingIds.includes(p.id);
    }

    if (filters.category !== 'all') {
      const selectedCat = categories.find(
        (c) =>
          c.slug.toLowerCase() === filters.category.toLowerCase() ||
          c.name.toLowerCase() === filters.category.toLowerCase()
      );
      const catName = selectedCat ? selectedCat.name.toLowerCase() : filters.category.toLowerCase();
      const catSlug = selectedCat ? selectedCat.slug.toLowerCase() : filters.category.toLowerCase();
      const pCat = p.category.toLowerCase();

      const isMatch =
        pCat === catName ||
        pCat === catSlug ||
        catName.includes(pCat) ||
        pCat.includes(catName) ||
        catSlug.includes(pCat) ||
        pCat.includes(catSlug);

      if (!isMatch) {
        return false;
      }
    }
    if (filters.brand !== 'all' && p.brand.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }
    if (p.price < filters.minPrice || p.price > filters.maxPrice) {
      return false;
    }
    if (p.rating < filters.minRating) {
      return false;
    }
    if (filters.inStockOnly && p.stock <= 0) {
      return false;
    }
    if (filters.hasDiscount && p.discountPercent <= 0) {
      return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCat && !matchBrand && !matchTag) return false;
    }
    return true;
  });

  // Apply sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'price-asc') return a.price - b.price;
    if (filters.sortBy === 'price-desc') return b.price - a.price;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0; // default featured
  });

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    setAiReasoning(null);

    const result = await performAISemanticSearch(aiQuery, products);
    setAiMatchingIds(result.matchingProductIds);
    setAiReasoning(result.reasoning);
    setAiLoading(false);
  };

  const clearAISearch = () => {
    setAiQuery('');
    setAiMatchingIds(null);
    setAiReasoning(null);
  };

  // Get unique brands
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header & AI Semantic Search */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white border border-zinc-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Marketplace Catalog</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Explore {products.length} verified listings from global merchants</p>
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-white border border-zinc-700"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter Catalog</span>
          </button>
        </div>

        {/* AI Natural Language Search Box */}
        <form onSubmit={handleAISearch} className="relative max-w-2xl">
          <div className="relative flex items-center">
            <Sparkles className="w-4 h-4 absolute left-3.5 text-indigo-400" />
            <input
              type="text"
              placeholder="AI Semantic Search: e.g. 'OLED laptop for photo editing under $1500' or 'Waterproof watch'"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-zinc-800/80 border border-indigo-500/30 text-white text-xs placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="absolute right-2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              {aiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Search</span>}
            </button>
          </div>
        </form>

        {/* AI Reasoning Feedback Banner */}
        {aiReasoning && (
          <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-xs flex items-center justify-between gap-2">
            <p className="text-indigo-200">
              <strong className="text-indigo-400 font-bold">AI Intent Analysis:</strong> {aiReasoning}
            </p>
            <button onClick={clearAISearch} className="p-1 text-zinc-400 hover:text-white shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Filter Sidebar */}
        <div className={`space-y-6 md:block ${mobileFilterOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-indigo-500" /> Filters
              </span>
              <button onClick={resetFilters} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="font-semibold text-zinc-900 dark:text-white">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="font-semibold text-zinc-900 dark:text-white">Brand</label>
              <select
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-zinc-900 dark:text-white">
                <span>Price Range</span>
                <span className="text-indigo-600 dark:text-indigo-400">${filters.minPrice} - ${filters.maxPrice}</span>
              </div>
              <input
                type="range"
                min={0}
                max={2000}
                step={25}
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Checkbox Toggles */}
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={filters.hasDiscount}
                  onChange={(e) => setFilters({ ...filters, hasDiscount: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <span>Discounted Deals Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <span>In Stock Only</span>
              </label>
            </div>

          </div>
        </div>

        {/* Right Product Grid */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Top Sort Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
            <p className="text-zinc-500 font-medium">
              Showing <strong className="text-zinc-900 dark:text-white">{filteredProducts.length}</strong> products
            </p>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-medium">Sort By:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white font-medium"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Cards */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-3">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">No products found matching your active criteria.</p>
              <button onClick={resetFilters} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onSelectProduct={onSelectProduct} />
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
