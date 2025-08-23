import type { Product } from "../components/shop/types";
import type { ProductDtoV2 } from "../api/products";
import { toImgSrc } from "./images";

export function toUiProduct(p: ProductDtoV2): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.priceEUR,
    description: p.description ?? undefined,
    image: p.cover ? toImgSrc(p.cover.filename) : undefined,
  };
}