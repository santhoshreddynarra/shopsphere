import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import { fetchOrderById, cancelMyOrder, clearOrderError } from '../features/orders/orderSlice.js';
import { Package, Clock, CheckCircle2, Truck, XCircle, MapPin, CreditCard, Download, ArrowLeft } from 'lucide-react';

const getStatusIcon = (status) => {
  switch (status) {
    case 'Delivered': return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
    case 'Shipped':
    case 'Out for Delivery': return <Truck className="w-6 h-6 text-blue-500" />;
    case 'Cancelled': return <XCircle className="w-6 h-6 text-red-500" />;
    default: return <Clock className="w-6 h-6 text-amber-500" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Shipped':
    case 'Out for Delivery': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-amber-50 text-amber-700 border-amber-200';
  }
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { order, isLoading, error } = useAppSelector((state) => state.order);
  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(fetchOrderById(id));
    }
    return () => {
      dispatch(clearOrderError());
    }
  }, [dispatch, id, userInfo, navigate]);

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      dispatch(cancelMyOrder(id));
    }
  };

  if (isLoading && !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200">
          <h2 className="text-xl font-bold mb-2">Error loading order</h2>
          <p>{error}</p>
          <Link to="/orders" className="inline-block mt-4 text-indigo-600 font-semibold hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const canCancel = ['Pending', 'Confirmed'].includes(order.status);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/orders" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Order Details</h1>
          <p className="text-slate-500 font-mono">Order #{order._id}</p>
        </div>
        <div className="flex items-center gap-3">
          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition"
            >
              Cancel Order
            </button>
          )}
          <button className="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-100 transition flex items-center gap-2">
            <Download className="w-4 h-4" /> Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Banner */}
          <div className={`p-6 rounded-2xl border ${getStatusColor(order.status)} flex items-center gap-4`}>
            {getStatusIcon(order.status)}
            <div>
              <h2 className="text-lg font-bold">Status: {order.status}</h2>
              <p className="text-sm opacity-90 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" /> Items
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-xl border border-slate-100"
                  />
                  <div className="flex-1">
                    <Link to={`/products/${item.product}`} className="font-bold text-slate-900 hover:text-indigo-600 transition text-lg line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-sm text-slate-500 mt-1">Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-right font-bold text-slate-900 text-lg">
                    ₹{(item.price * item.qty).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Items Total</span>
                <span className="font-medium text-slate-900">₹{order.itemsPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-slate-900">₹{order.shippingPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium text-slate-900">₹{order.taxPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-indigo-600">
                  ₹{order.totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" /> Delivery Address
            </h2>
            <div className="text-sm text-slate-600 space-y-1 mb-8">
              <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-2">Phone: {order.shippingAddress.phone}</p>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" /> Payment Info
            </h2>
            <div className="text-sm text-slate-600">
              <p className="mb-2">Method: <span className="font-bold text-slate-900">{order.paymentMethod}</span></p>
              {order.isPaid ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" /> Paid on {new Date(order.paidAt).toLocaleDateString()}
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                  <Clock className="w-4 h-4" /> Not Paid
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
