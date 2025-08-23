import * as React from "react";
import { Box, Stack, ImageListItem, ImageList, Dialog } from "@mui/material";

type Props = {
  images: string[]; // absolute Pfade z. B. "/images/products/xlr1.jpg"
  ratio?: string;   // "1 / 1" | "4 / 3" | "16 / 9"
};

export const ProductImages: React.FC<Props> = ({ images, ratio = "4 / 3" }) => {
  const [i, setI] = React.useState(0);
  const [zoom, setZoom] = React.useState(false);
  const src = images[i];

  return (
    <Stack spacing={2}>
      {/* Hauptbild – wie Thomann: contain, weißer Hintergrund, zentriert */}
      <Box
        onClick={() => setZoom(true)}
        sx={{
          position: "relative",
          aspectRatio: ratio,
          bgcolor: "#fff",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          cursor: "zoom-in",
          p: { xs: 2, sm: 3 }, // etwas „Luft“ wie bei Thomann
        }}
      >
        <img
          src={src}
          alt=""
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain", // ✅ wie Thomann
            display: "block",
          }}
        />
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <ImageList cols={Math.min(images.length, 6)} gap={8} rowHeight={80}>
          {images.map((img, idx) => (
            <ImageListItem
              key={img}
              onClick={() => setI(idx)}
              sx={{
                borderRadius: 1,
                overflow: "hidden",
                border: idx === i ? "2px solid" : "1px solid",
                borderColor: idx === i ? "primary.main" : "divider",
                cursor: "pointer",
                bgcolor: "#fff",
              }}
            >
              <img
                src={img}
                alt=""
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {/* Zoom (Lightbox) */}
      <Dialog open={zoom} onClose={() => setZoom(false)} maxWidth="lg">
        <Box sx={{ p: 2, bgcolor: "#fff" }}>
          <img
            src={src}
            alt=""
            style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain", display: "block" }}
          />
        </Box>
      </Dialog>
    </Stack>
  );
};
