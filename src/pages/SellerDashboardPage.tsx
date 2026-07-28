import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { generateAIDescription } from '../services/aiService';
import { Product } from '../types/marketplace';
import { Store, Plus, Sparkles, DollarSign, Package, TrendingUp, Star, Edit, Trash2, CheckCircle2, X } from 'lucide-react';

export const SellerDashboardPage: React.FC = () => {
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useMarketplace();

  // Filter products belonging to current demo seller
  const sellerProducts = products.filter((p) => p.sellerId === 'seller-tech-1' || p.sellerName.includes('Aura') || true);
  const sellerOrders = orders;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Aura Audio');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('199.99');
  const [originalPrice, setOriginalPrice] = useState('249.99');
  const [stock, setStock] = useState('50');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80');
  const [description, setDescription] = useState('');
  const [featuresInput, setFeaturesInput] = useState('Active noise cancellation, 30h battery, Bluetooth 5.3');

  const totalRevenue = sellerOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleGenerateAI = async () => {
    if (!title.trim()) return;
    setGeneratingAI(true);
    const res = await generateAIDescription(title, category, brand, featuresInput);
    setDescription(res.description);
    setGeneratingAI(false);
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      title,
      brand,
      category,
      price: Number(price),
      originalPrice: Number(originalPrice),
      discountPercent: Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100),
      description: description || `Premium ${title} by ${brand}. Designed for high performance and durability.`,
      images: [imageUrl],
      stock: Number(stock),
      sellerId: 'seller-tech-1',
      sellerName: 'Aura Audio Official',
      isFeatured: true,
      isBestSeller: false,
      isFlashSale: false,
      tags: [category.toLowerCase(), brand.toLowerCase()],
      specifications: { 'Warranty': '2 Years Manufacturer', 'Origin': 'United States' },
      deliveryDays: 2,
    });

    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-zinc-900 text-white border border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Store className="w-6 h-6 text-indigo-400" />
            Merchant Portal: Aura Audio Official
          </h1>
          <p className="text-xs text-zinc-300">Manage multi-channel listings, inventory stock, and order fulfillment</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>List New Product</span>
        </button>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Total Merchant Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">${totalRevenue.toFixed(2)}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+18.4% from last month</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Active Listings</span>
            <Package className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{sellerProducts.length}</p>
          <span className="text-[10px] text-zinc-400 font-medium">100% compliant with policy</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Orders Received</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{sellerOrders.length}</p>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">98.2% fulfillment rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Store Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-current" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">4.9 / 5.0</p>
          <span className="text-[10px] text-amber-500 font-bold">Top Merchant Badge</span>
        </div>
      </div>

      {/* Inventory Listings Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white">Active Product Inventory ({sellerProducts.length})</h2>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-semibold text-zinc-500">
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {sellerProducts.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-bold text-zinc-900 dark:text-white line-clamp-1">{p.title}</span>
                  </td>
                  <td className="p-4 text-zinc-500">{p.category}</td>
                  <td className="p-4 font-bold text-zinc-900 dark:text-white">${p.price.toFixed(2)}</td>
                  <td className="p-4 font-mono">{p.stock} units</td>
                  <td className="p-4 text-amber-500 font-bold">★ {p.rating}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Fulfillment */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white">Customer Orders to Fulfill</h2>

        <div className="space-y-3">
          {sellerOrders.map((ord) => (
            <div key={ord.id} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">Order #{ord.id} — {ord.customerName}</p>
                <p className="text-zinc-500">{ord.shippingAddress.street}, {ord.shippingAddress.city}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">${ord.totalAmount.toFixed(2)}</span>
                <select
                  value={ord.status}
                  onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-semibold"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Product Modal with AI Generator */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">List New Item on OmniMarket</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. Horizon Noise Cancelling Wireless Headphones"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Orig. Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-mono text-[11px]"
                />
              </div>

              {/* AI Description Generator Tool */}
              <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/40 rounded-2xl border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Sparkles className="w-4 h-4" /> AI Auto-Copywriter
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={generatingAI || !title}
                    className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] disabled:opacity-50"
                  >
                    {generatingAI ? 'Writing Copy...' : 'Generate with Gemini'}
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="Generated description will appear here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Publish Listing
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
