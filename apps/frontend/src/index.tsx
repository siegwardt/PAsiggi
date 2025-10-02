import ReactDOM from "react-dom/client";
import { Routes, Route } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";

import Layout from "./Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Konto from "./pages/Konto";
import Shop from "./pages/Shop";
import { ProtectedKonto, ProtectetShop } from "./components/ProtectedRout";

import "./style/index.module.css";

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
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="shop" element={<ProtectetShop element={Shop} />} />
      <Route path="konto" element={<ProtectedKonto element={Konto} />} />
    </Route>
  </Routes>
);
