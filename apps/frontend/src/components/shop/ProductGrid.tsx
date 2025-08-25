// src/components/shop/ProductGrid.tsx
"use client";
import * as React from "react";
import { Box } from "@mui/material";
import type { Product } from "./types";
import { ProductCard } from "./ProductCard";

export const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => (
  <Box
    sx={{
      // responsive CSS Grid mit auto-fill
      display: "grid",
      gap: 3,
      gridTemplateColumns: {
        xs: "repeat(auto-fill, minmax(220px, 1fr))",
        sm: "repeat(auto-fill, minmax(240px, 1fr))",
        md: "repeat(auto-fill, minmax(260px, 1fr))",
      },
      alignItems: "stretch",
    }}
  >
    {products.map((p) => (
      <Box key={p.id} sx={{ height: "100%", minWidth: 0 }}>
        <ProductCard product={p} />
      </Box>
    ))}
  </Box>
);
