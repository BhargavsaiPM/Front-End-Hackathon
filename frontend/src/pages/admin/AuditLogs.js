import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import '../user/UserPages.css';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/api/admin/audit-logs');
      setLogs(response.data.logs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resources-page">
      <h1>Audit Logs</h1>
      <p className="page-description">
        View system activity and administrative actions.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <div className="empty-state">
          <p>No audit logs yet.</p>
        </div>
      ) : (
        <div className="requests-list">
          {logs.map(log => (
            <div key={log.id} className="request-card">
              <div className="request-header">
                <h3>{log.action_type.replace(/_/g, ' ').toUpperCase()}</h3>
                <span className="status-badge" style={{ backgroundColor: '#9c27b0' }}>
                  {new Date(log.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="request-type"><strong>Admin:</strong> {log.admin_anonymous_id}</p>
              {log.description && (
                <p className="request-description"><strong>Description:</strong> {log.description}</p>
              )}
              <p className="request-date">
                <strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditLogs;

