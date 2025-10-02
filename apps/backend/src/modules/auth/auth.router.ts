import { Router } from "express";
import * as controller from "./auth.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "@/utils/asyncHandler";

const router = Router();

router.post("/login", asyncHandler(controller.login));
router.post("/register", asyncHandler(controller.register));
router.get("/me", requireAuth, asyncHandler(controller.me));

export default router;
