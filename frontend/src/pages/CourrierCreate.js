import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courrierAPI, serviceAPI, aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CourrierCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    objet: '',
    contenu: '',
    type: 'entrant',
    priorite: 'normale',
    destinataireServiceId: '',
    expediteurExterne: '',
    dateEcheance: ''
  });
  const [file, setFile] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getAll();
      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching services');
    }
  };

  // AI Analysis when content changes
  const handleAiAnalysis = async () => {
    // All users can use AI analysis
    if (!user?.role) return;
    if (!formData.objet && !formData.contenu) return;
    
    setAnalyzing(true);
    try {
      const response = await aiAPI.analyze({
        objet: formData.objet,
        contenu: formData.contenu
      });
      setAiSuggestion(response.data.data);
      
      // Auto-fill priority if detected
      if (response.data.data.detectedPriority && response.data.data.detectedPriority !== 'normale') {
        setFormData(prev => ({ ...prev, priorite: response.data.data.detectedPriority }));
      }
    } catch (error) {
      // Silently ignore for non-authorized users
    } finally {
      setAnalyzing(false);
    }
  };

  const applySuggestion = () => {
    if (aiSuggestion?.suggestedServiceId) {
      setFormData(prev => ({ ...prev, destinataireServiceId: aiSuggestion.suggestedServiceId }));
      toast.success('Suggestion IA appliquée!');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) data.append(key, formData[key]);
      });
      if (file) data.append('fichier', file);

      await courrierAPI.create(data);
      toast.success('Courrier créé avec succès');
      navigate('/courriers');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouveau Courrier</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Objet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Objet *</label>
            <input
              type="text"
              name="objet"
              value={formData.objet}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Objet du courrier"
              required
            />
          </div>

          {/* Contenu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contenu *</label>
            <textarea
              name="contenu"
              value={formData.contenu}
              onChange={handleChange}
              onBlur={handleAiAnalysis}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-40"
              placeholder="Contenu détaillé du courrier..."
              required
            />
          </div>

          {/* AI Suggestion - For all users who can create courriers */}
          {user?.role && ['agent_bo', 'admin', 'citoyen'].includes(user.role) && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-purple-800 flex items-center">
                  🤖 Suggestion IA
                </h3>
                <button
                  type="button"
                  onClick={handleAiAnalysis}
                  disabled={analyzing}
                  className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {analyzing ? 'Analyse...' : 'Analyser'}
                </button>
              </div>
              
              {aiSuggestion && (
                <div className="space-y-3">
                  {/* Type de demande détecté */}
                  <div className="bg-white rounded-lg p-3 border border-purple-100">
                    <p className="text-xs text-gray-500 mb-1">Type de demande détecté:</p>
                    <p className="font-semibold text-purple-800">{aiSuggestion.reason}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Service suggéré: <strong className="text-purple-800">{aiSuggestion.suggestedService?.name || 'Non déterminé'}</strong>
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      aiSuggestion.confidence >= 70 ? 'bg-green-100 text-green-800' :
                      aiSuggestion.confidence >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      Confiance: {aiSuggestion.confidence}%
                    </span>
                  </div>
                  
                  {aiSuggestion.keywords?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Mots-clés détectés:</p>
                      <div className="flex flex-wrap gap-1">
                        {aiSuggestion.keywords.slice(0, 6).map((kw, i) => (
                          <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {aiSuggestion.suggestedServiceId && (
                    <button
                      type="button"
                      onClick={applySuggestion}
                      className="w-full text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      ✓ Appliquer cette suggestion
                    </button>
                  )}
                </div>
              )}
              
              {!aiSuggestion && !analyzing && (
                <p className="text-sm text-gray-500">
                  Remplissez l'objet et le contenu, puis cliquez sur "Analyser" pour obtenir une suggestion.
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="entrant">Entrant</option>
                <option value="sortant">Sortant</option>
                <option value="interne">Interne</option>
              </select>
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
              <select
                name="priorite"
                value={formData.priorite}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="basse">Basse</option>
                <option value="normale">Normale</option>
                <option value="haute">Haute</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service destinataire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service destinataire</label>
              <select
                name="destinataireServiceId"
                value={formData.destinataireServiceId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Sélectionner un service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>

            {/* Date échéance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date d'échéance</label>
              <input
                type="date"
                name="dateEcheance"
                value={formData.dateEcheance}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Expéditeur externe (pour agent/admin) */}
          {['agent_bo', 'admin'].includes(user?.role) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expéditeur externe</label>
              <input
                type="text"
                name="expediteurExterne"
                value={formData.expediteurExterne}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nom de l'expéditeur (si externe)"
              />
            </div>
          )}

          {/* Fichier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pièce jointe</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <p className="text-xs text-gray-500 mt-1">PDF, Word, ou Images (max 10MB)</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Envoi en cours...' : 'Soumettre le courrier'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/courriers')}
              className="px-6 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourrierCreate;
