import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/Layout';
import DashboardHome from './DashboardHome';
import Users from './Users';
import Advisors from './Advisors';
import Resources from './Resources';
import AuditLogs from './AuditLogs';

const AdminDashboard = () => {
  return (
    <Layout role="admin" accentColor="#9c27b0">
      <Routes>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="users" element={<Users />} />
        <Route path="advisors" element={<Advisors />} />
        <Route path="resources" element={<Resources />} />
        <Route path="audit" element={<AuditLogs />} />
      </Routes>
    </Layout>
  );
};

export default AdminDashboard;

