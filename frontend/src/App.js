import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/user/UserDashboard';
import CounsellorDashboard from './pages/counsellor/CounsellorDashboard';
import LegalDashboard from './pages/legal/LegalDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import QuickExit from './components/QuickExit';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const HomeRoute = () => {
  const { user } = useAuth();

  // If user is logged in, redirect to their dashboard
  if (user) {
    switch (user.role) {
      case 'victim':
        return <Navigate to="/user/dashboard" replace />;
      case 'counsellor':
        return <Navigate to="/counsellor/dashboard" replace />;
      case 'legal':
        return <Navigate to="/legal/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Home />;
    }
  }

  // If not logged in, show home page
  return <Home />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <QuickExit />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/user/*"
            element={
              <ProtectedRoute allowedRoles={['victim']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/counsellor/*"
            element={
              <ProtectedRoute allowedRoles={['counsellor']}>
                <CounsellorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/legal/*"
            element={
              <ProtectedRoute allowedRoles={['legal']}>
                <LegalDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

