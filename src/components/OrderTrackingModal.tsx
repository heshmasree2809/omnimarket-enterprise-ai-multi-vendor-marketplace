import React, { useState } from 'react';
import { X, Search, Package, ArrowRight, Truck, Sparkles, HelpCircle } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { OrderTracker } from './OrderTracker';
import { Order } from '../types/marketplace';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  const { orders, updateOrderStatus } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Match orders by ID or Tracking number
  const searchResults = searchQuery.trim()
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          o.trackingNumber.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : orders;

  const currentOrder: Order | undefined = selectedOrderId
    ? orders.find((o) => o.id === selectedOrderId)
    : searchResults[0] || orders[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Order Tracking & Live Status</h2>
              <p className="text-xs text-zinc-400">Track shipment progress, delivery status, and carrier updates in real-time.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-zinc-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
          
          {/* Order Search Box */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-indigo-500" />
              <span>Track By Order ID or Tracking Number</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Order ID (e.g., ORD-9821) or Tracking # (e.g., TRK-8849201)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedOrderId(null);
                }}
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-indigo-600 text-white shadow">
                <Search className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Search Quick Picks / Matching Orders */}
          {orders.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-[11px] font-bold text-zinc-400 shrink-0">Sample Orders:</span>
              {orders.map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    currentOrder?.id === ord.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>#{ord.id}</span>
                  <span className="text-[10px] opacity-75 uppercase">({ord.status})</span>
                </button>
              ))}
            </div>
          )}

          {/* Render Active Order Tracker Component */}
          {currentOrder ? (
            <OrderTracker
              order={currentOrder}
              onUpdateStatus={updateOrderStatus}
              showAdminControls={true}
            />
          ) : (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 p-6 space-y-3">
              <HelpCircle className="w-10 h-10 text-zinc-400 mx-auto" />
              <h4 className="font-bold text-zinc-800 dark:text-zinc-200">No order found matching "{searchQuery}"</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Check the tracking number or order ID from your confirmation email and try searching again.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-zinc-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>24/7 Live Express Tracking System</span>
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs shadow hover:opacity-90 transition-opacity"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
