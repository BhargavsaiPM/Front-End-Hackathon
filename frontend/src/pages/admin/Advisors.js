import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import '../user/UserPages.css';

const Advisors = () => {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'counsellor',
    pseudonym: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const fetchAdvisors = async () => {
    try {
      const response = await api.get('/api/admin/advisors');
      setAdvisors(response.data.advisors);
    } catch (error) {
      console.error('Error fetching advisors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await api.post('/api/admin/advisors', formData);
      setMessage('Advisor created successfully!');
      setShowForm(false);
      setFormData({ email: '', password: '', role: 'counsellor', pseudonym: '' });
      fetchAdvisors();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to create advisor');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this advisor?')) return;

    try {
      await api.delete(`/api/admin/advisors/${id}`);
      setMessage('Advisor deleted successfully!');
      fetchAdvisors();
    } catch (error) {
      setMessage('Failed to delete advisor');
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt('Enter new password (min 6 characters):');
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await api.post(`/api/admin/advisors/${id}/reset-password`, { newPassword });
      alert('Password reset successfully!');
    } catch (error) {
      alert('Failed to reset password');
    }
  };

  return (
    <div className="resources-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Advisors Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Create Advisor'}
        </button>
      </div>

      {message && (
        <div className={message.includes('success') ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="request-form" style={{ marginBottom: '2rem' }}>
          <h3>Create New Advisor</h3>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="counsellor">Counsellor</option>
              <option value="legal">Legal Advisor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Pseudonym (Optional)</label>
            <input
              type="text"
              value={formData.pseudonym}
              onChange={(e) => setFormData({ ...formData, pseudonym: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary">Create</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : advisors.length === 0 ? (
        <div className="empty-state">
          <p>No advisors registered yet.</p>
        </div>
      ) : (
        <div className="requests-list">
          {advisors.map(advisor => (
            <div key={advisor.id} className="request-card">
              <div className="request-header">
                <h3>{advisor.pseudonym || advisor.anonymous_id}</h3>
                <span className="status-badge" style={{ backgroundColor: advisor.role === 'counsellor' ? '#4caf50' : '#2196f3' }}>
                  {advisor.role}
                </span>
              </div>
              <p className="request-type"><strong>Email:</strong> {advisor.email}</p>
              <p className="request-type"><strong>Anonymous ID:</strong> {advisor.anonymous_id}</p>
              {advisor.status && (
                <p className="request-date"><strong>Status:</strong> {advisor.status}</p>
              )}
              <p className="request-date">
                <strong>Created:</strong> {new Date(advisor.created_at).toLocaleDateString()}
              </p>
              <div className="request-actions">
                <button onClick={() => handleResetPassword(advisor.id)} className="btn-link" style={{ marginRight: '0.5rem' }}>
                  Reset Password
                </button>
                <button onClick={() => handleDelete(advisor.id)} className="btn-link" style={{ backgroundColor: '#dc3545', color: 'white' }}>
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

export default Advisors;

