import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import '../user/UserPages.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users/anonymized');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resources-page">
      <h1>Users (Anonymized)</h1>
      <p className="page-description">
        View anonymized user list. Personal identifiers are never shown to protect privacy.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <p>No users registered yet.</p>
        </div>
      ) : (
        <div className="requests-list">
          {users.map(user => (
            <div key={user.id} className="request-card">
              <div className="request-header">
                <h3>{user.pseudonym || user.anonymous_id}</h3>
              </div>
              <p className="request-type"><strong>Anonymous ID:</strong> {user.anonymous_id}</p>
              {user.gender && (
                <p className="request-date"><strong>Gender:</strong> {user.gender}</p>
              )}
              <p className="request-date">
                <strong>Registered:</strong> {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;

