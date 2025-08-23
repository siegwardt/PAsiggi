import { Router } from "express";
import {
  getCart,
  addItem,
  removeItem,
  clearCart,
  updateItemQuantity,
  checkout,
} from "../controllers/cart.controller";
import { validate } from "../middleware/validate";
import { addItemSchema, updateItemSchema } from "../schemas/cart.schema";

const router = Router();

router.get("/", getCart);
router.post("/items", validate(addItemSchema), addItem);
router.patch("/items/:itemId", validate(updateItemSchema), updateItemQuantity);
router.delete("/items/:itemId", removeItem);
router.delete("/", clearCart);
router.post("/checkout", checkout);

export default router;
