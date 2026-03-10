import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import './i18n';

import LoginPage from './pages/LoginPage';
import PublicMenuPage from './pages/PublicMenuPage';
import DashboardPage from './pages/DashboardPage';
import MenuManagementPage from './pages/MenuManagementPage';
import InventoryPage from './pages/InventoryPage';
import EmployeesPage from './pages/EmployeesPage';
import FinancePage from './pages/FinancePage';
import Layout from './components/Layout';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rustic-cream">
        <div className="animate-spin w-10 h-10 border-4 border-rustic-wood border-t-transparent rounded-full" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoutes() {
  return (
    <PrivateRoute>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/menu" element={<MenuManagementPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/finance" element={<FinancePage />} />
        </Routes>
      </Layout>
    </PrivateRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '12px', padding: '12px 16px' },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/menu/:slug" element={<PublicMenuPage />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
