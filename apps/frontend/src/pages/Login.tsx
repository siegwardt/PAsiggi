import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

 const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    login();
    navigate('/konto');
  };

  const theme = useTheme();
    const primaryColor = theme.palette.primary.main;
    const backgroundColor = theme.palette.background.paper;

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: theme.palette.background.default }}>
        <form
          onSubmit={handleSubmit}
          style={{
            minWidth: 350,
            padding: 32,
            borderRadius: 24,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            background: backgroundColor,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <h1 style={{ textAlign: 'center', fontWeight: 600, fontSize: 28, marginBottom: 8 }}>
            {isRegistering ? 'Registrieren' : 'Login'}
          </h1>
          <div>
            <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                border: `1px solid ${theme.palette.divider}`,
                fontSize: 16,
                outline: 'none',
                background: theme.palette.background.default,
              }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                border: `1px solid ${theme.palette.divider}`,
                fontSize: 16,
                outline: 'none',
                background: theme.palette.background.default,
              }}
            />
          </div>
            <button
            type="submit"
            style={{
              background: primaryColor,
              color: theme.palette.primary.contrastText,
              border: 'none',
              borderRadius: 12,
              padding: '12px 0',
              fontWeight: 600,
              fontSize: 18,
              cursor: 'pointer',
              marginTop: 8,
              transition: 'background 0.2s',
            }}
            onClick={() => {
              login();
              navigate('/');
            }}
            >
            {isRegistering ? 'Registrieren' : 'Login'}
            </button>
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            style={{
              background: 'none',
              color: primaryColor,
              border: 'none',
              padding: 0,
              fontSize: 16,
              cursor: 'pointer',
              textDecoration: 'underline',
              marginTop: 8,
            }}
          >
            {isRegistering ? 'Schon ein Konto? Login' : 'Kein Konto? Registrieren'}
          </button>
        </form>
      </div>
    )
};

export default Login;
