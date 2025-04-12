import { Router } from 'express';
import {
  getAvailability,
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct
} from '../controllers/product.controller';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id/availability', getAvailability);
router.get('/:id', getProductById);
router.post('/', requireRole('admin', 'owner'),createProduct);
router.delete('/:id', requireRole('admin', 'owner'), deleteProduct);

export default router;
