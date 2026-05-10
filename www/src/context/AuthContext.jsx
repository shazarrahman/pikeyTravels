import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Support both regular users and provider accounts persisted in localStorage
    const token = localStorage.getItem('pikey_token');
    const userData = localStorage.getItem('pikey_user');
    const provToken = localStorage.getItem('pikey_provider_token');
    const provData = localStorage.getItem('pikey_provider');

    if (token && userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log('AuthContext init from localStorage (user):', parsed);
        setUser(parsed);
      } catch {
        localStorage.removeItem('pikey_token');
        localStorage.removeItem('pikey_user');
      }
    } else if (provToken && provData) {
      try {
        const parsed = JSON.parse(provData);
        console.log('AuthContext init from localStorage (provider):', parsed);
        // normalize provider object to include role so ProtectedRoute works
        setUser({ ...parsed, role: 'provider' });
      } catch {
        localStorage.removeItem('pikey_provider_token');
        localStorage.removeItem('pikey_provider');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/users/login', { email, password });
    if (res.data.success) {
      const { token, user: userData } = res.data.data;
      console.log('Login successful. User data:', userData);
      localStorage.setItem('pikey_token', token);
      localStorage.setItem('pikey_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
    throw new Error(res.data.message);
  };

  const logout = () => {
    console.log('Logout called — clearing auth state');
    // Clear both user and provider auth keys to be safe
    localStorage.removeItem('pikey_token');
    localStorage.removeItem('pikey_user');
    localStorage.removeItem('pikey_provider_token');
    localStorage.removeItem('pikey_provider');
    setUser(null);
    console.log('Logout complete — user set to null');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin' 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
