import * as React from "react";
import {
  Container, Typography, List, ListItem, ListItemText, TextField,
  IconButton, Divider, Box, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useCart } from "../components/shop/CartContext";

export default function CartPage() {
  const { items, subtotal, setQty, remove, clear } = useCart();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Warenkorb</Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {items.length === 0 && (
          <Typography variant="body2" color="text.secondary">Dein Warenkorb ist leer.</Typography>
        )}
        {items.map((it) => (
          <ListItem key={it.product.id} secondaryAction={
            <IconButton edge="end" onClick={() => remove(it.product.id)} aria-label="löschen"><DeleteIcon /></IconButton>
          }>
            <ListItemText
              primary={`${it.product.name}`}
              secondary={`${it.product.price.toFixed(2)} € / Stk.`}
            />
            <TextField
              type="number" size="small" inputProps={{ min: 1 }}
              value={it.qty}
              onChange={(e) => (Number.isNaN(+e.target.value) ? null : setQty(it.product.id, Math.max(1, Number(e.target.value))))}
              sx={{ width: 100 }}
            />
            <Typography sx={{ ml: 2, minWidth: 100, textAlign: "right" }}>
              {(it.product.price * it.qty).toFixed(2)} €
            </Typography>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button color="inherit" onClick={clear} disabled={items.length === 0}>Warenkorb leeren</Button>
        <Typography variant="h6">Zwischensumme: {subtotal.toFixed(2)} €</Typography>
      </Box>
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Button variant="contained" size="large" disabled={items.length === 0}>
          Zur Kasse (coming soon)
        </Button>
      </Box>
    </Container>
  );
}
