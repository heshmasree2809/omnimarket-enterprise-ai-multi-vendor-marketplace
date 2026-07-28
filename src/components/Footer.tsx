import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Send, ShieldCheck, Truck, RefreshCw, CreditCard, Sparkles } from 'lucide-react';

export const Footer: React.FC<{ onSelectCategory: (categorySlug: string) => void }> = ({ onSelectCategory }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    showToast('Subscribed to OmniMarket VIP Deals & Weekly AI Curations!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800 pt-12 pb-8 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-zinc-800">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Express Global Delivery</h4>
              <p className="mt-1 text-zinc-500 leading-relaxed">Free standard shipping on orders over $100 with live GPS order tracking.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Buyer Protection</h4>
              <p className="mt-1 text-zinc-500 leading-relaxed">100% money-back guarantee with zero-fee 30-day hassle-free returns.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/50 text-purple-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">AI Recommendation Engine</h4>
              <p className="mt-1 text-zinc-500 leading-relaxed">Smart semantic search and personalized product discovery powered by Gemini.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/50 text-amber-400 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Secure Payment Gateway</h4>
              <p className="mt-1 text-zinc-500 leading-relaxed">256-Bit encrypted transactions supporting Stripe, Apple Pay, UPI & Cards.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-base">
                O
              </div>
              <span className="text-base font-bold text-white tracking-tight">OmniMarket</span>
            </div>
            <p className="text-zinc-500 max-w-sm leading-relaxed">
              The modern multi-vendor e-commerce platform built for high-scale merchants, AI-guided shopping experiences, and instant global distribution.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-2">
              <label className="block text-zinc-300 font-semibold">Join the VIP Newsletter</label>
              <div className="flex items-center max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-l-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-r-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">Shop Categories</h5>
            <ul className="space-y-2 text-zinc-400">
              <li><button onClick={() => onSelectCategory('electronics')} className="hover:text-white transition-colors">Electronics & Audio</button></li>
              <li><button onClick={() => onSelectCategory('computers')} className="hover:text-white transition-colors">Computers & Laptops</button></li>
              <li><button onClick={() => onSelectCategory('mobile-phones')} className="hover:text-white transition-colors">Smartphones</button></li>
              <li><button onClick={() => onSelectCategory('shoes')} className="hover:text-white transition-colors">Sneakers & Footwear</button></li>
              <li><button onClick={() => onSelectCategory('beauty')} className="hover:text-white transition-colors">Beauty & Cosmetics</button></li>
              <li><button onClick={() => onSelectCategory('luxury')} className="hover:text-white transition-colors">Luxury Collectibles</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">Seller Portal</h5>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#seller" className="hover:text-white transition-colors">Merchant Application</a></li>
              <li><a href="#analytics" className="hover:text-white transition-colors">Sales & Revenue Analytics</a></li>
              <li><a href="#ai-tools" className="hover:text-white transition-colors">AI Product Description Generator</a></li>
              <li><a href="#payouts" className="hover:text-white transition-colors">Express Payouts</a></li>
              <li><a href="#fulfillment" className="hover:text-white transition-colors">Fulfillment by OmniMarket</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">Company & Support</h5>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#careers" className="hover:text-white transition-colors">Careers & Engineering</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">24/7 AI Customer Support</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500">
          <p>© 2026 OmniMarket Inc. All rights reserved. Built for high performance e-commerce.</p>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">VISA</span>
            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">MASTERCARD</span>
            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">APPLE PAY</span>
            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">STRIPE</span>
            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">UPI</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
