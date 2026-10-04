import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../hooks/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('visai_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.me();
      setUser(res.data.user);
      setTeam(res.data.team || null);
    } catch {
      localStorage.removeItem('visai_token');
      localStorage.removeItem('visai_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();

    // Handle global logout events (from 401 interceptor)
    const handleLogout = () => logout();
    window.addEventListener('visai:logout', handleLogout);
    return () => window.removeEventListener('visai:logout', handleLogout);
  }, [loadUser]);

  const login = (token, userData) => {
    localStorage.setItem('visai_token', token);
    localStorage.setItem('visai_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('visai_token');
    localStorage.removeItem('visai_user');
    setUser(null);
    setTeam(null);
  };

  const refreshTeam = async () => {
    try {
      const res = await authAPI.me();
      setTeam(res.data.team || null);
    } catch {
      // silent
    }
  };

  return (
    <AuthContext.Provider value={{ user, team, loading, login, logout, refreshTeam, setTeam }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
