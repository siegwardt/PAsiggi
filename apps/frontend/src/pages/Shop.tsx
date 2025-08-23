import { Container, Typography } from "@mui/material";
import { CartProvider } from "../components/shop/CartContext";
import { CartFab } from "../components/shop/CartFab";
import { CartSheet } from "../components/shop/CartSheet";
import { ProductGrid } from "../components/shop/ProductGrid";
import { demoProducts } from "../components/shop/demoProducts";

export default function Shop() {
  return (
    <CartProvider>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Produkte</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Wähle deine Produkte aus und lege sie in den Warenkorb.
        </Typography>
        <ProductGrid products={demoProducts} />
      </Container>

      <CartSheet />
      <CartFab />
    </CartProvider>
  );
}
