import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/useRedux.js';
import { fetchCart } from './features/cart/cartSlice.js';
import { fetchWishlist } from './features/wishlist/wishlistSlice.js';
import { logout } from './features/auth/authSlice.js';
import MainLayout from './layouts/MainLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import AddressPage from './pages/AddressPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import OrderDetailsPage from './pages/OrderDetailsPage.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';

const AppInit = ({ children }) => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      // Restore Cart and Wishlist on App Startup
      dispatch(fetchCart()).unwrap().catch((err) => {
        if (err === 'Not authorized, token failed' || err === 'Not authorized, no token') {
          dispatch(logout()); // Token expired/invalid
        }
      });
      dispatch(fetchWishlist()).unwrap().catch((err) => {
        // Handled by cart fetch above
      });
    }
  }, [dispatch, userInfo]);

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <AppInit>
        <Routes>
          {/* Auth pages — no layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Public pages with layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailsPage />} />
            <Route path="/category/:categorySlug" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>

          {/* Protected pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<div className="max-w-7xl mx-auto py-6 px-4 text-slate-200">Profile</div>} />
            <Route path="/addresses" element={<AddressPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
            <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </AppInit>
    </BrowserRouter>
  );
};

export default App;
