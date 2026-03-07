import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { QrCode, Plus, Pencil, Trash2, Eye, EyeOff, Download } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

function CategoryForm({ category, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name_he: category?.name_he || '',
    name_en: category?.name_en || '',
    name_ru: category?.name_ru || '',
    display_order: category?.display_order || 0,
    is_visible: category?.is_visible !== false,
  });

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[['name_he', t('menu.nameHe'), true], ['name_en', t('menu.nameEn'), false], ['name_ru', t('menu.nameRu'), false]].map(([field, label, required]) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            required={required} />
        </div>
      ))}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('menu.displayOrder')}</label>
          <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} className="w-4 h-4 rounded" />
            <span className="text-sm font-medium text-gray-700">{t('menu.visible')}</span>
          </label>
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
        <button type="submit" className="px-4 py-2 bg-amber-700 text-white rounded-xl hover:bg-amber-800">{t('common.save')}</button>
      </div>
    </form>
  );
}

function ProductForm({ product, categories, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const ALLERGENS = ['dairy', 'gluten', 'eggs', 'nuts', 'soy', 'fish', 'shellfish', 'sesame'];
  const [form, setForm] = useState({
    category_id: product?.category_id || categories[0]?.id || '',
    name_he: product?.name_he || '',
    name_en: product?.name_en || '',
    name_ru: product?.name_ru || '',
    description_he: product?.description_he || '',
    price: product?.price || '',
    allergens: product?.allergens || [],
    is_available: product?.is_available !== false,
    is_visible: product?.is_visible !== false,
    display_order: product?.display_order || 0,
  });

  const toggleAllergen = (a) => {
    setForm(prev => ({
      ...prev,
      allergens: prev.allergens.includes(a) ? prev.allergens.filter(x => x !== a) : [...prev.allergens, a],
    }));
  };

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('menu.category')}</label>
        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" required>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name_he}</option>)}
        </select>
      </div>
      {[['name_he', t('menu.nameHe'), true], ['name_en', t('menu.nameEn'), false], ['name_ru', t('menu.nameRu'), false]].map(([field, label, required]) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" required={required} />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('menu.description')}</label>
        <textarea value={form.description_he} onChange={(e) => setForm({ ...form, description_he: e.target.value })}
          rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('menu.price')} (₪)</label>
          <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('menu.displayOrder')}</label>
          <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('menu.allergens')}</label>
        <div className="flex flex-wrap gap-2">
          {ALLERGENS.map(a => (
            <button key={a} type="button" onClick={() => toggleAllergen(a)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${form.allergens.includes(a) ? 'bg-amber-100 border-amber-400 text-amber-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              {a}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-6">
        {[['is_available', t('menu.available')], ['is_visible', t('menu.visible')]].map(([field, label]) => (
          <label key={field} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.checked })} className="w-4 h-4 rounded" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </label>
        ))}
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
        <button type="submit" className="px-4 py-2 bg-amber-700 text-white rounded-xl hover:bg-amber-800">{t('common.save')}</button>
      </div>
    </form>
  );
}

