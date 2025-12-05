import React, { useState, useEffect } from 'react';
import { userAPI, serviceAPI } from '../services/api';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '', phone: '', cin: '', role: 'citoyen', serviceId: '', isActive: true
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [usersRes, servicesRes] = await Promise.all([userAPI.getAll(), serviceAPI.getAll()]);
      setUsers(usersRes.data.data);
      setServices(servicesRes.data.data);
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await userAPI.update(editingUser.id, formData);
        toast.success('Utilisateur modifié');
      } else {
        await userAPI.create(formData);
        toast.success('Utilisateur créé');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email, password: '', firstName: user.firstName, lastName: user.lastName,
      phone: user.phone || '', cin: user.cin || '', role: user.role,
      serviceId: user.serviceId || '', isActive: user.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cet utilisateur?')) {
      try {
        await userAPI.delete(id);
        toast.success('Utilisateur supprimé');
        fetchData();
      } catch (error) {
        toast.error('Erreur de suppression');
      }
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '', cin: '', role: 'citoyen', serviceId: '', isActive: true });
  };

  const roleLabels = {
    admin: 'Administrateur', agent_bo: 'Agent BO', chef_service: 'Chef Service',
    secretaire_general: 'Secrétaire Général', citoyen: 'Citoyen'
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Nouvel utilisateur
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{roleLabels[user.role]}</span></td>
                <td className="px-4 py-3 text-gray-600">{user.service?.name || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline mr-3">Modifier</button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editingUser ? 'Modifier' : 'Nouvel'} utilisateur</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Prénom" className="px-4 py-2 border rounded-lg" required />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Nom" className="px-4 py-2 border rounded-lg" required />
              </div>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-2 border rounded-lg" required />
              {!editingUser && <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mot de passe" className="w-full px-4 py-2 border rounded-lg" required />}
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone" className="px-4 py-2 border rounded-lg" />
                <input type="text" name="cin" value={formData.cin} onChange={handleChange} placeholder="CIN" maxLength="8" className="px-4 py-2 border rounded-lg" />
              </div>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                {Object.entries(roleLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
              {['agent_bo', 'chef_service'].includes(formData.role) && (
                <select name="serviceId" value={formData.serviceId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Sélectionner service</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              )}
              <label className="flex items-center"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="mr-2" /> Actif</label>
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

export default UserManagement;
