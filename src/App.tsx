import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { AuthPage } from './components/auth/AuthPage';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ReportPage } from './pages/ReportPage';
import { MyItemsPage } from './pages/MyItemsPage';
import { MatchesPage } from './pages/MatchesPage';
import { StatsPage } from './pages/StatsPage';
import { AdminDashboard } from './components/admin/AdminDashboard';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/my-items" element={<MyItemsPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/stats" element={<StatsPage />} />
          {user?.role === 'admin' && (
            <Route path="/admin" element={<AdminDashboard />} />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;