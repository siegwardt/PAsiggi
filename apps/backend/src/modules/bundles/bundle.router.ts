import { Router } from "express";
import * as controller from "./bundle.controller";

const router = Router();

router.get("/", controller.getAllBundles);
router.get("/:id", controller.getBundleById);
router.post("/", controller.createBundle);
router.put("/:id", controller.updateBundle);
router.delete("/:id", controller.deleteBundle);

export default router;
