
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useSubscription } from './hooks/useSubscription';
import Layout from './components/Layout/Layout';
import LanguageSelect from './pages/LanguageSelect';
import Login from './pages/Login';
import Subscription from './pages/Subscription';
import Dashboard from './pages/Dashboard';
import CropHealthDiagnosis from './pages/CropHealthDiagnosis';
import SmartFarmingAdvisory from './pages/SmartFarmingAdvisory';
import MarketPrices from './pages/MarketPrices';
import KnowledgeBase from './pages/KnowledgeBase';
import FarmActivityLog from './pages/FarmActivityLog';
import CropTypeSelection from './pages/CropTypeSelection';
import FarmingMethod from './pages/FarmingMethod';
import OrganicFertilizers from './pages/OrganicFertilizers';
import SoilWaterAnalysis from './pages/SoilWaterAnalysis';
import CropGuidance from './pages/CropGuidance';

/** Requires the user to be logged in; no subscription check. */
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

/** Requires login AND an active trial or paid subscription. */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { hasAccess } = useSubscription();
  if (!user) return <Navigate to="/login" replace />;
  if (!hasAccess) return <Navigate to="/subscription" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/language" replace />} />
      <Route path="/language" element={<LanguageSelect />} />
      <Route path="/login" element={<Login />} />
      {/* Subscription page: needs auth but NOT active subscription */}
      <Route
        path="/subscription"
        element={<AuthRoute><Subscription /></AuthRoute>}
      />
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crop-guidance" element={<CropGuidance />} />
        <Route path="/crop-health" element={<CropHealthDiagnosis />} />
        <Route path="/advisory" element={<SmartFarmingAdvisory />} />
        <Route path="/market-prices" element={<MarketPrices />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/activity-log" element={<FarmActivityLog />} />
        <Route path="/crop-type" element={<CropTypeSelection />} />
        <Route path="/farming-method" element={<FarmingMethod />} />
        <Route path="/organic-fertilizers" element={<OrganicFertilizers />} />
        <Route path="/soil-water-analysis" element={<SoilWaterAnalysis />} />
      </Route>
      <Route path="*" element={<Navigate to="/language" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
