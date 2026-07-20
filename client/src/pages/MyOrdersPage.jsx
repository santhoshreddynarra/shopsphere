import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import { fetchMyOrders } from '../features/orders/orderSlice.js';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';

const getStatusIcon = (status) => {
  switch (status) {
    case 'Delivered': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case 'Shipped':
    case 'Out for Delivery': return <Truck className="w-5 h-5 text-blue-500" />;
    case 'Cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
    default: return <Clock className="w-5 h-5 text-amber-500" />;
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

const MyOrdersPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orders, isLoading } = useAppSelector((state) => state.order);
  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, userInfo, navigate]);

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
        <Package className="w-8 h-8 text-indigo-600" />
        My Orders
      </h1>

      {orders?.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            You haven't placed any orders. Start shopping to see your orders here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                  <div>
                    <p className="text-slate-500 font-medium mb-0.5">Order Placed</p>
                    <p className="font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium mb-0.5">Total</p>
                    <p className="font-bold text-slate-900">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium mb-0.5">Order #</p>
                    <p className="font-bold text-slate-900 font-mono">{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link 
                    to={`/orders/${order._id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm bg-indigo-50 px-4 py-2 rounded-lg transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  {getStatusIcon(order.status)}
                  <h3 className={`font-bold text-sm px-3 py-1 border rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </h3>
                </div>

                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-lg border border-slate-100"
                      />
                      <div className="flex-1">
                        <Link to={`/products/${item.product}`} className="font-semibold text-slate-900 hover:text-indigo-600 transition line-clamp-1">
                          {item.name}
                        </Link>
                        <p className="text-sm text-slate-500">Qty: {item.qty}</p>
                      </div>
                      <div className="text-right font-bold text-slate-900">
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
