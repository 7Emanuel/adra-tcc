import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/userApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load current user on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const u = await getCurrentUser();
        if (active) setUser(u);
      } catch {
        // not logged
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const login = useCallback(async (email, senha) => {
    setError(null);
    const { token, user: u } = await loginUser({ email, senha });
    localStorage.setItem('auth_token', token);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (data) => {
    setError(null);
    const user = await registerUser(data);
    // After register require login
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
  }, []);

  const value = { user, loading, error, login, register, logout, isAuthenticated: !!user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
