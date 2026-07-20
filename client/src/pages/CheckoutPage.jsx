import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import { fetchAddresses } from '../features/address/addressSlice.js';
import { fetchCart } from '../features/cart/cartSlice.js';
import axiosInstance from '../services/axiosInstance.js';
import { MapPin, CreditCard, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { userInfo } = useAppSelector((state) => state.auth);
  const { cart, isLoading: cartLoading } = useAppSelector((state) => state.cart);
  const { addresses, isLoading: addrLoading } = useAppSelector((state) => state.address);

  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(fetchCart());
      dispatch(fetchAddresses());
    }
  }, [dispatch, userInfo, navigate]);

  useEffect(() => {
    if (addresses?.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr._id);
    }
  }, [addresses, selectedAddress]);

  if (cart?.products?.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-6">Add some items to your cart to proceed with checkout.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    
    try {
      const deliveryAddr = addresses.find(a => a._id === selectedAddress);
      const orderData = {
        orderItems: cart.products.map(item => ({
          name: item.productId.name,
          qty: item.quantity,
          image: item.productId.images[0]?.url || item.productId.images[0],
          price: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
          product: item.productId._id
        })),
        shippingAddress: {
          fullName: deliveryAddr.fullName,
          addressLine1: deliveryAddr.addressLine1,
          city: deliveryAddr.city,
          postalCode: deliveryAddr.postalCode,
          country: deliveryAddr.country,
          phone: deliveryAddr.phone,
        },
        paymentMethod: 'Stripe',
      };

      const { data } = await axiosInstance.post('/orders', orderData, { withCredentials: true });
      navigate(`/payment/${data._id}`);
    } catch (error) {
      console.error('Failed to create order', error);
      alert('Failed to create order. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Details */}
        <div className="flex-1 space-y-6">
          
          {/* Address Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Delivery Address</h2>
            </div>

            {addrLoading ? (
              <p className="text-slate-500">Loading addresses...</p>
            ) : addresses?.length > 0 ? (
              <div className="space-y-4">
                {addresses.map((addr) => (
                  <label 
                    key={addr._id} 
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddress === addr._id ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-indigo-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        <input 
                          type="radio" 
                          name="deliveryAddress" 
                          value={addr._id}
                          checked={selectedAddress === addr._id}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-bold text-slate-900">{addr.fullName} <span className="text-xs font-semibold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full ml-2">{addr.addressType}</span></p>
                          {addr.isDefault && (
                            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br/>
                          {addr.city}, {addr.state} {addr.postalCode}<br/>
                          {addr.country}
                        </p>
                        <p className="text-sm font-medium text-slate-700 mt-2">Phone: {addr.phone}</p>
                      </div>
                    </div>
                  </label>
                ))}
                
                <Link to="/addresses" className="inline-block mt-4 text-indigo-600 font-semibold text-sm hover:text-indigo-700">
                  + Add a new address
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-500 mb-4">You have no saved addresses.</p>
                <Link to="/addresses" className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-100 transition">
                  <MapPin className="w-4 h-4" /> Add Delivery Address
                </Link>
              </div>
            )}
          </div>

          {/* Payment Method Placeholder */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm">
              Payment integration will be added in the next phase. You will be able to securely pay via Stripe or Razorpay.
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cart?.products?.map((item) => (
                <div key={item.productId._id} className="flex gap-4">
                  <img 
                    src={item.productId.images[0]?.url || 'https://via.placeholder.com/60'} 
                    alt={item.productId.name} 
                    className="w-16 h-16 object-cover rounded-lg border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{item.productId.name}</h4>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 mb-6">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Items ({cart?.products?.reduce((a, c) => a + c.quantity, 0)})</span>
                <span className="font-medium">₹{cart?.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Taxes</span>
                <span className="font-medium">₹0</span>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Order Total</span>
                <span className="text-2xl font-bold text-indigo-600">
                  ₹{cart?.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={!selectedAddress}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Payment
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
