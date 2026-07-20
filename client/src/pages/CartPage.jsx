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
    if (userInfo) {
      dispatch(fetchCart());
    } else {
      navigate('/login');
    }
  }, [dispatch, userInfo, navigate]);

  const handleUpdateQuantity = (productId, currentQty, newQty) => {
    if (newQty > 0) {
      dispatch(updateQuantity({ productId, quantity: newQty }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeProduct(productId));
  };

  if (isLoading && (!cart?.products || cart.products.length === 0)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const validProducts = (cart?.products || []).filter(item => item?.productId);

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
            Looks like you haven't added anything to your cart yet. Browse our categories and find something you love!
          </p>
          <Link
            to="/"
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
            {validProducts.map((item) => (
              <div key={item.productId._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start transition hover:border-indigo-100">
                <Link to={`/product/${item.productId.slug}`} className="shrink-0">
                  <img
                    src={item.productId.images[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80'}
                    alt={item.productId.name}
                    className="w-32 h-32 object-cover rounded-xl border border-slate-100"
                  />
                </Link>
                
                <div className="flex-grow flex flex-col justify-between h-full w-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Link to={`/product/${item.productId.slug}`}>
                        <h3 className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition line-clamp-1">
                          {item.productId.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-slate-500 mt-1">{item.productId.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">₹{item.price.toLocaleString('en-IN')}</p>
                      {item.productId.discountPrice > 0 && item.productId.price > item.productId.discountPrice && (
                        <p className="text-sm text-slate-400 line-through">₹{item.productId.price.toLocaleString('en-IN')}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId._id, item.quantity, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition"
                        disabled={isLoading || item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium text-slate-900 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId._id, item.quantity, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition"
                        disabled={isLoading || item.quantity >= item.productId.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Remove Action */}
                    <button
                      onClick={() => handleRemoveItem(item.productId._id)}
                      className="text-sm font-medium text-slate-400 hover:text-red-600 flex items-center gap-1.5 transition"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({validProducts.length} items)</span>
                  <span className="font-medium">₹{cart?.totalAmount?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping estimate</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax estimate</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t border-slate-200 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">Order Total</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ₹{cart?.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
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
