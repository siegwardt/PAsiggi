// src/components/NavLink.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavLink: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Link to={isAuthenticated ? '/konto' : '/login'}>
      {isAuthenticated ? 'Konto' : 'Login'}
    </Link>
  );
};

export default NavLink;
