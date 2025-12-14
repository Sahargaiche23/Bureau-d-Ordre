import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courrierAPI, serviceAPI, aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const CourrierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language, isRTL } = useLanguage();
  const [courrier, setCourrier] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAffectModal, setShowAffectModal] = useState(false);
  const [showTraiterModal, setShowTraiterModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [reponse, setReponse] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [courrierRes, servicesRes] = await Promise.all([
        courrierAPI.getOne(id),
        serviceAPI.getAll()
      ]);
      setCourrier(courrierRes.data.data);
      setServices(servicesRes.data.data);
      
      // Fetch AI analysis for the courrier
      const courrierData = courrierRes.data.data;
      if (courrierData.objet || courrierData.contenu) {
        try {
          const aiRes = await aiAPI.analyze({
            objet: courrierData.objet || '',
            contenu: courrierData.contenu || ''
          });
          setAiAnalysis(aiRes.data.data);
        } catch (aiError) {
          // AI analysis is optional, don't fail if it doesn't work
          console.log('AI analysis not available');
        }
      }
    } catch (error) {
      toast.error('Courrier non trouvé');
      navigate('/courriers');
    } finally {
      setLoading(false);
    }
  };

  const handleAffecter = async () => {
    try {
      await courrierAPI.affecter(id, { serviceId: selectedService });
      toast.success('Courrier affecté avec succès');
      setShowAffectModal(false);
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de l\'affectation');
    }
  };

  const handleTraiter = async () => {
    try {
      await courrierAPI.traiter(id, { reponse, status: 'traite' });
      toast.success('Courrier traité avec succès');
      setShowTraiterModal(false);
      fetchData();
    } catch (error) {
      toast.error('Erreur lors du traitement');
    }
  };

  const handleRappel = async () => {
    try {
      await courrierAPI.rappel(id, { message: 'Rappel: Courrier en attente de traitement' });
      toast.success('Rappel envoyé');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du rappel');
    }
  };

  const getStatusLabel = (status) => t(`courrier.statuses.${status}`);

  const statusColors = {
    recu: 'bg-gray-100 text-gray-800', enregistre: 'bg-blue-100 text-blue-800',
    affecte: 'bg-yellow-100 text-yellow-800', en_cours: 'bg-orange-100 text-orange-800',
    traite: 'bg-green-100 text-green-800', transmis: 'bg-purple-100 text-purple-800',
    archive: 'bg-gray-200 text-gray-600', rejete: 'bg-red-100 text-red-800'
  };

  // Handle PDF download
  const handleDownloadPDF = (lang) => {
    if (!courrier) return;
    const url = `http://localhost:5000/api/courriers/${courrier.id}/pdf?lang=${lang}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (!courrier) return null;

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-2xl font-bold text-gray-800">{courrier.reference}</h1>
            <p className="text-gray-500 mt-1">{courrier.objet}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[courrier.status]}`}>
            {getStatusLabel(courrier.status)}
          </span>
        </div>

        {/* Actions */}
        <div className={`flex gap-3 mt-6 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          {['agent_bo', 'admin'].includes(user?.role) && ['recu', 'enregistre'].includes(courrier.status) && (
            <button onClick={() => setShowAffectModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              📤 {t('courrier.assignToService')}
            </button>
          )}
          {['chef_service', 'agent_bo', 'admin'].includes(user?.role) && ['affecte', 'en_cours'].includes(courrier.status) && (
            <button onClick={() => setShowTraiterModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              ✅ {t('courrier.process')}
            </button>
          )}
          {['agent_bo', 'admin'].includes(user?.role) && ['affecte', 'en_cours'].includes(courrier.status) && (
            <button onClick={handleRappel} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
              🔔 {t('courrier.sendReminder')}
            </button>
          )}
          <button onClick={() => navigate('/courriers')} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
            {isRTL ? '→' : '←'} {t('common.back')}
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>{t('detail.informations')}</h2>
          <dl className="space-y-3">
            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}><dt className="text-gray-500">{t('courrier.type')}:</dt><dd className="font-medium">{t(`courrier.types.${courrier.type}`)}</dd></div>
            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}><dt className="text-gray-500">{t('courrier.priority')}:</dt><dd className="font-medium">{t(`courrier.priorities.${courrier.priorite}`)}</dd></div>
            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}><dt className="text-gray-500">{t('courrier.receptionDate')}:</dt><dd>{new Date(courrier.dateReception).toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR')}</dd></div>
            {courrier.dateEcheance && <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}><dt className="text-gray-500">{t('courrier.deadline')}:</dt><dd>{new Date(courrier.dateEcheance).toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR')}</dd></div>}
            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}><dt className="text-gray-500">{t('courrier.service')}:</dt><dd>{courrier.serviceDestinataire?.name || '-'}</dd></div>
          </dl>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>{t('courrier.sender')}</h2>
          {courrier.expediteur ? (
            <dl className="space-y-3">
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}><dt className="text-gray-500">{t('auth.lastName')}:</dt><dd>{courrier.expediteur.firstName} {courrier.expediteur.lastName}</dd></div>
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}><dt className="text-gray-500">{t('auth.email')}:</dt><dd>{courrier.expediteur.email}</dd></div>
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}><dt className="text-gray-500">{t('auth.phone')}:</dt><dd>{courrier.expediteur.phone || '-'}</dd></div>
            </dl>
          ) : (
            <p className="text-gray-600">{courrier.expediteurExterne || t('common.noData')}</p>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>{t('courrier.content')}</h2>
        <p className={`text-gray-700 whitespace-pre-wrap ${isRTL ? 'text-right' : ''}`}>{courrier.contenu || t('common.noData')}</p>
        
        {/* Pièce jointe */}
        {courrier.fichierPath && (
          <div className="mt-4 pt-4 border-t">
            <h3 className={`text-sm font-medium text-gray-500 mb-2 ${isRTL ? 'text-right' : ''}`}>📎 {t('courrier.attachment')}</h3>
            <a 
              href={`http://localhost:5000/${courrier.fichierPath}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              📄 {t('courrier.downloadFile')}
            </a>
          </div>
        )}
      </div>

      {/* AI Analysis */}
      {aiAnalysis && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 shadow-sm border border-purple-200">
          <h2 className={`text-lg font-semibold mb-4 text-purple-800 ${isRTL ? 'text-right' : ''}`}>🤖 {t('courrier.aiAnalysis')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Catégorie détectée */}
            <div className={`bg-white rounded-lg p-4 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-xs text-gray-500 mb-1">{t('courrier.requestType')}</p>
              <p className="font-semibold text-purple-800">{aiAnalysis.reason}</p>
            </div>
            
            {/* Service suggéré */}
            <div className={`bg-white rounded-lg p-4 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-xs text-gray-500 mb-1">{t('courrier.suggestedService')}</p>
              <p className="font-semibold">{aiAnalysis.suggestedService?.name || t('courrier.notDetermined')}</p>
              <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                aiAnalysis.confidence >= 70 ? 'bg-green-100 text-green-800' :
                aiAnalysis.confidence >= 40 ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {t('courrier.confidence')}: {aiAnalysis.confidence}%
              </span>
            </div>
            
            {/* Priorité détectée */}
            <div className={`bg-white rounded-lg p-4 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-xs text-gray-500 mb-1">{t('courrier.detectedPriority')}</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                aiAnalysis.detectedPriority === 'urgente' ? 'bg-red-100 text-red-800' :
                aiAnalysis.detectedPriority === 'haute' ? 'bg-orange-100 text-orange-800' :
                aiAnalysis.detectedPriority === 'basse' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {t(`courrier.priorities.${aiAnalysis.detectedPriority}`) || t('courrier.priorities.normale')}
              </span>
            </div>
          </div>
          
          {/* Mots-clés */}
          {aiAnalysis.keywords?.length > 0 && (
            <div className={`mt-4 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-xs text-gray-500 mb-2">{t('courrier.detectedKeywords')}</p>
              <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {aiAnalysis.keywords.map((kw, i) => (
                  <span key={i} className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Réponse */}
      {courrier.reponse && (
        <div className="bg-green-50 rounded-xl p-6 shadow-sm border border-green-200">
          <div className={`flex justify-between items-start mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h2 className="text-lg font-semibold text-green-800">{t('courrier.response')}</h2>
            {/* PDF Download Buttons */}
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => handleDownloadPDF('fr')}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                title={t('pdf.downloadFr')}
              >
                🇫🇷 PDF
              </button>
              <button
                onClick={() => handleDownloadPDF('ar')}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                title={t('pdf.downloadAr')}
              >
                🇹🇳 PDF
              </button>
            </div>
          </div>
          <p className={`text-gray-700 whitespace-pre-wrap ${isRTL ? 'text-right' : ''}`}>{courrier.reponse}</p>
          {courrier.traiteur && (
            <p className={`text-sm text-gray-500 mt-4 ${isRTL ? 'text-right' : ''}`}>
              {t('courrier.processedBy')}: {courrier.traiteur.firstName} {courrier.traiteur.lastName}
            </p>
          )}
        </div>
      )}

      {/* Historique */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>{t('courrier.history')}</h2>
        <div className="space-y-4">
          {courrier.historique?.map((h, i) => (
            <div key={i} className={`flex items-start pb-4 border-b last:border-0 ${isRTL ? 'flex-row-reverse space-x-reverse space-x-4' : 'space-x-4'}`}>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                {h.action === 'creation' && '📝'}
                {h.action === 'affectation' && '📤'}
                {h.action === 'traitement' && '✅'}
                {h.action === 'rappel' && '🔔'}
              </div>
              <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                <p className="font-medium text-gray-800">{t(`history.${h.action}`) || h.action.charAt(0).toUpperCase() + h.action.slice(1)}</p>
                {h.commentaire && <p className="text-gray-600 text-sm">{h.commentaire}</p>}
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(h.createdAt).toLocaleString(language === 'ar' ? 'ar-TN' : 'fr-FR')} - {h.utilisateur?.firstName} {h.utilisateur?.lastName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Affectation */}
      {showAffectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
            <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>{t('courrier.assignToService')}</h3>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 ${isRTL ? 'text-right' : ''}`}
            >
              <option value="">{t('courrier.selectService')}</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button onClick={handleAffecter} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">{t('courrier.assign')}</button>
              <button onClick={() => setShowAffectModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Traitement */}
      {showTraiterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
            <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>{t('courrier.processCourrier')}</h3>
            <textarea
              value={reponse}
              onChange={(e) => setReponse(e.target.value)}
              placeholder={t('courrier.yourResponse')}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 h-32 ${isRTL ? 'text-right' : ''}`}
            />
            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button onClick={handleTraiter} className="flex-1 bg-green-600 text-white py-2 rounded-lg">{t('courrier.validate')}</button>
              <button onClick={() => setShowTraiterModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourrierDetail;
