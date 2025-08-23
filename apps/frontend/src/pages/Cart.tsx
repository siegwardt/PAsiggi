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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Warenkorb</Typography>
      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
        }}
      >
        <Box>
          {items.length === 0 ? (
            <Typography variant="body2" color="text.secondary">Dein Warenkorb ist leer.</Typography>
          ) : (
            <List>
              {items.map((it) => (
                <ListItem
                  key={it.product.id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => remove(it.product.id)} aria-label="löschen">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={it.product.name}
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
          )}
        </Box>

        {/* Rechte Spalte: Summary */}
        <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2, height: "fit-content" }}>
          <Typography variant="h6" gutterBottom>Zusammenfassung</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Zwischensumme</Typography>
            <Typography>{subtotal.toFixed(2)} €</Typography>
          </Box>
          {/* hier könnten noch Versand/Steuern rein */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={items.length === 0}
            sx={{ mt: 2 }}
          >
            Zur Kasse (coming soon)
          </Button>
          <Button
            color="inherit"
            fullWidth
            disabled={items.length === 0}
            onClick={clear}
            sx={{ mt: 1 }}
          >
            Warenkorb leeren
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
