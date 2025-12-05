import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { courrierAPI } from '../services/api';

const TrackCourrier = () => {
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

  const statusLabels = {
    recu: 'Reçu', enregistre: 'Enregistré', affecte: 'Affecté',
    en_cours: 'En cours', traite: 'Traité', transmis: 'Transmis', archive: 'Archivé', rejete: 'Rejeté'
  };

  const statusSteps = ['recu', 'enregistre', 'affecte', 'en_cours', 'traite', 'transmis'];

  const getCurrentStep = (status) => {
    const index = statusSteps.indexOf(status);
    return index >= 0 ? index : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📬</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Suivi de Courrier</h1>
          <p className="text-blue-200 mt-2">Gouvernorat de Monastir</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Entrez la référence (ex: BO-2024-00001)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '...' : '🔍 Rechercher'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        {courrier && (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{courrier.reference}</h2>
                <p className="text-gray-500">{courrier.objet}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                courrier.status === 'traite' ? 'bg-green-100 text-green-800' :
                courrier.status === 'rejete' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {statusLabels[courrier.status]}
              </span>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
                  <div 
                    className="h-full bg-blue-600 transition-all" 
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
                    <span className="text-xs mt-2 text-gray-600">{statusLabels[step]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Date de réception</p>
                <p className="font-medium">{new Date(courrier.dateReception).toLocaleDateString('fr-FR')}</p>
              </div>
              {courrier.dateTraitement && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Date de traitement</p>
                  <p className="font-medium">{new Date(courrier.dateTraitement).toLocaleDateString('fr-FR')}</p>
                </div>
              )}
              {courrier.serviceDestinataire && (
                <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                  <p className="text-sm text-gray-500">Service en charge</p>
                  <p className="font-medium">{courrier.serviceDestinataire.name}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            {courrier.historique && courrier.historique.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Historique</h3>
                <div className="space-y-3">
                  {courrier.historique.map((h, i) => (
                    <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <span className="font-medium">{h.action.charAt(0).toUpperCase() + h.action.slice(1)}</span>
                        <span className="text-gray-500 text-sm ml-2">
                          {new Date(h.createdAt).toLocaleString('fr-FR')}
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
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackCourrier;
