import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider, useToast } from './context/ToastContext';

import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { CompareModal } from './components/CompareModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { ProfilePage } from './pages/ProfilePage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

import { Product, Order } from './types/marketplace';

const MainAppContent: React.FC = () => {
  const { setFilters } = useMarketplace();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categorySlug: string) => {
    setFilters((prev) => ({ ...prev, category: categorySlug }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    showToast(`Order #${order.id} placed successfully! Tracking number generated.`, 'success');
    setActiveTab('profile');
  };

  return (
    <div className="min-h-screen bg-[#F4FBF7] dark:bg-[#075985] text-slate-900 dark:text-sky-50 font-sans flex flex-col transition-colors duration-300 selection:bg-sky-500 selection:text-white">
      {/* Demo Role Switcher Bar */}
      <RoleSwitcherBar />

      {/* Main Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCart={() => {
          setActiveTab('cart');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTracking={() => setIsTrackingModalOpen(true)}
      />

      {/* Main Container View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            onSelectCategory={handleSelectCategory}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'shop' && (
          <ShopPage onSelectProduct={handleSelectProduct} />
        )}

        {activeTab === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onSelectProduct={handleSelectProduct}
            onNavigateBack={() => setActiveTab('shop')}
          />
        )}

        {activeTab === 'cart' && (
          <CartPage
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {(activeTab === 'profile' || activeTab === 'wishlist') && (
          <ProfilePage onSelectProduct={handleSelectProduct} />
        )}

        {activeTab === 'seller' && <SellerDashboardPage />}

        {activeTab === 'admin' && <AdminDashboardPage />}
      </main>

      {/* Global AI Assistant Drawer */}
      <AIAssistantDrawer />

      {/* Global Compare Products Drawer / Modal */}
      <CompareModal />

      {/* Global Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />

      {/* Footer */}
      <Footer onSelectCategory={handleSelectCategory} />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ThemeProvider>
          <MarketplaceProvider>
            <CartProvider>
              <MainAppContent />
            </CartProvider>
          </MarketplaceProvider>
        </ThemeProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
