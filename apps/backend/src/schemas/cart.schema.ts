// apps/backend/src/schemas/cart.schema.ts
import { z } from "zod";

export const addItemSchema = z.object({
  body: z.object({
    productId: z.union([z.number().int(), z.string().min(1)]),
    quantity: z.number().int().min(1).default(1),
  }),
});

export const updateItemSchema = z.object({
  params: z.object({ itemId: z.coerce.number().int().min(1) }),
  body: z.object({ quantity: z.number().int().min(1) }),
});
