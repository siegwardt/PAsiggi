// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Layout from "./Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./components/shop/CartContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Konto from "./pages/Konto";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import { ProtectedKonto, ProtectetShop } from "./components/ProtectedRout";
import { CartFab } from "./components/shop/CartFab";
import { CartSidebar } from "./components/shop/CartSidebar";

import "./style/index.module.css";

function GlobalCartUI() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/cart")) return null;
  return (
    <>
      <CartSidebar />
      <CartFab />
    </>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 60_000,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="shop" element={<ProtectetShop element={Shop} />} />
                <Route path="cart" element={<Cart />} />
                <Route path="konto" element={<ProtectedKonto element={Konto} />} />
              </Route>
            </Routes>

            <GlobalCartUI />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
