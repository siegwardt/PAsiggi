import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./style/index.module.css";

// Layout & Auth
import Layout from "./Layout";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedKonto from "./components/ProtectedKonto";

// Seiten
import Home from "./pages/Home";
import Login from "./pages/Login";
import Konto from "./pages/Konto";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";

// 🛒 Warenkorb
import { CartProvider } from "./components/shop/CartContext";
import { CartFab } from "./components/shop/CartFab";
import { CartSidebar } from "./components/shop/CartSidebar"; 

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function GlobalCartUI() {
  const { pathname } = useLocation();
  if (pathname === "/cart") return null;
  return (
    <>
      <CartSidebar />
      <CartFab />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="shop" element={<Shop />} />
            <Route path="cart" element={<Cart />} />
            <Route path="konto" element={<ProtectedKonto element={Konto} />} />
          </Route>
        </Routes>
        <GlobalCartUI />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

reportWebVitals();