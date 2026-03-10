import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { format } from 'date-fns';

const INCOME_CATEGORIES = ['מכירות', 'אירועים', 'קייטרינג', 'אחר'];
const EXPENSE_CATEGORIES = ['חומרי גלם', 'שכר', 'שכירות', 'חשמל/מים', 'ציוד', 'שיווק', 'אחר'];

function RecordForm({ record, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    type: record?.type || 'income',
    category: record?.category || '',
    amount: record?.amount || '',
    description: record?.description || '',
    date: record?.date || format(new Date(), 'yyyy-MM-dd'),
  });
  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-rustic-ink mb-1">{t('finance.type')}</label>
        <div className="grid grid-cols-2 gap-2">
          {['income', 'expense'].map(type => (
            <button key={type} type="button" onClick={() => setForm({ ...form, type, category: '' })}
              className={`py-2 rounded-xl text-sm font-medium border transition-colors ${form.type === type ? (type === 'income' ? 'bg-green-600 text-white border-green-600' : 'bg-red-600 text-white border-red-600') : 'border-rustic-sand/60 text-rustic-inkSoft hover:bg-rustic-sand/20'}`}>
              {t(`finance.${type}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-rustic-ink mb-1">{t('finance.category')}</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 rustic-input">
            <option value="">בחר קטגוריה</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-rustic-ink mb-1">{t('finance.amount')} (₪)</label>
          <input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full px-3 py-2 rustic-input" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-rustic-ink mb-1">{t('finance.date')}</label>
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full px-3 py-2 rustic-input" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-rustic-ink mb-1">{t('finance.description')}</label>
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 rustic-input" />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-rustic-sand rounded-xl text-rustic-inkSoft hover:bg-rustic-sand/20">{t('common.cancel')}</button>
        <button type="submit" className="px-4 py-2 rustic-btn-primary">{t('common.save')}</button>
      </div>
    </form>
  );
}

export default function FinancePage() {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [modal, setModal] = useState({ open: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', page: 1 });
  const today = format(new Date(), 'yyyy-MM-dd');
  const monthStart = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');

  const loadRecords = async () => {
    try {
      const params = new URLSearchParams({ from: monthStart, to: today, page: filter.page, limit: 20 });
      if (filter.type) params.set('type', filter.type);
      const { data } = await api.get(`/finance?${params}`);
      setRecords(data.records);
    } catch { toast.error(t('common.error')); }
    finally { setLoading(false); }
  };

  const loadSummary = async () => {
    try {
      const { data } = await api.get(`/finance/summary?from=${monthStart}&to=${today}`);
      setSummary(data);
    } catch { console.error('summary error'); }
  };

  useEffect(() => { loadRecords(); loadSummary(); }, [filter]);

  const handleSubmit = async (form) => {
    try {
      if (modal.data) {
        await api.put(`/finance/${modal.data.id}`, form);
        toast.success('רשומה עודכנה');
      } else {
        await api.post('/finance', form);
        toast.success('רשומה נוספה');
      }
      setModal({ open: false, data: null });
      loadRecords();
      loadSummary();
    } catch { toast.error(t('common.error')); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/finance/${deleteDialog.id}`);
      toast.success('רשומה נמחקה');
      setDeleteDialog({ open: false, id: null });
      loadRecords();
      loadSummary();
    } catch { toast.error(t('common.error')); }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-semibold text-rustic-ink">{t('finance.title')}</h1>
        <button onClick={() => setModal({ open: true, data: null })}
          className="flex items-center gap-2 rustic-btn-primary text-sm px-4 py-2">
          <Plus className="w-4 h-4" /> {t('finance.addRecord')}
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rustic-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-rustic-inkSoft">{t('finance.totalIncome')}</p>
            </div>
            <p className="text-2xl font-bold text-green-600">₪{summary.total_income.toFixed(2)}</p>
          </div>
          <div className="rustic-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-sm text-rustic-inkSoft">{t('finance.totalExpense')}</p>
            </div>
            <p className="text-2xl font-bold text-red-600">₪{summary.total_expense.toFixed(2)}</p>
          </div>
          <div className="rustic-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 ${summary.net_profit >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded-xl flex items-center justify-center`}>
                <DollarSign className={`w-5 h-5 ${summary.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <p className="text-sm text-rustic-inkSoft">{t('finance.netProfit')}</p>
            </div>
            <p className={`text-2xl font-bold ${summary.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₪{summary.net_profit.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {[['', 'הכל'], ['income', t('finance.income')], ['expense', t('finance.expense')]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter({ type: val, page: 1 })}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${filter.type === val ? 'bg-amber-700 text-white border-amber-700' : 'border-rustic-sand/60 text-rustic-inkSoft hover:bg-rustic-sand/20'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Records Table */}
      <div className="rustic-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[t('finance.date'), t('finance.type'), t('finance.category'), t('finance.description'), t('finance.amount'), t('common.actions')].map(h => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-medium text-rustic-inkSoft uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-rustic-sand/40">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-rustic-inkSoft">{t('common.loading')}</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-rustic-inkSoft">אין רשומות</td></tr>
              ) : records.map(rec => (
                <tr key={rec.id} className="hover:bg-rustic-sand/20">
                  <td className="px-4 py-3 text-rustic-inkSoft text-sm">{rec.date}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${rec.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {t(`finance.${rec.type}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-rustic-inkSoft text-sm">{rec.category || '-'}</td>
                  <td className="px-4 py-3 text-rustic-inkSoft text-sm">{rec.description || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${rec.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {rec.type === 'expense' ? '-' : '+'}₪{parseFloat(rec.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setModal({ open: true, data: rec })} className="p-1.5 hover:bg-rustic-sand/30 rounded-lg text-rustic-inkSoft">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteDialog({ open: true, id: rec.id })} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, data: null })}
        title={modal.data ? 'ערוך רשומה' : t('finance.addRecord')}>
        <RecordForm record={modal.data} onSubmit={handleSubmit} onCancel={() => setModal({ open: false, data: null })} />
      </Modal>

      <ConfirmDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete} title="אישור מחיקה" message="האם אתה בטוח שברצונך למחוק רשומה זו?" />
    </div>
  );
}
