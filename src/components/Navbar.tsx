import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useTheme } from '../context/ThemeContext';
import { AmbientMusicPlayer } from './AmbientMusicPlayer';
import {
  Search,
  ShoppingBag,
  Heart,
  Sparkles,
  User,
  Store,
  Shield,
  LogOut,
  ChevronDown,
  Menu,
  X,
  SlidersHorizontal,
  Compass,
  ArrowRightLeft,
  Truck,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCart: () => void;
  onOpenTracking?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenCart, onOpenTracking }) => {
  const { user, role, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistIds, compareIds, setCompareModalOpen, categories, filters, setFilters, setAIAssistantOpen } = useMarketplace();
  const { theme, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [useAISearch, setUseAISearch] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, searchQuery }));
    setActiveTab('shop');
  };

  const selectCategory = (catSlug: string) => {
    setFilters((prev) => ({ ...prev, category: catSlug }));
    setIsCategoryOpen(false);
    setActiveTab('shop');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                O
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-1">
                  OmniMarket
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    AI
                  </span>
                </span>
                <span className="hidden sm:block text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tracking-wider">
                  Enterprise Marketplace
                </span>
              </div>
            </button>

            {/* Category Dropdown */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              >
                <Compass className="w-4 h-4 text-indigo-500" />
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-2 z-50 max-h-96 overflow-y-auto">
                  <button
                    onClick={() => selectCategory('all')}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between"
                  >
                    <span>All Categories</span>
                    <span className="text-[10px] text-zinc-400">Browse All</span>
                  </button>
                  <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => selectCategory(cat.slug)}
                      className="w-full text-left px-4 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{cat.productCount}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-2 hidden md:block relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder={useAISearch ? "Ask AI: e.g. 'Noise cancelling headphones under $250 for travel'" : "Search products, brands, categories..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-24 py-2 rounded-full text-xs bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border transition-all focus:outline-none focus:ring-2 ${
                  useAISearch
                    ? 'border-indigo-500/50 focus:ring-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'border-zinc-200 dark:border-zinc-800 focus:ring-zinc-400'
                }`}
              />
              
              <button
                type="button"
                onClick={() => setUseAISearch(!useAISearch)}
                className={`absolute right-2 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                  useAISearch
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Search</span>
              </button>
            </div>
          </form>

          {/* Action Tools & User Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Smooth Ambient Music Lounge Player */}
            <AmbientMusicPlayer />

            {/* AI Assistant Drawer Launcher */}
            <button
              onClick={() => setAIAssistantOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 transition-all shadow-sm group"
            >
              <Sparkles className="w-4 h-4 text-indigo-500 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">AI Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* Track Order Button */}
            {onOpenTracking && (
              <button
                onClick={onOpenTracking}
                className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                title="Track Shipment Progress"
              >
                <Truck className="w-4 h-4 text-indigo-500" />
                <span className="hidden xl:inline text-xs font-bold text-zinc-700 dark:text-zinc-300">Track</span>
              </button>
            )}

            {/* Compare Button */}
            <button
              onClick={() => setCompareModalOpen(true)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
              title="Compare Products Side-by-Side"
            >
              <ArrowRightLeft className="w-4 h-4" />
              {compareIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {compareIds.length}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`p-2 rounded-lg transition-colors relative ${
                activeTab === 'wishlist'
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Heart className="w-4 h-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'}
                  alt={user?.name || 'User'}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white">{user?.name}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {role}
                    </span>
                  </div>

                  <button
                    onClick={() => { setActiveTab('profile'); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile & Orders</span>
                  </button>

                  {role === 'seller' && (
                    <button
                      onClick={() => { setActiveTab('seller'); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2 font-medium"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Seller Dashboard</span>
                    </button>
                  )}

                  {role === 'admin' && (
                    <button
                      onClick={() => { setActiveTab('admin'); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 flex items-center gap-2 font-medium"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin Command Center</span>
                    </button>
                  )}

                  <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

                  <button
                    onClick={() => { logout(); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="hidden md:flex items-center gap-6 py-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-medium">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors ${activeTab === 'home' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            Home
          </button>
          <button
            onClick={() => { setFilters((p) => ({ ...p, category: 'all' })); setActiveTab('shop'); }}
            className={`transition-colors ${activeTab === 'shop' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            Explore Catalog
          </button>
          <button
            onClick={() => { setFilters((p) => ({ ...p, hasDiscount: true })); setActiveTab('shop'); }}
            className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 hover:underline"
          >
            <span>Flash Deals</span>
            <span className="text-[10px] px-1 bg-amber-500/10 rounded">20% OFF</span>
          </button>
          {role === 'seller' && (
            <button
              onClick={() => setActiveTab('seller')}
              className={`transition-colors ${activeTab === 'seller' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
            >
              Seller Dashboard
            </button>
          )}
          {role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`transition-colors ${activeTab === 'admin' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
            >
              Admin Controls
            </button>
          )}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800"
            />
          </form>

          <div className="flex flex-col gap-2 pt-2 text-xs font-medium">
            <button
              onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Home
            </button>
            <button
              onClick={() => { setActiveTab('shop'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Browse Products
            </button>
            <button
              onClick={() => { setActiveTab('wishlist'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
            >
              <span>Wishlist</span>
              <span className="bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {wishlistIds.length}
              </span>
            </button>
            <button
              onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              My Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
