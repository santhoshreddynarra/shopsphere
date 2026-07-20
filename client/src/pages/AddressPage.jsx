import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from '../features/address/addressSlice.js';
import { Plus, Edit2, Trash2, MapPin, Check } from 'lucide-react';

const AddressPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { addresses, isLoading } = useAppSelector((state) => state.address);
  const { userInfo } = useAppSelector((state) => state.auth);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    addressType: 'home',
    isDefault: false
  });

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchAddresses());
    } else {
      navigate('/login');
    }
  }, [dispatch, userInfo, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address._id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateAddress({ id: editingId, addressData: formData }));
    } else {
      dispatch(addAddress(formData));
    }
    
    // Reset form
    setShowForm(false);
    setEditingId(null);
    setFormData({
      fullName: '', phone: '', addressLine1: '', addressLine2: '',
      city: '', state: '', postalCode: '', country: 'India',
      addressType: 'home', isDefault: false
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      dispatch(deleteAddress(id));
    }
  };

  const handleSetDefault = (address) => {
    dispatch(updateAddress({ id: address._id, addressData: { ...address, isDefault: true } }));
  };

  if (isLoading && addresses.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <MapPin className="w-8 h-8 text-indigo-600" />
          My Addresses
        </h1>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add New Address
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <input required type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address Line 1</label>
                <input required type="text" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address Line 2 (Optional)</label>
                <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Postal Code</label>
                <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Country</label>
                <input required type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="addressType" value="home" checked={formData.addressType === 'home'} onChange={handleInputChange} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Home</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="addressType" value="work" checked={formData.addressType === 'work'} onChange={handleInputChange} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Work</span>
              </label>
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded" />
              <span className="text-sm font-medium text-slate-700">Set as default address</span>
            </label>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm disabled:opacity-70">
                {isLoading ? 'Saving...' : 'Save Address'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-white text-slate-600 border border-slate-200 px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address._id} className={`bg-white p-6 rounded-2xl border transition-all shadow-sm flex flex-col ${address.isDefault ? 'border-indigo-500 shadow-indigo-100' : 'border-slate-200 hover:border-slate-300'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  {address.fullName}
                  <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full uppercase tracking-wide font-bold">
                    {address.addressType}
                  </span>
                </h3>
                {address.isDefault && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md mt-2">
                    <Check className="w-3 h-3" /> Default Address
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(address)} className="text-slate-400 hover:text-indigo-600 p-1.5 transition">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(address._id)} className="text-slate-400 hover:text-red-500 p-1.5 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-slate-600 text-sm space-y-1 mb-6 flex-grow">
              <p>{address.addressLine1}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>{address.city}, {address.state} {address.postalCode}</p>
              <p>{address.country}</p>
              <p className="pt-2 font-medium">Phone: {address.phone}</p>
            </div>

            {!address.isDefault && (
              <button 
                onClick={() => handleSetDefault(address)}
                className="w-full text-center py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 font-semibold text-sm rounded-xl transition border border-slate-200 hover:border-indigo-200"
              >
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>
      
      {addresses.length === 0 && !showForm && (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No addresses found</h3>
          <p className="text-slate-500">You haven't saved any addresses yet.</p>
        </div>
      )}
    </div>
  );
};

export default AddressPage;
