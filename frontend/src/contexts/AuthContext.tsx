import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => Cookies.get('isAuthenticated') === 'true'
  );

  useEffect(() => {
    Cookies.set('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  const login = () => {
    console.log("User logged in");
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log("User logged out");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
