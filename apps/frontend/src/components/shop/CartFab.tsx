"use client";
import * as React from "react";
import { Fab, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "./CartContext";

export const CartFab: React.FC = () => {
  const { count, isEmpty, openCart } = useCart();

  if (isEmpty) return null;

  return (
    <Fab
      color="primary"
      onClick={openCart}
      sx={{ position: "fixed", right: 24, bottom: 24, zIndex: (t) => t.zIndex.drawer + 1 }}
      aria-label="Warenkorb öffnen"
    >
      <Badge badgeContent={count} color="secondary">
        <ShoppingCartIcon />
      </Badge>
    </Fab>
  );
};
