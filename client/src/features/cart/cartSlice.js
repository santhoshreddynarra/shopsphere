import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService.js';

const initialState = {
  cart: { products: [], totalAmount: 0 },
  isLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    return await cartService.getCart();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (cartData, thunkAPI) => {
  try {
    await cartService.addToCart(cartData);
    return await cartService.getCart(); // Fetch full populated cart
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ productId, quantity }, thunkAPI) => {
  try {
    await cartService.updateQuantity(productId, quantity);
    return await cartService.getCart(); // Fetch full populated cart
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const removeProduct = createAsyncThunk('cart/removeProduct', async (productId, thunkAPI) => {
  try {
    await cartService.removeProduct(productId);
    return await cartService.getCart(); // Fetch full populated cart
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, thunkAPI) => {
  try {
    await cartService.clearCart();
    return { products: [], totalAmount: 0 };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => { state.isLoading = false; state.cart = action.payload; state.error = null; })
      .addCase(fetchCart.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Add to Cart
      .addCase(addToCart.pending, (state) => { state.isLoading = true; })
      .addCase(addToCart.fulfilled, (state, action) => { state.isLoading = false; state.cart = action.payload; state.error = null; })
      .addCase(addToCart.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Update Quantity
      .addCase(updateQuantity.pending, (state) => { state.isLoading = true; })
      .addCase(updateQuantity.fulfilled, (state, action) => { state.isLoading = false; state.cart = action.payload; state.error = null; })
      .addCase(updateQuantity.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Remove Product
      .addCase(removeProduct.pending, (state) => { state.isLoading = true; })
      .addCase(removeProduct.fulfilled, (state, action) => { state.isLoading = false; state.cart = action.payload; state.error = null; })
      .addCase(removeProduct.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Clear Cart
      .addCase(clearCart.pending, (state) => { state.isLoading = true; })
      .addCase(clearCart.fulfilled, (state, action) => { state.isLoading = false; state.cart = action.payload; state.error = null; })
      .addCase(clearCart.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Clear Cart on Logout
      .addCase('auth/logout/fulfilled', (state) => {
        state.cart = { products: [], itemsPrice: 0, discount: 0, subtotal: 0, tax: 0, shipping: 0, totalAmount: 0 };
        state.error = null;
      });
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
