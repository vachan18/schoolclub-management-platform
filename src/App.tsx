import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import StudentLogin from './components/StudentLogin';
import LeaderLogin from './components/LeaderLogin';
import LeaderDashboard from './components/LeaderDashboard';
import GalleryPage from './components/GalleryPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { AnimatePresence } from 'framer-motion';
import Toast from './components/Toast.tsx';
import { useSoundEffect } from './hooks/useSoundEffect.ts';
import { useUserData } from './context/UserDataContext.tsx';
import { useToast } from './context/ToastContext.tsx';
import { User } from './types/index.ts';
import VoiceAssistant from './components/VoiceAssistant.tsx';

const useAuth = (role: 'student' | 'leader' | 'admin') => {
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
  const studentAuth = useAuth('student');
  const leaderAuth = useAuth('leader');
  const adminAuth = useAuth('admin');
  const navigate = useNavigate();
  const location = useLocation();
  const playLoginSound = useSoundEffect();
  const { users, setUsers } = useUserData();
  const { showToast } = useToast();

  const handleRoleSelect = (role: 'student' | 'leader' | 'admin') => {
    playLoginSound();
    if (role === 'student') {
      navigate('/student-login');
    } else if (role === 'leader') {
      navigate('/leader-login');
    } else {
      navigate('/admin-login');
    }
  };

  const handleStudentLogin = (email: string, password: string) => {
    const user = users.find(u => u.role === 'student' && u.email === email);
    if (user && password === 'password123') { // Simplified password check
      playLoginSound();
      studentAuth.login(() => navigate('/student'));
    } else {
      alert(`Invalid credentials. Please check your email and password.`);
    }
  };

  const handleStudentSignUp = (name: string, email: string, password: string) => {
    if (users.some(u => u.email === email)) {
        showToast("An account with this email already exists.", "error");
        return;
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      role: 'student',
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      contributionPoints: 0,
      achievements: [],
      interests: [],
      certifications: [],
    };
    setUsers(prev => [...prev, newUser]);
    showToast(`Welcome, ${name}! Your account has been created.`, 'success');
    playLoginSound();
    studentAuth.login(() => navigate('/student'));
  };

  const handleLeaderLogin = (email: string, password: string) => {
    if (email === 'leader@school.edu' && password === 'password123') {
      playLoginSound();
      leaderAuth.login(() => navigate('/leader-dashboard'));
    } else {
      alert('Invalid credentials. Please use: leader@school.edu / password123');
    }
  };
  
  const handleAdminLogin = (email: string, password: string) => {
    if (email === 'admin@school.edu' && password === 'password123') {
      playLoginSound();
      adminAuth.login(() => navigate('/admin-dashboard'));
    } else {
      alert('Invalid credentials. Please use: admin@school.edu / password123');
    }
  };

  const handleBackToHome = () => {
    if (studentAuth.isAuthenticated) {
      studentAuth.logout(() => navigate('/'));
    } else if (leaderAuth.isAuthenticated) {
      leaderAuth.logout(() => navigate('/'));
    } else if (adminAuth.isAuthenticated) {
      adminAuth.logout(() => navigate('/'));
    }
    else {
      navigate('/');
    }
  };

  const isAuthenticated = studentAuth.isAuthenticated || leaderAuth.isAuthenticated || adminAuth.isAuthenticated;

  return (
    <div className="App">
      <Toast />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage onRoleSelect={handleRoleSelect} />} />
          <Route path="/student-login" element={<StudentLogin onLogin={handleStudentLogin} onSignUp={handleStudentSignUp} />} />
          <Route path="/leader-login" element={<LeaderLogin onLogin={handleLeaderLogin} />} />
          <Route path="/admin-login" element={<AdminLogin onLogin={handleAdminLogin} />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route
            path="/student"
            element={
              studentAuth.isAuthenticated ? <StudentDashboard /> : <StudentLogin onLogin={handleStudentLogin} onSignUp={handleStudentSignUp} />
            }
          />
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
      <VoiceAssistant />
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
