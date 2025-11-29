import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/Layout';
import DashboardHome from './DashboardHome';
import Resources from './Resources';
import RequestCounselling from './RequestCounselling';
import RequestLegal from './RequestLegal';
import Chat from './Chat';
import Availability from './Availability';

const UserDashboard = () => {
  return (
    <Layout role="victim" accentColor="#4a90e2">
      <Routes>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="resources" element={<Resources />} />
        <Route path="request-counselling" element={<RequestCounselling />} />
        <Route path="request-legal" element={<RequestLegal />} />
        <Route path="chat" element={<Chat />} />
        <Route path="availability" element={<Availability />} />
      </Routes>
    </Layout>
  );
};

export default UserDashboard;

