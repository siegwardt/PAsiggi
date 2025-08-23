import type { Product } from "../components/shop/types";
import type { ProductDtoV2 } from "../api/products";

const DOMAIN = "http://localhost:3000";
const IMAGE_BASE = "/images/products/";

function buildImageUrl(file?: string | null): string {
  return file ? `${DOMAIN}${IMAGE_BASE}${file}` : `${DOMAIN}${IMAGE_BASE}placeholder.jpg`;
}

export function toUiProduct(p: ProductDtoV2): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.priceEUR,
    description: p.description ?? undefined,
    image: buildImageUrl(p.cover?.url),
    images: (p.images ?? []).map(img => ({
      url: buildImageUrl(img.url),
      alt: img.alt ?? "",
    })),
  };
}
