import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Github, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">
                Shop<span className="text-indigo-400">Sphere</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-xs">
              Your premium e-commerce destination. Discover curated products across electronics, fashion, beauty, and more.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-slate-500 hover:text-indigo-400 transition"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-indigo-400 transition"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-indigo-400 transition"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Shop</h3>
            <ul className="space-y-2">
              {['Products', 'Electronics', 'Fashion', 'Beauty', 'Sports'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Products' ? '/products' : `/category/${item.toLowerCase()}`}
                    className="text-slate-400 hover:text-indigo-400 text-sm transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Company</h3>
            <ul className="space-y-2">
              {['About', 'Careers', 'Press', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} ShopSphere. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">Built with ❤️ using MERN Stack</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
