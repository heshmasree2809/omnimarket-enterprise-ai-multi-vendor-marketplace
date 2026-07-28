import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { Address, Order } from '../types/marketplace';
import { ShieldCheck, CreditCard, Lock, CheckCircle2, ArrowRight, Download, Truck, Tag, X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderComplete }) => {
  const { items, subtotal, discountAmount, taxAmount, shippingAmount, totalAmount, appliedCoupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useMarketplace();

  const [step, setStep] = useState<'address' | 'payment' | 'processing' | 'success'>('address');
  const [couponInput, setCouponInput] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<Address>(
    user?.addresses[0] || {
      id: 'addr-default',
      name: user?.name || 'Alex Rivera',
      street: '742 Evergreen Terrace',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'United States',
      phone: '+1 (555) 019-2834',
    }
  );

  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'upi' | 'mock_stripe'>('credit_card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888',
    cardName: user?.name || 'Alex Rivera',
  });

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleApplyCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  const handleProcessPayment = async () => {
    setStep('processing');
    const order = await placeOrder(
      selectedAddress,
      paymentMethod,
      cardDetails,
      items,
      { subtotal, discountAmount, taxAmount, shippingAmount, totalAmount }
    );

    if (order) {
      setCompletedOrder(order);
      clearCart();
      setStep('success');
      onOrderComplete(order);
    } else {
      setStep('payment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              Express Secure Checkout
            </h3>
            <p className="text-xs text-zinc-500">Encrypted 256-Bit SSL Payment Gateway</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          
          {/* STEP 1: Address */}
          {step === 'address' && (
            <div className="space-y-6">
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">1. Select Shipping Address</h4>
              
              <div className="p-4 rounded-2xl border-2 border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-white">
                  <span>{selectedAddress.name}</span>
                  <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">Primary</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300">{selectedAddress.street}</p>
                <p className="text-zinc-500">{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}, {selectedAddress.country}</p>
                <p className="text-zinc-500 font-mono pt-1">{selectedAddress.phone}</p>
              </div>

              {/* Order Summary Snapshot */}
              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs space-y-2">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal ({items.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Estimated Tax</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Express Delivery</span>
                  <span>{shippingAmount === 0 ? 'FREE' : `$${shippingAmount.toFixed(2)}`}</span>
                </div>
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between font-bold text-sm text-zinc-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="text-indigo-600 dark:text-indigo-400">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setStep('payment')}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Payment Method</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 'payment' && (
            <div className="space-y-6">
              
              {/* Coupon Bar */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      Coupon "{appliedCoupon.code}" active (-${discountAmount.toFixed(2)})
                    </span>
                    <button onClick={removeCoupon} className="text-zinc-400 hover:text-rose-500 text-[11px] underline">Remove</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try coupon code: WELCOME10 or FLASH20"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white"
                    />
                    <button type="submit" className="px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs">
                      Apply
                    </button>
                  </form>
                )}
              </div>

              <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">2. Select Payment Method</h4>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'credit_card', label: 'Credit Card', icon: '💳' },
                  { id: 'apple_pay', label: 'Apple Pay', icon: '🍏' },
                  { id: 'mock_stripe', label: 'Stripe / UPI', icon: '⚡' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === m.id
                        ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-600'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className="text-base">{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Card Inputs */}
              <div className="space-y-3 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs">
                <div>
                  <label className="block font-medium text-zinc-500 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardDetails.cardName}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-500 mb-1">Card Number (Mock Sandbox)</label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-mono text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-zinc-500 mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardDetails.cardExp}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardExp: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-mono text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-zinc-500 mb-1">CVC / CVV</label>
                    <input
                      type="password"
                      value={cardDetails.cardCvc}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardCvc: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-mono text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep('address')}
                  className="px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Back
                </button>
                <button
                  onClick={handleProcessPayment}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>Pay ${totalAmount.toFixed(2)} Now</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Processing */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <h4 className="font-bold text-base text-zinc-900 dark:text-white">Authorizing Payment...</h4>
              <p className="text-xs text-zinc-500 max-w-sm">
                Communicating with Payment Abstraction Layer & verifying authorization keys securely.
              </p>
            </div>
          )}

          {/* STEP 4: Success Receipt */}
          {step === 'success' && completedOrder && (
            <div className="py-6 space-y-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-500 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-bold text-lg text-zinc-900 dark:text-white">Order Confirmed! #{completedOrder.id}</h4>
                <p className="text-xs text-zinc-500 mt-1">A receipt and tracking confirmation has been dispatched to {completedOrder.customerEmail}</p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Tracking Number:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{completedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Carrier:</span>
                  <span className="font-medium">{completedOrder.trackingCarrier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Estimated Delivery:</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">{completedOrder.estimatedDelivery}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs"
              >
                Done
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
