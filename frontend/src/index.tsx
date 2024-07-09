import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Layout from './Layout';
import { AuthProvider } from './contexts/AuthContext';
import './style/index.module.css';
import Home from './pages/Home';
import Konto from './pages/Konto';
import Login from './pages/Login';
import ProtectedKonto from './components/ProtectedKonto';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route
            path="konto"
            element={<ProtectedKonto element={Konto} />}
          />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

reportWebVitals()
