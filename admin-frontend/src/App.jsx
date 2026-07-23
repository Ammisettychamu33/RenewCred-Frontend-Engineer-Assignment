import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AllPagesPage from './pages/AllPagesPage';
import CreateEditPage from './pages/CreateEditPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin CMS Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="pages" element={<AllPagesPage />} />
          <Route path="pages/new" element={<CreateEditPage />} />
          <Route path="pages/edit/:id" element={<CreateEditPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
