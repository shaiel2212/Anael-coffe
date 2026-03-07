import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { Coffee } from 'lucide-react';

const ALLERGEN_ICONS = {
  dairy: '🥛',
  gluten: '🌾',
  eggs: '🥚',
  nuts: '🥜',
  soy: '🫘',
  fish: '🐟',
  shellfish: '🦐',
  sesame: '🌰',
};

export default function PublicMenuPage() {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    api.get(`/menu/public/${slug}`)
      .then(({ data }) => {
        setData(data);
        if (data.cafe.default_language) {
          i18n.changeLanguage(data.cafe.default_language);
        }
        if (data.categories.length > 0) {
          setActiveCategory(data.categories[0].id);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <Coffee className="w-16 h-16 text-amber-300 mx-auto mb-4" />
          <p className="text-gray-500">בית הקפה לא נמצא</p>
        </div>
      </div>
    );
  }

  const { cafe, categories } = data;
  const lang = i18n.language;
  const isRtl = lang === 'he';

  const getName = (item) => item[`name_${lang}`] || item.name_he || item.name_en;
  const getDesc = (item) => item[`description_${lang}`] || item.description_he || item.description_en;

  const activeProducts = categories.find(c => c.id === activeCategory)?.products || [];

  return (
    <div className={`min-h-screen bg-gray-50`} dir={isRtl ? 'rtl' : 'ltr'} style={{ '--cafe-color': cafe.primary_color || '#6F4E37' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          {cafe.logo_url ? (
            <img src={cafe.logo_url} alt={cafe.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: cafe.primary_color || '#6F4E37' }}>
              <Coffee className="w-5 h-5 text-white" />
            </div>
          )}
          <h1 className="text-xl font-bold text-gray-900">{cafe.name}</h1>

          {/* Language selector */}
          <div className="flex gap-1 mr-auto ml-0 rtl:mr-0 rtl:ml-auto">
            {['he', 'en', 'ru'].map((lng) => (
              <button
                key={lng}
                onClick={() => i18n.changeLanguage(lng)}
                className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors ${lang === lng ? 'text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                style={lang === lng ? { backgroundColor: cafe.primary_color || '#6F4E37' } : {}}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Categories scrollable tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-3 overflow-x-auto flex gap-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                activeCategory === cat.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={activeCategory === cat.id ? { backgroundColor: cafe.primary_color || '#6F4E37' } : {}}
            >
              {getName(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {activeProducts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Coffee className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>אין מוצרים בקטגוריה זו</p>
          </div>
        )}
        {activeProducts.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-2xl p-4 shadow-sm flex gap-4 ${!product.is_available ? 'opacity-50' : ''}`}
          >
            {product.image_url && (
              <img src={product.image_url} alt={getName(product)} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 text-base">{getName(product)}</h3>
                <span className="font-bold text-lg flex-shrink-0" style={{ color: cafe.primary_color || '#6F4E37' }}>
                  ₪{parseFloat(product.price).toFixed(2)}
                </span>
              </div>
              {getDesc(product) && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{getDesc(product)}</p>
              )}
              {product.allergens?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.allergens.map((a) => (
                    <span key={a} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                      {ALLERGEN_ICONS[a] || ''} {a}
                    </span>
                  ))}
                </div>
              )}
              {!product.is_available && (
                <span className="text-xs text-red-500 mt-1 block">{t('publicMenu.unavailable')}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
