export type UserRole = 'customer' | 'seller' | 'admin';

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface SellerProfile {
  storeName: string;
  description: string;
  logo: string;
  banner?: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  joinedDate: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: UserRole;
  emailVerified: boolean;
  addresses: Address[];
  createdAt: string;
  sellerProfile?: SellerProfile;
}

export interface ProductSpecification {
  [key: string]: string;
}

export interface ProductVideoMedia {
  id: string;
  url: string;
  title: string;
  posterUrl?: string;
  duration?: string;
  type?: 'demo' | 'review' | 'unboxing' | '360';
}

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  bulletPoints?: string[];
  price: number;
  originalPrice: number;
  discountPercent: number;
  category: string;
  brand: string;
  sku: string;
  stock: number;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  rating: number;
  reviewCount: number;
  images: string[];
  videoUrl?: string;
  videoMedia?: ProductVideoMedia[];
  hasVideoShowcase?: boolean;
  specifications: ProductSpecification;
  tags: string[];
  isFlashSale?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  flashSaleEnd?: string;
  createdAt: string;
  warranty: string;
  returnPolicy: string;
  deliveryDays: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  description: string;
  productCount: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  likesCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
  sellerName: string;
  sellerId: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: 'credit_card' | 'apple_pay' | 'upi' | 'mock_stripe';
  paymentStatus: 'paid' | 'pending' | 'failed';
  trackingNumber: string;
  trackingCarrier: string;
  createdAt: string;
  estimatedDelivery: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minSpend: number;
  maxDiscount: number;
  expiresAt: string;
  isActive: boolean;
  description: string;
}

export interface FilterState {
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  hasDiscount: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  searchQuery: string;
}

export interface AISearchResult {
  matchingProductIds: string[];
  reasoning: string;
}

export interface AIReviewSummaryResult {
  summary: string;
  pros: string[];
  cons: string[];
  verdict: string;
}

export interface AIDescriptionResult {
  description: string;
  suggestedTags: string[];
  bulletPoints: string[];
}
