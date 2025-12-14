import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { notificationAPI } from '../services/api';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { t, language, toggleLanguage, isRTL } = useLanguage();
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
    { path: '/dashboard', labelKey: 'nav.dashboard', icon: '📊', roles: ['admin', 'agent_bo', 'chef_service', 'secretaire_general', 'citoyen'] },
    { path: '/courriers', labelKey: 'nav.courriers', icon: '📬', roles: ['admin', 'agent_bo', 'chef_service', 'secretaire_general', 'citoyen'] },
    { path: '/courriers/nouveau', labelKey: 'nav.newCourrier', icon: '✉️', roles: ['admin', 'agent_bo', 'citoyen'] },
    { path: '/users', labelKey: 'nav.users', icon: '👥', roles: ['admin'] },
    { path: '/services', labelKey: 'nav.services', icon: '🏢', roles: ['admin'] },
    { path: '/notifications', labelKey: 'nav.notifications', icon: '🔔', roles: ['admin', 'agent_bo', 'chef_service', 'secretaire_general', 'citoyen'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

  const getRoleLabel = (role) => t(`roles.${role}`);

  return (
    <div className={`min-h-screen bg-gray-100 flex ${isRTL ? 'flex-row-reverse' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className={`bg-blue-800 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            {sidebarOpen && (
              <div className={isRTL ? 'text-right' : ''}>
                <h1 className="text-xl font-bold">{t('header.bureauOrdre')}</h1>
                <p className="text-xs text-blue-200">{t('header.gouvernorat')}</p>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-700 rounded">
              {sidebarOpen ? (isRTL ? '▶' : '◀') : (isRTL ? '◀' : '▶')}
            </button>
          </div>
        </div>

        <nav className="mt-8">
          {filteredMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 hover:bg-blue-700 transition ${isRTL ? 'flex-row-reverse' : ''} ${
                location.pathname === item.path ? `bg-blue-900 ${isRTL ? 'border-l-4' : 'border-r-4'} border-white` : ''
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className={isRTL ? 'mr-3' : 'ml-3'}>{t(item.labelKey)}</span>}
              {item.path === '/notifications' && unreadCount > 0 && (
                <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} bg-red-500 text-white text-xs px-2 py-1 rounded-full`}>
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
        <header className={`bg-white shadow-sm px-6 py-4 flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {filteredMenu.find(m => m.path === location.pathname)?.labelKey 
                ? t(filteredMenu.find(m => m.path === location.pathname).labelKey) 
                : t('header.bureauOrdre')}
            </h2>
          </div>
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
              title={t('language.switchLanguage')}
            >
              <span className="text-lg">🌐</span>
              <span>{language === 'fr' ? 'العربية' : 'Français'}</span>
            </button>
            
            <Link to="/notifications" className="relative p-2 hover:bg-gray-100 rounded-full">
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full`}>
                  {unreadCount}
                </span>
              )}
            </Link>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <div className={isRTL ? 'text-left' : 'text-right'}>
                <p className="text-sm font-medium text-gray-700">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{getRoleLabel(user?.role)}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
              >
                {t('auth.logout')}
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
