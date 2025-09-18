import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-6 text-center">Carregando...</div>;
  if (!isAuthenticated) return <Navigate to="/login-cadastro" state={{ from: location }} replace />;
  return children;
}
