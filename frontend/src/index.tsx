import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Login from './pages/Login';
import Layout from './Layout'
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
<BrowserRouter>
  <Routes>
    <AuthProvider>
      <Route path="/" element={<Layout />}>
      </Route>
    </AuthProvider>
  </Routes>
</BrowserRouter>
);

reportWebVitals();
