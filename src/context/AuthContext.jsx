import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './useAuth.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  // Update token state when it changes
  const login = (newToken, userId, role) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('id', userId);
    localStorage.setItem('role', role);
    setUser({ id: userId, role });
  };

  // Clear user data on logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
  };

  // Fetch user profile when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }

    if (!token) {
      setUser(null);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || 'https://be-theliemsshoes.onrender.com'}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

