import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Korrigierter Importpfad
import { useNavigate } from 'react-router-dom';

const Konto = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Navigieren Sie nicht nach dem Logout, bleiben Sie auf der Konto-Seite
  };

  return (
    <div>
      <h1>Konto Page</h1>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={() => navigate('/login')}>Login</button>
      )}
    </div>
  );
};

export default Konto;
