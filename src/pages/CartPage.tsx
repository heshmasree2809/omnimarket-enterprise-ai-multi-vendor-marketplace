import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CheckoutModal } from '../components/CheckoutModal';
import { Order } from '../types/marketplace';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Lock } from 'lucide-react';

interface CartPageProps {
  onNavigateTab: (tab: string) => void;
  onOrderSuccess: (order: Order) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigateTab, onOrderSuccess }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    taxAmount,
    shippingAmount,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-zinc-500">Explore our catalog to find top deals across electronics, footwear, beauty, and luxury items.</p>
        <button
          onClick={() => onNavigateTab('shop')}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition-transform active:scale-95"
        >
          Browse Marketplace Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Shopping Cart</h1>
          <p className="text-xs text-zinc-500">{items.length} unique items selected</p>
        </div>
        <button onClick={() => onNavigateTab('shop')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity, selectedColor, selectedSize }) => (
            <div
              key={product.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-4 text-xs"
            >
              <img src={product.images[0]} alt={product.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />

              <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">{product.brand}</span>
                <h3 className="font-bold text-zinc-900 dark:text-white truncate">{product.title}</h3>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-zinc-500">
                  {selectedColor && <span>Color: {selectedColor}</span>}
                  {selectedSize && <span>Size: {selectedSize}</span>}
                  <span>Seller: {product.sellerName}</span>
                </div>

                <div className="text-indigo-600 dark:text-indigo-400 font-bold">
                  ${product.price.toFixed(2)} each
                </div>
              </div>

              {/* Quantity Selector & Item Total */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 font-bold">
                  <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-2.5 py-1 text-zinc-500 hover:text-white">
                    -
                  </button>
                  <span className="px-3 py-1 font-mono text-zinc-900 dark:text-white">{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-2.5 py-1 text-zinc-500 hover:text-white">
                    +
                  </button>
                </div>

                <span className="font-extrabold text-sm text-zinc-900 dark:text-white w-20 text-right">
                  ${(product.price * quantity).toFixed(2)}
                </span>

                <button onClick={() => removeFromCart(product.id)} className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Order Price Summary</h3>

            {/* Coupon Code Input */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4" /> Coupon ({appliedCoupon.code}) -{appliedCoupon.discountPercent}%
                  </span>
                  <button onClick={removeCoupon} className="text-zinc-400 hover:text-rose-500 text-[10px] underline">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. WELCOME10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                  <button type="submit" className="px-3 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold">
                    Apply
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Items Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Coupon Savings</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Estimated Sales Tax (8%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Shipping Fee</span>
                <span>{shippingAmount === 0 ? 'FREE (Orders over $100)' : `$${shippingAmount.toFixed(2)}`}</span>
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between font-extrabold text-base text-zinc-900 dark:text-white">
                <span>Estimated Total</span>
                <span className="text-indigo-600 dark:text-indigo-400">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-emerald-300" />
              <span>Proceed to Checkout</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Encrypted 256-Bit SSL Checkout</span>
            </div>
          </div>

        </div>

      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderComplete={(ord) => {
          setIsCheckoutOpen(false);
          onOrderSuccess(ord);
        }}
      />

    </div>
  );
};
