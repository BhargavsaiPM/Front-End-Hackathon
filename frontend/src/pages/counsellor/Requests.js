import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import '../user/UserPages.css';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchRequests = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.get('/api/help-requests/counselling', { params });
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (requestId) => {
    try {
      await api.patch(`/api/help-requests/${requestId}/assign`);
      alert('Request assigned to you successfully!');
      fetchRequests();
    } catch (error) {
      console.error('Error assigning request:', error);
      alert('Failed to assign request');
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await api.patch(`/api/help-requests/${requestId}/status`, { status: newStatus });
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  return (
    <div className="resources-page">
      <h1>Counselling Requests</h1>
      
      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          All
        </button>
        <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>
          Pending
        </button>
        <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>
          Active
        </button>
        <button className={filter === 'closed' ? 'active' : ''} onClick={() => setFilter('closed')}>
          Closed
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <p>No requests found.</p>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <h3>Request from {request.pseudonym || request.anonymous_id}</h3>
                <span className="status-badge" style={{ backgroundColor: request.status === 'pending' ? '#ff9800' : request.status === 'active' ? '#4caf50' : '#9e9e9e' }}>
                  {request.status}
                </span>
              </div>
              <p className="request-type"><strong>Issue Type:</strong> {request.abuse_type || 'Not specified'}</p>
              {request.since_when && (
                <p className="request-date"><strong>Duration:</strong> {request.since_when}</p>
              )}
              {request.description && (
                <p className="request-description"><strong>Description:</strong> {request.description}</p>
              )}
              <p className="request-date">Created: {new Date(request.created_at).toLocaleDateString()}</p>
              
              <div className="request-actions">
                {request.status === 'pending' && !request.assigned_to && (
                  <button onClick={() => handleAssign(request.id)} className="btn-primary">
                    Assign to Me
                  </button>
                )}
                {request.assigned_to && (
                  <>
                    <Link to={`/counsellor/chat?request=${request.id}`} className="btn-link">
                      Open Chat
                    </Link>
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;

