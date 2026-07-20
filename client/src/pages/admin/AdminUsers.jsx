import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux.js';
import { fetchUsers, updateRole } from '../../features/admin/adminSlice.js';
import { Users, Shield, User as UserIcon } from 'lucide-react';

const AdminUsers = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleToggle = (id, currentRole) => {
    if (window.confirm(`Are you sure you want to change this user to ${currentRole ? 'Customer' : 'Admin'}?`)) {
      dispatch(updateRole({ id, isAdmin: !currentRole }));
    }
  };

  if (isLoading && users.length === 0) {
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
          <Users className="w-8 h-8 text-indigo-600" /> Users
        </h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-mono text-sm text-slate-500">{user._id.substring(18)}</td>
                  <td className="p-4 font-bold text-slate-900">{user.name}</td>
                  <td className="p-4 text-slate-600">{user.email}</td>
                  <td className="p-4">
                    {user.isAdmin ? (
                      <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-bold border border-indigo-200">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200">
                        <UserIcon className="w-3 h-3" /> Customer
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleRoleToggle(user._id, user.isAdmin)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                        user.isAdmin ? 'text-slate-600 bg-slate-100 hover:bg-slate-200' : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                      }`}
                    >
                      {user.isAdmin ? 'Demote to Customer' : 'Make Admin'}
                    </button>
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

export default AdminUsers;
