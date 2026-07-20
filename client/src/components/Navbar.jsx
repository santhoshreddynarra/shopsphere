import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, LogOut, Menu, X, ShoppingCart, Heart, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import { logout } from '../features/auth/authSlice.js';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userInfo } = useAppSelector((s) => s.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-indigo-200">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-900 font-extrabold text-xl tracking-tight">
              Shop<span className="text-indigo-600">Sphere</span>
            </span>
          </Link>

          {/* Search bar – desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-xl mx-8"
          >
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-full text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </form>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/products"
              className="text-slate-600 hover:text-indigo-600 text-sm font-semibold transition-colors"
            >
              Explore
            </Link>
            
            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              <Link to="/wishlist" className="text-slate-500 hover:text-indigo-600 transition-colors relative">
                <Heart className="w-5 h-5" />
              </Link>
              <Link to="/cart" className="text-slate-500 hover:text-indigo-600 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
              </Link>
            </div>

            {userInfo ? (
              <div className="flex items-center gap-3 ml-2 group relative">
                <button className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {userInfo.name.charAt(0)}
                  </div>
                  <span className="text-sm">{userInfo.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2">
                  <Link to="/profile" className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 text-left w-full"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-indigo-600 text-sm font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm shadow-indigo-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/cart" className="text-slate-500 relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
            </Link>
            <button
              className="text-slate-600 hover:text-indigo-600 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-4 shadow-xl">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </form>
          <div className="flex flex-col gap-2">
            <Link
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className="text-slate-600 font-medium px-2 py-2 hover:bg-slate-50 rounded-lg"
            >
              Explore Products
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setIsMenuOpen(false)}
              className="text-slate-600 font-medium px-2 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <Heart className="w-4 h-4" /> Wishlist
            </Link>
          </div>
          
          <div className="border-t border-slate-100 pt-4">
            {userInfo ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-600 font-medium px-2 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> Profile ({userInfo.name})
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="text-red-600 font-medium px-2 py-2 hover:bg-red-50 rounded-lg flex items-center gap-2 text-left"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-semibold px-4 py-2.5 rounded-xl transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
