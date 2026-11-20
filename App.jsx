import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Explore from '@/pages/Explore';
import IndiaExplorer from '@/pages/IndiaExplorer';
import StatePage from '@/pages/StatePage';
import WorldExplorer from '@/pages/WorldExplorer';
import CountryPage from '@/pages/CountryPage';
import DestinationDetail from '@/pages/DestinationDetail';
import PlanTrip from '@/pages/PlanTrip';
import TripDetail from '@/pages/TripDetail';
import MyTrips from '@/pages/MyTrips';
import MapPage from '@/pages/MapPage';
import Currency from '@/pages/Currency';
import Translate from '@/pages/Translate';
import Assistant from '@/pages/Assistant';
import About from '@/pages/About';
import Food from '@/pages/Food';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/india" element={<IndiaExplorer />} />
        <Route path="/india/:state" element={<StatePage />} />
        <Route path="/world" element={<WorldExplorer />} />
        <Route path="/world/:country" element={<CountryPage />} />
        <Route path="/destination/:slug" element={<DestinationDetail />} />
        <Route path="/plan-trip" element={<PlanTrip />} />
        <Route path="/trip/:id" element={<TripDetail />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/currency" element={<Currency />} />
        <Route path="/translate" element={<Translate />} />
        <Route path="/ai-assistant" element={<Assistant />} />
        <Route path="/about" element={<About />} />
        <Route path="/food" element={<Food />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App