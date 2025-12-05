import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courrierAPI, serviceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourrierList = () => {
  const { user } = useAuth();
  const [courriers, setCourriers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', type: '', priorite: '', serviceId: '', search: '' });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [courriersRes, servicesRes] = await Promise.all([
        courrierAPI.getAll(filters),
        serviceAPI.getAll()
      ]);
      setCourriers(courriersRes.data.data);
      setServices(servicesRes.data.data);
    } catch (error) {
      console.error('Error fetching courriers');
    } finally {
      setLoading(false);
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

  const priorityColors = {
    basse: 'text-gray-500', normale: 'text-blue-500', haute: 'text-orange-500', urgente: 'text-red-600 font-bold'
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Tous les statuts</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={filters.priorite}
            onChange={(e) => setFilters({ ...filters, priorite: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Toutes priorités</option>
            <option value="basse">Basse</option>
            <option value="normale">Normale</option>
            <option value="haute">Haute</option>
            <option value="urgente">Urgente</option>
          </select>
          <select
            value={filters.serviceId}
            onChange={(e) => setFilters({ ...filters, serviceId: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Tous les services</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
          <Link
            to="/courriers/nouveau"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
          >
            + Nouveau
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Objet</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expéditeur</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priorité</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courriers.map((courrier) => (
                <tr key={courrier.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/courriers/${courrier.id}`} className="text-blue-600 hover:underline font-medium">
                      {courrier.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-800 max-w-xs truncate">{courrier.objet}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {courrier.expediteur ? `${courrier.expediteur.firstName} ${courrier.expediteur.lastName}` : courrier.expediteurExterne || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{courrier.serviceDestinataire?.name || '-'}</td>
                  <td className={`px-4 py-3 ${priorityColors[courrier.priorite]}`}>
                    {courrier.priorite.charAt(0).toUpperCase() + courrier.priorite.slice(1)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[courrier.status]}`}>
                      {statusLabels[courrier.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">
                    {new Date(courrier.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
              {courriers.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    Aucun courrier trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CourrierList;
