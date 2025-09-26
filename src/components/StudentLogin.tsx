import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, User as UserIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentLoginProps {
  onLogin: (email: string, password: string) => void;
  onSignUp: (name: string, email: string, password: string) => void;
}

const formVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeInOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeInOut" } },
};

const StudentLogin: React.FC<StudentLoginProps> = ({ onLogin, onSignUp }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(prev => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
          alt="Students collaborating on a sunlit campus" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <AnimatePresence mode="wait">
          {isSignUp ? (
            <SignUpForm key="signup" onSignUp={onSignUp} toggleForm={toggleForm} />
          ) : (
            <LoginForm key="login" onLogin={onLogin} toggleForm={toggleForm} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const LoginForm: React.FC<{ onLogin: (email: string, password: string) => void; toggleForm: () => void; }> = ({ onLogin, toggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin(email, password);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <motion.div variants={formVariants} initial="initial" animate="animate" exit="exit">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white">Student Portal</h2>
        <p className="mt-2 text-sm text-gray-300">Welcome back! Please sign in.</p>
      </div>
      <form className="space-y-6 bg-gray-900/50 backdrop-blur-md p-8 rounded-xl shadow-2xl" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-300">Student Email</label>
          <div className="mt-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500" placeholder="student@123"/>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <div className="mt-1 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500" placeholder="password123"/>
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>
        <div>
          <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            {isLoading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign in'}
          </button>
        </div>
        <div className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <button type="button" onClick={toggleForm} className="font-medium text-blue-400 hover:text-blue-300">
            Sign up
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const SignUpForm: React.FC<{ onSignUp: (name: string, email: string, password: string) => void; toggleForm: () => void; }> = ({ onSignUp, toggleForm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      onSignUp(name, email, password);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <motion.div variants={formVariants} initial="initial" animate="animate" exit="exit">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
        <p className="mt-2 text-sm text-gray-300">Join the ClubHubs community.</p>
      </div>
      <form className="space-y-4 bg-gray-900/50 backdrop-blur-md p-8 rounded-xl shadow-2xl" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-300">Full Name</label>
          <div className="mt-1 relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Your Name"/>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Student Email</label>
          <div className="mt-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500" placeholder="student@school.edu"/>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <div className="mt-1 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Create a password"/>
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
          <div className="mt-1 relative">
            <Check className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Confirm your password"/>
          </div>
        </div>
        <div>
          <button type="submit" disabled={isLoading} className="group mt-4 relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
            {isLoading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
          </button>
        </div>
        <div className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <button type="button" onClick={toggleForm} className="font-medium text-blue-400 hover:text-blue-300">
            Sign in
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default StudentLogin;
