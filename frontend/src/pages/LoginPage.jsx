import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Coffee } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch {
      toast.error(t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rustic-cream flex items-center justify-center p-4 bg-paper-texture" dir="rtl">
      <div className="rustic-card p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-rustic-wood rounded-2xl flex items-center justify-center mb-4">
            <Coffee className="w-9 h-9 text-rustic-cream" />
          </div>
          <h1 className="text-2xl font-heading font-semibold text-rustic-ink text-center">מערכת ניהול בית קפה</h1>
          <p className="text-rustic-inkSoft mt-1 text-sm">{t('auth.login')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-rustic-ink mb-1">{t('auth.email')}</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rustic-input"
              placeholder="admin@mycafe.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-rustic-ink mb-1">{t('auth.password')}</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="rustic-input"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rustic-btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? t('common.loading') : t('auth.loginButton')}
          </button>
        </form>
      </div>
    </div>
  );
}
