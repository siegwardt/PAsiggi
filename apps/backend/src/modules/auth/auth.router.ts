import { Router } from "express";
import * as controller from "./auth.controller";
import { requireAuth } from "../../middleware/requireAuth";

const router = Router();

router.post("/login", controller.login);
router.post("/register", controller.register);
router.get("/me", requireAuth, controller.me);

export default router;
