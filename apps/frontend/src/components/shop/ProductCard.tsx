"use client";
import * as React from "react";
import { Card, CardContent, CardActions, Typography, Button, Box } from "@mui/material";
import type { Product } from "./types";
import { useCart } from "./CartContext";

image: "/images/products/theBoxPro115.png"

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { add } = useCart();

  return (
    <Card className="rounded-2xl shadow-md" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", borderRadius: 2 }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            loading="lazy"
          />
        ) : (
          <Box sx={{ height: 180, bgcolor: "grey.100" }} />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        {/* ... wie gehabt ... */}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button fullWidth variant="contained" onClick={() => add(product)}>
          In den Warenkorb
        </Button>
      </CardActions>
    </Card>
  );
};

