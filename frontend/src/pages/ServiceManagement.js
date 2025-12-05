import React, { useState, useEffect } from 'react';
import { serviceAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', description: '', email: '', phone: '', chefId: '', keywords: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, usersRes] = await Promise.all([
        serviceAPI.getAll(),
        userAPI.getAll({ role: 'chef_service' })
      ]);
      setServices(servicesRes.data.data);
      setChefs(usersRes.data.data);
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, keywords: formData.keywords.split(',').map(k => k.trim()) };
      if (editingService) {
        await serviceAPI.update(editingService.id, data);
        toast.success('Service modifié');
      } else {
        await serviceAPI.create(data);
        toast.success('Service créé');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name, code: service.code, description: service.description || '',
      email: service.email || '', phone: service.phone || '', chefId: service.chefId || '',
      keywords: Array.isArray(service.keywords) ? service.keywords.join(', ') : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Désactiver ce service?')) {
      try {
        await serviceAPI.delete(id);
        toast.success('Service désactivé');
        fetchData();
      } catch (error) {
        toast.error('Erreur');
      }
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({ name: '', code: '', description: '', email: '', phone: '', chefId: '', keywords: '' });
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Services</h1>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Nouveau service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <span className="text-sm text-gray-500">Code: {service.code}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {service.isActive ? 'Actif' : 'Inactif'}
              </span>
            </div>
            {service.description && <p className="text-gray-600 text-sm mb-4">{service.description}</p>}
            {service.chef && (
              <p className="text-sm mb-2">
                <span className="text-gray-500">Chef:</span> {service.chef.firstName} {service.chef.lastName}
              </p>
            )}
            {service.email && <p className="text-sm text-gray-500 mb-1">📧 {service.email}</p>}
            {service.phone && <p className="text-sm text-gray-500 mb-3">📞 {service.phone}</p>}
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <button onClick={() => handleEdit(service)} className="text-blue-600 hover:underline text-sm">Modifier</button>
              <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:underline text-sm">Désactiver</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">{editingService ? 'Modifier' : 'Nouveau'} service</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom du service" className="px-4 py-2 border rounded-lg" required />
                <input type="text" name="code" value={formData.code} onChange={handleChange} placeholder="Code (ex: SAG)" className="px-4 py-2 border rounded-lg" required />
              </div>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full px-4 py-2 border rounded-lg h-20" />
              <div className="grid grid-cols-2 gap-4">
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="px-4 py-2 border rounded-lg" />
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone" className="px-4 py-2 border rounded-lg" />
              </div>
              <select name="chefId" value={formData.chefId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="">Sélectionner chef de service</option>
                {chefs.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
              <input type="text" name="keywords" value={formData.keywords} onChange={handleChange} placeholder="Mots-clés IA (séparés par virgule)" className="w-full px-4 py-2 border rounded-lg" />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Enregistrer</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
