import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import LeaderLogin from './components/LeaderLogin';
import LeaderDashboard from './components/LeaderDashboard';

type AppState = 'landing' | 'student' | 'leader-login' | 'leader-dashboard';

function App() {
  const [currentView, setCurrentView] = useState<AppState>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleRoleSelect = (role: 'student' | 'leader') => {
    if (role === 'student') {
      setCurrentView('student');
    } else {
      setCurrentView('leader-login');
    }
  };

  const handleLeaderLogin = (email: string, password: string) => {
    // Simple authentication check (demo purposes)
    if (email === 'leader@school.edu' && password === 'password123') {
      setIsAuthenticated(true);
      setCurrentView('leader-dashboard');
    } else {
      alert('Invalid credentials. Please use: leader@school.edu / password123');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('landing');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        {currentView === 'landing' && (
          <LandingPage onRoleSelect={handleRoleSelect} />
        )}
        
        {currentView === 'student' && (
          <StudentDashboard />
        )}
        
        {currentView === 'leader-login' && (
          <LeaderLogin onLogin={handleLeaderLogin} />
        )}
        
        {currentView === 'leader-dashboard' && isAuthenticated && (
          <LeaderDashboard />
        )}

        {/* Back to Home Button (for demo purposes) */}
        {currentView !== 'landing' && (
          <button
            onClick={handleBackToHome}
            className="fixed bottom-4 left-4 z-50 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300"
          >
            ← Back to Home
          </button>
        )}
      </div>
    </Router>
  );
}

export default App;
