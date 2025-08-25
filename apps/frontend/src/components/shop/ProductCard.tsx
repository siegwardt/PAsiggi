// src/components/shop/ProductCard.tsx
"use client";
import * as React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Product } from "./types";
import { useCart } from "./CartContext";

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { add } = useCart();

  const [open, setOpen] = React.useState(false);
  const [idx, setIdx] = React.useState(0);

  // Slides: bevorzugt product.images; sonst das Cover-Bild
  const slides = React.useMemo<{ url: string; alt?: string }[]>(() => {
    if (product.images && product.images.length) {
      return product.images.map((i) => ({ url: i.url, alt: i.alt }));
    }
    return product.image ? [{ url: product.image, alt: product.name }] : [];
  }, [product]);

  const hasMany = slides.length > 1;
  const cur = slides[idx];

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  const next = () => setIdx((i) => (i + 1) % slides.length);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);

  // Reset auf erstes Bild, wenn Dialog zu
  React.useEffect(() => { if (!open) setIdx(0); }, [open]);

  // Tastatursteuerung im Dialog
  React.useEffect(() => {
    if (!open || !hasMany) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hasMany]);

  return (
    <>
      {/* Produktkarte */}
      <Card
        onClick={openDialog}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform .18s ease, box-shadow .18s ease, background-color .18s ease",
          "&:hover": {
            backgroundColor: "grey.100", // ganze Karte grau
            transform: "translateY(-3px)",
            boxShadow: 6,
          },
        }}
      >
        {/* Bild */}
        <Box
          sx={{
            width: "100%",
            aspectRatio: "4 / 3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            bgcolor: "#fff",
            borderBottom: "1px solid",
            borderColor: "divider",
            p: { xs: 1.5, sm: 2.5 },
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </Box>

        {/* Name + Preis */}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 48,
            }}
          >
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.price.toFixed(2)} €
          </Typography>
        </CardContent>

        {/* Warenkorb-Button */}
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={(e) => {
              e.stopPropagation(); // öffnet nicht den Dialog
              add(product, 1);
            }}
          >
            In den Warenkorb
          </Button>
        </CardActions>
      </Card>

      {/* Dialog mit Carousel */}
      <Dialog open={open} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pr: 6 }}>{product.name}</DialogTitle>

        <IconButton
          onClick={closeDialog}
          sx={{ position: "absolute", right: 8, top: 8 }}
          aria-label="Schließen"
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            {/* Carousel */}
            <Box
              sx={{
                position: "relative",
                flex: "0 0 460px",
                width: { xs: "100%", md: 460 },
                aspectRatio: "4 / 3",
                overflow: "hidden",
                borderRadius: 2,
                bgcolor: "grey.100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {cur && (
                <Box
                  component="img"
                  src={cur.url}
                  alt={cur.alt || product.name}
                  loading="lazy"
                  sx={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                />
              )}

              {hasMany && (
                <>
                  <IconButton
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: 8,
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(255,255,255,.9)",
                      "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                    }}
                    aria-label="Vorheriges Bild"
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                  <IconButton
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: 8,
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(255,255,255,.9)",
                      "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                    }}
                    aria-label="Nächstes Bild"
                  >
                    <ChevronRightIcon />
                  </IconButton>

                  {/* Dots */}
                  <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 6, display: "flex", justifyContent: "center", gap: 1 }}>
                    {slides.map((_, i) => (
                      <Box
                        key={i}
                        onClick={() => setIdx(i)}
                        sx={{
                          width: i === idx ? 18 : 8,
                          height: 8,
                          borderRadius: 999,
                          bgcolor: i === idx ? "text.primary" : "text.disabled",
                          opacity: i === idx ? 0.9 : 0.6,
                          transition: "all .15s",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>

            {/* Beschreibung + Preis */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {product.price.toFixed(2)} €
              </Typography>
              {product.description && (
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {product.description}
                </Typography>
              )}

              {/* Thumbnails (optional) */}
              {hasMany && (
                <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                  {slides.map((s, i) => (
                    <Box
                      key={i}
                      onClick={() => setIdx(i)}
                      sx={{
                        width: 64,
                        height: 48,
                        borderRadius: 1,
                        overflow: "hidden",
                        cursor: "pointer",
                        outline: i === idx ? "2px solid" : "1px solid",
                        outlineColor: i === idx ? "primary.main" : "divider",
                        bgcolor: "white",
                      }}
                    >
                      <Box
                        component="img"
                        src={s.url}
                        alt={s.alt || product.name}
                        sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={closeDialog}>Schließen</Button>
          <Button
            variant="contained"
            onClick={() => { add(product, 1); closeDialog(); }}
          >
            In den Warenkorb
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
