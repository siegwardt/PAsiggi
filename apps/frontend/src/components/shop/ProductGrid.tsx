"use client";
import * as React from "react";
import { Box } from "@mui/material";
import type { Product } from "./types";
import { ProductCard } from "./ProductCard";

export const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => (
  <Box
    sx={{
      display: "grid",
      gap: 3,
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      },
      alignItems: "stretch",
    }}
  >
    {products.map((p) => (
      <Box key={p.id} sx={{ height: "100%" }}>
        <ProductCard product={p} />
      </Box>
    ))}
  </Box>
);
