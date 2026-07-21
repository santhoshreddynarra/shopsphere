import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance.js';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/orders', { withCredentials: true });
      setOrders(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axiosInstance.put(`/orders/${id}/status`, { status }, { withCredentials: true });
      fetchOrders(); // Refresh
    } catch (err) {
      alert('Error updating status');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'Paid') return order.isPaid;
    if (filter === 'Unpaid') return !order.isPaid;
    return true; // 'All'
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const statuses = ['Processing', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-indigo-600" /> Orders
        </h1>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Filter:</span>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-slate-900 font-bold focus:outline-none"
          >
            <option value="All">All Orders</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-mono text-sm text-slate-500">{order._id.substring(18)}</td>
                  <td className="p-4 font-bold text-slate-900">{order.user?.name || 'Unknown'}</td>
                  <td className="p-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-slate-900">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    {order.isPaid ? (
                      <div>
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded mb-1">
                          Paid
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {order.paymentProvider || 'Unknown'} • {order.paymentResult?.id?.substring(0, 10)}...
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-2 py-1 rounded">
                        Unpaid
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
