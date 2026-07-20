import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux.js';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Store } from 'lucide-react';
import { logout } from '../features/auth/authSlice.js';

const AdminLayout = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  if (!userInfo || !userInfo.isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex fixed h-full z-10">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black text-indigo-600 mb-2">
            <Store className="w-8 h-8" />
            ShopSphere
          </Link>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-10">Admin Panel</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
