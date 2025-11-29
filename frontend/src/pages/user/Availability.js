import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './UserPages.css';

const Availability = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [legalAdvisors, setLegalAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const [counsellorsRes, legalRes] = await Promise.all([
        api.get('/api/users/advisors', { params: { type: 'counsellor' } }),
        api.get('/api/users/advisors', { params: { type: 'legal' } })
      ]);
      setCounsellors(counsellorsRes.data.advisors);
      setLegalAdvisors(legalRes.data.advisors);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#4caf50';
      case 'busy': return '#ff9800';
      case 'offline': return '#9e9e9e';
      default: return '#666';
    }
  };

  return (
    <div className="availability-page">
      <h1>Advisor Availability</h1>
      <p className="page-description">
        View the current availability of counsellors and legal advisors.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="availability-section">
            <h2>Counsellors</h2>
            {counsellors.length === 0 ? (
              <p className="no-advisors">No counsellors registered.</p>
            ) : (
              <div className="advisors-grid">
                {counsellors.map(advisor => (
                  <div key={advisor.id} className="availability-card">
                    <h3>{advisor.pseudonym || advisor.anonymous_id}</h3>
                    <div className="status-indicator">
                      <span
                        className="status-dot"
                        style={{ backgroundColor: getStatusColor(advisor.status) }}
                      />
                      <span className="status-text">{advisor.status || 'offline'}</span>
                    </div>
                    {advisor.note && <p className="availability-note">{advisor.note}</p>}
                    {advisor.time_window && (
                      <p className="time-window">Available: {advisor.time_window}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="availability-section">
            <h2>Legal Advisors</h2>
            {legalAdvisors.length === 0 ? (
              <p className="no-advisors">No legal advisors registered.</p>
            ) : (
              <div className="advisors-grid">
                {legalAdvisors.map(advisor => (
                  <div key={advisor.id} className="availability-card">
                    <h3>{advisor.pseudonym || advisor.anonymous_id}</h3>
                    <div className="status-indicator">
                      <span
                        className="status-dot"
                        style={{ backgroundColor: getStatusColor(advisor.status) }}
                      />
                      <span className="status-text">{advisor.status || 'offline'}</span>
                    </div>
                    {advisor.note && <p className="availability-note">{advisor.note}</p>}
                    {advisor.time_window && (
                      <p className="time-window">Available: {advisor.time_window}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Availability;

