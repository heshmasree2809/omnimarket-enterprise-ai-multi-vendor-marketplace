import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Users,
  Store,
  DollarSign,
  PackageCheck,
  CheckCircle,
  XCircle,
  Search,
  Sliders,
  TrendingUp,
  AlertTriangle,
  FileText,
  BadgePercent,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { products, sellers, updateProductStatus, approveSeller, updateSellerCommission } = useMarketplace();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'sellers' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSellerId, setEditingSellerId] = useState<string | null>(null);
  const [commissionRateInput, setCommissionRateInput] = useState<number>(10);

  // Computed metrics
  const totalGMV = products.reduce((acc, p) => acc + p.price * 12, 0);
  const totalCommission = totalGMV * 0.1;
  const pendingProducts = products.filter((p) => p.status === 'pending');
  const pendingSellers = sellers.filter((s) => s.status === 'pending');

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSellers = sellers.filter(
    (s) =>
      s.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            Enterprise Control Center
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Marketplace Administration
          </h1>
          <p className="text-xs text-indigo-200/80 max-w-xl">
            Logged in as <span className="font-semibold text-white">{user?.name}</span> ({user?.email}). Manage multi-vendor catalog moderation, seller approvals, platform commission rates, and compliance audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-right">
            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Platform Status</p>
            <p className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              100% Operational
            </p>
          </div>
        </div>

        {/* Decorative backdrop graphics */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-br from-indigo-500/10 to-purple-600/20 pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total GMV</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              ${totalGMV.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +14.2% vs last month
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Est. Revenue (10%)</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              ${totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] font-medium text-gray-500 mt-1 inline-block">Platform cut</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <BadgePercent className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Verified Sellers</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{sellers.length}</p>
            {pendingSellers.length > 0 && (
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3 h-3" /> {pendingSellers.length} pending review
              </span>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Products</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{products.length}</p>
            {pendingProducts.length > 0 && (
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                <PackageCheck className="w-3 h-3" /> {pendingProducts.length} pending approval
              </span>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors relative ${
              activeTab === 'products'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            Product Moderation
            {pendingProducts.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold">
                {pendingProducts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors relative ${
              activeTab === 'sellers'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            Sellers & Commissions
            {pendingSellers.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold">
                {pendingSellers.length}
              </span>
            )}
          </button>
        </div>

        {/* Search Input for Tables */}
        {(activeTab === 'products' || activeTab === 'sellers') && (
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-full text-xs bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        )}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Pending Approvals */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Products Needing Moderation
              </h3>
              <button
                onClick={() => setActiveTab('products')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            {pendingProducts.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 dark:bg-zinc-950 rounded-xl">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">All products are reviewed!</p>
                <p className="text-[11px] text-gray-400">No pending items in moderation queue.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{p.title}</p>
                        <p className="text-[10px] text-gray-500">Seller: {p.sellerName} • ${p.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateProductStatus(p.id, 'active')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-500"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateProductStatus(p.id, 'rejected')}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-semibold hover:bg-rose-500"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seller Applications */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-500" />
                Pending Seller Applications
              </h3>
              <button
                onClick={() => setActiveTab('sellers')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            {pendingSellers.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 dark:bg-zinc-950 rounded-xl">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Seller applications caught up!</p>
                <p className="text-[11px] text-gray-400">All registered merchants are approved.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingSellers.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{s.storeName}</p>
                      <p className="text-[10px] text-gray-500">{s.ownerName} • {s.email}</p>
                    </div>
                    <button
                      onClick={() => approveSeller(s.id)}
                      className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-semibold hover:bg-indigo-500"
                    >
                      Approve Merchant
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRODUCTS MODERATION TAB */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
              Product Listing Directory ({filteredProducts.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-zinc-900/50 text-gray-400 font-bold uppercase text-[10px] border-b border-gray-200 dark:border-zinc-800">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{p.title}</p>
                          <p className="text-[10px] text-gray-400">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-zinc-300 font-medium">{p.sellerName}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">${p.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : p.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.status !== 'active' && (
                          <button
                            onClick={() => updateProductStatus(p.id, 'active')}
                            className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-500"
                          >
                            Set Active
                          </button>
                        )}
                        {p.status !== 'rejected' && (
                          <button
                            onClick={() => updateProductStatus(p.id, 'rejected')}
                            className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-500"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SELLERS & COMMISSIONS TAB */}
      {activeTab === 'sellers' && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
              Merchant Directory & Commission Rules ({filteredSellers.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-zinc-900/50 text-gray-400 font-bold uppercase text-[10px] border-b border-gray-200 dark:border-zinc-800">
                <tr>
                  <th className="p-4">Store Name</th>
                  <th className="p-4">Owner Contact</th>
                  <th className="p-4">Commission Rate</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {filteredSellers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{s.storeName}</td>
                    <td className="p-4 text-slate-600 dark:text-zinc-400">
                      {s.ownerName} <span className="text-[10px] text-gray-400">({s.email})</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {editingSellerId === s.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={commissionRateInput}
                            onChange={(e) => setCommissionRateInput(Number(e.target.value))}
                            className="w-16 px-2 py-1 rounded border border-indigo-500 text-xs text-slate-900 dark:text-white bg-white dark:bg-zinc-800"
                          />
                          <span>%</span>
                          <button
                            onClick={() => {
                              updateSellerCommission(s.id, commissionRateInput);
                              setEditingSellerId(null);
                            }}
                            className="ml-1 px-2 py-1 rounded bg-indigo-600 text-white font-bold text-[10px]"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span>{s.commissionRate}%</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-700 dark:text-zinc-300 font-semibold">{s.rating} ★</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          s.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {s.status === 'pending' && (
                          <button
                            onClick={() => approveSeller(s.id)}
                            className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-500"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingSellerId(s.id);
                            setCommissionRateInput(s.commissionRate);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-bold text-[10px] hover:bg-slate-300"
                        >
                          Edit Rate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
