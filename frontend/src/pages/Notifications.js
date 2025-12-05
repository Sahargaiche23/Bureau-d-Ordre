import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationAPI, aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingReminders, setCheckingReminders] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll(filter === 'unread');
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Admin: Trigger manual reminder check
  const handleCheckReminders = async () => {
    setCheckingReminders(true);
    try {
      const response = await aiAPI.checkReminders();
      const { rappels, escalades } = response.data.data;
      if (rappels > 0 || escalades > 0) {
        toast.success(`${rappels} rappel(s) et ${escalades} escalade(s) envoyés`);
        fetchNotifications();
      } else {
        toast.info('Aucun courrier en retard détecté');
      }
    } catch (error) {
      toast.error('Erreur lors de la vérification');
    } finally {
      setCheckingReminders(false);
    }
  };

  // Admin: Send test notification
  const handleTestNotification = async () => {
    try {
      await notificationAPI.sendTest();
      toast.success('Notification de test envoyée!');
      fetchNotifications();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      toast.success('Toutes les notifications marquées comme lues');
      fetchNotifications();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const typeIcons = {
    nouveau_courrier: '📬',
    affectation: '📤',
    rappel: '🔔',
    traitement: '✅',
    reponse: '💬',
    urgence: '🚨',
    systeme: '⚙️'
  };

  const typeColors = {
    nouveau_courrier: 'bg-blue-100 text-blue-800',
    affectation: 'bg-yellow-100 text-yellow-800',
    rappel: 'bg-orange-100 text-orange-800',
    traitement: 'bg-green-100 text-green-800',
    reponse: 'bg-purple-100 text-purple-800',
    urgence: 'bg-red-100 text-red-800',
    systeme: 'bg-gray-100 text-gray-800'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <div className="flex gap-4">
          {user?.role === 'admin' && (
            <>
              <button
                onClick={handleTestNotification}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                🧪 Test
              </button>
              <button
                onClick={handleCheckReminders}
                disabled={checkingReminders}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
              >
                {checkingReminders ? (
                  <>
                    <span className="animate-spin">⏳</span> Vérification...
                  </>
                ) : (
                  <>🔔 Vérifier rappels</>
                )}
              </button>
            </>
          )}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">Toutes</option>
            <option value="unread">Non lues</option>
          </select>
          <button
            onClick={handleMarkAllAsRead}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <span className="text-4xl block mb-4">🔔</span>
            <p>Aucune notification</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition ${!notification.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${typeColors[notification.type]}`}>
                    {typeIcons[notification.type]}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.titre}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                        {notification.courrier && (
                          <Link
                            to={`/courriers/${notification.courrier.id}`}
                            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                          >
                            Voir le courrier {notification.courrier.reference} →
                          </Link>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">
                          {new Date(notification.createdAt).toLocaleString('fr-FR')}
                        </span>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="block text-xs text-blue-600 hover:underline mt-1"
                          >
                            Marquer comme lu
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
