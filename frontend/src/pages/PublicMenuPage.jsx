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
  const [lightboxImage, setLightboxImage] = useState(null);

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
      <div className="min-h-screen flex items-center justify-center bg-rustic-cream">
        <div className="animate-spin w-10 h-10 border-4 border-rustic-wood border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rustic-cream">
        <div className="text-center">
          <Coffee className="w-16 h-16 text-rustic-sand mx-auto mb-4" />
          <p className="text-rustic-inkSoft font-heading">בית הקפה לא נמצא</p>
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
  const productsWithImages = categories.flatMap(c => c.products || []).filter(p => p.image_url);

  const accentColor = cafe.primary_color || '#5C4033';

  return (
    <div className="min-h-screen bg-rustic-cream" dir={isRtl ? 'rtl' : 'ltr'} style={{ '--cafe-color': accentColor }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-rustic-linen border-b border-rustic-sand/40 shadow-rustic">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          {cafe.logo_url ? (
            <img src={cafe.logo_url} alt={cafe.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-rustic-sand/50" />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-rustic-wood">
              <Coffee className="w-5 h-5 text-rustic-cream" />
            </div>
          )}
          <h1 className="text-xl font-heading font-semibold text-rustic-ink">{cafe.name}</h1>

          {/* Language selector */}
          <div className="flex gap-1 mr-auto ml-0 rtl:mr-0 rtl:ml-auto">
            {['he', 'en', 'ru'].map((lng) => (
              <button
                key={lng}
                onClick={() => i18n.changeLanguage(lng)}
                className={`px-2 py-1 text-xs font-mono rounded-lg font-medium transition-colors ${lang === lng ? 'text-rustic-cream' : 'text-rustic-inkSoft hover:bg-rustic-sand/30'}`}
                style={lang === lng ? { backgroundColor: accentColor } : {}}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Product images strip - auto-scrolling marquee */}
        {productsWithImages.length > 0 && (
          <div className="w-full overflow-hidden bg-rustic-sand/20">
            <div className="flex gap-3 animate-marquee py-3" style={{ width: 'max-content' }}>
              {[...productsWithImages, ...productsWithImages].map((product, i) => (
                <button
                  key={`strip-${product.id}-${i}`}
                  type="button"
                  onClick={() => setLightboxImage({ url: product.image_url, alt: getName(product) })}
                  className="h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-rustic-sand/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rustic-wood/50"
                  aria-label={getName(product)}
                >
                  <img src={product.image_url} alt={getName(product)} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories scrollable tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-3 overflow-x-auto flex gap-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                activeCategory === cat.id
                  ? 'text-rustic-cream'
                  : 'bg-rustic-sand/30 text-rustic-inkSoft hover:bg-rustic-sand/50'
              }`}
              style={activeCategory === cat.id ? { backgroundColor: accentColor } : {}}
            >
              {getName(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {activeProducts.length === 0 && (
          <div className="text-center py-12 text-rustic-inkSoft/70">
            <Coffee className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-heading">אין מוצרים בקטגוריה זו</p>
          </div>
        )}
        {activeProducts.map((product) => (
          <div
            key={product.id}
            className={`rustic-card p-4 flex gap-4 ${!product.is_available ? 'opacity-50' : ''}`}
          >
            {product.image_url && (
              <button
                type="button"
                onClick={() => setLightboxImage({ url: product.image_url, alt: getName(product) })}
                className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-rustic-sand/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rustic-wood/50"
                aria-label={getName(product)}
              >
                <img src={product.image_url} alt={getName(product)} className="w-full h-full object-cover" />
              </button>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading font-semibold text-rustic-ink text-base">{getName(product)}</h3>
                <span className="font-semibold text-lg flex-shrink-0 text-rustic-wood" style={accentColor !== '#5C4033' ? { color: accentColor } : {}}>
                  ₪{parseFloat(product.price).toFixed(2)}
                </span>
              </div>
              {getDesc(product) && (
                <p className="text-sm text-rustic-inkSoft mt-1 line-clamp-2">{getDesc(product)}</p>
              )}
              {product.allergens?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.allergens.map((a) => (
                    <span key={a} className="text-xs bg-rustic-sand/40 text-rustic-wood px-2 py-0.5 rounded-full font-mono">
                      {ALLERGEN_ICONS[a] || ''} {a}
                    </span>
                  ))}
                </div>
              )}
              {!product.is_available && (
                <span className="text-xs text-red-600 mt-1 block">{t('publicMenu.unavailable')}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox: תמונה בגודל מותאם לסמארטפון */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightboxImage(null)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && setLightboxImage(null)}
          aria-label="סגור"
        >
          <img
            src={lightboxImage.url}
            alt={lightboxImage.alt}
            className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
