import { Router } from "express";
import * as c from "./product.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireRole } from "../../middleware/requireRole";

const router = Router();

router.get("/", c.getAllProducts);
router.get("/:id", c.getProductById);

router.post("/", requireAuth, requireRole("admin"), c.createProduct);
router.put("/:id", requireAuth, requireRole("admin"), c.updateProduct);
router.delete("/:id", requireAuth, requireRole("admin"), c.deleteProduct);

export default router;
