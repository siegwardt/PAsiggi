import { Router } from "express";
import * as c from "./user.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireRole } from "../../middleware/requireRole";

const router = Router();

router.use(requireAuth, requireRole("admin"));
router.get("/", c.getAllUsers);
router.post("/", c.createUser);
router.get("/:id", c.getUserById);
router.put("/:id", c.updateUser);
router.delete("/:id", c.deleteUser);

export default router;
