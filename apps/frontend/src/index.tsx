import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import Layout from "./Layout";
import { AuthProvider } from "./contexts/AuthContext";
import "./style/index.module.css";

// Seiten
import Home from "./pages/Home";
import Konto from "./pages/Konto";
import Login from "./pages/Login";
import ProtectedKonto from "./components/ProtectedKonto";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";

// 🛒 Warenkorb
import { CartProvider } from "./components/shop/CartContext";
import { CartSheet } from "./components/shop/CartSheet";
import { CartFab } from "./components/shop/CartFab";

// Kleine Hilfskomponente: blendet FAB auf /cart aus
function GlobalCartUI() {
  const location = useLocation();

  // auf /cart nur Sidebar rendern, kein FAB
  if (location.pathname === "/cart") {
    return <CartSheet />;
  }

  return (
    <>
      <CartSheet />
      <CartFab />
    </>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

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

        {/* ✅ global: Warenkorb-UI */}
        <GlobalCartUI />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

reportWebVitals();
