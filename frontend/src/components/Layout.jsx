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
    <div className="flex h-screen bg-rustic-cream" dir="rtl">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-rustic-ink/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-30 w-64 bg-rustic-paper border-l border-rustic-sand/40 shadow-rustic-lg transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 p-6 border-b border-rustic-sand/40">
          <div className="w-10 h-10 bg-rustic-wood rounded-xl flex items-center justify-center">
            <Coffee className="w-6 h-6 text-rustic-cream" />
          </div>
          <div>
            <p className="font-heading font-semibold text-rustic-ink text-sm">{user?.cafe?.name}</p>
            <p className="text-xs text-rustic-inkSoft/70 font-mono">{user?.name}</p>
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
                  ? 'bg-rustic-sand/40 text-rustic-wood'
                  : 'text-rustic-inkSoft hover:bg-rustic-sand/20 hover:text-rustic-ink'
              }`}
            >
              <Icon className="w-5 h-5" />
              {t(`nav.${key}`)}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-rustic-sand/40">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-700 hover:bg-red-50/80 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-rustic-linen border-b border-rustic-sand/40 shadow-rustic z-10 px-4 py-3 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-rustic-sand/20 text-rustic-ink">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Coffee className="w-6 h-6 text-rustic-wood" />
            <span className="font-heading font-semibold text-rustic-ink">{user?.cafe?.name}</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-rustic-cream">
          {children}
        </main>
      </div>
    </div>
  );
}
