import { useMemo } from "react";
import { Container, Typography, Box, Alert, Button, Skeleton, Stack, Toolbar } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ProductGrid } from "../components/shop/ProductGrid";
import { useAllProducts } from "../hooks/useAllProducts";
import { toUiProduct } from "../lib/mapProduct";

export default function Shop() {
  const { data, isLoading, isFetching, isError, error, refetch } = useAllProducts();
  const products = useMemo(() => (data ? data.map(toUiProduct) : []), [data]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Produkte</Typography>

      <Toolbar disableGutters sx={{ justifyContent: "space-between", px: 0, mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {isLoading ? "Lade Bestand…" : `${products.length} Artikel`}
        </Typography>
        <Button onClick={() => refetch()} startIcon={<RefreshIcon />} variant="outlined" size="small" disabled={isFetching}>
          {isFetching ? "Aktualisiere…" : "Aktualisieren"}
        </Button>
      </Toolbar>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Produkte konnten nicht geladen werden{error ? `: ${error.message}` : ""}.
        </Alert>
      )}

      {isLoading && (
        <Box sx={{
          mt: 1, display: "grid", gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)", lg: "repeat(4,1fr)" }
        }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Stack spacing={1.5} key={i}>
              <Skeleton variant="rounded" height={160} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="40%" />
            </Stack>
          ))}
        </Box>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <Box sx={{ py: 8, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Keine Produkte gefunden</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Füge Produkte hinzu oder lade die Seite neu.
          </Typography>
          <Button variant="contained" onClick={() => refetch()}>Jetzt aktualisieren</Button>
        </Box>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <ProductGrid products={products} />
        </Box>
      )}
    </Container>
  );
}
