import { Request, Response } from "express";
import prisma from "../prisma";

// Hilfsmapper: DB → Frontend-DTO
const mapProduct = (p: any) => ({
  id: String(p.id),
  slug: p.slug ?? String(p.id),
  name: p.name,
  description: p.description ?? null,
  price: (p.priceCents ?? Math.round((p.pricePerDay ?? 0) * 100)) / 100, // EUR
  image: p.images?.[0]?.url ?? p.imageUrl ?? null, // Cover
  images: (p.images ?? []).map((i: any) => i.url),
  stock: p.stock,
  category: p.category,
  active: p.active,
});

/**
 * POST /api/v1/products
 * Body:
 *  - name: string (required)
 *  - category: ProductCategory (required)
 *  - priceCents?: number  ODER  price?: number (EUR)
 *  - description?: string
 *  - stock: number (required)
 *  - imageUrl?: string (fallback)
 *  - images?: { url: string; alt?: string; sort?: number }[]
 *  - slug?: string
 *  - active?: boolean
 */
export const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    category,
    priceCents,
    price,
    stock,
    imageUrl,
    images,
    slug,
    active,
  } = req.body as {
    name: string;
    description?: string;
    category: string;
    priceCents?: number;
    price?: number;
    stock: number;
    imageUrl?: string;
    images?: { url: string; alt?: string; sort?: number }[];
    slug?: string;
    active?: boolean;
  };

  if (!name || !category || typeof stock !== "number") {
    return res.status(400).json({
      error: "name, category, stock sind Pflichtfelder.",
    });
  }

  const cents =
    typeof priceCents === "number"
      ? Math.max(0, Math.round(priceCents))
      : typeof price === "number"
      ? Math.max(0, Math.round(price * 100))
      : undefined;

  if (typeof cents !== "number") {
    return res
      .status(400)
      .json({ error: "priceCents (Int) oder price (EUR) wird benötigt." });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        category: category as any, // Prisma-Enum ProductCategory
        pricePerDay: cents / 100, // Altkompatibel (kann später entfernt werden)
        priceCents: cents,
        stock,
        imageUrl: imageUrl ?? null,
        slug: slug ?? null,
        active: typeof active === "boolean" ? active : true,
        images:
          images && Array.isArray(images) && images.length
            ? {
                create: images.map((i, idx) => ({
                  url: i.url,
                  alt: i.alt ?? null,
                  sort:
                    typeof i.sort === "number"
                      ? i.sort
                      : typeof images[idx]?.sort === "number"
                      ? images[idx]!.sort!
                      : idx,
                })),
              }
            : undefined,
      },
      include: { images: { orderBy: { sort: "asc" } } },
    });

    return res.status(201).json(mapProduct(product));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/v1/products?limit=12&offset=0
 * Liefert { items, total, limit, offset }
 */
export const getAllProducts = async (req: Request, res: Response) => {
  const limit = Math.min(
    Math.max(parseInt(String(req.query.limit ?? "12"), 10), 1),
    100
  );
  const offset = Math.max(parseInt(String(req.query.offset ?? "0"), 10), 0);

  try {
    const [rows, total] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        include: { images: { orderBy: { sort: "asc" } } },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.product.count({ where: { active: true } }),
    ]);

    return res.json({
      items: rows.map(mapProduct),
      total,
      limit,
      offset,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/v1/products/:idOrSlug
 * Akzeptiert numerische ID oder slug
 */
export const getProductById = async (req: Request, res: Response) => {
  const idOrSlug = req.params.id;

  const where =
    /^\d+$/.test(idOrSlug)
      ? { id: parseInt(idOrSlug, 10) }
      : { slug: idOrSlug };

  try {
    const product = await prisma.product.findFirst({
      where: { ...where, active: true },
      include: { images: { orderBy: { sort: "asc" } } },
    });

    if (!product) {
      return res.status(404).json({ error: "Produkt nicht gefunden" });
    }
    return res.json(mapProduct(product));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "Ungültige Produkt-ID" });
  }
  try {
    await prisma.product.delete({ where: { id } });
    return res.status(204).send();
  } catch (err: any) {
    return res
      .status(404)
      .json({ error: "Produkt nicht gefunden oder bereits gelöscht" });
  }
};

/**
 * GET /api/v1/products/:id/availability
 * Verfügbarkeit: stock - bestätigte OrderItems - reservierte CartItems
 */
export const getAvailability = async (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  if (!Number.isFinite(productId)) {
    return res.status(400).json({ error: "Ungültige Produkt-ID" });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        stock: true,
        orderItems: {
          where: { order: { status: "bestaetigt" } }, // enum OrderStatus
          select: { quantity: true },
        },
        cartItems: {
          select: { quantity: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Produkt nicht gefunden" });
    }

    const confirmed = product.orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const reserved = product.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const available = product.stock - confirmed - reserved;

    return res
      .status(200)
      .json({ stock: product.stock, confirmed, reserved, available });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
