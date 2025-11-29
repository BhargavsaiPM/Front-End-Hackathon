import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './UserPages.css';

const RequestLegal = () => {
  const [formData, setFormData] = useState({
    abuse_type: '',
    description: '',
    since_when: '',
    preferred_contact_mode: 'chat'
  });
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const fetchAdvisors = async () => {
    try {
      const response = await api.get('/api/users/advisors', { params: { type: 'legal' } });
      setAdvisors(response.data.advisors);
    } catch (error) {
      console.error('Error fetching advisors:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/help-requests', {
        ...formData,
        type: 'legal'
      });
      alert('Legal help request submitted successfully!');
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const availableAdvisors = advisors.filter(a => a.status === 'available');

  return (
    <div className="request-page">
      <h1>Request Legal Support</h1>
      <p className="page-description">
        Fill out this form to request legal advice and support. Your information is kept confidential.
      </p>

      {error && <div className="error-message">{error}</div>}

      <div className="request-form-container">
        <form onSubmit={handleSubmit} className="request-form">
          <div className="form-group">
            <label htmlFor="abuse_type">Type of Legal Issue</label>
            <select
              id="abuse_type"
              name="abuse_type"
              value={formData.abuse_type}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="protection_order">Protection Order</option>
              <option value="custody">Custody/Child Support</option>
              <option value="harassment">Harassment/Stalking</option>
              <option value="digital">Digital Abuse/Cyberstalking</option>
              <option value="financial">Financial Abuse</option>
              <option value="divorce">Divorce/Separation</option>
              <option value="other">Other Legal Issue</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="since_when">How long have you been facing this?</label>
            <input
              type="text"
              id="since_when"
              name="since_when"
              value={formData.since_when}
              onChange={handleChange}
              placeholder="e.g., 6 months, 1 year, recently"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Brief Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe your legal situation (you don't need to include personal details)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferred_contact_mode">Preferred Communication Mode</label>
            <select
              id="preferred_contact_mode"
              name="preferred_contact_mode"
              value={formData.preferred_contact_mode}
              onChange={handleChange}
            >
              <option value="chat">Chat (Text Messages)</option>
              <option value="call">Phone/Video Call</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>

        <div className="advisors-availability">
          <h3>Legal Advisor Availability</h3>
          {availableAdvisors.length > 0 ? (
            <div className="advisors-list">
              {availableAdvisors.map(advisor => (
                <div key={advisor.id} className="advisor-card">
                  <p><strong>{advisor.pseudonym || advisor.anonymous_id}</strong></p>
                  <p className="status-available">Available</p>
                  {advisor.note && <p className="advisor-note">{advisor.note}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-advisors">No legal advisors currently available. Your request will be processed when one becomes available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestLegal;

