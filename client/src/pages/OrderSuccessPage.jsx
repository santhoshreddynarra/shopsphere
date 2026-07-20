import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Package } from 'lucide-react';

const OrderSuccessPage = () => {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Order Placed Successfully!</h1>
      <p className="text-lg text-slate-500 mb-8">
        Thank you for your purchase. We have received your order and are getting it ready to ship.
      </p>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md mx-auto mb-10 shadow-sm text-left flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">Order Number</p>
          <p className="font-bold text-slate-900 font-mono tracking-wider">{id}</p>
        </div>
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
          <Package className="w-6 h-6" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link 
          to={`/orders/${id}`} 
          className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        >
          View Order Details
          <ChevronRight className="w-4 h-4" />
        </Link>
        <Link 
          to="/" 
          className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 hover:text-indigo-600 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
