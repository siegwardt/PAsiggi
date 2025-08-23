import { Router } from "express";
import {
  getAvailability,
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller";
import { validate } from "../middleware/validate";
import {
  productQuerySchema,
  idOrSlugSchema,
  createProductSchema,
} from "../schemas/products.schema";
import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";
import { updateProductSchema } from "../schemas/products.schema";

const router = Router();

router.get("/", validate(productQuerySchema), getAllProducts);
router.get("/:id/availability", validate(idOrSlugSchema), getAvailability);
router.get("/:id", validate(idOrSlugSchema), getProductById);

router.post(
  "/",
  requireAuth,
  requireRole("admin", "owner"),
  validate(createProductSchema),
  createProduct
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("admin", "owner"),
  validate(idOrSlugSchema),
  deleteProduct
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("admin", "owner"),
  validate(updateProductSchema),
  updateProduct
);

export default router;
