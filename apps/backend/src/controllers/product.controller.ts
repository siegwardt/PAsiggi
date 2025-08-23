import { Request, Response } from "express";
import prisma from "../prisma";
import { toSlug } from "../utils/slug";

const toFilename = (s?: string | null) =>
  typeof s === "string" ? (s.split("/").pop() ?? s) : null;

const mapProduct = (p: any) => {
  const imgs = (p.images ?? []).slice().sort((a: any, b: any) => a.sort - b.sort);
  const cover = imgs[0]
    ? { url: imgs[0].filename, alt: imgs[0].alt ?? null }
    : (p.imageUrl ? { url: p.imageUrl, alt: null } : null);

  return {
    id: String(p.id),
    slug: p.slug ?? null,
    name: p.name,
    description: p.description ?? null,
    priceEUR: (p.priceCents ?? Math.round((p.pricePerDay ?? 0) * 100)) / 100,
    priceCents: p.priceCents ?? Math.round((p.pricePerDay ?? 0) * 100),
    category: p.category,
    stock: p.stock,
    active: !!p.active,
    cover,
    images: imgs.map((i: any) => ({
      url: i.filename,
      alt: i.alt ?? null,
    })),
    createdAt: p.createdAt?.toISOString?.() ?? p.createdAt,
    updatedAt: p.updatedAt?.toISOString?.() ?? p.updatedAt,
  };
};

/**
 * POST /api/v1/products
 * Body:
 *  - name: string (required)
 *  - category: ProductCategory (required)
 *  - priceCents?: number  ODER price?: number (EUR)
 *  - description?: string
 *  - stock: number (required)
 *  - imageUrl?: string (Dateiname ODER URL; wir speichern nur den Dateinamen)
 *  - images?: { filename: string; alt?: string; sort?: number }[]   // 👈 WICHTIG
 *  - slug?: string
 *  - active?: boolean
 */
export const createProduct = async (req: Request, res: Response) => {
  const {
    name, description, category,
    priceCents, price, pricePerDay,
    stock, imageUrl, images, slug, active,
  } = req.body as {
    name: string; description?: string; category: string;
    priceCents?: number; price?: number; pricePerDay?: number;
    stock: number; imageUrl?: string;
    images?: { url: string; alt?: string }[]; // ✅ nur url+alt
    slug?: string; active?: boolean;
  };

  if (!name || !category || typeof stock !== "number")
    return res.status(400).json({ error: "name, category, stock sind Pflichtfelder." });

  const cents =
    typeof priceCents === "number" ? Math.max(0, Math.round(priceCents)) :
    typeof price === "number"      ? Math.max(0, Math.round(price * 100)) :
    typeof pricePerDay === "number"? Math.max(0, Math.round(pricePerDay * 100)) :
    undefined;
  if (typeof cents !== "number")
    return res.status(400).json({ error: "priceCents (Int) oder price (EUR) wird benötigt." });

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description: description ?? null,
        category: category as any,
        pricePerDay: cents / 100,
        priceCents: cents,
        stock,
        imageUrl: toFilename(imageUrl), // Legacy single, nur Dateiname
        slug: slug ?? null,
        active: typeof active === "boolean" ? active : true,
        // ✅ wir vergeben sort intern automatisch nach Index
        images: images?.length
          ? {
              create: images.map((img, idx) => ({
                filename: toFilename(img.url) ?? "",
                alt: img.alt ?? null,
                sort: idx, // intern, aber nicht im API-Input
              })),
            }
          : undefined,
      },
      include: { images: true },
    });

    return res.status(201).json(mapProduct(product));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/v1/products?limit=12&offset=0
 */
export const getAllProducts = async (req: Request, res: Response) => {
  const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "12"), 10), 1), 100);
  const offset = Math.max(parseInt(String(req.query.offset ?? "0"), 10), 0);

  try {
    const [rows, total] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        include: { images: true },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.product.count({ where: { active: true } }),
    ]);

    return res.json({ items: rows.map(mapProduct), total, limit, offset });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/v1/products/:idOrSlug
 */
export const getProductById = async (req: Request, res: Response) => {
  const idOrSlug = req.params.id;
  const where = /^\d+$/.test(idOrSlug) ? { id: parseInt(idOrSlug, 10) } : { slug: idOrSlug };

  try {
    const product = await prisma.product.findFirst({
      where: { ...where, active: true },
      include: { images: true },
    });

    if (!product) return res.status(404).json({ error: "Produkt nicht gefunden" });
    return res.json(mapProduct(product));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "Ungültige Produkt-ID" });

  try {
    await prisma.product.delete({ where: { id } });
    return res.status(204).send();
  } catch (err: any) {
    return res.status(404).json({ error: "Produkt nicht gefunden oder bereits gelöscht" });
  }
};

/**
 * GET /api/v1/products/:id/availability
 */
export const getAvailability = async (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  if (!Number.isFinite(productId)) return res.status(400).json({ error: "Ungültige Produkt-ID" });

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        stock: true,
        orderItems: { where: { order: { status: "bestaetigt" } }, select: { quantity: true } },
        cartItems: { select: { quantity: true } },
      },
    });

    if (!product) return res.status(404).json({ error: "Produkt nicht gefunden" });

    const confirmed = product.orderItems.reduce((s, x) => s + x.quantity, 0);
    const reserved = product.cartItems.reduce((s, x) => s + x.quantity, 0);
    const available = product.stock - confirmed - reserved;

    return res.status(200).json({ stock: product.stock, confirmed, reserved, available });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "Ungültige Produkt-ID" });
  }

  const {
    name,
    description,
    category,
    price,
    priceCents,
    stock,
    active,
    images,
    slug, // <-- NEU
  } = req.body as {
    name?: string;
    description?: string | null;
    category?: string;
    price?: number;
    priceCents?: number;
    stock?: number;
    active?: boolean;
    images?: { url: string; alt?: string }[];
    slug?: string | null;
  };

  try {
    const cents =
      typeof priceCents === "number"
        ? Math.max(0, Math.round(priceCents))
        : typeof price === "number"
        ? Math.max(0, Math.round(price * 100))
        : undefined;

    // Slug vorbereiten (optional)
    let normalizedSlug: string | null | undefined = undefined;
    if (slug === null) {
      normalizedSlug = null;                     // explizit entfernen
    } else if (typeof slug === "string") {
      const s = toSlug(slug);
      if (!s) return res.status(400).json({ error: "Ungültiger Slug" });
      normalizedSlug = s;
      // Einzigartigkeit prüfen (außer eigenes Produkt)
      const existing = await prisma.product.findUnique({ where: { slug: s } });
      if (existing && existing.id !== id) {
        return res.status(409).json({ error: "Slug bereits vergeben" });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        category: category as any,
        stock,
        active,
        ...(cents !== undefined
          ? { priceCents: cents, pricePerDay: cents / 100 }
          : {}),
        ...(normalizedSlug !== undefined ? { slug: normalizedSlug } : {}),
        ...(images?.length
          ? {
              images: {
                create: images.map((i) => ({
                  filename: i.url,
                  alt: i.alt ?? null,
                })),
              },
            }
          : {}),
      },
      include: { images: { orderBy: { sort: "asc" } } },
    });

    return res.json(product);
  } catch (err: any) {
    // Prisma Unique-Fehler schön melden
    if (err?.code === "P2002" && err?.meta?.target?.includes("slug")) {
      return res.status(409).json({ error: "Slug bereits vergeben" });
    }
    return res.status(500).json({ error: err.message });
  }
};