import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService.js';

const initialState = {
  cart: { products: [], totalAmount: 0 },
  isLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    if (!auth.userInfo) {
      const localCart = JSON.parse(localStorage.getItem('cart') || '{"products":[], "totalAmount":0, "itemsPrice":0, "tax":0, "shipping":0, "discount":0, "subtotal":0}');
      return localCart;
    }
    return await cartService.getCart();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const calculateGuestCartTotals = (products = []) => {
  let itemsPrice = 0;
  let discountAmount = 0;
  
  (products || []).forEach(item => {
    if (!item) return;
    const product = item.productId || item.product || {};
    const price = typeof product.price === 'number' ? product.price : 0;
    const discountPrice = typeof product.discountPrice === 'number' ? product.discountPrice : 0;
    const quantity = Number(item.quantity) || 1;

    itemsPrice += price * quantity;
    if (discountPrice > 0 && price > discountPrice) {
      discountAmount += (price - discountPrice) * quantity;
    }
  });
  
  const subtotal = Math.max(0, itemsPrice - discountAmount);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const totalAmount = subtotal + tax + shipping;

  return { products, itemsPrice, discount: discountAmount, subtotal, tax, shipping, totalAmount };
};

export const addToCart = createAsyncThunk('cart/addToCart', async (payload, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    // Payload might be { product, quantity } for guest, but { productId, quantity } for logged in.
    // Ensure we handle both.
    const productId = payload.productId || payload.product._id;
    const quantity = payload.quantity;

    if (!auth.userInfo) {
      if (!payload.product) throw new Error('Product details missing for guest cart');
      
      const localCart = JSON.parse(localStorage.getItem('cart') || '{"products":[]}');
      const existingItemIndex = localCart.products.findIndex(p => p.productId._id === productId);
      
      if (existingItemIndex >= 0) {
        localCart.products[existingItemIndex].quantity += quantity;
      } else {
        localCart.products.push({
          productId: payload.product,
          quantity
        });
      }
      
      const updatedCart = calculateGuestCartTotals(localCart.products);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    }

    await cartService.addToCart({ productId, quantity });
    return await cartService.getCart(); // Fetch full populated cart
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ productId, quantity }, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    if (!auth.userInfo) {
      const localCart = JSON.parse(localStorage.getItem('cart') || '{"products":[]}');
      const existingItemIndex = localCart.products.findIndex(p => p.productId._id === productId);
      
      if (existingItemIndex >= 0) {
        localCart.products[existingItemIndex].quantity = quantity;
      }
      
      const updatedCart = calculateGuestCartTotals(localCart.products);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    }

    await cartService.updateQuantity(productId, quantity);
    return await cartService.getCart(); // Fetch full populated cart
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const removeProduct = createAsyncThunk('cart/removeProduct', async (productId, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    if (!auth.userInfo) {
      const localCart = JSON.parse(localStorage.getItem('cart') || '{"products":[]}');
      localCart.products = localCart.products.filter(p => p.productId._id !== productId);
      
      const updatedCart = calculateGuestCartTotals(localCart.products);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    }

    await cartService.removeProduct(productId);
    return await cartService.getCart(); // Fetch full populated cart
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    if (!auth.userInfo) {
      localStorage.removeItem('cart');
      return { products: [], totalAmount: 0 };
    }

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
