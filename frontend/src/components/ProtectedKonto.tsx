import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './../contexts/AuthContext';

interface ProtectedRouteProps {
  element: React.ComponentType;
}

const ProtectedKonto: React.FC<ProtectedRouteProps> = ({ element: Component }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedKonto;
