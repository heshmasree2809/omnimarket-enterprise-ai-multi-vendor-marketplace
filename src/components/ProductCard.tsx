import React from 'react';
import { Product } from '../types/marketplace';
import { useCart } from '../context/CartContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { Heart, Star, ShoppingBag, Eye, Zap, ShieldCheck, Film, ArrowRightLeft, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickView,
}) => {
  const { addToCart } = useCart();
  const { products, toggleWishlist, isWishlisted, toggleCompare, isComparing } = useMarketplace();

  // Get live product from context state
  const currentProduct = products.find((p) => p.id === product.id) || product;
  const wishlisted = isWishlisted(currentProduct.id);
  const comparing = isComparing(currentProduct.id);

  const isLowStock = currentProduct.stock <= 20;

  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      
      {/* Top Image Container */}
      <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-950 overflow-hidden cursor-pointer" onClick={() => onSelectProduct(currentProduct)}>
        <img
          src={currentProduct.images[0]}
          alt={currentProduct.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {currentProduct.isFlashSale && (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-black font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-md tracking-wider uppercase animate-pulse">
              <Zap className="w-3 h-3 fill-current" />
              Flash Sale
            </span>
          )}
          {isLowStock && (
            <span className="inline-flex items-center gap-1 bg-rose-600/95 backdrop-blur-md text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-md tracking-wider uppercase border border-rose-400/30 animate-pulse">
              <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
              Only {currentProduct.stock} Left
            </span>
          )}
          {currentProduct.discountPercent > 0 && (
            <span className="inline-block bg-zinc-900/90 dark:bg-black/90 backdrop-blur-md text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow w-fit">
              {currentProduct.discountPercent}% OFF
            </span>
          )}
          {(currentProduct.hasVideoShowcase || currentProduct.videoUrl) && (
            <span className="inline-flex items-center gap-1 bg-indigo-600/90 backdrop-blur-md text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow tracking-wider uppercase w-fit">
              <Film className="w-2.5 h-2.5 text-indigo-300" />
              Video Reel
            </span>
          )}
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(currentProduct.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md shadow-md transition-transform active:scale-95 ${
              wishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 hover:text-rose-500'
            }`}
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(currentProduct.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md shadow-md transition-all active:scale-95 ${
              comparing
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            title={comparing ? 'Remove from Comparison' : 'Add to Compare'}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(currentProduct);
              }}
              className="p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 backdrop-blur-md shadow-md transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mb-1">
            <span>{currentProduct.brand}</span>
            <span className="truncate max-w-[100px] text-zinc-400">{currentProduct.category}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(currentProduct)}
            className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors leading-snug"
          >
            {currentProduct.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 ml-1">
                {currentProduct.rating}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400">
              ({currentProduct.reviewCount})
            </span>
            <span className="text-[10px] px-1.5 py-0.2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded ml-auto flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              {currentProduct.sellerName}
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-zinc-900 dark:text-white">
                ${currentProduct.price.toFixed(2)}
              </span>
              {currentProduct.originalPrice > currentProduct.price && (
                <span className="text-xs text-zinc-400 line-through">
                  ${currentProduct.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Free Delivery in {currentProduct.deliveryDays}d
            </p>
          </div>

          <button
            onClick={() => addToCart(currentProduct, 1)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold shadow transition-all active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

      </div>
    </div>
  );
};
