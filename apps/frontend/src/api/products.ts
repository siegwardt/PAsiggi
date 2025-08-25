
const API_BASE = process.env.BACKEND_API_URL || "http://localhost:5001/api/v1";

export type ProductImageDto = { url: string; alt: string | null };
export type ProductDtoV2 = {
  id: string;
  slug: string | null;
  name: string;
  description: string | null;
  priceEUR: number;
  priceCents: number;
  category: string;
  stock: number;
  active: boolean;
  images: ProductImageDto[];
  createdAt: string;
  updatedAt: string;
};

export async function fetchProducts(): Promise<ProductDtoV2[]> {
  const res = await fetch(`${API_BASE}/products?limit=100&offset=0`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json?.items) ? json.items : [];
}
