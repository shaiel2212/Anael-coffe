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
        <h1 className="text-2xl font-heading font-semibold text-rustic-ink">{t('nav.dashboard')}</h1>
        <p className="text-rustic-inkSoft mt-1">ברוך הבא, {user?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="rustic-card p-5">
            <div className={`w-11 h-11 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <p className="text-sm text-rustic-inkSoft">{card.label}</p>
            <p className={`text-2xl font-heading font-semibold mt-1 ${card.color}`}>{loading ? '...' : card.value}</p>
          </div>
        ))}
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div className="rustic-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="font-heading font-semibold text-rustic-ink">{t('inventory.lowStock')}</h2>
            <span className="text-xs bg-rustic-sand/50 text-rustic-wood px-2 py-0.5 rounded-full font-mono">{lowStock.length}</span>
          </div>
          <div className="space-y-2">
            {lowStock.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-rustic-sand/20 rounded-xl">
                <span className="font-medium text-rustic-ink text-sm">{item.name}</span>
                <span className="text-sm text-rustic-wood font-mono">{parseFloat(item.current_quantity).toFixed(2)} {item.unit}</span>
              </div>
            ))}
          </div>
          {lowStock.length > 5 && (
            <Link to="/admin/inventory" className="text-sm text-rustic-wood font-medium mt-3 block text-center hover:underline">
              + {lowStock.length - 5} נוספים
            </Link>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('menu.addProduct'), path: '/admin/menu', icon: '☕', color: 'bg-rustic-sand/40 text-rustic-wood' },
          { label: t('inventory.addItem'), path: '/admin/inventory', icon: '📦', color: 'bg-rustic-sand/30 text-rustic-woodDark' },
          { label: t('employees.addEmployee'), path: '/admin/employees', icon: '👤', color: 'bg-rustic-olive/20 text-rustic-olive' },
          { label: t('finance.addRecord'), path: '/admin/finance', icon: '💰', color: 'bg-rustic-beige/30 text-rustic-ink' },
        ].map((action) => (
          <Link key={action.label} to={action.path} className={`${action.color} rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-90 transition-opacity border border-rustic-sand/30`}>
            <span className="text-2xl">{action.icon}</span>
            <span className="text-sm font-medium text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
