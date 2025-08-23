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
  cover: { filename: string; alt: string | null; sort: number } | null;
  images: Array<{ filename: string; alt: string | null; sort: number }>;
  createdAt: string;
  updatedAt: string;
};

export async function fetchProducts(): Promise<ProductDtoV2[]> {
  const res = await fetch("http://localhost:5001/api/v1/products");
  if (!res.ok) throw new Error("Produkte konnten nicht geladen werden");
  const data = await res.json();
  return data.items;
}
