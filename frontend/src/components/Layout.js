import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children, role, accentColor = '#4a90e2' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabels = {
    victim: 'User Portal',
    counsellor: 'Counsellor Portal',
    legal: 'Legal Advisor Portal',
    admin: 'Admin Portal'
  };

  const getNavLinks = () => {
    switch (role) {
      case 'victim':
        return [
          { path: '/user/dashboard', label: 'Dashboard' },
          { path: '/user/resources', label: 'Resources' },
          { path: '/user/request-counselling', label: 'Request Counselling' },
          { path: '/user/request-legal', label: 'Request Legal Help' },
          { path: '/user/chat', label: 'Messages' },
          { path: '/user/availability', label: 'Advisor Availability' }
        ];
      case 'counsellor':
        return [
          { path: '/counsellor/dashboard', label: 'Dashboard' },
          { path: '/counsellor/requests', label: 'Help Requests' },
          { path: '/counsellor/availability', label: 'Availability' },
          { path: '/counsellor/chat', label: 'Messages' }
        ];
      case 'legal':
        return [
          { path: '/legal/dashboard', label: 'Dashboard' },
          { path: '/legal/requests', label: 'Legal Requests' },
          { path: '/legal/availability', label: 'Availability' },
          { path: '/legal/chat', label: 'Messages' }
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard' },
          { path: '/admin/users', label: 'Users' },
          { path: '/admin/advisors', label: 'Advisors' },
          { path: '/admin/resources', label: 'Resources' },
          { path: '/admin/audit', label: 'Audit Logs' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="layout" style={{ '--accent-color': accentColor }}>
      <header className="header">
        <div className="header-content">
          <h1 className="logo">{roleLabels[role] || 'Support System'}</h1>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
        <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          {getNavLinks().map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={location.pathname === link.path ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
      </header>
      
      <main className="main-content">
        {children}
      </main>
      
      <footer className="footer">
        <p>Anonymous ID: {user?.anonymousId || 'N/A'}</p>
        <p>&copy; 2024 Domestic Violence Support System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;

