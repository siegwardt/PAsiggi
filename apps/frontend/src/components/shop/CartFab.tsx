"use client";
import * as React from "react";
import { Badge, Fab } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "./CartContext";

export const CartFab: React.FC = () => {
  const { items, openCart } = useCart();
  const count = items.reduce((s, it) => s + it.qty, 0);

  return (
    <Fab color="primary" onClick={openCart} sx={{ position: "fixed", bottom: 24, right: 24 }} aria-label="Warenkorb öffnen">
      <Badge badgeContent={count} color="secondary">
        <ShoppingCartIcon />
      </Badge>
    </Fab>
  );
};
