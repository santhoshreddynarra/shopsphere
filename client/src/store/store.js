import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import productReducer from '../features/products/productSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
});
