// src/pages/Shop.tsx
import { useMemo } from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import { ProductGrid } from "../components/shop/ProductGrid";
import { useAllProducts } from "../hooks/useAllProducts";
import { toUiProduct } from "../lib/mapProduct";

export default function Shop() {
  const { data, isLoading, isError, error } = useAllProducts();

  // WICHTIG: DTO -> UI mappen
  const products = useMemo(() => (data ? data.map(toUiProduct) : []), [data]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Produkte
      </Typography>

      {isLoading && <Typography sx={{ mt: 2 }}>Lade Produkte…</Typography>}

      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Fehler beim Laden{error ? `: ${error.message}` : ""}.
        </Alert>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <Typography sx={{ mt: 2 }}>Keine Produkte gefunden.</Typography>
      )}

      {products.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <ProductGrid products={products} />
        </Box>
      )}
    </Container>
  );
}
