import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import '../user/UserPages.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCounsellors: 0,
    totalLegalAdvisors: 0,
    activeCases: 0,
    closedCases: 0,
    pendingCases: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-dashboard">
      <div className="welcome-section" style={{ background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)' }}>
        <h1>Admin Dashboard</h1>
        <p className="welcome-text">
          Manage the support system, users, advisors, and resources.
        </p>
      </div>

      <div className="quick-actions">
        <Link to="/admin/users" className="action-card counselling">
          <h3>Users</h3>
          <p>View anonymized user list</p>
        </Link>
        <Link to="/admin/advisors" className="action-card legal">
          <h3>Advisors</h3>
          <p>Manage counsellors and legal advisors</p>
        </Link>
        <Link to="/admin/resources" className="action-card resources">
          <h3>Resources</h3>
          <p>Manage resources and information</p>
        </Link>
        <Link to="/admin/audit" className="action-card chat">
          <h3>Audit Logs</h3>
          <p>View system activity logs</p>
        </Link>
      </div>

      <div className="stats-section">
        <h2>System Statistics</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalCounsellors}</h3>
              <p>Counsellors</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalLegalAdvisors}</h3>
              <p>Legal Advisors</p>
            </div>
            <div className="stat-card">
              <h3>{stats.activeCases}</h3>
              <p>Active Cases</p>
            </div>
            <div className="stat-card">
              <h3>{stats.pendingCases}</h3>
              <p>Pending Cases</p>
            </div>
            <div className="stat-card">
              <h3>{stats.closedCases}</h3>
              <p>Closed Cases</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;

