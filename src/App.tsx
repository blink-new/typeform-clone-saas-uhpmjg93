import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/auth-context';
import { LandingPage } from './pages/landing';
import { LoginPage } from './pages/login';
import { SignupPage } from './pages/signup';
import { DashboardPage } from './pages/dashboard';
import { FormBuilderPage } from './pages/form-builder';
import { FormResponsePage } from './pages/form-response';
import { FormAnalyticsPage } from './pages/form-analytics';
import { PricingPage } from './pages/pricing';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/forms/new" element={<FormBuilderPage />} />
          <Route path="/forms/:id/edit" element={<FormBuilderPage />} />
          <Route path="/forms/:id/analytics" element={<FormAnalyticsPage />} />
          <Route path="/f/:id" element={<FormResponsePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;