import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import type { User } from './types';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (user && (user.role === 'admin' || user.role === 'staff')) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <HomePage currentUser={user} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />;
}

export default App;
