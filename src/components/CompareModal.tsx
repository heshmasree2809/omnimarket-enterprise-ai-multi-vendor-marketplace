import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useCart } from '../context/CartContext';
import {
  X,
  Plus,
  Trash2,
  Check,
  Star,
  ShoppingBag,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRightLeft,
  Film,
  Zap,
} from 'lucide-react';
import { Product } from '../types/marketplace';

export const CompareModal: React.FC = () => {
  const {
    products,
    compareIds,
    toggleCompare,
    clearCompare,
    isCompareModalOpen,
    setCompareModalOpen,
  } = useMarketplace();

  const { addItemToCart } = useCart();

  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [addingSlotIndex, setAddingSlotIndex] = useState<number | null>(null);

  const selectedProducts = compareIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  if (compareIds.length === 0 && !isCompareModalOpen) return null;

  // Collect all unique specification keys across selected products
  const allSpecKeys: string[] = Array.from(
    new Set(
      selectedProducts.flatMap((p) => Object.keys(p.specifications || {}))
    )
  );

  // Helper to check if a row has differing values
  const hasDifference = (getValue: (p: Product) => string | number | boolean) => {
    if (selectedProducts.length <= 1) return false;
    const firstVal = getValue(selectedProducts[0]);
    return selectedProducts.some((p) => getValue(p) !== firstVal);
  };

  return (
    <>
      {/* FLOATING BOTTOM COMPARISON BAR */}
      {compareIds.length > 0 && !isCompareModalOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl bg-slate-900/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-indigo-500/30 text-white rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 overflow-x-auto py-1">
            <div className="flex items-center gap-2 pr-2 border-r border-zinc-700">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-extrabold tracking-tight">Compare Products</p>
                <p className="text-[10px] text-indigo-300 font-semibold">{compareIds.length} of 3 selected</p>
              </div>
            </div>

            {/* Selected Product Thumbnails */}
            <div className="flex items-center gap-2">
              {selectedProducts.map((p) => (
                <div
                  key={p.id}
                  className="relative group shrink-0 flex items-center gap-2 bg-slate-800/80 border border-zinc-700 rounded-xl p-1.5 pr-2"
                >
                  <img src={p.images[0]} alt={p.title} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="max-w-[100px] text-left hidden md:block">
                    <p className="text-[10px] font-bold text-white truncate">{p.title}</p>
                    <p className="text-[9px] font-extrabold text-emerald-400">${p.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => toggleCompare(p.id)}
                    className="p-1 rounded-full text-zinc-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                    title="Remove from compare"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Empty slot indicators up to 3 */}
              {Array.from({ length: 3 - selectedProducts.length }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 md:w-28 md:h-11 rounded-xl border border-dashed border-zinc-700 bg-slate-800/30 flex items-center justify-center text-zinc-500 text-[10px] font-semibold shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 md:mr-1" />
                  <span className="hidden md:inline">Add Item</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearCompare}
              className="px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
            >
              <span>Compare Now</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                {compareIds.length}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* FULLSIDE/FULLSCREEN COMPARISON MODAL DIALOG */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                      Side-by-Side Product Comparison
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-bold text-xs border border-indigo-400/30">
                      {selectedProducts.length} Selected
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Compare technical specs, ratings, prices, and warranties to find your perfect fit.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Highlight Differences Toggle */}
                {selectedProducts.length > 1 && (
                  <label className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-zinc-700 cursor-pointer text-xs font-semibold text-zinc-200 hover:bg-slate-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={highlightDifferences}
                      onChange={(e) => setHighlightDifferences(e.target.checked)}
                      className="rounded border-zinc-600 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Highlight Differences</span>
                  </label>
                )}

                <button
                  onClick={() => setCompareModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 text-zinc-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
              {selectedProducts.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <Sliders className="w-12 h-12 text-zinc-400 mx-auto" />
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No products selected for comparison</h3>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto">
                    Browse our catalog and click the "Compare" button on any product card to view side-by-side specs.
                  </p>
                  <button
                    onClick={() => setCompareModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow hover:bg-indigo-700"
                  >
                    Start Browsing
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr>
                        {/* Features Column Label Header */}
                        <th className="p-4 w-48 text-xs font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-950/60 rounded-tl-2xl border-b border-zinc-200 dark:border-zinc-800">
                          Product Overview
                        </th>

                        {/* Product Column Headers */}
                        {selectedProducts.map((prod) => (
                          <th
                            key={prod.id}
                            className="p-4 w-72 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 align-top"
                          >
                            <div className="space-y-3 relative group">
                              <button
                                onClick={() => toggleCompare(prod.id)}
                                className="absolute top-0 right-0 p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="aspect-square w-full max-w-[160px] mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700 relative">
                                <img
                                  src={prod.images[0]}
                                  alt={prod.title}
                                  className="w-full h-full object-cover"
                                />
                                {prod.hasVideoShowcase && (
                                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/90 text-indigo-400 text-[9px] font-extrabold flex items-center gap-1">
                                    <Film className="w-3 h-3" /> Video
                                  </span>
                                )}
                              </div>

                              <div>
                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                                  {prod.brand}
                                </span>
                                <h4 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2 mt-0.5">
                                  {prod.title}
                                </h4>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-base font-extrabold text-zinc-900 dark:text-white">
                                    ${prod.price.toFixed(2)}
                                  </span>
                                  {prod.originalPrice && (
                                    <span className="ml-2 text-xs text-zinc-400 line-through">
                                      ${prod.originalPrice.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span>{prod.rating}</span>
                                  <span className="text-zinc-400 text-[10px]">({prod.reviewCount})</span>
                                </div>
                              </div>

                              <button
                                onClick={() => addItemToCart(prod, 1)}
                                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                              >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Add to Cart</span>
                              </button>
                            </div>
                          </th>
                        ))}

                        {/* Fill empty column slot if under 3 products */}
                        {Array.from({ length: 3 - selectedProducts.length }).map((_, idx) => (
                          <th
                            key={idx}
                            className="p-4 w-72 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 align-middle text-center"
                          >
                            <div className="p-6 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2">
                              <Plus className="w-6 h-6 text-zinc-400" />
                              <p className="text-xs font-bold text-zinc-500">Compare Another Item</p>
                              <p className="text-[10px] text-zinc-400">Select another product from shop</p>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
                      {/* Price & Savings */}
                      <tr className={highlightDifferences && hasDifference((p) => p.price) ? 'bg-amber-50 dark:bg-amber-950/30' : ''}>
                        <td className="p-4 font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/60">
                          Price & Discount
                        </td>
                        {selectedProducts.map((p) => (
                          <td key={p.id} className="p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                            <p className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">${p.price.toFixed(2)}</p>
                            {p.discountPercent && (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold mt-1">
                                {p.discountPercent}% OFF
                              </span>
                            )}
                          </td>
                        ))}
                        {Array.from({ length: 3 - selectedProducts.length }).map((_, i) => (
                          <td key={i} className="p-4 text-zinc-400 text-center">-</td>
                        ))}
                      </tr>

                      {/* Stock & Availability */}
                      <tr className={highlightDifferences && hasDifference((p) => p.stock > 0) ? 'bg-amber-50 dark:bg-amber-950/30' : ''}>
                        <td className="p-4 font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/60">
                          Availability
                        </td>
                        {selectedProducts.map((p) => (
                          <td key={p.id} className="p-4">
                            {p.stock > 0 ? (
                              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({p.stock} units)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 font-bold text-rose-500">
                                <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                              </span>
                            )}
                          </td>
                        ))}
                        {Array.from({ length: 3 - selectedProducts.length }).map((_, i) => (
                          <td key={i} className="p-4 text-zinc-400 text-center">-</td>
                        ))}
                      </tr>

                      {/* Rating & Review Score */}
                      <tr className={highlightDifferences && hasDifference((p) => p.rating) ? 'bg-amber-50 dark:bg-amber-950/30' : ''}>
                        <td className="p-4 font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/60">
                          User Rating
                        </td>
                        {selectedProducts.map((p) => (
                          <td key={p.id} className="p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                              <span>★ {p.rating}</span>
                              <span className="text-zinc-500 font-normal">/ 5.0 ({p.reviewCount} reviews)</span>
                            </div>
                          </td>
                        ))}
                        {Array.from({ length: 3 - selectedProducts.length }).map((_, i) => (
                          <td key={i} className="p-4 text-zinc-400 text-center">-</td>
                        ))}
                      </tr>

                      {/* Brand & Category */}
                      <tr className={highlightDifferences && hasDifference((p) => p.brand) ? 'bg-amber-50 dark:bg-amber-950/30' : ''}>
                        <td className="p-4 font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/60">
                          Brand / Manufacturer
                        </td>
                        {selectedProducts.map((p) => (
                          <td key={p.id} className="p-4 font-bold text-zinc-800 dark:text-zinc-200">
                            {p.brand} ({p.sellerName})
                          </td>
                        ))}
                        {Array.from({ length: 3 - selectedProducts.length }).map((_, i) => (
                          <td key={i} className="p-4 text-zinc-400 text-center">-</td>
                        ))}
                      </tr>

                      {/* Dynamic Specifications Rows */}
                      {allSpecKeys.map((key: string) => {
                        const rowDiff = hasDifference((p) => (p.specifications ? p.specifications[key] : '') || 'N/A');
                        return (
                          <tr
                            key={key}
                            className={highlightDifferences && rowDiff ? 'bg-amber-50 dark:bg-amber-950/30' : ''}
                          >
                            <td className="p-4 font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/60">
                              {key}
                            </td>
                            {selectedProducts.map((p) => (
                              <td key={p.id} className="p-4 text-zinc-800 dark:text-zinc-200 font-medium">
                                {(p.specifications ? p.specifications[key] : '') || '—'}
                              </td>
                            ))}
                            {Array.from({ length: 3 - selectedProducts.length }).map((_, i) => (
                              <td key={i} className="p-4 text-zinc-400 text-center">-</td>
                            ))}
                          </tr>
                        );
                      })}

                      {/* Warranty & Guarantee */}
                      <tr className={highlightDifferences && hasDifference((p) => p.warranty) ? 'bg-amber-50 dark:bg-amber-950/30' : ''}>
                        <td className="p-4 font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/60">
                          Warranty Coverage
                        </td>
                        {selectedProducts.map((p) => (
                          <td key={p.id} className="p-4 text-zinc-800 dark:text-zinc-200">
                            {p.warranty || '1-Year Official Manufacturer Warranty'}
                          </td>
                        ))}
                        {Array.from({ length: 3 - selectedProducts.length }).map((_, i) => (
                          <td key={i} className="p-4 text-zinc-400 text-center">-</td>
                        ))}
                      </tr>

                      {/* Free Shipping & Delivery */}
                      <tr className={highlightDifferences && hasDifference((p) => p.isFlashSale || false) ? 'bg-amber-50 dark:bg-amber-950/30' : ''}>
                        <td className="p-4 font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/60">
                          Express Delivery
                        </td>
                        {selectedProducts.map((p) => (
                          <td key={p.id} className="p-4 text-zinc-800 dark:text-zinc-200">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              Free 2-Day Express Shipping
                            </span>
                          </td>
                        ))}
                        {Array.from({ length: 3 - selectedProducts.length }).map((_, i) => (
                          <td key={i} className="p-4 text-zinc-400 text-center">-</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
              <button
                onClick={clearCompare}
                className="px-4 py-2 rounded-xl text-zinc-500 hover:text-rose-500 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Selections</span>
              </button>

              <button
                onClick={() => setCompareModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs shadow hover:opacity-90"
              >
                Close Comparison
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
