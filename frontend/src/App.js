import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourrierList from './pages/CourrierList';
import CourrierDetail from './pages/CourrierDetail';
import CourrierCreate from './pages/CourrierCreate';
import UserManagement from './pages/UserManagement';
import ServiceManagement from './pages/ServiceManagement';
import TrackCourrier from './pages/TrackCourrier';
import Notifications from './pages/Notifications';

// Components
import Layout from './components/Layout';

// Protected Route
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/suivi" element={<TrackCourrier />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          
          <Route path="/courriers" element={
            <ProtectedRoute><CourrierList /></ProtectedRoute>
          } />
          
          <Route path="/courriers/nouveau" element={
            <ProtectedRoute roles={['admin', 'agent_bo', 'citoyen']}><CourrierCreate /></ProtectedRoute>
          } />
          
          <Route path="/courriers/:id" element={
            <ProtectedRoute><CourrierDetail /></ProtectedRoute>
          } />
          
          <Route path="/notifications" element={
            <ProtectedRoute><Notifications /></ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>
          } />
          
          <Route path="/services" element={
            <ProtectedRoute roles={['admin']}><ServiceManagement /></ProtectedRoute>
          } />
          
          {/* Default */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
