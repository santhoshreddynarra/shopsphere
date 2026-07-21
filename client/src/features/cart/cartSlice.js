import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService.js';

const defaultCartState = {
  products: [],
  itemsPrice: 0,
  discount: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  totalAmount: 0,
};

const initialState = {
  cart: defaultCartState,
  isLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    if (!auth.userInfo) {
      const localCart = JSON.parse(
        localStorage.getItem('cart') || JSON.stringify(defaultCartState)
      );
      return calculateGuestCartTotals(localCart.products);
    }
    const data = await cartService.getCart();
    return data || defaultCartState;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const calculateGuestCartTotals = (products = []) => {
  let itemsPrice = 0;
  let discountAmount = 0;

  const validItems = (products || []).filter((item) => item && item.productId);

  validItems.forEach((item) => {
    const product = typeof item.productId === 'object' ? item.productId : {};
    const price = Number(product.price || item.price || 0);
    const discountPrice = Number(product.discountPrice || 0);
    const qty = Number(item.quantity || 1);

    itemsPrice += price * qty;
    if (discountPrice > 0 && price > discountPrice) {
      discountAmount += (price - discountPrice) * qty;
    }
  });

  const subtotal = Math.max(0, itemsPrice - discountAmount);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 999 || validItems.length === 0 ? 0 : 99;
  const totalAmount = subtotal + tax + shipping;

  return {
    products: validItems,
    itemsPrice,
    discount: discountAmount,
    subtotal,
    tax,
    shipping,
    totalAmount,
  };
};

export const addToCart = createAsyncThunk('cart/addToCart', async (payload, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    const productId = payload.productId || payload.product?._id;
    const quantity = Number(payload.quantity) || 1;

    if (!auth.userInfo) {
      if (!payload.product && !productId) throw new Error('Product details missing for guest cart');

      const localCart = JSON.parse(localStorage.getItem('cart') || '{"products":[]}');
      const existingItemIndex = (localCart.products || []).findIndex((p) => {
        const id = typeof p.productId === 'object' ? p.productId._id : p.productId;
        return id === productId;
      });

      if (existingItemIndex >= 0) {
        localCart.products[existingItemIndex].quantity =
          (Number(localCart.products[existingItemIndex].quantity) || 0) + quantity;
      } else {
        localCart.products.push({
          productId: payload.product || productId,
          quantity,
        });
      }

      const updatedCart = calculateGuestCartTotals(localCart.products);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    }

    await cartService.addToCart({ productId, quantity });
    const data = await cartService.getCart();
    return data || defaultCartState;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ productId, quantity }, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    if (!auth.userInfo) {
      const localCart = JSON.parse(localStorage.getItem('cart') || '{"products":[]}');
      const existingItemIndex = (localCart.products || []).findIndex((p) => {
        const id = typeof p.productId === 'object' ? p.productId._id : p.productId;
        return id === productId;
      });

      if (existingItemIndex >= 0) {
        localCart.products[existingItemIndex].quantity = quantity;
      }

      const updatedCart = calculateGuestCartTotals(localCart.products);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    }

    await cartService.updateQuantity(productId, quantity);
    const data = await cartService.getCart();
    return data || defaultCartState;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const removeProduct = createAsyncThunk('cart/removeProduct', async (productId, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    if (!auth.userInfo) {
      const localCart = JSON.parse(localStorage.getItem('cart') || '{"products":[]}');
      localCart.products = (localCart.products || []).filter((p) => {
        const id = typeof p.productId === 'object' ? p.productId._id : p.productId;
        return id !== productId;
      });

      const updatedCart = calculateGuestCartTotals(localCart.products);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    }

    await cartService.removeProduct(productId);
    const data = await cartService.getCart();
    return data || defaultCartState;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    if (!auth.userInfo) {
      localStorage.removeItem('cart');
      return defaultCartState;
    }

    await cartService.clearCart();
    return defaultCartState;
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
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload || defaultCartState;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload || defaultCartState;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Quantity
      .addCase(updateQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload || defaultCartState;
        state.error = null;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Remove Product
      .addCase(removeProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload || defaultCartState;
        state.error = null;
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = defaultCartState;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Clear Cart on Logout
      .addCase('auth/logout/fulfilled', (state) => {
        state.cart = defaultCartState;
        state.error = null;
      });
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
