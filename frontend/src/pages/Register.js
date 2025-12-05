import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '', cin: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      return toast.error('Mot de passe: minimum 6 caractères');
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Les mots de passe ne correspondent pas');
    }
    setLoading(true);
    try {
      await register(formData);
      toast.success('Inscription réussie!');
      navigate('/dashboard');
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.errors?.length > 0) {
        toast.error(errData.errors[0].msg);
      } else {
        toast.error(errData?.message || 'Erreur d\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Créer un compte</h1>
          <p className="text-gray-500">Inscription citoyen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CIN</label>
            <input type="text" name="cin" value={formData.cin} onChange={handleChange} maxLength="8"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe (min. 6 car.)</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Déjà un compte? <Link to="/login" className="text-blue-600 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
