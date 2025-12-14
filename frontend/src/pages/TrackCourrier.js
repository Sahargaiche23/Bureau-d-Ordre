import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { courrierAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const TrackCourrier = () => {
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const [reference, setReference] = useState('');
  const [courrier, setCourrier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!reference.trim()) return;

    setLoading(true);
    setError('');
    setCourrier(null);

    try {
      const response = await courrierAPI.track(reference.trim());
      setCourrier(response.data.data);
    } catch (err) {
      setError('Courrier non trouvé. Vérifiez la référence.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => t(`courrier.statuses.${status}`);

  const statusSteps = ['recu', 'enregistre', 'affecte', 'en_cours', 'traite', 'transmis'];

  const getCurrentStep = (status) => {
    const index = statusSteps.indexOf(status);
    return index >= 0 ? index : 0;
  };

  // Handle PDF download
  const handleDownloadPDF = (lang) => {
    if (!courrier) return;
    const url = `http://localhost:5000/api/courriers/suivi/${courrier.reference}/pdf?lang=${lang}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 py-12 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-white text-sm font-medium backdrop-blur-sm"
          >
            <span className="text-lg">🌐</span>
            <span>{language === 'fr' ? 'العربية' : 'Français'}</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📬</span>
          </div>
          <h1 className="text-3xl font-bold text-white">{t('tracking.title')}</h1>
          <p className="text-blue-200 mt-2">{t('tracking.subtitle')}</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <form onSubmit={handleSearch} className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={t('tracking.placeholder')}
              className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${isRTL ? 'text-right' : ''}`}
              dir="ltr"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '...' : `🔍 ${t('tracking.searchButton')}`}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {t('tracking.notFound')}
            </div>
          )}
        </div>

        {/* Result */}
        {courrier && (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className={`flex justify-between items-start mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : ''}>
                <h2 className="text-2xl font-bold text-gray-800">{courrier.reference}</h2>
                <p className="text-gray-500">{courrier.objet}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                courrier.status === 'traite' ? 'bg-green-100 text-green-800' :
                courrier.status === 'rejete' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {getStatusLabel(courrier.status)}
              </span>
            </div>

            {/* PDF Download Buttons */}
            {courrier.status === 'traite' && (
              <div className={`mb-6 p-4 bg-green-50 rounded-xl border border-green-200 ${isRTL ? 'text-right' : ''}`}>
                <h3 className="text-green-800 font-semibold mb-3">📄 {t('common.downloadPDF')}</h3>
                <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => handleDownloadPDF('fr')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <span>🇫🇷</span>
                    <span>{t('pdf.downloadFr')}</span>
                  </button>
                  <button
                    onClick={() => handleDownloadPDF('ar')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <span>🇹🇳</span>
                    <span>{t('pdf.downloadAr')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Progress Steps */}
            <div className="mb-8">
              <div className={`flex justify-between relative ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
                  <div 
                    className={`h-full bg-blue-600 transition-all ${isRTL ? 'float-right' : ''}`}
                    style={{ width: `${(getCurrentStep(courrier.status) / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>
                {statusSteps.map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= getCurrentStep(courrier.status) 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index <= getCurrentStep(courrier.status) ? '✓' : index + 1}
                    </div>
                    <span className="text-xs mt-2 text-gray-600">{getStatusLabel(step)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`bg-gray-50 p-4 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                <p className="text-sm text-gray-500">{t('courrier.receptionDate')}</p>
                <p className="font-medium">{new Date(courrier.dateReception).toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR')}</p>
              </div>
              {courrier.dateTraitement && (
                <div className={`bg-gray-50 p-4 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                  <p className="text-sm text-gray-500">{t('courrier.processingDate')}</p>
                  <p className="font-medium">{new Date(courrier.dateTraitement).toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR')}</p>
                </div>
              )}
              {courrier.serviceDestinataire && (
                <div className={`bg-gray-50 p-4 rounded-lg col-span-2 ${isRTL ? 'text-right' : ''}`}>
                  <p className="text-sm text-gray-500">{t('tracking.inCharge')}</p>
                  <p className="font-medium">{courrier.serviceDestinataire.name}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            {courrier.historique && courrier.historique.length > 0 && (
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="font-semibold mb-4">{t('courrier.history')}</h3>
                <div className="space-y-3">
                  {courrier.historique.map((h, i) => (
                    <div key={i} className={`flex items-center p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse space-x-reverse space-x-4' : 'space-x-4'}`}>
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <span className="font-medium">{h.action.charAt(0).toUpperCase() + h.action.slice(1)}</span>
                        <span className={`text-gray-500 text-sm ${isRTL ? 'mr-2' : 'ml-2'}`}>
                          {new Date(h.createdAt).toLocaleString(language === 'ar' ? 'ar-TN' : 'fr-FR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/login" className="text-white hover:underline">
            {isRTL ? '→' : '←'} {t('tracking.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackCourrier;
