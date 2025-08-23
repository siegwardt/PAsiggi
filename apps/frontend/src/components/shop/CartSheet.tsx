"use client";
import * as React from "react";
import {
  Drawer, Box, Typography, IconButton, List, ListItem, ListItemText,
  ListItemSecondaryAction, TextField, Divider, Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useCart } from "./CartContext";

export const CartSheet: React.FC = () => {
  const { items, subtotal, setQty, remove, clear, isOpen, closeCart } = useCart();

  return (
    <Drawer anchor="right" open={isOpen} onClose={closeCart} PaperProps={{ sx: { width: { xs: 1, sm: 420 } } }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>Warenkorb</Typography>
        <IconButton onClick={closeCart} aria-label="schließen"><CloseIcon /></IconButton>
      </Box>
      <Divider />
      <List sx={{ px: 1 }}>
        {items.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            Dein Warenkorb ist leer.
          </Typography>
        )}
        {items.map((it) => (
          <ListItem key={it.product.id} alignItems="flex-start">
            <ListItemText
              primary={<Typography fontWeight={700}>{it.product.name} — {(it.product.price * it.qty).toFixed(2)} €</Typography>}
              secondary={`${it.product.price.toFixed(2)} € / Stk.`}
            />
            <TextField
              type="number" size="small" inputProps={{ min: 1 }}
              value={it.qty}
              onChange={(e) => (Number.isNaN(+e.target.value) ? null : setQty(it.product.id, Math.max(1, Number(e.target.value))))}
              sx={{ width: 88, mr: 1 }}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="löschen" onClick={() => remove(it.product.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="subtitle1" fontWeight={700}>Zwischensumme: {subtotal.toFixed(2)} €</Typography>
        <Button variant="contained" size="large" disabled={items.length === 0} href="/cart">Zur Kasse</Button>
        <Button variant="text" color="inherit" disabled={items.length === 0} onClick={clear}>Warenkorb leeren</Button>
      </Box>
    </Drawer>
  );
};
