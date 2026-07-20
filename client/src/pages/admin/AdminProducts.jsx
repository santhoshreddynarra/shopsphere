import React, { useEffect, useState } from 'react';
import { Package, Plus } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance.js';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/products?limit=100'); // Assuming limit query works
        setProducts(res.data.products);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Package className="w-8 h-8 text-indigo-600" /> Products
        </h1>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.images[0]?.url || product.images[0]} alt={product.name} className="w-10 h-10 rounded object-cover" />
                    <span className="font-bold text-slate-900 line-clamp-1 max-w-[200px]">{product.name}</span>
                  </td>
                  <td className="p-4 font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-slate-600">{product.category?.name}</td>
                  <td className="p-4 text-slate-600">{product.stock}</td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 font-semibold hover:underline mr-3">Edit</button>
                    <button className="text-red-600 font-semibold hover:underline">Delete</button>
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

export default AdminProducts;
