import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Konto = () => {
  const { logout } = useAuth()

  return (
    <div>
      <h1>Konto Page</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Konto
