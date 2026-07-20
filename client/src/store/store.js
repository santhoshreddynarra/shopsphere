import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import productReducer from '../features/products/productSlice.js';
import cartReducer from '../features/cart/cartSlice.js';
import wishlistReducer from '../features/wishlist/wishlistSlice.js';
import addressReducer from '../features/address/addressSlice.js';
import orderReducer from '../features/orders/orderSlice.js';
import adminReducer from '../features/admin/adminSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
    order: orderReducer,
    admin: adminReducer,
  },
});
