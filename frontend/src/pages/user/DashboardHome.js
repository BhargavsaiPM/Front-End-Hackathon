import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './UserPages.css';

const DashboardHome = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/api/help-requests/my-requests');
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'active': return '#4caf50';
      case 'closed': return '#9e9e9e';
      default: return '#666';
    }
  };

  return (
    <div className="user-dashboard">
      <div className="welcome-section">
        <h1>Welcome, {user?.pseudonym || user?.anonymousId}</h1>
        <p className="anonymous-id">Your Anonymous ID: <strong>{user?.anonymousId}</strong></p>
        <p className="welcome-text">
          You are safe here. Your identity is protected, and all interactions are confidential.
        </p>
      </div>

      <div className="quick-actions">
        <Link to="/user/request-counselling" className="action-card counselling">
          <h3>Request Counselling</h3>
          <p>Get emotional support from trained counsellors</p>
        </Link>
        <Link to="/user/request-legal" className="action-card legal">
          <h3>Request Legal Help</h3>
          <p>Get legal advice and support</p>
        </Link>
        <Link to="/user/resources" className="action-card resources">
          <h3>Resources</h3>
          <p>Access information and helplines</p>
        </Link>
        <Link to="/user/chat" className="action-card chat">
          <h3>Messages</h3>
          <p>View your conversations</p>
        </Link>
      </div>

      <div className="requests-section">
        <h2>Your Help Requests</h2>
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <p>You haven't submitted any help requests yet.</p>
            <Link to="/user/request-counselling" className="btn-primary">Request Help</Link>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <h3>{request.type === 'counselling' ? 'Counselling Request' : 'Legal Request'}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(request.status) }}
                  >
                    {request.status}
                  </span>
                </div>
                <p className="request-type">Type: {request.abuse_type || 'Not specified'}</p>
                {request.assigned_to && (
                  <p className="assigned-to">
                    Assigned to: {request.advisor_pseudonym || request.advisor_anonymous_id}
                  </p>
                )}
                <p className="request-date">
                  Created: {new Date(request.created_at).toLocaleDateString()}
                </p>
                <Link 
                  to={`/user/chat?request=${request.id}`}
                  className="btn-link"
                >
                  View Messages
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

