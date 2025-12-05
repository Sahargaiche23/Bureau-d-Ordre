import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courrierAPI, serviceAPI, aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CourrierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const statusLabels = {
    recu: 'Reçu', enregistre: 'Enregistré', affecte: 'Affecté',
    en_cours: 'En cours', traite: 'Traité', transmis: 'Transmis', archive: 'Archivé', rejete: 'Rejeté'
  };

  const statusColors = {
    recu: 'bg-gray-100 text-gray-800', enregistre: 'bg-blue-100 text-blue-800',
    affecte: 'bg-yellow-100 text-yellow-800', en_cours: 'bg-orange-100 text-orange-800',
    traite: 'bg-green-100 text-green-800', transmis: 'bg-purple-100 text-purple-800',
    archive: 'bg-gray-200 text-gray-600', rejete: 'bg-red-100 text-red-800'
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (!courrier) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{courrier.reference}</h1>
            <p className="text-gray-500 mt-1">{courrier.objet}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[courrier.status]}`}>
            {statusLabels[courrier.status]}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          {['agent_bo', 'admin'].includes(user?.role) && ['recu', 'enregistre'].includes(courrier.status) && (
            <button onClick={() => setShowAffectModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              📤 Affecter au service
            </button>
          )}
          {['chef_service', 'agent_bo', 'admin'].includes(user?.role) && ['affecte', 'en_cours'].includes(courrier.status) && (
            <button onClick={() => setShowTraiterModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              ✅ Traiter
            </button>
          )}
          {['agent_bo', 'admin'].includes(user?.role) && ['affecte', 'en_cours'].includes(courrier.status) && (
            <button onClick={handleRappel} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
              🔔 Envoyer rappel
            </button>
          )}
          <button onClick={() => navigate('/courriers')} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
            ← Retour
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Informations</h2>
          <dl className="space-y-3">
            <div className="flex justify-between"><dt className="text-gray-500">Type:</dt><dd className="font-medium">{courrier.type}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Priorité:</dt><dd className="font-medium">{courrier.priorite}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Date réception:</dt><dd>{new Date(courrier.dateReception).toLocaleDateString('fr-FR')}</dd></div>
            {courrier.dateEcheance && <div className="flex justify-between"><dt className="text-gray-500">Échéance:</dt><dd>{new Date(courrier.dateEcheance).toLocaleDateString('fr-FR')}</dd></div>}
            <div className="flex justify-between"><dt className="text-gray-500">Service:</dt><dd>{courrier.serviceDestinataire?.name || '-'}</dd></div>
          </dl>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Expéditeur</h2>
          {courrier.expediteur ? (
            <dl className="space-y-3">
              <div className="flex justify-between"><dt className="text-gray-500">Nom:</dt><dd>{courrier.expediteur.firstName} {courrier.expediteur.lastName}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Email:</dt><dd>{courrier.expediteur.email}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Téléphone:</dt><dd>{courrier.expediteur.phone || '-'}</dd></div>
            </dl>
          ) : (
            <p className="text-gray-600">{courrier.expediteurExterne || 'Non spécifié'}</p>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Contenu</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{courrier.contenu || 'Aucun contenu'}</p>
        
        {/* Pièce jointe */}
        {courrier.fichierPath && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-2">📎 Pièce jointe</h3>
            <a 
              href={`http://localhost:5000/${courrier.fichierPath}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              📄 Télécharger le fichier
            </a>
          </div>
        )}
      </div>

      {/* AI Analysis */}
      {aiAnalysis && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 shadow-sm border border-purple-200">
          <h2 className="text-lg font-semibold mb-4 text-purple-800">🤖 Analyse IA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Catégorie détectée */}
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Type de demande</p>
              <p className="font-semibold text-purple-800">{aiAnalysis.reason}</p>
            </div>
            
            {/* Service suggéré */}
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Service suggéré</p>
              <p className="font-semibold">{aiAnalysis.suggestedService?.name || 'Non déterminé'}</p>
              <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                aiAnalysis.confidence >= 70 ? 'bg-green-100 text-green-800' :
                aiAnalysis.confidence >= 40 ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                Confiance: {aiAnalysis.confidence}%
              </span>
            </div>
            
            {/* Priorité détectée */}
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Priorité détectée</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                aiAnalysis.detectedPriority === 'urgente' ? 'bg-red-100 text-red-800' :
                aiAnalysis.detectedPriority === 'haute' ? 'bg-orange-100 text-orange-800' :
                aiAnalysis.detectedPriority === 'basse' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {aiAnalysis.detectedPriority || 'Normale'}
              </span>
            </div>
          </div>
          
          {/* Mots-clés */}
          {aiAnalysis.keywords?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Mots-clés détectés</p>
              <div className="flex flex-wrap gap-2">
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
          <h2 className="text-lg font-semibold mb-4 text-green-800">Réponse</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{courrier.reponse}</p>
          {courrier.traiteur && (
            <p className="text-sm text-gray-500 mt-4">
              Traité par: {courrier.traiteur.firstName} {courrier.traiteur.lastName}
            </p>
          )}
        </div>
      )}

      {/* Historique */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Historique</h2>
        <div className="space-y-4">
          {courrier.historique?.map((h, i) => (
            <div key={i} className="flex items-start space-x-4 pb-4 border-b last:border-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                {h.action === 'creation' && '📝'}
                {h.action === 'affectation' && '📤'}
                {h.action === 'traitement' && '✅'}
                {h.action === 'rappel' && '🔔'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{h.action.charAt(0).toUpperCase() + h.action.slice(1)}</p>
                {h.commentaire && <p className="text-gray-600 text-sm">{h.commentaire}</p>}
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(h.createdAt).toLocaleString('fr-FR')} - {h.utilisateur?.firstName} {h.utilisateur?.lastName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Affectation */}
      {showAffectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Affecter au service</h3>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            >
              <option value="">Sélectionner un service</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={handleAffecter} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Affecter</button>
              <button onClick={() => setShowAffectModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Traitement */}
      {showTraiterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Traiter le courrier</h3>
            <textarea
              value={reponse}
              onChange={(e) => setReponse(e.target.value)}
              placeholder="Votre réponse..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 h-32"
            />
            <div className="flex gap-3">
              <button onClick={handleTraiter} className="flex-1 bg-green-600 text-white py-2 rounded-lg">Valider</button>
              <button onClick={() => setShowTraiterModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourrierDetail;
