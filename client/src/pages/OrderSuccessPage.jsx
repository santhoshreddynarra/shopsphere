import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Package, MapPin, Calendar, CreditCard } from 'lucide-react';
import axiosInstance from '../services/axiosInstance.js';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axiosInstance.get(`/orders/${id}`);
        setOrder(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load order details.');
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Order Not Found</h1>
        <p className="text-lg text-slate-500 mb-8">{error}</p>
        <Link 
          to="/" 
          className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Order Placed Successfully!</h1>
      <p className="text-lg text-slate-500 mb-10">
        Thank you for shopping with ShopSphere.<br/>
        Your order has been placed successfully.
      </p>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-2xl mx-auto mb-10 shadow-sm text-left">
        <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Order Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Order ID</p>
              <p className="font-bold text-slate-900 font-mono text-sm">{order._id}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Order Total</p>
              <p className="font-bold text-slate-900 text-lg">₹{order.totalPrice.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Estimated Delivery</p>
              <p className="font-bold text-slate-900">
                {estimatedDelivery.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Shipping Address</p>
              <p className="font-bold text-slate-900 text-sm">
                {order.shippingAddress.fullName}<br/>
                {order.shippingAddress.addressLine1}, {order.shippingAddress.city}<br/>
                {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Payment Method</p>
              <p className="font-bold text-slate-900 text-sm">Cash on Delivery</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Order Status</p>
              <p className="font-bold text-slate-900 text-sm">{order.status}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link 
          to="/" 
          className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
        >
          Continue Shopping
        </Link>
        <Link 
          to="/orders" 
          className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 hover:text-indigo-600 transition flex items-center justify-center gap-2"
        >
          Go to My Orders
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
