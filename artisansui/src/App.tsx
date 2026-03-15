import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductDetailPage from "./pages/ProductDetailPage";
import AuthPage from "./pages/AuthPage";
import RoleSelect from "./pages/RoleSelect";
import PrivateRoute from "./routes/PrivateRoute";
import AuthGuard from "./routes/AuthGuard";
import ScrollToTop from "./components/ScrollToTop";
import StoriesPage from "./pages/StoriesPage";
import StoryDetailPage from "./pages/StoryDetailPage";
import BulkOrderPage from "./pages/BulkOrderPage";

/* SELLER */
import SellerLayout from "./pages/seller/SellerLayout";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import { CartProvider } from "./context/CartContext";
import ChatbotWindow from "./components/ChatbotWindow";
import ChatbotButton from "./components/ChatbotButton";
import ShopPage from "./pages/ShopPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import AdminPanel from "./pages/AdminPanel";
import AboutUs from "./pages/AboutUs";
import CheckoutPage from "./pages/CheckoutPage";

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <CartProvider>
      <div className="app-layout">
        <Header />
        <ScrollToTop />

        <main className="page-content">
          <Routes>
            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/story/:id" element={<StoryDetailPage />} />
            <Route path="/track-order" element={<OrderTrackingPage />} />
            <Route path="/bulk-order" element={<BulkOrderPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            {/* ================= ADMIN ================= */}
            <Route path="/admin" element={<AdminPanel />} />
            {/* ================= AUTH ================= */}
            <Route
              path="/role"
              element={
                <AuthGuard>
                  <RoleSelect />
                </AuthGuard>
              }
            />
            <Route
              path="/auth/:role"
              element={
                <AuthGuard>
                  <AuthPage />
                </AuthGuard>
              }
            />
            {/* ================= SELLER (NESTED) ================= */}
            <Route
              path="/seller"
              element={
                <PrivateRoute>
                  <SellerLayout />
                </PrivateRoute>
              }
            >
              {/* Default seller landing page */}
              <Route index element={<SellerDashboard />} />

              {/* Seller product management */}
              <Route path="products" element={<SellerProducts />} />
            </Route>
            {/* FALLBACK */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
        {/* ===== CHATBOT GLOBAL ===== */}
        {isChatOpen && <ChatbotWindow />}
        <ChatbotButton onClick={() => setIsChatOpen((prev) => !prev)} />
      </div>
    </CartProvider>
  );
};

export default App;
