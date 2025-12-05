import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { assistanceAPI } from '../services/api';
import toast from 'react-hot-toast';

const VideoAssistance = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    preferredDate: '',
    preferredTime: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await assistanceAPI.getAll();
      setRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assistanceAPI.create(formData);
      toast.success('Demande d\'assistance envoyée!');
      setShowRequestForm(false);
      setFormData({ subject: '', description: '', preferredDate: '', preferredTime: '' });
      fetchRequests();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    }
  };

  const handleJoinCall = (roomId) => {
    // Open Jitsi Meet in a new window
    const jitsiUrl = `https://meet.jit.si/GouvernoratMonastir-${roomId}`;
    window.open(jitsiUrl, '_blank', 'width=1200,height=800');
  };

  const handleStartCall = async (requestId) => {
    try {
      await assistanceAPI.startCall(requestId);
      toast.success('Appel démarré!');
      handleJoinCall(requestId);
      fetchRequests();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleEndCall = async (requestId) => {
    try {
      await assistanceAPI.endCall(requestId);
      toast.success('Appel terminé');
      fetchRequests();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const statusLabels = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    scheduled: { label: 'Planifié', color: 'bg-blue-100 text-blue-800' },
    in_progress: { label: 'En cours', color: 'bg-green-100 text-green-800' },
    completed: { label: 'Terminé', color: 'bg-gray-100 text-gray-800' },
    cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800' }
  };

  const isCitizen = user?.role === 'citoyen';
  const isAgent = ['agent_bo', 'admin', 'chef_service'].includes(user?.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              📹 Assistance Vidéo en Direct
            </h1>
            <p className="text-purple-100 mt-1">
              {isCitizen 
                ? 'Demandez une assistance vidéo avec un agent' 
                : 'Gérez les demandes d\'assistance vidéo'}
            </p>
          </div>
          {isCitizen && (
            <button
              onClick={() => setShowRequestForm(true)}
              className="bg-white text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-purple-50"
            >
              📞 Nouvelle demande
            </button>
          )}
        </div>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">📹 Demande d'assistance vidéo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet de votre demande *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Ex: Aide pour déposer un permis"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24"
                  placeholder="Décrivez votre besoin..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date souhaitée
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure souhaitée
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Sélectionner</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Envoyer la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Info Cards for Citizens */}
      {isCitizen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
            <div className="text-2xl mb-2">👤</div>
            <h3 className="font-semibold">Agent virtuel d'accueil</h3>
            <p className="text-sm text-gray-600">Un agent vous accueille en vidéo pour vous guider</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-semibold">Dépôt de documents</h3>
            <p className="text-sm text-gray-600">Partagez votre écran pour montrer vos documents</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold">Aide en direct</h3>
            <p className="text-sm text-gray-600">L'agent vous guide pas à pas dans vos démarches</p>
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            {isCitizen ? 'Mes demandes d\'assistance' : 'Demandes d\'assistance en attente'}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">📹</div>
            <p>Aucune demande d'assistance</p>
            {isCitizen && (
              <button
                onClick={() => setShowRequestForm(true)}
                className="mt-4 text-purple-600 hover:text-purple-700"
              >
                Créer une demande →
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {requests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{request.subject}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusLabels[request.status]?.color}`}>
                        {statusLabels[request.status]?.label}
                      </span>
                    </div>
                    {request.description && (
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      {!isCitizen && request.citizen && (
                        <span>👤 {request.citizen.firstName} {request.citizen.lastName}</span>
                      )}
                      {request.preferredDate && (
                        <span>📅 {new Date(request.preferredDate).toLocaleDateString('fr-FR')}</span>
                      )}
                      {request.preferredTime && (
                        <span>🕐 {request.preferredTime}</span>
                      )}
                      <span>📆 Créé le {new Date(request.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* Citizen actions */}
                    {isCitizen && request.status === 'in_progress' && (
                      <button
                        onClick={() => handleJoinCall(request.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        📹 Rejoindre l'appel
                      </button>
                    )}
                    
                    {/* Agent actions */}
                    {isAgent && request.status === 'pending' && (
                      <button
                        onClick={() => handleStartCall(request.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        📹 Démarrer l'appel
                      </button>
                    )}
                    {isAgent && request.status === 'in_progress' && (
                      <>
                        <button
                          onClick={() => handleJoinCall(request.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          📹 Rejoindre
                        </button>
                        <button
                          onClick={() => handleEndCall(request.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          ✓ Terminer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3">💡 Comment ça marche ?</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
            <p className="text-sm text-blue-700">Créez une demande d'assistance</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
            <p className="text-sm text-blue-700">Un agent prend en charge votre demande</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">3</div>
            <p className="text-sm text-blue-700">Rejoignez l'appel vidéo</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">4</div>
            <p className="text-sm text-blue-700">L'agent vous guide en direct</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAssistance;
