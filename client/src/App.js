import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import GatePage from './pages/GatePage';
import DashboardPage from './pages/DashboardPage';
import WorkersPage from './pages/WorkersPage';
import ReportsPage from './pages/ReportsPage';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function Layout({ children }) {
  const location = useLocation();
  const showNavbar = location.pathname !== '/login';
  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/gate" element={
            <ProtectedRoute><GatePage /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/workers" element={
            <ProtectedRoute><WorkersPage /></ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute><ReportsPage /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;