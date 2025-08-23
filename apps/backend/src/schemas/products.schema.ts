import { z } from "zod";

const filenameRegex = /^[\w.-]+\.(png|jpe?g|webp|gif)$/i;
const filenameOrUrl = z.union([
  z.string().regex(filenameRegex, "Erwarte Dateinamen wie uking-led.png"),
  z.string().url(),
]);

export const createProductSchema = z
  .object({
    body: z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      category: z.string().min(1),
      priceCents: z.number().int().min(0).optional(),
      price: z.number().min(0).optional(),        // EUR
      pricePerDay: z.number().min(0).optional(),  // EUR (Legacy)
      stock: z.number().int().min(0),

      imageUrl: filenameOrUrl.optional(),
      images: z.array(
        z.object({
          url: filenameOrUrl,
          alt: z.string().optional(),
        })
      ).optional(),

      slug: z.string().min(1).optional(),
      active: z.boolean().optional(),
    }),
  })
  .refine(
    (d) =>
      typeof d.body.priceCents === "number" ||
      typeof d.body.price === "number" ||
      typeof d.body.pricePerDay === "number",
    { path: ["body"], message: "priceCents oder price (EUR) oder pricePerDay (EUR) erforderlich" }
  );

export const productQuerySchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).default(12),
    offset: z.coerce.number().int().min(0).default(0),
  }),
});

export const idOrSlugSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});
