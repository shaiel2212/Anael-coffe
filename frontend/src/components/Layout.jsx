import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, UtensilsCrossed, Package, Users, DollarSign,
  Settings, LogOut, Menu, X, Coffee
} from 'lucide-react';

const navItems = [
  { key: 'dashboard', path: '/admin', icon: LayoutDashboard },
  { key: 'menu', path: '/admin/menu', icon: UtensilsCrossed },
  { key: 'inventory', path: '/admin/inventory', icon: Package },
  { key: 'employees', path: '/admin/employees', icon: Users },
  { key: 'finance', path: '/admin/finance', icon: DollarSign },
];

export default function Layout({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 p-6 border-b border-gray-100">
          <div className="w-10 h-10 bg-amber-700 rounded-xl flex items-center justify-center">
            <Coffee className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{user?.cafe?.name}</p>
            <p className="text-xs text-gray-500">{user?.name}</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(({ key, path, icon: Icon }) => (
            <Link
              key={key}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(path)
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {t(`nav.${key}`)}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 px-4 py-3 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Coffee className="w-6 h-6 text-amber-700" />
            <span className="font-bold text-gray-900">{user?.cafe?.name}</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
