// apps/backend/src/schemas/products.schema.ts
import { z } from "zod";

export const productQuerySchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).default(12),
    offset: z.coerce.number().int().min(0).default(0),
  }),
});

export const idOrSlugSchema = z.object({
  params: z.object({
    id: z.string().min(1), // numeric ID oder slug
  }),
});

export const createProductSchema = z
  .object({
    body: z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      category: z.string().min(1), // Prisma-Enum ProductCategory als string
      // entweder priceCents ODER price (EUR)
      priceCents: z.number().int().min(0).optional(),
      price: z.number().min(0).optional(),
      stock: z.number().int().min(0),
      imageUrl: z.string().url().optional(),
      images: z
        .array(
          z.object({
            url: z.string().min(1),
            alt: z.string().optional(),
            sort: z.number().int().optional(),
          })
        )
        .optional(),
      slug: z.string().min(1).optional(),
      active: z.boolean().optional(),
    }),
  })
  .refine(
    (d) =>
      typeof d.body.priceCents === "number" ||
      typeof d.body.price === "number",
    { path: ["body", "price"], message: "priceCents oder price (EUR) erforderlich" }
  );
