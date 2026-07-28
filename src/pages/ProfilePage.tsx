import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/ProductCard';
import { OrderTracker } from '../components/OrderTracker';
import { Product } from '../types/marketplace';
import { UserCheck, ShieldCheck, MapPin, Package, Heart, CheckCircle2, Truck, Clock, Search } from 'lucide-react';

export const ProfilePage: React.FC<{ onSelectProduct: (product: Product) => void }> = ({ onSelectProduct }) => {
  const { user, verifyEmail } = useAuth();
  const { orders, wishlistIds, products, updateOrderStatus } = useMarketplace();
  const [trackingSearch, setTrackingSearch] = useState('');

  const userOrders = orders.filter((o) => o.userId === user?.id || o.customerName === user?.name || true);
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  const filteredOrders = trackingSearch.trim()
    ? userOrders.filter(
        (o) =>
          o.id.toLowerCase().includes(trackingSearch.toLowerCase()) ||
          o.trackingNumber.toLowerCase().includes(trackingSearch.toLowerCase())
      )
    : userOrders;

  return (
    <div className="space-y-10 pb-16">
      
      {/* Account Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src={user?.avatar} alt={user?.name} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-lg" />
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              {user?.name}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase border border-indigo-500/30">
                {user?.role}
              </span>
            </h1>
            <p className="text-xs text-zinc-400">{user?.email}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Member since {user?.createdAt}</p>
          </div>
        </div>

        {/* Email Verification Status */}
        <div className="flex items-center gap-3">
          {user?.emailVerified ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verified Account</span>
            </div>
          ) : (
            <button
              onClick={verifyEmail}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              Verify Email Address
            </button>
          )}
        </div>
      </div>

      {/* Orders Timeline & Live Order Tracking Progress */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-500" />
              <span>Order Tracking & History</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Monitor real-time shipment status updates, progress bars, and transit checkpoints.
            </p>
          </div>

          {/* Quick Tracking Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Order ID or Tracking #"
              value={trackingSearch}
              onChange={(e) => setTrackingSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-2">
            <Package className="w-10 h-10 text-zinc-400 mx-auto" />
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No orders match your search</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {trackingSearch ? 'Try searching for a different Order ID or Tracking Number.' : 'Place an order in the shop to track live deliveries!'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((ord) => (
              <OrderTracker
                key={ord.id}
                order={ord}
                onUpdateStatus={updateOrderStatus}
                showAdminControls={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Saved Wishlist */}
      <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <span>My Saved Wishlist ({wishlistedProducts.length})</span>
        </h2>

        {wishlistedProducts.length === 0 ? (
          <p className="text-xs text-zinc-500">Your wishlist is empty. Tap the heart icon on any item to save it for later.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelectProduct={onSelectProduct} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
