import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import LeaderLogin from './components/LeaderLogin';
import LeaderDashboard from './components/LeaderDashboard';
import GalleryPage from './components/GalleryPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { AnimatePresence } from 'framer-motion';

const useAuth = (role: 'leader' | 'admin') => {
  const storageKey = `${role}IsAuthenticated`;
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    () => sessionStorage.getItem(storageKey) === 'true'
  );

  const login = (callback: () => void) => {
    sessionStorage.setItem(storageKey, 'true');
    setIsAuthenticated(true);
    callback();
  };

  const logout = (callback: () => void) => {
    sessionStorage.removeItem(storageKey);
    setIsAuthenticated(false);
    callback();
  };

  return { isAuthenticated, login, logout };
};

const AppContent: React.FC = () => {
  const leaderAuth = useAuth('leader');
  const adminAuth = useAuth('admin');
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSelect = (role: 'student' | 'leader' | 'admin') => {
    if (role === 'student') {
      navigate('/student');
    } else if (role === 'leader') {
      navigate('/leader-login');
    } else {
      navigate('/admin-login');
    }
  };

  const handleLeaderLogin = (email: string, password: string) => {
    if (email === 'leader@school.edu' && password === 'password123') {
      leaderAuth.login(() => navigate('/leader-dashboard'));
    } else {
      alert('Invalid credentials. Please use: leader@school.edu / password123');
    }
  };
  
  const handleAdminLogin = (email: string, password: string) => {
    if (email === 'admin@school.edu' && password === 'password123') {
      adminAuth.login(() => navigate('/admin-dashboard'));
    } else {
      alert('Invalid credentials. Please use: admin@school.edu / password123');
    }
  };

  const handleBackToHome = () => {
    if (leaderAuth.isAuthenticated) {
      leaderAuth.logout(() => navigate('/'));
    } else if (adminAuth.isAuthenticated) {
      adminAuth.logout(() => navigate('/'));
    }
    else {
      navigate('/');
    }
  };

  const isAuthenticated = leaderAuth.isAuthenticated || adminAuth.isAuthenticated;

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage onRoleSelect={handleRoleSelect} />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/leader-login" element={<LeaderLogin onLogin={handleLeaderLogin} />} />
          <Route path="/admin-login" element={<AdminLogin onLogin={handleAdminLogin} />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route
            path="/leader-dashboard"
            element={
              leaderAuth.isAuthenticated ? <LeaderDashboard /> : <LeaderLogin onLogin={handleLeaderLogin} />
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              adminAuth.isAuthenticated ? <AdminDashboard /> : <AdminLogin onLogin={handleAdminLogin} />
            }
          />
          <Route path="*" element={<LandingPage onRoleSelect={handleRoleSelect} />} />
        </Routes>
      </AnimatePresence>

      {location.pathname !== '/' && (
        <button
          onClick={handleBackToHome}
          className="fixed bottom-4 left-4 z-[200] px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300"
        >
          {isAuthenticated ? 'Logout & Home' : '← Back to Home'}
        </button>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