export default function MenuManagementPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [menuUrl, setMenuUrl] = useState('');
  const [activeTab, setActiveTab] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: null, id: null });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get('/menu/categories'),
        api.get('/menu/products'),
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch { toast.error(t('common.error')); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const loadQR = async () => {
    try {
      const { data } = await api.get('/menu/qr');
      setQrCode(data.qr_code);
      setMenuUrl(data.menu_url);
    } catch { toast.error('שגיאה בטעינת QR'); }
  };

  useEffect(() => { loadQR(); }, []);

  const handleCategorySubmit = async (form) => {
    try {
      if (modal.data) {
        await api.put(`/menu/categories/${modal.data.id}`, form);
        toast.success('קטגוריה עודכנה');
      } else {
        await api.post('/menu/categories', form);
        toast.success('קטגוריה נוספה');
      }
      setModal({ open: false, type: null, data: null });
      loadData();
    } catch { toast.error(t('common.error')); }
  };

  const handleProductSubmit = async (form) => {
    try {
      if (modal.data) {
        await api.put(`/menu/products/${modal.data.id}`, form);
        toast.success('מוצר עודכן');
      } else {
        await api.post('/menu/products', form);
        toast.success('מוצר נוסף');
      }
      setModal({ open: false, type: null, data: null });
      loadData();
    } catch { toast.error(t('common.error')); }
  };

  const handleDelete = async () => {
    try {
      if (deleteDialog.type === 'category') {
        await api.delete(`/menu/categories/${deleteDialog.id}`);
        toast.success('קטגוריה נמחקה');
      } else {
        await api.delete(`/menu/products/${deleteDialog.id}`);
        toast.success('מוצר נמחק');
      }
      setDeleteDialog({ open: false, type: null, id: null });
      loadData();
    } catch { toast.error(t('common.error')); }
  };

  const downloadQR = () => {
    const a = document.createElement('a');
    a.href = qrCode;
    a.download = 'menu-qr.png';
    a.click();
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('menu.title')}</h1>
      </div>

      {/* QR Code section */}
      {qrCode && (
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-6">
          <img src={qrCode} alt="QR Code" className="w-28 h-28 rounded-xl" />
          <div>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><QrCode className="w-5 h-5" /> {t('menu.qrCode')}</h2>
            <p className="text-sm text-gray-500 mt-1 break-all">{menuUrl}</p>
            <button onClick={downloadQR} className="mt-3 flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-xl text-sm hover:bg-amber-800 transition-colors">
              <Download className="w-4 h-4" /> {t('menu.downloadQR')}
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {['categories', 'products'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-800'}`}>
            {t(`menu.${tab}`)}
          </button>
        ))}
      </div>

      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">{t('menu.categories')}</h2>
            <button onClick={() => setModal({ open: true, type: 'category', data: null })}
              className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-xl text-sm hover:bg-amber-800">
              <Plus className="w-4 h-4" /> {t('menu.addCategory')}
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? <div className="p-8 text-center text-gray-400">{t('common.loading')}</div> :
              categories.length === 0 ? <div className="p-8 text-center text-gray-400">אין קטגוריות</div> :
                categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{cat.name_he}</p>
                      <p className="text-sm text-gray-400">{cat.name_en} {cat.name_ru && `/ ${cat.name_ru}`}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${cat.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {cat.is_visible ? t('common.active') : t('common.inactive')}
                      </span>
                      <button onClick={() => setModal({ open: true, type: 'category', data: cat })} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteDialog({ open: true, type: 'category', id: cat.id })} className="p-2 hover:bg-red-50 rounded-lg text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-gray-900">{t('menu.products')}</h2>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="">כל הקטגוריות</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name_he}</option>)}
              </select>
            </div>
            <button onClick={() => setModal({ open: true, type: 'product', data: null })}
              className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-xl text-sm hover:bg-amber-800">
              <Plus className="w-4 h-4" /> {t('menu.addProduct')}
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? <div className="p-8 text-center text-gray-400">{t('common.loading')}</div> :
              filteredProducts.length === 0 ? <div className="p-8 text-center text-gray-400">אין מוצרים</div> :
                filteredProducts.map(prod => (
                  <div key={prod.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{prod.name_he}</p>
                        {prod.allergens?.length > 0 && (
                          <span className="text-xs text-amber-600">{prod.allergens.join(', ')}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{prod.name_en}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-amber-700">₪{parseFloat(prod.price).toFixed(2)}</span>
                      <div className="flex items-center gap-1">
                        {!prod.is_visible && <EyeOff className="w-4 h-4 text-gray-400" />}
                        {!prod.is_available && <span className="text-xs text-red-500">לא זמין</span>}
                      </div>
                      <button onClick={() => setModal({ open: true, type: 'product', data: prod })} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteDialog({ open: true, type: 'product', id: prod.id })} className="p-2 hover:bg-red-50 rounded-lg text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}

      <Modal isOpen={modal.open && modal.type === 'category'} onClose={() => setModal({ open: false, type: null, data: null })}
        title={modal.data ? 'ערוך קטגוריה' : t('menu.addCategory')}>
        <CategoryForm category={modal.data} onSubmit={handleCategorySubmit} onCancel={() => setModal({ open: false, type: null, data: null })} />
      </Modal>

      <Modal isOpen={modal.open && modal.type === 'product'} onClose={() => setModal({ open: false, type: null, data: null })}
        title={modal.data ? 'ערוך מוצר' : t('menu.addProduct')} size="lg">
        <ProductForm product={modal.data} categories={categories} onSubmit={handleProductSubmit} onCancel={() => setModal({ open: false, type: null, data: null })} />
      </Modal>

      <ConfirmDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: null, id: null })}
        onConfirm={handleDelete} title="אישור מחיקה" message="האם אתה בטוח שברצונך למחוק?" />
    </div>
  );
}
