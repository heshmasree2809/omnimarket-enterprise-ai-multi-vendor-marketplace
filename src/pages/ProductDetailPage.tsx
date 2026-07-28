import React, { useState } from 'react';
import { Product } from '../types/marketplace';
import { useCart } from '../context/CartContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductGallery } from '../components/ProductGallery';
import { ReviewSection } from '../components/ReviewSection';
import { ProductCard } from '../components/ProductCard';
import { Star, ShieldCheck, Truck, RotateCcw, Heart, ShoppingBag, Zap, Check, ArrowRightLeft, Flame, AlertTriangle, PackageCheck } from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onNavigateBack: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onSelectProduct,
  onNavigateBack,
}) => {
  const { addToCart } = useCart();
  const { products, toggleWishlist, isWishlisted, toggleCompare, isComparing } = useMarketplace();

  // Retrieve current live product state from MarketplaceContext
  const currentProduct = products.find((p) => p.id === product.id) || product;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(currentProduct.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(currentProduct.sizes?.[0] || '');

  const wishlisted = isWishlisted(currentProduct.id);
  const comparing = isComparing(currentProduct.id);

  const LOW_STOCK_THRESHOLD = 20;
  const isLowStock = currentProduct.stock <= LOW_STOCK_THRESHOLD;

  // Similar products in same category
  const similarProducts = products
    .filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Breadcrumb Back Button */}
      <button
        onClick={onNavigateBack}
        className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1"
      >
        ← Back to Catalog
      </button>

      {/* Main Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Gallery */}
        <ProductGallery
          images={product.images}
          title={product.title}
          videoUrl={product.videoUrl}
          videoMedia={product.videoMedia}
          hasVideoShowcase={product.hasVideoShowcase}
        />

        {/* Right Column: Product Meta & Purchase Box */}
        <div className="space-y-6">
          
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400">{currentProduct.brand}</span>
              <span>•</span>
              <span>{currentProduct.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white leading-tight">
              {currentProduct.title}
            </h1>

            {/* Rating & Merchant & Stock Badges */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
              <div className="flex items-center text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span>{currentProduct.rating}</span>
                <span className="text-zinc-400 font-normal ml-1">({currentProduct.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Merchant: {currentProduct.sellerName}</span>
              </div>

              {/* LOW STOCK BADGE */}
              {isLowStock && (
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full font-extrabold animate-pulse">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Only {currentProduct.stock} Left In Stock</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Box & Inventory Warning */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">${currentProduct.price.toFixed(2)}</span>
              {currentProduct.originalPrice > currentProduct.price && (
                <span className="text-base text-zinc-400 line-through">${currentProduct.originalPrice.toFixed(2)}</span>
              )}
              {currentProduct.discountPercent > 0 && (
                <span className="bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full uppercase">
                  Save {currentProduct.discountPercent}%
                </span>
              )}
            </div>

            {/* LOW STOCK WARNING LABEL AND INVENTORY BAR */}
            {isLowStock ? (
              <div className="pt-2 space-y-2 border-t border-zinc-200/80 dark:border-zinc-800">
                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-500/30 text-zinc-900 dark:text-zinc-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 animate-bounce" />
                    <span>High Demand Item — Only <strong className="text-rose-600 dark:text-rose-400 font-extrabold font-mono">{currentProduct.stock} units left</strong> in stock!</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-600 text-white shrink-0">
                    Selling Fast
                  </span>
                </div>

                {/* Visual Inventory Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-500">
                    <span>Stock Reserve</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{Math.round((currentProduct.stock / LOW_STOCK_THRESHOLD) * 100)}% available</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, (currentProduct.stock / LOW_STOCK_THRESHOLD) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 flex items-center gap-1.5 pt-1 border-t border-zinc-200/80 dark:border-zinc-800">
                <PackageCheck className="w-4 h-4 text-emerald-500" />
                In Stock: <strong className="text-zinc-900 dark:text-white font-mono">{currentProduct.stock} units</strong> available in warehouse
              </p>
            )}
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-zinc-900 dark:text-white">Color Variant: <span className="text-indigo-600 dark:text-indigo-400">{selectedColor}</span></label>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      selectedColor === c
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-600'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            
            {/* Quantity Controls */}
            <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden text-xs font-bold">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-3 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                -
              </button>
              <span className="px-4 py-3 text-zinc-900 dark:text-white font-mono">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-3 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(product, quantity, selectedColor, selectedSize)}
              className="flex-1 w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Shopping Cart</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-3.5 rounded-xl border transition-all ${
                wishlisted
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-rose-500'
              }`}
              title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Compare */}
            <button
              onClick={() => toggleCompare(product.id)}
              className={`p-3.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                comparing
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500'
              }`}
              title={comparing ? 'Remove from Compare' : 'Add to Compare'}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{comparing ? 'Comparing' : 'Compare'}</span>
            </button>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-500" />
              <span>Free Delivery in {product.deliveryDays} Days</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-500" />
              <span>30-Day Hassle-Free Return</span>
            </div>
          </div>

        </div>

      </div>

      {/* Product Description & Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Product Overview</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{product.description}</p>
        </div>

        {/* Specifications Table */}
        <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Technical Specifications</h4>
          <div className="space-y-2 text-xs divide-y divide-zinc-200 dark:divide-zinc-800">
            {Object.entries(product.specifications || {}).map(([key, value]) => (
              <div key={key} className="pt-2 flex justify-between gap-2">
                <span className="text-zinc-500">{key}</span>
                <span className="font-medium text-zinc-900 dark:text-white text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Reviews Component */}
      <ReviewSection product={product} />

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">You Might Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelectProduct={onSelectProduct} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
