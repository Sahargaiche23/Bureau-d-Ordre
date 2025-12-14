import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Connexion réussie!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-white text-sm font-medium backdrop-blur-sm"
        >
          <span className="text-lg">🌐</span>
          <span>{language === 'fr' ? 'العربية' : 'Français'}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🏛️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t('header.bureauOrdre')}</h1>
          <p className="text-gray-500">{t('header.gouvernorat')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${isRTL ? 'text-right' : ''}`}
              placeholder="votre@email.com"
              dir="ltr"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${isRTL ? 'text-right' : ''}`}
              placeholder="••••••••"
              dir="ltr"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('auth.loginButton')}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link to="/register" className="text-blue-600 hover:underline block">
            {t('auth.registerSubtitle')}
          </Link>
          <Link to="/suivi" className="text-gray-500 hover:underline block">
            {t('nav.tracking')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
