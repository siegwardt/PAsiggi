import { Router } from "express";
import {
  getAvailability,
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} from "../controllers/product.controller";
import { validate } from "../middleware/validate";
import {
  productQuerySchema,
  idOrSlugSchema,
  createProductSchema,
} from "../schemas/products.schema";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.get("/", validate(productQuerySchema), getAllProducts);
router.get("/:id/availability", validate(idOrSlugSchema), getAvailability);
router.get("/:id", validate(idOrSlugSchema), getProductById);

router.post("/", requireRole("admin", "owner"), validate(createProductSchema), createProduct);
router.delete("/:id", requireRole("admin", "owner"), validate(idOrSlugSchema), deleteProduct);

export default router;
