import { Container, Typography, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ProductGrid } from "../components/shop/ProductGrid";
import { demoProducts } from "../components/shop/demoProducts";

export default function Shop() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Produkte
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Wähle deine Produkte aus und lege sie in den Warenkorb.
      </Typography>
      
      <Box sx={{ pr: mdUp ? 0 : 0 }}>
        <ProductGrid products={demoProducts} />
      </Box>
    </Container>
  );
}
