import React, { createContext, useReducer, ReactNode, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

type AuthAction = { type: 'LOGIN' } | { type: 'LOGOUT' };

const authReducer = (state: boolean, action: AuthAction): boolean => {
  switch (action.type) {
    case 'LOGIN':
      return true;
    case 'LOGOUT':
      return false;
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, dispatch] = useReducer(
    authReducer,
    Cookies.get('isAuthenticated') === 'true'
  );

  useEffect(() => {
    Cookies.set('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  const login = () => {
    console.log("User logged in");
    dispatch({ type: 'LOGIN' });
  };

  const logout = () => {
    console.log("User logged out");
    dispatch({ type: 'LOGOUT' });
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
