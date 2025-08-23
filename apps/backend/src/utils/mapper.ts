// DB → Frontend DTO
export const mapProduct = (p: any) => ({
  id: String(p.id),
  slug: p.slug ?? String(p.id),
  name: p.name,
  description: p.description ?? null,
  price: (p.priceCents ?? Math.round((p.pricePerDay ?? 0) * 100)) / 100, // EUR
  image: p.images?.[0]?.url ?? p.imageUrl ?? null,
  images: (p.images ?? []).map((i: any) => i.url),
  stock: p.stock,
  category: p.category,
  active: p.active,
});
