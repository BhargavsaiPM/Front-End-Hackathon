import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import '../user/UserPages.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'online_resource',
    description: '',
    link_or_number: '',
    category: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await api.get('/api/resources');
      setResources(response.data.resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingResource) {
        await api.put(`/api/resources/${editingResource.id}`, formData);
        setMessage('Resource updated successfully!');
      } else {
        await api.post('/api/resources', formData);
        setMessage('Resource created successfully!');
      }
      setShowForm(false);
      setEditingResource(null);
      setFormData({ title: '', type: 'online_resource', description: '', link_or_number: '', category: '' });
      fetchResources();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to save resource');
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      type: resource.type,
      description: resource.description || '',
      link_or_number: resource.link_or_number || '',
      category: resource.category || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      await api.delete(`/api/resources/${id}`);
      setMessage('Resource deleted successfully!');
      fetchResources();
    } catch (error) {
      setMessage('Failed to delete resource');
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      online_resource: 'Online Resource',
      helpline: 'Helpline',
      legal_info: 'Legal Information',
      health_info: 'Health Information'
    };
    return labels[type] || type;
  };

  return (
    <div className="resources-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Resources Management</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingResource(null); setFormData({ title: '', type: 'online_resource', description: '', link_or_number: '', category: '' }); }} className="btn-primary">
          {showForm ? 'Cancel' : 'Create Resource'}
        </button>
      </div>

      {message && (
        <div className={message.includes('success') ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="request-form" style={{ marginBottom: '2rem' }}>
          <h3>{editingResource ? 'Edit Resource' : 'Create New Resource'}</h3>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="online_resource">Online Resource</option>
              <option value="helpline">Helpline</option>
              <option value="legal_info">Legal Information</option>
              <option value="health_info">Health Information</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Link or Number</label>
            <input
              type="text"
              value={formData.link_or_number}
              onChange={(e) => setFormData({ ...formData, link_or_number: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Emergency, Mental Health, Legal Rights"
            />
          </div>
          <button type="submit" className="btn-primary">
            {editingResource ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          <p>No resources yet.</p>
        </div>
      ) : (
        <div className="resources-list">
          {resources.map(resource => (
            <div key={resource.id} className="resource-card">
              <div className="resource-header">
                <h3>{resource.title}</h3>
                <span className="resource-type">{getTypeLabel(resource.type)}</span>
              </div>
              {resource.description && (
                <p className="resource-description">{resource.description}</p>
              )}
              {resource.category && (
                <p className="resource-category">Category: {resource.category}</p>
              )}
              <div className="request-actions" style={{ marginTop: '1rem' }}>
                <button onClick={() => handleEdit(resource)} className="btn-link" style={{ marginRight: '0.5rem' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(resource.id)} className="btn-link" style={{ backgroundColor: '#dc3545', color: 'white' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;

