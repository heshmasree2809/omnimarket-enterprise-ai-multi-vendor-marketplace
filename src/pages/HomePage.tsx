import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types/marketplace';
import { Zap, ArrowRight, Sparkles, ShieldCheck, TrendingUp, Award, Clock, Film, Play, Video } from 'lucide-react';

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categorySlug: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectProduct, onSelectCategory, onNavigateTab }) => {
  const { products, categories, setAIAssistantOpen } = useMarketplace();

  // Flash Sale Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = products.filter((p) => p.isFlashSale);
  const featuredProducts = products.filter((p) => p.isFeatured);
  const bestSellerProducts = products.filter((p) => p.isBestSeller);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Banner Carousel */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-950 text-white p-8 md:p-14 border border-zinc-800 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Multi-Vendor E-Commerce</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Curated Products with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI Guidance</span>.
          </h1>

          <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
            Shop directly from verified global merchants with real-time stock, 2-day express shipping, and instant natural language AI shopping support.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('shop')}
              className="px-6 py-3.5 rounded-2xl bg-white text-zinc-900 hover:bg-zinc-100 font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setAIAssistantOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span>Ask AI Assistant</span>
            </button>
          </div>
        </div>

        {/* Decorative backdrop glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-10 w-80 h-80 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* Flash Sale Banner with Live Timer */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500 text-black font-extrabold shadow-md">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                Flash Deals of the Day
                <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full font-extrabold uppercase">
                  Up to 30% OFF
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Limited quantities remaining at promotional pricing.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Ends In:</span>
            <span className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-2 py-1 rounded">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-2 py-1 rounded">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-2 py-1 rounded">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashSaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Shop by Category</h2>
            <p className="text-xs text-zinc-500">Explore items across 20+ specialized departments</p>
          </div>
          <button
            onClick={() => onNavigateTab('shop')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="group p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-indigo-500 text-left transition-all hover:shadow-lg flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:hover:text-indigo-400">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-zinc-400 font-medium">{cat.productCount} items</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Trending & Best Sellers Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Best Sellers & Recommended</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* HD Video Showcase Spotlight Section */}
      <section className="space-y-6 p-6 md:p-8 rounded-3xl bg-slate-900 text-white border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-2">
              <Film className="w-3.5 h-3.5 text-indigo-400" />
              Live Product Video Reels
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Watch Products in Action
            </h2>
            <p className="text-xs text-zinc-400 max-w-lg mt-1">
              Experience 360° video walkthroughs, audio tests, and unboxing reviews before adding to your cart.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('shop')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <span>Explore All Video Reels</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Video Reel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 z-10 relative">
          {products
            .filter((p) => p.hasVideoShowcase || p.videoUrl)
            .slice(0, 3)
            .map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="group relative bg-slate-950 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-indigo-500 transition-all shadow-lg flex flex-col justify-between"
              >
                {/* Video / Poster thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-[9px] uppercase tracking-wider shadow">
                    HD Video
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{prod.brand}</span>
                  <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                    {prod.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-extrabold text-emerald-400">${prod.price.toFixed(2)}</span>
                    <span className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                      <Video className="w-3 h-3 text-indigo-400" /> Watch Video Demo →
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

    </div>
  );
};
