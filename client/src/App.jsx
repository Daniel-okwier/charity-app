import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@contexts/AuthContext';
import { ToastProvider } from '@contexts/ToastContext'; 

// Pages
import HomePage from '@pages/HomePage';
import RegisterPage from '@pages/RegisterPage';
import AboutPage from '@pages/AboutPage';
import ProjectsPage from '@pages/ProjectsPage';
import LoginPage from '@pages/LoginPage';
import PaymentPage from '@pages/PaymentPage';
import DashboardPage from '@pages/DashboardPage';
import AdminDashboard from '@pages/AdminDashboard';
import NotFound from '@pages/NotFound';
import PrivateRoute from '@components/Auth/PrivateRoute';

// Role IDs
const ADMIN_ROLE = 1;
const USER_ROLE = 2;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider> 
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
             <Route path="/about" element={<AboutPage />} />
             <Route path="/projects" element={<ProjectsPage />} />


            {/* Protected User Routes */}
            <Route element={<PrivateRoute requiredRole={USER_ROLE} />}>
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            
            {/* Protected Admin Routes */}
            <Route element={<PrivateRoute requiredRole={ADMIN_ROLE} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;