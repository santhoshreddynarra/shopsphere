import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import { fetchCart, updateQuantity, removeProduct } from '../features/cart/cartSlice.js';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart, isLoading } = useAppSelector((state) => state.cart);
  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQuantity = (productId, currentQty, newQty) => {
    if (newQty > 0 && productId) {
      dispatch(updateQuantity({ productId, quantity: newQty }));
    }
  };

  const handleRemoveItem = (productId) => {
    if (productId) {
      dispatch(removeProduct(productId));
    }
  };

  const rawProducts = cart?.products || [];
  const validProducts = rawProducts.filter(
    (item) => item && item.productId && (typeof item.productId === 'object' ? item.productId._id : item.productId)
  );

  if (isLoading && validProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Safe billing totals
  const itemsPrice = Number(cart?.itemsPrice || 0);
  const discount = Number(cart?.discount || 0);
  const shipping = Number(cart?.shipping || 0);
  const tax = Number(cart?.tax || 0);
  const totalAmount = Number(cart?.totalAmount || 0);
  const totalItemCount = validProducts.reduce((acc, item) => acc + (Number(item?.quantity) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

      {validProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Browse our products and find something you love!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {validProducts.map((item) => {
              const product = typeof item.productId === 'object' ? item.productId : {};
              const productId = product._id || item.productId;
              const name = product.name || 'Product';
              const brand = product.brand || '';
              const slug = product.slug || '';
              const image =
                product.images && product.images[0]
                  ? typeof product.images[0] === 'object'
                    ? product.images[0].url || ''
                    : product.images[0]
                  : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80';

              const price = Number(item.price || product.discountPrice || product.price || 0);
              const originalPrice = Number(product.price || 0);
              const discountPrice = Number(product.discountPrice || 0);
              const stock = Number(product.stock || 99);
              const quantity = Number(item.quantity || 1);

              return (
                <div
                  key={productId}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start transition hover:border-indigo-100"
                >
                  <Link to={slug ? `/products/${slug}` : '#'} className="shrink-0">
                    <img
                      src={image}
                      alt={name}
                      className="w-32 h-32 object-cover rounded-xl border border-slate-100"
                    />
                  </Link>

                  <div className="flex-grow flex flex-col justify-between h-full w-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Link to={slug ? `/products/${slug}` : '#'}>
                          <h3 className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition line-clamp-1">
                            {name}
                          </h3>
                        </Link>
                        {brand && <p className="text-sm text-slate-500 mt-1">{brand}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">₹{price.toLocaleString('en-IN')}</p>
                        {discountPrice > 0 && originalPrice > discountPrice && (
                          <p className="text-sm text-slate-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
                        <button
                          onClick={() => handleUpdateQuantity(productId, quantity, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition disabled:opacity-40"
                          disabled={isLoading || quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium text-slate-900 text-sm">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(productId, quantity, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition disabled:opacity-40"
                          disabled={isLoading || quantity >= stock}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Action */}
                      <button
                        onClick={() => handleRemoveItem(productId)}
                        className="text-sm font-medium text-slate-400 hover:text-red-600 flex items-center gap-1.5 transition"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItemCount} items)</span>
                  <span className="font-medium">₹{itemsPrice.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'font-medium text-emerald-600' : 'font-medium'}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Tax (18%)</span>
                  <span className="font-medium">₹{tax.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">Order Total</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <Link
                to={validProducts.length > 0 ? '/checkout' : '#'}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition shadow-lg ${
                  validProducts.length > 0
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                }`}
                onClick={(e) => {
                  if (validProducts.length === 0) e.preventDefault();
                }}
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-6 flex items-center justify-center gap-4 text-slate-400">
                <div className="flex items-center gap-1.5 text-xs">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
