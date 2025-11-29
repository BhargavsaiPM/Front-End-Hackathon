import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import '../user/UserPages.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    pending: 0,
    active: 0,
    closed: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, activeRes, closedRes, recentRes] = await Promise.all([
        api.get('/api/help-requests/legal', { params: { status: 'pending' } }),
        api.get('/api/help-requests/legal', { params: { status: 'active' } }),
        api.get('/api/help-requests/legal', { params: { status: 'closed' } }),
        api.get('/api/help-requests/legal')
      ]);
      
      setStats({
        pending: pendingRes.data.requests.length,
        active: activeRes.data.requests.length,
        closed: closedRes.data.requests.length
      });
      
      setRecentRequests(recentRes.data.requests.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-dashboard">
      <div className="welcome-section" style={{ background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)' }}>
        <h1>Legal Advisor Dashboard</h1>
        <p className="welcome-text">
          Provide legal guidance and support. Remember: you only see anonymized information.
        </p>
      </div>

      <div className="quick-actions">
        <Link to="/legal/requests" className="action-card legal">
          <h3>Legal Requests</h3>
          <p>View and manage legal help requests</p>
        </Link>
        <Link to="/legal/chat" className="action-card chat">
          <h3>Messages</h3>
          <p>Communicate with users</p>
        </Link>
        <Link to="/legal/availability" className="action-card resources">
          <h3>Availability</h3>
          <p>Update your availability status</p>
        </Link>
      </div>

      <div className="stats-section">
        <h2>Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.pending}</h3>
            <p>Pending Requests</p>
          </div>
          <div className="stat-card">
            <h3>{stats.active}</h3>
            <p>Active Cases</p>
          </div>
          <div className="stat-card">
            <h3>{stats.closed}</h3>
            <p>Closed Cases</p>
          </div>
        </div>
      </div>

      <div className="requests-section">
        <h2>Recent Requests</h2>
        {loading ? (
          <p>Loading...</p>
        ) : recentRequests.length === 0 ? (
          <div className="empty-state">
            <p>No requests yet.</p>
          </div>
        ) : (
          <div className="requests-list">
            {recentRequests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <h3>Request from {request.pseudonym || request.anonymous_id}</h3>
                  <span className="status-badge" style={{ backgroundColor: request.status === 'pending' ? '#ff9800' : request.status === 'active' ? '#4caf50' : '#9e9e9e' }}>
                    {request.status}
                  </span>
                </div>
                <p className="request-type">Type: {request.abuse_type || 'Not specified'}</p>
                <p className="request-date">Created: {new Date(request.created_at).toLocaleDateString()}</p>
                <Link to={`/legal/chat?request=${request.id}`} className="btn-link">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;

