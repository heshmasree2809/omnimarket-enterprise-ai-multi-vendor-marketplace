import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, Review, Coupon, Order, FilterState, Address } from '../types/marketplace';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_REVIEWS, INITIAL_COUPONS, INITIAL_ORDERS } from '../data/mockData';
import { useToast } from './ToastContext';
import { paymentService, PaymentRequest } from '../services/paymentService';

interface MarketplaceContextType {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  coupons: Coupon[];
  orders: Order[];
  wishlistIds: string[];
  compareIds: string[];
  recentlyViewedIds: string[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggleCompare: (productId: string) => void;
  isComparing: (productId: string) => boolean;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setCompareModalOpen: (open: boolean) => void;
  addRecentlyViewed: (productId: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date' | 'likesCount'>) => void;
  placeOrder: (shippingAddress: Address, paymentMethod: 'credit_card' | 'apple_pay' | 'upi' | 'mock_stripe', paymentDetails: any, cartItems: any[], orderTotals: any) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  isAIAssistantOpen: boolean;
  setAIAssistantOpen: (open: boolean) => void;
}

const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  brand: 'all',
  minPrice: 0,
  maxPrice: 2000,
  minRating: 0,
  inStockOnly: false,
  hasDiscount: false,
  sortBy: 'featured',
  searchQuery: '',
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('omni_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PRODUCTS.length) {
          return parsed;
        }
        // Merge missing initial products if saved is stale
        const existingIds = new Set(parsed.map((p: Product) => p.id));
        const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
        const merged = [...parsed, ...missing];
        localStorage.setItem('omni_products', JSON.stringify(merged));
        return merged;
      } catch (e) {
        console.error('Failed to parse saved products:', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('omni_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('omni_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('omni_wishlist');
    return saved ? JSON.parse(saved) : ['prod-101', 'prod-104'];
  });

  const [compareIds, setCompareIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('omni_compare');
    return saved ? JSON.parse(saved) : ['prod-101', 'prod-102'];
  });

  const [isCompareModalOpen, setCompareModalOpen] = useState<boolean>(false);

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(['prod-101', 'prod-102']);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isAIAssistantOpen, setAIAssistantOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('omni_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('omni_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('omni_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('omni_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('omni_compare', JSON.stringify(compareIds));
  }, [compareIds]);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to your wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  const toggleCompare = (productId: string) => {
    setCompareIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from compare list', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        if (prev.length >= 3) {
          showToast('You can compare up to 3 products at a time.', 'info');
          return prev;
        }
        showToast('Added to comparison table', 'success');
        return [...prev, productId];
      }
    });
  };

  const isComparing = (productId: string) => compareIds.includes(productId);

  const clearCompare = () => {
    setCompareIds([]);
    showToast('Comparison list cleared', 'info');
  };

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  };

  const addReview = (newRev: Omit<Review, 'id' | 'date' | 'likesCount'>) => {
    const created: Review = {
      ...newRev,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      likesCount: 0,
    };
    setReviews((prev) => [created, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === newRev.productId) {
          const prodRevList = [created, ...reviews.filter((r) => r.productId === p.id)];
          const totalRating = prodRevList.reduce((sum, r) => sum + r.rating, 0);
          const newAvg = Number((totalRating / prodRevList.length).toFixed(1));
          return { ...p, rating: newAvg, reviewCount: prodRevList.length };
        }
        return p;
      })
    );

    showToast('Thank you! Your product review has been published.', 'success');
  };

  const placeOrder = async (
    shippingAddress: Address,
    paymentMethod: 'credit_card' | 'apple_pay' | 'upi' | 'mock_stripe',
    paymentDetails: any,
    cartItems: any[],
    orderTotals: any
  ): Promise<Order | null> => {
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const payRequest: PaymentRequest = {
      orderId,
      amount: orderTotals.totalAmount,
      currency: 'USD',
      method: paymentMethod,
      details: paymentDetails,
    };

    const paymentResult = await paymentService.executePayment(payRequest);

    if (!paymentResult.success) {
      showToast(`Payment failed: ${paymentResult.message}`, 'error');
      return null;
    }

    const newOrder: Order = {
      id: orderId,
      userId: 'user-cust-1',
      customerName: shippingAddress.name,
      customerEmail: 'democustomer@omnimarket.com',
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.title,
        productImage: item.product.images[0],
        price: item.product.price,
        quantity: item.quantity,
        sellerName: item.product.sellerName,
        sellerId: item.product.sellerId,
      })),
      subtotal: orderTotals.subtotal,
      discountAmount: orderTotals.discountAmount,
      taxAmount: orderTotals.taxAmount,
      shippingAmount: orderTotals.shippingAmount,
      totalAmount: orderTotals.totalAmount,
      status: 'processing',
      shippingAddress,
      paymentMethod,
      paymentStatus: 'paid',
      trackingNumber: `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}-US`,
      trackingCarrier: 'FedEx Express',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Reduce product stock
    setProducts((prev) =>
      prev.map((p) => {
        const ordered = cartItems.find((item) => item.product.id === p.id);
        if (ordered) {
          return { ...p, stock: Math.max(0, p.stock - ordered.quantity) };
        }
        return p;
      })
    );

    showToast(`Order #${orderId} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order #${orderId} status updated to ${status.toUpperCase()}`, 'info');
  };

  const addProduct = (pData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>): Product => {
    const created: Product = {
      ...pData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewCount: 1,
    };
    setProducts((prev) => [created, ...prev]);
    showToast(`Product "${created.title}" listed successfully!`, 'success');
    return created;
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    showToast(`Product "${updatedProduct.title}" updated`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product deleted from inventory', 'info');
  };

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        categories,
        reviews,
        coupons,
        orders,
        wishlistIds,
        compareIds,
        recentlyViewedIds,
        filters,
        setFilters,
        resetFilters,
        toggleWishlist,
        isWishlisted,
        toggleCompare,
        isComparing,
        clearCompare,
        isCompareModalOpen,
        setCompareModalOpen,
        addRecentlyViewed,
        addReview,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        isAIAssistantOpen,
        setAIAssistantOpen,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return context;
};
