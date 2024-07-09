import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import classes from './style/layout.module.css';

const Layout = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <nav className={classes.nav}>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link to="/konto">Konto</Link>
              </li>
            )}
            {!isAuthenticated && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <Outlet />
    </div>
  );
};

export default Layout;
