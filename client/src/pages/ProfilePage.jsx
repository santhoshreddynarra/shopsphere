import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import { getProfileDetails, updateUserProfile } from '../features/auth/authSlice.js';
import { User, Mail, Shield, Calendar, Package, MapPin, Heart, Edit2, Check, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userInfo, isLoading, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      dispatch(getProfileDetails()).unwrap().catch(() => {
        // Fallback silently if cached userInfo is valid
      });
    }
  }, [dispatch, userInfo, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setUpdateLoading(true);
    try {
      const updateData = { name, email };
      if (password) updateData.password = password;

      await dispatch(updateUserProfile(updateData)).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
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
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Please log in</h2>
        <p className="text-slate-500 mb-6">You must be logged in to view your profile.</p>
        <Link to="/login" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
          Sign In
        </Link>
      </div>
    );
  }

  const joinDate = userInfo?.createdAt
    ? new Date(userInfo.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Member';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-extrabold text-3xl mx-auto mb-4 shadow-md shadow-indigo-100">
              {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{userInfo?.name || 'User'}</h2>
            <p className="text-sm text-slate-500 mb-4">{userInfo?.email || ''}</p>

            <div className="flex items-center justify-center gap-2 mb-6">
              {userInfo?.isAdmin ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
                  <Shield className="w-3.5 h-3.5" /> Administrator
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                  <User className="w-3.5 h-3.5" /> Customer Account
                </span>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Joined {joinDate}</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <Link to="/orders" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-sm transition">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-indigo-600" />
                <span>My Orders</span>
              </div>
              <span className="text-slate-400">&rarr;</span>
            </Link>
            <Link to="/addresses" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-sm transition">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span>Shipping Addresses</span>
              </div>
              <span className="text-slate-400">&rarr;</span>
            </Link>
            <Link to="/wishlist" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-sm transition">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-indigo-600" />
                <span>My Wishlist</span>
              </div>
              <span className="text-slate-400">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Profile Details & Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                <p className="text-sm text-slate-500">Update your account details and password</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setName(userInfo?.name || '');
                    setEmail(userInfo?.email || '');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      required
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100 disabled:text-slate-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      required
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100 disabled:text-slate-500 transition"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="pt-6 border-t border-slate-100 space-y-6">
                  <h4 className="font-bold text-slate-900 text-sm">Change Password <span className="font-normal text-slate-400">(leave blank to keep current)</span></h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-md shadow-indigo-200 disabled:opacity-50"
                    >
                      {updateLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Updating...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
