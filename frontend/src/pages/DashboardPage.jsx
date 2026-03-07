import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Package, Users, DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), 'yyyy-MM-dd');
  const monthStart = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');

  useEffect(() => {
    Promise.all([
      api.get(`/finance/summary?from=${monthStart}&to=${today}`),
      api.get('/inventory?low_stock=true'),
    ])
      .then(([financeRes, inventoryRes]) => {
        setSummary(financeRes.data);
        setLowStock(inventoryRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: t('finance.totalIncome'),
      value: summary ? `₪${summary.total_income.toFixed(2)}` : '---',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: t('finance.totalExpense'),
      value: summary ? `₪${summary.total_expense.toFixed(2)}` : '---',
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: t('finance.netProfit'),
      value: summary ? `₪${summary.net_profit.toFixed(2)}` : '---',
      icon: DollarSign,
      color: summary?.net_profit >= 0 ? 'text-green-600' : 'text-red-600',
      bg: summary?.net_profit >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      label: t('inventory.lowStock'),
      value: lowStock.length,
      icon: AlertTriangle,
      color: lowStock.length > 0 ? 'text-amber-600' : 'text-gray-600',
      bg: lowStock.length > 0 ? 'bg-amber-50' : 'bg-gray-50',
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('nav.dashboard')}</h1>
        <p className="text-gray-500 mt-1">ברוך הבא, {user?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`w-11 h-11 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{loading ? '...' : card.value}</p>
          </div>
        ))}
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-gray-900">{t('inventory.lowStock')}</h2>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{lowStock.length}</span>
          </div>
          <div className="space-y-2">
            {lowStock.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                <span className="font-medium text-gray-800 text-sm">{item.name}</span>
                <span className="text-sm text-amber-700">{parseFloat(item.current_quantity).toFixed(2)} {item.unit}</span>
              </div>
            ))}
          </div>
          {lowStock.length > 5 && (
            <Link to="/admin/inventory" className="text-sm text-amber-700 font-medium mt-3 block text-center hover:underline">
              + {lowStock.length - 5} נוספים
            </Link>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('menu.addProduct'), path: '/admin/menu', icon: '☕', color: 'bg-amber-50 text-amber-700' },
          { label: t('inventory.addItem'), path: '/admin/inventory', icon: '📦', color: 'bg-blue-50 text-blue-700' },
          { label: t('employees.addEmployee'), path: '/admin/employees', icon: '👤', color: 'bg-green-50 text-green-700' },
          { label: t('finance.addRecord'), path: '/admin/finance', icon: '💰', color: 'bg-purple-50 text-purple-700' },
        ].map((action) => (
          <Link key={action.label} to={action.path} className={`${action.color} rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity`}>
            <span className="text-2xl">{action.icon}</span>
            <span className="text-sm font-medium text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
