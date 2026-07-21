import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import { updateProfile, clearError } from '../features/auth/authSlice.js';
import { User, Mail, Lock, ShieldCheck, Package, MapPin, Heart, ShoppingCart, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { userInfo, isLoading, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    dispatch(clearError());

    if (password && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const updateData = { name, email };
      if (password) {
        updateData.password = password;
      }
      const result = await dispatch(updateProfile(updateData)).unwrap();
      toast.success('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    }
  };

  if (!userInfo && isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Please log in to view your profile</h2>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const memberDate = userInfo.createdAt 
    ? new Date(userInfo.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Valued Customer';

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Account</h1>
          <p className="text-slate-500 mt-1">Manage your personal information, security, and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User Card Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-3xl font-extrabold mx-auto mb-4 shadow-lg shadow-indigo-200">
                {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{userInfo.name}</h2>
              <p className="text-sm text-slate-500 mb-3">{userInfo.email}</p>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold mb-4">
                <ShieldCheck className="w-4 h-4" />
                {userInfo.isAdmin ? 'Administrator' : 'Customer Account'}
              </div>

              <div className="border-t border-slate-100 pt-4 text-xs text-slate-400">
                Member since {memberDate}
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 space-y-1">
              <Link
                to="/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium transition"
              >
                <Package className="w-5 h-5 text-slate-400" />
                My Orders
              </Link>
              <Link
                to="/addresses"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium transition"
              >
                <MapPin className="w-5 h-5 text-slate-400" />
                Saved Addresses
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium transition"
              >
                <Heart className="w-5 h-5 text-slate-400" />
                Wishlist
              </Link>
              <Link
                to="/cart"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium transition"
              >
                <ShoppingCart className="w-5 h-5 text-slate-400" />
                Shopping Cart
              </Link>
            </div>
          </div>

          {/* Profile Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>

              {message && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition text-sm"
                    />
                  </div>
                </div>

                <hr className="border-slate-100 my-6" />
                <h3 className="text-md font-bold text-slate-900">Change Password (Optional)</h3>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition text-sm"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition text-sm"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
