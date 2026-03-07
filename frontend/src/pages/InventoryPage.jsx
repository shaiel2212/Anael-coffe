import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, AlertTriangle, History, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

function ItemForm({ item, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: item?.name || '',
    unit: item?.unit || '',
    current_quantity: item?.current_quantity || 0,
    minimum_quantity: item?.minimum_quantity || 0,
    cost_per_unit: item?.cost_per_unit || '',
    supplier: item?.supplier || '',
    notes: item?.notes || '',
  });
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.name')}</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.unit')}</label>
          <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
            placeholder="kg, ליטר, יחידות"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.currentQty')}</label>
          <input type="number" step="0.001" value={form.current_quantity} onChange={(e) => setForm({ ...form, current_quantity: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.minQty')}</label>
          <input type="number" step="0.001" value={form.minimum_quantity} onChange={(e) => setForm({ ...form, minimum_quantity: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.costPerUnit')}</label>
          <input type="number" step="0.01" value={form.cost_per_unit} onChange={(e) => setForm({ ...form, cost_per_unit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.supplier')}</label>
          <input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
        <button type="submit" className="px-4 py-2 bg-amber-700 text-white rounded-xl hover:bg-amber-800">{t('common.save')}</button>
      </div>
    </form>
  );
}

function TransactionForm({ onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ type: 'in', quantity: '', notes: '' });
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.transactionType')}</label>
        <div className="grid grid-cols-3 gap-2">
          {['in', 'out', 'adjustment'].map(type => (
            <button key={type} type="button" onClick={() => setForm({ ...form, type })}
              className={`py-2 rounded-xl text-sm font-medium border transition-colors ${form.type === type ? 'bg-amber-700 text-white border-amber-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {t(`inventory.${type}`)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.quantity')}</label>
        <input type="number" step="0.001" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
        <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
        <button type="submit" className="px-4 py-2 bg-amber-700 text-white rounded-xl hover:bg-amber-800">{t('common.save')}</button>
      </div>
    </form>
  );
}

export default function InventoryPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      const { data } = await api.get(`/inventory${showLowStock ? '?low_stock=true' : ''}`);
      setItems(data);
    } catch { toast.error(t('common.error')); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadItems(); }, [showLowStock]);

  const handleItemSubmit = async (form) => {
    try {
      if (modal.data?.id && modal.type === 'item') {
        await api.put(`/inventory/${modal.data.id}`, form);
        toast.success('פריט עודכן');
      } else {
        await api.post('/inventory', form);
        toast.success('פריט נוסף');
      }
      setModal({ open: false, type: null, data: null });
      loadItems();
    } catch { toast.error(t('common.error')); }
  };

  const handleTransactionSubmit = async (form) => {
    try {
      const { data } = await api.post(`/inventory/${modal.data.id}/transactions`, form);
      toast.success(data.isLowStock ? '⚠️ מלאי נמוך!' : 'תנועה נרשמה');
      setModal({ open: false, type: null, data: null });
      loadItems();
    } catch (err) {
      toast.error(err.response?.data?.message || t('common.error'));
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/inventory/${deleteDialog.id}`);
      toast.success('פריט נמחק');
      setDeleteDialog({ open: false, id: null });
      loadItems();
    } catch { toast.error(t('common.error')); }
  };

  const isLowStock = (item) => parseFloat(item.current_quantity) <= parseFloat(item.minimum_quantity);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{t('inventory.title')}</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowLowStock(!showLowStock)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-colors ${showLowStock ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <AlertTriangle className="w-4 h-4" /> {t('inventory.lowStock')}
          </button>
          <button onClick={() => setModal({ open: true, type: 'item', data: null })}
            className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-xl text-sm hover:bg-amber-800">
            <Plus className="w-4 h-4" /> {t('inventory.addItem')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[t('inventory.name'), t('inventory.unit'), t('inventory.currentQty'), t('inventory.minQty'), t('inventory.supplier'), t('common.actions')].map(h => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">{t('common.loading')}</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">אין פריטים</td></tr>
              ) : items.map(item => (
                <tr key={item.id} className={`hover:bg-gray-50 ${isLowStock(item) ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {isLowStock(item) && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{item.unit}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${isLowStock(item) ? 'text-red-600' : 'text-gray-900'}`}>
                      {parseFloat(item.current_quantity).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{parseFloat(item.minimum_quantity).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{item.supplier || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setModal({ open: true, type: 'transaction', data: item })}
                        className="p-1.5 hover:bg-green-50 rounded-lg text-green-600" title={t('inventory.addTransaction')}>
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button onClick={() => setModal({ open: true, type: 'item', data: item })}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteDialog({ open: true, id: item.id })}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-red-400">
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

      <Modal isOpen={modal.open && modal.type === 'item'} onClose={() => setModal({ open: false, type: null, data: null })}
        title={modal.data ? 'ערוך פריט' : t('inventory.addItem')}>
        <ItemForm item={modal.data} onSubmit={handleItemSubmit} onCancel={() => setModal({ open: false, type: null, data: null })} />
      </Modal>

      <Modal isOpen={modal.open && modal.type === 'transaction'} onClose={() => setModal({ open: false, type: null, data: null })}
        title={`${t('inventory.addTransaction')} - ${modal.data?.name}`} size="sm">
        <TransactionForm onSubmit={handleTransactionSubmit} onCancel={() => setModal({ open: false, type: null, data: null })} />
      </Modal>

      <ConfirmDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete} title="אישור מחיקה" message="האם אתה בטוח שברצונך למחוק פריט זה?" />
    </div>
  );
}
