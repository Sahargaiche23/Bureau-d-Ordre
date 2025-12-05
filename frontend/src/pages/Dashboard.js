import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, courrierAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentCourriers, setRecentCourriers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (['admin', 'agent_bo', 'secretaire_general'].includes(user?.role)) {
        const [statsRes, recentRes] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getRecent(5)
        ]);
        setStats(statsRes.data.data);
        setRecentCourriers(recentRes.data.data);
      } else {
        const res = await courrierAPI.getAll();
        setRecentCourriers(res.data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data');
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Bienvenue, {user?.firstName}!</h1>
        <p className="text-blue-100 mt-1">Bureau d'Ordre Digital - Gouvernorat de Monastir</p>
      </div>

      {/* Stats Cards (Admin/Agent) */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Courriers</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalCourriers}</p>
              </div>
              <div className="text-4xl">📬</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">En attente</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingCourriers}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Traités</p>
                <p className="text-3xl font-bold text-green-600">{stats.processedCourriers}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Urgents</p>
                <p className="text-3xl font-bold text-red-600">{stats.urgentCourriers}</p>
              </div>
              <div className="text-4xl">🚨</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/courriers/nouveau" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            ✉️ Nouveau courrier
          </Link>
          <Link to="/courriers" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200">
            📋 Voir tous les courriers
          </Link>
          {user?.role === 'admin' && (
            <>
              <Link to="/users" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200">
                👥 Gérer utilisateurs
              </Link>
              <Link to="/services" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200">
                🏢 Gérer services
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Recent Courriers */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Courriers récents</h2>
          <Link to="/courriers" className="text-blue-600 hover:underline text-sm">Voir tout →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Objet</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentCourriers.map((courrier) => (
                <tr key={courrier.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/courriers/${courrier.id}`} className="text-blue-600 hover:underline font-medium">
                      {courrier.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-800">{courrier.objet}</td>
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
              {recentCourriers.length === 0 && (
                <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500">Aucun courrier</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
