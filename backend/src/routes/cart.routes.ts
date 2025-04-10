import { Router } from 'express';
import {
  getCart,
  addItem,
  removeItem,
  clearCart,
  checkout,
  updateItemQuantity
} from '../controllers/cart.controller';

const router = Router();

router.get('/', getCart);
router.post('/item', addItem);
router.put('/item/:itemId', updateItemQuantity);
router.delete('/item/:itemId', removeItem);
router.delete('/clear', clearCart);
router.post('/checkout', checkout);

export default router;
