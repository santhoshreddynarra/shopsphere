import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Globe, Mail, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto pb-12 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-900 font-extrabold text-xl tracking-tight">
                Shop<span className="text-indigo-600">Sphere</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-md leading-relaxed">
              Your premium e-commerce destination. Discover meticulously curated products across electronics, fashion, beauty, and home living. Experience seamless shopping.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 font-bold mb-4 text-sm uppercase tracking-wider">Shop Departments</h3>
            <ul className="space-y-3">
              {['Products', 'Electronics', 'Fashion', 'Beauty', 'Sports'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Products' ? '/products' : `/category/${item.toLowerCase()}`}
                    className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-slate-900 font-bold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Press Center', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} ShopSphere. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Built with</span>
            <span className="text-red-500">❤️</span>
            <span className="text-slate-400 text-sm">for modern commerce</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
