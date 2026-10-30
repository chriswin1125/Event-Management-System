import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
          localStorage.setItem('user', JSON.stringify(res.data.data));
          fetchNotifications();
        } catch (err) {
          console.error('Session restore failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data || []);
      setUnreadNotificationsCount(res.data.unreadCount || 0);
    } catch (err) {
      // Graceful fallback
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await api.patch('/notifications/mark-read');
      setUnreadNotificationsCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const userData = res.data.data;
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    fetchNotifications();
    return userData;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    const userData = res.data.data;
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setNotifications([]);
    setUnreadNotificationsCount(0);
  };

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    const updatedUser = res.data.data;
    setUser((prev) => ({ ...prev, ...updatedUser }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));
    return updatedUser;
  };

  // Demo accounts 1-click login helper
  const demoLogin = async (role) => {
    const credentials = {
      admin: { email: 'admin@eventhub.com', password: 'password123' },
      organizer: { email: 'organizer@eventhub.com', password: 'password123' },
      user: { email: 'user@eventhub.com', password: 'password123' },
    };

    const target = credentials[role] || credentials.user;
    return await login(target.email, target.password);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    demoLogin,
    notifications,
    unreadNotificationsCount,
    fetchNotifications,
    markNotificationsAsRead,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isOrganizer: user?.role === 'organizer' || user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
