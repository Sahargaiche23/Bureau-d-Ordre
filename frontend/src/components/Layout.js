import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll(true);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: '📊', roles: ['admin', 'agent_bo', 'chef_service', 'secretaire_general', 'citoyen'] },
    { path: '/courriers', label: 'Courriers', icon: '📬', roles: ['admin', 'agent_bo', 'chef_service', 'secretaire_general', 'citoyen'] },
    { path: '/courriers/nouveau', label: 'Nouveau Courrier', icon: '✉️', roles: ['admin', 'agent_bo', 'citoyen'] },
    { path: '/users', label: 'Utilisateurs', icon: '👥', roles: ['admin'] },
    { path: '/services', label: 'Services', icon: '🏢', roles: ['admin'] },
    { path: '/notifications', label: 'Notifications', icon: '🔔', roles: ['admin', 'agent_bo', 'chef_service', 'secretaire_general', 'citoyen'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

  const roleLabels = {
    admin: 'Administrateur',
    agent_bo: 'Agent Bureau d\'Ordre',
    chef_service: 'Chef de Service',
    secretaire_general: 'Secrétaire Général',
    citoyen: 'Citoyen'
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`bg-blue-800 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">Bureau d'Ordre</h1>
                <p className="text-xs text-blue-200">Gouvernorat de Monastir</p>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-700 rounded">
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        <nav className="mt-8">
          {filteredMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 hover:bg-blue-700 transition ${
                location.pathname === item.path ? 'bg-blue-900 border-r-4 border-white' : ''
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
              {item.path === '/notifications' && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {filteredMenu.find(m => m.path === location.pathname)?.label || 'Bureau d\'Ordre'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/notifications" className="relative p-2 hover:bg-gray-100 rounded-full">
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{roleLabels[user?.role]}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
