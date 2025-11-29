import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/Layout';
import DashboardHome from './DashboardHome';
import Requests from './Requests';
import Availability from './Availability';
import Chat from './Chat';

const LegalDashboard = () => {
  return (
    <Layout role="legal" accentColor="#2196f3">
      <Routes>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="requests" element={<Requests />} />
        <Route path="availability" element={<Availability />} />
        <Route path="chat" element={<Chat />} />
      </Routes>
    </Layout>
  );
};

export default LegalDashboard;

