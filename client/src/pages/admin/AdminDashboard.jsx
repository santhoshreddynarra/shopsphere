import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux.js';
import { fetchDashboardStats } from '../../features/admin/adminSlice.js';
import { Users, ShoppingCart, IndianRupee, Package, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { stats, isLoading } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${card.bg}`}>
                <Icon className={`w-7 h-7 ${card.color}`} />
              </div>
              <div>
                <p className="text-slate-500 font-medium text-sm">{card.title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 flex items-center gap-4">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
          <div>
            <h3 className="text-lg font-bold text-amber-900">Pending Orders</h3>
            <p className="text-amber-700">You have {stats.pendingOrders} orders waiting to be processed.</p>
          </div>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 flex items-center gap-4">
          <AlertTriangle className="w-10 h-10 text-red-500" />
          <div>
            <h3 className="text-lg font-bold text-red-900">Low Stock Alerts</h3>
            <p className="text-red-700">{stats.lowStockProducts} products are running low on stock.</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Revenue Overview</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.monthlyRevenue}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
